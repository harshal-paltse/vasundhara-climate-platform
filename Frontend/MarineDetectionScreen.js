import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";

export default function MarineDetectionScreen() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeImage = async () => {
    try {
      setLoading(true);
      setResult(null);

      const response = await fetch("http://192.168.1.5:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_path: "sample.tif",
        }),
      });

      const data = await response.json();
      setResult(data.prediction);
    } catch (error) {
      Alert.alert("Error", "Could not connect to backend server.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Marine Debris Detection</Text>

      <Button title="Analyze Satellite Image" onPress={analyzeImage} />

      {loading && (
        <ActivityIndicator size="large" color="#00ff88" style={{ marginTop: 20 }} />
      )}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            Prediction: {JSON.stringify(result)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 20,
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#111",
    borderRadius: 10,
  },
  resultText: {
    color: "#00ff88",
  },
});