import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Alert from '@material-ui/lab/Alert';
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
	referenceTip?: string;
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
		referenceTip
	} = props;

    // const depositTitle = (currency === 'usd' || currency === 'eur') ? 'Deposit using Transferwise' : title;
    // const depositDescription = (currency === 'usd' || currency === 'eur') ? 'Please using following to deposit using TrasferWise' : description;

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
              	<Typography variant="h6" component="div" gutterBottom>
					  {title}
				</Typography>
              	<Typography variant="subtitle1" component="div" gutterBottom className={classes.depositDescription}>
					  {description}
				</Typography>
				 <Alert severity="warning" className={classes.depositDescription}>
					<Typography variant="button" component="div">
						{referenceTip}
					</Typography>
				</Alert>

				<List className={classes.list} disablePadding={true}>
					<ListItem disableGutters>
						<Typography variant="h6" display="inline" gutterBottom>
							Reference ID
						</Typography>
					</ListItem>
					<ListItem disableGutters>
						<Typography variant="h6" display="inline" gutterBottom>
							{uid}
						</Typography>
					</ListItem>
				</List>
				<Divider className={classes.BanksDivider}/>
				
				{bankCurrencies.map(renderDetails)}
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

const values = {
	"localizedLastName": "King",
	"lastName": {
		"localized": {
			"en_US": "King"
		},
		"preferredLocale": {
			"country": "US",
			"language": "en"
		}
	},
	"firstName": {
		"localized": {
			"en_US": "Benn"
		},
		"preferredLocale": {
			"country": "US",
			"language": "en"
		}
	},
	"profilePicture": {
		"displayImage": "urn:li:digitalmediaAsset:C5603AQGjLGZPOyRBBA"
	},
	"id": "fm0B3D6y3I",
	"localizedFirstName": "Benn"
}