// tslint:disable-next-line
import { call, put, takeLatest } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../alert';
import {
    fiatCurrenciesData,
    fiatCurrenciesError,
} from '../actions';
import { FIAT_CURRENCIES_FETCH } from '../constants';

const currenciesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* rootFiatCurrenciesSaga() {
    yield takeLatest(FIAT_CURRENCIES_FETCH, fiatCurrenciesFetchSaga);
}

export function* fiatCurrenciesFetchSaga() {
    try {
        const currencies = yield call(API.get(currenciesOptions), '/public/fiat_currencies');
        yield put(fiatCurrenciesData(currencies));
    } catch (error) {
        yield put(fiatCurrenciesError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
