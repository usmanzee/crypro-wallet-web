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

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';
import { connect } from 'react-redux';
import { 
    DepositFiat, 
    WalletItemProps,
    CryptoIcon
} from '../../components';
import {  
    RootState, 
    selectUserInfo, 
    selectWallets, 
    selectWalletsLoading, 
    User, 
    walletsData, 
    walletsFetch, 
} from '../../modules';
import { WalletHistory } from '../../containers/Wallets/History';
import { PageHeader } from '../../containers/PageHeader';
import { globalStyle } from '../../screens/materialUIGlobalStyle';

import {
    useParams
  } from "react-router-dom";

interface ReduxProps {
    user: User;
    wallets: WalletItemProps[];
    walletsLoading?: boolean;
}

interface DispatchProps {
    fetchWallets: typeof walletsFetch;
    clearWallets: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...globalStyle(theme),
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
    depositCol: {
        [theme.breakpoints.up('lg')]: {
            padding: `0px ${theme.spacing(1)}px`,
        },
        [theme.breakpoints.only('md')]: {
            padding: `0px ${theme.spacing(1)}px`,
        }
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
    const defaultFiatDepositCurrency = 'usd';
    //Props
    const classes = useStyles();
    const { wallets, user, fetchWallets } = props;

    //Params
    let params = useParams();
    let currency: string = params ? params['currency'] : defaultFiatDepositCurrency;

    //States
    const [selectedCurrency, setSelectedCurrency] = React.useState<string>(currency);
    const [fiatWallets, setFiatWallets] = React.useState<WalletItemProps[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedFiatWalletOption, setSelectedFiatWalletOption] = React.useState<WalletItemProps | null | undefined>(null);

    //UseEffects
    React.useEffect(() => {
        if (!wallets.length) {
            fetchWallets();
        }
    }, [wallets, fetchWallets]);

    React.useEffect(() => {
        if (!fiatWallets.length && wallets.length > 0) {
            setFiatWallets(wallets.filter((wallet) => {
                return wallet.type === 'fiat';
            }));
        } else if(fiatWallets.length > 0 && wallets.length > 0) {
            
            let searchedOption = searchSelectedCurrencyInFiatWallets(selectedCurrency);
            if(!searchedOption) {
                searchedOption = searchSelectedCurrencyInFiatWallets(defaultFiatDepositCurrency);
            }
            setSelectedFiatWalletOption(searchedOption);
        }
    }, [fiatWallets, wallets]);

    //Addtional Methods
    const searchSelectedCurrencyInFiatWallets = (currency: string) => {
        return fiatWallets.find(fiatWallet => fiatWallet.currency === currency);
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

    const translate = (id: string) => props.intl.formatMessage({ id });

    const popperOpen = Boolean(anchorEl);
    const popperId = popperOpen ? 'wallet-currencies' : undefined;

    // const pageTitle = translate('page.body.wallets.title');
    const title = translate('page.body.wallets.tabs.deposit.fiat.message1');
    const description = translate('page.body.wallets.tabs.deposit.fiat.message2');
    
    const selectedFiatWalletbalance: number = selectedFiatWalletOption && selectedFiatWalletOption.balance ? +selectedFiatWalletOption.balance : 0.0000;
    const selectedFiatWalletLocked: number = selectedFiatWalletOption && selectedFiatWalletOption.locked ? +selectedFiatWalletOption.locked : 0.0000;
    const pageTitle = translate('page.body.deposit.header.title');
    return (
        <>
            <PageHeader pageTitle={pageTitle} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={classes.pageContent} >
                    <div className={classes.pageContentHeader}>
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
                        <Grid item xs={12} sm ={12} md={6} lg={6}>
                            <div className={classes.currencySelect} onClick={handleCurrencySelectClick}>
                                {selectedFiatWalletOption ? 
                                    (<>
                                        {selectedFiatWalletOption.iconUrl ? (<img src={`${ selectedFiatWalletOption.iconUrl } `} className={classes.currencyIcon} alt="currency" />) : (<CryptoIcon code={selectedFiatWalletOption.currency.toUpperCase()} />)}
                                        <Typography variant="h6" component="div" display="inline" style={{ margin: '0px 4px' }}>
                                            { selectedFiatWalletOption.currency.toUpperCase() }
                                        </Typography>
                                        <Typography variant="body2" component="div" display="inline" style={{ marginTop: '5px' }}>
                                            { selectedFiatWalletOption.name }
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
                                    value={selectedFiatWalletOption}
                                    onChange={(event: any, selectedOption: WalletItemProps | null) => {
                                        setSelectedFiatWalletOption(selectedOption);
                                        setSelectedCurrency(selectedOption ? selectedOption.currency : defaultFiatDepositCurrency);
                                    }}
                                    noOptionsText="No Records Found"
                                    renderOption = {(option: WalletItemProps | null | undefined) => {
                                        const optionCurrency = option ? option.currency.toUpperCase() : '';
                                        return <React.Fragment>
                                            {option && option.iconUrl ? (<img src={`${ option.iconUrl } `} className={classes.currencyIcon} alt="currency"/>) : (<CryptoIcon code={optionCurrency} />)}
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
                                    options={fiatWallets}
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
                            </Popper>
                            <Box mt={3} mb={3}>
                                <Typography variant="h6" component="div" display="inline" style={{ opacity: '0.6', marginRight: '8px' }}>
                                    <FormattedMessage id={'page.body.deposit.total_balance'} />:
                                </Typography>
                                <Typography variant="h6" component="div" display="inline" style={{ marginRight: '4px' }}>{ selectedFiatWalletbalance + selectedFiatWalletLocked }</Typography>
                                <Typography variant="h6" component="div" display="inline">{ selectedFiatWalletOption ? selectedFiatWalletOption.currency.toUpperCase() : '' }</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} className={classes.depositCol}>
                            <DepositFiat title={title} description={description} uid={user ? user.uid : ''} currency={selectedFiatWalletOption ? selectedFiatWalletOption.currency : ''}/>
                        </Grid>
                    </Grid>
                    <Divider className={classes.historyDivider}/>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {selectedFiatWalletOption && <WalletHistory label="deposit" type="deposits" currency={selectedFiatWalletOption.currency} />}
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
});
const mapDispatchToProps = dispatch => ({
    fetchWallets: () => dispatch(walletsFetch()),
    clearWallets: () => dispatch(walletsData([])),
});

export const DepositFiatScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DepositFiatComponent))