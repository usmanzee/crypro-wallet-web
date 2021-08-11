import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import {
    paymentMethodCreate,
    PaymentMethodCreateFetch,
    paymentMethodModal,
    paymentMethodError,
} from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* paymentMethodCreateSaga(action: PaymentMethodCreateFetch) {
    try {
        yield call(API.post(createOptions(getCsrfToken())), '/private/payment_methods', action.payload);
        yield put(paymentMethodCreate());
        yield put(alertPush({ message: ['success.payment_method.created'], type: 'success' }));
        yield put(paymentMethodModal({ active: false }));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
