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
import Button  from '@material-ui/core/Button';


import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';
import { connect } from 'react-redux';
import { Withdraw, WithdrawProps } from '../../containers';
import { PageHeader } from '../../containers/PageHeader';
import { ModalWithdrawConfirmation } from '../../containers/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from '../../containers/ModalWithdrawSubmit';
import { WalletItemProps, CryptoIcon } from '../../components';
import { globalStyle } from '../../screens/materialUIGlobalStyle';

import { 
    selectUserInfo,
    beneficiariesFetch, 
    Beneficiary, 
    RootState, 
    selectBeneficiariesActivateSuccess, 
    selectBeneficiariesDeleteSuccess, 
    selectWallets, 
    selectWalletsLoading, 
    selectWithdrawProcessing,
    selectWithdrawSuccess, 
    User, 
    walletsData, 
    walletsFetch, 
    walletsWithdrawCcyFetch
} from '../../modules';
import { CommonError } from '../../modules/types';
import { WalletHistory } from '../../containers/Wallets/History';

import {
    useParams
  } from "react-router-dom";

interface ReduxProps {
    user: User;
    wallets: WalletItemProps[];
    withdrawProcessing: boolean;
    withdrawSuccess: boolean;
    walletsLoading?: boolean;
    beneficiariesActivateSuccess: boolean;
    beneficiariesDeleteSuccess: boolean;
}

interface DispatchProps {
    fetchBeneficiaries: typeof beneficiariesFetch;
    fetchWallets: typeof walletsFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    data: {
        address: '',
    },
};

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

const WithdrawCryptoComponent = (props: Props) => {
    const defaultWalletCurrency = 'btc';
    //Props
    const classes = useStyles();
    const { wallets, user, withdrawSuccess, withdrawProcessing } = props;

    //Params
    let params = useParams();
    let currency: string = params ? params['currency'] : defaultWalletCurrency;

    //States
    const [selectedCurrency, setSelectedCurrency] = React.useState<string>(currency);
    const [cryptoWallets, setCryptoWallets] = React.useState<WalletItemProps[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedWalletOption, setSelectedWalletOption] = React.useState<WalletItemProps | null | undefined>(null);
    const [withdrawDone, setWithDrawDone] = React.useState<boolean>(false);

    const [withdrawCryptostate, setWithdrawCryptoState] = React.useState({
        rid: '',
        amount: '',
        beneficiary: defaultBeneficiary,
        otpCode: '',
        withdrawConfirmModal: false,
        total: '',
        withdrawDone: false,
        withdrawSubmitModal: false,
    });

    //UseEffect
    React.useEffect(() => {
        if (!wallets.length) {
            props.fetchWallets();
        }
    }, [wallets]);

    React.useEffect(() => {
        if(wallets.length > 0) {
            if (cryptoWallets.length === 0) {
                setCryptoWallets(wallets.filter((wallet: WalletItemProps) => {
                    return wallet.type === 'coin';
                }));
            } else {
                
                let searchedOption = searchSelectedCurrencyInCryptoWallets(selectedCurrency);
                if(!searchedOption) {
                    searchedOption = searchSelectedCurrencyInCryptoWallets(defaultWalletCurrency);
                }
                setSelectedWalletOption(searchedOption);
            }
        }
    }, [cryptoWallets, wallets]);

    //Addtional Methods
    const searchSelectedCurrencyInCryptoWallets = (currency: string) => {
        return cryptoWallets.find(wallet => wallet.currency === currency);
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

    const selectedWalletOptionBalance: number = selectedWalletOption && selectedWalletOption.balance ? +selectedWalletOption.balance : 0.0000;
    const selectedWalletOptionLocked: number = selectedWalletOption && selectedWalletOption.locked ? +selectedWalletOption.locked : 0.0000;

    let confirmationAddress = '';
    if (selectedWalletOption) {
        confirmationAddress = selectedWalletOption.type === 'fiat' ? (
            withdrawCryptostate.beneficiary.name
        ) : (
            withdrawCryptostate.rid
            //beneficiary.data ? (beneficiary.data.address as string) : ''
        );
    }

    const handleWithdraw = () => {
        const { otpCode, beneficiary, rid, total } = withdrawCryptostate;

        const currency = selectedWalletOption ? selectedWalletOption.currency : defaultWalletCurrency;

        if (selectedWalletOption && selectedWalletOption.type === 'coin') {
            const withdrawRequest = {
                rid,
                amount: total,
                currency: currency.toLowerCase(),
                otp: otpCode,
            };
            props.walletsWithdrawCcy(withdrawRequest);
        } else {
            const withdrawRequest = {
                amount: total,
                currency: currency.toLowerCase(),
                otp: otpCode,
                beneficiary_id: beneficiary.id,
            };
            props.walletsWithdrawCcy(withdrawRequest);
        }
        toggleConfirmModal();
    };

    const resetForm = () => {
        props.fetchWallets()
    }
    const toggleSubmitModal = () => {
        
        setWithdrawCryptoState({
            ...withdrawCryptostate,
            withdrawSubmitModal: !withdrawCryptostate.withdrawSubmitModal,
            withdrawDone: true
        });
    };

    const toggleConfirmModal = (rid?: string, amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string) => {

        setWithdrawCryptoState({
            ...withdrawCryptostate,
            rid: rid || '',
            amount: amount || '',
            beneficiary: beneficiary ? beneficiary : defaultBeneficiary,
            otpCode: otpCode ? otpCode : '',
            withdrawConfirmModal: !withdrawCryptostate.withdrawConfirmModal,
            total: total || '',
            withdrawDone: false,
        });
    };

    const isTwoFactorAuthRequired = (level: number, is2faEnabled: boolean) => {
        return level > 1 || (level === 1 && is2faEnabled);
    }

    const isOtpDisabled = () => {
        return (
            <React.Fragment>
                <Paper elevation={2} style={{ padding: '16px', margin: '16px' }}>
                    <Typography variant="h6" style={{ marginBottom: '16px' }}>
                        {translate('page.body.wallets.tabs.withdraw.content.enable2fa')}
                    </Typography>
                    <Button
                        fullWidth
                        onClick={redirectToEnable2fa}
                        color="secondary"
                        variant="contained"
                    >
                        {translate('page.body.wallets.tabs.withdraw.content.enable2faButton')}
                    </Button>
                </Paper>
            </React.Fragment>
        );
    };

    const redirectToEnable2fa = () => props.history.push('/security/2fa', { enable2fa: true });

    const renderWithdrawContent = () => {
    
        const { user: { level, otp }, wallets, withdrawProcessing, withdrawSuccess } = props;
        
        const currency = selectedWalletOption ? selectedWalletOption.currency : defaultWalletCurrency;
        const fee = selectedWalletOption ? selectedWalletOption.fee : 0;
        const type = selectedWalletOption ? selectedWalletOption.type : 'coin';
        const fixed = selectedWalletOption ? selectedWalletOption.fixed : 0;
        const balance: number = selectedWalletOption && selectedWalletOption.balance ? +selectedWalletOption.balance : 0;
        const withdrawEnabled = selectedWalletOption ? selectedWalletOption.withdrawEnabled : true;
    
        const withdrawProps: WithdrawProps = {
            withdrawDone,
            balance,
            currency,
            fee,
            onClick: toggleConfirmModal,
            twoFactorAuthRequired: isTwoFactorAuthRequired(level, otp),
            fixed,
            type,
            withdrawProcessing,
            withdrawSuccess,
            resetForm: resetForm,
            withdrawAddressLabel: props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.address' }),
            withdrawAmountLabel: props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }),
            withdraw2faLabel: props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }),
            withdrawFeeLabel: props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }),
            withdrawTotalLabel: props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }),
            withdrawButtonLabel: props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }),
            withdrawEnabled: withdrawEnabled,
        };
    
        return otp ? <Withdraw {...withdrawProps} /> : isOtpDisabled();
    };

    const pageTitle = translate('page.body.withdraw.header.title');

    return (
        <>
            <PageHeader pageTitle={pageTitle} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={classes.pageContent} >
                    <div className={classes.pageContentHeader}>
                    <Link to="/wallet/withdraw/crypto" className={classes.activePage}>
                            <Typography variant="h6" component="div" display="inline" >
                                <FormattedMessage id={'page.body.withdraw.tabs.crypto'} />
                            </Typography>
                    </Link>
                    <Link to="/wallet/withdraw/fiat" className={classes.inActivePage}>
                        <Typography variant="h6" component="div"  display="inline">
                            <FormattedMessage id={'page.body.withdraw.tabs.fiat'} />
                        </Typography>
                    </Link>
                    </div>

                    <Grid container>
                        <Grid item xs={12} sm ={12} md={6} lg={6}>
                            <div className={classes.currencySelect} onClick={handleCurrencySelectClick}>
                                {selectedWalletOption ? 
                                    (<>
                                        {selectedWalletOption.iconUrl ? (<img src={`${ selectedWalletOption.iconUrl } `} className={classes.currencyIcon}/>) : (<CryptoIcon code={selectedWalletOption.currency.toUpperCase()} />)}
                                        <Typography variant="h6" component="div" display="inline" style={{ margin: '0 4px' }}>
                                            { selectedWalletOption.currency.toUpperCase() }
                                        </Typography>
                                        <Typography variant="body2" component="div" display="inline" style={{ marginTop: '5px' }}>
                                            { selectedWalletOption.name }
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
                                    <FormattedMessage id={'page.body.withdraw.select.title'} />
                                </div>
                                <Autocomplete
                                    open
                                    onClose={handleCurrencySelectClose}
                                    disableCloseOnSelect={false}
                                    value={selectedWalletOption}
                                    onChange={(event: any, selectedOption: WalletItemProps | null) => {
                                        setSelectedWalletOption(selectedOption);
                                        setSelectedCurrency(selectedOption ? selectedOption.currency : defaultWalletCurrency);
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
                                    options={cryptoWallets}
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
                                    <FormattedMessage id={'page.body.withdraw.total_balance'} />:
                                </Typography>
                                <Typography variant="h6" component="div" display="inline" style={{ marginRight: '4px' }}>{ selectedWalletOptionBalance + selectedWalletOptionLocked }</Typography>
                                <Typography variant="h6" component="div" display="inline">{ selectedWalletOption ? selectedWalletOption.currency.toUpperCase() : '' }</Typography>
                            </Box>
                            <Paper elevation={0} className={classes.cryptoTips}>
                                <Typography variant="h6" component="div"><EmojiObjectsIcon />
                                    <FormattedMessage id={'page.body.withdraw.tips.title'} />
                                </Typography>
                                <List component="ul" aria-label="contacts">
                                    <ListItem button>
                                        <ListItemIcon>
                                            <StarIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={<FormattedMessage id={'page.body.withdraw.tips.tip1'} />} />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <StarIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={<FormattedMessage id={'page.body.withdraw.tips.tip2'} />} />
                                    </ListItem>
                                   
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} className={classes.withdrawCol}>
                            {renderWithdrawContent()}
                        </Grid>
                    </Grid>
                    <Divider className={classes.historyDivider}/>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {user.otp && selectedWalletOption && <WalletHistory label="withdraw" type="withdraws" currency={selectedWalletOption.currency} withdrawSuccess={withdrawSuccess}/>}
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            
            <ModalWithdrawSubmit
                show={withdrawCryptostate.withdrawSubmitModal}
                currency={selectedWalletOption ? selectedWalletOption.currency : defaultWalletCurrency}
                onSubmit={toggleSubmitModal}
            />
            <ModalWithdrawConfirmation
                show={withdrawCryptostate.withdrawConfirmModal}
                amount={withdrawCryptostate.total}
                currency={selectedWalletOption ? selectedWalletOption.currency : defaultWalletCurrency}
                rid={confirmationAddress}
                onSubmit={handleWithdraw}
                onDismiss={toggleConfirmModal}
            />
        </>
    );
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    walletsLoading: selectWalletsLoading(state),
    withdrawProcessing: selectWithdrawProcessing(state),
    withdrawSuccess: selectWithdrawSuccess(state),
    beneficiariesActivateSuccess: selectBeneficiariesActivateSuccess(state),
    beneficiariesDeleteSuccess: selectBeneficiariesDeleteSuccess(state),
});
const mapDispatchToProps = dispatch => ({
    fetchBeneficiaries: () => dispatch(beneficiariesFetch()),
    fetchWallets: () => dispatch(walletsFetch()),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
});

export const WithdrawCryptoScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(WithdrawCryptoComponent))