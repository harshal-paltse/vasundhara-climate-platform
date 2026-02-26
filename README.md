# 🌳 Vasundhara - Climate Action Platform

> AI-powered environmental intelligence platform combining tree planting, CO₂ tracking, marine debris detection, and river pollution monitoring.

[![React Native](https://img.shields.io/badge/React%20Native-0.76-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-black.svg)](https://expo.dev/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Features

### 🌳 Tree Planting System
- GPS-validated tree planting with duplicate prevention
- Real-time location tracking using Expo Location
- Geo-coordinate storage in SQLite database
- Tree impact calculation (21kg CO₂/year per tree)

### 🔥 Daily Streak Tracking
- Gamified daily engagement system
- Automatic streak increment logic
- Longest streak tracking
- Visual progress bar (0-30 days)
- Milestone markers at 7, 15, and 30 days

### 🏆 Achievement Badge System
- **7 Day Eco Warrior 🌿** - Complete 7-day streak
- **15 Day Green Champion 🌳** - Complete 15-day streak
- **30 Day Climate Guardian 🌍** - Complete 30-day streak
- **Carbon Conscious Citizen 🌱** - Complete CO₂ calculation
- Animated badge award modals with confetti
- Duplicate badge prevention

### 📊 CO₂ Footprint Calculator
- Real-time emission calculation
- Input tracking for:
  - Electricity usage (kWh)
  - Vehicle travel (km)
  - Plastic usage (kg)
  - LPG consumption (kg)
  - Waste generation (kg)
- Tree equivalent display
- Behavioral psychology nudges

### 🤖 Marine Debris AI Detection
- Satellite imagery analysis
- Real-time debris classification
- Confidence score visualization
- Horizontal probability bars
- ML pipeline visualization

### 🌊 River Pollution Monitoring
- Google Maps integration with dark theme
- Real-time pollution hotspot markers
- Heatmap visualization
- Debris detection zones
- Cleanup coordination dashboard

### 🎨 Theme System
- Dark mode (default): Black background, neon green accent
- Light mode: White background, teal accent
- Global theme context
- Smooth theme transitions
- All screens theme-compatible

## 🏗️ Architecture

```
Vasundhara/
├── Frontend/                 # React Native (Expo) App
│   ├── screens/
│   │   ├── HomeScreen.js            # CO₂ calculator & stats
│   │   ├── DashboardScreen.js       # User engagement & challenges
│   │   ├── PlantTreeScreen.js       # Tree planting & streaks
│   │   ├── RiverMonitorScreen.js    # River pollution monitoring
│   │   ├── AlertsScreen.js          # Environmental alerts
│   │   └── MarineDetectionScreen.js # AI debris detection
│   ├── theme/
│   │   └── ThemeContext.js          # Global theme provider
│   ├── App.js                       # Navigation & menu
│   └── package.json
│
├── Backend/                  # Flask API Server
│   ├── app.py                       # Main Flask application
│   └── trees.db                     # SQLite database
│
└── Documentation/
    ├── README.md
    ├── GITHUB_PUSH_GUIDE.md
    ├── IMPLEMENTATION_GUIDE.md
    ├── STREAK_BADGE_IMPLEMENTATION.md
    └── SYSTEM_STATUS.md
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_plant_date TEXT
);
```

### Trees Table
```sql
CREATE TABLE trees (
    id INTEGER PRIMARY KEY,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    user_id INTEGER DEFAULT 1,
    planted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Badges Table
```sql
CREATE TABLE badges (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    badge_type TEXT NOT NULL,
    date_awarded TEXT NOT NULL
);
```

## 📡 API Endpoints

### Tree Planting
- `POST /plant` - Plant tree with streak tracking
  ```json
  Request: {
    "latitude": 28.7041,
    "longitude": 77.1025,
    "user_id": 1
  }
  Response: {
    "status": "success",
    "tree_id": 123,
    "current_streak": 5,
    "longest_streak": 10,
    "streak_increased": true,
    "badge_awarded": {
      "name": "7 Day Eco Warrior 🌿",
      "milestone": 7
    }
  }
  ```

- `GET /trees` - Get all planted trees

### Streak System
- `GET /streak/<user_id>` - Get user streak data

### Badge System
- `GET /badges/<user_id>` - Get user badges
- `POST /co2-complete` - Award CO₂ calculation badge

### AI Detection
- `POST /predict` - Marine debris AI prediction

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- Expo Go app on your mobile device
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install Python dependencies
pip install flask flask-cors

# Run the server
python app.py
```

Backend will start on: `http://0.0.0.0:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Install additional packages
npm install expo-location

# Start Expo development server
npm start
```

### Update Backend URL

In `Frontend/screens/PlantTreeScreen.js`, update the backend URL:
```javascript
const BACKEND_URL = 'http://YOUR_LOCAL_IP:5000';
```

Find your local IP:
- **Windows**: `ipconfig` (look for IPv4 Address)
- **Mac/Linux**: `ifconfig` (look for inet)

### Run on Device

1. Install **Expo Go** app on your phone
2. Scan the QR code from terminal
3. App will open in Expo Go

## 🧪 Testing

### Test Streak Logic
1. Plant a tree today → Streak = 1
2. Plant a tree tomorrow → Streak = 2
3. Plant a tree same day → Streak stays 2
4. Skip 2 days, then plant → Streak resets to 1

### Test Badge System
1. Reach 7-day streak → Earn "7 Day Eco Warrior 🌿"
2. Reach 15-day streak → Earn "15 Day Green Champion 🌳"
3. Reach 30-day streak → Earn "30 Day Climate Guardian 🌍"
4. Complete CO₂ calculation → Earn "Carbon Conscious Citizen 🌱"

## 🎯 Behavior Psychology

### Engagement Loop
1. **Trigger**: User sees streak counter
2. **Action**: Plants tree to maintain streak
3. **Reward**: Streak increases, badge earned
4. **Investment**: User commits to daily habit

### Gamification Elements
- Progress tracking (streak counter)
- Milestones (7, 15, 30 days)
- Rewards (badges)
- Loss aversion (fear of losing streak)
- Social proof (longest streak)
- Achievement unlocking

## 🛠️ Tech Stack

### Frontend
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation (Stack Navigator)
- **Maps**: React Native Maps with Google Maps
- **Location**: Expo Location
- **Animations**: React Native Animated API
- **State Management**: React Hooks (useState, useContext)

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite3
- **CORS**: Flask-CORS
- **API**: RESTful architecture

### Design
- **Theme**: Dark/Light mode with Context API
- **UI Style**: Premium command-center aesthetic
- **Colors**: Black/White with neon green accent
- **Typography**: Bold, minimal

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/harshal-paltse)
- Email: harshalpaltse@gmail.com

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- Flask community
- All contributors to this project

## 📞 Support
9359947410

For support, email your harshalpaltse@gmail.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] User authentication system
- [ ] Social sharing features
- [ ] Push notifications for streak reminders
- [ ] Leaderboard system
- [ ] Team challenges
- [ ] IoT sensor integration
- [ ] Real-time satellite data
- [ ] Mobile app deployment (iOS/Android).
      

---

**Made with 💚 for the planet**
