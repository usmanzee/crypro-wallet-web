import axiosInstance from "./requestBuilder";

export const getTradingFee = () => {
    return axiosInstance.get('/public/trading_fees')
    .then(response => response.data);
  };

  export const getWithdrawlDepositFees = () => {
    return axiosInstance.get('/public/currencies')
    .then(response => response.data);
  };