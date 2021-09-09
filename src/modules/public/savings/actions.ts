import { CommonError } from '../../types';
import {
    SAVING_PLANS_FETCH,
    SAVING_PLANS_DATA,
    SAVING_PLANS_ERROR,
    SAVING_PLAN_SUBSCRIBE_FETCH,
    SAVING_PLAN_SUBSCRIBE_SUCCESS,
    SAVING_PLAN_SUBSCRIBE_ERROR
} from './constants';
import { SavingsPlan } from './types';

export interface SavingsPlansFetch {
    type: typeof SAVING_PLANS_FETCH;
}

export interface SavingsPlansData {
    type: typeof SAVING_PLANS_DATA;
    payload: SavingsPlan[];
}

export interface SavingsPlansError {
    type: typeof SAVING_PLANS_ERROR;
}

export interface SavingPlanSubscribeFetch {
    type: typeof SAVING_PLAN_SUBSCRIBE_FETCH;
    payload: any;
}

export interface SavingPlanSubscribeSuccess {
    type: typeof SAVING_PLAN_SUBSCRIBE_SUCCESS;
}

export interface SavingPlanSubscribeError {
    type: typeof SAVING_PLAN_SUBSCRIBE_ERROR;
}

export type SavingPlansActions =
    SavingsPlansFetch
    | SavingsPlansData
    | SavingsPlansError
    | SavingPlanSubscribeFetch
    | SavingPlanSubscribeSuccess
    | SavingPlanSubscribeError

export const savingsPlansFetch = (): SavingsPlansFetch => ({
    type: SAVING_PLANS_FETCH,
});

export const savingsPlansData = (payload: SavingsPlansData['payload']): SavingsPlansData => ({
    type: SAVING_PLANS_DATA,
    payload,
});

export const savingsPlansError = (): SavingsPlansError => ({
    type: SAVING_PLANS_ERROR,
});

export const savingPlanSubscribeFetch = (payload: any): SavingPlanSubscribeFetch => ({
    type: SAVING_PLAN_SUBSCRIBE_FETCH,
    payload
});

export const savingPlanSubscribeSuccess = (): SavingPlanSubscribeSuccess => ({
    type: SAVING_PLAN_SUBSCRIBE_SUCCESS,
});

export const savingPlanSubscribeError = (): SavingPlanSubscribeError => ({
    type: SAVING_PLAN_SUBSCRIBE_ERROR,
});



