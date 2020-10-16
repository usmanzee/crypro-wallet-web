import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { 
    exchangeRateFetch, 
    exchangeRateSuccess,
    exchangeRateError
} from "../actions";

const options: RequestOptions = {
    apiVersion: 'peatio',
};

export function* exchangeSaga() {
    try {
        const exchangeRate = yield call(API.get(options), '/exchange/account/exchanges/exchange');
        yield put(exchangeRateSuccess(exchangeRate))
    } catch (error) {
        yield put(exchangeRateError(error))

    }
}