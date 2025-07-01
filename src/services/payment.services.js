import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// const API_BASE_URL = 'http://127.0.0.1:8000'
const API_BASE_URL = 'https://audio-visual-backend.onrender.com'
let token = localStorage.getItem('token');
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjdkN2Q0ZjRhMDEwMTRlNmMyNjFmNGY3IiwiZXhwIjoxNzcxMjI4NDA0fQ.4GO5klrnkPyUTUNQsSQAQJvUYBuchxbekmzL-CU-EvY'
export default async function makePayment(data) {
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
    const amount = 60;
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


















