// tslint:disable-next-line
import { call, put, takeLatest } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../alert';
import {
    paymentMethodsData,
    paymentMethodsError,
} from '../actions';
import { PAYMENT_METHODS_FETCH } from '../constants';

const paymentMethodsOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* rootPaymentMethodsSaga() {
    yield takeLatest(PAYMENT_METHODS_FETCH, paymentMethodsFetchSaga);
}

export function* paymentMethodsFetchSaga() {
    try {
        const paymentMethods = yield call(API.get(paymentMethodsOptions), '/public/payment_methods');
        yield put(paymentMethodsData(paymentMethods));
    } catch (error) {
        yield put(paymentMethodsError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
