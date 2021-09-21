import { UserPaymentMethod } from "../../user/paymentMethod";

export interface Offer {
    id:                number;
    origin_amount:     string;
    min_order_amount:  string;
    max_order_amount:  string;
    available_amount:  string;
    price:             string;
    base_unit:         string;
    quote_unit:        string;
    side:              string;
    state:             string;
    time_limit:        null;
    note:              string;
    payment_method_id: number;
    member:            AdvertiserDetail;
    created_at:        Date;
    updated_at:        Date;
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
