# VASUNDHARA UPGRADE IMPLEMENTATION GUIDE

## ✅ COMPLETED

### 1. Theme Context System
- ✅ Created `Frontend/theme/ThemeContext.js`
- ✅ Dark theme (default): Black background, white text, neon green accent
- ✅ Light theme: White background, black text, teal accent
- ✅ Toggle theme button in menu
- ✅ Updated App.js with ThemeProvider
- ✅ Dynamic StatusBar based on theme

### 2. Plant a Tree System
- ✅ Created `Frontend/screens/PlantTreeScreen.js`
- ✅ GPS location permission handling
- ✅ Coordinate display
- ✅ Backend integration
- ✅ Success/rejection alerts
- ✅ Recent plantings list

### 3. Backend Updates
- ✅ Created SQLite database (`trees.db`)
- ✅ POST `/plant` endpoint - plant tree with duplicate prevention
- ✅ GET `/trees` endpoint - fetch all planted trees
- ✅ Flask-CORS enabled
- ✅ Existing `/predict` endpoint maintained

### 4. Navigation Updates
- ✅ Removed "Settings" and "Help" menu items
- ✅ Added "Plant a Tree" menu item
- ✅ Added "Toggle Theme" menu item with sun/moon icon
- ✅ All navigation working with Stack Navigator

## 🔄 REMAINING TASKS

### PART 2: CO₂ Tree Impact System (HomeScreen)

Update `Frontend/screens/HomeScreen.js`:

1. **Import useTheme**:
```javascript
import { useTheme } from '../theme/ThemeContext';
```

2. **Add Tree Impact Logic**:
```javascript
const TREE_DAILY_ABSORPTION = 0.057; // kg CO₂ per day
const HUMAN_DAILY_EMISSION = 12; // kg CO₂ average

const checkTreeImpact = (dailyCO2) => {
  if (dailyCO2 >= TREE_DAILY_ABSORPTION) {
    const treesNeeded = Math.ceil(dailyCO2 / TREE_DAILY_ABSORPTION);
    Alert.alert(
      '🌳 Tree Impact Alert',
      `You emitted CO₂ equal to ${treesNeeded} tree${treesNeeded > 1 ? 's' : ''}'s daily absorption. Consider planting a tree!`,
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Plant Now', onPress: () => navigation.navigate('PlantTree') }
      ]
    );
  }
};
```

3. **Update calculateCO2 function**:
```javascript
const calculateCO2 = () => {
  const elec = parseFloat(electricity) || 0;
  const trav = parseFloat(travel) || 0;
  const plast = parseFloat(plastic) || 0;
  const lpgVal = parseFloat(lpg) || 0;
  const wst = parseFloat(waste) || 0;

  const total = (elec * 0.82) + (trav * 0.21) + (plast * 6) + (lpgVal * 2.98) + (wst * 0.5);
  
  Animated.timing(counterAnim, {
    toValue: total,
    duration: 800,
    useNativeDriver: false,
  }).start();
  
  setTotalCO2(total);
  
  // Check tree impact
  checkTreeImpact(total);
};
```

4. **Add Tree Equivalent Display**:
```javascript
{totalCO2 > 0 && (
  <View style={styles.treeImpactSection}>
    <Text style={styles.treeImpactLabel}>TREE EQUIVALENT</Text>
    <Text style={styles.treeImpactValue}>
      {(totalCO2 / TREE_DAILY_ABSORPTION).toFixed(1)} trees
    </Text>
    <Text style={styles.treeImpactDesc}>
      needed to absorb this daily emission
    </Text>
  </View>
)}
```

5. **Update All Styles to Use Theme**:
Replace all hardcoded colors with theme colors:
```javascript
const { theme } = useTheme();

const styles = createStyles(theme);

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  heroSubtitle: {
    color: theme.secondary,
    // ... other styles
  },
  // Update ALL color references
});
```

### Update Other Screens with Theme

#### DashboardScreen.js
```javascript
import { useTheme } from '../theme/ThemeContext';

export default function DashboardScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  // ... rest of component
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  // Update all colors to use theme
});
```

#### RiverMonitorScreen.js
- Same pattern as above
- Update map style colors based on theme
- Update all text and card colors

#### AlertsScreen.js
- Same pattern
- Update alert severity colors to use theme

#### MarineDetectionScreen.js
- Already has neon green accent
- Update to use theme.accent instead of hardcoded #00ff88
- Update background and text colors

## 📦 REQUIRED PACKAGES

Add to `Frontend/package.json`:
```json
{
  "dependencies": {
    "expo-location": "~18.0.4",
    "flask-cors": "latest" // For backend
  }
}
```

Install:
```bash
cd Frontend
npm install expo-location

cd ../Backend
pip install flask-cors
```

## 🚀 RUNNING THE APP

### Backend:
```bash
cd Backend
python app.py
```

### Frontend:
```bash
cd Frontend
npm start
```

### Update Backend URL:
In `PlantTreeScreen.js`, update:
```javascript
const BACKEND_URL = 'http://YOUR_LOCAL_IP:5000';
```

Find your local IP:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig`

## 🎨 THEME COLORS REFERENCE

### Dark Theme (Default):
- Background: `#000`
- Text: `#fff`
- Card: `#111`
- Accent: `#00ff88` (neon green)
- Secondary: `#666`

### Light Theme:
- Background: `#ffffff`
- Text: `#000`
- Card: `#f2f2f2`
- Accent: `#007f5f` (teal)
- Secondary: `#666`

## 🔧 TESTING CHECKLIST

- [ ] Theme toggle works in menu
- [ ] All screens adapt to theme changes
- [ ] Plant tree gets GPS location
- [ ] Plant tree sends to backend successfully
- [ ] Duplicate tree prevention works
- [ ] CO₂ calculator shows tree equivalent
- [ ] Tree impact alert appears when threshold exceeded
- [ ] Navigation to PlantTree from alert works
- [ ] Backend returns planted trees list
- [ ] Marine detection still works

## 📝 ARCHITECTURE

```
Frontend/
├── App.js (ThemeProvider wrapper)
├── theme/
│   └── ThemeContext.js
├── screens/
│   ├── HomeScreen.js (CO₂ + Tree Impact)
│   ├── DashboardScreen.js
│   ├── RiverMonitorScreen.js
│   ├── AlertsScreen.js
│   ├── MarineDetectionScreen.js
│   └── PlantTreeScreen.js (NEW)

Backend/
├── app.py (Flask + SQLite)
└── trees.db (Auto-created)
```

## 🎯 KEY FEATURES

1. **Global Theme System**: Dark/Light toggle affects entire app
2. **CO₂ Tree Psychology**: Behavioral nudge to plant trees
3. **Geo-Validated Planting**: GPS + duplicate prevention
4. **Clean Architecture**: Modular, scalable, production-ready
5. **Premium UI**: Command-center aesthetic maintained

## 🌟 NEXT STEPS

1. Update remaining screens with theme support
2. Add CO₂ tree impact logic to HomeScreen
3. Test end-to-end flow
4. Deploy backend to cloud (optional)
5. Add map visualization for planted trees (optional enhancement)
