
import { RootState } from '../../index';
import { FiatCurrenciesState } from './reducer';
import { FiatCurrency } from './types';

const selectFiatCurrenciesState = (state: RootState): FiatCurrenciesState => state.public.fiatCurrencies;

export const selectFiatCurrencies = (state: RootState): FiatCurrency[] =>
    selectFiatCurrenciesState(state).list;

export const selectFiatCurrenciesLoading = (state: RootState): boolean | undefined =>
    selectFiatCurrenciesState(state).loading;
