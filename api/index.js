const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Your API Key - Vercel environment variable se milega
const API_KEY = process.env.FIREX_API_KEY || 'g18m2iehorj978taaw4ymb9yipnqyjga';
const BASE_URL = 'https://firexotp.com/stubs/handler_api.php';

// Get Number API
app.get('/api/getNumber', async (req, res) => {
    try {
        console.log('Getting Philippines WhatsApp number...');
        const response = await axios.get(`${BASE_URL}?action=getNumber&api_key=${API_KEY}&service=wa&country=51`);
        
        console.log('API Response:', response.data);
        
        // Parse response: ACCESS_NUMBER:ID:NUMBER
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
        console.error('Get Number Error:', error);
        res.json({
            success: false,
            error: 'API call failed'
        });
    }
});

// Get OTP API
app.get('/api/getOtp', async (req, res) => {
    try {
        const { id } = req.query;
        console.log('Getting OTP for ID:', id);
        
        const response = await axios.get(`${BASE_URL}?action=getStatus&api_key=${API_KEY}&id=${id}`);
        
        console.log('OTP Response:', response.data);
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Get OTP Error:', error);
        res.json({
            success: false,
            error: 'API call failed'
        });
    }
});

// Cancel Number API
app.get('/api/cancelNumber', async (req, res) => {
    try {
        const { id } = req.query;
        console.log('Cancelling number with ID:', id);
        
        const response = await axios.get(`${BASE_URL}?action=setStatus&api_key=${API_KEY}&id=${id}&status=8`);
        
        console.log('Cancel Response:', response.data);
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Cancel Number Error:', error);
        res.json({
            success: false,
            error: 'API call failed'
        });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Export for Vercel
module.exports = app;
