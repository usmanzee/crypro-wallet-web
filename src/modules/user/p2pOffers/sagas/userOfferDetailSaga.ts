import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import {
    userOfferDetailData,
    UserOfferDetailFetch
} from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
    withHeaders: true,
};

export function* userOfferDetailSaga(action: UserOfferDetailFetch) {
    try {
        const { id } = action.payload;
        const { data, headers } = yield call(API.get(config), `/account/offers/${id}`);
        yield put(userOfferDetailData(data));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}