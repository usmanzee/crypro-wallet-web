import { CommonState } from '../../types';
import { SavingPlansActions } from './actions';
import {
    SAVING_PLANS_FETCH,
    SAVING_PLANS_DATA,
    SAVING_PLANS_ERROR,
    SAVING_PLAN_SUBSCRIBE_FETCH,
    SAVING_PLAN_SUBSCRIBE_SUCCESS,
    SAVING_PLAN_SUBSCRIBE_ERROR
} from './constants';
import { SavingsPlan } from './types';

export interface SavingsPlansState extends CommonState{
    list: SavingsPlan[];
    fetching: boolean;
    subscribing: boolean;
    subscribeSuccess: boolean;
}
export const initialSavingsPlansState: SavingsPlansState = {
    list: [],
    fetching: false,
    subscribing: false,
    subscribeSuccess: false,
};

export const savingsPlansReducer = (state = initialSavingsPlansState, action: SavingPlansActions) => {
    switch (action.type) {
        case SAVING_PLANS_FETCH:
            return {
                ...state,
                fetching: true,
            };
        case SAVING_PLANS_DATA:
            return {
                ...state,
                fetching: false,
                list: action.payload,
            };
        case SAVING_PLANS_ERROR:
            return {
                ...state,
                fetching: false,
            };
        case SAVING_PLAN_SUBSCRIBE_FETCH:
            return {
                ...state,
                subscribing: true,
            };
        case SAVING_PLAN_SUBSCRIBE_SUCCESS:
            return {
                ...state,
                subscribing: false,
                subscribeSuccess: true,
            };
        case SAVING_PLAN_SUBSCRIBE_ERROR:
            return {
                ...state,
                subscribing: false,
                subscribeSuccess: false,
            };
        default:
            return state;
    }
};

