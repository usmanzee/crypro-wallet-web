import { takeEvery } from 'redux-saga/effects';
import {
    EXCHANGE_RATE_FETCH,
    EXCHANGE_RATE_SUCCESS,
    EXCHANGE_RATE_ERROR,
    EXCHANGE_REQUEST,
    EXCHANGE_SUCCESS,
    EXCHANGE_ERROR,
} from '../constants';


import { exchangeRateSaga} from './exchangeRateSaga';
import { exchangeSaga} from './exchangeSaga';

export function* rootExchangeSaga() {
    yield takeEvery(EXCHANGE_RATE_FETCH, exchangeRateSaga);
    yield takeEvery(EXCHANGE_REQUEST, exchangeSaga);
}
