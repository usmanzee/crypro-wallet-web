import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../../';
import { API, RequestOptions } from '../../../../api';
import {
    paymentMethodList,
    PaymentMethodListFetch,
    paymentMethodError,
} from '../actions';

const options: RequestOptions = {
    apiVersion: 'peatio',
};

export function* paymentMethodListSaga(action: PaymentMethodListFetch) {
    try {
        const data = yield call(API.get(options), '/account/p2p/user/payment_methods');
        yield put(paymentMethodList(data));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
