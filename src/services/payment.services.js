import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// const API_BASE_URL = 'http://127.0.0.1:8000'
const API_BASE_URL = 'https://audio-visual-backend.onrender.com'
let token = localStorage.getItem('token');
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0bmFtZSI6IlBhdHJpY2siLCJsYXN0bmFtZSI6IlBoYW5kZXJhIiwicGhvbmUiOiIwODg1MDkyMTQ4IiwiZ2VuZGVyIjoiTWFsZSIsInJvbGUiOiJVc2VyIiwiZW1haWwiOiJwYXRyaWNrcGhqYW5kZXJhMWpnQGdtYWlsLmNvbSIsImRpc3RyaWN0IjoiTGlsb25nd2UiLCJsb2NhdGlvbklkIjoibGx3LWNlbnRyYWwtMSIsInZlcmlmaWVkRW1haWwiOnRydWUsInBhc3N3b3JkIjoiIiwiY3JlYXRlZCI6IjIwMjUtMDctMDMgMDc6NTQ6MjMuMzQ1MzAxIiwidXBkYXRlZCI6IjIwMjUtMDctMDMgMDc6NTQ6MjMuMzQ1MzI4IiwiaWQiOiI2ODY2MzcyZjFhZTI5NjU4ZGQxY2FmMDIifSwiZXhwIjoxNzgwNTU5NjgzfQ.XQTgxTrUblqN2eOeOTOgupVEtrYLM5SOVx7e2YDZCh0'

export default async function makePayment(data) {
  try {

    const id = uuidv4();
    const email = 'patrickphandera@gmail.com';
    const first_name = 'patrick';

    const last_name = 'phandera';

    const user_type = 'customer';
    data.user_type = user_type
    data.email = email
    data.first_name = first_name
    data.last_name = last_name

    const response = await axios.post(`${API_BASE_URL}/payments/init`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });


    return response.data;

  } catch (error) {
    console.error("Error making payment:", error);
  }
}


















