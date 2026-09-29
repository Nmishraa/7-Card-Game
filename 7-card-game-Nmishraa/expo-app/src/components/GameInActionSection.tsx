import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, useWindowDimensions } from 'react-native';

interface ScreenshotData {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  roundText: string;
  timerText: string;
  bannerText: string;
  opponents: Array<{ name: string; isBot: boolean; score: number; cardCount: number; isTurn?: boolean }>;
  jokerCard: { rank: string; suit: string; color: string };
  discardTop: { rank: string; suit: string; color: string; underCard?: { rank: string; suit: string; color: string } };
  hand: Array<{ rank: string; suit: string; color: string; selected?: boolean; rot?: string }>;
  scores: Array<{ name: string; score: number; isYou?: boolean }>;
  modalHighlight?: string;
  victoryModal?: { title: string; winner: string; yourPts: number; botPts: number };
}

const ACTION_SCREENSHOTS: ScreenshotData[] = [
  {
    id: 'turn_discard',
    title: 'Multi-Card Set Discarding',
    badge: 'TURN ACTION',
    badgeColor: '#0284c7',
    description: 'Select valid sets (same rank) or runs (same suit sequence) to cut high hand points fast.',
    roundText: 'ROUND 2/5',
    timerText: '⏱️ 0:42',
    bannerText: '⚡ YOUR TURN: 3 Cards Selected for Discard!',
    opponents: [
      { name: 'AlphaBot 🤖', isBot: true, score: 28, cardCount: 5 },
      { name: 'BetaBot 🤖', isBot: true, score: 34, cardCount: 6 },
    ],
    jokerCard: { rank: '7', suit: '♠', color: '#0f172a' },
    discardTop: { rank: 'J', suit: '♦', color: '#dc2626' },
    hand: [
      { rank: '6', suit: '♣', color: '#0f172a', selected: true, rot: '-6deg' },
      { rank: '6', suit: '♦', color: '#dc2626', selected: true, rot: '-3deg' },
      { rank: '6', suit: '♥', color: '#dc2626', selected: true, rot: '0deg' },
      { rank: '9', suit: '♠', color: '#0f172a', selected: false, rot: '4deg' },
      { rank: 'K', suit: '♣', color: '#0f172a', selected: false, rot: '8deg' },
    ],
    scores: [
      { name: '▶ You (Guest)', score: 12, isYou: true },
      { name: 'AlphaBot 🤖', score: 28 },
      { name: 'BetaBot 🤖', score: 34 },
    ],
    modalHighlight: '💡 Discarding matching rank set (6♣ 6♦ 6♥) drops 18 points in 1 turn!'
  },
  {
    id: 'draw_phase',
    title: 'Deck & Discard Draw Phase',
    badge: 'DRAW STRATEGY',
    badgeColor: '#8b5cf6',
    description: 'Draw 1 replacement card from the face-down secret Deck or grab the top open Discard pile card.',
    roundText: 'ROUND 3/5',
    timerText: '⏱️ 0:51',
    bannerText: '🎴 DRAW PHASE: Pick 1 Card from Secret Deck or Discard',
    opponents: [
      { name: 'AlphaBot 🤖', isBot: true, score: 15, cardCount: 4, isTurn: false },
      { name: 'GamerPro 👤', isBot: false, score: 22, cardCount: 5, isTurn: false },
    ],
    jokerCard: { rank: '7', suit: '♥', color: '#dc2626' },
    discardTop: { rank: 'A', suit: '♠', color: '#0f172a', underCard: { rank: '10', suit: '♥', color: '#dc2626' } },
    hand: [
      { rank: '2', suit: '♦', color: '#dc2626', selected: false, rot: '-4deg' },
      { rank: '4', suit: '♣', color: '#0f172a', selected: false, rot: '0deg' },
      { rank: '8', suit: '♠', color: '#0f172a', selected: false, rot: '4deg' },
      { rank: 'J', suit: '♥', color: '#dc2626', selected: false, rot: '8deg' },
    ],
    scores: [
      { name: 'AlphaBot 🤖', score: 15 },
      { name: '▶ You (Guest)', score: 19, isYou: true },
      { name: 'GamerPro 👤', score: 22 },
    ],
    modalHighlight: '💡 Pick top Discard (Ace of Spades = 1 pt) to immediately upgrade your hand score!'
  },
  {
    id: 'multiplayer_match',
    title: 'Live 4-Player Table',
    badge: 'MULTIPLAYER',
    badgeColor: '#16a34a',
    description: 'Real-time multiplayer tables with live opponents, active turn indicators, and live scoreboards.',
    roundText: 'ROUND 4/5',
    timerText: '⏱️ 0:35',
    bannerText: '⏳ Sarah_NY 👤 is discarding high cards...',
    opponents: [
      { name: 'Sarah_NY 👤', isBot: false, score: 41, cardCount: 6, isTurn: true },
      { name: 'Alex99 👤', isBot: false, score: 55, cardCount: 5 },
      { name: 'AlphaBot 🤖', isBot: true, score: 32, cardCount: 4 },
    ],
    jokerCard: { rank: '7', suit: '♦', color: '#dc2626' },
    discardTop: { rank: 'Q', suit: '♠', color: '#0f172a' },
    hand: [
      { rank: 'A', suit: '♣', color: '#0f172a', selected: false, rot: '-6deg' },
      { rank: '3', suit: '♥', color: '#dc2626', selected: false, rot: '-2deg' },
      { rank: '5', suit: '♠', color: '#0f172a', selected: false, rot: '2deg' },
      { rank: '7', suit: '♦', color: '#dc2626', selected: false, rot: '6deg' },
    ],
    scores: [
      { name: '▶ You (Guest)', score: 9, isYou: true },
      { name: 'AlphaBot 🤖', score: 32 },
      { name: 'Sarah_NY 👤', score: 41 },
      { name: 'Alex99 👤', score: 55 },
    ],
    modalHighlight: '💡 Real-time synchronization keeps turns moving fast with auto-skip and match features.'
  },
  {
    id: 'least_victory',
    title: 'Calling LEAST & Victory Reveal',
    badge: 'ROUND VICTORY',
    badgeColor: '#eab308',
    description: 'Claim LEAST! with 10 pts or less. Lowest hand score earns 0 points and takes the round win!',
    roundText: 'ROUND 5 COMPLETE',
    timerText: '🏆 MATCH END',
    bannerText: '🎉 YOU CALLED LEAST! 0 PTS AWARDED TO WINNER!',
    opponents: [
      { name: 'AlphaBot 🤖', isBot: true, score: 39, cardCount: 5 },
      { name: 'BetaBot 🤖', isBot: true, score: 48, cardCount: 6 },
    ],
    jokerCard: { rank: '7', suit: '♣', color: '#0f172a' },
    discardTop: { rank: '2', suit: '♠', color: '#0f172a' },
    hand: [
      { rank: 'A', suit: '♠', color: '#0f172a', selected: false, rot: '-3deg' },
      { rank: 'A', suit: '♥', color: '#dc2626', selected: false, rot: '3deg' },
    ],
    scores: [
      { name: '🏆 You (WINNER)', score: 0, isYou: true },
      { name: 'AlphaBot 🤖', score: 39 },
      { name: 'BetaBot 🤖', score: 48 },
    ],
    modalHighlight: '🏆 Victory! Calling LEAST with 2 pts (Ace pairs) defeated opponents (39 & 48 pts)!',
    victoryModal: { title: '🏆 ROUND WINNER!', winner: 'You (Guest)', yourPts: 0, botPts: 39 }
  }
];

export const GameInActionSection: React.FC<{ style?: any }> = ({ style }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmall = width < 480;

  const [activeModalItem, setActiveModalItem] = useState<ScreenshotData | null>(null);

  return (
    <View style={[styles.container, style]}>
      {/* Header Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>📸 GAMEPLAY GALLERY</Text>
        <Text style={styles.sectionTitle}>Game in Action</Text>
        <Text style={styles.sectionSubtitle}>
          Explore actual gameplay screens: multi-card set discards, draw strategies, live 4-player tables, and victory reveals.
        </Text>
      </View>

      {/* Responsive Screenshots Grid */}
      <View style={styles.gridContainer}>
        {ACTION_SCREENSHOTS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.cardWrapper, isMobile && styles.cardWrapperMobile]}
            onPress={() => setActiveModalItem(item)}
            activeOpacity={0.9}
          >
            {/* Screenshot Header Bar */}
            <View style={styles.cardHeaderBar}>
              <View style={[styles.badgePill, { backgroundColor: item.badgeColor }]}>
                <Text style={styles.badgePillText}>{item.badge}</Text>
              </View>
              <Text style={styles.cardTitleText}>{item.title}</Text>
              <Text style={styles.zoomHintText}>🔍 Tap to Expand</Text>
            </View>

            {/* Table Canvas Snapshot */}
            <View style={styles.tableFrameOuter}>
              <View style={styles.tableFrameInner}>
                <View style={styles.feltTable}>
                  <View style={styles.feltSeam} />

                  {/* Header Row inside snapshot */}
                  <View style={styles.tableHeaderRow}>
                    <View style={styles.roundBadge}>
                      <Text style={styles.roundBadgeText}>{item.roundText}</Text>
                    </View>
                    <View style={styles.timerBadge}>
                      <Text style={styles.timerBadgeText}>{item.timerText}</Text>
                    </View>
                  </View>

                  {/* Opponent Row */}
                  <View style={styles.opponentsRow}>
                    {item.opponents.map((opp, idx) => (
                      <View key={idx} style={[styles.oppBadge, opp.isTurn && styles.oppBadgeActive]}>
                        <View style={[styles.oppAvatar, opp.isTurn && styles.oppAvatarActive]}>
                          <Text style={styles.oppAvatarText}>{opp.name.charAt(0)}</Text>
                        </View>
                        <View>
                          <Text style={[styles.oppNameText, opp.isTurn && styles.oppNameTextActive]} numberOfLines={1}>
                            {opp.name}
                          </Text>
                          <Text style={styles.oppSubText}>{opp.cardCount} cards • {opp.score} pts</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Center Piles */}
                  <View style={styles.pilesRow}>
                    {/* Joker Slot */}
                    <View style={styles.pileSlot}>
                      <Text style={styles.pileLabel}>JOKER</Text>
                      <View style={[styles.miniCard, styles.jokerGlow]}>
                        <Text style={styles.jokerTagText}>★ JOKER</Text>
                        <Text style={[styles.cardRankText, { color: item.jokerCard.color }]}>{item.jokerCard.rank}</Text>
                        <Text style={[styles.cardSuitText, { color: item.jokerCard.color }]}>{item.jokerCard.suit}</Text>
                      </View>
                    </View>

                    {/* Deck Stack */}
                    <View style={styles.pileSlot}>
                      <Text style={styles.pileLabel}>DECK</Text>
                      <View style={styles.deckStack}>
                        <View style={[styles.deckBack, { top: -3, left: -3 }]} />
                        <View style={styles.deckBack}>
                          <View style={styles.deckPattern} />
                        </View>
                      </View>
                    </View>

                    {/* Discard Slot */}
                    <View style={styles.pileSlot}>
                      <Text style={styles.pileLabel}>DISCARD</Text>
                      <View style={styles.discardStack}>
                        {item.discardTop.underCard && (
                          <View style={[styles.miniCard, styles.underCardStyle]}>
                            <Text style={[styles.cardRankText, { color: item.discardTop.underCard.color }]}>{item.discardTop.underCard.rank}</Text>
                            <Text style={[styles.cardSuitText, { color: item.discardTop.underCard.color }]}>{item.discardTop.underCard.suit}</Text>
                          </View>
                        )}
                        <View style={styles.miniCard}>
                          <Text style={[styles.cardRankText, { color: item.discardTop.color }]}>{item.discardTop.rank}</Text>
                          <Text style={[styles.cardSuitText, { color: item.discardTop.color }]}>{item.discardTop.suit}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Banner Line */}
                  <View style={styles.bannerBar}>
                    <Text style={styles.bannerBarText} numberOfLines={1}>{item.bannerText}</Text>
                  </View>

                  {/* Player Hand Cards */}
                  <View style={styles.handRow}>
                    {item.hand.map((c, i) => (
                      <View
                        key={i}
                        style={[
                          styles.miniCard,
                          c.selected && styles.miniCardSelected,
                          { marginLeft: i === 0 ? 0 : -8 }
                        ]}
                      >
                        <Text style={[styles.cardRankText, { color: c.color }]}>{c.rank}</Text>
                        <Text style={[styles.cardSuitText, { color: c.color }]}>{c.suit}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Description Text */}
            <Text style={styles.cardDescText}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lightbox High-Res Zoom Modal */}
      <Modal visible={!!activeModalItem} transparent animationType="fade" onRequestClose={() => setActiveModalItem(null)}>
        {activeModalItem && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentCard}>
              {/* Modal Top Controls */}
              <View style={styles.modalHeaderRow}>
                <View style={styles.modalTitleGroup}>
                  <View style={[styles.badgePill, { backgroundColor: activeModalItem.badgeColor }]}>
                    <Text style={styles.badgePillText}>{activeModalItem.badge}</Text>
                  </View>
                  <Text style={styles.modalTitleText}>{activeModalItem.title}</Text>
                </View>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModalItem(null)}>
                  <Text style={styles.modalCloseText}>✕ Close</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                {/* Expanded High Resolution Screenshot */}
                <View style={styles.expandedTableOuter}>
                  <View style={styles.expandedTableInner}>
                    <View style={styles.expandedFelt}>
                      <View style={styles.feltSeam} />

                      {/* Header bar */}
                      <View style={styles.expandedHeaderBar}>
                        <View style={styles.roundBadge}>
                          <Text style={styles.roundBadgeText}>{activeModalItem.roundText}</Text>
                        </View>
                        <Text style={styles.expandedHeaderTitle}>7 CARDS LEAST ONLINE TABLE</Text>
                        <View style={styles.timerBadge}>
                          <Text style={styles.timerBadgeText}>{activeModalItem.timerText}</Text>
                        </View>
                      </View>

                      {/* Opponents Row */}
                      <View style={styles.expandedOpponentsRow}>
                        {activeModalItem.opponents.map((opp, idx) => (
                          <View key={idx} style={[styles.oppBadge, styles.expandedOppBadge, opp.isTurn && styles.oppBadgeActive]}>
                            <View style={[styles.oppAvatar, opp.isTurn && styles.oppAvatarActive]}>
                              <Text style={styles.oppAvatarText}>{opp.name.charAt(0)}</Text>
                            </View>
                            <View>
                              <Text style={[styles.oppNameText, opp.isTurn && styles.oppNameTextActive]}>
                                {opp.name}
                              </Text>
                              <Text style={styles.oppSubText}>{opp.cardCount} Cards • Score: {opp.score} pts</Text>
                            </View>
                          </View>
                        ))}
                      </View>

                      {/* Center Piles */}
                      <View style={styles.expandedPilesRow}>
                        {/* Joker */}
                        <View style={styles.expandedPileCol}>
                          <Text style={styles.expandedPileLabel}>JOKER (0 PTS)</Text>
                          <View style={[styles.expandedCard, styles.jokerGlow]}>
                            <Text style={styles.jokerTagText}>★ JOKER</Text>
                            <Text style={[styles.expandedRank, { color: activeModalItem.jokerCard.color }]}>{activeModalItem.jokerCard.rank}</Text>
                            <Text style={[styles.expandedSuit, { color: activeModalItem.jokerCard.color }]}>{activeModalItem.jokerCard.suit}</Text>
                          </View>
                        </View>

                        {/* Deck */}
                        <View style={styles.expandedPileCol}>
                          <Text style={styles.expandedPileLabel}>SECRET DECK</Text>
                          <View style={styles.expandedDeckStack}>
                            <View style={[styles.expandedDeckBack, { top: -4, left: -4 }]} />
                            <View style={styles.expandedDeckBack}>
                              <View style={styles.deckPattern} />
                            </View>
                          </View>
                        </View>

                        {/* Discard */}
                        <View style={styles.expandedPileCol}>
                          <Text style={styles.expandedPileLabel}>DISCARD PILE</Text>
                          <View style={styles.expandedDiscardStack}>
                            {activeModalItem.discardTop.underCard && (
                              <View style={[styles.expandedCard, styles.expandedUnderCard]}>
                                <Text style={[styles.expandedRank, { color: activeModalItem.discardTop.underCard.color }]}>{activeModalItem.discardTop.underCard.rank}</Text>
                                <Text style={[styles.expandedSuit, { color: activeModalItem.discardTop.underCard.color }]}>{activeModalItem.discardTop.underCard.suit}</Text>
                              </View>
                            )}
                            <View style={styles.expandedCard}>
                              <Text style={[styles.expandedRank, { color: activeModalItem.discardTop.color }]}>{activeModalItem.discardTop.rank}</Text>
                              <Text style={[styles.expandedSuit, { color: activeModalItem.discardTop.color }]}>{activeModalItem.discardTop.suit}</Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* Action Banner */}
                      <View style={styles.expandedBanner}>
                        <Text style={styles.expandedBannerText}>{activeModalItem.bannerText}</Text>
                      </View>

                      {/* Player Hand */}
                      <View style={styles.expandedDock}>
                        <Text style={styles.dockTitle}>Your Hand Cards:</Text>
                        <View style={styles.expandedHandRow}>
                          {activeModalItem.hand.map((c, i) => (
                            <View
                              key={i}
                              style={[
                                styles.expandedCard,
                                c.selected && styles.expandedCardSelected,
                                { marginLeft: i === 0 ? 0 : -10 }
                              ]}
                            >
                              <Text style={[styles.expandedRank, { color: c.color }]}>{c.rank}</Text>
                              <Text style={[styles.expandedSuit, { color: c.color }]}>{c.suit}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Insight Callout Box */}
                {activeModalItem.modalHighlight && (
                  <View style={styles.modalInsightBox}>
                    <Text style={styles.modalInsightText}>{activeModalItem.modalHighlight}</Text>
                  </View>
                )}

                {/* Scoreboard Table Breakdown */}
                <View style={styles.modalScoreTable}>
                  <Text style={styles.modalScoreTitle}>📊 Live Table Leaderboard Scores</Text>
                  {activeModalItem.scores.map((sc, idx) => (
                    <View key={idx} style={[styles.modalScoreRow, sc.isYou && styles.modalScoreRowActive]}>
                      <Text style={[styles.modalScoreName, sc.isYou && styles.modalScoreNameActive]}>{sc.name}</Text>
                      <Text style={[styles.modalScoreVal, sc.isYou && styles.modalScoreValActive]}>{sc.score} pts</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.modalDescFull}>{activeModalItem.description}</Text>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
    marginVertical: 28,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTag: {
    color: '#facc15',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },
  sectionSubtitle: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 640,
    lineHeight: 20,
  },

  /* Grid Layout */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  cardWrapper: {
    width: '48%',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  cardWrapperMobile: {
    width: '100%',
  },

  cardHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardTitleText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 6,
  },
  zoomHintText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },

  /* Table Snapshot */
  tableFrameOuter: {
    backgroundColor: '#351203',
    padding: 6,
    borderRadius: 12,
  },
  tableFrameInner: {
    backgroundColor: '#4d1904',
    padding: 3,
    borderRadius: 9,
  },
  feltTable: {
    backgroundColor: '#065f28',
    borderRadius: 7,
    padding: 8,
    position: 'relative',
    minHeight: 195,
    justifyContent: 'space-between',
  },
  feltSeam: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.2)',
  },

  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  roundBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#facc15',
  },
  roundBadgeText: {
    color: '#facc15',
    fontSize: 9,
    fontWeight: '900',
  },
  timerBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  timerBadgeText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '900',
  },

  opponentsRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 6,
  },
  oppBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  oppBadgeActive: {
    borderColor: '#4ade80',
    backgroundColor: 'rgba(22, 163, 74, 0.25)',
  },
  oppAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oppAvatarActive: {
    backgroundColor: '#16a34a',
  },
  oppAvatarText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  oppNameText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  oppNameTextActive: {
    color: '#4ade80',
  },
  oppSubText: {
    color: '#94a3b8',
    fontSize: 8,
  },

  pilesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 4,
  },
  pileSlot: {
    alignItems: 'center',
  },
  pileLabel: {
    color: '#facc15',
    fontSize: 8,
    fontWeight: '900',
    marginBottom: 2,
  },
  miniCard: {
    width: 36,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    position: 'relative',
  },
  miniCardSelected: {
    borderColor: '#facc15',
    borderWidth: 2,
    transform: [{ translateY: -4 }],
  },
  jokerGlow: {
    borderColor: '#fbbf24',
    borderWidth: 1.5,
  },
  jokerTagText: {
    fontSize: 5,
    color: '#d97706',
    fontWeight: '900',
  },
  cardRankText: {
    fontSize: 14,
    fontWeight: '900',
  },
  cardSuitText: {
    fontSize: 12,
  },

  deckStack: {
    position: 'relative',
    width: 36,
    height: 50,
  },
  deckBack: {
    position: 'absolute',
    width: 36,
    height: 50,
    backgroundColor: '#1e3a8a',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffffff',
    padding: 2,
  },
  deckPattern: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },

  discardStack: {
    position: 'relative',
    width: 36,
    height: 50,
  },
  underCardStyle: {
    position: 'absolute',
    top: 2,
    left: -6,
    transform: [{ rotate: '-10deg' }],
  },

  bannerBar: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#facc15',
    alignSelf: 'center',
    marginVertical: 4,
  },
  bannerBarText: {
    color: '#facc15',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  handRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2,
  },

  cardDescText: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 10,
    lineHeight: 16,
  },

  /* Lightbox Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 30, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContentCard: {
    width: '100%',
    maxWidth: 720,
    maxHeight: '90%',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#38bdf8',
    padding: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  modalTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  modalTitleText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  modalCloseBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  modalScrollView: {
    flexGrow: 1,
  },

  expandedTableOuter: {
    backgroundColor: '#351203',
    padding: 10,
    borderRadius: 16,
  },
  expandedTableInner: {
    backgroundColor: '#4d1904',
    padding: 4,
    borderRadius: 12,
  },
  expandedFelt: {
    backgroundColor: '#065f28',
    borderRadius: 10,
    padding: 14,
    minHeight: 280,
    justifyContent: 'space-between',
  },
  expandedHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  expandedHeaderTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  expandedOpponentsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  expandedOppBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  expandedPilesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 10,
  },
  expandedPileCol: {
    alignItems: 'center',
  },
  expandedPileLabel: {
    color: '#facc15',
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 4,
  },
  expandedCard: {
    width: 48,
    height: 66,
    backgroundColor: '#ffffff',
    borderRadius: 7,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    position: 'relative',
  },
  expandedCardSelected: {
    borderColor: '#facc15',
    borderWidth: 2.5,
    transform: [{ translateY: -6 }],
  },
  expandedUnderCard: {
    position: 'absolute',
    top: 3,
    left: -8,
    transform: [{ rotate: '-10deg' }],
  },
  expandedRank: {
    fontSize: 18,
    fontWeight: '900',
  },
  expandedSuit: {
    fontSize: 15,
  },

  expandedDeckStack: {
    position: 'relative',
    width: 48,
    height: 66,
  },
  expandedDeckBack: {
    position: 'absolute',
    width: 48,
    height: 66,
    backgroundColor: '#1e3a8a',
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    padding: 3,
  },

  expandedDiscardStack: {
    position: 'relative',
    width: 48,
    height: 66,
  },

  expandedBanner: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#facc15',
    alignSelf: 'center',
    marginVertical: 8,
  },
  expandedBannerText: {
    color: '#facc15',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  expandedDock: {
    alignItems: 'center',
    marginTop: 6,
  },
  dockTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expandedHandRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  modalInsightBox: {
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#facc15',
    marginTop: 14,
  },
  modalInsightText: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 18,
  },

  modalScoreTable: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalScoreTitle: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  modalScoreRowActive: {
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  modalScoreName: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  modalScoreNameActive: {
    color: '#facc15',
    fontWeight: 'bold',
  },
  modalScoreVal: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalScoreValActive: {
    color: '#facc15',
  },

  modalDescFull: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 14,
  },
});
