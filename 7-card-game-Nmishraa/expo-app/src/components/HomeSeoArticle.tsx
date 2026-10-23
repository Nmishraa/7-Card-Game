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
          The ultimate online portal for 7 Cards Least rules, strategy, and real-time multiplayer card games.
        </Text>

        <Text style={styles.paragraph}>
          Welcome to <Text style={styles.bold}>7 Cards Least</Text>! Play real-time multiplayer with friends or practice solo against computer AI. The objective is to achieve the <Text style={styles.italic}>lowest hand score</Text> by discarding high-value cards, forming sets or suited runs, and declaring <Text style={styles.boldGreen}>LEAST!</Text> when your hand total drops to 10 points or less.
        </Text>

        {/* Section 1: Scoring */}
        <Text
          accessibilityRole="header"
          // @ts-ignore
          aria-level={3}
          style={styles.h3}
        >
          🎴 Card Point Values &amp; Scoring Overview
        </Text>
        <Text style={styles.paragraph}>
          Understanding point values is critical for effective card shedding. Every card remaining in your hand at the end of a round adds to your round score penalty:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Ace (A):</Text> 1 Point (the lowest standard card value).
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Number Cards (2 to 10):</Text> Face Value (2–10 points each).
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Face Cards (J, Q, K):</Text> 10 Points each (high liability cards to shed early).
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Table Joker Wildcard:</Text> 0 Points (determined by the face-up card during table setup).
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Least Declaration Threshold:</Text> Total hand score must be 10 points or less to call Least.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>False Call Penalty:</Text> An 80-point penalty is assessed if an opponent holds an equal or lower score upon reveal.
          </Text>
        </View>

        {/* Section 2: Features & Modes */}
        <Text
          accessibilityRole="header"
          // @ts-ignore
          aria-level={3}
          style={styles.h3}
        >
          🎮 Flexible Game Modes &amp; Features
        </Text>
        <Text style={styles.paragraph}>
          Whether you want to play instant solo matches or host private games with friends, cards.gnanamai.com provides seamless cross-platform gameplay:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Real-Time Online Multiplayer:</Text> Create private room lobbies with unique 4-digit codes, share WhatsApp invite links, and play with 2 to 8 real players in{' '}
            <SeoLink href="/multiplayer" onNavigate={onNavigate}>
              <Text style={styles.linkText}>online multiplayer mode</Text>
            </SeoLink>.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Singleplayer AI Practice:</Text> Play against 1 to 7 smart computer bots with zero wait times in{' '}
            <SeoLink href="/play-against-ai" onNavigate={onNavigate}>
              <Text style={styles.linkText}>play against AI mode</Text>
            </SeoLink>.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Custom Match Rules:</Text> Adjust round counts, turn timers (60-second limit or infinite), and felt table themes.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Interactive Companion Tools:</Text> Test scenarios in the{' '}
            <SeoLink href="/strategy-lab" onNavigate={onNavigate}>
              <Text style={styles.linkText}>Strategy Lab</Text>
            </SeoLink>, calculate scores in the{' '}
            <SeoLink href="/score-calculator" onNavigate={onNavigate}>
              <Text style={styles.linkText}>Score Calculator</Text>
            </SeoLink>, and tackle the daily puzzle in{' '}
            <SeoLink href="/daily-challenge" onNavigate={onNavigate}>
              <Text style={styles.linkText}>Daily Challenge</Text>
            </SeoLink>.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.boldWhite}>Comprehensive Guides:</Text> Master game details with our{' '}
            <SeoLink href="/7-cards-least" onNavigate={onNavigate}>
              <Text style={styles.linkText}>7 Cards Least Guide</Text>
            </SeoLink>, review the{' '}
            <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate}>
              <Text style={styles.linkText}>official rules</Text>
            </SeoLink>, read the{' '}
            <SeoLink href="/7-cards-least/how-to-play" onNavigate={onNavigate}>
              <Text style={styles.linkText}>how to play tutorial</Text>
            </SeoLink>, explore{' '}
            <SeoLink href="/7-cards-least/strategy" onNavigate={onNavigate}>
              <Text style={styles.linkText}>winning strategies</Text>
            </SeoLink>, or check out our{' '}
            <SeoLink href="/7-cards-least/faq" onNavigate={onNavigate}>
              <Text style={styles.linkText}>frequently asked questions</Text>
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
