import axiosInstance from "./requestBuilder";

export const fetchRate = (base_currency, qoute_currency, qoute_amount) => {
    return axiosInstance.post(
        'account/exchanges/rate',
        { base_currency, qoute_currency, qoute_amount }
    )
     //.then(response => (response.data))
};

export const postExchange = (base_currency, qoute_currency, qoute_amount) => {
    return axiosInstance.post(
        'account/exchanges/exchange',
        { base_currency, qoute_currency, qoute_amount }
    )
     //.then(response => (response.data))
};
export const codeWithdraws = () => {
    return axiosInstance.get('/account/withdraws/code')
  };

export const getExchangeHistory = () => {
    return axiosInstance.get(`account/exchanges/history`)
        .then(response => response.data);
};
export const getNotifications = () => {
    return axiosInstance.get(`account/notifications`)
};