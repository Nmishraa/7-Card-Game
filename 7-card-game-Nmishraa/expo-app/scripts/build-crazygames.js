const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const expoAppDir = path.resolve(__dirname, '..');
const distDir = path.join(expoAppDir, 'dist');
const crazygamesDir = path.join(expoAppDir, 'crazygames-upload');
const zipOutApp = path.join(expoAppDir, 'crazygames-build.zip');
const zipOutRoot = path.resolve(expoAppDir, '..', '7-cards-least-crazygames.zip');

console.log('🚀 Starting CrazyGames Build Packaging...');
console.log(`Expo App Dir: ${expoAppDir}`);
console.log(`Dist Dir:     ${distDir}`);
console.log(`Output Dir:   ${crazygamesDir}`);

if (!fs.existsSync(distDir)) {
  console.error('❌ Error: dist/ directory does not exist. Run "npx expo export --platform web" first.');
  process.exit(1);
}

// 1. Locate Web JS Bundle in dist/_expo/static/js/web/
const jsWebDir = path.join(distDir, '_expo', 'static', 'js', 'web');
if (!fs.existsSync(jsWebDir)) {
  console.error(`❌ Error: JS directory not found at ${jsWebDir}`);
  process.exit(1);
}

const jsFiles = fs.readdirSync(jsWebDir).filter(f => f.startsWith('index-') && f.endsWith('.js'));
if (jsFiles.length === 0) {
  console.error('❌ Error: No index-*.js bundle found in dist/_expo/static/js/web/');
  process.exit(1);
}
const jsBundleName = jsFiles[0];
console.log(`📦 Found JS Web Bundle: ${jsBundleName}`);

// 2. Prepare crazygames-upload directory
if (fs.existsSync(crazygamesDir)) {
  fs.rmSync(crazygamesDir, { recursive: true, force: true });
}
fs.mkdirSync(crazygamesDir, { recursive: true });

// 3. Helper to copy directory recursively
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 4. Copy _expo, assets, and icons
console.log('📂 Copying assets and web bundle...');
copyDirSync(path.join(distDir, '_expo'), path.join(crazygamesDir, '_expo'));

if (fs.existsSync(path.join(distDir, 'assets'))) {
  copyDirSync(path.join(distDir, 'assets'), path.join(crazygamesDir, 'assets'));
}

if (fs.existsSync(path.join(distDir, 'favicon.ico'))) {
  fs.copyFileSync(path.join(distDir, 'favicon.ico'), path.join(crazygamesDir, 'favicon.ico'));
}

// 5. Generate pristine CrazyGames index.html
const cleanIndexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>7 Cards Least – Card Game</title>
    <link rel="icon" href="./favicon.ico" />

    <!-- Embedded Standalone Mode Flags -->
    <script>
      window.IS_CRAZYGAMES = true;
      window.__IS_EMBEDDED_GAME__ = true;
    </script>

    <style id="expo-reset">
      html, body {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: #0b5e28;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
        -webkit-user-select: none;
        overflow: hidden;
      }
      #root {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        max-height: 100vh;
        flex: 1;
        overflow: hidden;
      }
      :focus-visible {
        outline: 3px solid #38bdf8 !important;
        outline-offset: 2px !important;
      }
      #loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;
        background-color: #0b5e28;
        color: #ffffff;
      }
      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(255, 255, 255, 0.2);
        border-top-color: #fbbf24;
        border-radius: 50%;
        animation: spin 0.9s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div id="loading-container">
        <div class="spinner"></div>
        <p style="margin-top: 16px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">Loading 7 Cards Least...</p>
      </div>
    </div>
    <script src="./_expo/static/js/web/${jsBundleName}" defer></script>
  </body>
</html>
`;

fs.writeFileSync(path.join(crazygamesDir, 'index.html'), cleanIndexHtml, 'utf-8');
console.log('✅ Generated clean crazygames-upload/index.html');

// 6. Security & Policy Verification Audit
console.log('\n🔍 Running Policy & Standards Compliance Audit...');
const indexContent = fs.readFileSync(path.join(crazygamesDir, 'index.html'), 'utf-8');

const forbiddenPatterns = [
  { name: 'Google Tag Manager', regex: /googletagmanager/i },
  { name: 'Google Analytics', regex: /gtag|ga4/i },
  { name: 'Cookie Consent Modal', regex: /cookie-consent/i },
  { name: 'Service Worker Registration', regex: /serviceWorker|sw\.js/i },
  { name: 'External Domain Links', regex: /https?:\/\/cards\.gnanamai\.com/i },
  { name: 'External Schema / Breadcrumbs', regex: /schema\.org/i },
  { name: 'Absolute Asset Paths', regex: /src="\/(?!_expo|assets)/i }
];

let violationsCount = 0;
for (const check of forbiddenPatterns) {
  if (check.regex.test(indexContent)) {
    console.error(`❌ FAILED: Found prohibited pattern: ${check.name}`);
    violationsCount++;
  } else {
    console.log(`✅ PASSED: No ${check.name}`);
  }
}

if (violationsCount > 0) {
  console.error(`\n❌ Audit Failed with ${violationsCount} violations.`);
  process.exit(1);
}
console.log('✨ All compliance audits passed with 0 violations!\n');

// 7. Create ZIP Archives
console.log('📦 Creating compliant zip packages...');
try {
  // Zip crazygames-build.zip inside expo-app
  if (fs.existsSync(zipOutApp)) fs.unlinkSync(zipOutApp);
  execSync(`cd "${crazygamesDir}" && zip -r -q "${zipOutApp}" ./*`);
  console.log(`✅ Created: ${zipOutApp} (${(fs.statSync(zipOutApp).size / 1024 / 1024).toFixed(2)} MB)`);

  // Zip 7-cards-least-crazygames.zip in repository root
  if (fs.existsSync(zipOutRoot)) fs.unlinkSync(zipOutRoot);
  execSync(`cd "${crazygamesDir}" && zip -r -q "${zipOutRoot}" ./*`);
  console.log(`✅ Created: ${zipOutRoot} (${(fs.statSync(zipOutRoot).size / 1024 / 1024).toFixed(2)} MB)`);
} catch (zipErr) {
  console.error('❌ Error creating zip file:', zipErr);
  process.exit(1);
}

console.log('\n🎉 CrazyGames package successfully built and verified!');
