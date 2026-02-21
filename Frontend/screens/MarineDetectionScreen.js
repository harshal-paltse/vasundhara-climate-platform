import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  ActivityIndicator,
  Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');

export default function MarineDetectionScreen() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [predictions, setPredictions] = useState([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isAnalyzing) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [isAnalyzing]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setShowResults(false);

    // Simulate AI analysis
    setTimeout(() => {
      const mockPredictions = [
        { label: 'Plastic Bottles', confidence: 0.94, color: '#00ff88' },
        { label: 'Fishing Nets', confidence: 0.87, color: '#00ff88' },
        { label: 'Plastic Bags', confidence: 0.76, color: '#00ff88' },
        { label: 'Metal Debris', confidence: 0.62, color: '#ffaa00' },
        { label: 'Organic Matter', confidence: 0.45, color: '#ffaa00' },
        { label: 'Glass Fragments', confidence: 0.28, color: '#ff4444' },
      ];
      
      setPredictions(mockPredictions);
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={[
            styles.headerSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.titleContainer}>
            <View style={styles.titleGlow} />
            <Text style={styles.title}>AI MARINE DEBRIS</Text>
            <Text style={styles.subtitle}>DETECTION SYSTEM</Text>
          </View>
          
          <View style={styles.statusCard}>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>SYSTEM ONLINE</Text>
            </View>
            <Text style={styles.statusSubtext}>Neural Network v2.4.1</Text>
          </View>
        </Animated.View>

        <View style={styles.controlSection}>
          <View style={styles.glassCard}>
            <Text style={styles.cardTitle}>ANALYSIS CONTROL</Text>
            <View style={styles.cardDivider} />
            
            <TouchableOpacity 
              style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
              onPress={handleAnalyze}
              disabled={isAnalyzing}
            >
              <View style={styles.buttonGlow} />
              <Text style={styles.analyzeButtonText}>
                {isAnalyzing ? 'ANALYZING...' : 'START ANALYSIS'}
              </Text>
              {!isAnalyzing && <Text style={styles.buttonIcon}>▶</Text>}
            </TouchableOpacity>

            {isAnalyzing && (
              <View style={styles.loadingContainer}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <View style={styles.spinner}>
                    <View style={styles.spinnerInner} />
                  </View>
                </Animated.View>
                <Text style={styles.loadingText}>Processing satellite imagery...</Text>
                <View style={styles.progressBar}>
                  <Animated.View 
                    style={[
                      styles.progressFill,
                      { width: '70%' }
                    ]} 
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {showResults && (
          <Animated.View 
            style={[
              styles.resultsSection,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>DETECTION RESULTS</Text>
              <View style={styles.cardDivider} />
              
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsLabel}>DEBRIS TYPE</Text>
                <Text style={styles.resultsLabel}>CONFIDENCE</Text>
              </View>

              {predictions.map((prediction, index) => (
                <PredictionBar 
                  key={index}
                  label={prediction.label}
                  confidence={prediction.confidence}
                  color={prediction.color}
                  delay={index * 100}
                />
              ))}

              <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>TOTAL DETECTED</Text>
                  <Text style={styles.summaryValue}>6 TYPES</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>AVG CONFIDENCE</Text>
                  <Text style={styles.summaryValue}>65.3%</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>◆</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>REAL-TIME DETECTION</Text>
              <Text style={styles.infoText}>AI-powered debris classification</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>◈</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>SATELLITE IMAGERY</Text>
              <Text style={styles.infoText}>High-resolution ocean monitoring</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>◉</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>NEURAL NETWORK</Text>
              <Text style={styles.infoText}>Deep learning classification model</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function PredictionBar({ label, confidence, color, delay }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(widthAnim, {
        toValue: confidence,
        duration: 1000,
        delay: delay,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.predictionItem, { opacity: fadeAnim }]}>
      <Text style={styles.predictionLabel}>{label}</Text>
      <View style={styles.predictionBarContainer}>
        <Animated.View 
          style={[
            styles.predictionBarFill,
            { width: animatedWidth, backgroundColor: color }
          ]}
        >
          <View style={styles.barGlow} />
        </Animated.View>
        <Text style={styles.predictionValue}>
          {(confidence * 100).toFixed(1)}%
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  titleContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  titleGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: '#00ff88',
    opacity: 0.1,
    borderRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00ff88',
    letterSpacing: 3,
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    borderRadius: 8,
    padding: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff88',
    marginRight: 12,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#00ff88',
    letterSpacing: 1,
  },
  statusSubtext: {
    fontSize: 11,
    color: '#666',
    letterSpacing: 1,
  },
  controlSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 24,
    backdropFilter: 'blur(10px)',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#888',
    letterSpacing: 2,
    marginBottom: 12,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  analyzeButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  analyzeButtonDisabled: {
    backgroundColor: '#333',
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00ff88',
    opacity: 0.3,
  },
  analyzeButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 2,
  },
  buttonIcon: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
    fontWeight: '900',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  spinner: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    borderTopColor: '#00ff88',
    borderRadius: 30,
    marginBottom: 16,
  },
  spinnerInner: {
    width: 54,
    height: 54,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 27,
  },
  loadingText: {
    fontSize: 12,
    color: '#00ff88',
    letterSpacing: 1,
    marginBottom: 16,
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  resultsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  resultsLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#666',
    letterSpacing: 1,
  },
  predictionItem: {
    marginBottom: 20,
  },
  predictionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  predictionBarContainer: {
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  predictionBarFill: {
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  barGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    opacity: 0.2,
  },
  predictionValue: {
    position: 'absolute',
    right: 12,
    top: 8,
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 1,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#00ff88',
    letterSpacing: 1,
  },
  infoSection: {
    paddingHorizontal: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 24,
    color: '#00ff88',
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 11,
    color: '#666',
    letterSpacing: 0.5,
  },
});
