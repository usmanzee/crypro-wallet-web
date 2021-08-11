import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pPaymentMethodsData, p2pPaymentMethodsError } from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export function* p2pPaymentMethodsSaga() {
    try {
        const data = yield call(API.get(config), '/public/payment_methods');
        yield put(p2pPaymentMethodsData(data));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
