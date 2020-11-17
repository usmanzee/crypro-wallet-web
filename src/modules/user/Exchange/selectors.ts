import { RootState } from '../../';
import { ExchangeState } from './reducer';

export const selectIsFetchingExchangeRate = (state: RootState): boolean =>
    state.user.exchange.isFetchingRate;

export const selectExchangeRate = (state: RootState): string =>
    state.user.exchange.rate;

export const selectExchangeSuccess = (state: RootState): boolean =>
    state.user.exchange.exchangeSuccess;

export const selectExchangeLoading = (state: RootState): boolean =>
    state.user.exchange.loading;
