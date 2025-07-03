import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const API_BASE_URL = 'http://127.0.0.1:8000'
// const API_BASE_URL = 'https://audio-visual-backend.onrender.com'
let token = localStorage.getItem('token');
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0bmFtZSI6IlBhdHJpY2siLCJsYXN0bmFtZSI6IlBoYW5kZXJhIiwicGhvbmUiOiIwODg1MDkyMTQ4IiwiZ2VuZGVyIjoiTWFsZSIsInJvbGUiOiJVc2VyIiwiZW1haWwiOiJwYXRyaWNrcGpqaGFuZGVyYTFqZ0BnbWFpbC5jb20iLCJkaXN0cmljdCI6IkxpbG9uZ3dlIiwibG9jYXRpb25JZCI6Imxsdy1jZW50cmFsLTEiLCJ2ZXJpZmllZEVtYWlsIjp0cnVlLCJwYXNzd29yZCI6IiIsImNyZWF0ZWQiOiIyMDI1LTA3LTAyIDIyOjM4OjU2LjM2Mzg4MCIsInVwZGF0ZWQiOiIyMDI1LTA3LTAyIDIyOjM4OjU2LjM2Mzg5OSIsImlkIjoiNjg2NTk4ZTAxMjQ5NzQwOTQ4MzNlYTIyIn0sImV4cCI6MTc4MDUxOTE1NH0.ODJRZnDXudMyEbxkhnlnr8ronGxH7xEZePnyZz7ItiY'

export default async function makePayment(data) {
  try {


    const id = uuidv4();
    const email = 'patrickphandera@gmail.com';
    const first_name = 'patrick';

    const last_name = 'phandera';

    const user_type = 'customers';
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


















