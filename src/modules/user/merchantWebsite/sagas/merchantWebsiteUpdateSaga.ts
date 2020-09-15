// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../../index';

import { 
    merchantWebsiteUpdateSuccess, 
    merchantWebsiteUpdateError 
} from "../actions";

const merchantWebsiteUpdateOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* merchantWebsiteUpdateSaga(action) {
    try {
        yield call(API.put(merchantWebsiteUpdateOptions(getCsrfToken())), '/vendor/create-merchant', action.payload.website);
        yield put(merchantWebsiteUpdateSuccess(action.payload.website));
        yield put(alertPush({message: ['success.website.updated'], type: 'success'}));
    } catch (error) {
        yield put(merchantWebsiteUpdateError(error))
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));

    }
}
