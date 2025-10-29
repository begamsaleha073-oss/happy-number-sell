const axios = require('axios');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const API_KEY = process.env.FIREX_API_KEY || 'g18m2iehorj978taaw4ymb9yipnqyjga';
    const url = `https://firexotp.com/stubs/handler_api.php?action=getNumber&api_key=${API_KEY}&service=wa&country=51`;
    
    const response = await axios.get(url);
    const data = response.data;
    
    // Parse: ACCESS_NUMBER:ID:NUMBER
    const parts = data.split(':');
    if (parts[0] === 'ACCESS_NUMBER' && parts.length === 3) {
      res.json({
        success: true,
        id: parts[1],
        number: parts[2]
      });
    } else {
      res.json({
        success: false,
        error: data
      });
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
};
