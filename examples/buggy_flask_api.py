// Example 2: Python Flask API with bugs
// File: buggy_flask_api.py

from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# BUG 1: Hardcoded secret key
SECRET_KEY = "admin123"

# BUG 2: No database connection handling
def get_db():
    conn = sqlite3.connect('users.db')
    return conn

@app.route('/login', methods=['POST'])
def login():
    # BUG 3: No input validation
    username = request.json['username']
    password = request.json['password']
    
    # BUG 4: SQL Injection vulnerability
    conn = get_db()
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    cursor.execute(query)
    user = cursor.fetchone()
    
    # BUG 5: Password stored in plain text comparison
    if user:
        return jsonify({"status": "success", "user": user})
    else:
        return jsonify({"status": "failed"})

@app.route('/users', methods=['GET'])
def get_users():
    # BUG 6: No authentication check
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    # BUG 7: Exposing all user data including passwords
    return jsonify(users)

@app.route('/delete/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    # BUG 8: No authorization check
    # BUG 9: SQL Injection in delete
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM users WHERE id={user_id}")
    conn.commit()
    return jsonify({"status": "deleted"})

if __name__ == '__main__':
    # BUG 10: Debug mode in production
    app.run(debug=True, host='0.0.0.0')
