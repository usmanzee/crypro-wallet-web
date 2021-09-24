import { UserPaymentMethod } from "../../user/paymentMethod";

export interface Offer {
    id:                    number;
    price:                 string;
    available_amount:      string;
    origin_amount:         string;
    min_order_amount:      string;
    max_order_amount:      string;
    base_unit:             string;
    quote_unit:            string;
    side:                  string;
    time_limit:            string;
    note:                  string;
    created_at:            Date;
    updated_at:            Date;
    name:                  string;
    total_trades:          number;
    trades_30_day:         number;
    tradecompletion_30day: number;
    rating:                string;
    profile_id:            number;
    state:                 string;
    payment_methods:       PaymentMethod[];
}

export interface AdvertiserDetail {
    id:                 number;
    uid:                string;
    email:              string;
    level:              number;
    role:               string;
    group:              string;
    state:              string;
    created_at:         Date;
    updated_at:         Date;
    notification_token: string;
}

// export interface PaymentMethod {
//     id: number;
//     type: string;
//     name: string;
//     options?: any;
// }

export interface PaymentMethod {
    name:   string;
    slug:   string;
}

export interface Field {
    fieldName:   string;
    type:        string;
    multiLine:   boolean;
    lengthLimit: number;
    isRequired:  boolean;
    hintText:    null | string;
}
