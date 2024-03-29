import * as React from 'react';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
    Box,
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

import { cleanPositiveFloatInput } from '../../helpers';
import { fetchRate, getExchangeHistory, postExchange } from '../../apis/exchange';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { RouterProps } from 'react-router';
import { connect } from 'react-redux';
import { WalletItemProps, WalletsDropdown, Decimal, WalletItem } from '../../components';
import { ExchangeHistory, ExchangeHistoryProps } from '../../containers/ExchangeHistory';
import { PageHeader } from '../../containers/PageHeader';
import { globalStyle } from '../../screens/materialUIGlobalStyle';
import {
    alertPush,
    RootState,
    selectUserInfo,
    selectWallets,
    selectWalletsLoading,
    selectWithdrawSuccess,
    User,
    walletsFetch,
    exchangeRateFetch,
    selectIsFetchingExchangeRate,
    selectExchangeRate,
    exchangeRateReset,
    exchangeRequest,
    selectExchangeSuccess,
    selectExchangeLoading,
    MemberLevels,
    memberLevelsFetch,
    selectMemberLevels,
    Market,
    marketsFetch,
    selectMarkets,
    selectMarketTickers,
    orderExecuteFetch,
    selectOrderExecuteLoading,
    marketsTickersFetch,
} from '../../modules';

interface ReduxProps {
    user: User;
    wallets: WalletItemProps[];
    walletsLoading?: boolean;
    isFetchingRate: boolean;
    exchangeRate: string;
    exchangeSuccess: boolean;
    exchangeLoading: boolean;
    memberLevels?: MemberLevels;
    markets: Market[];
    executeLoading: boolean;
    marketTickers: {
        [key: string]: {
            last: string;
        },
    };
}

interface DispatchProps {
    fetchWallets: typeof walletsFetch;
    exchangeRateFetch: typeof exchangeRateFetch;
    exchangeRateReset: typeof exchangeRateReset;
    exchangeRequest: typeof exchangeRequest;
    memberLevelsFetch: typeof memberLevelsFetch;
    fetchMarkets: typeof marketsFetch;
    tickers: typeof marketsTickersFetch;
    orderExecute: typeof orderExecuteFetch;
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        ...globalStyle(theme),
        swapForm: {
            textAlign: 'center',
            width: '40%',
            margin: '0 auto',
            [theme.breakpoints.only('md')]: {
                width: '80%',
            },
            [theme.breakpoints.only('sm')]: {
                width: '80%',
            },
            [theme.breakpoints.only('xs')]: {
                width: '100%',
            },
        },
        swapFromFields: {
            margin: `0px 0px ${theme.spacing(2)}px 0px`,
        },
        swapFields: {
            display: 'flex',
            margin: `0px 0px ${theme.spacing(2)}px 0px`,
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
            cursor: 'pointer',
            padding: `12px ${theme.spacing(1)}px`,
            borderRadius: '4px',
            borderWidth: '1px',
            borderColor: 'rgb(230, 232, 234)',
            borderStyle: 'solid',
        },
        fromWalletSelect: {
            cursor: 'pointer',
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
        list: {
            display: 'flex',
            flexDirection: 'row',
            padding: 0,
        },
        swapInfo: {
            background: theme.palette.action.hover
        },
        historyDivider: {
            margin: `${theme.spacing(4)}px 0px ${theme.spacing(3)}px`,
        },
        divider: {
            height: 28,
            margin: 4,
        },
        buttonProgress: {
            color: '#fff',
        }
    }),
);


type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

const SwapComponent = (props: Props) => {
    const defaultWalletsFromCurrency = 'btc';
    const defaultWalletsToCurrency = 'eth';
    const defaultSwapFee = 0.02;
    const defaultMinSwapFee = 0.1;
    const defaultMaxSwapFee = 10000;

    const WAIT_INTERVAL = 1000;
    //Props
    const classes = useStyles();
    const { wallets, markets, user: { level, otp }, memberLevels, isFetchingRate, exchangeRate, exchangeSuccess, exchangeLoading, executeLoading, marketTickers } = props;

    //States
    const [walletsFromCurrency, setWalletsFromCurrency] = React.useState<string>(defaultWalletsFromCurrency);
    const [walletsToCurrency, setWalletsToCurrency] = React.useState<string>(defaultWalletsToCurrency);
    const [walletsFromLoading, setWalletsFromLoading] = React.useState<boolean>(true);
    const [filteredWallets, setFilteredWallets] = React.useState<WalletItemProps[]>([]);
    const [walletsFrom, setWalletsFrom] = React.useState<WalletItemProps[]>([]);
    const [walletsToLoading, setWalletsToLoading] = React.useState<boolean>(true);
    const [walletsTo, setWalletsTo] = React.useState<WalletItemProps[]>([]);
    const [walletsToanchorEl, setWalletsToAnchorEl] = React.useState<null | HTMLElement>(null);
    const [walletsFomAnchorEl, setWalletsFromAnchorEl] = React.useState<null | HTMLElement>(null);
    const [previousSelectedWalletFromOption, setPreviousSelectedWalletFromOption] = React.useState<WalletItemProps | null | undefined>(null);
    const [previousSelectedWalletToOption, setPreviousSelectedWalletToOption] = React.useState<WalletItemProps | null | undefined>(null);
    const [selectedWalletFromOption, setSelectedWalletFromOption] = React.useState<WalletItemProps | null | undefined>(null);
    const [selectedWalletToOption, setSelectedWalletToOption] = React.useState<WalletItemProps | null | undefined>(null);

    const [walletsFromAmount, setWalletsFromAmount] = React.useState<string>('');
    const [walletsFromError, setWalletsFromError] = React.useState<boolean>(false);
    const [walletsFromErrorMessage, setWalletsFromErrorMessage] = React.useState<string>('');
    const [walletsToAmount, setWalletsToAmount] = React.useState<string>('');
    const [otpCode, setOtpCode] = React.useState<string>('');
    const [otpCodeError, setOtpCodeError] = React.useState<boolean>(false);
    const [otpCodeErrorMessage, setOtpCodeErrorMessage] = React.useState<string>('');
    const [fetchingRate, setFetchingRate] = React.useState(false);
    const [exchangeHistory, setExchangeHistory] = React.useState<ExchangeHistoryProps[]>([]);

    //UseEffect
    React.useEffect(() => {
        if (!wallets.length) {
            props.fetchWallets();
        }
    }, [wallets]);

    React.useEffect(() => {
        if (!markets.length) {
            props.fetchMarkets();
        }
    }, [markets]);

    React.useEffect(() => {
        if (!markets.length) {
            props.tickers();
        }
    }, [markets]);

    React.useEffect(() => {
        if (!memberLevels) {
            props.memberLevelsFetch();
        }
    }, [memberLevels]);

    React.useEffect(() => {
        if (wallets.length && markets.length && !filteredWallets.length) {
            let filteredData = [];
            filteredData = wallets.filter(function (wallet) {
                var exists = markets.some(function (market) {
                    return wallet.currency == market.base_unit || wallet.currency == market.quote_unit;
                });
                return exists ? true : false;
            });
            setFilteredWallets(wallets);
        }
    }, [wallets, markets]);

    React.useEffect(() => {
        if (filteredWallets.length && !walletsFrom.length) {
            setWalletsFrom(filteredWallets)
        } else if (walletsFrom.length > 0 && filteredWallets.length > 0) {

            // let searchedOption = searchCurrencyInWallets(walletsFromCurrency);
            setSelectedWalletFromOption(filteredWallets[0]);
        }
    }, [filteredWallets, walletsFrom]);

    // React.useEffect(() => {
    //     if (filteredWallets.length && !walletsTo.length) {
    //         setWalletsTo(filteredWallets)
    //     } else if(walletsTo.length > 0 && filteredWallets.length > 0) {

    //         // let searchedOption = searchCurrencyInWallets(walletsToCurrency);
    //         setSelectedWalletToOption(filteredWallets[1]);
    //     }
    // }, [filteredWallets, walletsTo]);

    React.useEffect(() => {
        if (selectedWalletFromOption) {
            setWalletsFromLoading(false);
            var matchingWallets = searchToWalletsOptionsWithMactingMarkets();
            setWalletsTo(matchingWallets);
            setSelectedWalletToOption(matchingWallets[0]);
        }
        setWalletsFromCurrency(selectedWalletFromOption ? selectedWalletFromOption.currency : walletsFromCurrency);
        checkWalletsFromSelectedOption();
        getExchangeRates();
        handleWalletsFromAmountErrors(walletsFromAmount);
    }, [selectedWalletFromOption])

    const currenciesList: string[] = [];

    const searchToWalletsOptionsWithMactingMarkets = () => {
        var marketsList = markets.filter(function (market) {
            return selectedWalletFromOption ? selectedWalletFromOption.currency.toLowerCase() === market.base_unit.toLowerCase() || selectedWalletFromOption.currency.toLowerCase() === market.quote_unit.toLowerCase() : [];
        });

        for (var i in marketsList) {
            if (selectedWalletFromOption && marketsList[i].base_unit.toLowerCase() !=
                selectedWalletFromOption.currency.toLowerCase()) {
                currenciesList.push(marketsList[i].base_unit.toLowerCase());
            }
            if (selectedWalletFromOption && marketsList[i].quote_unit.toLowerCase() !=
                selectedWalletFromOption.currency.toLowerCase()) {
                currenciesList.push(marketsList[i].quote_unit.toLowerCase());
            }
        }
        var newList = filteredWallets.filter(function (wallet) {
            return currenciesList.includes(wallet.currency.toLowerCase());
        });
        if (selectedWalletFromOption && selectedWalletFromOption.type == 'fiat') {
            var fiatWalletsList = wallets.filter(function (wallet) {
                return wallet.type == 'fiat' && selectedWalletFromOption.currency.toLowerCase() != wallet.currency.toLowerCase() && !checkIfWalletExistsInWallets(wallet, newList);
            });
            newList = [...newList, ...fiatWalletsList];
        }
        return newList;
    }

    const checkIfWalletExistsInWallets = (wallet, wallets) => {
        return wallets.some(function (walletItem) {
            return walletItem.currency.toLowerCase() == wallet.currency.toLowerCase();
        });
    }

    React.useEffect(() => {
        if (selectedWalletToOption) {
            setWalletsToLoading(false);
        }
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
        const timeOutId = setTimeout(() => {
            return getExchangeRates();
        }, WAIT_INTERVAL);
        return () => {
            setFetchingRate(true);
            setWalletsToAmount('');
            isValidForm();
            return clearTimeout(timeOutId);
        };
    }, [walletsFromAmount])

    React.useEffect(() => {
        setWalletsToAmount(exchangeRate);
    }, [exchangeRate])

    React.useEffect(() => {
        isValidForm();
    }, [otpCode])

    React.useEffect(() => {
        if (exchangeSuccess) {
            resetFrom();
        }
    }, [exchangeSuccess])

    React.useEffect(() => {
        if (executeLoading) {
            resetFrom();
        }
    }, [executeLoading])

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
        if (selectedWalletFromOption && selectedWalletToOption && selectedWalletFromOption.currency === selectedWalletToOption.currency) {
            setSelectedWalletFromOption(selectedWalletToOption);
            setSelectedWalletToOption(previousSelectedWalletFromOption);
        }
    }
    const checkWalletsToSelectedOption = () => {
        if (selectedWalletFromOption && selectedWalletToOption && selectedWalletFromOption.currency === selectedWalletToOption.currency) {
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
        if (amount) {
            if (Number(amount) < selectedWalletFromOptionMinswapAmount) {
                setWalletsFromError(true);
                errorMsg = props.intl.formatMessage({ id: 'page.body.swap.input.error1' }, { amount: selectedWalletFromOptionMinswapAmount });

            } else if (Number(amount) > selectedWalletFromOptionMaxswapAmount) {
                setWalletsFromError(true);
                errorMsg = props.intl.formatMessage({ id: 'page.body.swap.input.error2' }, { amount: selectedWalletFromOptionMaxswapAmount });

            } else if (Number(amount) > selectedWalletFromOptionBalance) {
                setWalletsFromError(true);
                errorMsg = props.intl.formatMessage({ id: 'page.body.swap.input.error3' });
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
    const handleOtpCodeChange = (event) => {
        const value = event.target.value;
        setOtpCode(value);
        handleOtpCodeErrors(value);
    }

    const handleOtpCodeErrors = (otpCode) => {
        let errorMsg = '';
        if (otpCode) {
            if (Boolean(otpCode.length !== 6)) {
                setOtpCodeError(true);
                errorMsg = props.intl.formatMessage({ id: 'page.body.swap.input.otp_code_error' });
            } else {
                setOtpCodeError(false);
                errorMsg = '';
            }
        } else {
            setOtpCodeError(false);
            errorMsg = '';
        }
        setOtpCodeErrorMessage(`${errorMsg}`);
    }

    const setWalletFromMaxAmount = () => {
        const maxAvailableAmount = selectedWalletFromOption ? selectedWalletFromOption.balance : '0';
        if (maxAvailableAmount && Number(maxAvailableAmount) > 0) {
            setWalletsFromAmount(maxAvailableAmount);
        }
    }

    const getExchangeRates = async () => {
        // if(walletsFromAmount && Number(walletsFromAmount) > 0) {
        //     props.exchangeRateFetch({
        //         base_currency: selectedWalletToCurrency,
        //         qoute_currency: selectedWalletFromCurrency,
        //         qoute_amount: walletsFromAmount
        //     });

        // } else {
        //     props.exchangeRateReset();
        // }

        if ((walletsFromAmount && Number(walletsFromAmount) > 0) && (selectedWalletFromCurrency !== selectedWalletToCurrency)) {
            setFetchingRate(true);
            setWalletsToAmount('');
            const response = await fetchRate(selectedWalletToCurrency, selectedWalletFromCurrency, walletsFromAmount);
            if (response.data) {
                setFetchingRate(false);
                setWalletsToAmount(response.data);
            }
        } else {
            setFetchingRate(false);
            setWalletsToAmount('');
        }
    }
    const isValidForm = () => {
        return (walletsFromAmount && walletsFromError) || (otpCode && otpCodeError) || exchangeLoading;
    }
    const handleSwapButtonClick = async () => {
        if (selectedWalletFromOption && selectedWalletFromOption.type == 'fiat' && selectedWalletToOption && selectedWalletToOption.type == 'fiat') {
            const requestData = {
                base_currency: selectedWalletToCurrency,
                qoute_currency: selectedWalletFromCurrency,
                qoute_amount: walletsFromAmount,
                otp: otpCode
            };
            props.exchangeRequest(requestData);
        } else {
            var orderSide = 'sell';
            var existingMarket;
            existingMarket = markets.find(function (market) {
                return market.base_unit.toLowerCase() == selectedWalletFromCurrency &&
                    market.quote_unit.toLowerCase() == selectedWalletToCurrency
            });
            if (!existingMarket) {
                orderSide = 'buy';
                existingMarket = markets.find(function (market) {
                    return market.quote_unit.toLowerCase() == selectedWalletFromCurrency &&
                        market.base_unit.toLowerCase() == selectedWalletToCurrency
                });
            }
            const currentTicker = marketTickers[existingMarket.id];


            const requestData = {
                volume: (Number(walletsToAmount) - Number(walletsToAmount) * selectedWalletToOptionSwapFee).toFixed(6),
                market: existingMarket.id,
                price: currentTicker.last,
                side: orderSide,
                ord_type: 'limit',
            };
            props.orderExecute(requestData);
        }
    }

    const resetFrom = () => {
        setWalletsFromAmount('');
        setOtpCode('');
        // props.fetchWallets();
        props.exchangeRateReset();
    }

    const fetchExchangeHistory = async () => {
        try {
            const data = await getExchangeHistory();
            if (data.length > 0) {
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
                <Typography variant="subtitle2" component="div" display="inline" style={{ marginRight: '4px' }}>{selectedWalletFromOption && selectedWalletFromOption.balance}</Typography>
                <Typography variant="body2" component="div" display="inline">{selectedWalletFromOption ? selectedWalletFromOption.currency.toUpperCase() : ''}</Typography>
            </>
        );
    }
    const renderPrice = () => {
        let price: any = Number(walletsToAmount) / Number(walletsFromAmount);
        price = parseFloat(price).toFixed(5);

        return (
            <>
                <div className={classes.list}>
                    <ListItem disableGutters dense={true}>
                        <Typography variant="h6" color="textSecondary">
                            <FormattedMessage id={'page.body.swap.price'} />
                        </Typography>
                    </ListItem>
                    <ListItem disableGutters dense={true} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="h6">
                            {fetchingRate ? '--' :
                                <>
                                    {`1 ${selectedWalletFromCurrency.toUpperCase()} ≃ ${price} ${selectedWalletToCurrency.toUpperCase()}`}
                                </>
                            }
                        </Typography>
                    </ListItem>
                </div>
            </>
        );
    }
    const renderExchangeTradingFee = () => {
        return (
            <>
                <div className={classes.list}>
                    <ListItem disableGutters dense={true}>
                        <Typography variant="h6" color="textSecondary">
                            <FormattedMessage id={'page.body.swap.fee'} /> %
                        </Typography>
                    </ListItem>
                    <ListItem disableGutters dense={true} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="h6" >
                            {fetchingRate ? '--' :
                                <>
                                    {`${selectedWalletToOptionSwapFee * 100}`}
                                </>
                            }
                            {/* <Decimal fixed={5}>{selectedWalletToOptionSwapFee}</Decimal> { selectedWalletToCurrency.toUpperCase() } */}
                        </Typography>
                    </ListItem>
                </div>
            </>
        );
    };

    const renderReceivableAmount = () => {
        return (
            <>
                <List className={classes.list}>
                    <ListItem disableGutters dense={true}>
                        <Typography variant="h6" color="textSecondary">
                            <FormattedMessage id={'page.body.swap.you_will_get'} />
                        </Typography>
                    </ListItem>
                    <ListItem disableGutters dense={true} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="h6">
                            {fetchingRate ? '--' :
                                <>
                                    <Decimal fixed={5}>{Number(walletsToAmount) - Number(walletsToAmount) * selectedWalletToOptionSwapFee}</Decimal> {selectedWalletToCurrency.toUpperCase()}
                                </>
                            }
                        </Typography>
                    </ListItem>
                </List>

                {/* <Tooltip title="Estimated price of the swap, not the final price that the swap is executed." placement="right">
                        <Typography variant="h6" component="div" display="inline" style={{ opacity: '0.6', marginRight: '8px' }}>
                        <FormattedMessage id={'page.body.swap.receive'} />:
                        </Typography>
                    </Tooltip>
                    <Typography variant="h6" component="div" display="inline">
                        <Decimal fixed={5}>{Number(walletsToAmount) - Number(walletsToAmount) * selectedWalletToOptionSwapFee}</Decimal>
                    </Typography>
                    <Typography variant="h6" component="div" display="inline">{ selectedWalletToCurrency.toUpperCase() }</Typography> */}
            </>
        );
    };

    const renderSwapHistory = () => {
        const columns = [];
        return (
            <>
                <ExchangeHistory
                    // columns= {columns}
                    rows={exchangeHistory}
                />
            </>
        );
    }
    const walletsFromPopperOpen = Boolean(walletsFomAnchorEl);
    const walletsFromPopperId = walletsFromPopperOpen ? 'wallets-from' : undefined;

    const walletsToPopperOpen = Boolean(walletsToanchorEl);
    const walletsToPopperId = walletsToPopperOpen ? 'wallets-to' : undefined;

    const translate = (id: string) => props.intl.formatMessage({ id });

    const renderWalletsFromDropdown = () => {
        return <WalletsDropdown
            anchorEl={walletsFomAnchorEl}
            popperOpen={walletsFromPopperOpen}
            popperId={walletsFromPopperId}
            wallets={walletsFrom}
            selectedWallet={selectedWalletFromOption}
            setAnchorEl={setWalletsFromAnchorEl}
            setSelectedWallet={setSelectedWalletFromOption}
            walletDropdownClick={handleWalletsFromSelectClick}
            walletDropdownChange={handleWalletsFromSelectChange}
            walletDropdownClose={handleWalletsFromSelectClose}
        />
    }
    const renderWalletsToDropdown = () => {
        return <WalletsDropdown
            anchorEl={walletsToanchorEl}
            popperOpen={walletsToPopperOpen}
            popperId={walletsToPopperId}
            wallets={walletsTo}
            selectedWallet={selectedWalletToOption}
            setAnchorEl={setWalletsToAnchorEl}
            setSelectedWallet={setSelectedWalletToOption}
            walletDropdownClick={handleWalletsToSelectClick}
            walletDropdownChange={handleWalletsToSelectChange}
            walletDropdownClose={handleWalletsToSelectClose}
        />
    }

    const isOtpDisabled = () => {
        return (
            <React.Fragment>
                <div className={classes.swapForm}>
                    <Typography variant="h6" style={{ marginBottom: '16px' }}>
                        {translate('need.to.enable.2fa.title')}
                    </Typography>
                    <Button
                        fullWidth
                        onClick={redirectToEnable2fa}
                        color="secondary"
                        variant="contained"
                    >
                        {translate('need.to.enable.2fa.button.title')}
                    </Button>
                </div>
            </React.Fragment>
        );
    };

    const accountNotConfirmed = () => {
        return (
            <React.Fragment>
                <div className={classes.swapForm}>
                    <Typography variant="h6" style={{ marginBottom: '16px' }}>
                        {translate('need.to.confirm.account')}
                    </Typography>
                    <Button
                        fullWidth
                        onClick={redirectToConfirm}
                        color="secondary"
                        variant="contained"
                    >
                        {translate('need.to.confirm.account.button.title')}
                    </Button>
                </div>
            </React.Fragment>
        );
    };

    const redirectToEnable2fa = () => props.history.push('/security/2fa', { enable2fa: true });
    const redirectToConfirm = () => props.history.push('/confirm', { enable2fa: true });

    const render = () => {
        return (
            <>
                <div className={classes.swapForm}>
                    {walletsFromLoading && walletsToLoading ?
                        <CircularProgress size={25} />
                        :
                        <>
                            <div style={{ float: 'right' }}>
                                {renderAvailableBalance()}
                            </div>
                            <div className={classes.swapFromFields}>
                                <FormControl variant="outlined" fullWidth className={classes.formControl} error={walletsFromError}>
                                    <InputLabel htmlFor="sell">
                                        <FormattedMessage id={'page.body.swap.input.sell'} />
                                    </InputLabel>
                                    <OutlinedInput
                                        id="sell"
                                        label={<FormattedMessage id={'page.body.swap.input.sell'} />}
                                        // placeholder={`${selectedWalletFromOptionMinswapAmount} - ${selectedWalletFromOptionMaxswapAmount}`}
                                        type='number'
                                        value={walletsFromAmount}
                                        autoFocus={true}
                                        onChange={(e) => {
                                            handleWalletsFromAmountChange(e)
                                        }}
                                        aria-describedby="sell-text"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <span className={classes.maxButton} onClick={setWalletFromMaxAmount}>
                                                    <FormattedMessage id={'page.body.swap.input.tag.max'} />
                                                </span>
                                                <Divider className={classes.divider} orientation="vertical" style={{ margin: '0px 8px' }} />
                                                <div className={classes.fromWalletSelect}>
                                                    {renderWalletsFromDropdown()}
                                                </div>
                                            </InputAdornment>
                                        }
                                    />
                                    {walletsFromError && <FormHelperText id="sell-text">{walletsFromErrorMessage}</FormHelperText>}
                                </FormControl>
                            </div>
                            <div className={classes.swapFields}>
                                <FormControl variant="outlined" fullWidth className={classes.formControl}>
                                    <InputLabel htmlFor="buy">
                                        <FormattedMessage id={'page.body.swap.input.buy'} />
                                    </InputLabel>
                                    <OutlinedInput
                                        id="buy"
                                        label={<FormattedMessage id={'page.body.swap.input.buy'} />}
                                        placeholder={fetchingRate ? '' : ''}
                                        type='number'
                                        value={walletsToAmount}
                                        onChange={handleWalletsToAmountChange}
                                        // disabled={true}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                {fetchingRate && <CircularProgress size={14} />}
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <div className={classes.walletSelect}>
                                    {renderWalletsToDropdown()}
                                </div>
                            </div>
                            <div className={classes.swapFromFields}>
                                <FormControl variant="outlined" fullWidth className={classes.formControl} error={otpCodeError}>
                                    <InputLabel
                                        htmlFor="opt_code"
                                    // shrink={true} 
                                    // variant="outlined"
                                    >
                                        <FormattedMessage id={'page.body.swap.input.otp_code'} />
                                    </InputLabel>
                                    <OutlinedInput
                                        id="opt_code"
                                        label={<FormattedMessage id={'page.body.swap.input.otp_code'} />}
                                        type='number'
                                        value={otpCode}
                                        autoFocus={false}
                                        onChange={(e) => {
                                            handleOtpCodeChange(e)
                                        }}
                                        aria-describedby="otp_code_text"
                                    />
                                    {otpCodeError && <FormHelperText id="otp_code_text">{otpCodeErrorMessage}</FormHelperText>}
                                </FormControl>
                            </div>
                            {!walletsFromAmount || Number(walletsFromAmount) > 0 && (
                                <>
                                    <Box className={classes.swapInfo} p={1} mt={2} mb={2}>
                                        <List disablePadding={true}>
                                            {renderPrice()}
                                            {renderExchangeTradingFee()}
                                            {renderReceivableAmount()}
                                        </List>
                                    </Box>
                                </>
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth={true}
                                onClick={handleSwapButtonClick}
                                // disabled={isValidForm()}
                                disabled={Number(walletsFromAmount) <= 0 || Boolean(otpCode.length != 6) || walletsFromError || exchangeLoading || executeLoading}
                            >
                                {executeLoading || exchangeLoading ? <CircularProgress className={classes.buttonProgress} size={18} /> : <FormattedMessage id={'page.body.swap.button.text.buy'} />}
                            </Button>
                        </>
                    }
                </div>
                <Divider className={classes.historyDivider} />
                {renderSwapHistory()}

            </>
        );
    }
    const pageTitle = translate('page.body.swap.title.buy_sell');
    return (
        <>
            <PageHeader pageTitle={pageTitle} />
            <Box className={classes.pageRoot}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Paper className={classes.pageContent}>
                            {otp ? ((memberLevels && level >= memberLevels.withdraw.minimum_level) ? render() : accountNotConfirmed()) : isOtpDisabled()}
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
    markets: selectMarkets(state),
    marketTickers: selectMarketTickers(state),
    walletsLoading: selectWalletsLoading(state),
    isFetchingRate: selectIsFetchingExchangeRate(state),
    exchangeRate: selectExchangeRate(state),
    exchangeSuccess: selectExchangeSuccess(state),
    exchangeLoading: selectExchangeLoading(state),
    memberLevels: selectMemberLevels(state),
    executeLoading: selectOrderExecuteLoading(state),
});
const mapDispatchToProps = dispatch => ({
    fetchWallets: () => dispatch(walletsFetch()),
    exchangeRateFetch: (data) => {
        dispatch(exchangeRateFetch(data));
    },
    exchangeRequest: (data) => {
        dispatch(exchangeRequest(data));
    },
    exchangeRateReset: () => dispatch(exchangeRateReset()),
    memberLevelsFetch: () => dispatch(memberLevelsFetch()),
    fetchMarkets: () => dispatch(marketsFetch()),
    tickers: () => dispatch(marketsTickersFetch()),
    orderExecute: payload => dispatch(orderExecuteFetch(payload)),
});

export const SwapScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(SwapComponent))