import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import {
    paymentMethodDelete,
    PaymentMethodDeleteFetch,
    paymentMethodError,
    paymentMethodModal,
} from '../actions';

const deleteOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* paymentMethodDeleteSaga(action: PaymentMethodDeleteFetch) {
    try {
        const { id } = action.payload;
        yield call(API.delete(deleteOptions(getCsrfToken())), `/private/payment_methods/${id}`);
        yield put(paymentMethodDelete({id}));
        yield put(alertPush({ message: ['success.payment_method.deleted'], type: 'success' }));
        yield put(paymentMethodModal({ active: false }));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
