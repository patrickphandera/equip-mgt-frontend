// src/services/register.js

import axios from 'axios';
let token = localStorage.getItem('token');
const API_BASE_URL = 'https://audio-visual-backend.onrender.com'
// const API_BASE_URL = 'http://127.0.0.1:8000'
// Function to handle user registration
export async function registerUser(userData) {
  try {
    const rawData = JSON.parse(JSON.stringify(userData));
    console.log('User Data:', rawData);

    const response = await axios.post(`${API_BASE_URL}/users/register`, rawData);
    console.log(response)
    return await response.data;
  } catch (error) {
    // Handle errors here
    throw error;
  }
}


export async function loginUser(credentials) {
  try {
    // Make a POST request to the login endpoint
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);

    // Check if the response contains a token
    if (response.data.access_token) {
      // Save the token to local storage
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', response.data.user_id);
      localStorage.setItem('role', response.data.role);

    }
    console.log(response)
    // Return the response data (e.g., user info, success message)
    return response.data;
  } catch (error) {
    // Handle errors (e.g., show an error message to the user)
    console.error('Login error:', error);
    throw error;
  }
}


export async function logoutUser() {
  try {
    // Make a POST request to the logout endpoint with headers
    await axios.post(`${API_BASE_URL}/logout`, {}, {
      headers: {
        'Authorization': `${token}`, // Pass the token in the headers
      },
    });

    // Clear local storage and redirect
    localStorage.clear();
    return window.location.href = '/auth/login';
  } catch (error) {
    // Handle errors
    console.error('Logout error:', error);
    throw error;
  }
}

