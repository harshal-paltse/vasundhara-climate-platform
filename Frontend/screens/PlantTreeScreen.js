import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');
const BACKEND_URL = 'http://10.25.33.62:5000'; // Backend server IP

export default function PlantTreeScreen() {
  const { theme } = useTheme();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plantedTrees, setPlantedTrees] = useState([]);
  const [totalTrees, setTotalTrees] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [awardedBadge, setAwardedBadge] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const streakAnim = useRef(new Animated.Value(1)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPlantedTrees();
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/streak/1`);
      const data = await response.json();
      setCurrentStreak(data.current_streak || 0);
      setLongestStreak(data.longest_streak || 0);
    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  };

  const animateStreak = () => {
    Animated.sequence([
      Animated.timing(streakAnim, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(streakAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showBadgeAnimation = (badge) => {
    setAwardedBadge(badge);
    setShowBadgeModal(true);
    
    Animated.spring(badgeAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
    
    // Show confetti for milestones
    if (badge.milestone >= 7) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const fetchPlantedTrees = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/trees`);
      const data = await response.json();
      setPlantedTrees(data.trees || []);
      setTotalTrees(data.total || 0);
    } catch (error) {
      console.error('Error fetching trees:', error);
    }
  };

  const requestLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to plant a tree');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation.coords);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
      setLoading(false);
    }
  };

  const plantTree = async () => {
    if (!location) {
      Alert.alert('No Location', 'Please get your location first');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/plant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          user_id: 1,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.status === 'success') {
        // Update streak
        setCurrentStreak(data.current_streak);
        setLongestStreak(data.longest_streak);
        
        // Animate streak if increased
        if (data.streak_increased) {
          animateStreak();
        }
        
        // Show badge if awarded
        if (data.badge_awarded) {
          setTimeout(() => {
            showBadgeAnimation(data.badge_awarded);
          }, 500);
        }
        
        Alert.alert(
          'Success! 🌳',
          `Tree planted successfully!\n\n🔥 Current Streak: ${data.current_streak} days`,
          [{ text: 'OK', onPress: () => {
            setLocation(null);
            fetchPlantedTrees();
          }}]
        );
      } else {
        Alert.alert(
          'Already Planted',
          'A tree has already been planted at this exact location'
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to plant tree. Make sure backend is running.');
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>PLANT A TREE</Text>
            <Text style={styles.subtitle}>Geo-Validated Tree Planting</Text>
          </View>

          {/* Streak Display */}
          <Animated.View style={[styles.streakCard, { transform: [{ scale: streakAnim }] }]}>
            <View style={styles.streakRow}>
              <View style={styles.streakItem}>
                <Text style={styles.streakIcon}>🔥</Text>
                <View>
                  <Text style={styles.streakValue}>{currentStreak}</Text>
                  <Text style={styles.streakLabel}>CURRENT STREAK</Text>
                </View>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <Text style={styles.streakIcon}>🏆</Text>
                <View>
                  <Text style={styles.streakValue}>{longestStreak}</Text>
                  <Text style={styles.streakLabel}>LONGEST STREAK</Text>
                </View>
              </View>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min((currentStreak / 30) * 100, 100)}%` }
                  ]} 
                />
              </View>
              <View style={styles.milestones}>
                <Text style={[styles.milestone, currentStreak >= 7 && styles.milestoneActive]}>7</Text>
                <Text style={[styles.milestone, currentStreak >= 15 && styles.milestoneActive]}>15</Text>
                <Text style={[styles.milestone, currentStreak >= 30 && styles.milestoneActive]}>30</Text>
              </View>
            </View>
          </Animated.View>

          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalTrees}</Text>
              <Text style={styles.statLabel}>TREES PLANTED</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{(totalTrees * 21).toFixed(0)} kg</Text>
              <Text style={styles.statLabel}>CO₂ ABSORBED/YEAR</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <View style={styles.glassCard}>
            <Text style={styles.cardTitle}>LOCATION VERIFICATION</Text>
            <View style={styles.cardDivider} />

            {!location ? (
              <>
                <Text style={styles.infoText}>
                  Get your current GPS coordinates to plant a tree at your location
                </Text>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={requestLocation}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={theme.background} />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>GET LOCATION</Text>
                      <Text style={styles.buttonIcon}>📍</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.locationInfo}>
                  <View style={styles.coordRow}>
                    <Text style={styles.coordLabel}>Latitude:</Text>
                    <Text style={styles.coordValue}>
                      {location.latitude.toFixed(6)}°
                    </Text>
                  </View>
                  <View style={styles.coordRow}>
                    <Text style={styles.coordLabel}>Longitude:</Text>
                    <Text style={styles.coordValue}>
                      {location.longitude.toFixed(6)}°
                    </Text>
                  </View>
                  <View style={styles.coordRow}>
                    <Text style={styles.coordLabel}>Accuracy:</Text>
                    <Text style={styles.coordValue}>
                      ±{location.accuracy?.toFixed(1)}m
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.plantButton}
                  onPress={plantTree}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={theme.background} />
                  ) : (
                    <>
                      <Text style={styles.plantButtonText}>PLANT TREE 🌳</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setLocation(null)}
                >
                  <Text style={styles.secondaryButtonText}>CANCEL</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🌍</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>GPS VALIDATION</Text>
              <Text style={styles.infoText}>
                Each tree is verified by exact coordinates
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🔒</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>DUPLICATE PREVENTION</Text>
              <Text style={styles.infoText}>
                System prevents multiple trees at same location
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📊</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>IMPACT TRACKING</Text>
              <Text style={styles.infoText}>
                Average tree absorbs 21kg CO₂ per year
              </Text>
            </View>
          </View>
        </View>

        {plantedTrees.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>RECENT PLANTINGS</Text>
            {plantedTrees.slice(0, 5).map((tree) => (
              <View key={tree.id} style={styles.treeItem}>
                <Text style={styles.treeIcon}>🌳</Text>
                <View style={styles.treeInfo}>
                  <Text style={styles.treeCoords}>
                    {tree.latitude.toFixed(4)}°, {tree.longitude.toFixed(4)}°
                  </Text>
                  <Text style={styles.treeId}>ID: #{tree.id}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Badge Award Modal */}
      <Modal
        visible={showBadgeModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowBadgeModal(false);
          badgeAnim.setValue(0);
        }}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.badgeModal,
              {
                transform: [
                  { scale: badgeAnim },
                  { 
                    rotate: badgeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    })
                  }
                ],
                opacity: badgeAnim,
              }
            ]}
          >
            <Text style={styles.badgeModalTitle}>🎉 MILESTONE ACHIEVED!</Text>
            <Text style={styles.badgeModalBadge}>{awardedBadge?.name}</Text>
            <Text style={styles.badgeModalDesc}>
              {awardedBadge?.milestone} Day Streak Completed!
            </Text>
            <TouchableOpacity
              style={styles.badgeModalButton}
              onPress={() => {
                setShowBadgeModal(false);
                badgeAnim.setValue(0);
              }}
            >
              <Text style={styles.badgeModalButtonText}>AWESOME!</Text>
            </TouchableOpacity>
          </Animated.View>
          
          {showConfetti && (
            <View style={styles.confettiContainer}>
              {[...Array(20)].map((_, i) => (
                <Text key={i} style={[styles.confetti, { 
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }]}>
                  {['🎉', '✨', '🌟', '⭐'][Math.floor(Math.random() * 4)]}
                </Text>
              ))}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.accent,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.secondary,
    letterSpacing: 1,
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: theme.accentDim,
    borderWidth: 1,
    borderColor: theme.accentBorder,
    borderRadius: 8,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.accentBorder,
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.secondary,
    letterSpacing: 1,
    textAlign: 'center',
  },
  actionSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  glassCard: {
    backgroundColor: theme.glassCard,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: 12,
    padding: 24,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.tertiary,
    letterSpacing: 2,
    marginBottom: 12,
  },
  cardDivider: {
    height: 1,
    backgroundColor: theme.glassBorder,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: theme.secondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: theme.accent,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.background,
    letterSpacing: 2,
  },
  buttonIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  locationInfo: {
    backgroundColor: theme.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  coordLabel: {
    fontSize: 13,
    color: theme.secondary,
    fontWeight: '600',
  },
  coordValue: {
    fontSize: 13,
    color: theme.text,
    fontWeight: '700',
  },
  plantButton: {
    backgroundColor: theme.accent,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  plantButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.background,
    letterSpacing: 2,
  },
  secondaryButton: {
    backgroundColor: theme.card,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.text,
    letterSpacing: 1,
  },
  infoSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.glassCard,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 28,
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.text,
    letterSpacing: 1,
    marginBottom: 4,
  },
  recentSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.tertiary,
    letterSpacing: 2,
    marginBottom: 16,
  },
  treeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  treeIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  treeInfo: {
    flex: 1,
  },
  treeCoords: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },
  treeId: {
    fontSize: 11,
    color: theme.secondary,
  },
  streakCard: {
    backgroundColor: theme.accentDim,
    borderWidth: 1,
    borderColor: theme.accentBorder,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  streakRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  streakItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakIcon: {
    fontSize: 32,
  },
  streakValue: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.accent,
  },
  streakLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.secondary,
    letterSpacing: 1,
  },
  streakDivider: {
    width: 1,
    backgroundColor: theme.accentBorder,
    marginHorizontal: 12,
  },
  progressSection: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.accent,
  },
  milestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  milestone: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.secondary,
  },
  milestoneActive: {
    color: theme.accent,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeModal: {
    backgroundColor: theme.background,
    borderWidth: 2,
    borderColor: theme.accent,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: width * 0.85,
  },
  badgeModalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.accent,
    letterSpacing: 2,
    marginBottom: 16,
  },
  badgeModalBadge: {
    fontSize: 48,
    marginBottom: 16,
  },
  badgeModalDesc: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  badgeModalButton: {
    backgroundColor: theme.accent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  badgeModalButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.background,
    letterSpacing: 2,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    fontSize: 24,
    top: -50,
  },
});
