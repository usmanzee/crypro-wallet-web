import { call, put } from 'redux-saga/effects';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { CreateOfferFetch, createOfferData, createOfferError } from '../actions';

const executeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* createOfferSaga(action: CreateOfferFetch) {
    try {
        yield call(API.post(executeOptions(getCsrfToken())), '/private/offers', action.payload);

        yield put(createOfferData());
        yield put(alertPush({ message: ['success.offer.created'], type: 'success'}));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
