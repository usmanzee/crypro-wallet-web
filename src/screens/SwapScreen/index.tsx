import * as React from 'react';
import clsx from 'clsx';
import { fade, makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {
    Box,
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import Divider from '@material-ui/core/Divider';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

import { cleanPositiveFloatInput} from '../../helpers';
import { fetchRate, getExchangeHistory, postExchange } from '../../apis/exchange';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { RouterProps } from 'react-router';
import { connect } from 'react-redux';
import { WalletItemProps, WalletsDropdown, Decimal } from '../../components';
import { alertPush, currenciesFetch, Currency, RootState, selectCurrencies, selectHistory, selectMobileWalletUi, selectUserInfo, selectWalletAddress, selectWallets, selectWalletsAddressError, selectWalletsLoading, selectWithdrawSuccess, setMobileWalletUi, User, WalletHistoryList, walletsAddressFetch, walletsData, walletsFetch, walletsWithdrawCcyFetch } from '../../modules';

interface ReduxProps {
    user: User;
    wallets: WalletItemProps[];
    walletsLoading?: boolean;
    historyList: WalletHistoryList;
    currencies: Currency[];
}

interface DispatchProps {
    fetchWallets: typeof walletsFetch;
    fetchAddress: typeof walletsAddressFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    fetchSuccess: typeof alertPush;
    currenciesFetch: typeof currenciesFetch;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerPaper: {
        height: "100px", 
        padding: "32px 20px"
    },
    pagePaper: {
        padding: `${theme.spacing(3)}px ${theme.spacing(3)}px`,
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
    const tradingFeePercentage = 2;
    //Props
    const classes = useStyles();
    const { wallets, user, currencies } = props;

    //States
    const [walletsFrom, setWalletsFrom] = React.useState<WalletItemProps[]>([]);
    const [walletsTo, setWalletsTo] = React.useState<WalletItemProps[]>([]);
    const [walletsToanchorEl, setWalletsToAnchorEl] = React.useState<null | HTMLElement>(null);
    const [walletsFomAnchorEl, setWalletsFromAnchorEl] = React.useState<null | HTMLElement>(null);
    const [previousSelectedWalletFromOption, setPreviousSelectedWalletFromOption] = React.useState<WalletItemProps | null | undefined>(null);
    const [selectedWalletFromOption, setSelectedWalletFromOption] = React.useState<WalletItemProps | null | undefined>(null);
    const [selectedWalletToOption, setSelectedWalletToOption] = React.useState<WalletItemProps | null | undefined>(null);

    const [walletsFromAmount, setWalletsFromAmount] = React.useState<string | undefined>('');
    const [walletsToAmount, setWalletsToAmount] = React.useState<string | undefined>('');

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
            
            let searchedOption = searchCurrencyInWallets(defaultWalletsFromCurrency);
            setSelectedWalletFromOption(searchedOption);
        }
    }, [wallets, walletsFrom]);

    React.useEffect(() => {
        if (wallets.length && !walletsTo.length) {
            setWalletsTo(wallets)
        } else if(walletsTo.length > 0 && wallets.length > 0) {
            
            let searchedOption = searchCurrencyInWallets(defaultWalletsToCurrency);
            setSelectedWalletToOption(searchedOption);
        }
    }, [wallets, walletsTo]);

    React.useEffect(() => {
        checkWalletsFromAndToSelectedOption();
    }, [selectedWalletFromOption])

    React.useEffect(() => {
        checkWalletsFromAndToSelectedOption();
    }, [selectedWalletToOption])

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
        // checkWalletsFromAndToSelectedOption();
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
        setSelectedWalletToOption(option);
    };
    const handleWalletsToSelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (walletsToanchorEl) {
            walletsToanchorEl.focus();
        }
        setWalletsToAnchorEl(null);
    };

    const checkWalletsFromAndToSelectedOption = () => {
        if(selectedWalletFromOption && selectedWalletToOption && selectedWalletFromOption.currency === selectedWalletToOption.currency) {
            const tempOption = selectedWalletFromOption;
            setSelectedWalletFromOption(selectedWalletToOption);
            setSelectedWalletToOption(previousSelectedWalletFromOption);
        }
    }

    const selectedWalletFromCurrency: string = selectedWalletFromOption && selectedWalletFromOption.currency ? selectedWalletFromOption.currency : defaultWalletsFromCurrency;
    const selectedWalletToCurrency: string = selectedWalletToOption && selectedWalletToOption.currency ? selectedWalletToOption.currency : defaultWalletsToCurrency;

    const selectedWalletFromOptionBalance: number = selectedWalletFromOption && selectedWalletFromOption.balance ? +selectedWalletFromOption.balance : 0.0000;
    const selectedWalletFromOptionLocked: number = selectedWalletFromOption && selectedWalletFromOption.locked ? +selectedWalletFromOption.locked : 0.0000;
    const selectedWalletFromOptionFixed: number = selectedWalletFromOption && selectedWalletFromOption.fixed ? +selectedWalletFromOption.fixed : 8;

    const handleWalletsFromAmountChange = (event) => {
        const value = event.target.value;

        const convertedValue = cleanPositiveFloatInput(String(value));
        const condition = new RegExp(`^(?:[\\d-]*\\.?[\\d-]{0,${selectedWalletFromOptionFixed}}|[\\d-]*\\.[\\d-])$`);
        if (convertedValue.match(condition)) {
            const amount = (convertedValue !== '') ? Number(parseFloat(convertedValue).toFixed(selectedWalletFromOptionFixed)) : '';
            // const total = (amount !== '') ? (amount + Number(this.props.fee)).toFixed(selectedWalletFromOptionFixed) : '';

            // if (Number(total) <= 0) {
            //     this.setTotal((0).toFixed(fixed));
            // } else {
            //     this.setTotal(total);
            // }

            // this.setState({
            //     amount: convertedValue,
            // });
            console.log(convertedValue);
            setWalletsFromAmount(convertedValue);
        }
        getExchangeRates();
    }
    const handleWalletsToAmountChange = (event) => {
        setWalletsToAmount(event.target.value);
    }

    const setWalletFromMaxAmount = () => {
        const maxAvailableAmount = selectedWalletFromOption ? selectedWalletFromOption.balance : '0';
        setWalletsFromAmount(maxAvailableAmount);
    }

    const getExchangeRates = async () => {
        const response = await fetchRate( selectedWalletFromCurrency, selectedWalletToCurrency, walletsFromAmount);
        setWalletsToAmount(response.data);
        
    }
    const renderFee = () => {
        return (
            <span>
                <Decimal fixed={5}>{Number(walletsFromAmount) * 0.05}</Decimal> {selectedWalletToCurrency.toUpperCase()}
            </span>
        );
    };

    const renderTotal = () => {
            return  <span>
                <Decimal fixed={8}>{Number(walletsFromAmount) - Number(walletsFromAmount) * 0.05}</Decimal> {selectedWalletToCurrency.toUpperCase()}
            </span>;
    };
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
                                {/* <FormattedMessage id={'page.body.withdraw.header.title'} /> */}
                                Swap
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <Box mt={2} pl={3} pr={3}>
                <Grid container>
                    <Grid item xs={12} sm ={12} md={4} lg={4}>
                        <Paper className={classes.pagePaper}>
                            <div className={classes.swapFields}>
                                <FormControl variant="outlined" fullWidth className={classes.formControl }>
                                    <InputLabel htmlFor="sell">Sell</InputLabel>
                                    <OutlinedInput
                                        id="sell"
                                        placeholder="Enter Amount"
                                        type='number'
                                        value={walletsFromAmount}
                                        onChange={handleWalletsFromAmountChange}
                                        fullWidth
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Divider className={classes.divider} orientation="vertical" style={{ marginRight: '8px' }}/>
                                                <span className={classes.maxButton} onClick={setWalletFromMaxAmount}>Max</span>
                                            </InputAdornment>
                                        }
                                        labelWidth={20}
                                    />
                                </FormControl>
                                {renderWalletsFromDropdown()}
                            </div>
                            <div className={classes.swapFields}>
                                <FormControl variant="outlined" fullWidth className={classes.formControl }>
                                    <InputLabel htmlFor="buy">Buy</InputLabel>
                                    <OutlinedInput
                                        id="buy"
                                        placeholder="Enter Amount"
                                        type='number'
                                        value={walletsToAmount}
                                        onChange={handleWalletsToAmountChange}
                                        fullWidth
                                        labelWidth={20}
                                    />
                                </FormControl>
                                {renderWalletsToDropdown()}
                            </div>
                            <Box mt={3} mb={3}>
                                <Typography variant="h6" component="div" display="inline" style={{ opacity: '0.6', marginRight: '8px' }}>
                                    {/* <FormattedMessage id={'page.body.withdraw.total_balance'} />: */}
                                    Available Balance:
                                </Typography>
                                <Typography variant="h6" component="div" display="inline" style={{ marginRight: '4px' }}>{ selectedWalletFromOption && selectedWalletFromOption.balance }</Typography>
                                <Typography variant="h6" component="div" display="inline">{ selectedWalletFromOption ? selectedWalletFromOption.currency.toUpperCase() : '' }</Typography>
                                <br />
                                {renderFee()}
                                <br />
                                {renderTotal()}
                            </Box>
                            <Button 
                                variant="contained" 
                                color="primary"
                                size="large"
                                fullWidth={true}
                                // onClick={this.handleClick}
                                disabled={Number(walletsFromAmount) > 0 && (Number(walletsFromAmount) <= Number(selectedWalletFromOptionBalance))}
                            >
                                Swap
                            </Button>
                        </Paper> 
                    </Grid>
                    <Grid item xs={12} sm ={12} md={8} lg={8}>
                        <Paper className={classes.pagePaper}></Paper>
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
});
const mapDispatchToProps = dispatch => ({
    fetchWallets: () => dispatch(walletsFetch()),
    fetchAddress: ({ currency }) => dispatch(walletsAddressFetch({ currency })),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    fetchSuccess: payload => dispatch(alertPush(payload)),
    currenciesFetch: () => dispatch(currenciesFetch()),
});

export const SwapScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(SwapComponent))