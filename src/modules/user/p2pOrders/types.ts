import { Offer } from "../../../modules";
import { UserPaymentMethod } from "../paymentMethod";

export interface P2POrderCreate {
    offer_id: number;
    amount: string;
}

export interface P2POrder {
    id: number;
    offer: Offer;
    amount: number|string;
    created_at: string;
    status: string;
    payment_methods: UserPaymentMethod[]; // payment method to which current user should send money (for sell orders state prepared for maker)
    payment_method_id?: number; // payment method to which another user has sent money (for buy orders in wait state for maker)
}

export interface P2PChat {
    id: number;
    order_id: number;
    sender_uid: number | string;
    receiver_uid: number | string;
    message: string;
    attachment_url?: string;
}
