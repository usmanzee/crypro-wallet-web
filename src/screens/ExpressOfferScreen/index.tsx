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
import { PageHeader } from '../../containers/PageHeader';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';
import { StyledTableCell } from '../materialUIGlobalStyle';
import { useStyles } from './style';

import { useDispatch, useSelector } from 'react-redux';

import {
    // useDocumentTitle,
    useP2PCurrenciesFetch,
    useP2PPaymentMethodsFetch,
    useUserPaymentMethodsFetch,
} from '../../hooks';

import { 
    Offer,
    P2POrderCreate,
    p2pOrdersCreateFetch,
    selectP2PCreatedOrder,
    selectP2PCreateOrderSuccess,
    selectP2PCurrenciesData,
    selectP2PPaymentMethodsData,
} from '../../modules';

import { CommonError } from '../../modules/types';
import { WalletHistory } from '../../containers/Wallets/History';
import * as PublicDataAPI from '../../apis/public_data';

import {
    useParams,
    useHistory
} from "react-router-dom";

export interface ExpressAllFiatCurrency {
    symbol:         string;
    name:           string;
    symbol_native:  string;
    decimal_digits: number;
    rounding:       number;
    code:           string;
    name_plural:    string;
}

export interface ExpressPaymentMethod {
    value: number;
    label: string;
}

type Props = RouterProps & InjectedIntlProps;
const ExpressOfferComponent = (props: Props) => {
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

    // States
    const [cryptoCurrenciesList, setCryptoCurrenciesList] = React.useState();
    const [sides, setSides] = React.useState([
        {'title': 'buy', 'selectedBGColor': '#02C076'},
        {'title': 'sell', 'selectedBGColor': 'rgb(248, 73, 96)'},
    ]);

    const [selectedCryptoCurrency, setSelectedCryptoCurrency] = React.useState<string>(currency);
    const [selectedSide, setSelectedSide] = React.useState(sideName);

    const [allFiatCurrencies, setAllFiatCurrencies] = React.useState<ExpressAllFiatCurrency[] | []>([]);
    const [selectedFiatCurrency, setSelectedFiatCurrency] = React.useState<ExpressAllFiatCurrency | null>();

    const [paymentMethods, setPaymentMethods] = React.useState<ExpressPaymentMethod[] | []>([
        { value: 1, label: 'Method 1' },
        { value: 2, label: 'Method 2' },
        { value: 3, label: 'Method 3' },
    ]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<ExpressPaymentMethod | null>({ value: 1, label: 'Method 1' });

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
    // React.useEffect(() => {
    //     history.push(`/quick-trade/${selectedSide}`);
    //     history.push(`/quick-trade/${selectedSide}/${selectedCryptoCurrency}`);
    // }, []);

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
    
    const handleSideChange = (newSide) => {
        if (newSide !== null && selectedSide != newSide) {
            setSelectedSide(newSide);
            // history.push(`/quick-trade/${newSide}/${selectedCryptoCurrency}`);
        }
    };

    const onCryptoCurrencyChange = (currency: string) => {
        setSelectedCryptoCurrency(currency);
        // history.push(`/quick-trade/${selectedSide}/${currency}`);
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

    const pageTitle = 'Quick Order';

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
                        onChange={(event: any, selectedOption: ExpressAllFiatCurrency | null) => {
                            setSelectedFiatCurrency(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption={(option: ExpressAllFiatCurrency) => {
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
                        getOptionLabel={(option: ExpressAllFiatCurrency) => option ? option.name : ''}
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
                        onChange={(event: any, selectedOption: ExpressPaymentMethod | null) => {
                            setSelectedPaymentMethod(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption={(option: ExpressPaymentMethod) => {
                            return <React.Fragment>
                                <div style={{ display: 'flex' }}>
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        {option ? option.label : ''}
                                    </Typography>

                                </div>
                            </React.Fragment>
                        }}
                        options={paymentMethods}
                        getOptionLabel={(option: ExpressPaymentMethod) => option ? option.label : ''}
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
    
    return (
        <>
            <PageHeader pageTitle={pageTitle} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={classes.pageContent} >
                    <div className={classes.pageContentHeader}>
                        <Link to="/p2p/offers" className={classes.inActivePage}>
                                <Typography variant="h6" component="div" display="inline" >
                                    P2P
                                </Typography>
                        </Link>
                        <Link to="/p2p/quick-trade" className={classes.activePage}>
                            <Typography variant="h6" component="div"  display="inline">
                                Express
                            </Typography>
                        </Link>
                    </div>
                    <div className={classes.expressForm}>
                        <div className={classes.sidesDiv}>
                            {sides.map((sideItem) => {
                                return <div className={selectedSide == sideItem['title'] ? classes.activeSide : classes.inActiveSide} onClick={e => handleSideChange(sideItem['title'])}>{sideItem['title'].toUpperCase()}</div>
                            })}
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                I want to pay
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth>
                                <TextField
                                    className={classes.numberInput}
                                    id="outlined-full-width"
                                    placeholder="Placeholder"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">
                                            <span className={classes.maxButton} onClick={setMaxWithdrawlAmount}>
                                                <FormattedMessage id={'page.body.swap.input.tag.max'} />
                                            </span>
                                            <Divider className={classes.inputAdornmentDivider} orientation="vertical" style={{ margin: '0px 8px' }} />
                                            {renderFiatCurrencyDrowdown()}
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
                                placeholder="Placeholder"
                                fullWidth
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
                </Paper>
            </Box>
        </>
    );    
}

export const ExpressOfferScreen = ExpressOfferComponent;