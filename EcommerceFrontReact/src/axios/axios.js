import axios from 'axios';

//1. Crear instancia  de axios. Configuración personalizada.
const clientHttp = axios.create({
  //La baseURL de las apis
  baseURL: process.env.REACT_APP_BASE_URL,
  // Si la petición toma más tiempo que `timeout`, esta será abortada.
  timeout: 30000, // `0` es el valor por defecto (no timeout)
  //Otras  configuraciones globales...
});


//2. Puedes interceptar peticiones o respuestas
//axios.interceptors.request.use(...)
//axios.interceptors.response.use(...)
export default clientHttp;