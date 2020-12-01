import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { 
    exchangeRateFetch, 
    exchangeRateSuccess,
    exchangeRateError
} from "../actions";

const options: RequestOptions = {
    apiVersion: 'peatio',
};

export function* exchangeRateSaga(action) {
    try {
        const exchangeRate = yield call(API.post(options), '/account/exchanges/rate', action.payload.data);
        yield put(exchangeRateSuccess(exchangeRate))
    } catch (error) {
        // console.log(error);
        yield put(exchangeRateError(error))
        // yield put(alertPush({message: error.message, code: error.code, type: 'error'}));

    }
}