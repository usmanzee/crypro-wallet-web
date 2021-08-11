import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pCurrenciesData, p2pCurrenciesError } from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export function* p2pCurrenciesSaga() {
    try {
        const data = yield call(API.get(config), '/public/currencies');

        yield put(p2pCurrenciesData(data));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
