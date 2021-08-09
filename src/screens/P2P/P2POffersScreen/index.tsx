import * as React from 'react';
import { fade, makeStyles, Theme, createStyles, withStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Select from 'react-select';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';
import { connect } from 'react-redux';
import { Withdraw, WithdrawProps } from '../../../containers';
import { PageHeader } from '../../../containers/PageHeader';
import { TotalAmount } from '../../../containers/Wallets/TotalAmount';
import { ModalWithdrawConfirmation } from '../../../containers/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from '../../../containers/ModalWithdrawSubmit';
import { WalletItemProps, CryptoIcon } from '../../../components';
import { globalStyle } from '../../materialUIGlobalStyle';

import { 
    selectUserInfo,
    RootState, 
    selectWallets, 
    selectWalletsLoading, 
    selectWithdrawProcessing,
    selectWithdrawSuccess, 
    User, 
    walletsData, 
    walletsFetch, 
    walletsWithdrawCcyFetch,
    MemberLevels,
    memberLevelsFetch,
    selectMemberLevels,
} from '../../../modules';
import { CommonError } from '../../../modules/types';
import { WalletHistory } from '../../../containers/Wallets/History';
import * as PublicDataAPI from '../../../apis/public_data';

import {
    useParams,
    useHistory
  } from "react-router-dom";

interface ReduxProps {
    user: User;
    wallets: WalletItemProps[];
    withdrawProcessing: boolean;
    withdrawSuccess: boolean;
    walletsLoading?: boolean;
    memberLevels?: MemberLevels;
}

interface DispatchProps {
    fetchWallets: typeof walletsFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    memberLevelsFetch: typeof memberLevelsFetch;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...globalStyle(theme),
    activePage: {
        color: '#000',
        marginRight: theme.spacing(2),
        cursor: 'pointer',
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        paddingBottom: '12px',
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
    activeCurrency: {
        color: theme.palette.secondary.main,
        marginRight: theme.spacing(2),
        cursor: 'pointer',
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        paddingBottom: '12px',
        '&:hover': {
            textDecoration: 'none',
            color: theme.palette.secondary.main,
        },
    },
    inActiveCurrency: {
        color: '#000',
        marginRight: theme.spacing(2),
        opacity: '0.6',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none',
            color: '#000',
        },
    },
    advertiserName: {
        marginBottom: '8px', color: theme.palette.secondary.main
    },
    sideGroup: {
        margin: '12px 0px 8px 8px', 
    },
    paramsFiltersRoot: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
            alignItems: 'flex-end',
        },
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    cryptoFiltersRoot: {
        display: "flex", 
        overflow: 'auto',
        whiteSpace: 'nowrap',
        [theme.breakpoints.up('md')]: {
            marginLeft: '24px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '8px',
            marginTop: '8px'
        },
    },
    filtersRoot: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
        },
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            margin: `${theme.spacing(2)}px 0px ${theme.spacing(2)}px 0px`,
        },
    },
    filtersDiv: {
        [theme.breakpoints.only('xl')]: {
            margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
            width: "15%",
        },
        [theme.breakpoints.only('lg')]: {
            margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
            width: "15%",
        },
        [theme.breakpoints.only('md')]: {
            width: '100%',
        },
        [theme.breakpoints.only('sm')]: {
            width: '100%',
        },
    },
    inputLabel: {
        fontWeight: 500,
        margin: `${theme.spacing(1)}px 0px`
    },
    amountSearchInput: {
        '& input[type=number]': {
            '-moz-appearance': 'textfield'
        },
        '& input[type=number]::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
        '& input[type=number]::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
    },
    amountSearchButton: {
        // backgroundColor: '#F5F5F5',
        color: theme.palette.secondary.main
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    selectDropdown: {
        display: 'flex',
        cursor: 'pointer',
        padding: `${theme.spacing(0.5)}px ${theme.spacing(0.5)}px`,
        borderRadius: '4px',
        backgroundColor: '#e0e0e0',
        [theme.breakpoints.only('sm')]: {
            width: 'auto',
        },
        [theme.breakpoints.only('xs')]: {
            width: 'auto',
        },
    },
    popper: {
        border: '1px solid rgba(27,31,35,.15)',
        boxShadow: '0 3px 12px rgba(27,31,35,.15)',
        borderRadius: 3,
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
    currencyCode: {
        margin: '0px 4px'
    },
    currencyName: {
        margin: '2px 1px'
    },
    selectDownArrow: {
        marginLeft: 'auto',
        marginRight: '0'
    },
    paymentMethodChip: {
        margin: `${theme.spacing(0.5)}px`,
        fontSize: '8px',
        height: theme.spacing(2)
        // color: theme.palette.secondary.main
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
  }),
);

const StyledTableCell = withStyles((theme: Theme) =>
createStyles({
    head: {
        backgroundColor: "rgb(228 224 224)",
        color: theme.palette.common.black,
        fontSize: 14,
    },
    body: {
        fontSize: 14,
    },
}),
)(TableCell); 

export interface AllFiatCurrency {
    symbol:         string;
    name:           string;
    symbol_native:  string;
    decimal_digits: number;
    rounding:       number;
    code:           string;
    name_plural:    string;
}

export interface PaymentMethod {
    value: number;
    label: string;
}

// const paymentMethods = [
//     { value: 1, label: 'Method 1' },
//     { value: 2, label: 'Method 2' },
//     { value: 3, label: 'Method 3' },
//   ];

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;
const P2POffersComponent = (props: Props) => {
    const defaultSide = 'buy';
    const defaultCurrency = 'USDT';
    //Props
    const classes = useStyles();

    
    //Params
    let params = useParams();
    let history = useHistory();
    let currency: string = params && params['currency'] ? params['currency'] : defaultCurrency;
    let sideName: string = params && params['side'] ? params['side'] : defaultSide;

    // States
    const [cryptoCurrenciesList, setCryptoCurrenciesList] = React.useState([
        'USDT', 'RSC', 'BTC', 'ETH'
    ]);
    const [sides, setSides] = React.useState([
        {'title': 'buy', 'selectedBGColor': '#02C076'},
        {'title': 'sell', 'selectedBGColor': 'rgb(248, 73, 96)'},
    ]);

    const [selectedCryptoCurrency, setSelectedCryptoCurrency] = React.useState<string>(currency);
    const [selectedSide, setSelectedSide] = React.useState(sideName);

    const [allFiatCurrencies, setAllFiatCurrencies] = React.useState<AllFiatCurrency[] | []>([]);
    const [selectedFiatCurrency, setSelectedFiatCurrency] = React.useState<AllFiatCurrency | null>();

    const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[] | []>([
        { value: 1, label: 'Method 1' },
        { value: 2, label: 'Method 2' },
        { value: 3, label: 'Method 3' },
    ]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<PaymentMethod | null>({ value: 1, label: 'Method 1' });

    const [paymentMethodAnchorEl, setPaymentMethodAnchorEl] = React.useState<null | HTMLElement>(null);
    const [fiatAnchorEl, setFiatAnchorEl] = React.useState<null | HTMLElement>(null);

    const [open, setOpen] = React.useState(false);

    //Use Effects
    React.useEffect(() => {
        history.push(`/p2p-trade/${selectedSide}`);
        history.push(`/p2p-trade/${selectedSide}/${selectedCryptoCurrency}`);
    }, []);

    React.useEffect(() => {
        if(!allFiatCurrencies.length) {
            getAllFiatCurrencies();
        } else {
            setSelectedFiatCurrency(allFiatCurrencies[0]);
        }
    }, [allFiatCurrencies]);
    //End Use Effects
    
    const handleSideChange = (event, newSide) => {
        if (newSide !== null) {
            setSelectedSide(newSide);
            history.push(`/p2p-trade/${newSide}/${selectedCryptoCurrency}`);
        }
    };

    const onCryptoCurrencyChange = (currency: string) => {
        setSelectedCryptoCurrency(currency);
        history.push(`/p2p-trade/${selectedSide}/${currency}`);
    };

    const getAllFiatCurrencies = () => {
        PublicDataAPI.getAllFiatCurrencies().then((responseData) => {
            setAllFiatCurrencies(responseData);
		});
	}

    const handlePaymentMethodSelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setPaymentMethodAnchorEl(event.currentTarget);
    };

    const handleFiatCurrencySelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setFiatAnchorEl(event.currentTarget);
    };

    const handlePaymentMethodSelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (paymentMethodAnchorEl) {
            paymentMethodAnchorEl.focus();
        }
        setPaymentMethodAnchorEl(null);
    };

    const handleFiatCurrencySelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (fiatAnchorEl) {
            fiatAnchorEl.focus();
        }
        setFiatAnchorEl(null);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const paymentMethodPopperOpen = Boolean(paymentMethodAnchorEl);
    const paymentMethodPopperId = paymentMethodPopperOpen ? 'payment_methods' : undefined;

    const fiatPopperOpen = Boolean(fiatAnchorEl);
    const fiatPopperId = fiatPopperOpen ? 'fiat-currencies' : undefined;

    const pageTitle = 'P2P Orders';

    const renderFiatCurrencyDrowdown = () => {

        return (
            <> 
                <div className={classes.selectDropdown} onClick={handleFiatCurrencySelectClick}>
                    {selectedFiatCurrency ?
                        (<>
                            <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                                {selectedFiatCurrency.code.toUpperCase()}
                            </Typography>
                            <div className={classes.selectDownArrow}>
                                <ArrowDropDownIcon />
                            </div>
                        </>) :
                        ""
                    }
                </div>
                <Popper
                    id={fiatPopperId}
                    open={fiatPopperOpen}
                    anchorEl={fiatAnchorEl}
                    placement="bottom-start"
                    className={classes.popper}
                >
                    <div className={classes.header}>
                        Select
                    </div>
                    <Autocomplete
                        open
                        onClose={handleFiatCurrencySelectClose}
                        disableCloseOnSelect={false}
                        value={selectedFiatCurrency}
                        onChange={(event: any, selectedOption: AllFiatCurrency | null) => {
                            setSelectedFiatCurrency(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption={(option: AllFiatCurrency) => {
                            return <React.Fragment>
                                <div style={{ display: 'flex' }}>
                                    <Chip label={option ? option.code.toUpperCase() : ''} className={classes.currencyCode} />
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        {option ? option.name : ''}
                                    </Typography>

                                </div>
                            </React.Fragment>
                        }}
                        options={allFiatCurrencies}
                        getOptionLabel={(option: AllFiatCurrency) => option ? option.name : ''}
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
            </>
        );
    }

    const renderPaymentMethodDrowdown = () => {

        return (
            <> 
                <div className={classes.selectDropdown} onClick={handlePaymentMethodSelectClick}>
                    {selectedPaymentMethod ?
                        (<>
                            <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                                {selectedPaymentMethod.label}
                            </Typography>
                            <div className={classes.selectDownArrow}>
                                <ArrowDropDownIcon />
                            </div>
                        </>) :
                        ""
                    }
                </div>
                <Popper
                    id={paymentMethodPopperId}
                    open={paymentMethodPopperOpen}
                    anchorEl={paymentMethodAnchorEl}
                    placement="bottom-start"
                    className={classes.popper}
                >
                    <div className={classes.header}>
                        Select
                    </div>
                    <Autocomplete
                        open
                        onClose={handlePaymentMethodSelectClose}
                        disableCloseOnSelect={false}
                        value={selectedPaymentMethod}
                        onChange={(event: any, selectedOption: PaymentMethod | null) => {
                            setSelectedPaymentMethod(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption={(option: PaymentMethod) => {
                            return <React.Fragment>
                                <div style={{ display: 'flex' }}>
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        {option ? option.label : ''}
                                    </Typography>

                                </div>
                            </React.Fragment>
                        }}
                        options={paymentMethods}
                        getOptionLabel={(option: PaymentMethod) => option ? option.label : ''}
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
            </>
        );
    }
    const renderOffers = () => {
        return (
            <>
                <TableContainer>
                    <Table aria-label="P2P orders table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Advertisers
                                </StyledTableCell>
                                <StyledTableCell>
                                    Price
                                </StyledTableCell>
                                <StyledTableCell>
                                    Limit/Available
                                </StyledTableCell>
                                <StyledTableCell>
                                    Payment
                                </StyledTableCell>
                                <StyledTableCell>
                                    Trade
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow hover>
                                <StyledTableCell>
                                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                                            <Link to="/advertiserDetail/1" style={{ textDecoration: 'none' }}>
                                                <span className={classes.advertiserName}>
                                                    Name here
                                                </span>
                                            </Link>
                                        <div style={{ display: 'flex', flexDirection: 'row'}}>
                                            <small style={{ color: 'grey' }}>804 Oders</small>
                                            <small style={{ marginLeft: '8px', color: 'grey' }}>98.89% completion</small>
                                        </div>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                        <span style={{ fontWeight: 600, }}>10</span>
                                        <span style={{ fontWeight: 400, fontSize: 10, marginLeft: '4px',  color: 'grey' }}>BTC</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                                        <div style={{ display: 'flex', flexDirection: 'row'}}>
                                            <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Available</span>
                                            <span style={{ fontWeight: 600,  marginLeft: '8px' }}>110,542.65 {selectedCryptoCurrency}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row'}}>
                                            <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Limit</span>
                                            <span style={{ fontWeight: 600,  marginLeft: '8px' }}>{selectedFiatCurrency ? selectedFiatCurrency.symbol_native: ''}60,000.00-{selectedFiatCurrency ? selectedFiatCurrency.symbol_native: ''}713,000.09</span>
                                        </div>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ width: '50%' }}>
                                        <Tooltip title="Payment Method1" arrow>
                                            <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                                        </Tooltip>
                                        <Tooltip title="Payment Method2" arrow>
                                            <Chip size="small" label="Payment Method2" className={classes.paymentMethodChip}/>
                                        </Tooltip>
                                        <Tooltip title="Payment Method3" arrow>
                                            <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                                        </Tooltip>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Button variant="contained" style={{ color: 'white', backgroundColor: selectedSide == 'buy' ? '#02C076' : 'rgb(248, 73, 96)', fontSize: 14 }} onClick={handleOpen}>{selectedSide}</Button>
                                </StyledTableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    }
    return (
        <>
            <PageHeader pageTitle={pageTitle} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={classes.pageContent} >
                    <div className={classes.pageContentHeader}>
                        <Link to="/" className={classes.activePage}>
                                <Typography variant="h6" component="div" display="inline" >
                                    P2P
                                </Typography>
                        </Link>
                        <Link to="/" className={classes.inActivePage}>
                            <Typography variant="h6" component="div"  display="inline">
                                Express
                            </Typography>
                        </Link>
                    </div>
                    <Paper elevation={1} className={classes.paramsFiltersRoot}>
                        <ToggleButtonGroup
                            size="small"
                            value={selectedSide}
                            exclusive
                            onChange={handleSideChange}
                            aria-label="text alignment"
                            className={classes.sideGroup}
                            
                        >
                            {sides.map((sideItem) => {
                                return <ToggleButton value={sideItem['title']} aria-label="buy side" style={{ fontWeight: 600, backgroundColor: selectedSide == sideItem['title'] ? sideItem['selectedBGColor'] : '#ffffff' , color: selectedSide == sideItem['title'] ? '#ffffff' : '#1E2026' }}>
                                    <span>
                                        {sideItem['title']}
                                    </span> 
                                </ToggleButton>
                            })}
                        </ToggleButtonGroup>

                        <div className={classes.cryptoFiltersRoot}>
                            <div className={ selectedCryptoCurrency == 'USDT' ? classes.activeCurrency : classes.inActiveCurrency} onClick={e => onCryptoCurrencyChange('USDT')}>
                                <span>
                                    USDT
                                </span> 
                            </div>
                            <div className={selectedCryptoCurrency == 'BTC' ? classes.activeCurrency : classes.inActiveCurrency} onClick={e => onCryptoCurrencyChange('BTC')}>
                                <span>
                                    BTC
                                </span> 
                            </div>
                            <div className={selectedCryptoCurrency == 'RSC' ? classes.activeCurrency : classes.inActiveCurrency} onClick={e => onCryptoCurrencyChange('RSC')}>
                                <span>
                                    RSC
                                </span> 
                            </div>
                            <div className={selectedCryptoCurrency == 'ETH' ? classes.activeCurrency : classes.inActiveCurrency} onClick={e => onCryptoCurrencyChange('ETH')}>
                                <span>
                                    ETH
                                </span> 
                            </div>
                        </div>
                    </Paper>
                    <Box className={classes.filtersRoot}>
                        <div className={classes.filtersDiv}>
                            <InputLabel htmlFor="fiat_currency" className={classes.inputLabel}>
                                Amount
                            </InputLabel>
                            <div style={{ display: 'flex' }}>
                                <TextField
                                    type="number"
                                    className={classes.amountSearchInput}
                                    placeholder='Search'
                                    name="search"
                                    autoComplete='off'
                                    // value={searchedValue}
                                    // onChange={this.handleInputSearchChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                                                    {selectedFiatCurrency ? selectedFiatCurrency.code.toUpperCase() : ''}
                                                </Typography>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button variant="contained" size="small" disableElevation className={classes.amountSearchButton}>Search</Button>
                            </div>
                        </div>
                        <div className={classes.filtersDiv}>
                            <InputLabel htmlFor="fiat_currency" className={classes.inputLabel}>
                                Fiat
                            </InputLabel>
                            {renderFiatCurrencyDrowdown()}
                        </div>
                        {/* <div className={classes.filtersDiv}>
                            <Button variant="outlined" color="secondary" size="small">
                                Search
                            </Button>
                        </div> */}
                        <div className={classes.filtersDiv}>
                            <InputLabel htmlFor="fiat_currency" className={classes.inputLabel}>
                                Payment
                            </InputLabel>
                            {renderPaymentMethodDrowdown()}
                        </div>
                        
                    </Box>
                    {renderOffers()}

                    {/* <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        fullWidth={true}
                        maxWidth="md"
                    >
                        <div style={{ padding: '16px', height: '350px' }}>
                            <div style={{ width: '100%' }}>
                                <div style={{ width: '59%' }}>
                                    <div id="transition-modal-title">
                                        <Typography className={classes.advertiserName} variant="body1" display="inline" style={{ marginRight: '8px' }}>Advertiser Name</Typography>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>105 orders</Typography>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>100.00% completion</Typography>
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-between' }}>
                                        <div style={{ width: '48%' }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Price</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px', color: '#02C076' }}>167.00 PKR</Typography>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>16 s</Typography>
                                        </div>
                                        <div style={{ width: '48%' }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Available</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>465.54 USDT</Typography>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-between' }}>
                                        <div style={{ width: '48%' }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Payment Time Limit</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>15 Minutes</Typography>
                                        </div>
                                        <div style={{ display: 'flex', width: '48%' }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Seller’s payment method</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>
                                            <div style={{ width: '50%' }}>
                                                <Tooltip title="Payment Method1" arrow>
                                                    <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                                <Tooltip title="Payment Method2" arrow>
                                                    <Chip size="small" label="Payment Method2" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                                <Tooltip title="Payment Method3" arrow>
                                                    <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                            </div>
                                            </Typography>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '24px', width: '48%' }}>
                                        <Typography variant="h6" display="inline">Terms and conditions</Typography>
                                        <div style={{ marginTop: '8px' }}>
                                            <Typography variant="body1" display="inline" paragraph={true} style={{color: 'rgb(112, 122, 138)'}}>
                                                You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.
                                                You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.
                                                You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.
                                                You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.
                                                You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.
                                                You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.
                                                You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.
                                                You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.
                                                You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.
                                                You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.
                                                You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                                <Divider orientation="vertical" />
                                <div style={{ width: '40%' }}></div>
                            </div>
                        </div>
                    </Dialog> */}
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                        timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                        <Paper style={{ padding: '16px', height: '350px', width: '50%' }}>
                            <div style={{ width: '100%' }}>
                                <div style={{ width: '59%', overflowY: 'auto', height: '350px' }}>
                                    <div id="transition-modal-title">
                                        <Typography className={classes.advertiserName} variant="body1" display="inline" style={{ marginRight: '8px' }}>Advertiser Name</Typography>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>105 orders</Typography>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>100.00% completion</Typography>
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-between' }}>
                                        <div style={{ width: '48%' }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Price</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px', color: '#02C076' }}>167.00 PKR</Typography>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>16 s</Typography>
                                        </div>
                                        <div style={{ width: '48%' }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Available</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>465.54 USDT</Typography>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-between' }}>
                                        <div style={{ width: '48%' }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Payment Time Limit</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>15 Minutes</Typography>
                                        </div>
                                        <div style={{ display: 'flex', width: '48%' }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Seller’s payment method</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>
                                            <div style={{ width: '50%' }}>
                                                <Tooltip title="Payment Method1" arrow>
                                                    <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                                <Tooltip title="Payment Method2" arrow>
                                                    <Chip size="small" label="Payment Method2" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                                <Tooltip title="Payment Method3" arrow>
                                                    <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                            </div>
                                            </Typography>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '24px', width: '80%' }}>
                                        <Typography variant="h6" display="inline">Terms and conditions</Typography>
                                        <div style={{ marginTop: '8px' }}>
                                            <Typography variant="body1" display="inline" paragraph={true} style={{color: 'rgb(112, 122, 138)'}}>
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.I'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                                <Divider orientation="vertical" />
                                <div style={{ width: '40%' }}></div>
                            </div>
                        </Paper>
                        </Fade>
                    </Modal>
                </Paper>
            </Box>
        </>
    );
    
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    walletsLoading: selectWalletsLoading(state),
    withdrawProcessing: selectWithdrawProcessing(state),
    withdrawSuccess: selectWithdrawSuccess(state),
    memberLevels: selectMemberLevels(state),
});
const mapDispatchToProps = dispatch => ({
    fetchWallets: () => dispatch(walletsFetch()),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    memberLevelsFetch: () => dispatch(memberLevelsFetch()),
});

export const P2POffersScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(P2POffersComponent))