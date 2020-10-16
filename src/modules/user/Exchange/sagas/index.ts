import { takeEvery } from 'redux-saga/effects';
import {
    EXCHANGE_RATE_FETCH,
    EXCHANGE_RATE_SUCCESS,
    EXCHANGE_RATE_ERROR,
    EXCHANGE_FETCH,
    EXCHANGE_SUCCESS,
    EXCHANGE_ERROR,
} from '../constants';


import { exchangeRateSaga } from './exchangeRateSaga';

export function* rootExchangeSaga() {
    yield takeEvery(EXCHANGE_RATE_FETCH, exchangeRateSaga);
}
