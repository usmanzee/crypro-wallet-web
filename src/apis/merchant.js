import axiosInstance from "./requestBuilder";

export const createMerchant = () => {
    return axiosInstance.post('/vendor/create-merchant')
    .then(response => response);
};


export const createMerchantKey = () => {
    return axiosInstance.post('/vendor/merchant-key')
    .then(response => response);
};