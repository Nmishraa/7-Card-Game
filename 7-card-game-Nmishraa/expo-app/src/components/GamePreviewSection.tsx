import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

interface Props {
  style?: any;
}

export const GamePreviewSection: React.FC<Props> = ({ style }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmall = width < 480;

  return (
    <View style={[styles.container, style]}>

      {/* Header Badge & Title */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.previewTitle}>🎮 Game Preview</Text>
          <Text style={styles.previewSubtitle}>Real-Time 7 Cards Table Interface</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveBadgeText}>Live Match Preview</Text>
        </View>
      </View>

      {/* Main Showcase Frame with constrained width & aspect ratio */}
      <View style={styles.gameFrame}>
        {/* Wood Outer Rail */}
        <View style={styles.tableRailOuter}>
          <View style={styles.tableRailInner}>
            {/* Felt Board Table */}
            <View style={styles.feltTable}>
              <View style={styles.feltSeam} />

              {/* 1. Header Bar inside Game */}
              <View style={styles.gameHeaderBar}>
                <View style={styles.gameRoundBadge}>
                  <Text style={styles.gameRoundBadgeText}>ROUND 1/5</Text>
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

              {/* 2. Middle Row: Opponents, Center Piles, Scoreboard */}
              <View style={styles.tableMiddleRow}>
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

                {/* Center Content: Top Opponent + Piles + Turn Banner */}
                <View style={styles.centerSection}>
                  {/* Top Opponent */}
                  <View style={styles.opponentTop}>
                    <View style={styles.avatarBoxActive}>
                      <Text style={styles.avatarText}>A</Text>
                      <View style={styles.cardBadge}><Text style={styles.cardBadgeText}>7</Text></View>
                    </View>
                    <View style={styles.opponentLabelActive}>
                      <Text style={styles.opponentNameActive}>AlphaBot 🤖 (Turn)</Text>
                    </View>
                  </View>

                  {/* Piles Row */}
                  <View style={styles.pilesRow}>
                    {/* Joker Card */}
                    <View style={styles.pileCol}>
                      <Text style={styles.pileLabel}>JOKER</Text>
                      <View style={[styles.miniCard, styles.jokerGlow]}>
                        <Text style={styles.jokerBadge}>★ JOKER</Text>
                        <Text style={[styles.cardRank, { color: '#e11d48' }]}>7</Text>
                        <Text style={[styles.cardSuit, { color: '#e11d48' }]}>♥</Text>
                        <View style={styles.cardCornerBottom}>
                          <Text style={[styles.cardRankSmall, { color: '#e11d48' }]}>7♥</Text>
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

                    {/* Discard Pile */}
                    <View style={styles.pileCol}>
                      <Text style={styles.pileLabel}>DISCARD</Text>
                      <View style={styles.discardStackWrapper}>
                        <View style={[styles.miniCard, styles.discardUnderCard]}>
                          <Text style={[styles.cardRank, { color: '#e11d48' }]}>9</Text>
                          <Text style={[styles.cardSuit, { color: '#e11d48' }]}>♦</Text>
                        </View>
                        <View style={styles.miniCard}>
                          <Text style={[styles.cardRank, { color: '#0f172a' }]}>K</Text>
                          <Text style={[styles.cardSuit, { color: '#0f172a' }]}>♠</Text>
                          <View style={styles.cardCornerBottom}>
                            <Text style={[styles.cardRankSmall, { color: '#0f172a' }]}>K♠</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Turn Action Banner */}
                  <View style={styles.turnBanner}>
                    <Text style={styles.turnBannerText}>⚡ YOUR TURN: DISCARD OR LEAST!</Text>
                  </View>
                </View>

                {/* Scoreboard Right Overlay */}
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
              </View>

              {/* 3. Bottom Player Dock & Cards in Hand */}
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
                    { rank: 'A', suit: '♦', isRed: true, selected: false, rot: '-6deg' },
                    { rank: '2', suit: '♥', isRed: true, selected: true, rot: '-3deg' },
                    { rank: '4', suit: '♥', isRed: true, selected: false, rot: '0deg' },
                    { rank: '5', suit: '♠', isRed: false, selected: false, rot: '3deg' },
                    { rank: '9', suit: '♣', isRed: false, selected: false, rot: '6deg' },
                    { rank: '10', suit: '♦', isRed: true, selected: false, rot: '9deg' },
                    { rank: 'J', suit: '♠', isRed: false, selected: false, rot: '12deg' },
                  ].slice(0, isSmall ? 5 : 7).map((c, idx) => (
                    <View 
                      key={idx} 
                      style={[
                        styles.handCard, 
                        c.selected && styles.handCardSelected,
                        { marginLeft: idx === 0 ? 0 : (isSmall ? -10 : -14), transform: [{ rotate: c.rot }, { translateY: c.selected ? -16 : 0 }] }
                      ]}
                    >
                      <Text style={[styles.handCardRank, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.rank}</Text>
                      <Text style={[styles.handCardSuit, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.suit}</Text>
                      <View style={styles.cardCornerBottom}>
                        <Text style={[styles.handCardRankSmall, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.rank}{c.suit}</Text>
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
    maxWidth: 780,
    alignSelf: 'center',
    marginVertical: 24,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  previewTitle: {
    color: '#38bdf8',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  previewSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
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
    borderWidth: 1.5,
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
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.5)',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 20,
    backgroundColor: '#0a1628',
  },
  tableRailOuter: {
    backgroundColor: '#351203',
    padding: 10,
  },
  tableRailInner: {
    backgroundColor: '#4d1904',
    padding: 4,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  feltTable: {
    backgroundColor: '#065f28',
    borderRadius: 16,
    padding: 14,
    position: 'relative',
    minHeight: 420,
    justifyContent: 'space-between',
  },
  feltSeam: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 8,
    borderColor: 'rgba(0,0,0,0.22)',
  },

  /* 1. Header Bar */
  gameHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    marginBottom: 8,
  },
  gameRoundBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#facc15',
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
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  gameIconBtnText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* 2. Middle Row */
  tableMiddleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    paddingVertical: 6,
  },

  /* Left Opponent */
  opponentLeft: {
    alignItems: 'center',
    width: 90,
  },

  /* Center Section */
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opponentTop: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatarBoxActive: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#4ade80',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 10,
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    width: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  cardBadgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '900',
  },
  opponentLabel: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  opponentName: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: 'bold',
  },
  opponentLabelActive: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  opponentNameActive: {
    color: '#4ade80',
    fontSize: 11,
    fontWeight: 'bold',
  },

  /* Center Piles */
  pilesRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  pileCol: {
    alignItems: 'center',
  },
  pileLabel: {
    color: '#facc15',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 5,
    letterSpacing: 0.6,
  },
  miniCard: {
    width: 50,
    height: 68,
    backgroundColor: '#ffffff',
    borderRadius: 7,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  jokerGlow: {
    borderColor: '#fbbf24',
    borderWidth: 2,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  jokerBadge: {
    fontSize: 7,
    color: '#d97706',
    fontWeight: '900',
    marginBottom: 1,
  },
  cardRank: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
  },
  cardSuit: {
    fontSize: 16,
    lineHeight: 18,
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
    width: 50,
    height: 68,
  },
  deckCardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 68,
    backgroundColor: '#1e3a8a',
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },
  deckLayer1: {
    top: -2.5,
    left: -2.5,
  },
  deckLayer2: {
    top: -5,
    left: -5,
  },
  cardPattern: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  /* Discard Stack */
  discardStackWrapper: {
    position: 'relative',
    width: 50,
    height: 68,
  },
  discardUnderCard: {
    position: 'absolute',
    top: 3,
    left: -10,
    transform: [{ rotate: '-12deg' }],
  },

  /* Turn Alert Banner */
  turnBanner: {
    backgroundColor: 'rgba(234, 179, 8, 0.22)',
    paddingHorizontal: 16,
    paddingVertical: 6,
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

  /* Live Scoreboard Overlay */
  scoreCard: {
    width: 140,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  scoreCardSmall: {
    width: 120,
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
    minWidth: 36,
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
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: 36,
    textAlign: 'right',
  },
  scoreValActive: {
    color: '#facc15',
    fontWeight: '900',
    fontSize: 12,
    minWidth: 36,
    textAlign: 'right',
  },

  /* 3. Player Dock & Hand */
  playerDock: {
    alignItems: 'center',
    marginTop: 10,
  },
  dockActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  discardBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f87171',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  discardBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  leastBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4ade80',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  leastBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  handRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  handCard: {
    width: 52,
    height: 72,
    backgroundColor: '#ffffff',
    borderRadius: 7,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    position: 'relative',
  },
  handCardSelected: {
    borderColor: '#facc15',
    borderWidth: 2.5,
    shadowColor: '#facc15',
    shadowOpacity: 0.85,
    shadowRadius: 10,
  },
  handCardRank: {
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 19,
  },
  handCardSuit: {
    fontSize: 15,
    lineHeight: 16,
  },

  /* Caption */
  captionText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
});
