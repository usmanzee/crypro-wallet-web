import { RootState } from '../../';
import { ExchangeState } from './reducer';

export const selectIsFetchingExchangeRate = (state: RootState): boolean =>
    state.user.exchange.isRateFetching;

export const selectExchangeRate = (state: RootState): string =>
    state.user.exchange.rate;
