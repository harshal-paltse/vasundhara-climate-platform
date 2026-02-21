from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Database setup
DB_PATH = 'trees.db'

def init_db():
    """Initialize the database with all required tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Trees table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS trees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            user_id INTEGER DEFAULT 1,
            planted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Users table for streak tracking
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT DEFAULT 'User',
            current_streak INTEGER DEFAULT 0,
            longest_streak INTEGER DEFAULT 0,
            last_plant_date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Badges table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            badge_type TEXT NOT NULL,
            date_awarded TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create default user if not exists
    cursor.execute('SELECT id FROM users WHERE id = 1')
    if not cursor.fetchone():
        cursor.execute('INSERT INTO users (id, name) VALUES (1, "Climate Warrior")')
    
    conn.commit()
    conn.close()

def get_user_streak(user_id=1):
    """Get current user streak data"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        'SELECT current_streak, longest_streak, last_plant_date FROM users WHERE id = ?',
        (user_id,)
    )
    result = cursor.fetchone()
    conn.close()
    
    if result:
        return {
            'current_streak': result[0] or 0,
            'longest_streak': result[1] or 0,
            'last_plant_date': result[2]
        }
    return {'current_streak': 0, 'longest_streak': 0, 'last_plant_date': None}

def update_streak(user_id=1):
    """Update user streak based on planting date logic"""
    today = datetime.now().date().isoformat()
    streak_data = get_user_streak(user_id)
    
    current_streak = streak_data['current_streak']
    longest_streak = streak_data['longest_streak']
    last_plant_date = streak_data['last_plant_date']
    
    streak_increased = False
    
    if last_plant_date:
        last_date = datetime.fromisoformat(last_plant_date).date()
        today_date = datetime.now().date()
        
        # If planted today already, don't increment
        if last_date == today_date:
            pass
        # If planted yesterday, increment streak
        elif last_date == today_date - timedelta(days=1):
            current_streak += 1
            streak_increased = True
        # If gap > 1 day, reset streak
        else:
            current_streak = 1
            streak_increased = True
    else:
        # First plant ever
        current_streak = 1
        streak_increased = True
    
    # Update longest streak if needed
    if current_streak > longest_streak:
        longest_streak = current_streak
    
    # Update database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE users 
        SET current_streak = ?, longest_streak = ?, last_plant_date = ?
        WHERE id = ?
    ''', (current_streak, longest_streak, today, user_id))
    conn.commit()
    conn.close()
    
    return {
        'current_streak': current_streak,
        'longest_streak': longest_streak,
        'streak_increased': streak_increased
    }

def check_and_award_badge(user_id, badge_type):
    """Check if badge already exists, if not award it"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if badge already awarded
    cursor.execute(
        'SELECT id FROM badges WHERE user_id = ? AND badge_type = ?',
        (user_id, badge_type)
    )
    existing = cursor.fetchone()
    
    if existing:
        conn.close()
        return False
    
    # Award new badge
    today = datetime.now().date().isoformat()
    cursor.execute(
        'INSERT INTO badges (user_id, badge_type, date_awarded) VALUES (?, ?, ?)',
        (user_id, badge_type, today)
    )
    conn.commit()
    conn.close()
    
    return True

# Initialize database on startup
init_db()

@app.route("/predict", methods=["POST"])
def predict():
    """Marine debris AI prediction endpoint"""
    # Replace with actual model inference
    fake_prediction = [0.94, 0.87, 0.76, 0.62, 0.45, 0.28]
    return jsonify({"prediction": fake_prediction})

@app.route("/plant", methods=["POST"])
def plant_tree():
    """Plant a tree at given coordinates with streak tracking"""
    try:
        data = request.get_json()
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        user_id = data.get('user_id', 1)
        
        if latitude is None or longitude is None:
            return jsonify({"status": "error", "message": "Missing coordinates"}), 400
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check if tree already exists at exact coordinates
        cursor.execute(
            'SELECT id FROM trees WHERE latitude = ? AND longitude = ?',
            (latitude, longitude)
        )
        existing = cursor.fetchone()
        
        if existing:
            conn.close()
            return jsonify({"status": "rejected", "message": "Tree already planted at this location"})
        
        # Insert new tree
        cursor.execute(
            'INSERT INTO trees (latitude, longitude, user_id) VALUES (?, ?, ?)',
            (latitude, longitude, user_id)
        )
        conn.commit()
        tree_id = cursor.lastrowid
        conn.close()
        
        # Update streak
        streak_data = update_streak(user_id)
        
        # Check for milestone badges
        badge_awarded = None
        current_streak = streak_data['current_streak']
        
        if current_streak == 7:
            if check_and_award_badge(user_id, "7 Day Eco Warrior 🌿"):
                badge_awarded = {"name": "7 Day Eco Warrior 🌿", "milestone": 7}
        elif current_streak == 15:
            if check_and_award_badge(user_id, "15 Day Green Champion 🌳"):
                badge_awarded = {"name": "15 Day Green Champion 🌳", "milestone": 15}
        elif current_streak == 30:
            if check_and_award_badge(user_id, "30 Day Climate Guardian 🌍"):
                badge_awarded = {"name": "30 Day Climate Guardian 🌍", "milestone": 30}
        
        return jsonify({
            "status": "success",
            "message": "Tree planted successfully",
            "tree_id": tree_id,
            "current_streak": streak_data['current_streak'],
            "longest_streak": streak_data['longest_streak'],
            "streak_increased": streak_data['streak_increased'],
            "badge_awarded": badge_awarded
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/trees", methods=["GET"])
def get_trees():
    """Get all planted trees"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT id, latitude, longitude, planted_at FROM trees ORDER BY id DESC')
        rows = cursor.fetchall()
        conn.close()
        
        trees = [
            {
                "id": row[0],
                "latitude": row[1],
                "longitude": row[2],
                "planted_at": row[3]
            }
            for row in rows
        ]
        
        return jsonify({
            "trees": trees,
            "total": len(trees)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/badges/<int:user_id>", methods=["GET"])
def get_badges(user_id):
    """Get all badges for a user"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            'SELECT id, badge_type, date_awarded FROM badges WHERE user_id = ? ORDER BY date_awarded DESC',
            (user_id,)
        )
        rows = cursor.fetchall()
        conn.close()
        
        badges = [
            {
                "id": row[0],
                "badge_type": row[1],
                "date_awarded": row[2]
            }
            for row in rows
        ]
        
        return jsonify({
            "badges": badges,
            "total": len(badges)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/co2-complete", methods=["POST"])
def co2_complete():
    """Award badge for completing CO2 calculation"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 1)
        total_co2 = data.get('total_co2', 0)
        
        if total_co2 <= 0:
            return jsonify({"status": "error", "message": "Invalid CO2 value"}), 400
        
        # Award badge if not already awarded
        badge_type = "Carbon Conscious Citizen 🌱"
        badge_awarded = check_and_award_badge(user_id, badge_type)
        
        return jsonify({
            "status": "success",
            "badge_awarded": badge_awarded,
            "badge_name": badge_type if badge_awarded else None
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/streak/<int:user_id>", methods=["GET"])
def get_streak(user_id):
    """Get user streak data"""
    try:
        streak_data = get_user_streak(user_id)
        return jsonify(streak_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🌳 Vasundhara Backend Server Starting...")
    print("📍 Tree Planting API: http://0.0.0.0:5000/plant")
    print("🌲 Get Trees API: http://0.0.0.0:5000/trees")
    print("🔥 Streak API: http://0.0.0.0:5000/streak/<user_id>")
    print("🏆 Badges API: http://0.0.0.0:5000/badges/<user_id>")
    print("🌱 CO2 Complete API: http://0.0.0.0:5000/co2-complete")
    print("🤖 Marine AI API: http://0.0.0.0:5000/predict")
    app.run(host="0.0.0.0", port=5000, debug=True)
