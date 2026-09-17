import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Terms of Service</Text>
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            <Text style={styles.lastUpdated}>Effective Date: September 17, 2026</Text>

            <Text style={styles.sectionHead}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionBody}>
              By accessing and playing 7 Card Game on cards.gnanamai.com, you agree to comply with these terms of service and fair play guidelines.
            </Text>

            <Text style={styles.sectionHead}>2. Fair Play & Conduct</Text>
            <Text style={styles.sectionBody}>
              Players must maintain respectful behavior in live chat rooms. Harassment, automated cheating bots, spamming, or disrupting room matches is prohibited.
            </Text>

            <Text style={styles.sectionHead}>3. Service Availability</Text>
            <Text style={styles.sectionBody}>
              7 Card Game is provided as a free casual gaming platform. While we aim for 99.9% uptime, room states or server connections may occasionally undergo maintenance or updates without notice.
            </Text>

            <Text style={styles.sectionHead}>4. Intellectual Property</Text>
            <Text style={styles.sectionBody}>
              All custom graphics, rules implementation, audio effects, and branding belong to 7 Card Game (Nmishraa).
            </Text>

            <Text style={styles.sectionHead}>5. Disclaimers</Text>
            <Text style={styles.sectionBody}>
              7 Card Game is played purely for recreation. No real-money gambling, betting, or monetary prizes are involved.
            </Text>
          </ScrollView>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close Terms of Service"
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
