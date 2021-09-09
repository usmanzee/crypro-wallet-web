import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { alertData, alertPush } from '../../alert';
import {
    fiatCurrenciesData,
    fiatCurrenciesError,
    fiatCurrenciesFetch,
} from '../actions';
import { FiatCurrency } from '../types';

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

    const fakeCurrencies: FiatCurrency[] = [
        {
            "symbol": "PKRs",
            "name": "Pakistani Rupee",
            "symbol_native": "₨",
            "decimal_digits": 0,
            "rounding": 0,
            "code": "PKR",
            "name_plural": "Pakistani rupees"
        },
        {
            "symbol": "$",
            "name": "US Dollar",
            "symbol_native": "$",
            "decimal_digits": 2,
            "rounding": 0,
            "code": "USD",
            "name_plural": "US dollars"
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
        const expectedActions = [fiatCurrenciesFetch(), fiatCurrenciesData(fakeCurrencies)];
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
        store.dispatch(fiatCurrenciesFetch());

        return promise;
    });

    it('should trigger an error on currencies fetch', async () => {
        const expectedActions = [fiatCurrenciesFetch(), fiatCurrenciesError(), alertPush(alertDataPayload), alertData(alertDataPayload)];
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
        store.dispatch(fiatCurrenciesFetch());

        return promise;
    });
});
