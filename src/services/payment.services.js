import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// const API_BASE_URL = 'http://127.0.0.1:8000'
const API_BASE_URL = 'https://audio-visual-backend.onrender.com'
let token = localStorage.getItem('token');
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0bmFtZSI6IlBhdHJpY2siLCJsYXN0bmFtZSI6IlBoYW5kZXJhIiwicGhvbmUiOiIwODg1MDkyMTQ4IiwiZ2VuZGVyIjoiTWFsZSIsInJvbGUiOiJVc2VyIiwiZW1haWwiOiJwYXRyaWNrcGhhbmRlcmFqZ0BnbWFpbC5jb20iLCJkaXN0cmljdCI6IkxpbG9uZ3dlIiwibG9jYXRpb25JZCI6Imxsdy1jZW50cmFsLTEiLCJ2ZXJpZmllZEVtYWlsIjp0cnVlLCJwYXNzd29yZCI6IiIsImNyZWF0ZWQiOiIyMDI1LTA3LTAxIDE2OjAwOjE4LjM0NjIwNyIsInVwZGF0ZWQiOiIyMDI1LTA3LTAxIDE2OjAwOjE4LjM0NjIzNCIsImlkIjoiNjg2NDA2MTIzODRkM2VhNmMyNzhiMmI3In0sImV4cCI6MTc4MDQxNjA0M30.yqVY4wpfSOlvkcbZqMv3mxTKxl3zpFrDTFMBEYz2tbc'

export default async function makePayment(data, totalCost) {
  try {
    console.log(data);

    const id = uuidv4();
    const email = 'patrickphandera@gmail.com';
    const first_name = 'patrick';

    const last_name = 'phandera';

    const localAreaName = localStorage.getItem('localAreaName');
    const selectedAddress = localStorage.getItem('selectedAddress');
    const lat = localStorage.getItem('lat');
    const long = localStorage.getItem('long');
    const equipments = localStorage.getItem('equipments');
    const amount = Number(totalCost);
    const user_type = 'customers';
    data.id = id
    data.lat = lat

    data.long = long
    data.equipments = equipments
    data.amount = amount
    data.email = email
    data.first_name = first_name
    data.last_name = last_name
    data.user_type = user_type
    data.localAreaName = localAreaName
    data.selectedAddress = selectedAddress
    const response = await axios.post(`${API_BASE_URL}/payments/init`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("Payment initiated:", response.data.checkout_url);
    return response.data;
  } catch (error) {
    console.error("Error making payment:", error.response?.data || error.message);
  }
}


















