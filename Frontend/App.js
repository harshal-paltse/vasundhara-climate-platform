import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import HomeScreen from './screens/HomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import RiverMonitorScreen from './screens/RiverMonitorScreen';
import AlertsScreen from './screens/AlertsScreen';
import MarineDetectionScreen from './screens/MarineDetectionScreen';
import PlantTreeScreen from './screens/PlantTreeScreen';

const Stack = createStackNavigator();
const { width } = Dimensions.get('window');

function MenuButton({ navigation }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const navigateTo = (screen) => {
    closeMenu();
    setTimeout(() => navigation.navigate(screen), 300);
  };

  return (
    <>
      <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
        <View style={[styles.menuDot, { backgroundColor: theme.text }]} />
        <View style={[styles.menuDot, { backgroundColor: theme.text }]} />
        <View style={[styles.menuDot, { backgroundColor: theme.text }]} />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={[styles.menuOverlay, { backgroundColor: theme.overlay }]}>
          <TouchableOpacity
            style={styles.menuBackdrop}
            activeOpacity={1}
            onPress={closeMenu}
          />

          <Animated.View
            style={[
              styles.menuPanel,
              { 
                transform: [{ translateX: slideAnim }],
                backgroundColor: theme.background,
                borderLeftColor: theme.cardBorder,
              },
            ]}
          >
            <View style={[styles.menuHeader, { borderBottomColor: theme.cardBorder }]}>
              <Text style={[styles.menuTitle, { color: theme.text }]}>NAVIGATION</Text>
              <TouchableOpacity onPress={closeMenu}>
                <Text style={[styles.closeButton, { color: theme.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <MenuItem icon="◆" label="Home" onPress={() => navigateTo('Home')} />
            <MenuItem icon="◈" label="Dashboard" onPress={() => navigateTo('Dashboard')} />
            <MenuItem icon="◉" label="River Monitoring" onPress={() => navigateTo('Rivers')} />
            <MenuItem icon="◐" label="Alerts" onPress={() => navigateTo('Alerts')} />
            <MenuItem icon="⬢" label="Marine Debris AI" onPress={() => navigateTo('MarineDetection')} />
            <MenuItem icon="🌳" label="Plant a Tree" onPress={() => navigateTo('PlantTree')} />
            <MenuItem icon="◇" label="Carbon Tracker" onPress={() => navigateTo('Home')} />
            <MenuItem icon="◆" label="Cleanup Activity" onPress={() => navigateTo('Alerts')} />
            
            <View style={[styles.menuDivider, { backgroundColor: theme.cardBorder }]} />
            
            <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
              <Text style={[styles.menuIcon, { color: theme.accent }]}>
                {isDark ? '☀' : '☾'}
              </Text>
              <Text style={[styles.menuLabel, { color: theme.text }]}>
                Toggle Theme
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

function MenuItem({ icon, label, onPress }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.menuItem, { borderBottomColor: theme.card }]} 
      onPress={onPress}
    >
      <Text style={[styles.menuIcon, { color: theme.text }]}>{icon}</Text>
      <Text style={[styles.menuLabel, { color: theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function CustomHeader({ navigation }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.cardBorder }]}>
      <Text
        style={[styles.headerTitle, { color: theme.text }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        VASUNDHARA
      </Text>
      <MenuButton navigation={navigation} />
    </View>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  return (
    <NavigationContainer>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Rivers" component={RiverMonitorScreen} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
        <Stack.Screen name="MarineDetection" component={MarineDetectionScreen} />
        <Stack.Screen name="PlantTree" component={PlantTreeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: width < 350 ? 24 : width < 400 ? 28 : 30,
    fontWeight: '900',
    letterSpacing: 3,
    flex: 1,
    maxWidth: width - 100,
  },
  menuButton: {
    flexDirection: 'column',
    gap: 4,
    padding: 8,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  menuOverlay: {
    flex: 1,
  },
  menuBackdrop: {
    flex: 1,
  },
  menuPanel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    borderLeftWidth: 1,
    paddingTop: 50,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  closeButton: {
    fontSize: 24,
    fontWeight: '300',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
  },
  menuDivider: {
    height: 1,
    marginVertical: 16,
  },
});
