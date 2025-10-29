const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Configuration
const API_CONFIG = {
    baseUrl: 'https://firexotp.com/stubs/handler_api.php',
    apiKey: process.env.API_KEY || 'g18m2iehorj978taaw4ymb9yipnqyjga'
};

// Security Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API Routes
app.get('/api/getNumber', async (req, res) => {
    try {
        const { service = 'wa', country = '51' } = req.query;
        
        const url = `${API_CONFIG.baseUrl}?action=getNumber&api_key=${API_CONFIG.apiKey}&service=${service}&country=${country}`;
        
        const response = await axios.get(url, { timeout: 10000 });
        
        if (response.data.startsWith('ACCESS_NUMBER:')) {
            const parts = response.data.split(':');
            res.json({
                success: true,
                id: parts[1],
                number: parts[2],
                raw: response.data
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
            error: error.message
        });
    }
});

app.get('/api/getOtp', async (req, res) => {
    try {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }
        
        const url = `${API_CONFIG.baseUrl}?action=getStatus&api_key=${API_CONFIG.apiKey}&id=${id}`;
        
        const response = await axios.get(url, { timeout: 10000 });
        
        if (response.data.startsWith('STATUS_OK:')) {
            const otp = response.data.split(':')[1];
            res.json({
                success: true,
                otp: otp,
                status: 'received',
                raw: response.data
            });
        } else if (response.data.includes('STATUS_WAIT_CODE')) {
            res.json({
                success: true,
                otp: null,
                status: 'waiting',
                raw: response.data
            });
        } else {
            res.json({
                success: false,
                error: response.data
            });
        }
    } catch (error) {
        console.error('Get OTP Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/cancelRequest', async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }
        
        const url = `${API_CONFIG.baseUrl}?action=setStatus&api_key=${API_CONFIG.apiKey}&id=${id}&status=8`;
        
        const response = await axios.get(url, { timeout: 10000 });
        
        if (response.data === 'ACCESS_CANCEL') {
            res.json({
                success: true,
                message: 'Request cancelled successfully'
            });
        } else {
            res.json({
                success: false,
                error: response.data
            });
        }
    } catch (error) {
        console.error('Cancel Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Virtual Number Service Backend Ready`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
