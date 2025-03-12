const API_URL = import.meta.env.PROD 
  ? 'PROD_URL' 
  : 'http://127.0.0.1:8000/';


export async function createServer(server: string, access_token: string) {
  try {
    const response = await fetch(`${API_URL}servers?server=${server}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    return response.json();
    
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}