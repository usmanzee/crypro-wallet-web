// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { 
    merchantWebsiteSuccess, 
    merchantWebsiteError 
} from "../actions";

const merchantOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* merchantWebsiteFetch() {
    try {
        const merchantWebsite = yield call(API.get(merchantOptions), '/vendor/website-detail');
        yield put(merchantWebsiteSuccess(merchantWebsite))
    } catch (error) {
        yield put(merchantWebsiteError(error))

    }
}