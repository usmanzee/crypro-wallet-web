import * as React from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
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
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import clsx from  'clsx';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PlayCircleOutlineRoundedIcon from '@material-ui/icons/PlayCircleOutlineRounded';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';
import { PageHeader } from '../../../containers/PageHeader';
import { StyledTableCell } from '../../materialUIGlobalStyle';
import { useStyles } from './style';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useDispatch, useSelector } from 'react-redux';

import {
    // useDocumentTitle,
    useP2PCurrenciesFetch,
    useP2PPaymentMethodsFetch,
    useUserPaymentMethodsFetch,
} from '../../../hooks';

import { 
    Offer,
    P2POrderCreate,
    p2pOrdersCreateFetch,
    selectP2PCreatedOrder,
    selectP2PCreateOrderSuccess,
    selectP2PCurrenciesData,
    selectP2PPaymentMethodsData,
} from '../../../modules';

import { CommonError } from '../../../modules/types';
import { WalletHistory } from '../../../containers/Wallets/History';
import * as PublicDataAPI from '../../../apis/public_data';

import {
    useParams,
    useHistory
} from "react-router-dom";

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

type Props = RouterProps & InjectedIntlProps;
const P2POffersComponent = (props: Props) => {
    const defaultSide = 'buy';
    const defaultCurrency = 'USDT';
    //Props
    const classes = useStyles();
    
    //Params
    let params = useParams();
    //History
    let history = useHistory();
    let currency: string = params && params['currency'] ? params['currency'] : defaultCurrency;
    let sideName: string = params && params['side'] ? params['side'] : defaultSide;

    const theme = useTheme();
    const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // States

    const [moreMenuAnchorEl, setMoreMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const [cryptoCurrenciesList, setCryptoCurrenciesList] = React.useState();
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

    const dispatch = useDispatch();
    const currencies = useSelector(selectP2PCurrenciesData);
    const allPaymentMethods = useSelector(selectP2PPaymentMethodsData);

    useP2PCurrenciesFetch();
    useP2PPaymentMethodsFetch();
    useUserPaymentMethodsFetch();

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

    React.useEffect(() => {
        if (currencies.length) {
            const cryptoCurrencies = currencies.filter(i => i.type === 'coin').map(i => i.id.toUpperCase());
            if (cryptoCurrencies.length) {
                // setFiatCurrency(fiatCurrencies[0]);
            }
        }
    }, [currencies]);
    //End Use Effects

    const handleMoreMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setMoreMenuAnchorEl(event.currentTarget);
    };
    
    const handleMoreMenuClose = () => {
        setMoreMenuAnchorEl(null);
    };
    
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

    const setMaxWithdrawlAmount = () => {
        
    }

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
    const renderMobileOffers = () => {
        return (
            <>
                 <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <Link to="/advertiserDetail/1" style={{ textDecoration: 'none' }}>
                        <span className={classes.advertiserName}>
                            Name here
                        </span>
                    </Link>
                <div style={{ display: 'flex',}}>
                    <small style={{ color: 'grey' }}>804 Oders</small>
                    <small style={{ marginLeft: '8px', color: 'grey' }}>98.89% completion</small>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <div>
                        <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Price</span>
                        <div style={{ display: 'flex', marginRight: '8px' }}>
                            <span style={{ fontWeight: 600, fontSize: '20px' }}>10</span>
                            <span style={{ fontWeight: 400, fontSize: 10, marginLeft: '4px',  color: 'grey' }}>BTC</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Available</span>
                        <div style={{ display: 'flex', marginRight: '8px'}}>
                            <span style={{ fontWeight: 600,  marginLeft: '8px' }}>110,542.65 {selectedCryptoCurrency}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Limit</span>
                        <div style={{ display: 'flex', marginRight: '8px'}}>
                            <span style={{ fontWeight: 600,  marginLeft: '8px' }}>{selectedFiatCurrency ? selectedFiatCurrency.symbol_native: ''}60,000.00-{selectedFiatCurrency ? selectedFiatCurrency.symbol_native: ''}713,000.09</span>
                        </div>
                    </div>
                </div>
                <Button variant="contained" style={{ color: 'white', backgroundColor: selectedSide == 'buy' ? '#02C076' : 'rgb(248, 73, 96)', fontSize: 14, margin: 'auto 0px' }} onClick={handleOpen}>{selectedSide}</Button>
            </div>
            <div style={{ display: 'flex', marginTop: '8px', flexWrap: 'wrap' }}>
                <Tooltip title="Payment Method1" arrow>
                    <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                </Tooltip>
                <Tooltip title="Payment Method2" arrow>
                    <Chip size="small" label="Payment Method2" className={classes.paymentMethodChip}/>
                </Tooltip>
                <Tooltip title="Payment Method3" arrow>
                    <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                </Tooltip>
                <Tooltip title="Payment Method3" arrow>
                    <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                </Tooltip>
                <Tooltip title="Payment Method3" arrow>
                    <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                </Tooltip>
                <Tooltip title="Payment Method3" arrow>
                    <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                </Tooltip>
            </div>
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

    const advertisementDetailDialog = () => {
        return (
            <>
                <Dialog
                    fullWidth={true}
                    maxWidth='md'
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Buy USDT</Typography>
                            <CloseIcon onClick={e => handleClose()} style={{ cursor: 'pointer', }}/>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <Box style={{ height: '450px',}}>
                            <div style={{ display: 'flex' ,width: '100%' }}>
                                <div style={{ width: '55%', overflowY: 'auto', height: '440px', paddingRight: '16px' }}>
                                    <div id="transition-modal-title">
                                        <Typography className={classes.advertiserName} variant="body1" display="inline" style={{ marginRight: '8px' }}>Advertiser Name</Typography>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>105 orders</Typography>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>100.00% completion</Typography>
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '12px', justifyContent: 'space-between' }}>
                                        <div style={{  }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Price</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px', color: '#02C076' }}>167.00 PKR</Typography>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>16 s</Typography>
                                        </div>
                                        <div style={{  }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Available</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>465.54 USDT</Typography>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '12px', justifyContent: 'space-between' }}>
                                        <div style={{  }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Payment Time Limit</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>15 Minutes</Typography>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '12px'}}>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Seller’s payment method</Typography>
                                        <div>
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
                                    </div>
                                    <div style={{ marginTop: '12px' }}>
                                        <Typography variant="h6" display="inline">Terms and conditions</Typography>
                                        <div style={{ marginTop: '8px' }}>
                                            <Typography variant="body1" display="inline" paragraph={true} style={{color: 'rgb(112, 122, 138)', whiteSpace: 'pre-line'}}>
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                                {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '45%', paddingLeft: '16px' }}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                            I want to pay
                                        </InputLabel>
                                        <FormControl variant="outlined" fullWidth>
                                            <TextField
                                                className={classes.numberInput}
                                                id="outlined-full-width"
                                                // style={{ margin: 8 }}
                                                placeholder="Placeholder"
                                                fullWidth
                                                // margin="normal"
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">
                                                        <span className={classes.maxButton} onClick={setMaxWithdrawlAmount}>
                                                            <FormattedMessage id={'page.body.swap.input.tag.max'} />
                                                        </span>
                                                        <Divider className={classes.inputAdornmentDivider} orientation="vertical" style={{ margin: '0px 8px' }} />
                                                        <Typography variant="button" display="inline" style={{ color: 'rgb(112, 122, 138)' }}>PKR</Typography>
                                                    </InputAdornment>,
                                                }}
                                            />
                                        </FormControl>
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                            I will receive
                                        </InputLabel>
                                        <TextField
                                            className={classes.numberInput}
                                            id="outlined-full-width"
                                            // style={{ margin: 8 }}
                                            placeholder="Placeholder"
                                            fullWidth
                                            // margin="normal"
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">
                                                    <Typography variant="button" display="inline" style={{ color: 'rgb(112, 122, 138)' }}>USDT</Typography>
                                                </InputAdornment>,
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', marginBottom: '16px' }}>
                                        <Button
                                            style={{ width: '40%', marginRight: '8px' }}
                                            color="primary"
                                            variant="outlined"
                                            fullWidth
                                            onClick={handleClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            fullWidth
                                            // onClick={handleFromSubmit}
                                            // disabled={isValidForm()}
                                        >
                                            Buy USDT
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    const mobileAdvertisementDetailDialog = () => {
        return (
            <>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Buy USDT</Typography>
                            <CloseIcon onClick={e => handleClose()} style={{ cursor: 'pointer', }}/>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <Box>
                            <div style={{ width: '100%' }}>
                                <div style={{}}>
                                    <Typography className={classes.advertiserName} variant="body1" display="inline" style={{ marginRight: '8px' }}>Advertiser Name</Typography>
                                    <div id="transition-modal-title">
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>105 orders</Typography>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>100.00% completion</Typography>
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '8px',}}>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Price</Typography>
                                        <Typography variant="button" display="inline" style={{ marginRight: '8px', color: '#02C076' }}>167.00 PKR</Typography>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>16 s</Typography>
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-between'}}>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Available</Typography>
                                        <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>465.54 USDT</Typography>
                                    </div>
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                            I want to pay
                                        </InputLabel>
                                        <FormControl variant="outlined" fullWidth>
                                            <TextField
                                                className={classes.numberInput}
                                                id="outlined-full-width"
                                                // style={{ margin: 8 }}
                                                placeholder="Placeholder"
                                                fullWidth
                                                // margin="normal"
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">
                                                        <span className={classes.maxButton} onClick={setMaxWithdrawlAmount}>
                                                            <FormattedMessage id={'page.body.swap.input.tag.max'} />
                                                        </span>
                                                        <Divider className={classes.inputAdornmentDivider} orientation="vertical" style={{ margin: '0px 8px' }} />
                                                        <Typography variant="button" display="inline" style={{ color: 'rgb(112, 122, 138)' }}>PKR</Typography>
                                                    </InputAdornment>,
                                                }}
                                            />
                                        </FormControl>
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                            I will receive
                                        </InputLabel>
                                        <TextField
                                            className={classes.numberInput}
                                            id="outlined-full-width"
                                            // style={{ margin: 8 }}
                                            placeholder="Placeholder"
                                            fullWidth
                                            // margin="normal"
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">
                                                    <Typography variant="button" display="inline" style={{ color: 'rgb(112, 122, 138)' }}>USDT</Typography>
                                                </InputAdornment>,
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', marginBottom: '16px' }}>
                                        <Button
                                            style={{ width: '40%', marginRight: '8px' }}
                                            color="primary"
                                            variant="outlined"
                                            fullWidth
                                            onClick={handleClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            fullWidth
                                            // onClick={handleFromSubmit}
                                            // disabled={isValidForm()}
                                        >
                                            Buy USDT
                                        </Button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Payment Time Limit</Typography>
                                    <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>15 Minutes</Typography>
                                </div>
                                <div style={{ marginTop: '8px'}}>
                                    <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Seller’s payment method</Typography>
                                    <div>
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
                                </div>
                                <div style={{ marginTop: '8px' }}>
                                    <Typography variant="h6" display="inline">Terms and conditions</Typography>
                                    <div style={{ marginTop: '8px' }}>
                                        <Typography variant="body1" display="inline" paragraph={true} style={{color: 'rgb(112, 122, 138)', whiteSpace: 'pre-line'}}>
                                            {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                            {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                            {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                            {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                            {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                            {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                            {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                            {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                            {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                            {`You can contact on +923358613060 for good rates with no minimum limit.Face to Face deal also available.\n\nI'm online.Please pay first and then upload the screenshot here.\n\n\n`}                                                
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </DialogContent>
                </Dialog>
            </>
        );
    }
    return (
        <>
            <PageHeader pageTitle={pageTitle} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={classes.pageContent} >
                    <div className={classes.tabsHeader}>
                        <div>
                            <Link to="/p2p-trade" className={classes.activePage}>
                                    <Typography variant="h6" component="div" display="inline">
                                        P2P
                                    </Typography>
                            </Link>
                            <Link to="/quick-trade" className={classes.inActivePage}>
                                <Typography variant="h6" component="div"  display="inline">
                                    Express
                                </Typography>   
                            </Link>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Link to="/" className={classes.videoLink}>
                                <PlayCircleOutlineRoundedIcon style={{ marginBottom: '4px', marginRight: '4px' }}/>
                                <Typography variant="h6" component="div"  display="inline" style={{ fontSize: '14px' }}>
                                    Video Tutorial
                                </Typography>   
                            </Link>
                            <Link to="/" className={classes.moreLink}>
                                <ReceiptIcon style={{ marginBottom: '4px', marginRight: '4px' }}/>
                                <Typography variant="h6" component="div"  display="inline" style={{ fontSize: '14px' }}>
                                    Orders
                                </Typography>   
                            </Link>
                            <div className={classes.moreLink} onClick={e => handleMoreMenuClick(e)}>
                                <MoreVertIcon style={{ marginBottom: '4px' }}/>
                                <Typography variant="h6" component="div"  display="inline" style={{ fontSize: '14px' }}>
                                    More
                                </Typography>   
                            </div>
                            <Menu
                                id="more-menu"
                                anchorEl={moreMenuAnchorEl}
                                keepMounted
                                open={Boolean(moreMenuAnchorEl)}
                                onClose={handleMoreMenuClose}
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                transformOrigin={{ vertical: "top", horizontal: "center" }}
                            >
                                <MenuItem onClick={handleMoreMenuClose}>Paymant Settings</MenuItem>
                                <MenuItem onClick={handleMoreMenuClose}>Post new Ad</MenuItem>
                                <MenuItem onClick={handleMoreMenuClose}>My Ads</MenuItem>
                                <MenuItem onClick={handleMoreMenuClose}>Become a Merchant</MenuItem>
                                <MenuItem onClick={handleMoreMenuClose} className={classes.mobileVideoLink}>Video Tutorial</MenuItem>
                                <MenuItem onClick={handleMoreMenuClose}>P2P Trading FAQ</MenuItem>
                            </Menu>
                        </div>
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
                                    className={clsx(classes.numberInput, classes.searchAmountInput)}
                                    placeholder='Enter Amount'
                                    name="search"
                                    autoComplete='off'
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    // value={searchedValue}
                                    // onChange={this.handleInputSearchChange}
                                    InputProps={{
                                        classes: {
                                            root: classes.searchAmountInput,
                                        },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography variant="subtitle1" component="div">
                                                    {selectedFiatCurrency ? selectedFiatCurrency.code.toUpperCase() : ''}
                                                </Typography>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button variant="outlined" color="secondary" size="small" disableElevation className={classes.amountSearchButton}>Search</Button>
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
                    <div className={classes.renderp2pOffers}>
                        {renderOffers()}
                    </div>
                    <div className={classes.renderMobileP2pOffers}>
                        {renderMobileOffers()}
                    </div>
                    {isMobileScreen ? mobileAdvertisementDetailDialog() : advertisementDetailDialog()}
                </Paper>
                <Paper style={{ marginTop: '16px', padding: '16px', backgroundColor: '#FAFAFA' }}>
                    <Typography variant="h4" style={{ margin: '16px 0px', fontWeight: 700 }}>Advantages of P2P Exchange</Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ flexDirection: 'column', width: '23%' }}>
                            <Typography variant="h6" style={{ margin: '16px 0px', fontWeight: 700 }}>Low cost transaction fees</Typography>
                            <Typography variant="body2" style={{ margin: '16px 0px', whiteSpace: 'pre-line', }}>{`As P2P exchange is a simple platform, the overhead costs are negligible for buyers and sellers.\n\nOn Binance P2P, takers are charged zero trading fees, while makers are charged a small amount of transaction fees upon every completed order. We pledge to apply the lowest P2P transaction fees in all markets.`}</Typography>
                        </div>
                        <div style={{ flexDirection: 'column', width: '23%' }}>
                            <Typography variant="h6" style={{ margin: '16px 0px', fontWeight: 700 }}>Flexible payment methods</Typography>
                            <Typography variant="body2" style={{ margin: '16px 0px', whiteSpace: 'pre-line', }}>{`As P2P exchange is a simple platform, the overhead costs are negligible for buyers and sellers.\n\nOn Binance P2P, takers are charged zero trading fees, while makers are charged a small amount of transaction fees upon every completed order. We pledge to apply the lowest P2P transaction fees in all markets.`}</Typography>
                        </div>
                        <div style={{ flexDirection: 'column', width: '23%' }}>
                            <Typography variant="h6" style={{ margin: '16px 0px', fontWeight: 700 }}>Trade at your preferred prices</Typography>
                            <Typography variant="body2" style={{ margin: '16px 0px', whiteSpace: 'pre-line', }}>{`As P2P exchange is a simple platform, the overhead costs are negligible for buyers and sellers.\n\nOn Binance P2P, takers are charged zero trading fees, while makers are charged a small amount of transaction fees upon every completed order. We pledge to apply the lowest P2P transaction fees in all markets.`}</Typography>
                        </div>
                        <div style={{ flexDirection: 'column', width: '23%' }}>
                            <Typography variant="h6" style={{ margin: '16px 0px', fontWeight: 700 }}>Protection for your privacy</Typography>
                            <Typography variant="body2" style={{ margin: '16px 0px', whiteSpace: 'pre-line', }}>{`As P2P exchange is a simple platform, the overhead costs are negligible for buyers and sellers.\n\nOn Binance P2P, takers are charged zero trading fees, while makers are charged a small amount of transaction fees upon every completed order. We pledge to apply the lowest P2P transaction fees in all markets.`}</Typography>
                        </div>
                    </div>
                </Paper>
            </Box>
        </>
    );    
}

export const P2POffersScreen = P2POffersComponent;