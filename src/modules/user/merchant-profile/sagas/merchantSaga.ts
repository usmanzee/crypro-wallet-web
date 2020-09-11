// tslint:disable-next-line
import { call } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
const merchantOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* merchantSaga() {
    try {
        const user = yield call(API.get(merchantOptions), '/resource/users/me');
        console.log(user);
        //yield put(MerchantSuccess({ user }));
    } catch (error) {
        
    }
}
