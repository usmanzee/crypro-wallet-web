import * as React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { 
    Box, 
    Paper,
    Typography,
    Popper,
    InputBase,
    Divider,
    Button,
    Chip,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    InputLabel,
    TextField,
    InputAdornment,
    FormControl,
    Menu,
    MenuItem,
    Dialog,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    CircularProgress,
    TablePagination
} from '@material-ui/core';

import { DEFAULT_CCY_PRECISION, DEFAULT_TABLE_PAGE_LIMIT } from '../../../constants';

import ReceiptIcon from '@material-ui/icons/Receipt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PlayCircleOutlineRoundedIcon from '@material-ui/icons/PlayCircleOutlineRounded';
import CloseIcon from '@material-ui/icons/Close';

import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Skeleton from '@material-ui/lab/Skeleton';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import clsx from  'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';

//Local imports
import { PageHeader } from '../../../containers/PageHeader';
import { P2PVideoTutorialDialog } from '../../../components/P2P/P2PVideoTutorialDialog';
import { P2PLinks } from '../../../components/P2P/P2PLinks';
import { P2POffers } from '../../../components/P2P/P2POffers';
import { StyledTableCell } from '../../materialUIGlobalStyle';
import { useStyles } from './style';
import { setDocumentTitle } from '../../../helpers';

import { 
    selectUserLoggedIn, 
    Currency,
    FiatCurrency,
    selectCurrenciesLoading,
    selectCurrencies,
    currenciesFetch,
    selectFiatCurrenciesLoading,
    selectFiatCurrencies,
    fiatCurrenciesFetch,
    Offer,
    selectP2POffersFetchLoading,
    selectP2POffers,
    offersFetch,
    selectP2PPaymentMethodsData,
    PaymentMethod,
    selectP2PPaymentMethodsLoading,
    p2pPaymentMethodsFetch,
    selectP2PWalletsLoading,
    selectP2PsWallets,
    p2pWalletsFetch,
} from '../../../modules';

import { CommonError } from '../../../modules/types';
import { WalletHistory } from '../../../containers/Wallets/History';
import * as PublicDataAPI from '../../../apis/public_data';

import {
    useParams,
    useHistory
} from "react-router-dom";

type Props = RouterProps & InjectedIntlProps;
const P2POffersComponent = (props: Props) => {
    const defaultSide = 'buy';
    const defaultCurrency = 'btc';
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

    const [sides, setSides] = React.useState([
        {'title': 'buy', 'selectedBGColor': '#02C076'},
        {'title': 'sell', 'selectedBGColor': 'rgb(248, 73, 96)'},
    ]);
    const [selectedSide, setSelectedSide] = React.useState(sideName);
    const [cryptoCurrencies, setCryptoCurrencies] = React.useState<Currency[]>([]);
    const [loadingCryptoCurrencies, setLoadingCryptoCurrencies] = React.useState<boolean>(true);
    const [selectedCryptoCurrency, setSelectedCryptoCurrency] = React.useState<Currency>(null);

    const [selectedFiatCurrency, setSelectedFiatCurrency] = React.useState<FiatCurrency>(null);

    const [selectedP2PPaymentMethod, setSelectedP2PPaymentMethod] = React.useState<PaymentMethod>(null);

    const [paymentMethodAnchorEl, setPaymentMethodAnchorEl] = React.useState<null | HTMLElement>(null);
    const [fiatAnchorEl, setFiatAnchorEl] = React.useState<null | HTMLElement>(null);
    const [videoTutorialDialogOpen, setVideoTutorialDialogOpen] = React.useState(false);

    const [tablePage, setTablePage] = React.useState(0);
    const [tableRowsPerPage, setTableRowsPerPage] = React.useState(25);

    const dispatch = useDispatch();
    const loggedIn = useSelector(selectUserLoggedIn);
    const currencies = useSelector(selectCurrencies);
    const currenciesLoading = useSelector(selectCurrenciesLoading);
    const fiatCurrencies = useSelector(selectFiatCurrencies);
    const fiatCurrenciesLoading = useSelector(selectFiatCurrenciesLoading);
    const p2pPaymentMethodsLoading = useSelector(selectP2PPaymentMethodsLoading);
    const p2pPaymentMethods = useSelector(selectP2PPaymentMethodsData);
    const p2pOffersLoading = useSelector(selectP2POffersFetchLoading);
    const p2pOffers = useSelector(selectP2POffers);

    const P2PWallets = useSelector(selectP2PsWallets);
    const P2PWalletsLoading = useSelector(selectP2PWalletsLoading);

    React.useEffect(() => {
        setDocumentTitle('Buy and Sell Crypto on P2P');
    }, []);

    React.useEffect(() => {
        if(!currencies.length) {
            dispatch(currenciesFetch());
        } else {
            filterCryptoCurrencies();
        }
    }, [currencies]);

    React.useEffect(() => {
        if(!fiatCurrencies.length) {
            dispatch(fiatCurrenciesFetch());
        } else {
            setSelectedFiatCurrency(fiatCurrencies[0]);
        }
    }, [fiatCurrencies]);

    React.useEffect(() => {
        if(cryptoCurrencies.length) {
            setSelectedCryptoCurrency(cryptoCurrencies[0]);
            setLoadingCryptoCurrencies(false);
        }
    }, [cryptoCurrencies]);

    React.useEffect(() => {
        if(!p2pPaymentMethods.length) {
            dispatch(p2pPaymentMethodsFetch());
        } else {
            if(p2pPaymentMethods[0].slug != '') {
                let allPaymentsOption = {} as PaymentMethod;
                allPaymentsOption.slug = '';
                allPaymentsOption.name = 'All Payments';
                p2pPaymentMethods.unshift(allPaymentsOption);
            }
            setSelectedP2PPaymentMethod(p2pPaymentMethods[0]);
        }
    }, [p2pPaymentMethods]);

    React.useEffect(() => {
        if(selectedSide && selectedCryptoCurrency && selectedFiatCurrency && selectedP2PPaymentMethod) {
            if(selectedP2PPaymentMethod.slug == '') {
                fetchP2POffers(selectedSide, selectedCryptoCurrency.id, selectedFiatCurrency.code);
            } else {
                fetchP2POffers(selectedSide, selectedCryptoCurrency.id, selectedFiatCurrency.code, selectedP2PPaymentMethod.slug);
            }
        }
    }, [selectedSide, selectedCryptoCurrency, selectedFiatCurrency, selectedP2PPaymentMethod]);

     React.useEffect(() => {
        if(!P2PWallets.length) {
            dispatch(p2pWalletsFetch());
        }
    }, [P2PWallets]);
    //End Use Effects

    const fetchP2POffers = (side: string, baseUnit: string, quoteUnit: string, paymentMethodId?: string) => {
        var requestObject = {
            side: side.toLowerCase(),
            base: baseUnit.toLowerCase(),
            quote: quoteUnit.toLowerCase(),
            page: 0,
            limit: DEFAULT_TABLE_PAGE_LIMIT
        };
        if(paymentMethodId) {
            requestObject['payment_method_id'] = paymentMethodId;
        }
        dispatch(
            offersFetch(requestObject),
        );
    }

    const filterCryptoCurrencies = () => {
        const filteredCurrencies = currencies.filter((currency) => {
            return currency.type == 'coin';
        });
        setCryptoCurrencies(filteredCurrencies);
    }

    const handleSideChange = (event, newSide) => {
        if (newSide !== null) {
            setSelectedSide(newSide);
        }
    };

    const onCryptoCurrencyChange = (currency: Currency) => {
        setSelectedCryptoCurrency(currency);
    };

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

    const handleTablePageChange = (event: unknown, newPage: number) => {
        setTablePage(newPage);
    };

    const handleTableRowsChangePerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTableRowsPerPage(+event.target.value);
        setTablePage(0);
    };

    const handleVideoTurorialDialogOpen = () => {
        setVideoTutorialDialogOpen(true);
    };

    const handleVideoTurorialDialogClose = () => {
        setVideoTutorialDialogOpen(false);
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
                        <>
                            <Chip color="secondary" size="small" label={selectedFiatCurrency ? selectedFiatCurrency.symbol_native.toUpperCase() : ''} className={classes.currencyCode} />
                            <Typography variant="subtitle1" component="div" className={classes.currencyName}>
                                {selectedFiatCurrency ? selectedFiatCurrency.code.toUpperCase() : ''}
                            </Typography>
                            <div className={classes.selectDownArrow}>
                                <ArrowDropDownIcon />
                            </div>
                        </>
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
                        onChange={(event: any, selectedOption: FiatCurrency | null) => {
                            setSelectedFiatCurrency(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption={(option: FiatCurrency) => {
                            return <React.Fragment>
                                <div style={{ display: 'flex' }}>
                                    <Chip color="secondary" size="small" label={option ? option.symbol_native.toUpperCase() : ''} className={classes.currencyCode} />
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        {option ? option.name : ''}
                                    </Typography>

                                </div>
                            </React.Fragment>
                        }}
                        options={fiatCurrencies}
                        getOptionLabel={(option: FiatCurrency) => option ? option.name : ''}
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
                        <>
                            <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                                {selectedP2PPaymentMethod ? selectedP2PPaymentMethod.name : ''}
                            </Typography>
                            <div className={classes.selectDownArrow}>
                                <ArrowDropDownIcon />
                            </div>
                        </>
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
                        value={selectedP2PPaymentMethod}
                        onChange={(event: any, selectedOption: PaymentMethod | null) => {
                            setSelectedP2PPaymentMethod(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption={(option: PaymentMethod) => {
                            return <React.Fragment>
                                <div style={{ display: 'flex' }}>
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        {option ? option.name : ''}
                                    </Typography>

                                </div>
                            </React.Fragment>
                        }}
                        options={p2pPaymentMethods}
                        getOptionLabel={(option: PaymentMethod) => option ? option.name : ''}
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
                    <div className={classes.tabsHeader}>
                        <div>
                            <Link to="/p2p/offers" className={classes.activePage}>
                                    <Typography variant="h6" component="div" display="inline">
                                        P2P
                                    </Typography>
                            </Link>
                            <Link to="/p2p/quick-trade" className={classes.inActivePage}>
                                <Typography variant="h6" component="div"  display="inline">
                                    Express
                                </Typography>   
                            </Link>
                        </div>
                        {loggedIn ? <P2PLinks handleVideoDialogOpen={handleVideoTurorialDialogOpen} /> : ''}
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
                                return <ToggleButton value={sideItem['title']} disabled={p2pOffersLoading} aria-label="buy side" style={{ fontWeight: 600, backgroundColor: selectedSide == sideItem['title'] ? sideItem['selectedBGColor'] : '#ffffff' , color: selectedSide == sideItem['title'] ? '#ffffff' : '#1E2026' }}>
                                    <span>
                                        {sideItem['title']}
                                    </span> 
                                </ToggleButton>
                            })}
                        </ToggleButtonGroup>

                        {cryptoCurrencies.length ? 
                            <div className={classes.cryptoFiltersRoot}>
                                {cryptoCurrencies.map((cryptoCurrency) => {
                                    return (
                                        selectedCryptoCurrency ?
                                        <div className={ selectedCryptoCurrency.id.toLowerCase() == cryptoCurrency.id.toLowerCase() ? classes.activeCurrency : classes.inActiveCurrency} onClick={e => onCryptoCurrencyChange(cryptoCurrency)}>
                                            <span>
                                                {cryptoCurrency.id.toUpperCase()}
                                            </span> 
                                        </div> : ''
                                    );
                                })}
                            </div> : <div style={{ display: 'flex', marginLeft: '8px' }}>
                                <div style={{  }}>
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} />
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} />
                                </div>
                                <div style={{  }}>
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} />
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} />
                                </div>
                                <div style={{  }}>
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} />
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} />
                                </div>
                                <div style={{  }}>
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} />
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} />
                                </div>
                                <div style={{  }}>
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} />
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} />
                                </div>
                            </div>
                        }
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
                    { loadingCryptoCurrencies && fiatCurrenciesLoading && p2pPaymentMethodsLoading ? <CircularProgress /> : 
                        <P2POffers 
                            offersLoading={p2pOffersLoading} 
                            offers={p2pOffers} 
                            tablePage= {tablePage}
                            tableRowsPerPage= {tableRowsPerPage}
                            handleTablePageChange={handleTablePageChange}
                            handleTableRowsChangePerPage={handleTableRowsChangePerPage}
                            wallets={P2PWallets}
                        />
                    }
                </Paper>
                <Paper style={{ marginTop: '16px', padding: '16px', backgroundColor: '#FAFAFA' }}>
                    <Typography variant="h4" style={{ margin: '16px 0px', fontWeight: 700 }}>Advantages of P2P Exchange</Typography>
                    <div className={classes.advantagesQuestionsDiv}>
                        <div className={classes.questionsDetail}>
                            <Typography variant="h6" style={{ margin: '16px 0px', fontWeight: 700 }}>Low cost transaction fees</Typography>
                            <Typography variant="body2" style={{ margin: '16px 0px', whiteSpace: 'pre-line', }}>{`As P2P exchange is a simple platform, the overhead costs are negligible for buyers and sellers.\n\nOn Binance P2P, takers are charged zero trading fees, while makers are charged a small amount of transaction fees upon every completed order. We pledge to apply the lowest P2P transaction fees in all markets.`}</Typography>
                        </div>
                        <div className={classes.questionsDetail}>
                            <Typography variant="h6" style={{ margin: '16px 0px', fontWeight: 700 }}>Flexible payment methods</Typography>
                            <Typography variant="body2" style={{ margin: '16px 0px', whiteSpace: 'pre-line', }}>{`As P2P exchange is a simple platform, the overhead costs are negligible for buyers and sellers.\n\nOn Binance P2P, takers are charged zero trading fees, while makers are charged a small amount of transaction fees upon every completed order. We pledge to apply the lowest P2P transaction fees in all markets.`}</Typography>
                        </div>
                        <div className={classes.questionsDetail}>
                            <Typography variant="h6" style={{ margin: '16px 0px', fontWeight: 700 }}>Trade at your preferred prices</Typography>
                            <Typography variant="body2" style={{ margin: '16px 0px', whiteSpace: 'pre-line', }}>{`As P2P exchange is a simple platform, the overhead costs are negligible for buyers and sellers.\n\nOn Binance P2P, takers are charged zero trading fees, while makers are charged a small amount of transaction fees upon every completed order. We pledge to apply the lowest P2P transaction fees in all markets.`}</Typography>
                        </div>
                        <div className={classes.questionsDetail}>
                            <Typography variant="h6" style={{ margin: '16px 0px', fontWeight: 700 }}>Protection for your privacy</Typography>
                            <Typography variant="body2" style={{ margin: '16px 0px', whiteSpace: 'pre-line', }}>{`As P2P exchange is a simple platform, the overhead costs are negligible for buyers and sellers.\n\nOn Binance P2P, takers are charged zero trading fees, while makers are charged a small amount of transaction fees upon every completed order. We pledge to apply the lowest P2P transaction fees in all markets.`}</Typography>
                        </div>
                    </div>
                </Paper>
                <P2PVideoTutorialDialog open={videoTutorialDialogOpen} handleClose={handleVideoTurorialDialogClose} />
            </Box>
        </>
    );    
}

export const P2POffersScreen = P2POffersComponent;