import * as React from 'react';
import { FormattedMessage } from 'react-intl';


export interface DepositFiatProps {
    /**
     * Sets helper description
     */
    description: string;
    /**
     * Sets title describing the data displayed in children
     */
    title: string;
    uid: string;
    currency: string;
}


/**
 * Component to display bank account details which can be used for a
 * deposit
 */
const DepositFiat: React.FunctionComponent<DepositFiatProps> = (props: DepositFiatProps) => {
    const {
        description,
        title,
        uid,
        currency,
    } = props;
//@ts-ignore
    const bank_account = (id) =>{

        if(id === 'usd'){
          return  '831-061-555-0'
        }
        if (id === 'myr'){
          return '704-128-334-9'
        }
        if (id === 'eur'){
          return 'BE79-9670-5851-7133'
        }
        if(id ==='sgd'){
          return '704-128-335-7'
        }
      }
      //@ts-ignore
      const bank_name = (id) =>{
        if(id === 'usd'){
         return  "Bank Cod(Swift/Bic): CMFGUS33"
        }
        if (id === 'myr'){
          return "OCBC Bank"
        }
        if (id === 'eur'){
          return "Bank Cod(Swift/Bic): TRWIBEB1XXX"
        }
        if(id ==='sgd'){
          return "OCBC Bank"
        }
    
      }
      //@ts-ignore
      const bank_title = (id) =>{
        if(id === 'usd'){
         return  "B4U Group of Companies, S.L"
        }
        if (id === 'myr'){
          return "BRAVO Tech Trading"
        }
        if (id === 'eur'){
          return "B4U Group of Companies, S.L"
        }
        if(id ==='sgd'){
          return "BRAVO Tech Trading"
        }
    
      }
    
    
    const bankData = uid => [
        {
            key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankName" />,
            value: bank_name(currency),
        },
        {
            key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.accountNumber" />,
            value: bank_account(currency),
        },
        {
            key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.accountName" />,
            value: bank_title(currency),
        },
        {
            key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.referenceCode" />,
            value: uid,
        },
    ];

    const renderDetails = (detail, index: number) => {
        return (
            <div className="cr-deposit-fiat-detail" key={index}>
                <p className="cr-deposit-fiat-detail__label">{detail.key}:</p>
                <p className="cr-deposit-fiat-detail__value">{detail.value}</p>
            </div>
        );
    };

    return (
        <div className="cr-deposit-fiat">
            <p className="cr-deposit-fiat__title">{currency==='usd'|| 'eur'?'Deposit using TransferWise':title}</p>
            <p className="cr-deposit-fiat__description">{currency==='usd'|| 'eur'?'Please using following to deposit using TrasferWise':description}</p>
            <div className="cr-deposit-fiat-credentials">{bankData(uid).map(renderDetails)}</div>
        </div>
    );
};

export {
    DepositFiat,
};
