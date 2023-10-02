from flask import Flask, request, json, Response
from flask_mysqldb import MySQL
from flask_cors import CORS
import MySQLdb.cursors
import re, hashlib

app = Flask(__name__)
CORS(app)

app.secret_key = "I like curry"
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'quanquan123'
app.config['MYSQL_DB'] = 'Algorand_POS'

mysql = MySQL(app)

@app.route("/")
def setup():
    username = "admin"
    role = "admin"
    hash = "admin" + app.secret_key
    hash = hashlib.sha1(hash.encode())
    password = hash.hexdigest()
    print(password)

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("INSERT INTO users VALUES(0,%s,%s,%s,0)", (username, password, role))
    return password


@app.route("/login", methods=["GET","POST","OPTIONS"])
def login():
    if request.method == "POST":
        username = request.get_json()["username"]
        password = request.get_json()["password"]

        hash = password + app.secret_key
        hash = hashlib.sha1(hash.encode())
        password = hash.hexdigest()

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT UID, username, role FROM users WHERE username = %s AND password = %s", (username,password))

        account = cursor.fetchone()
        if account:
            resp = Response()
            resp.response = json.dumps(account)
            resp.access_control_allow_origin = '*'
            resp.status_code = 200
            resp.mimetype = "application/json"
            return resp
        else:
            resp = Response("No matched user found")
            resp.access_control_allow_origin = '*'
            resp.status_code = 500
            return resp
    return "Only Access with Post request"

@app.route("/adduser", methods=["GET","POST","OPTIONS"])
def adduser():
    if request.method == "POST":
        username = request.get_json()["username"]
        password = request.get_json()["password"]
        role = request.get_json()["role"]

        hash = password + app.secret_key
        hash = hashlib.sha1(hash.encode())
        password = hash.hexdigest()

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT UID, username, role FROM users WHERE username = %s", (username,))

        account = cursor.fetchone()
        if account:
            resp = Response("No matched user found")
            resp.access_control_allow_origin = '*'
            resp.status_code = 500
            return resp
        else:
            affected_row = cursor.execute("Insert into users(username,password,role) Values (%s,%s,%s)", (username,password,role))
            resp = Response()
            resp.access_control_allow_origin = '*'
            if affected_row > 0:
                resp.status_code = 200
                mysql.connection.commit()
            else:
                resp.status_code = 500
            return resp

    return "Only Access with Post request"


@app.route("/resetpassword", methods=["GET","POST","OPTIONS"])
def resetPassword():
    if request.method == "POST":
        username = request.get_json()["username"]
        password = request.get_json()["password"]

        hash = password + app.secret_key
        hash = hashlib.sha1(hash.encode())
        password = hash.hexdigest()

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM users WHERE username = %s",(username,))
        account = cursor.fetchone()

        if account:
            row_affected = cursor.execute("UPDATE users SET password=%s WHERE UID = %s",
                           (password, account['UID']))
            resp = Response()
            resp.access_control_allow_origin = '*'
            if row_affected > 0:
                mysql.connection.commit()
                resp.status_code = 200
            else:
                resp.status_code = 500
            print("Success")
            return resp
        else:
            resp = Response("No matched user found")
            resp.access_control_allow_origin = '*'
            resp.status_code = 500
            return resp
    return "Only Access with Post request"


@app.route("/deleteuser", methods=["GET","POST","OPTIONS"])
def deleteuser():
    if request.method == "POST":
        username = request.get_json()["username"]

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT UID, username, role FROM users WHERE username = %s", (username,))

        account = cursor.fetchone()

        if account:
            row_affected = cursor.execute("DELETE FROM users WHERE username = %s", (username,))
            resp = Response()
            resp.access_control_allow_origin = '*'
            if row_affected > 0:
                mysql.connection.commit()
                resp.status_code = 200
            else:
                resp.status_code = 500
            return resp
        else:
            resp = Response("No matched user found")
            resp.access_control_allow_origin = '*'
            resp.status_code = 500
            return resp
    return "Only Access with Post request"


if __name__ == "__main__":
    app.run(debug=True)