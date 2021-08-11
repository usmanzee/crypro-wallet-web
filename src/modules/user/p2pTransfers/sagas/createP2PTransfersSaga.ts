import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import {
    createP2PTransfersData,
    createP2PTransfersError,
    CreateP2PTransfersFetch,
} from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* createP2PTransfersSaga(action: CreateP2PTransfersFetch) {
    try {
        yield call(API.post(config(getCsrfToken())), '/private/transfers', action.payload);
        yield put(createP2PTransfersData());
        yield put(alertPush({message: ['success.p2p.transfer.created'], type: 'success'}));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
