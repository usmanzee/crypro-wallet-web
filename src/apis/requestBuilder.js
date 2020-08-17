import axios from 'axios';
// import { host } from '../config';



const axiosInstance = axios.create({
  
  baseURL: window.env.api.tradeUrl
  //withCredentials: true,
});


axiosInstance.interceptors.response.use(
  response => {
    console.log("response",response)
    return response;
  }, error => {
    //console.log("request builder",error.response.data.errors[0])
    

    //return error;
        return console.log(error)
});

export default axiosInstance;

