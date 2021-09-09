import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { alertData, alertPush } from '../../alert';
import {
    paymentMethodsData,
    paymentMethodsError,
    paymentMethodsFetch,
} from '../actions';
import { PaymentMethod } from '../types';

// tslint:disable no-any no-magic-numbers
describe('Saga: currenciesFetchSaga', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, false)();
        sagaMiddleware.run(rootSaga);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    const fakeCurrencies: PaymentMethod[] = [
        {
            "id": "1",
            "name": "Payment",
        },
        {
            "id": "2",
            "name": "US Dollar",
        }
    ];

    const mockCurrencies = () => {
        mockAxios.onGet('/public/currencies').reply(200, fakeCurrencies);
    };

    const alertDataPayload = {
        message: ['Server error'],
        code: 500,
        type: 'error',
    };

    it('should fetch currencies', async () => {
        const expectedActions = [paymentMethodsFetch(), paymentMethodsData(fakeCurrencies)];
        mockCurrencies();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    setTimeout(resolve, 0.01);
                }
                if (actions.length > expectedActions.length) {
                    fail(`Unexpected action: ${JSON.stringify(actions.slice(-1)[0])}`);
                }
            });
        });
        store.dispatch(paymentMethodsFetch());

        return promise;
    });

    it('should trigger an error on currencies fetch', async () => {
        const expectedActions = [paymentMethodsFetch(), paymentMethodsError(), alertPush(alertDataPayload), alertData(alertDataPayload)];
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    setTimeout(resolve, 0.01);
                }
                if (actions.length > expectedActions.length) {
                    fail(`Unexpected action: ${JSON.stringify(actions.slice(-1)[0])}`);
                }
            });
        });
        store.dispatch(paymentMethodsFetch());

        return promise;
    });
});
