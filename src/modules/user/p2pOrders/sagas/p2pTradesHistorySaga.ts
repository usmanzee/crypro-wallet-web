import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import { p2pTradesHistoryData, p2pTradesHistoryError, P2PTradesHistoryFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
    withHeaders: true,
};

export function* p2pTradesHistorySaga(action: P2PTradesHistoryFetch) {
    try {
        const { data, headers } = yield call(API.get(config), `/account/p2p/orders?${buildQueryString(action.payload)}`);

        yield put(p2pTradesHistoryData({ list: data, total: headers.total }));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
