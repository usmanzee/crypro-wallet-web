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
import Divider from '@material-ui/core/Divider';
import { Button } from 'react-bootstrap';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';
import { connect } from 'react-redux';
import { WalletItemProps, CryptoIcon, WalletsDropdown } from '../../components';
import { alertPush, beneficiariesFetch, Beneficiary, currenciesFetch, Currency, RootState, selectBeneficiariesActivateSuccess, selectBeneficiariesDeleteSuccess, selectCurrencies, selectHistory, selectMobileWalletUi, selectUserInfo, selectWalletAddress, selectWallets, selectWalletsAddressError, selectWalletsLoading, selectWithdrawSuccess, setMobileWalletUi, User, WalletHistoryList, walletsAddressFetch, walletsData, walletsFetch, walletsWithdrawCcyFetch } from '../../modules';

import {
    useParams
  } from "react-router-dom";

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
        [theme.breakpoints.only('sm')]: {
            width: 'auto',
        },
        [theme.breakpoints.only('xs')]: {
            width: 'auto',
        },
    },
    currencyIcon: {
        width: "25px", 
        height: '25px'
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
    }
  }),
);


type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

const SwapComponent = (props: Props) => {
    const defaultWalletCurrency = 'usd';
    //Props
    const classes = useStyles();
    const { wallets, user, currencies } = props;

    //Params
    let params = useParams();
    let currency: string = params ? params['currency'] : defaultWalletCurrency;

    //States
    const [walletsFrom, setWalletsFrom] = React.useState<WalletItemProps[]>([]);
    const [walletsTo, setWalletsTo] = React.useState<WalletItemProps[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedWalletFromOption, setSelectedWalletFromOption] = React.useState<WalletItemProps | null | undefined>(null);
    const [selectedWalletToOption, setSelectedWalletToOption] = React.useState<WalletItemProps | null | undefined>(null);

    //UseEffect
    React.useEffect(() => {
        if (!wallets.length) {
            props.fetchWallets();
        }
    }, [wallets]);

    React.useEffect(() => {
        if (wallets.length && !walletsFrom.length) {
            setWalletsFrom(wallets)
        }
    }, [wallets, walletsFrom]);

    //Addtional Methods
    const searchSelectedCurrencyInCryptoWallets = (currency: string) => {
        return walletsFrom.find(wallet => wallet.currency === currency);
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
    const popperOpen = Boolean(anchorEl);
    const popperId = popperOpen ? 'wallet-currencies' : undefined;
    
    const translate = (id: string) => props.intl.formatMessage({ id });

    const selectedWalletOptionBalance: number = selectedWalletFromOption && selectedWalletFromOption.balance ? +selectedWalletFromOption.balance : 0.0000;
    const selectedWalletOptionLocked: number = selectedWalletFromOption && selectedWalletFromOption.locked ? +selectedWalletFromOption.locked : 0.0000;

    const renderWalletDropdown = () => {
        // const selectedWallet = selectedWalletFromOption ? selectedWalletFromOption : {};
        return <WalletsDropdown 
            wallets = {walletsFrom}
            selectedWallet = {selectedWalletFromOption}
            setSelectedWallet = {setSelectedWalletFromOption}
            walletDropdownClick = {handleCurrencySelectClick}
            walletDropdownClose = {handleCurrencySelectClose}
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
            <Box mt={2} pl={3} pr={3} alignItems="center">
                <Paper className={classes.pagePaper}>
                    {/* <div className={classes.pagePaperHeader}>
                    <Link to="/wallet/withdraw/crypto" className={classes.inActivePage}>
                            <Typography variant="h6" component="div" display="inline" >
                                <FormattedMessage id={'page.body.withdraw.tabs.crypto'} />
                            </Typography>
                    </Link>
                    <Link to="/wallet/withdraw/fiat" className={classes.activePage}>
                        <Typography variant="h6" component="div"  display="inline">
                            <FormattedMessage id={'page.body.withdraw.tabs.fiat'} />
                        </Typography>
                    </Link>
                    </div> */}

                    <Grid container>
                        <Grid item xs={12} sm ={12} md={6} lg={6}>
                            {renderWalletDropdown()}
                            {/* <div className={classes.currencySelect} onClick={handleCurrencySelectClick}>
                                {selectedWalletFromOption ? 
                                    (<>
                                        {selectedWalletFromOption.iconUrl ? (<img src={`${ selectedWalletFromOption.iconUrl } `} className={classes.currencyIcon}/>) : (<CryptoIcon code={selectedWalletFromOption.currency.toUpperCase()} />)}
                                        <Typography variant="h6" component="div" display="inline" style={{ margin: '0 4px' }}>
                                            { selectedWalletFromOption.currency.toUpperCase() }
                                        </Typography>
                                        <Typography variant="body2" component="div" display="inline" style={{ marginTop: '5px' }}>
                                            { selectedWalletFromOption.name }
                                        </Typography> 
                                    </>) :
                                    ""
                                }
                            </div> */}


                            {/* <Popper
                                id={popperId}
                                open={popperOpen}
                                anchorEl={anchorEl}
                                placement="bottom-start"
                                className={classes.popper}
                            >
                                <div className={classes.header}>
                                    <FormattedMessage id={'page.body.withdraw.select.title'} />
                                </div>
                                <Autocomplete
                                    open
                                    onClose={handleCurrencySelectClose}
                                    disableCloseOnSelect={false}
                                    value={selectedWalletFromOption}
                                    onChange={(event: any, selectedOption: WalletItemProps | null) => {
                                        setSelectedWalletFromOption(selectedOption);
                                    }}
                                    noOptionsText="No Records Found"
                                    renderOption = {(option: WalletItemProps | null | undefined) => {
                                        const optionCurrency = option ? option.currency.toUpperCase() : '';
                                        return <React.Fragment>
                                            {option && option.iconUrl ? (<img src={`${ option.iconUrl } `} className={classes.currencyIcon}/>) : (<CryptoIcon code={optionCurrency} />)}
                                            <div>
                                                <Typography variant="h6" component="div" display="inline" style={{ margin: '0px 4px' }}>
                                                    { option ? option.currency.toUpperCase(): '' }
                                                </Typography>
                                                <Typography variant="body2" component="div" display="inline" style={{ marginTop: '5px' }}>
                                                    { option ? option.name : '' }
                                                </Typography>
                                            </div>
                                        </React.Fragment>
                                    }}
                                    options={walletsFrom}
                                    getOptionLabel={(option: WalletItemProps | null | undefined) => option ? option.name: ''}
                                    renderInput={(params) => (
                                    <InputBase
                                        ref={params.InputProps.ref}
                                        inputProps={params.inputProps}
                                        autoFocus
                                        className={classes.inputBase}
                                    />
                                    )}
                                />
                            </Popper> */}
                            <Box mt={3} mb={3}>
                                <Typography variant="h6" component="div" display="inline" style={{ opacity: '0.6', marginRight: '8px' }}>
                                    <FormattedMessage id={'page.body.withdraw.total_balance'} />:
                                </Typography>
                                <Typography variant="h6" component="div" display="inline" style={{ marginRight: '4px' }}>{ selectedWalletOptionBalance + selectedWalletOptionLocked }</Typography>
                                <Typography variant="h6" component="div" display="inline">{ selectedWalletFromOption ? selectedWalletFromOption.currency.toUpperCase() : '' }</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} className={classes.withdrawCol}>
                           
                        </Grid>
                    </Grid>
                    <Divider className={classes.historyDivider}/>
                    <Grid container>
                        <Grid item md={12}>
                            {/* {user.otp && selectedWalletOption && <WalletHistory label="withdraw" type="withdraws" currency={selectedWalletOption.currency} />} */}
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