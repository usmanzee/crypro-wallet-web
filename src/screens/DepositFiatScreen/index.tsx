import * as React from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';
import { fade, makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import StarIcon from '@material-ui/icons/Star'
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { useHistory, Link } from "react-router-dom";
import { RouterProps } from 'react-router';
import { connect } from 'react-redux';
import { Blur, CurrencyInfo, Decimal, DepositCrypto, DepositFiat, DepositTag, SummaryField, TabPanel, WalletItemProps, WalletList, CryptoIcon } from '../../components';
import { alertPush, beneficiariesFetch, Beneficiary, currenciesFetch, Currency, RootState, selectBeneficiariesActivateSuccess, selectBeneficiariesDeleteSuccess, selectCurrencies, selectHistory, selectMobileWalletUi, selectUserInfo, selectWalletAddress, selectWallets, selectWalletsAddressError, selectWalletsLoading, selectWithdrawSuccess, setMobileWalletUi, User, WalletHistoryList, walletsAddressFetch, walletsData, walletsFetch, walletsWithdrawCcyFetch } from '../../modules';
import { CommonError } from '../../modules/types';
import { WalletHistory } from '../../containers/Wallets/History';
import { formatCCYAddress, setDocumentTitle } from '../../helpers';

import {
    useParams
  } from "react-router-dom";

interface ReduxProps {
    user: User;
    wallets: WalletItemProps[];
    withdrawSuccess: boolean;
    addressDepositError?: CommonError;
    walletsLoading?: boolean;
    historyList: WalletHistoryList;
    mobileWalletChosen: string;
    selectedWalletAddress: string;
    beneficiariesActivateSuccess: boolean;
    beneficiariesDeleteSuccess: boolean;
    currencies: Currency[];
}

interface DispatchProps {
    fetchBeneficiaries: typeof beneficiariesFetch;
    fetchWallets: typeof walletsFetch;
    fetchAddress: typeof walletsAddressFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    fetchSuccess: typeof alertPush;
    setMobileWalletUi: typeof setMobileWalletUi;
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
    pagePaperHeader: {
        paddingBottom: theme.spacing(1),
        borderWidth: '0px 0px 1px',
        borderStyle: 'solid',
        borderColor: 'rgb(234, 236, 239)'
    },
    activePage: {
        color: '#000',
        marginRight: theme.spacing(2),
        cursor: 'pointer',
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        paddingBottom: '10px',
        '&:hover': {
            textDecoration: 'none',
            color: '#000',
        },
    },
    inActivePage: {
        color: '#000',
        marginRight: theme.spacing(2),
        opacity: '0.6',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none',
            color: '#000',
        },
    },
    currencySelect: {
        display: 'flex',
        width: '336px',
        cursor: 'pointer',
        margin:' 16px 0px',
        padding: theme.spacing(1),
        borderRadius: '4px',
        borderWidth: '1px',
        borderColor: 'rgb(230, 232, 234)',
        borderStyle: 'solid',
    },
    popper: {
      border: '1px solid rgba(27,31,35,.15)',
      boxShadow: '0 3px 12px rgba(27,31,35,.15)',
      borderRadius: 3,
      width: 300,
      zIndex: 1,
      fontSize: 13,
      color: '#586069',
      backgroundColor: '#f6f8fa',
    },
    header: {
      borderBottom: '1px solid #e1e4e8',
      padding: '8px 10px',
      fontWeight: 600,
    },
    inputBase: {
      padding: 10,
      width: '100%',
      borderBottom: '1px solid #dfe2e5',
      '& input': {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        padding: 8,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        border: '1px solid #ced4da',
        fontSize: 14,
        '&:focus': {
          boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    cryptoTips: {
        backgroundColor: 'rgb(245, 245, 245)',
        borderRadius: '4px',
        padding: '16px'
    },
    networkPaper: {
        padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
        margin: `${theme.spacing(2)}px 0px`,
        borderRadius: '4px'
    },
    networkPaperHeader: {
        paddingBottom: theme.spacing(1),
        borderWidth: '0px 0px 1px',
        borderStyle: 'solid',
        borderColor: 'rgb(234, 236, 239)'
    },
    networkPaperContent: {
        textAlign: 'center',
        padding: `${theme.spacing(15)}px 0px`,
    },
    historyDivider: {
        margin: `${theme.spacing(4)}px 0px ${theme.spacing(3)}px`,
    }
  }),
);


type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

const DepositFiatComponent = (props: Props) => {
    const defaultFiatDepositCurrency = 'EUR';
    let history = useHistory();
    //Props
    const classes = useStyles();
    const { addressDepositError, wallets, user, selectedWalletAddress, currencies } = props;

    //Params
    let params = useParams();
    let currency: string = params ? params['currency'] : defaultFiatDepositCurrency;

    //States
    const [selectedCurrency, setSelectedCurrency] = React.useState<string>(currency);
    const [fiatCurrencies, setFiatCurrencies] = React.useState<Currency[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedCurrencyOption, setSelectedCurrencyOption] = React.useState<Currency | null | undefined>(null);
    const [walletAddress, setWalletAddress] = React.useState<string>('');

    //UseEffects
    React.useEffect(() => {
        if (!props.currencies.length) {
            props.currenciesFetch();
        }
    }, [currencies]);

    React.useEffect(() => {
        if (!fiatCurrencies.length) {
            setFiatCurrencies(currencies.filter((currency) => {
                return currency.type === 'fiat';
            }));
        } else {
            
            let searchedcurrencyOption = searchSelectedCurrency(selectedCurrency);
            if(!searchedcurrencyOption) {
                searchedcurrencyOption = searchSelectedCurrency(defaultFiatDepositCurrency);
            }
            setSelectedCurrencyOption(searchedcurrencyOption);
        }
    }, [fiatCurrencies]);

    React.useEffect(() => {
        // if(selectedCurrencyOption) {
        //     selectedCurrencyOption.type === 'coin' && selectedCurrencyOption.balance && props.fetchAddress({ currency: selectedCurrencyOption.currency });
        // }
    }, [selectedCurrencyOption]);

    React.useEffect(() => {
        if(selectedWalletAddress) {
            const formatedWalletAddress = formatCCYAddress(currency, selectedWalletAddress);
            setWalletAddress(formatedWalletAddress);
        }
    }, [selectedWalletAddress]);

    //Addtional Methods
    const searchSelectedCurrency = (currency: string) => {
        return fiatCurrencies.find(fiatCurrency => fiatCurrency.id === currency);
    }
    const handleCurrencySelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleCurrencySelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (anchorEl) {
          anchorEl.focus();
        }
        setAnchorEl(null);
    };

    const handleOnCopy = () => {
        props.fetchSuccess({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'});
    };

    const handleGenerateAddress = () => {
        const { wallets } = props;

        if (wallets.length && selectedCurrencyOption) {
            props.fetchAddress({ currency: selectedCurrencyOption.id });
        }
    };

    const handleTabLinkClick = (event) => {
        const targetUrl = event.target.url;
        history.push(targetUrl);
    }
    
    const translate = (id: string) => props.intl.formatMessage({ id });

    const popperOpen = Boolean(anchorEl);
    const popperId = popperOpen ? 'wallet-currencies' : undefined;

    // const isAccountActivated = (selectedCurrencyOption && selectedCurrencyOption.balance) ? true : false;

    // const currencyItem = ((currencies && selectedCurrencyOption) && currencies.find(currency => currency.id === selectedCurrencyOption.currency)) || { min_confirmations: 6 };
    // const text = props.intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' }, { confirmations: currencyItem.min_confirmations });
    // const tip1 = props.intl.formatMessage({ id: 'page.body.deposit.tips.tip1' });
    // const tip2 = props.intl.formatMessage({ id: 'page.body.deposit.tips.tip2' }, { confirmations: currencyItem.min_confirmations });

    // const error = addressDepositError ?
    //     props.intl.formatMessage({id: addressDepositError.message}) :
    //     props.intl.formatMessage({id: 'page.body.wallets.tabs.deposit.ccy.message.error'});

    // const buttonLabel = `
    //     ${translate('page.body.wallets.tabs.deposit.ccy.button.generate')} ${selectedCurrencyOption ? selectedCurrencyOption.currency.toUpperCase() : ''} ${translate('page.body.wallets.tabs.deposit.ccy.button.address')}
    // `;

    
    // const selectedCurrencyOptionBalance: number = selectedCurrencyOption && selectedCurrencyOption.balance ? +selectedCurrencyOption.balance : 0.0000;
    // const selectedCurrencyOptionLocked: number = selectedCurrencyOption && selectedCurrencyOption.locked ? +selectedCurrencyOption.locked : 0.0000;
    return (
        <>
            <Box>
                <Paper className={classes.headerPaper}>
                    <Grid container>
                        <Grid item md={12}>
                            <Typography variant="h4" display="inline">
                                <FormattedMessage id={'page.body.deposit.header.title'} />
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <Box mt={2} pl={3} pr={3} alignItems="center">
                <Paper className={classes.pagePaper}>
                    <div className={classes.pagePaperHeader}>
                        <Link to="/wallet/deposit/crypto" className={classes.inActivePage}>
                            <Typography variant="h6" component="div" display="inline" >
                                <FormattedMessage id={'page.body.deposit.tabs.crypto'} />
                            </Typography>
                        </Link>
                        <Link to="/wallet/deposit/fiat" className={classes.activePage}>
                            <Typography variant="h6" component="div"  display="inline">
                                <FormattedMessage id={'page.body.deposit.tabs.fiat'} />
                            </Typography>
                        </Link>
                    </div>

                    <Grid container>
                        <Grid item md={6}>
                            <div className={classes.currencySelect} onClick={handleCurrencySelectClick}>
                                {selectedCurrencyOption ? 
                                    (<>
                                        <img src={selectedCurrencyOption ? selectedCurrencyOption.icon_url: ''} style={{ width: "25px", height: '25px', margin: "2px 5px" }}/>
                                        <Typography variant="h6" component="div" display="inline" style={{ marginRight: '8px' }}>
                                            { selectedCurrencyOption.id.toUpperCase() }
                                        </Typography>
                                        <Typography variant="body2" component="div" display="inline" style={{ marginTop: '5px' }}>
                                            { selectedCurrencyOption.name }
                                        </Typography> 
                                    </>) :
                                    ""
                                }
                            </div>

                            <Popper
                                id={popperId}
                                open={popperOpen}
                                anchorEl={anchorEl}
                                placement="bottom-start"
                                className={classes.popper}
                            >
                                <div className={classes.header}>
                                    <FormattedMessage id={'page.body.deposit.select.title'} />
                                </div>
                                <Autocomplete
                                    open
                                    onClose={handleCurrencySelectClose}
                                    disableCloseOnSelect={false}
                                    value={selectedCurrencyOption}
                                    onChange={(event: any, selectedOption: Currency | null) => {
                                        setSelectedCurrencyOption(selectedOption);
                                        setSelectedCurrency(selectedOption ? selectedOption.id : defaultFiatDepositCurrency);
                                    }}
                                    noOptionsText="No Records Found"
                                    renderOption={(option: Currency | null | undefined) => (
                                        <React.Fragment>
                                            <img src={option ? option.icon_url: ''} style={{ width: "25px", height: '25px', margin: "2px 5px" }}/>
                                            <div>
                                                <Typography variant="h6" component="div" display="inline" style={{ marginRight: '8px' }}>
                                                    { option ? option.id.toUpperCase(): '' }
                                                </Typography>
                                                <Typography variant="body2" component="div" display="inline" style={{ marginTop: '5px' }}>
                                                    { option ? option.name : '' }
                                                </Typography>
                                            </div>
                                        </React.Fragment>
                                    )}
                                    options={fiatCurrencies}
                                    getOptionLabel={(option: Currency | null | undefined) => option ? option.name: ''}
                                    renderInput={(params) => (
                                    <InputBase
                                        ref={params.InputProps.ref}
                                        inputProps={params.inputProps}
                                        autoFocus
                                        className={classes.inputBase}
                                    />
                                    )}
                                />
                            </Popper>
                            {/* <Box mt={3} mb={3}>
                                <Typography variant="h6" component="div" display="inline" style={{ opacity: '0.6', marginRight: '8px' }}>
                                    <FormattedMessage id={'page.body.deposit.total_balance'} />:
                                </Typography>
                                <Typography variant="h6" component="div" display="inline" style={{ marginRight: '4px' }}>{ selectedCurrencyOptionBalance + selectedCurrencyOptionLocked }</Typography>
                                <Typography variant="h6" component="div" display="inline">{ selectedCurrencyOption ? selectedCurrencyOption.currency.toUpperCase() : '' }</Typography>
                            </Box> */}
                            <Paper elevation={0} className={classes.cryptoTips}>
                                <Typography variant="h6" component="div"><EmojiObjectsIcon />
                                    <FormattedMessage id={'page.body.deposit.tips.title'} />
                                </Typography>
                                <List component="ul" aria-label="contacts">
                                    <ListItem button>
                                        <ListItemIcon>
                                            <StarIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={"tip1"} />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <StarIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={"tip2"} />
                                    </ListItem>
                                   
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item md={1}></Grid>
                        <Grid item md={5}>
                            
                        </Grid>
                    </Grid>
                    <Divider className={classes.historyDivider}/>
                    <Grid container>
                        <Grid item md={12}>
                            {selectedCurrencyOption && <WalletHistory label="deposit" type="deposits" currency={selectedCurrencyOption} />}
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </>
    );
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    walletsLoading: selectWalletsLoading(state),
    addressDepositError: selectWalletsAddressError(state),
    withdrawSuccess: selectWithdrawSuccess(state),
    historyList: selectHistory(state),
    mobileWalletChosen: selectMobileWalletUi(state),
    selectedWalletAddress: selectWalletAddress(state),
    beneficiariesActivateSuccess: selectBeneficiariesActivateSuccess(state),
    beneficiariesDeleteSuccess: selectBeneficiariesDeleteSuccess(state),
    currencies: selectCurrencies(state),
});
const mapDispatchToProps = dispatch => ({
    fetchBeneficiaries: () => dispatch(beneficiariesFetch()),
    fetchWallets: () => dispatch(walletsFetch()),
    fetchAddress: ({ currency }) => dispatch(walletsAddressFetch({ currency })),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    fetchSuccess: payload => dispatch(alertPush(payload)),
    setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
    currenciesFetch: () => dispatch(currenciesFetch()),
});

export const DepositFiatScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DepositFiatComponent))