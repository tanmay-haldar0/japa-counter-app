import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  Modal,
  Vibration,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function SessionScreen() {
  const { id, name } = useLocalSearchParams();
  const { width } = Dimensions.get("window");

  const [today, setToday] = useState(0);
  const [lifetime, setLifetime] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLargePress = () => {
    const newToday = today + 1;
    const newLifetime = lifetime + 1;
    const newSession = sessionCount + 1;

    if (newSession === 108) {
      Vibration.vibrate(500); // Medium vibration on cycle complete
      setSessionCount(0);
      setCycles((prev) => prev + 1);
    } else {
      Vibration.vibrate(50); // Mild vibration on each tap
      setSessionCount(newSession);
    }

    setToday(newToday);
    setLifetime(newLifetime);
  };

  const handleResetPress = () => {
    setModalVisible(true);
  };

  const confirmReset = () => {
    setLifetime((prev) => prev - today); // subtract today's count from lifetime
    setToday(0);                         // reset today count
    setSessionCount(0);                  // reset session count (0–108)
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.innerContainer, { width: width * 0.8 }]}>
        <Text style={styles.countText}>{sessionCount}</Text>

        <View style={styles.todayStats}>
          <Text style={styles.label}>Today: {today}</Text>
          <Text style={styles.label}>108 × {cycles}</Text>
          <Text style={styles.label}>Lifetime: {lifetime}</Text>
          <Text style={styles.label}>108 × {Math.floor(lifetime / 108)}</Text>
        </View>

        <TouchableOpacity style={styles.smallButton} onPress={handleResetPress}>
          <Text style={styles.smallButtonText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.largeButton} onPress={handleLargePress}>
          <Text style={styles.largeButtonText}>Japa</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Reset</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to reset today's count?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmReset}
                style={styles.confirmButton}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    alignItems: "center",
  },
  countText: {
    fontSize: 70,
    color: "blue",
    fontWeight: "bold",
  },
  todayStats: {
    marginTop: 4,
    padding: 5,
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  smallButton: {
    backgroundColor: "blue",
    width: 120,
    height: 50,
    borderRadius: 10,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  smallButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  largeButton: {
    backgroundColor: "blue",
    width: 320,
    height: 320,
    borderRadius: 180,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  largeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
  },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 20,
  },
  cancelButton: {
    backgroundColor: "#888",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
