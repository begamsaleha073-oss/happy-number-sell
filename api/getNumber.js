const axios = require('axios');

const API_KEY = process.env.FIREX_API_KEY || 'g18m2iehorj978taaw4ymb9yipnqyjga';
const BASE_URL = 'https://firexotp.com/stubs/handler_api.php';

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('Getting Philippines WhatsApp number...');
    const apiUrl = `${BASE_URL}?action=getNumber&api_key=${API_KEY}&service=wa&country=51`;
    
    const response = await axios.get(apiUrl, { timeout: 10000 });
    console.log('FirexOTP Response:', response.data);
    
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
};
