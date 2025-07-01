


const API_BASE_URL = 'https://audio-visual-backend.onrender.com'
// const API_BASE_URL = 'http://127.0.0.1:8000'
import axios from 'axios';
let token = localStorage.getItem('token');
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjdkN2Q0ZjRhMDEwMTRlNmMyNjFmNGY3IiwiZXhwIjoxNzcxMjI4NDA0fQ.4GO5klrnkPyUTUNQsSQAQJvUYBuchxbekmzL-CU-EvY'

export const BACKENDURL = API_BASE_URL
export async function postData(data, endpoint) {
  try {
    // Make a POST request with headers
    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add other headers as needed
        'Content-Type': 'application/json'
      }
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Request error:', error);
    throw error;
  }
}
export async function putData(data, endpoint) {
  try {
    // Make a POST request with headers
    const response = await axios.put(`${API_BASE_URL}/${endpoint}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add other headers as needed
        'Content-Type': 'application/json'

      }
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Request error:', error);
    throw error;
  }
}

export async function deleteData(endpoint) {
  try {
    // Make a POST request with headers
    const response = await axios.delete(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add other headers as needed
      }
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Request error:', error);
    throw error;
  }
}
export async function getData(endpoint, id) {
  try {
    // Make a POST request with headers
    const response = await axios.get(`${API_BASE_URL}/${endpoint}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add other headers as needed
      }
    });

    // Return the response data
    // console.log(response.data)
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Request error:', error);
    throw error;
  }
}



export async function downloadData(endpoint) {
  try {
    // Make a GET request with headers and response type 'blob' for file downloads
    const result = await axios.get(`${API_BASE_URL}/download/v2/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add other headers as needed
      }
    });
    // Return a success message or data if needed
    return result.data;

  } catch (error) {
    // Handle errors
    console.error('Request error:', error);
    throw error; // Re-throw the error if needed
  }
}
export async function getAllData(endpoint) {
  try {
    // Make a POST request with headers
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add other headers as needed
      }
    });
    // Return the response data
    // console.log(response.data)
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Request error:', error);
    throw error;
  }
}


export async function postFormData(data, endpoint) {
  try {
    // Make a POST request with headers
    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add other headers as needed
        'Content-Type': 'multipart/form-data'
      }
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Request error:', error);
    throw error;
  }
}