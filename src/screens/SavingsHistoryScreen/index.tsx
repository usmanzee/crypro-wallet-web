import * as React from 'react';
import { useTheme, withStyles } from '@material-ui/core/styles';
import { 
    Box, 
    Paper,
    Typography,
    Button,
    TextField,
    useMediaQuery,
    Popper,
    InputBase,
    InputLabel,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Chip,
    IconButton,
    AppBar,
    Tabs,
    Tab,
    Switch,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputAdornment,
    Divider,
    Checkbox,
    FormHelperText
} from '@material-ui/core';
import { StyledTableCell } from '../materialUIGlobalStyle';

import CloseIcon from '@material-ui/icons/Close';
import FindInPageIcon from '@material-ui/icons/FindInPage';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import clsx from  'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';

import { InfoDialog } from '../../components/InfoDialog';
import { P2PLinks } from '../../components/P2P/P2PLinks';
import { setDocumentTitle } from '../../helpers';
import { PageHeader } from '../../containers/PageHeader';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { useStyles } from './style';

import {
    WalletItemProps,
    CryptoIcon,
} from '../../components';

import { 
    selectUserLoggedIn, 
    selectWallets,
    selectSavingsWallets,
    User,
    walletsData,
    selectWalletsLoading,
    walletsFetch,
    SavingsPlan, 
    savingsPlansFetch, 
    selectSavingsPlans, 
    selectSavingsPlansFetching,
    selecteSavingPlansSubscribing,
    selecteSavingPlansSubscribeSuccess,
    savingPlanSubscribeFetch,
} from '../../modules';

import {
    useParams,
    useHistory
} from "react-router-dom";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
        {value === index && (
            <Box>
                {children}
            </Box>
        )}
        </div>
    );
}
  
function a11yProps(index: any) {
    return {
      id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const AntTabs = withStyles({
    root: {
      backgroundColor: "white",
      borderBottom: '0.1rem solid rgb(170, 170, 170)',
      boxShadow: "none"
    }
  })(Tabs);
  
type Props = RouterProps & InjectedIntlProps;
const SavingsHistoryComponent = (props: Props) => {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [tabValue, setTabValue] = React.useState(0);

    const [selectedWallet, setSelectedWallet] = React.useState<WalletItemProps>(null);
    const [flexiableSavingsPlans, setFlexiableSavingsPlans] = React.useState<SavingsPlan[]>([]);
    const [lockedSavingsPlans, setLockedSavingsPlans] = React.useState<SavingsPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = React.useState<SavingsPlan>(null);
    
    const [autoTransferInfoDialogOpen, setAutoTransferInfoDialogOpen] = React.useState(false);
    const [planDialogOpen, setPlanDialogOpen] = React.useState(false);

    const [subscriptionAmount, setSubscriptionAmount] = React.useState<string>('');
    const [subscriptionAmountErrorMessage, setSubscriptionAmountErrorMessage] = React.useState<string>('');
    const [termsAndConditions, setTermsAndConditions] = React.useState(false);

    const dispatch = useDispatch();
    const loggedIn = useSelector(selectUserLoggedIn);
    const walletLoading = useSelector(selectWalletsLoading);
    const wallets = useSelector(selectWallets);
    const savingsWallets = useSelector(selectSavingsWallets);
    const savingsPlans = useSelector(selectSavingsPlans);
    const savingsPlansLoading = useSelector(selectSavingsPlansFetching);
    const subscribing = useSelector(selecteSavingPlansSubscribing);
    const subscribeSuccess = useSelector(selecteSavingPlansSubscribeSuccess);

    React.useEffect(() => {
        setDocumentTitle('Saving Crypto | Best crypto saving platform');
    }, []);

    React.useEffect(() => {
        if(!savingsPlans.length) {
            dispatch(savingsPlansFetch());
        } else {
            filterSavingsPlans();
        }
    }, [savingsPlans]);
    
    React.useEffect(() => {
        if(!savingsWallets) {
            dispatch(walletsFetch());
        }
    }, [savingsWallets]);

    React.useEffect(() => {
        if(subscribeSuccess) {
            setSubscriptionAmount('');
            setSubscriptionAmountErrorMessage('');
            setTermsAndConditions(false);
            handlePlanDialogClose();
        }
    }, [subscribeSuccess]);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };

    const filterSavingsPlans = () => {
        var flexiableSavingsPlans: SavingsPlan[] = [];
        var lockedSavingsPlans: SavingsPlan[] = [];
        savingsPlans.map((item) => {
            item.durations = ['15', '30', '60'];
            item.selectedDuration = '15';
            item.autoTransfer = false;
            if(item.type.toLocaleLowerCase() == 'Flexible'.toLocaleLowerCase()) {
                const ratePerDay = ((1000/365)/100) * Number(item.rate);
                item.ratePerDuration = ratePerDay.toFixed(5);
                flexiableSavingsPlans.push(item);
            } else {
                const ratePerDay = ((1000/365)/100) * Number(item.rate);
                item.ratePerDuration = ratePerDay.toFixed(5);
                lockedSavingsPlans.push(item);
            }
        });
        setLockedSavingsPlans(lockedSavingsPlans);
        setFlexiableSavingsPlans(flexiableSavingsPlans);
    }
    
    const handleAutoTransferDialogOpen = () => {
        setAutoTransferInfoDialogOpen(true);
    };

    const handleAutoTransferDialogClose = () => {
        setAutoTransferInfoDialogOpen(false);
    };

    const onDurationClick = (lockedPlan: SavingsPlan,  newValue: string) => {
        let newArr = lockedSavingsPlans.map((item, i) => {
            if (item.id == lockedPlan.id) {
                item.selectedDuration = newValue;
            }
            return item;
        });
        setLockedSavingsPlans(newArr);
    }

    const handleAutoTransferClick = (plan: SavingsPlan) => {
        if(loggedIn) {
            if(!plan.autoTransfer) {
                handleAutoTransferDialogOpen();
            }
            let newArr = flexiableSavingsPlans.map((item, i) => {
                if (item.id == plan.id) {
                    item.autoTransfer = !item.autoTransfer;
                }
                return item;
            });
            setFlexiableSavingsPlans(newArr);
        } else {
            history.push('/signin');
        }
    }

    const handlePlanDialogOpen = () => {
        setPlanDialogOpen(true);
    };

    const handlePlanDialogClose = () => {
        setPlanDialogOpen(false);
        setSubscriptionAmount('');
        setSubscriptionAmountErrorMessage('');
        setTermsAndConditions(false);
    };

    const handleFlexiableSavingsSubscribeClick = (plan: SavingsPlan) => {
        if(loggedIn) {
            setSelectedPlan(plan);
            searchWalletByCurrency(plan.currency_id);
            handlePlanDialogOpen();
        } else {
            history.push('/signin');
        }
    }

    const handleLockedSavingsSubscribeClick = (plan: SavingsPlan) => {
        if(loggedIn) {
            setSelectedPlan(plan);
            searchWalletByCurrency(plan.currency_id);
            handlePlanDialogOpen();
        } else {
            history.push('/signin');
        }
    }

    const searchWalletByCurrency = (currencyId: string) => {
        var searchedWallet = savingsWallets.find((wallet) => {
            return wallet.currency.toLocaleLowerCase() == currencyId.toLocaleLowerCase();
        });
        setSelectedWallet(searchedWallet);
    }

    const handleSubscriptionAmountChange = (event) => {
        const value = event.target.value;
        setSubscriptionAmount(value);
        handleSubscriptionAmountError(value);
    }

    const handleSubscriptionAmountError = (amount) => {
        let errorMsg = '';
        if (amount) {
            if (Number(amount) > Number(selectedWallet.balance)) {
                errorMsg = 'Insufficient balance, please credit your wallet'
            }
        } else {
            errorMsg = '';
        }
        setSubscriptionAmountErrorMessage(`${errorMsg}`);
    }

    const setMaxWithdrawlAmount = (plan: SavingsPlan) => {
        setSubscriptionAmount(selectedWallet.balance);
    }

    const isFlexiableSubscriptionFormInvalid = () => {
        return (Number(subscriptionAmount) <= 0 || (subscriptionAmountErrorMessage != '') || !termsAndConditions || subscribing);
    }

    const onSubscribeClick = (plan: SavingsPlan) => {
        const requestParams = {
            amount: subscriptionAmount,
            plan_id: plan.id,
            // status: plan.type,
        };
        if(plan.type == 'Locked') {
            requestParams['duration'] = plan.selectedDuration;
        } else {
            requestParams['auto_subscribe'] = plan.autoTransfer;
        }
        dispatch(savingPlanSubscribeFetch(requestParams));
    }

    const renderFlexiableSavings = () => {
        return (
            <>
                <TableContainer>
                    <Table aria-label="Savings offers">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Subscription Date
                                </StyledTableCell>
                                <StyledTableCell>
                                    Product Name
                                </StyledTableCell>
                                <StyledTableCell>
                                    Coin
                                </StyledTableCell>
                                <StyledTableCell>
                                    Amount
                                </StyledTableCell>
                                <StyledTableCell>
                                    Subscription type
                                </StyledTableCell>
                                <StyledTableCell>
                                    Status
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {flexiableSavingsPlans.length ? 
                            <TableBody>
                                {flexiableSavingsPlans.map((flexiableSavingsPlan) => {
                                    const ratePerDay = ((1000/365)/100) * Number(flexiableSavingsPlan.rate);
                                    return (
                                        <>
                                            <TableRow hover>
                                                <StyledTableCell>
                                                    <div style={{ display: 'flex', alignItems: 'center'}}>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <div style={{ }}>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <div style={{ }}>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                        
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    
                                                </StyledTableCell>
                                            </TableRow>
                                        </>
                                    );
                                })}
                            </TableBody>
                            :
                            <>
                                {savingsPlansLoading ?
                                    <>
                                        <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                            <CircularProgress size={20} />
                                        </caption>
                                    </> :
                                    <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                        <FormattedMessage id={'no.record.found'} />
                                    </caption>
                                }
                            </>
                        }
                    </Table>
                </TableContainer>
                <InfoDialog title='Auto Transfer' body= 'Turning Auto-transfer on means your corresponding asset (including your interests, new token purchase) in the spot wallet will be transferred to the Earn wallet every 24 hours; you can find the auto-transfer history under [Earn History]-[Savings]-[Flexible].' open={autoTransferInfoDialogOpen} handleClose={handleAutoTransferDialogClose} />
            </>
        );
    }

    const renderLockedSavings = () => {
        return (
            <>
                <TableContainer>
                    <Table aria-label="Savings offers">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Locked Savings
                                </StyledTableCell>
                                <StyledTableCell>
                                    Coin
                                </StyledTableCell>
                                <StyledTableCell>
                                    Holding (Lot)
                                </StyledTableCell>
                                <StyledTableCell>
                                    Amount
                                </StyledTableCell>
                                <StyledTableCell>
                                    Duration (days)
                                </StyledTableCell>
                                <StyledTableCell>
                                    Annualized Interest Rate
                                </StyledTableCell>
                                <StyledTableCell>
                                    Value Date
                                </StyledTableCell>
                                <StyledTableCell>
                                    Redemption Date
                                </StyledTableCell>
                                <StyledTableCell>
                                    Interest
                                </StyledTableCell>
                                <StyledTableCell>
                                    Renew
                                </StyledTableCell>
                                <StyledTableCell>
                                    Operation
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {!lockedSavingsPlans.length ? 
                            <TableBody>
                                {lockedSavingsPlans.map((lockedSavingsPlan) => {
                                    return (
                                        <>
                                            <TableRow hover>
                                                <StyledTableCell>
                                                    <div style={{ display: 'flex', alignItems: 'center'}}>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <div style={{ }}>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <div style={{ }}>
                                                                                                            
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <div style={{ }}>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <div style={{ }}>
                                                    </div>
                                                </StyledTableCell>
                                            </TableRow>
                                        </>
                                    );
                                })}
                            </TableBody>
                            :
                            <>
                                {!savingsPlansLoading ?
                                    <>
                                        <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                            <CircularProgress size={20} />
                                        </caption>
                                    </> :
                                    <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                        <FormattedMessage id={'no.record.found'} />
                                    </caption>
                                }
                            </>
                        }
                    </Table>
                </TableContainer>
            </>
        );
    }

    return (
        <>
            <PageHeader pageTitle={'Savings History'} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={classes.pageContent} >
                <AppBar position="static" color="default" style={{ boxShadow: "none" }}>
                    <AntTabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant={isSmallScreen ? "scrollable" : "standard"}
                        scrollButtons="on"
                    >
                        <Tab component="a" label='Flexible Savings' {...a11yProps(0)} />
                        <Tab component="a" label={'Locked Savings'} {...a11yProps(1)} />
                    </AntTabs>
                    </AppBar>
                    <TabPanel value={tabValue} index={0}>
                        <div style={{ margin: '16px 0px' }}>
                            {renderFlexiableSavings()}
                        </div>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <div style={{ margin: '16px 0px' }}>
                            {renderLockedSavings()}
                        </div>
                    </TabPanel>
                </Paper>
            </Box>
        </>
    );    
}

export const SavingsHistoryScreen = SavingsHistoryComponent;