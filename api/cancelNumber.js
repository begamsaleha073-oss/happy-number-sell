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
    const { id } = req.query;
    if (!id) {
      return res.json({ success: false, error: 'ID required' });
    }

    const API_KEY = process.env.FIREX_API_KEY || 'g18m2iehorj978taaw4ymb9yipnqyjga';
    const url = `https://firexotp.com/stubs/handler_api.php?action=setStatus&api_key=${API_KEY}&id=${id}&status=8`;
    
    const response = await axios.get(url);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
};
