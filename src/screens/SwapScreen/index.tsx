import * as React from 'react';
import { fade, makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';

import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

import { cleanPositiveFloatInput} from '../../helpers';
import { toast } from 'react-toastify';
import { fetchRate, getExchangeHistory, postExchange } from '../../apis/exchange';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { RouterProps } from 'react-router';
import { connect } from 'react-redux';
import { WalletItemProps, WalletsDropdown, Decimal } from '../../components';
import { ExchangeHistory, ExchangeHistoryProps } from '../../containers/ExchangeHistory';
import { alertPush, 
    currenciesFetch, 
    Currency, 
    RootState, 
    selectCurrencies, 
    selectHistory, 
    selectUserInfo, 
    selectWalletAddress, 
    selectWallets, 
    selectWalletsAddressError, 
    selectWalletsLoading, 
    selectWithdrawSuccess, 
    setMobileWalletUi, 
    User, 
    WalletHistoryList, 
    walletsAddressFetch, 
    walletsData, 
    walletsFetch, 
    walletsWithdrawCcyFetch, 
    exchangeRateFetch,
    selectIsFetchingExchangeRate,
    selectExchangeRate,
    exchangeRateReset,
    exchangeRequest
} from '../../modules';
import { stat } from 'fs';

interface ReduxProps {
    user: User;
    wallets: WalletItemProps[];
    walletsLoading?: boolean;
    historyList: WalletHistoryList;
    currencies: Currency[];
    isFetchingRate: boolean;
    exchangeRate: string;
}

interface DispatchProps {
    fetchWallets: typeof walletsFetch;
    fetchAddress: typeof walletsAddressFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    fetchAlert: typeof alertPush;
    currenciesFetch: typeof currenciesFetch;
    exchangeRateFetch: typeof exchangeRateFetch;
    exchangeRateReset: typeof exchangeRateReset;
    exchangeRequest: typeof exchangeRequest;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerPaper: {
        height: "100px", 
        padding: "32px 20px"
    },
    page: {
        padding: `${theme.spacing(3)}px ${theme.spacing(4)}px`,
    },
    pageTitle: {
        textAlign: 'center'
    },
    pageContent: {
        padding: `${theme.spacing(3)}px ${theme.spacing(0)}px`,
    },
    swapFromFields: {
        margin: `0px 0px ${theme.spacing(3)}px 0px`,
    },
    swapFields: {
        display: 'flex',
        margin: `0px 0px ${theme.spacing(3)}px 0px`,
    },
    formControl: {
        marginRight: '4px'
    },
    maxButton: {
         cursor: 'pointer',
         color: theme.palette.primary.main
    },
    walletSelect: {
        display: 'flex',
        // width: 300,
        cursor: 'pointer',
        // margin:' 8px 0px',
        padding: `12px ${theme.spacing(1)}px`,
        borderRadius: '4px',
        borderWidth: '1px',
        borderColor: 'rgb(230, 232, 234)',
        borderStyle: 'solid',
        // [theme.breakpoints.only('sm')]: {
        //     width: 'auto',
        // },
        // [theme.breakpoints.only('xs')]: {
        //     width: 'auto',
        // },
    },
    fromWalletSelect: {
        cursor: 'pointer',
        // width: '200px',
        [theme.breakpoints.only('sm')]: {
            width: 'auto',
        },
        [theme.breakpoints.only('xs')]: {
            width: 'auto',
        },
    },
    withdrawCol: {
        [theme.breakpoints.up('lg')]: {
            padding: `0px ${theme.spacing(1)}px`,
        },
        [theme.breakpoints.only('md')]: {
            padding: `0px ${theme.spacing(1)}px`,
        }
    },
    historyDivider: {
        margin: `${theme.spacing(4)}px 0px ${theme.spacing(3)}px`,
    },
    divider: {
        height: 28,
        margin: 4,
    },
  }),
);


type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

const SwapComponent = (props: Props) => {
    const defaultWalletsFromCurrency = 'btc';
    const defaultWalletsToCurrency = 'eth';
    const defaultSwapFee = 0.01;
    const defaultMinSwapFee = 0.1;
    const defaultMaxSwapFee = 10;
    //Props
    const classes = useStyles();
    const { wallets, user, currencies, isFetchingRate, exchangeRate } = props;

    //States
    const [walletsFromCurrency, setWalletsFromCurrency] = React.useState<string>(defaultWalletsFromCurrency);
    const [walletsToCurrency, setWalletsToCurrency] = React.useState<string>(defaultWalletsToCurrency);
    const [walletsFrom, setWalletsFrom] = React.useState<WalletItemProps[]>([]);
    const [walletsTo, setWalletsTo] = React.useState<WalletItemProps[]>([]);
    const [walletsToanchorEl, setWalletsToAnchorEl] = React.useState<null | HTMLElement>(null);
    const [walletsFomAnchorEl, setWalletsFromAnchorEl] = React.useState<null | HTMLElement>(null);
    const [previousSelectedWalletFromOption, setPreviousSelectedWalletFromOption] = React.useState<WalletItemProps | null | undefined>(null);
    const [previousSelectedWalletToOption, setPreviousSelectedWalletToOption] = React.useState<WalletItemProps | null | undefined>(null);
    const [selectedWalletFromOption, setSelectedWalletFromOption] = React.useState<WalletItemProps | null | undefined>(null);
    const [selectedWalletToOption, setSelectedWalletToOption] = React.useState<WalletItemProps | null | undefined>(null);

    const [walletsFromAmount, setWalletsFromAmount] = React.useState<string | undefined>('');
    const [walletsFromError, setWalletsFromError] = React.useState<boolean>(false);
    const [walletsFromErrorMessage, setWalletsFromErrorMessage] = React.useState<string>('');
    const [walletsToAmount, setWalletsToAmount] = React.useState<string | undefined>('');
    const [exchangeHistory, setExchangeHistory] = React.useState<ExchangeHistoryProps[]>([]);

    //UseEffect
    React.useEffect(() => {
        if (!wallets.length) {
            props.fetchWallets();
        }
    }, [wallets]);

    React.useEffect(() => {
        if (wallets.length && !walletsFrom.length) {
            setWalletsFrom(wallets)
        } else if(walletsFrom.length > 0 && wallets.length > 0) {
            
            let searchedOption = searchCurrencyInWallets(walletsFromCurrency);
            setSelectedWalletFromOption(searchedOption);
        }
    }, [wallets, walletsFrom]);

    React.useEffect(() => {
        if (wallets.length && !walletsTo.length) {
            setWalletsTo(wallets)
        } else if(walletsTo.length > 0 && wallets.length > 0) {
            
            let searchedOption = searchCurrencyInWallets(walletsToCurrency);
            setSelectedWalletToOption(searchedOption);
        }
    }, [wallets, walletsTo]);

    React.useEffect(() => {
        setWalletsFromCurrency(selectedWalletFromOption ? selectedWalletFromOption.currency : walletsFromCurrency);
        checkWalletsFromSelectedOption();
        getExchangeRates();
        handleWalletsFromAmountErrors(walletsFromAmount);
    }, [selectedWalletFromOption])

    React.useEffect(() => {
        setWalletsToCurrency(selectedWalletToOption ? selectedWalletToOption.currency : walletsToCurrency);
        checkWalletsToSelectedOption();
        handleWalletsFromAmountErrors(walletsFromAmount);
        getExchangeRates();
    }, [selectedWalletToOption])

    React.useEffect(() => {
        fetchExchangeHistory();
    }, [])

    React.useEffect(() => {
        handleWalletsFromAmountErrors(walletsFromAmount);
        getExchangeRates();
    }, [walletsFromAmount])

    React.useEffect(() => {
        setWalletsToAmount(exchangeRate);
    }, [exchangeRate])

    const selectedWalletFromCurrency: string = selectedWalletFromOption && selectedWalletFromOption.currency ? selectedWalletFromOption.currency : defaultWalletsFromCurrency;
    const selectedWalletToCurrency: string = selectedWalletToOption && selectedWalletToOption.currency ? selectedWalletToOption.currency : defaultWalletsToCurrency;

    const selectedWalletFromOptionBalance: number = selectedWalletFromOption ? Number(selectedWalletFromOption.balance) : 0;
    const selectedWalletFromOptionMinswapAmount: number = selectedWalletFromOption && selectedWalletFromOption.minSwapAmount ? Number(selectedWalletFromOption.minSwapAmount) : defaultMinSwapFee;
    const selectedWalletFromOptionMaxswapAmount: number = selectedWalletFromOption && selectedWalletFromOption.maxSwapAmount ? Number(selectedWalletFromOption.maxSwapAmount) : defaultMaxSwapFee;

    const selectedWalletToOptionSwapFee: number = selectedWalletToOption && selectedWalletToOption.swapFee ? Number(selectedWalletToOption.swapFee) : defaultSwapFee;


    const selectedWalletFromOptionLocked: number = selectedWalletFromOption ? Number(selectedWalletFromOption.locked) : 0;
    const selectedWalletFromOptionFixed: number = selectedWalletFromOption ? Number(selectedWalletFromOption.fixed) : 8;

    //Addtional Methods
    const searchCurrencyInWallets = (currency: string) => {
        return walletsFrom.find(wallet => wallet.currency === currency);
    }
    const handleWalletsFromSelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setWalletsFromAnchorEl(event.currentTarget);
    };
    const handleWalletsFromSelectChange = (event: React.MouseEvent<HTMLElement>, option: WalletItemProps | null | undefined) => {
        setPreviousSelectedWalletFromOption(selectedWalletFromOption);
        setSelectedWalletFromOption(option);
    };
    const handleWalletsFromSelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (walletsFomAnchorEl) {
            walletsFomAnchorEl.focus();
        }
        setWalletsFromAnchorEl(null);
    };
    
    const handleWalletsToSelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setWalletsToAnchorEl(event.currentTarget);
    };
    const handleWalletsToSelectChange = (event: React.MouseEvent<HTMLElement>, option: WalletItemProps | null | undefined) => {
        setPreviousSelectedWalletToOption(selectedWalletToOption);
        setSelectedWalletToOption(option);
    };
    const handleWalletsToSelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (walletsToanchorEl) {
            walletsToanchorEl.focus();
        }
        setWalletsToAnchorEl(null);
    };
    const checkWalletsFromSelectedOption = () => {
        if(selectedWalletFromOption && selectedWalletToOption && selectedWalletFromOption.currency === selectedWalletToOption.currency) {
            setSelectedWalletFromOption(selectedWalletToOption);
            setSelectedWalletToOption(previousSelectedWalletFromOption);
        }
    }
    const checkWalletsToSelectedOption = () => {
        if(selectedWalletFromOption && selectedWalletToOption && selectedWalletFromOption.currency === selectedWalletToOption.currency) {
            setSelectedWalletToOption(selectedWalletFromOption);
            setSelectedWalletFromOption(previousSelectedWalletToOption);
        }
    }

    const handleWalletsFromAmountChange = (event) => {
        const value = event.target.value;

        const convertedValue = cleanPositiveFloatInput(String(value));
        const condition = new RegExp(`^(?:[\\d-]*\\.?[\\d-]{0,${selectedWalletFromOptionFixed}}|[\\d-]*\\.[\\d-])$`);
        if (convertedValue.match(condition)) {
            setWalletsFromAmount(convertedValue);

        }
    }
    const handleWalletsFromAmountErrors = (amount) => {
        let errorMsg = '';
        if(amount) {
            console.log(selectedWalletFromOptionMinswapAmount);
            console.log(selectedWalletFromOptionMaxswapAmount);
            if(Number(amount) < selectedWalletFromOptionMinswapAmount) {
                setWalletsFromError(true);
                errorMsg = props.intl.formatMessage({ id: 'page.body.swap.input.error1' }, { amount: selectedWalletFromOptionMinswapAmount });
    
            } else if(Number(amount) > selectedWalletFromOptionMaxswapAmount) {
                setWalletsFromError(true);
                errorMsg = props.intl.formatMessage({ id: 'page.body.swap.input.error2' }, { amount: selectedWalletFromOptionMaxswapAmount });
    
            }else if (Number(amount) > selectedWalletFromOptionBalance) {
                setWalletsFromError(true);
                errorMsg = props.intl.formatMessage({ id: 'page.body.swap.input.error3'});
            } else {
                setWalletsFromError(false);
                errorMsg = '';
                setWalletsFromErrorMessage('');
            }
        } else {
            setWalletsFromError(false);
            errorMsg = '';
            setWalletsFromErrorMessage('');
        }
        setWalletsFromErrorMessage(`${errorMsg}`);
    }

    const handleWalletsToAmountChange = (event) => {
        // setWalletsToAmount(event.target.value);
    }
    
    const setWalletFromMaxAmount = () => {
        const maxAvailableAmount = selectedWalletFromOption ? selectedWalletFromOption.balance : '0';
        setWalletsFromAmount(maxAvailableAmount);
        if(Number(maxAvailableAmount) > 0) {
            getExchangeRates();
        }
    }
    
    const getExchangeRates = async () => {
        if(walletsFromAmount && Number(walletsFromAmount) > 0) {
            props.exchangeRateFetch({
                base_currency: selectedWalletToCurrency,
                quote_currency: selectedWalletFromCurrency,
                quote_amount: walletsFromAmount
            });
            
        } else {
            props.exchangeRateReset();
        }
    }
    const isValidForm = () => {
        return !walletsFromAmount || !Boolean(Number(walletsFromAmount) > 0) || walletsFromError; 
    }
    const handleSwapButtonClick = async () => {
        props.exchangeRequest({
            base_currency: selectedWalletToCurrency,
            quote_currency: selectedWalletFromCurrency,
            quote_amount: walletsFromAmount
        });
    }

    const fetchExchangeHistory = async () => {
        try {
            const data = await getExchangeHistory();
            if (data.length > 0){
                setExchangeHistory(data);
            }

        } catch (error) {

        }

   }
    const renderAvailableBalance = () => {
       return (
           <>
                <Typography variant="body2" component="div" display="inline" style={{ opacity: '0.6', marginRight: '8px' }}>
                    <FormattedMessage id={'page.body.swap.available'} />:
                </Typography>
                <Typography variant="subtitle2" component="div" display="inline" style={{ marginRight: '4px' }}>{ selectedWalletFromOption && selectedWalletFromOption.balance }</Typography>
                <Typography variant="body2" component="div" display="inline">{ selectedWalletFromOption ? selectedWalletFromOption.currency.toUpperCase() : '' }</Typography>
           </>
       );
    }
    const renderPrice = () => {
        const price = Number(walletsToAmount)/Number(walletsFromAmount);
        return (
           <>
                 <Typography variant="h6" component="div" display="inline" style={{ opacity: '0.6', marginRight: '8px' }}>
                    <FormattedMessage id={'page.body.swap.price'} />:
                </Typography>
                <Typography variant="h6" component="div" display="inline" style={{ marginRight: '4px' }}>{`1 ${ selectedWalletFromCurrency.toUpperCase() } = ${price} ${selectedWalletToCurrency.toUpperCase()}`}</Typography>
           </>
       );
    }
    const renderExchangeTradingFee = () => {
        return (
            <>
                <Typography variant="h6" component="div" display="inline" style={{ opacity: '0.6', marginRight: '8px' }}>
                <FormattedMessage id={'page.body.swap.fee'} />:
                </Typography>
                <Typography variant="h6" component="div" display="inline" style={{ marginRight: '4px' }}>
                    <Decimal fixed={5}>{selectedWalletToOptionSwapFee}</Decimal>
                </Typography>
                <Typography variant="h6" component="div" display="inline">{ selectedWalletToCurrency.toUpperCase() }</Typography>
            </>
        );
    };

    const renderReceivableAmount = () => {
            return (
                <>
                    <Tooltip title="Estimated price of the swap, not the final price that the swap is executed." placement="right">
                        <Typography variant="h6" component="div" display="inline" style={{ opacity: '0.6', marginRight: '8px' }}>
                        <FormattedMessage id={'page.body.swap.receive'} />:
                        </Typography>
                    </Tooltip>
                    <Typography variant="h6" component="div" display="inline" style={{ marginRight: '4px' }}>
                        <Decimal fixed={5}>{Number(walletsToAmount) - Number(walletsToAmount) * selectedWalletToOptionSwapFee}</Decimal>
                    </Typography>
                    <Typography variant="h6" component="div" display="inline">{ selectedWalletToCurrency.toUpperCase() }</Typography>
                </>
            );
    };

    const renderSwapHistory = () => {
        const columns = [];
        return (
            <>
                <ExchangeHistory 
                    // columns= {columns}
                    rows= {exchangeHistory}
                />
            </>
        );
    }
    const walletsFromPopperOpen = Boolean(walletsFomAnchorEl);
    const walletsFromPopperId = walletsFromPopperOpen ? 'wallet-currencies' : undefined;

    const walletsToPopperOpen = Boolean(walletsToanchorEl);
    const walletsToPopperId = walletsToPopperOpen ? 'wallet-currencies' : undefined;
    
    const translate = (id: string) => props.intl.formatMessage({ id });

    const renderWalletsFromDropdown = () => {
        return <WalletsDropdown
            anchorEl = {walletsFomAnchorEl}
            popperOpen= {walletsFromPopperOpen}
            popperId={walletsFromPopperId}
            wallets = {walletsFrom}
            selectedWallet = {selectedWalletFromOption}
            setAnchorEl= {setWalletsFromAnchorEl}
            setSelectedWallet = {setSelectedWalletFromOption}
            walletDropdownClick = {handleWalletsFromSelectClick}
            walletDropdownChange = {handleWalletsFromSelectChange}
            walletDropdownClose = {handleWalletsFromSelectClose}
        />
    }
    const renderWalletsToDropdown = () => {
        return <WalletsDropdown
            anchorEl = {walletsToanchorEl}
            popperOpen= {walletsToPopperOpen}
            popperId={walletsToPopperId}
            wallets = {walletsTo}
            selectedWallet = {selectedWalletToOption}
            setAnchorEl= {setWalletsToAnchorEl}
            setSelectedWallet = {setSelectedWalletToOption}
            walletDropdownClick = {handleWalletsToSelectClick}
            walletDropdownChange = {handleWalletsToSelectChange}
            walletDropdownClose = {handleWalletsToSelectClose}
        />
    }

    return (
        <>
            <Box>
                <Paper className={classes.headerPaper}>
                    <Grid container>
                        <Grid item md={12}>
                            <Typography variant="h4" display="inline">
                                <FormattedMessage id={'page.body.swap.title.swap'} />
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <Box mt={3} pl={3} pr={3}>
                <Grid container>
                    <Grid item xs={12} sm ={12} md={12} lg={12}>
                        <Paper className={classes.page}>
                            <Grid container>
                                <Grid item md={2} lg={4}></Grid>
                                <Grid item xs={12} sm={12} md={8} lg={4}>
                                    {/* <div className={classes.pageTitle}>
                                        <Typography variant="h4" gutterBottom>
                                            Swap
                                        </Typography>
                                    </div> */}
                                    <div className={classes.pageContent}>
                                        <div style={{ float: 'right' }}>
                                            {renderAvailableBalance()}
                                        </div>
                                        <div className={classes.swapFromFields}>
                                            <FormControl variant="outlined" fullWidth className={classes.formControl } error={walletsFromError}>
                                                <InputLabel htmlFor="swap">
                                                    <FormattedMessage id={'page.body.swap.input.swap'} />
                                                </InputLabel>
                                                <OutlinedInput
                                                    id="swap"
                                                    label={<FormattedMessage id={'page.body.swap.input.swap'} />}
                                                    placeholder={selectedWalletFromOption ? `${selectedWalletFromOption.minSwapAmount} - ${selectedWalletFromOption.maxSwapAmount}` : ''}
                                                    type='number'
                                                    value={walletsFromAmount}
                                                    autoFocus={true}
                                                    onChange={(e) => {
                                                        handleWalletsFromAmountChange(e)
                                                    }}
                                                    aria-describedby="swap-text"
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <span className={classes.maxButton} onClick={setWalletFromMaxAmount}>
                                                                <FormattedMessage id={'page.body.swap.input.tag.max'} />
                                                            </span>
                                                            <Divider className={classes.divider} orientation="vertical" style={{ margin: '0px 8px' }}/>
                                                            <div className={classes.fromWalletSelect}>
                                                                {renderWalletsFromDropdown()}
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                                {walletsFromError && <FormHelperText id="swap-text">{walletsFromErrorMessage}</FormHelperText>}
                                            </FormControl>
                                        </div>
                                        <div className={classes.swapFields}>
                                            <FormControl variant="filled" fullWidth className={classes.formControl }>
                                                {/* <InputLabel htmlFor="receive">Receive</InputLabel> */}
                                                <OutlinedInput
                                                    id="receive"
                                                    placeholder={isFetchingRate ? 'Loading...' : '0.00'}
                                                    type='number'
                                                    value={walletsToAmount}
                                                    onChange={handleWalletsToAmountChange}
                                                    disabled={true}
                                                />
                                            </FormControl>
                                            <div className={classes.walletSelect}>
                                                {renderWalletsToDropdown()}
                                            </div>
                                        </div>
                                        {!walletsFromAmount || Number(walletsFromAmount) > 0 && (
                                            <>
                                                <Box>
                                                    {renderPrice()}
                                                </Box>
                                                <Box>
                                                    {renderExchangeTradingFee()}
                                                </Box>
                                                <Box mb={3}>
                                                    {renderReceivableAmount()}
                                                </Box>
                                            </>
                                        )}
                                        <Button 
                                            variant="contained" 
                                            color="primary"
                                            size="large"
                                            fullWidth={true}
                                            onClick={handleSwapButtonClick}
                                            disabled={isValidForm()}
                                        >
                                            <FormattedMessage id={'page.body.swap.button.text.swap'} />
                                        </Button>
                                    </div>
                                </Grid>
                                <Grid item md={2} lg={4}></Grid>
                            </Grid>
                            <Divider className={classes.historyDivider}/>
                            {renderSwapHistory()}
                        </Paper> 
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    walletsLoading: selectWalletsLoading(state),
    historyList: selectHistory(state),
    currencies: selectCurrencies(state),
    isFetchingRate: selectIsFetchingExchangeRate(state),
    exchangeRate: selectExchangeRate(state)
});
const mapDispatchToProps = dispatch => ({
    fetchWallets: () => dispatch(walletsFetch()),
    fetchAddress: ({ currency }) => dispatch(walletsAddressFetch({ currency })),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    fetchAlert: payload => dispatch(alertPush(payload)),
    currenciesFetch: () => dispatch(currenciesFetch()),
    exchangeRateFetch: (data) => {
        dispatch(exchangeRateFetch(data));
    },
    exchangeRequest: (data) => {
        dispatch(exchangeRequest(data));
    },
    exchangeRateReset: () => dispatch(exchangeRateReset()),
});

export const SwapScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(SwapComponent))