// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';

import { merchantSaga } from './merchantSaga';

export function* rootMerchantProfileSaga() {

    yield takeEvery("MERCHANT_PROFILE_FETCH", merchantSaga);
}
