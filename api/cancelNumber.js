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

    console.log('Cancelling number with ID:', id);
    const apiUrl = `${BASE_URL}?action=setStatus&api_key=${API_KEY}&id=${id}&status=8`;
    
    const response = await axios.get(apiUrl, { timeout: 10000 });
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
};
