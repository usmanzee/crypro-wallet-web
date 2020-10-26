// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { 
    merchantPaymentsSuccess, 
    merchantPaymentsError 
} from "../actions";

const merchantOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* merchantProfileFetch() {
    try {
        const merchantPayments = yield call(API.get(merchantOptions), '/public/payments');
        yield put(merchantPaymentsSuccess(merchantPayments))
    } catch (error) {
        yield put(merchantPaymentsError(error))

    }
}