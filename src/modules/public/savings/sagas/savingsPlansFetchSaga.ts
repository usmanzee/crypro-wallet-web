// tslint:disable-next-line
import { call, put, takeLatest } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../alert';
import {
    savingsPlansData,
    savingsPlansError,
} from '../actions';
import { SAVING_PLANS_FETCH } from '../constants';

const savingsPlansOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* savingPlansFetchSaga() {
    try {
        const savingsPlans = yield call(API.get(savingsPlansOptions), '/public/savings/plans');
        yield put(savingsPlansData(savingsPlans));
    } catch (error) {
        yield put(savingsPlansError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
