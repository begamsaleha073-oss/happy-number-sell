const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// CORS setup
app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static('public'));

// API Key
const API_KEY = process.env.FIREX_API_KEY || 'g18m2iehorj978taaw4ymb9yipnqyjga';
const BASE_URL = 'https://firexotp.com/stubs/handler_api.php';

// Health check endpoint - Simple JSON return karega
app.get('/api/health', (req, res) => {
    console.log('Health check called');
    res.json({ 
        status: 'OK', 
        message: 'Server is running smoothly',
        timestamp: new Date().toISOString()
    });
});

// Get Number API
app.get('/api/getNumber', async (req, res) => {
    try {
        console.log('Getting Philippines WhatsApp number...');
        const apiUrl = `${BASE_URL}?action=getNumber&api_key=${API_KEY}&service=wa&country=51`;
        
        const response = await axios.get(apiUrl, {
            timeout: 10000
        });
        
        console.log('FirexOTP Response:', response.data);
        
        // Parse response: ACCESS_NUMBER:ID:NUMBER
        const parts = response.data.split(':');
        if (parts[0] === 'ACCESS_NUMBER' && parts.length === 3) {
            res.json({
                success: true,
                id: parts[1],
                number: parts[2],
                message: 'Number obtained successfully'
            });
        } else {
            res.json({
                success: false,
                error: 'Invalid response format: ' + response.data
            });
        }
    } catch (error) {
        console.error('Get Number Error:', error.message);
        res.json({
            success: false,
            error: 'API call failed: ' + error.message
        });
    }
});

// Get OTP API
app.get('/api/getOtp', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.json({
                success: false,
                error: 'ID parameter is required'
            });
        }
        
        console.log('Getting OTP for ID:', id);
        const response = await axios.get(`${BASE_URL}?action=getStatus&api_key=${API_KEY}&id=${id}`, {
            timeout: 10000
        });
        
        console.log('OTP Response:', response.data);
        res.json({
            success: true,
            data: response.data,
            message: 'OTP status checked'
        });
    } catch (error) {
        console.error('Get OTP Error:', error.message);
        res.json({
            success: false,
            error: 'API call failed: ' + error.message
        });
    }
});

// Cancel Number API
app.get('/api/cancelNumber', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.json({
                success: false,
                error: 'ID parameter is required'
            });
        }
        
        console.log('Cancelling number with ID:', id);
        const response = await axios.get(`${BASE_URL}?action=setStatus&api_key=${API_KEY}&id=${id}&status=8`, {
            timeout: 10000
        });
        
        console.log('Cancel Response:', response.data);
        res.json({
            success: true,
            data: response.data,
            message: 'Number cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel Number Error:', error.message);
        res.json({
            success: false,
            error: 'API call failed: ' + error.message
        });
    }
});

// Root route - frontend serve karega
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Export for Vercel
module.exports = app;
