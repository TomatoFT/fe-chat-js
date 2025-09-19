// Test API connection
export const testApiConnection = async () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://157.10.52.80:8000';
  
  console.log('Testing API connection to:', apiBaseUrl);
  
  try {
    const response = await fetch(`${apiBaseUrl}/`);
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API Connection Error:', error);
    return null;
  }
};
