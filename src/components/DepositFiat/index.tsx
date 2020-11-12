import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles, Theme, createStyles, withStyles} from '@material-ui/core/styles';
import {
    Paper,
	Typography,
	List,
	ListItem,
	ListItemText,
	Divider
} from '@material-ui/core';


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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    networkPaper: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2)}px`,
        margin: `${theme.spacing(2)}px 0px`,
        borderRadius: '4px'
    },
    networkPaperHeader: {
        paddingBottom: theme.spacing(1),
        borderWidth: '0px 0px 1px',
        borderStyle: 'solid',
        borderColor: 'rgb(234, 236, 239)'
    },
    depositDescription: {
      marginBottom: `${theme.spacing(3)}px`
	},
	list: {
		display: 'flex',
		flexDirection: 'row',
		padding: 0,
        [theme.breakpoints.only('xs')]: {
            display: 'block',
        },
	},
	BanksDivider: {
		margin: `${theme.spacing(2)}px 0px`
	}
  }),
);


/**
 * Component to display bank account details which can be used for a
 * deposit
 */
const DepositFiat: React.FunctionComponent<DepositFiatProps> = (props: DepositFiatProps) => {
    const classes = useStyles();
    const {
        description,
        title,
        uid,
        currency,
	} = props;

    const depositTitle = (currency === 'usd' || currency === 'eur') ? 'Deposit using Transferwise' : title;
    const depositDescription = (currency === 'usd' || currency === 'eur') ? 'Please using following to deposit using TrasferWise' : description;

    const renderDetails = (detail, index: number) => {

		if(detail.title !== currency) {
			return null;
		}

		return (
			<>
				{detail.banks && detail.banks.map((bank) => {
					return (
						<>
						{Object.entries(bank).map(([key, value]) => {
							return (
							<>
								<List className={classes.list} disablePadding={true}>
									<ListItem disableGutters>
										<Typography variant="button" display="inline" gutterBottom>
											{/* <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankName" /> */}
											{key}
										</Typography>
									</ListItem>
									<ListItem disableGutters>
									<Typography variant="body1" display="inline" gutterBottom>
										{/* @ts-ignore */}
											{value}
										</Typography>
									</ListItem>
								</List>
							</>
						)
					})}
					<Divider className={classes.BanksDivider}/>
						</>
					);
			  })}
			</>
		  );
    };

    return (
      <>
      	<Paper elevation={2} className={classes.networkPaper}>
          	<div className={classes.networkPaperHeader}>
              	<Typography variant="body1" component="div" display="inline">
                  <FormattedMessage id={'page.body.deposit.network.title'} /> 
              	</Typography>
          	</div>
          	<div className="cr-deposit-fiat">
              	<Typography variant="h6" component="div" gutterBottom>{depositTitle}</Typography>
              	<Typography variant="subtitle1" component="div" gutterBottom className={classes.depositDescription}>{depositDescription}</Typography>
              	<div className="cr-deposit-fiat-credentials">
                	{bankCurrencies.map(renderDetails)}
              	</div>
          	</div>
      	</Paper>
      </>
    );
};

export {
    DepositFiat,
};

const bankCurrencies = [
	{
		id: '1',
		title: 'eur',
		banks: [
      		{
				"Account holder": 'B4U Group of Companies, S.L',
				"IBAN": 'BE79 9670 5851 7133',
				"SWIFT/BIC": 'TRWIBEB1XXX',
				"Address": 'TransferWise Europe SA \nAvenue Louise 54, Room S52\n Brussels\n 1050\n Belgium',
				"Bank Name": 'TransferWise',
			}
    	]
  	},
	{
		id: '2',
		title: 'myr',
		banks: [
			{
				"Account holder": 'BRAVO Tech Trading',
				"Bank Name": 'OCBC Bank',
				"Account Number": '704-128-334-9',
			}
		]
	},
	{
		id: '3',
		title: 'usd',
		banks: [
			{
				"Account holder": 'B4U Group of Companies, S.L.',
				"ACH routing number": '026073150',
				"Wire routing number": '026073008',
				"Account number": '8310615550',
				"Account type": 'Checking',
				"Address": 'TransferWise 19 W 24th Street \nNew York NY 10010\n United States\n Belgium',
				"Bank Name": 'TransferWise',
			}
		]
	},
	{
		id: '4',
		title: 'sgd',
		banks: [
			{
				"Account holder": 'BRAVO Tech Trading',
				"Bank Name": 'OCBC Bank',
				"Account Number": '704-128-335-7',
			}
		]
	}
];