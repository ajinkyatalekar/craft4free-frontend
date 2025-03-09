const API_URL = import.meta.env.PROD 
  ? 'https://your-production-api-url.com/api' 
  : 'http://127.0.0.1:8000/';

export async function root() {
  try {
    const response = await fetch(`${API_URL}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export async function createServer(name: string) {
  try {
    const response = await fetch(`${API_URL}create-server/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}