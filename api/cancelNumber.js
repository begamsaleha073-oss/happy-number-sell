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
    const { id } = request.query;
    if (!id) {
      return response.json({ 
        success: false, 
        error: 'ID parameter is required' 
      });
    }

    // API Key directly yahan hai
    const API_KEY = 'g18m2iehorj978taaw4ymb9yipnqyjga';
    const url = `https://firexotp.com/stubs/handler_api.php?action=setStatus&api_key=${API_KEY}&id=${id}&status=8`;
    
    console.log('Cancelling number with ID:', id);
    const apiResponse = await axios.get(url);
    const data = apiResponse.data;
    console.log('Cancel Response:', data);
    
    response.json({
      success: true,
      data: data,
      message: 'Number cancelled successfully'
    });
  } catch (error) {
    console.error('Error:', error.message);
    response.json({
      success: false,
      error: error.message
    });
  }
}
