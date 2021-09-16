import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import { offersData, offersError, OffersFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
    withHeaders: true,
};

export function* p2pOffersSaga(action: OffersFetch) {
    try {
        const { side, base, quote, payment_method_id } = action.payload;
        const { data, headers } = yield call(API.get(config), `/public/p2p/offers?${buildQueryString(action.payload)}`);

        yield put(offersData({
            list: data,
            total: headers.total,
            page: action.payload.page,
            side,
            base,
            quote,
            payment_method_id,
        }));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
