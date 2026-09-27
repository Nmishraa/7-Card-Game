import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

export const GamePreviewSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmall = width < 480;

  return (
    <View style={styles.container}>
      {/* Header Badge & Title */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.previewTitle}>🎮 Game Preview</Text>
          <Text style={styles.previewSubtitle}>Real-time Table Interface</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveBadgeText}>Live Match Preview</Text>
        </View>
      </View>

      {/* Main Showcase Showcase Frame */}
      <View style={styles.gameFrame}>
        {/* Mahogany Outer Rail */}
        <View style={styles.tableRailOuter}>
          <View style={styles.tableRailInner}>
            {/* Felt Board Table */}
            <View style={styles.feltTable}>
              <View style={styles.feltSeam} />

              {/* 1. Header Bar inside Game */}
              <View style={styles.gameHeaderBar}>
                <View style={styles.gameRoundBadge}>
                  <Text style={styles.gameRoundBadgeText}>RND 1/5</Text>
                </View>

                <View style={styles.gameHeaderRight}>
                  <View style={styles.gameTimerBadge}>
                    <Text style={styles.gameTimerText}>⏱️ 0:59</Text>
                  </View>
                  {!isSmall && (
                    <View style={styles.gameIconBtn}>
                      <Text style={styles.gameIconBtnText}>🔊 Sound On</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* 2. Live Scoreboard (Top Right Overlay) */}
              <View style={[styles.scoreCard, isSmall && styles.scoreCardSmall]}>
                <View style={styles.scoreHeader}>
                  <Text style={styles.scoreColPlayer}>PLAYER</Text>
                  <Text style={styles.scoreColVal}>SCORE</Text>
                </View>
                <View style={[styles.scoreRow, styles.scoreRowActive]}>
                  <Text style={styles.scoreNameActive} numberOfLines={1}>▶ You (Guest)</Text>
                  <Text style={styles.scoreValActive}>0</Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreName} numberOfLines={1}>AlphaBot 🤖</Text>
                  <Text style={styles.scoreVal}>12</Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreName} numberOfLines={1}>BetaBot 🤖</Text>
                  <Text style={styles.scoreVal}>24</Text>
                </View>
              </View>

              {/* 3. Opponents Around Table */}
              {/* Top Center Opponent */}
              <View style={styles.opponentTop}>
                <View style={styles.avatarBoxActive}>
                  <Text style={styles.avatarText}>A</Text>
                  <View style={styles.cardBadge}><Text style={styles.cardBadgeText}>7</Text></View>
                </View>
                <View style={styles.opponentLabel}>
                  <Text style={styles.opponentName}>AlphaBot 🤖</Text>
                </View>
              </View>

              {/* Left Opponent */}
              {!isSmall && (
                <View style={styles.opponentLeft}>
                  <View style={styles.avatarBox}>
                    <Text style={styles.avatarText}>B</Text>
                    <View style={styles.cardBadge}><Text style={styles.cardBadgeText}>7</Text></View>
                  </View>
                  <View style={styles.opponentLabel}>
                    <Text style={styles.opponentName}>BetaBot 🤖</Text>
                  </View>
                </View>
              )}

              {/* 4. Center Piles (Joker, Deck, Discard) */}
              <View style={styles.centerArea}>
                <View style={styles.pilesRow}>
                  {/* Joker Card */}
                  <View style={styles.pileCol}>
                    <Text style={styles.pileLabel}>JOKER</Text>
                    <View style={[styles.miniCard, styles.jokerGlow]}>
                      <Text style={styles.jokerBadge}>★ JOKER</Text>
                      <Text style={[styles.cardRank, { color: '#e11d48' }]}>7</Text>
                      <Text style={[styles.cardSuit, { color: '#e11d48' }]}>♥</Text>
                      <View style={styles.cardCornerBottom}>
                        <Text style={[styles.cardRankSmall, { color: '#e11d48' }]}>7</Text>
                      </View>
                    </View>
                  </View>

                  {/* Deck with Stacked 3D Depth */}
                  <View style={styles.pileCol}>
                    <Text style={styles.pileLabel}>DECK</Text>
                    <View style={styles.deckStackWrapper}>
                      <View style={[styles.deckCardBack, styles.deckLayer2]} />
                      <View style={[styles.deckCardBack, styles.deckLayer1]} />
                      <View style={styles.deckCardBack}>
                        <View style={styles.cardPattern} />
                      </View>
                    </View>
                  </View>

                  {/* Discard Pile with Overlapping Discards */}
                  <View style={styles.pileCol}>
                    <Text style={styles.pileLabel}>DISCARD</Text>
                    <View style={styles.discardStackWrapper}>
                      <View style={[styles.miniCard, styles.discardUnderCard]}>
                        <Text style={[styles.cardRank, { color: '#e11d48' }]}>9</Text>
                        <Text style={[styles.cardSuit, { color: '#e11d48' }]}>♦</Text>
                      </View>
                      <View style={styles.miniCard}>
                        <Text style={[styles.cardRank, { color: '#111' }]}>K</Text>
                        <Text style={[styles.cardSuit, { color: '#111' }]}>♠</Text>
                        <View style={styles.cardCornerBottom}>
                          <Text style={[styles.cardRankSmall, { color: '#111' }]}>K</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Turn Alert Banner */}
                <View style={styles.turnBanner}>
                  <Text style={styles.turnBannerText}>⚡ YOUR TURN: DISCARD!</Text>
                </View>
              </View>

              {/* 5. Player Dock & Fanned Cards in Hand */}
              <View style={styles.playerDock}>
                <View style={styles.dockActionRow}>
                  <View style={styles.discardBtn}>
                    <Text style={styles.discardBtnText}>Discard (1)</Text>
                  </View>
                  <View style={styles.leastBtn}>
                    <Text style={styles.leastBtnText}>Least!</Text>
                  </View>
                </View>

                {/* Hand Cards Fanned out naturally */}
                <View style={styles.handRow}>
                  {[
                    { rank: 'A', suit: '♦', isRed: true, selected: false, rot: '-5deg' },
                    { rank: '2', suit: '♥', isRed: true, selected: true, rot: '-2deg' },
                    { rank: '4', suit: '♥', isRed: true, selected: false, rot: '0deg' },
                    { rank: '5', suit: '♠', isRed: false, selected: false, rot: '2deg' },
                    { rank: '9', suit: '♣', isRed: false, selected: false, rot: '4deg' },
                    { rank: '10', suit: '♦', isRed: true, selected: false, rot: '6deg' },
                    { rank: 'J', suit: '♠', isRed: false, selected: false, rot: '8deg' },
                  ].slice(0, isSmall ? 5 : 7).map((c, idx) => (
                    <View 
                      key={idx} 
                      style={[
                        styles.handCard, 
                        c.selected && styles.handCardSelected,
                        { marginLeft: idx === 0 ? 0 : (isSmall ? -10 : -14), transform: [{ rotate: c.rot }, { translateY: c.selected ? -14 : 0 }] }
                      ]}
                    >
                      <Text style={[styles.handCardRank, { color: c.isRed ? '#e11d48' : '#111' }]}>{c.rank}</Text>
                      <Text style={[styles.handCardSuit, { color: c.isRed ? '#e11d48' : '#111' }]}>{c.suit}</Text>
                      <View style={styles.cardCornerBottom}>
                        <Text style={[styles.handCardRankSmall, { color: c.isRed ? '#e11d48' : '#111' }]}>{c.rank}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Caption under screenshot */}
      <Text style={styles.captionText}>
        See the game. Take your turn. Play 7 Cards online.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 24,
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  previewTitle: {
    color: '#38bdf8',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  previewSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  liveBadgeText: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  /* Outer Showcase Frame */
  gameFrame: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.45)',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 20,
    backgroundColor: '#0a1628',
  },
  tableRailOuter: {
    backgroundColor: '#3d1400',
    padding: 12,
  },
  tableRailInner: {
    backgroundColor: '#5a1a00',
    padding: 4,
    borderRadius: 18,
  },
  feltTable: {
    backgroundColor: '#076324',
    borderRadius: 16,
    padding: 12,
    position: 'relative',
    minHeight: 340,
    justifyContent: 'space-between',
  },
  feltSeam: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 10,
    borderColor: 'rgba(0,0,0,0.18)',
  },

  /* 1. Header Bar */
  gameHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  gameRoundBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.4)',
  },
  gameRoundBadgeText: {
    color: '#facc15',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  gameHeaderRight: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  gameTimerBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
  },
  gameTimerText: {
    color: '#38bdf8',
    fontWeight: '900',
    fontSize: 13,
  },
  gameIconBtn: {
    backgroundColor: 'rgba(51, 65, 85, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  gameIconBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* 2. Live Scoreboard Overlay */
  scoreCard: {
    position: 'absolute',
    right: 12,
    top: 44,
    zIndex: 30,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    padding: 8,
    minWidth: 160,
  },
  scoreCardSmall: {
    minWidth: 130,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 4,
    marginBottom: 4,
  },
  scoreColPlayer: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
    flex: 1,
    letterSpacing: 0.5,
  },
  scoreColVal: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'right',
    minWidth: 40,
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 6,
    marginVertical: 1,
  },
  scoreRowActive: {
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
    borderLeftWidth: 3,
    borderLeftColor: '#facc15',
  },
  scoreName: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  scoreNameActive: {
    color: '#facc15',
    fontWeight: '900',
    fontSize: 11,
  },
  scoreVal: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'right',
  },
  scoreValActive: {
    color: '#facc15',
    fontWeight: '900',
    fontSize: 12,
    minWidth: 40,
    textAlign: 'right',
  },

  /* 3. Opponent Avatars */
  opponentTop: {
    alignItems: 'center',
    marginTop: -4,
  },
  opponentLeft: {
    position: 'absolute',
    left: 14,
    top: 105,
    alignItems: 'center',
  },
  avatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    position: 'relative',
  },
  avatarBoxActive: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4ade80',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  cardBadgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '900',
  },
  opponentLabel: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 3,
  },
  opponentName: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  /* 4. Center Area & Piles */
  centerArea: {
    alignItems: 'center',
    marginVertical: 14,
  },
  pilesRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  pileCol: {
    alignItems: 'center',
  },
  pileLabel: {
    color: '#facc15',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  miniCard: {
    width: 44,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  jokerGlow: {
    borderColor: '#fbbf24',
    borderWidth: 2,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  jokerBadge: {
    fontSize: 7,
    color: '#d97706',
    fontWeight: '900',
    marginBottom: 1,
  },
  cardRank: {
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
  cardSuit: {
    fontSize: 14,
    lineHeight: 16,
  },
  cardCornerBottom: {
    position: 'absolute',
    right: 3,
    bottom: 2,
  },
  cardRankSmall: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  handCardRankSmall: {
    fontSize: 8,
    fontWeight: 'bold',
  },

  /* Stacked 3D Deck */
  deckStackWrapper: {
    position: 'relative',
    width: 44,
    height: 60,
  },
  deckCardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 44,
    height: 60,
    backgroundColor: '#1e3a8a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffffff',
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deckLayer1: {
    top: -2,
    left: -2,
  },
  deckLayer2: {
    top: -4,
    left: -4,
  },
  cardPattern: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },

  /* Discard Stack Wrapper */
  discardStackWrapper: {
    position: 'relative',
    width: 44,
    height: 60,
  },
  discardUnderCard: {
    position: 'absolute',
    top: 3,
    left: -8,
    transform: [{ rotate: '-10deg' }],
  },

  /* Turn Alert Banner */
  turnBanner: {
    backgroundColor: 'rgba(234, 179, 8, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#facc15',
    shadowColor: '#facc15',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  turnBannerText: {
    color: '#facc15',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },

  /* 5. Player Dock & Hand */
  playerDock: {
    alignItems: 'center',
    marginTop: 8,
  },
  dockActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  discardBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f87171',
  },
  discardBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  leastBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  leastBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  handRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  handCard: {
    width: 46,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    position: 'relative',
  },
  handCardSelected: {
    borderColor: '#facc15',
    borderWidth: 2.5,
    shadowColor: '#facc15',
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  handCardRank: {
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 17,
  },
  handCardSuit: {
    fontSize: 13,
    lineHeight: 14,
  },

  /* Caption */
  captionText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
});
