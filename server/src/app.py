import json
from flask import Flask, request, jsonify, g
from v1.dog.router import DogRouter
from v1.auth import login as auth_login, verify_token as auth_verify_token
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'I/L0ve/CIT-U'
app.config['CORS_HEADERS'] = ['Content-Type', 'authorization']

#CORS(app)
CORS(app, resources={r"*": {"origins": [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
]}},  supports_credentials=True)

app.register_blueprint(DogRouter.handler())

@app.route('/v1/login', methods=['POST'])
def login():
    data = request.json
    if 'username' in data and 'password' in data:
        token = auth_login(data['username'], data['password'])
        if token is not False:
            return jsonify({'token': token})
    return jsonify({'message': 'Invalid username or password'}), 403

@app.route('/v1/login')
def home():
    return jsonify({'message': 'hello world'})

@app.route('/v1/verify-token')
def verify_token():
    token = request.args.get('token')
    if not auth_verify_token(token):
        return jsonify({'message': 'Invalid token'}), 403
    return jsonify({'ok': 'Token is valid'})

@app.route('/cats', methods=['POST', 'GET', 'PUT', 'DELETE'])
def cats():
    cat = Cat()
    if str(request.method).upper() == 'POST':
        resp = cat.post(request.json)
        if resp == False:
            return make_response(jsonify({
                "error": "Failed to add. There are items in your request that are invalid."
            }), 400)
        return jsonify(resp)
    if str(request.method).upper() == 'PUT':
        return jsonify(cat.put(request.json))
    if str(request.method).upper() == 'DELETE':
        return jsonify(cat.delete(request.json))
    cats = cat.get()
    return jsonify(cats)

@app.route('/cats/<cat_id>', methods=['GET', 'PUT', 'DELETE'])
def cat(cat_id):
    cat_object = Cat()
    cat = cat_object.get({"id": cat_id})
    if cat is None:
        return make_response(jsonify({"error": "Cat id not found."}), 404)
    if str(request.method).upper() == 'PUT':
        cat_data = request.json
        cat_data['id'] = cat_id
        resp = cat_object.put(cat_data)
        if resp == False:
            return make_response(jsonify({
                "error": "Failed to update. There are items in your request that are invalid."
            }), 400)
        return jsonify(resp)
    if str(request.method).upper() == 'DELETE':
        return jsonify(cat_object.delete(cat_id))
    return jsonify(cat)

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=8080)
