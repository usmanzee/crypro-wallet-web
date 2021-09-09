// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    SAVING_PLANS_FETCH,
    SAVING_PLAN_SUBSCRIBE_FETCH
} from '../constants';
import { savingPlansFetchSaga } from './savingsPlansFetchSaga';
import { savingPlansSubscribeSaga } from './savingsPlanSubscribeSaga';

export function* rootSavingPlansSaga() {
    yield takeEvery(SAVING_PLANS_FETCH, savingPlansFetchSaga);
    yield takeEvery(SAVING_PLAN_SUBSCRIBE_FETCH, savingPlansSubscribeSaga);
}
