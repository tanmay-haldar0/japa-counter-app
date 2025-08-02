import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from "react-native";

const STORAGE_KEY = "@mantra_counter";

export default function MantraCounter() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(108);
  const [lifetime, setLifetime] = useState(0);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showResetLifetimeModal, setShowResetLifetimeModal] = useState(false);
  const [inputTarget, setInputTarget] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          const { count, target, lifetime } = JSON.parse(data);
          setCount(count ?? 0);
          setTarget(target ?? 108);
          setLifetime(lifetime ?? 0);
        }
      } catch { }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ count, target, lifetime }));
  }, [count, target, lifetime]);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    setLifetime(lifetime + 1);
    if (newCount === target) {
      Vibration.vibrate(500);
    } else {
      Vibration.vibrate(40);
    }
  };

  const reset = () => {
    setCount(0);
    Vibration.vibrate(30);
  };

  const confirmResetLifetime = () => {
    setLifetime(0);
    Vibration.vibrate(30);
    setShowResetLifetimeModal(false);
  };

  const openTargetModal = () => {
    setInputTarget(target.toString());
    setShowTargetModal(true);
  };

  const confirmTarget = () => {
    const val = parseInt(inputTarget);
    if (!isNaN(val) && val > 0) {
      setTarget(val);
      if (count >= val) setCount(0);
      setShowTargetModal(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.innerContainer}>
        <View style={styles.targetBoxRow}>
          <Text style={styles.targetLabel}>Target:</Text>
          <TouchableOpacity style={styles.targetValueBox} onPress={openTargetModal}>
            <Text style={styles.targetValue}>{target}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Lifetime: {lifetime}</Text>
        <Text style={styles.label}>108 × {Math.floor(lifetime / 108)}</Text>
        <Text style={styles.countText}>{count}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around", margin: 32, gap: 42 }}>
          <TouchableOpacity style={styles.resetButton} onPress={reset} accessibilityLabel="Reset">
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: "#dc2626" }]}
            onPress={() => setShowResetLifetimeModal(true)}
          >
            <Text style={styles.buttonText}>Life</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.largeButton} onPress={increment}>
          <Text style={styles.largeButtonText}>Japa</Text>
        </TouchableOpacity>
      </View>

      {/* Target Modal */}
      <Modal visible={showTargetModal} transparent animationType="fade" onRequestClose={() => setShowTargetModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Target</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={inputTarget}
              onChangeText={setInputTarget}
              maxLength={5}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowTargetModal(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmTarget}>
                <Text style={styles.buttonText}>Set</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirm Reset Lifetime Modal */}
      <Modal visible={showResetLifetimeModal} transparent animationType="fade" onRequestClose={() => setShowResetLifetimeModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Lifetime?</Text>
            <Text style={{ marginBottom: 20 }}>This will set the lifetime counter to 0.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowResetLifetimeModal(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmButton, { backgroundColor: "#dc2626" }]} onPress={confirmResetLifetime}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  innerContainer: {
    alignItems: "center",
    padding: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    width: 320,
  },
  targetBoxRow: {
    backgroundColor: "#e0e7ff",
    borderRadius: 16,
    paddingVertical: 3,
    marginBottom: 18,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: 160,
    alignSelf: "center",
  },
  targetValueBox: {
    backgroundColor: "#dbeafe",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "bold",
    marginBottom: 2,
    alignSelf: "center",
  },
  targetLabel: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "bold",
    marginBottom: 2,
  },
  targetValue: {
    fontSize: 24,
    color: "#1e40af",
    fontWeight: "bold",
  },
  countText: {
    fontSize: 64,
    color: "#1e40af",
    fontWeight: "bold",
    marginVertical: 10,
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
  resetButton: {
    backgroundColor: "#2563eb",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: 300,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
    width: 120,
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
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
