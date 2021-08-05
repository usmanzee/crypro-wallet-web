import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles, Theme, createStyles, withStyles} from '@material-ui/core/styles';
import { CopyTag } from '../../components';
import * as PublicDataAPI from '../../apis/public_data';


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
	depositEnabled?: boolean;
	
	handleOnCopy: (text: string) => void;

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
	depositInfo: {
		padding: theme.spacing(2),
		marginBottom: theme.spacing(2),
        background: theme.palette.background.default
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
		referenceTip,
		handleOnCopy,
		depositEnabled
	} = props;

	const [bankDepositDetails, setBankDepositDetails] = React.useState<any>([]);

	React.useEffect(() => {
		getBankDetails();
	},[]);

	const getBankDetails = () => {
		PublicDataAPI.getBanksDepositDetails().then((responseData) => {
			setBankDepositDetails(responseData);
		});
	}

    // const depositTitle = (currency === 'usd' || currency === 'eur') ? 'Deposit using Transferwise' : title;
    // const depositDescription = (currency === 'usd' || currency === 'eur') ? 'Please using following to deposit using TrasferWise' : description;

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
					<Typography variant="body1" display="inline">
						<FormattedMessage id={'page.body.deposit.network.title'} /> 
					</Typography>
				</div> 
				<div className="cr-deposit-fiat">
					{depositEnabled ? 
						<>
							<Typography variant="h6" gutterBottom>
								{title}
							</Typography>
							<Typography variant="subtitle1" gutterBottom className={classes.depositDescription}>
								{description}
							</Typography>
							<Paper variant="outlined" className={classes.depositInfo}>
								<Alert severity="info" color="error">
									<Typography variant="button">
										{referenceTip}
									</Typography>
								</Alert>

								<List className={classes.list}>
									<ListItem disableGutters>
										<Typography variant="h6" display="inline" gutterBottom>
											<FormattedMessage id="page.body.wallets.tabs.deposit.fiat.referenceCode" />
										</Typography>
									</ListItem>
									<ListItem disableGutters>
										<Typography variant="h6" display="inline" gutterBottom>
											{uid}
											<CopyTag text={uid} disabled={false} />
										</Typography>
									</ListItem>
								</List>
							</Paper>
							{/* <Divider className={classes.BanksDivider}/> */}
							{bankDepositDetails.map(renderDetails)}
						</> :
						<>
							<div style={{ textAlign: 'center' }}>
								<LockOutlinedIcon fontSize="large" color="primary" style={{ height: '80px', width: '80px' }} />
								<Typography variant="h6">
									<FormattedMessage id={'page.body.wallets.tabs.deposit.disabled.message'} /> 
								</Typography>
							</div>
						</>
					}
				</div>
			</Paper>
     	</>
    );
};

export {
    DepositFiat,
};