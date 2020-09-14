// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { 
    merchantKeySuccess, 
    merchantKeyError 
} from "../actions";

const merchantOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* merchantKeyFetch() {
    try {
        const merchantkey = yield call(API.get(merchantOptions), '/vendor/merchant-key');
        yield put(merchantKeySuccess(merchantkey))
    } catch (error) {
        yield put(merchantKeyError(error))

    }
}