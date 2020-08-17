import axiosInstance from './requestBuilder';


export const postNewWithdraws = data => {
  return axiosInstance.post('/api/v2/peatio/account/withdraws', data)
};
export const postMassWithdraws = data => {
  return axiosInstance.post('/account/withdraws/masspay', data)
};

export const codeWithdraws = () => {
  return axiosInstance.get('/account/withdraws/code')
};
