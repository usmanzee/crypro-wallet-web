import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { p2pOrderData, p2pOrderError, P2POrderFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export function* getOrderSaga(action: P2POrderFetch) {
    try {
        const data = yield call(API.get(config), `/account/p2p/orders/${action.payload.id}`);

        yield put(p2pOrderData(data));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
