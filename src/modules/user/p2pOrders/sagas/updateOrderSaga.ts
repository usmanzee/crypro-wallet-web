import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { p2pOrdersUpdateData, p2pOrdersUpdateError, P2POrdersUpdateFetch } from '../actions';

const executeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* updateOrderSaga(actionParam: P2POrdersUpdateFetch) {
    try {
        const { id } = actionParam.payload;
        const data = yield call(API.post(executeOptions(getCsrfToken())), `/account/p2p/orders/${id}`, actionParam.payload);
        yield put(p2pOrdersUpdateData(data));
        yield put(alertPush({ message: [`success.order.update`], type: 'success'}));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
