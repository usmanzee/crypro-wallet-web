export interface MerchantPayment {
    txid: string,
    order_id: string,
    amount: string,
    payment_address: string,
    status: string,
    created_at: string,
    updated_at: string,
}