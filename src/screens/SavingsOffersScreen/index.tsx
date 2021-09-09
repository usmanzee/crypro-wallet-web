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
    savingsWalletsFetch,
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
const SavingsOffersComponent = (props: Props) => {
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
        if(!savingsWallets.length) {
            dispatch(savingsWalletsFetch());
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
            console.log('here');
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
                                    Coin
                                </StyledTableCell>
                                <StyledTableCell>
                                    Estimated Annual Yield
                                </StyledTableCell>
                                <StyledTableCell>
                                    Flexible Interest Per Thousand
                                </StyledTableCell>
                                <StyledTableCell>
                                    Auto Transfer
                                </StyledTableCell>
                                <StyledTableCell>
                                    Actions
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
                                                        <Chip color="secondary" size="small" style={{ marginRight: '8px', fontWeight: 700}} label={flexiableSavingsPlan.currency_id[0].toUpperCase()} />
                                                        <Typography variant='body1' component="div">{flexiableSavingsPlan.currency_id.toUpperCase()}</Typography>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <div style={{ }}>
                                                        <Typography variant='body1' component="div" style={{ color: '#02C076' }}>{`${flexiableSavingsPlan.rate}%`}</Typography>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <div style={{ }}>
                                                        <Typography variant='body1' component="div" style={{  }}>{`${ratePerDay.toFixed(5)} ${flexiableSavingsPlan.currency_id.toUpperCase()}`}</Typography>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                        <Switch
                                                            checked={flexiableSavingsPlan.autoTransfer}
                                                            onChange={() => handleAutoTransferClick(flexiableSavingsPlan)}
                                                            name="auto_subscribe"
                                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                        />
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <div style={{ }}>
                                                        <Button variant="contained" color="secondary" onClick={() => handleFlexiableSavingsSubscribeClick(flexiableSavingsPlan)}>
                                                            Subscribe
                                                        </Button>
                                                    </div>
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
                                    Coin
                                </StyledTableCell>
                                <StyledTableCell>
                                    Annualized Interest Rate
                                </StyledTableCell>
                                <StyledTableCell>
                                    Duration (days)
                                </StyledTableCell>
                                {/* <StyledTableCell>
                                    Interest Per Lot
                                </StyledTableCell> */}
                                <StyledTableCell>
                                    Actions
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {lockedSavingsPlans.length ? 
                            <TableBody>
                                {lockedSavingsPlans.map((lockedSavingsPlan) => {
                                    return (
                                        <>
                                            <TableRow hover>
                                                <StyledTableCell>
                                                    <div style={{ display: 'flex', alignItems: 'center'}}>
                                                        <Chip color="secondary" size="small" style={{ marginRight: '8px', fontWeight: 700}} label={lockedSavingsPlan.currency_id[0].toUpperCase()} />
                                                        <Typography variant='body1' component="div">{lockedSavingsPlan.currency_id.toUpperCase()}</Typography>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <div style={{ }}>
                                                        <Typography variant='body1' component="div" style={{ color: '#02C076' }}>{`${lockedSavingsPlan.rate}%`}</Typography>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <div style={{ }}>
                                                        {lockedSavingsPlan.durations.map((duration) => {
                                                            return (
                                                                <>
                                                                    <Button variant="outlined" color={lockedSavingsPlan.selectedDuration == duration ? "secondary" : "default"} style={{ marginRight: '8px', minWidth: '50px' }} onClick={() => onDurationClick(lockedSavingsPlan, duration)}>
                                                                        {duration}
                                                                    </Button>
                                                                </>
                                                            );
                                                        })}                                                        
                                                    </div>
                                                </StyledTableCell>
                                                {/* <StyledTableCell>
                                                    <div style={{ }}>
                                                        <Typography variant='body1' component="div" style={{ fontWeight: 700 }}>0.0137 USDT</Typography>
                                                    </div>
                                                </StyledTableCell> */}
                                                <StyledTableCell>
                                                    <div style={{ }}>
                                                    <Button variant="contained" color="secondary" onClick={() => handleLockedSavingsSubscribeClick(lockedSavingsPlan)}>
                                                        Subscribe
                                                    </Button>
                                                    </div>
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
            </>
        );
    }

    const renderSubscriptionDialog = () => {
        return (
            <>
                {selectedPlan && selectedWallet ? <Dialog
                    fullScreen={isSmallScreen}
                    fullWidth={true}
                    maxWidth='sm'
                    open={planDialogOpen}
                    onClose={handlePlanDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">{`Subscribe ${selectedPlan.currency_id.toUpperCase()}`}</Typography>
                            <CloseIcon onClick={e => handlePlanDialogClose()} style={{ cursor: 'pointer', }}/>
                        </div>
                    </DialogTitle>
                    <DialogContent dividers style={{ padding: '12px 16px' }}>
                        {selectedPlan.type == 'Flexible' ? renderFlexiableDialogContent() : renderLockedDialogContent()}
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={isFlexiableSubscriptionFormInvalid()} variant="contained" color="secondary" fullWidth style={{ margin: '8px 0px' }} onClick={e => onSubscribeClick(selectedPlan)}>
                        {subscribing ? <CircularProgress size={18} color="inherit"/> :  'Confirm'}
                        </Button>
                    </DialogActions>
                </Dialog> : ''}
            </>
        );
    }

    const renderFlexiableDialogContent = () => {
        return (
            <>
                <div>
                    <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                Subscription amount
                            </InputLabel>
                            <Typography variant="body2">Available {selectedWallet.balance} {selectedPlan.currency_id.toUpperCase()}</Typography>
                    </div>
                    <FormControl variant="outlined" fullWidth error={subscriptionAmountErrorMessage != ''}>
                        <TextField
                            className={classes.numberInput}
                            id="amount_field"
                            placeholder="Please enter the amount"
                            fullWidth
                            variant="outlined"
                            size="small"
                            type="number"
                            value={subscriptionAmount}
                            onChange={(e) => {
                                handleSubscriptionAmountChange(e)
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <Typography variant="button" display="inline" style={{ color: 'rgb(112, 122, 138)' }}>{selectedPlan.currency_id.toUpperCase()}</Typography>
                                    <Divider className={classes.inputAdornmentDivider} orientation="vertical" style={{ margin: '0px 8px' }} />
                                    <span className={classes.maxButton} onClick={() => setMaxWithdrawlAmount(selectedPlan)}>
                                        <FormattedMessage id={'page.body.swap.input.tag.max'} />
                                    </span>
                                </InputAdornment>,
                            }}
                        />
                        {subscriptionAmountErrorMessage && <FormHelperText id="sell-text">{subscriptionAmountErrorMessage}</FormHelperText>}
                    </FormControl>
                    <div style={{ margin: '8px 0px' }}>
                        <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                            <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                Flexible Interest Per Thousand
                            </InputLabel>
                            <Typography variant="body2">{selectedPlan.ratePerDuration} {selectedPlan.currency_id.toUpperCase()}</Typography>
                        </div>
                            <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                                <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                    Estimated Annual Yield
                                </InputLabel>
                                <Typography variant="body2" style={{ color: '#02C076', fontWeight: 700, fontSize: '18px' }}>{selectedPlan.currency_id.toUpperCase()} {selectedPlan.rate}%</Typography>
                        </div>
                        <div style={{ display: 'flex', marginTop: '24px' }}>
                            <Checkbox
                                checked={termsAndConditions}
                                color="secondary"
                                onChange={() => setTermsAndConditions(!termsAndConditions)}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                style={{ padding: '0px' }}
                            />
                            <Typography style={{ marginLeft: '4px' }}>I have read and I agree to</Typography>
                            <Link to="/">
                                <Typography style={{ marginLeft: '4px' }} className={classes.hrefLink}>Binance Savings Service Agreement</Typography>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    const renderLockedDialogContent = () => {
        return (
            <>
                <div>
                    <div style={{ }}>
                        <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                Activity duration(day)
                            </InputLabel>
                        </div>
                        <div style={{ }}>
                            {selectedPlan.durations.map((duration) => {
                                return (
                                    <>
                                        <Button variant="outlined" color={selectedPlan.selectedDuration == duration ? "secondary" : "default"} style={{ marginRight: '8px' }} onClick={() => onDurationClick(selectedPlan, duration)}>
                                            {`${duration} days`}
                                        </Button>
                                    </>
                                );
                            })}                                                        
                        </div>
                    </div>
                    <div style={{ margin: '8px 0px' }}>
                        <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                Subscription amount
                            </InputLabel>
                            <Typography variant="body2">Available {selectedWallet.balance} {selectedPlan.currency_id.toUpperCase()}</Typography>
                        </div>
                        <FormControl variant="outlined" fullWidth error={subscriptionAmountErrorMessage != ''}>
                            <TextField
                                className={classes.numberInput}
                                id="outlined-full-width"
                                placeholder="Please enter the amount"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type="number"
                                value={subscriptionAmount}
                                onChange={(e) => {
                                    handleSubscriptionAmountChange(e)
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <Typography variant="button" display="inline" style={{ color: 'rgb(112, 122, 138)' }}>{selectedPlan.currency_id.toUpperCase()}</Typography>
                                        <Divider className={classes.inputAdornmentDivider} orientation="vertical" style={{ margin: '0px 8px' }} />
                                        <span className={classes.maxButton} onClick={() => setMaxWithdrawlAmount(selectedPlan)}>
                                            <FormattedMessage id={'page.body.swap.input.tag.max'} />
                                        </span>
                                    </InputAdornment>,
                                }}
                            />
                            {subscriptionAmountErrorMessage && <FormHelperText id="sell-text">{subscriptionAmountErrorMessage}</FormHelperText>}
                        </FormControl>
                    </div>
                    <div style={{ margin: '8px 0px' }}>
                        <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                            <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                Flexible Interest Per Thousand
                            </InputLabel>
                            <Typography variant="body2">{selectedPlan.ratePerDuration} {selectedPlan.currency_id.toUpperCase()}</Typography>
                        </div>
                            <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                                <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                    Estimated Annual Yield
                                </InputLabel>
                                <Typography variant="body2" style={{ color: '#02C076', fontWeight: 700, fontSize: '18px' }}>{selectedPlan.currency_id.toUpperCase()} {selectedPlan.rate}%</Typography>
                        </div>
                        <div style={{ display: 'flex', marginTop: '24px' }}>
                            <Checkbox
                                checked={termsAndConditions}
                                color="secondary"
                                onChange={() => setTermsAndConditions(!termsAndConditions)}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                style={{ padding: '0px' }}
                            />
                            <Typography style={{ marginLeft: '4px' }}>I have read and I agree to</Typography>
                            <Link to="/">
                                <Typography style={{ marginLeft: '4px' }} className={classes.hrefLink}>Savings Service Agreement</Typography>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const headerActionLinks = [
        ['Account', 'wallets/saving'],
        ['History', '/savings/history'],
    ];

    return (
        <>
            <PageHeader pageTitle={'B4U Wallet Savings'} actionsLinks={headerActionLinks} />
            {savingsWallets ? savingsWallets.length ? <EstimatedValue wallets={savingsWallets} /> : '' : <CircularProgress size={20} />}
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
            {renderSubscriptionDialog()}
        </>
    );    
}

export const SavingsOffersScreen = SavingsOffersComponent;