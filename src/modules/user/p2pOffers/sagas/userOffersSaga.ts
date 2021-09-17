import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import {
    userOfferOrdersData,
    userOfferOrdersError,
    UserOfferOrdersFetch,
    userOffersData,
    userOffersError,
    UserOffersFetch
} from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
    withHeaders: true,
};

export function* userOffersSaga(action: UserOffersFetch) {
    try {
        const { data, headers } = yield call(API.get(config), `/account/offers?${buildQueryString(action.payload)}`);

        yield put(userOffersData({ list: data, total: headers.total }));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

export function* userOfferOrdersSaga(action: UserOfferOrdersFetch) {
    try {
        const { data } = yield call(API.get(config), `/private/offers/${action.payload.offer_id}/orders`);

        yield put(userOfferOrdersData(data));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
