# -*- coding: utf-8 -*-
"""
脆弱なFlaskアプリ (学習・検証用)
=================================
このコードは意図的にセキュリティ上の欠陥を含んでいます。
絶対に本番環境では使用しないでください。

含まれる脆弱性:
- SECRET_KEYの直書き
- debug=True の有効化
- 環境変数を使わず平文でDB接続情報を記載
- SQLインジェクション
- XSS (autoescape無効化)
- CSRF対策なし
- パスワードの平文保存
- ファイルアップロード制限なし
"""

from flask import Flask, request, render_template_string
import sqlite3
import os

app = Flask(__name__)

# 脆弱: SECRET_KEY をソースに直書き
app.config['SECRET_KEY'] = 'secretkey12345678'

# 脆弱: データベース情報も直書き
DB_PATH = 'users.db'

# 脆弱: デバッグモード有効化
app.debug = True

# デモ用DB作成（パスワード平文保存）
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT)')
    c.execute('INSERT INTO users VALUES ("admin", "password123")')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    # 脆弱: autoescape無効化 → XSS可能
    template = """
    {% autoescape false %}
    <h1>ようこそ {{ name }}</h1>
    {% endautoescape %}
    """
    name = request.args.get('name', 'ゲスト')
    return render_template_string(template, name=name)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # 脆弱: SQLインジェクション可能
        username = request.form['username']
        password = request.form['password']
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
        c.execute(query)
        user = c.fetchone()
        conn.close()
        if user:
            return "ログイン成功"
        else:
            return "ログイン失敗"
    return '''
        <form method="POST">
            ユーザー名: <input name="username"><br>
            パスワード: <input name="password" type="password"><br>
            <input type="submit" value="ログイン">
        </form>
    '''

@app.route('/upload', methods=['POST'])
def upload():
    # 脆弱: ファイル種類チェックなし、ディレクトリに直接保存
    f = request.files['file']
    f.save(f.filename)
    return "アップロード完了"

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)
