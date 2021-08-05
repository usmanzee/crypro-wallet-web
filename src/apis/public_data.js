import axios from 'axios';

export const getBanksDepositDetails = async () => {
    return axios.get('/public_data/bank_details.json')
    .then(response => response.data);
};
export const getAllFiatCurrencies = async () => {
    return axios.get('/public_data/all_fiat_currencies.json')
    .then(response => response.data);
};