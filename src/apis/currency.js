import axiosInstance from "./requestBuilder";
import axios from "axios";

export const fetchMoonpayCurrencies = () => {
    return axios.get(`${window.env.api.moonPayUrl}/currencies?apiKey=${window.env.api.moonPayPublicKey}`);
};
