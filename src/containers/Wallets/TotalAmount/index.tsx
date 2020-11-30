import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { InjectedIntlProps, injectIntl, FormattedMessage} from 'react-intl';

interface TotalAmountContainerProps {
    walletAvailableAmount: string;
    walletLockedAmount: string;
    precision: number;
    currencyName: string;
}


type Props = TotalAmountContainerProps & InjectedIntlProps;
const TotalAmountContainer = (props: Props) => {
    
    const { walletAvailableAmount, walletLockedAmount, precision, currencyName} = props;

    const available: number = Number(walletAvailableAmount);
    const locked: number = Number(walletLockedAmount.locked);
    const total: number = available + locked;

    return (
        <>
            <Typography variant="h6" component="div" display="inline" style={{ opacity: '0.6', marginRight: '8px' }}>
                <FormattedMessage id={'page.body.withdraw.total_balance'} />:
            </Typography>
            <Typography variant="h6" component="div" display="inline" style={{ marginRight: '4px' }}>{ +total.toFixed(precision)}</Typography>
            <Typography variant="h6" component="div" display="inline">{ currencyName.toUpperCase() }</Typography>
        </>
    );

}

export const TotalAmount = TotalAmountContainer;