import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Privacy Policy</Text>
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            <Text style={styles.lastUpdated}>Last Updated: September 17, 2026</Text>
            
            <Text style={styles.sectionHead}>1. Information We Collect</Text>
            <Text style={styles.sectionBody}>
              7 Card Game (cards.gnanamai.com) values your privacy. We collect minimal data necessary to provide a smooth gaming experience:
              {'\n'}• Display names chosen during guest or account login.
              {'\n'}• Game stats (wins, rounds played, scores) saved locally and synced to your active room session.
              {'\n'}• Standard web analytics (pageviews and core interaction events via Google Analytics 4) without collecting sensitive personal details.
            </Text>

            <Text style={styles.sectionHead}>2. Local Storage & Data Usage</Text>
            <Text style={styles.sectionBody}>
              We use browser localStorage to maintain your player profile, session state, and table theme preferences across browser reloads. We do not sell or monetize your personal data.
            </Text>

            <Text style={styles.sectionHead}>3. Analytics & Cookies</Text>
            <Text style={styles.sectionBody}>
              Anonymous analytics help us identify performance bottlenecks, bot turn delays, and room creation errors to improve gameplay for all users.
            </Text>

            <Text style={styles.sectionHead}>4. Security & Safety</Text>
            <Text style={styles.sectionBody}>
              Room communications use secure API transport with rate limiting and automated anti-abuse filtering to preserve fair play.
            </Text>

            <Text style={styles.sectionHead}>5. Contact Us</Text>
            <Text style={styles.sectionBody}>
              If you have questions about privacy, feel free to contact us at support@gnanamai.com.
            </Text>
          </ScrollView>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close Privacy Policy"
          >
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '85%',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  lastUpdated: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  scrollArea: {
    flex: 1,
  },
  sectionHead: {
    color: '#38bdf8',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  sectionBody: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: '#0275d8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
