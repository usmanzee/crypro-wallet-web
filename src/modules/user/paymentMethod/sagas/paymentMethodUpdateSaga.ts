import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { paymentMethodModal, paymentMethodError, paymentMethodUpdate, PaymentMethodUpdateFetch } from '../actions';

const updateOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* paymentMethodUpdateSaga(action: PaymentMethodUpdateFetch) {
    try {
        const { id } = action.payload;
        yield call(API.put(updateOptions(getCsrfToken())), `/private/payment_methods/${id}`, action.payload);
        yield put(paymentMethodUpdate());
        yield put(alertPush({ message: ['success.payment_method.updated'], type: 'success' }));
        yield put(paymentMethodModal({ active: false }));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
