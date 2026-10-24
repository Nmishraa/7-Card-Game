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
          Comprehensive Guide &amp; Official Rules for 7 Cards Least
        </Text>

        <Text
          accessibilityRole="header"
          // @ts-ignore
          aria-level={3}
          style={styles.h2}
        >
          A tactical low-hand card shedding game where the goal is to finish with the lowest score at the table.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>7 Cards Least</Text> is an indie card shedding game built around calculated risk, card deduction, and timing. Instead of trying to build high-value tricks or meld points, each player is dealt 7 cards and works to shed heavy liabilities. When you calculate that your hand sum has dropped to 10 points or less, you can declare <Text style={styles.boldGreen}>"LEAST!"</Text> on your turn. If your hand is strictly lower than every opponent, you take 0 penalty points; but if an opponent ties or holds a lower score, you take an <Text style={styles.bold}>80-point penalty</Text>.
        </Text>

        {/* Section 1: How Scoring Works */}
        <Text
          accessibilityRole="header"
          // @ts-ignore
          aria-level={3}
          style={styles.h3}
        >
          🎴 Card Values, Relative Scoring &amp; Penalties
        </Text>
        <Text style={styles.paragraph}>
          In 7 Cards Least, card ranks determine how fast you can safely reach declaring range:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Number Cards (2 to 10):</Text> Worth their exact face value (2–10 points).
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Face Cards (J, Q, K):</Text> Flat 10 points each. Unmatched face cards are your biggest early liability.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Ace (A):</Text> 1 Point. Low anchor cards that make ideal sequences like A-2-3.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Table Joker (0 Points):</Text> At round setup, the dealer flips one card into the center. Any card matching that rank—regardless of suit—counts as 0 points for the entire round.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Relative Difference Scoring:</Text> When a caller wins, opponents take penalty points equal only to the difference (their hand score minus the winning score). You are not penalized your full hand score unless the winner held 0 points.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>The 80-Point Blunder:</Text> The caller must strictly beat every opponent. In a tie or loss, the caller receives an 80-point penalty, while the true lowest player wins with 0 points.
          </Text>
        </View>

        {/* Section 2: Turn Flow & How to Play */}
        <Text
          accessibilityRole="header"
          // @ts-ignore
          aria-level={3}
          style={styles.h3}
        >
          🕹️ How a Turn Works &amp; How to Start Playing
        </Text>
        <Text style={styles.paragraph}>
          Each turn follows a clean, tactical loop:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>1. Discard Phase:</Text> Play a single card, a matching set of 2+ cards of the same rank (e.g. 8♠ 8♦), or a suited run of 3+ consecutive cards (e.g. 5♣ 6♣ 7♣).
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>2. Match &amp; Skip Shortcut:</Text> If your discard matches the rank currently on top of the discard pile, your turn ends immediately without drawing! Your hand size permanently shrinks by one card.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>3. Draw Phase:</Text> If not skipped, draw 1 card from either the face-down deck or the face-up discard pile. If a drawn deck card matches your discard rank, it drops immediately to the pile.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>4. Calling Least:</Text> Before discarding on your turn, if your total hand score is 10 points or fewer, tap "LEAST!" to stop the round and trigger the showdown.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Multiplayer &amp; Solo AI:</Text> Jump into a game using Quick Match above, practice solo against computer bots in{' '}
            <SeoLink href="/play-against-ai" onNavigate={onNavigate}>
              <Text style={styles.linkText}>AI mode</Text>
            </SeoLink>, or create private lobbies with WhatsApp invites in{' '}
            <SeoLink href="/multiplayer" onNavigate={onNavigate}>
              <Text style={styles.linkText}>multiplayer mode</Text>
            </SeoLink>.
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
