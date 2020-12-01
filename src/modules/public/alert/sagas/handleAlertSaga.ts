import { delay } from 'redux-saga';
// tslint:disable-next-line no-submodule-imports
import { call, put } from 'redux-saga/effects';
import { userReset } from '../../../';
import { API, RequestOptions, msAlertDisplayTime } from '../../../../api';
import { alertData, alertDelete, AlertPush } from '../actions';
import { signInRequire2FA } from '../../../user/auth';
import { userOpenOrdersReset } from '../../../user/openOrders';
import { resetHistory } from '../../../user/history';

const requestOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* handleAlertSaga(action: AlertPush) {
    if (action.payload.type === 'error') {
        switch (action.payload.code) {
            case 401:
                if (action.payload.message.indexOf('identity.session.not_active') > -1) {
                    // yield call(API.delete(requestOptions), '/identity/sessions');
                    yield put(userReset());
                    localStorage.removeItem('csrfToken');
                    yield put(userOpenOrdersReset());
                    yield put(signInRequire2FA({ require2fa: false }));
                    yield put(resetHistory());
                    yield put(alertData(action.payload));

                    return;
                } else {
                    if (action.payload.message.indexOf('authz.invalid_session') > -1) {
                        // yield call(API.delete(requestOptions), '/identity/sessions');
                        yield put(userReset());
                        localStorage.removeItem('csrfToken');
                        yield put(userOpenOrdersReset());
                        yield put(signInRequire2FA({ require2fa: false }));
                        yield put(resetHistory());
                    } else {
                        if (action.payload.message.indexOf('authz.client_session_mismatch') > -1 || action.payload.message.indexOf('authz.csrf_token_mismatch') > -1) {
                            // yield call(API.delete(requestOptions), '/identity/sessions');
                            yield put(userReset());
                            localStorage.removeItem('csrfToken');
                            yield put(userOpenOrdersReset());
                            yield put(signInRequire2FA({ require2fa: false }));
                            yield put(resetHistory());
                            yield call(callAlertData, action);
                        } else {
                            yield call(callAlertData, action);
                            break;
                        }
                    }
                }
                break;
            case 403:
                if (action.payload.message.indexOf('identity.session.invalid_otp') > -1) {
                    yield call(callAlertData, action);
                }
                if (action.payload.message.indexOf('jwt.decode_and_verify') > -1) {
                    yield call(callAlertData, action);
                }

                return;
            case 422:
            default:
                yield call(callAlertData, action);
        }
    } else {
        yield call(callAlertData, action);
    }
}

function* callAlertData(action: AlertPush) {
    yield put(alertData(action.payload));
    yield delay(parseFloat(msAlertDisplayTime()));
    yield put(alertDelete());
}
