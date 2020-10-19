import { CommonError } from '../../types';
import {
    EXCHANGE_RATE_FETCH,
    EXCHANGE_RATE_SUCCESS,
    EXCHANGE_RATE_ERROR,
    EXCHANGE_RATE_RESET,
    EXCHANGE_FETCH,
    EXCHANGE_SUCCESS,
    EXCHANGE_ERROR,
} from './constants';


export const exchangeRateFetch = (data) => ({
    type: EXCHANGE_RATE_FETCH,
    payload: {
        data: data
    }
});

export const exchangeRateSuccess = (rate: string) => ({
    type: EXCHANGE_RATE_SUCCESS,
    payload: {
        rate
    }
});

export const exchangeRateError = (message: string) => ({
    type: EXCHANGE_RATE_ERROR,
    payload: {
        message
    },
});

export const exchangeRateReset = () => ({
    type: EXCHANGE_RATE_RESET,
    
});
