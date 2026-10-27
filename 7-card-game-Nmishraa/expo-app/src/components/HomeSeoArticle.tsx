import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SeoLink } from './SeoLink';

interface Props {
  onNavigate?: (route: string) => void;
}

export const HomeSeoArticle: React.FC<Props> = ({ onNavigate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.articleCard}>
        {/* Section Heading - Renders as <h2> in react-native-web to ensure exactly one <h1> per page */}
        <Text
          accessibilityRole="header"
          // @ts-ignore
          aria-level={2}
          style={styles.h1}
        >
          Play 7 Cards Least Online – Free Web Card Game
        </Text>

        <Text
          accessibilityRole="header"
          // @ts-ignore
          aria-level={3}
          style={styles.h2}
        >
          Instant browser card game with friends or AI bots. No downloads or installations required.
        </Text>

        {/* Section 1: How to Start Playing in Seconds */}
        <Text
          accessibilityRole="header"
          // @ts-ignore
          aria-level={3}
          style={styles.h3}
        >
          ⚡ How to Start Playing in Seconds
        </Text>
        <Text style={styles.paragraph}>
          7 Cards Least is playable immediately in any modern desktop or mobile browser with zero setup:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Enter Your Nickname:</Text> Type your preferred display name into the lobby card above.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Pick a Mode:</Text> Select Quick Match for instant matchmaking, create a private room with a 4-digit code in Multiplayer, or practice against bots in Solo vs AI.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Automatic Table Dealing:</Text> The game server deals 7 cards to each seat, turns up the center Table Joker, and manages turns, discards, and scoring in real time.
          </Text>
        </View>

        {/* Section 2: Game Modes */}
        <Text
          accessibilityRole="header"
          // @ts-ignore
          aria-level={3}
          style={styles.h3}
        >
          🎮 Game Modes: Solo, Multiplayer &amp; Daily Challenge
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Solo Practice Against AI:</Text> Practice discarding high-point face cards and testing call thresholds with no queue delay. Play against customizable computer bots in{' '}
            <SeoLink href="/play-against-ai" onNavigate={onNavigate}>
              <Text style={styles.linkText}>Singleplayer AI mode</Text>
            </SeoLink>.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Real-Time Multiplayer (2 to 8 Players):</Text> Host private games with friends and family using a simple 4-digit code or direct link in{' '}
            <SeoLink href="/multiplayer" onNavigate={onNavigate}>
              <Text style={styles.linkText}>Online Multiplayer mode</Text>
            </SeoLink>. Works seamlessly across phones, tablets, and desktop browsers.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Daily Puzzle Challenge:</Text> Test your card-shedding instincts with a daily seeded hand in{' '}
            <SeoLink href="/daily-challenge" onNavigate={onNavigate}>
              <Text style={styles.linkText}>Daily Challenge mode</Text>
            </SeoLink>. Discard optimal sets to achieve the lowest possible hand total.
          </Text>
        </View>

        {/* Section 3: Objective & Rules Directory */}
        <Text
          accessibilityRole="header"
          // @ts-ignore
          aria-level={3}
          style={styles.h3}
        >
          📖 Objective &amp; Complete Rules Guide
        </Text>
        <Text style={styles.paragraph}>
          The core objective of 7 Cards Least is to shed high point liabilities (Aces = 1, face cards = 10, Table Joker = 0) and declare <Text style={styles.boldGreen}>"LEAST!"</Text> when your hand sum drops to 10 points or lower. If you hold the lowest hand score at the table, you win with 0 penalty points!
        </Text>
        <Text style={styles.paragraph}>
          For in-depth tutorials, official scoring formulas, and strategy guides, explore:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            • <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate}><Text style={styles.linkText}>Official Rules &amp; Scoring Guide</Text></SeoLink>: Full breakdown of point values, relative score differences, and the 80-point wrong call penalty.
          </Text>
          <Text style={styles.bulletItem}>
            • <SeoLink href="/7-cards-least/how-to-play" onNavigate={onNavigate}><Text style={styles.linkText}>Step-by-Step How to Play</Text></SeoLink>: Beginner walkthrough covering multi-card set discarding, drawing, and Match &amp; Skip shortcuts.
          </Text>
          <Text style={styles.bulletItem}>
            • <SeoLink href="/7-cards-least/strategy" onNavigate={onNavigate}><Text style={styles.linkText}>Winning Strategy &amp; Tactics</Text></SeoLink>: Advanced discard order, tracking opponents' pickups, and optimal declaration windows.
          </Text>
          <Text style={styles.bulletItem}>
            • <SeoLink href="/strategy-lab" onNavigate={onNavigate}><Text style={styles.linkText}>Interactive Strategy Lab</Text></SeoLink> &amp; <SeoLink href="/score-calculator" onNavigate={onNavigate}><Text style={styles.linkText}>Score Calculator</Text></SeoLink>: Test hands and calculate point totals with immediate visual feedback.
          </Text>
        </View>

        {/* Quick Navigation Cluster */}
        <View style={styles.navCluster}>
          <SeoLink href="/" onNavigate={onNavigate}><Text style={styles.navLink}>Play Online</Text></SeoLink>
          <Text style={styles.navSep}>|</Text>
          <SeoLink href="/7-cards-least" onNavigate={onNavigate}><Text style={styles.navLink}>7 Cards Least Guide</Text></SeoLink>
          <Text style={styles.navSep}>|</Text>
          <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate}><Text style={styles.navLink}>Official Rules</Text></SeoLink>
          <Text style={styles.navSep}>|</Text>
          <SeoLink href="/7-cards-least/how-to-play" onNavigate={onNavigate}><Text style={styles.navLink}>How to Play</Text></SeoLink>
          <Text style={styles.navSep}>|</Text>
          <SeoLink href="/7-cards-least/strategy" onNavigate={onNavigate}><Text style={styles.navLink}>Strategy &amp; Tips</Text></SeoLink>
          <Text style={styles.navSep}>|</Text>
          <SeoLink href="/multiplayer" onNavigate={onNavigate}><Text style={styles.navLink}>Multiplayer Mode</Text></SeoLink>
          <Text style={styles.navSep}>|</Text>
          <SeoLink href="/daily-challenge" onNavigate={onNavigate}><Text style={styles.navLink}>Daily Challenge</Text></SeoLink>
          <Text style={styles.navSep}>|</Text>
          <SeoLink href="/strategy-lab" onNavigate={onNavigate}><Text style={styles.navLink}>Strategy Lab</Text></SeoLink>
          <Text style={styles.navSep}>|</Text>
          <SeoLink href="/score-calculator" onNavigate={onNavigate}><Text style={styles.navLink}>Score Calculator</Text></SeoLink>
          <Text style={styles.navSep}>|</Text>
          <SeoLink href="/play-against-ai" onNavigate={onNavigate}><Text style={styles.navLink}>Play Against AI</Text></SeoLink>
          <Text style={styles.navSep}>|</Text>
          <SeoLink href="/demo" onNavigate={onNavigate}><Text style={styles.navLink}>Gameplay Demo</Text></SeoLink>
          <Text style={styles.navSep}>|</Text>
          <SeoLink href="/7-cards-least/faq" onNavigate={onNavigate}><Text style={styles.navLink}>FAQ</Text></SeoLink>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  articleCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  h1: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },
  h2: {
    fontSize: 15,
    fontWeight: '600',
    color: '#38bdf8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  h3: {
    fontSize: 17,
    fontWeight: '700',
    color: '#38bdf8',
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#cbd5e1',
    marginBottom: 14,
  },
  bold: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  boldWhite: {
    fontWeight: '700',
    color: '#ffffff',
  },
  boldGreen: {
    fontWeight: '800',
    color: '#34d399',
  },
  italic: {
    fontStyle: 'italic',
    color: '#38bdf8',
  },
  bulletList: {
    marginLeft: 8,
    marginBottom: 16,
  },
  bulletItem: {
    fontSize: 13.5,
    lineHeight: 22,
    color: '#94a3b8',
    marginBottom: 6,
  },
  linkText: {
    color: '#38bdf8',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  navCluster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navLink: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: 'bold',
    marginHorizontal: 6,
    marginVertical: 4,
  },
  navSep: {
    color: 'rgba(255, 255, 255, 0.25)',
    fontSize: 12,
  },
});
