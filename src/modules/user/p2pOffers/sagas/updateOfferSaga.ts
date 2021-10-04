import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { UpdateOfferFetch, updateOfferError } from '../actions';

const updateOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* updateOfferSaga(action: UpdateOfferFetch) {
    try {
        const { id } = action.payload;

        yield call(API.post(updateOptions(getCsrfToken())), `/account/offers/${id}`, action.payload);

        yield put(alertPush({ message: ['success.offer.cancelling'], type: 'success'}));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
