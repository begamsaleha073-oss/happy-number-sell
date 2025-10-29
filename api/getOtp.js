const axios = require('axios');

const API_KEY = process.env.FIREX_API_KEY || 'g18m2iehorj978taaw4ymb9yipnqyjga';
const BASE_URL = 'https://firexotp.com/stubs/handler_api.php';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { id } = req.query;
    if (!id) {
      return res.json({
        success: false,
        error: 'ID parameter is required'
      });
    }

    console.log('Getting OTP for ID:', id);
    const apiUrl = `${BASE_URL}?action=getStatus&api_key=${API_KEY}&id=${id}`;
    
    const response = await axios.get(apiUrl, { timeout: 10000 });
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
};
