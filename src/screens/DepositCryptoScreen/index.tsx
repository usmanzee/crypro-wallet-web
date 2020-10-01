import * as React from 'react';
import './depositCrypto.css';
import {
    Box,
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';
import { useTheme, fade, makeStyles, Theme, createStyles, withStyles} from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import ButtonBase from '@material-ui/core/ButtonBase';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star'
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';


import { connect, MapDispatchToProps } from 'react-redux';
import { Blur, CurrencyInfo, Decimal, DepositCrypto, DepositFiat, DepositTag, SummaryField, TabPanel, WalletItemProps, WalletList, CryptoIcon } from '../../components';
import { alertPush, beneficiariesFetch, Beneficiary, currenciesFetch, Currency, RootState, selectBeneficiariesActivateSuccess, selectBeneficiariesDeleteSuccess, selectCurrencies, selectHistory, selectMobileWalletUi, selectUserInfo, selectWalletAddress, selectWallets, selectWalletsAddressError, selectWalletsLoading, selectWithdrawSuccess, setMobileWalletUi, User, WalletHistoryList, walletsAddressFetch, walletsData, walletsFetch, walletsWithdrawCcyFetch } from '../../modules';
import { CommonError } from '../../modules/types';
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
        marginRight: theme.spacing(1),
        cursor: 'pointer',
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        paddingBottom: theme.spacing(1)
    },
    inActivePage: {
        marginLeft: theme.spacing(1),
        opacity: '0.6',
        cursor: 'pointer'
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
    }
  }),
);

const LightTooltip = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

type Props = ReduxProps & DispatchProps;

const DepositWalletCrypto = (props) => {
    const classes = useStyles();

    let params = useParams();
    let currency = params ? params['currency'] : 'btc';

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [value, setValue] = React.useState<any>();
    const [pendingValue, setPendingValue] = React.useState<any>();

    const [currencyOption, setCurrencyOption] = React.useState<WalletItemProps | null>(null);
    const [selectedCurrencyOption, setSelectedCurrencyOption] = React.useState<WalletItemProps | null>(null);
    const [walletAddress, setWalletAddress] = React.useState<string | null>(null);
    
    const theme = useTheme();
    const { wallets, selectedWalletAddress } = props;
    console.log("selectedWalletAddress:", selectedWalletAddress);
    console.log("walletAddress: ", walletAddress);

    React.useEffect(() => {
        if(wallets.length === 0) {
            props.fetchWallets();
        } else {
            let walletOptions = searchCurrency(currency);
            if(walletOptions.length === 0) {
                walletOptions = searchCurrency('btc');
            }
            setCurrencyOption(walletOptions[0]);
            setSelectedCurrencyOption(walletOptions[0]);
        }
        if(selectedCurrencyOption) {
            props.fetchAddress({currency: selectedCurrencyOption.currency})
        }
        if(selectedWalletAddress) {
            console.log('call: ', currency,selectedWalletAddress);
            setWalletAddress(formatCCYAddress(currency, selectedWalletAddress));
        }
    }, [wallets, selectedCurrencyOption, selectedWalletAddress]);

    const searchCurrency = (currency) => {
        return wallets.filter((wallet) => {
            return wallet.currency == currency;
        })
    }
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        console.log('handleClick');
        // setPendingValue(value);
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        console.log('handleClose');
        if (reason === 'toggleInput') {
          return;
        }
        setValue(pendingValue);
        if (anchorEl) {
          anchorEl.focus();
        }
        setAnchorEl(null);
      };
    
      const open = Boolean(anchorEl);
      const id = open ? 'github-label' : undefined;
    return (
        <>
            <Box>
                <Paper className={classes.headerPaper}>
                    <Grid container>
                        <Grid item md={12}>
                            <Typography variant="h4" display="inline">Deposit</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <Box mt={2} pl={3} pr={3} alignItems="center">
                <Paper className={classes.pagePaper}>
                    <div className={classes.pagePaperHeader}>
                        <Typography variant="h6" component="div"  display="inline" className={classes.activePage}>Crypto</Typography>
                        <Typography variant="h6" component="div"  display="inline" className={classes.inActivePage}>Fiat</Typography>
                    </div>

                    <Grid container>
                        <Grid item md={6}>
                            <div className={classes.currencySelect} onClick={handleClick}>
                                {selectedCurrencyOption ? 
                                    (<>
                                        <img src={selectedCurrencyOption ? selectedCurrencyOption.iconUrl: ''} style={{ width: "25px", height: '25px', margin: "2px 5px" }}/>
                                        <Typography variant="h6" component="div" display="inline" style={{ marginRight: '8px' }}>
                                            { selectedCurrencyOption.currency.toUpperCase() }
                                        </Typography>
                                        <Typography variant="body2" component="div" display="inline" style={{ marginTop: '5px' }}>
                                            { selectedCurrencyOption.name }
                                        </Typography> 
                                    </>) :
                                    ""
                                }
                            </div>

                            <Popper
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                placement="bottom-start"
                                className={classes.popper}
                            >
                                <div className={classes.header}>Search Currency</div>
                                <Autocomplete
                                    open
                                    onClose={handleClose}
                                    disableCloseOnSelect={false}
                                    value={currencyOption}
                                    onChange={(event: any, selectedOption: WalletItemProps | null) => {
                                        setSelectedCurrencyOption(selectedOption);
                                    }}
                                    noOptionsText="No Records Found"
                                    renderOption={(option: WalletItemProps | null) => (
                                        <React.Fragment>
                                            <img src={option ? option.iconUrl: ''} style={{ width: "25px", height: '25px', margin: "2px 5px" }}/>
                                            <div>
                                                <Typography variant="h6" component="div" display="inline" style={{ marginRight: '8px' }}>
                                                    { option ? option.currency.toUpperCase(): '' }
                                                </Typography>
                                                <Typography variant="body2" component="div" display="inline" style={{ marginTop: '5px' }}>
                                                    { option ? option.name : '' }
                                                </Typography>
                                            </div>
                                        </React.Fragment>
                                    )}
                                    options={wallets}
                                    getOptionLabel={(option: WalletItemProps | null) => option ? option.name: ''}
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
                                <Typography variant="h6" component="div" display="inline" style={{ opacity: '0.6', marginRight: '8px' }}>Total balance:</Typography>
                                <Typography variant="h6" component="div" display="inline" style={{ marginRight: '4px' }}>{ selectedCurrencyOption ? selectedCurrencyOption.balance : '' }</Typography>
                                <Typography variant="h6" component="div" display="inline">{ selectedCurrencyOption ? selectedCurrencyOption.currency.toUpperCase() : '' }</Typography>
                            </Box>
                            <Paper elevation={0} className={classes.cryptoTips}>
                                <Typography variant="h6" component="div"><EmojiObjectsIcon /> Tips:</Typography>
                                <List component="ul" aria-label="contacts">
                                    <ListItem button>
                                        <ListItemIcon>
                                            <StarIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="If you have deposited, please pay attention to the text messages, site letters and emails we send to you." />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <StarIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Coins will be deposited after 1 network confirmations.." />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <StarIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Until 2 confirmations are made, an equivalent amount of your assets will be temporarily unavailable for withdrawals." />
                                    </ListItem>
                                   
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item md={1}></Grid>
                        <Grid item md={5}>
                            <Paper elevation={2} className={classes.networkPaper}>
                                <div className={classes.networkPaperHeader}>
                                    <Typography variant="body1" component="div" display="inline">
                                        Deposit network 
                                        <LightTooltip style={{ marginLeft: '4px' }} title="Please select the corresponding Binance Deposit address format according to the public chain type of the transferred wallet. Do note that some wallets may support multiple public chain types of token transfer, like exchange wallets generally support deposits from ERC20, OMNI, and TRC20 types of USDT. Make sure that the public chain network type selected at the time of transfer is the same the one for Binance Deposits." placement="right-start">
                                            <InfoOutlinedIcon />
                                        </LightTooltip>
                                    </Typography>
                                </div>
                                <div className={classes.networkPaperContent}>
                                    <Typography variant='body1' component='div'>
                                        BTC Address
                                    </Typography>
                                </div>
                            </Paper>
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

const DepositCryptoScreen = connect(mapStateToProps, mapDispatchToProps)(DepositWalletCrypto)

export { DepositCryptoScreen }


interface LabelType {
    name: string;
    color: string;
    description?: string;
  }
  
  // From https://github.com/abdonrd/github-labels
  const labels = [
    {
      name: 'good first issue',
      color: '#7057ff',
      description: 'Good for newcomers',
    },
    {
      name: 'help wanted',
      color: '#008672',
      description: 'Extra attention is needed',
    },
    {
      name: 'priority: critical',
      color: '#b60205',
      description: '',
    },
    {
      name: 'priority: high',
      color: '#d93f0b',
      description: '',
    },
    {
      name: 'priority: low',
      color: '#0e8a16',
      description: '',
    },
    {
      name: 'priority: medium',
      color: '#fbca04',
      description: '',
    },
    {
      name: "status: can't reproduce",
      color: '#fec1c1',
      description: '',
    },
    {
      name: 'status: confirmed',
      color: '#215cea',
      description: '',
    },
    {
      name: 'status: duplicate',
      color: '#cfd3d7',
      description: 'This issue or pull request already exists',
    },
    {
      name: 'status: needs information',
      color: '#fef2c0',
      description: '',
    },
    {
      name: 'status: wont do/fix',
      color: '#eeeeee',
      description: 'This will not be worked on',
    },
    {
      name: 'type: bug',
      color: '#d73a4a',
      description: "Something isn't working",
    },
    {
      name: 'type: discussion',
      color: '#d4c5f9',
      description: '',
    },
    {
      name: 'type: documentation',
      color: '#006b75',
      description: '',
    },
    {
      name: 'type: enhancement',
      color: '#84b6eb',
      description: '',
    },
    {
      name: 'type: epic',
      color: '#3e4b9e',
      description: 'A theme of work that contain sub-tasks',
    },
    {
      name: 'type: feature request',
      color: '#fbca04',
      description: 'New feature or request',
    },
    {
      name: 'type: question',
      color: '#d876e3',
      description: 'Further information is requested',
    },
  ];