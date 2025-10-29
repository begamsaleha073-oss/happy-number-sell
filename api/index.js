const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// CORS properly configure karein
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// API Key
const API_KEY = process.env.FIREX_API_KEY || 'g18m2iehorj978taaw4ymb9yipnqyjga';
const BASE_URL = 'https://firexotp.com/stubs/handler_api.php';

// Get Number API
app.get('/api/getNumber', async (req, res) => {
    try {
        console.log('Calling FirexOTP API...');
        const apiUrl = `${BASE_URL}?action=getNumber&api_key=${API_KEY}&service=wa&country=51`;
        console.log('API URL:', apiUrl);
        
        const response = await axios.get(apiUrl, {
            timeout: 10000
        });
        
        console.log('Raw API Response:', response.data);
        
        const parts = response.data.split(':');
        if (parts[0] === 'ACCESS_NUMBER' && parts.length === 3) {
            res.json({
                success: true,
                id: parts[1],
                number: parts[2]
            });
        } else {
            res.json({
                success: false,
                error: response.data
            });
        }
    } catch (error) {
        console.error('Get Number Error:', error.message);
        res.status(500).json({
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
            return res.status(400).json({
                success: false,
                error: 'ID parameter is required'
            });
        }
        
        const response = await axios.get(`${BASE_URL}?action=getStatus&api_key=${API_KEY}&id=${id}`, {
            timeout: 10000
        });
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Get OTP Error:', error.message);
        res.status(500).json({
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
            return res.status(400).json({
                success: false,
                error: 'ID parameter is required'
            });
        }
        
        const response = await axios.get(`${BASE_URL}?action=setStatus&api_key=${API_KEY}&id=${id}&status=8`, {
            timeout: 10000
        });
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Cancel Number Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'API call failed: ' + error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Export for Vercel
module.exports = app;
