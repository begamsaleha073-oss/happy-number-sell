from flask import Flask, jsonify, send_from_directory, request
import requests
import os

app = Flask(__name__)

# Your API Key
API_KEY = os.environ.get('FIREX_API_KEY', 'g18m2iehorj978taaw4ymb9yipnqyjga')
BASE_URL = 'https://firexotp.com/stubs/handler_api.php'

# CORS setup
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'Server is running smoothly',
        'timestamp': '2024-01-01T00:00:00Z'
    })

# Get Number API
@app.route('/api/getNumber', methods=['GET'])
def get_number():
    try:
        print('Getting Philippines WhatsApp number...')
        api_url = f'{BASE_URL}?action=getNumber&api_key={API_KEY}&service=wa&country=51'
        
        response = requests.get(api_url, timeout=10)
        response_data = response.text
        
        print('FirexOTP Response:', response_data)
        
        # Parse response: ACCESS_NUMBER:ID:NUMBER
        parts = response_data.split(':')
        if parts[0] == 'ACCESS_NUMBER' and len(parts) == 3:
            return jsonify({
                'success': True,
                'id': parts[1],
                'number': parts[2],
                'message': 'Number obtained successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': f'Invalid response format: {response_data}'
            })
            
    except Exception as e:
        print('Get Number Error:', str(e))
        return jsonify({
            'success': False,
            'error': f'API call failed: {str(e)}'
        })

# Get OTP API
@app.route('/api/getOtp', methods=['GET'])
def get_otp():
    try:
        request_id = request.args.get('id')
        if not request_id:
            return jsonify({
                'success': False,
                'error': 'ID parameter is required'
            })
        
        print('Getting OTP for ID:', request_id)
        api_url = f'{BASE_URL}?action=getStatus&api_key={API_KEY}&id={request_id}'
        
        response = requests.get(api_url, timeout=10)
        response_data = response.text
        
        print('OTP Response:', response_data)
        return jsonify({
            'success': True,
            'data': response_data,
            'message': 'OTP status checked'
        })
        
    except Exception as e:
        print('Get OTP Error:', str(e))
        return jsonify({
            'success': False,
            'error': f'API call failed: {str(e)}'
        })

# Cancel Number API
@app.route('/api/cancelNumber', methods=['GET'])
def cancel_number():
    try:
        request_id = request.args.get('id')
        if not request_id:
            return jsonify({
                'success': False,
                'error': 'ID parameter is required'
            })
        
        print('Cancelling number with ID:', request_id)
        api_url = f'{BASE_URL}?action=setStatus&api_key={API_KEY}&id={request_id}&status=8'
        
        response = requests.get(api_url, timeout=10)
        response_data = response.text
        
        print('Cancel Response:', response_data)
        return jsonify({
            'success': True,
            'data': response_data,
            'message': 'Number cancelled successfully'
        })
        
    except Exception as e:
        print('Cancel Number Error:', str(e))
        return jsonify({
            'success': False,
            'error': f'API call failed: {str(e)}'
        })

# Serve frontend - yeh important hai
@app.route('/', methods=['GET'])
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Vercel ke liye specific handler
def handler(request, context):
    return app(request, context)

if __name__ == '__main__':
    app.run(debug=True)
