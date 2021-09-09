// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../../index';
import {
    savingPlanSubscribeFetch,
    savingPlanSubscribeSuccess,
    savingPlanSubscribeError,
} from '../actions';

const savingPlansSubscribeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* savingPlansSubscribeSaga(action) {
    try {
        yield call(API.post(savingPlansSubscribeOptions(getCsrfToken())), '/account/create_saving_investment', action.payload);
        yield put(savingPlanSubscribeSuccess());
        yield put(alertPush({message: ['Subscribed successfully.'], type: 'success'}));
    } catch (error) {
        yield put(savingPlanSubscribeError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
