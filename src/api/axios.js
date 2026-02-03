import axios from "axios";



const baseUrl = process.env.REACT_APP_BACK_URL?.startsWith("http")
  ? process.env.REACT_APP_BACK_URL
  : `https://${process.env.REACT_APP_BACK_URL}`;

const api = axios.create({ baseURL: baseUrl });



api.interceptors.request.use((config) => {
const token = localStorage.getItem("token");
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
});


export default api;