import { RootState } from '../../index';
import { SavingsPlansState } from './reducer';
import { SavingsPlan } from './types';

const selectSavingsPlansState = (state: RootState): SavingsPlansState => state.public.savingsPlans;

export const selectSavingsPlans = (state: RootState): SavingsPlan[] =>
    selectSavingsPlansState(state).list;

export const selectSavingsPlansFetching = (state: RootState): boolean | undefined =>
    selectSavingsPlansState(state).fetching;

export const selecteSavingPlansSubscribing = (state: RootState): boolean | undefined =>
    selectSavingsPlansState(state).subscribing;

export const selecteSavingPlansSubscribeSuccess = (state: RootState): boolean | undefined =>
    selectSavingsPlansState(state).subscribeSuccess;
