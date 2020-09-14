// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { 
    merchantProfileSuccess, 
    merchantProfileError 
} from "../actions";

const merchantOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* merchantProfileFetch() {
    try {
        const merchantProfile = yield call(API.get(merchantOptions), '/resource/users/me');
        yield put(merchantProfileSuccess(merchantProfile))
    } catch (error) {
        yield put(merchantProfileError(error))

    }
}