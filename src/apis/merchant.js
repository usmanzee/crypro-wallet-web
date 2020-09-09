import axiosInstance from "./requestBuilder";
import axios from "axios";

export const createMerchant = () => {
    return axiosInstance.post('/vendor/create-merchant')
    .then(response => response);
};
export const getMerchantWebsiteDetail = () => {
    return axiosInstance.get('/vendor/website-detail')
    .then(response => response);
};

export const getMerchantKey = () => {
    return axiosInstance.get('/vendor/merchant-key')
    .then(response => response);
};

export const createMerchantKey = () => {
    return axiosInstance.post('/vendor/merchant-key')
    .then(response => response);
};

export const getMerchantPaymanets = () => {
    return axiosInstance.get('/public/payments')
    .then(response => response);
};

export const changeMerchantPassword = (data) => {
    return axios.put('/api/v2/barong/resource/users/password', data)
    .then(response => response);
};