import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../index';
import { 
    exchangeSuccess,
    exchangeError
} from "../actions";

const options: RequestOptions = {
    apiVersion: 'peatio',
};

export function* exchangeSaga(action) {
    try {
        yield call(API.post(options), '/account/exchanges/exchange', action.payload.data);
        yield put(exchangeSuccess())
        yield put(alertPush({message: ['account.exchanges.exchange.success'], type: 'success'}));
    } catch (error) {
        yield put(exchangeError(error))
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));

    }
}