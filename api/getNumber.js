import axios from 'axios';

export default async function handler(request, response) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    // API Key directly yahan hai
    const API_KEY = 'g18m2iehorj978taaw4ymb9yipnqyjga';
    const url = `https://firexotp.com/stubs/handler_api.php?action=getNumber&api_key=${API_KEY}&service=wa&country=51`;
    
    const apiResponse = await axios.get(url);
    const data = apiResponse.data;
    
    console.log('FirexOTP Response:', data);
    
    // Parse: ACCESS_NUMBER:ID:NUMBER
    const parts = data.split(':');
    if (parts[0] === 'ACCESS_NUMBER' && parts.length === 3) {
      response.json({
        success: true,
        id: parts[1],
        number: parts[2],
        message: 'Number obtained successfully'
      });
    } else {
      response.json({
        success: false,
        error: data
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    response.json({
      success: false,
      error: error.message
    });
  }
}
