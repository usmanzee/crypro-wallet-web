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
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    useMediaQuery,
    Stepper,
    Step,
    StepLabel,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    Checkbox,
    FormHelperText,
    CircularProgress
} from '@material-ui/core';

import ReceiptIcon from '@material-ui/icons/Receipt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PlayCircleOutlineRoundedIcon from '@material-ui/icons/PlayCircleOutlineRounded';
import CloseIcon from '@material-ui/icons/Close';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import RemoveOutlinedIcon from '@material-ui/icons/RemoveOutlined';
import RefreshIcon from '@material-ui/icons/Refresh';
import EditIcon from '@material-ui/icons/Edit';

import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Skeleton from '@material-ui/lab/Skeleton';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import clsx from  'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';
import { fetchRate, getExchangeHistory, postExchange } from '../../../apis/exchange';

import { PageHeader } from '../../../containers/PageHeader';
import { P2PVideoTutorialDialog } from '../../../components/P2P/P2PVideoTutorialDialog';
import { StyledTableCell } from '../../materialUIGlobalStyle';
import { useStyles } from './style';
import { setDocumentTitle } from '../../../helpers';
import {
    WalletItemProps,
    CryptoIcon,
} from '../../../components';

import { 
    Currency,
    FiatCurrency,
    PaymentMethod,
    UserPaymentMethod,
    selectCurrenciesLoading,
    selectCurrencies,
    currenciesFetch,
    selectFiatCurrenciesLoading,
    selectFiatCurrencies,
    fiatCurrenciesFetch,
    selectPaymentMethodsfetching,
    selectPaymentMethodList,
    paymentMethodListFetch,
    selectP2PWalletsLoading,
    selectP2PsWallets,
    p2pWalletsFetch,
    selectP2PCreateOffersLoading,
    selectP2PCreateOffersSuccess,
    selectP2PCreateOffersError,
    createOffer
} from '../../../modules';

import {
    useParams,
    useHistory
} from "react-router-dom";


  
type Props = RouterProps & InjectedIntlProps;
const P2PPostAdComponent = (props: Props) => {
    const classes = useStyles();

    const theme = useTheme();
    const history = useHistory();
    const fullScreenPaymentDialog = useMediaQuery(theme.breakpoints.down('sm'));

    const [cryptoCurrencies, setCryptoCurrencies] = React.useState<Currency[]>([]);
    const [loadingCryptoCurrencies, setLoadingCryptoCurrencies] = React.useState<boolean>(true);
    const [selectedCryptoCurrency, setSelectedCryptoCurrency] = React.useState<Currency>(null);

    const [selectedFiatCurrency, setSelectedFiatCurrency] = React.useState<FiatCurrency>(null);

    const [fiatAnchorEl, setFiatAnchorEl] = React.useState<null | HTMLElement>(null);

    const [sides, setSides] = React.useState([
        {'name': 'Buy','title': 'I want to buy', 'value': 'buy'},
        {'name': 'Sell','title': 'I want to sell', 'value': 'sell'},
    ]);
    const [selectedSideName, setSelectedSideName] = React.useState('buy');
    const [activeStep, setActiveStep] = React.useState(0);
    const [priceTypes, setPriceTypes] = React.useState([
        {'name': 'Fixed', 'value': 'fixed'},
        {'name': 'Floating', 'value': 'floating'}
    ]);
    const [paymentTimeLimits, setPaymentTimeLimits] = React.useState([
        {'name': '15 min', 'value': '15'},
        {'name': '30 min', 'value': '20'},
        {'name': '1 hour', 'value': '60'}
    ]);

    const [selectedPriceType, setSelectedPriceType] = React.useState('fixed');
    
    const [minFloatingPercentage, setMinFloatingPercentage] = React.useState('80');
    const [maxFloatingPercentage, setMaxFloatingPercentage] = React.useState('120');
    const [currentRate, setCurrentRate] = React.useState('');
    const [minPriceLimit, setMinPriceLimit] = React.useState('');
    const [maxPriceLimit, setMaxPriceLimit] = React.useState('');
    const [finalPrice, setFinalPrice] = React.useState('');
    const [fixedAmount, setFixedAmount] = React.useState('');
    const [floatingPercentage, setFloatingPercentage] = React.useState('100.00');
    const [fixedAmountErrorMessage, setFixedAmountErrorMessage] = React.useState<string>('');
    const [floatingPercentageErrorMessage, setFloatingPercentageErrorMessage] = React.useState<string>('');
    const [selectedWallet, setSelectedWallet] = React.useState<WalletItemProps>(null);
    //Second Step states
    const [totalAmount, setTotalAmount] = React.useState('');
    const [totalAmountErrorMessage, setTotalAmountErrorMessage] = React.useState('');
    const [minOrderAmount, setMinOrderAmount] = React.useState('');
    const [minOrderAmountErrorMessage, setMinOrderAmountErrorMessage] = React.useState('');
    const [maxOrderAmount, setMaxOrderAmount] = React.useState('');
    const [maxOrderAmountErrorMessage, setMaxOrderAmountErrorMessage] = React.useState('');
    const [selectedPaymentMethods, setSelectedPaymentMethods] = React.useState<UserPaymentMethod[]>([]);
    const [selectedPaymentMethodsErrorMessage, setSelectedPaymentMethodsErrorMessage] = React.useState('');
    const [selectedPaymentTimeLimit, setSelectedPaymentTimeLimit] = React.useState<string>('15');
    const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = React.useState(false);

    //Third Step states
    const [notes, setNotes] = React.useState('');
    const [autoReply, setAutoReply] = React.useState('');

    const [fetchingRate, setFetchingRate] = React.useState(false);

    const dispatch = useDispatch();
    const currencies = useSelector(selectCurrencies);
    const currenciesLoading = useSelector(selectCurrenciesLoading);
    const fiatCurrencies = useSelector(selectFiatCurrencies);
    const fiatCurrenciesLoading = useSelector(selectFiatCurrenciesLoading);
    const userPaymentMethodsLoading = useSelector(selectPaymentMethodsfetching);
    const userPaymentMethods = useSelector(selectPaymentMethodList);

    const P2PWallets = useSelector(selectP2PsWallets);
    const P2PWalletsLoading = useSelector(selectP2PWalletsLoading);
    const P2POfferCreateLoading = useSelector(selectP2PCreateOffersLoading);
    const P2POfferCreateSuccess = useSelector(selectP2PCreateOffersSuccess);
    const P2POfferCreateError = useSelector(selectP2PCreateOffersError);

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
        if(!P2PWallets.length) {
            dispatch(p2pWalletsFetch());
        } else {
            filterCryptoCurrencies();
        }
    }, [P2PWallets]);

    React.useEffect(() => {
        if(!fiatCurrencies.length) {
            dispatch(fiatCurrenciesFetch());
        } else {
            setSelectedFiatCurrency(fiatCurrencies[0]);
        }
    }, [fiatCurrencies]);

    React.useEffect(() => {
        if(!userPaymentMethods.length) {
            dispatch(paymentMethodListFetch());
        }
    }, [userPaymentMethods]);

    React.useEffect(() => {
        if(cryptoCurrencies.length) {
            setSelectedCryptoCurrency(cryptoCurrencies[0]);
            setLoadingCryptoCurrencies(false);
        }
    }, [cryptoCurrencies]);
    
    React.useEffect(() => {
        if(selectedCryptoCurrency && selectedFiatCurrency) {
            getExchangeRates();
        }
    }, [selectedCryptoCurrency, selectedFiatCurrency]);

    React.useEffect(() => {
        if(selectedCryptoCurrency && P2PWallets.length) {
            setWalletByCurrencyId(selectedCryptoCurrency.id);
        }
    }, [selectedCryptoCurrency, P2PWallets]);

    React.useEffect(() => {
        calculateFinalPriceOnFixedAmountChanged();
        handleFixedAmountError();
    }, [fixedAmount]);

    React.useEffect(() => {
        calculateFinalPriceOnFloatingPercentageChanged();
        handleFloatingPercentageError();
        
    }, [floatingPercentage]);

    React.useEffect(() => {
        if(totalAmount) {
            handleTotalAmountError();
        }
    }, [totalAmount]);

    React.useEffect(() => {
        if(minOrderAmount) {
            handleMinOrderAmountError();
        }
    }, [minOrderAmount]);

    React.useEffect(() => {
        if(maxOrderAmount) {
            handleMaxOrderAmountError();
        }
    }, [maxOrderAmount]);
    
    React.useEffect(() => {
        if(selectedPaymentMethods.length) {
            handlePaymentMethodsError();
        }
    }, [selectedPaymentMethods.length]);

    React.useEffect(() => {
        if(P2POfferCreateSuccess) {
            history.push('/p2p/my-offers');
        }
    }, [P2POfferCreateSuccess]);

    const filterCryptoCurrencies = () => {
        const filteredCurrencies = currencies.filter((currency) => {
            return currency.type == 'coin';
        });
        setCryptoCurrencies(filteredCurrencies);
    }

    const handleSideChange = (newSide: string) => {
        if (newSide !== null && selectedSideName != newSide) {
            setSelectedSideName(newSide);
        }
    };

    const handleFiatCurrencySelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setFiatAnchorEl(event.currentTarget);
    };

    const handleFiatCurrencySelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (fiatAnchorEl) {
            fiatAnchorEl.focus();
        }
        setFiatAnchorEl(null);
    };

    const handleCryptoCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrencyByCurrencyId(event.target.value);
    };

    const handlePriceTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value == 'fixed') {
            setFixedAmount(currentRate);
        } else {
            setFloatingPercentage('100.00');
        }
        setSelectedPriceType((event.target as HTMLInputElement).value);
    };

    const handleFixedAmountChanged = (event) => {
        const input = event.target.value;
        if( !input || ( input[input.length-1].match('[0-9]') && input[0].match('[1-9]')) ) {
            setFixedAmount(input);
        } else {
            setFixedAmount('0.00');
        }
    };

    const fixedAmountChangedFromActionButton = (isIncrement: boolean) => {
        var amount = 0.1;
        var newFixedAmount = 0;
        if(isIncrement) {
            var newFixedAmount = Number(fixedAmount) + amount;
        } else {
            if(Number(fixedAmount) > 0) {
                var newFixedAmount = Number(fixedAmount) - amount;
            }
        }
        setFixedAmount(newFixedAmount.toFixed(2));
    }

    const handleFloatingPercentageChanged = (event) => {
        const input = event.target.value;
        if( !input || ( input[input.length-1].match('[0-9]') && input[0].match('[1-9]')) )
            setFloatingPercentage(input);

    };

    const floatingPercentageChangedFromActionButton = (isIncrement: boolean) => {
        var amount = 0.1;
        var newFixedAmount = 0;
        if(isIncrement) {
            var newFixedAmount = Number(floatingPercentage) + amount;
        } else {
            if(Number(floatingPercentage) > 0) {
                var newFixedAmount = Number(floatingPercentage) - amount;
            }
        }
        setFloatingPercentage(newFixedAmount.toFixed(2));
    }
    
    const handleTotalAmountChanged = (event) => {
        const input = event.target.value;
        if( !input || ( input[input.length-1].match('[0-9]') && input[0].match('[1-9]')) ) {
            setTotalAmount(input);
        }
    };

    const handleMinOrderAmountChanged = (event) => {
        const input = event.target.value;
        if( !input || ( input[input.length-1].match('[0-9]') && input[0].match('[1-9]')) ) {
            setMinOrderAmount(input);
        }
    };

    const handleMaxOrderAmountChanged = (event) => {
        const input = event.target.value;
        if( !input || ( input[input.length-1].match('[0-9]') && input[0].match('[1-9]')) ) {
            setMaxOrderAmount(input);
        }
    };

    const handleNotesChanged = (event) => {
        setNotes(event.target.value)
    };

    const handleAutoReplyChanged = (event) => {
        setAutoReply(event.target.value)
    };

    const setWalletAllAmount = () => {
        setTotalAmount(selectedWallet.balance);
    }

    const handlePaymentMethodSelection = (paymentMethod: UserPaymentMethod) => {
        if(!checkIfPaymentMethodAlreadySelected(paymentMethod.payment_method.slug)) {
            setSelectedPaymentMethods(oldData => [...oldData, paymentMethod]);
            setPaymentMethodDialogOpen(false);
        }
    }

    const handlePaymentMethodDeletion = (paymentMethod: UserPaymentMethod) => {
        const newState = selectedPaymentMethods.filter((method) => method.payment_method.slug.toLowerCase() !== paymentMethod.payment_method.slug.toLowerCase());
        setSelectedPaymentMethods(newState);
    }

    const loadUserPaymentMethods = () => {
        dispatch(paymentMethodListFetch());
    }

    const handlePaymentMethodDialogClickOpen = () => {
        setPaymentMethodDialogOpen(true);
    };
    
    const handlePaymentMethodDialogClose = () => {
        setPaymentMethodDialogOpen(false);
    };

    const handlePaymentTimeLimitChange = (event) => {
        setSelectedPaymentTimeLimit(event.target.value);
    }

    const setCurrencyByCurrencyId = (currencyId: string) => {
        var searchedCurrency = cryptoCurrencies.find((cryptoCurrency) => {
            return cryptoCurrency.id.toLowerCase() == currencyId.toLowerCase()
        });
        setSelectedCryptoCurrency(searchedCurrency);
    }

    const setWalletByCurrencyId = (currencyId: string) => {
        var searchedWallet = P2PWallets.find((wallet) => {
            return wallet.currency.toLowerCase() == currencyId.toLowerCase()
        });
        setSelectedWallet(searchedWallet);
    }

    const checkIfPaymentMethodAlreadySelected = (paymentMethodSlug: string) => {
        return selectedPaymentMethods.find((method: UserPaymentMethod) => {
            return  method.payment_method.slug.toLowerCase() == paymentMethodSlug.toLowerCase();
        });
    }

    const calculateFinalPriceOnFixedAmountChanged = () => {
        setFinalPrice(fixedAmount);
    }

    const calculateFinalPriceOnFloatingPercentageChanged = () => {
        var newPrice = Number(currentRate) * (Number(floatingPercentage) / 100);
        setFinalPrice(newPrice.toFixed(2));
    }

    const getExchangeRates = async () => {
        setFetchingRate(true);
        const response = await fetchRate(selectedCryptoCurrency.id.toLowerCase(), selectedFiatCurrency.code.toLowerCase(), 1);
        if (response.data) {
            setFetchingRate(false);
            setCurrentRate(response.data);
            setMinAndMaxLimits(response.data);
            setFixedAmount(response.data);
        }
    }

    const setMinAndMaxLimits = (rate: any) => {
        var minRate = Number(rate) * (Number(minFloatingPercentage) / 100)
        var maxRate = Number(rate) * (Number(maxFloatingPercentage) / 100)
        setMinPriceLimit(minRate.toFixed(2));
        setMaxPriceLimit(maxRate.toFixed(2));
    }

    const handleFixedAmountError = () => {
        let errorMsg = '';
        if (fixedAmount) {
            if (Number(fixedAmount) < Number(minPriceLimit) || Number(fixedAmount) > Number(maxPriceLimit)) {
                errorMsg = `Fixed Price should be [${minPriceLimit} , ${maxPriceLimit}]`
            }
        } else {
            errorMsg = '';
        }
        setFixedAmountErrorMessage(`${errorMsg}`);
    }

    const handleFloatingPercentageError = () => {
        let errorMsg = '';
        if (floatingPercentage) {
            if (Number(floatingPercentage) < Number(minFloatingPercentage) || Number(floatingPercentage) > Number(maxFloatingPercentage)) {
                errorMsg = `Floating Price margin should be within [${minFloatingPercentage}% , ${maxFloatingPercentage}%]`
            }
        } else {
            errorMsg = '';
        }
        setFloatingPercentageErrorMessage(`${errorMsg}`);
    }

    const handleTotalAmountError = () => {
        let errorMsg = '';
        if (Number(totalAmount) < 0 || totalAmount == '') {
            errorMsg = "Enter valid trading amount";
        } else if (Number(totalAmount) > Number(selectedWallet.balance)) {
            errorMsg = "Not enough balance, please credit your account.";
        } else {
            errorMsg = '';
        }
        setTotalAmountErrorMessage(`${errorMsg}`);
    }

    const handleMinOrderAmountError = () => {
        let errorMsg = '';
        if (Number(minOrderAmount) < 0 || minOrderAmount == '') {
            errorMsg = "Enter valid min order amount";
        } else {
            errorMsg = '';
        }
        setMinOrderAmountErrorMessage(`${errorMsg}`);
    }
    
    const handleMaxOrderAmountError = () => {
        let errorMsg = '';
        if (Number(maxOrderAmount) < 0 || maxOrderAmount == '') {
            errorMsg = "Enter valid max order amount";
        } else {
            errorMsg = '';
        }
        setMaxOrderAmountErrorMessage(`${errorMsg}`);
    }

    const handlePaymentMethodsError = () => {
        let errorMsg = '';
        if (selectedPaymentMethods.length <= 0) {
            errorMsg = "Please select at least 1 payment method";
        } else {
            errorMsg = '';
        }
        setSelectedPaymentMethodsErrorMessage(`${errorMsg}`);
    }

    const isFirstStepValid = () => {
        if(selectedPriceType == 'fixed') {
            return ((Number(fixedAmount) > 0) && fixedAmount != '' && fixedAmountErrorMessage == '');
        } else {
            return ((Number(floatingPercentage) > 0) && floatingPercentage != '' && floatingPercentageErrorMessage == '');
        }
    }

    const isSecondStepValid = () => {
        handleTotalAmountError();
        handleMinOrderAmountError();
        handleMaxOrderAmountError();
        handlePaymentMethodsError();
        return ((Number(totalAmount) > 0) && totalAmount != '' && totalAmountErrorMessage == '' && minOrderAmountErrorMessage == '' && maxOrderAmountErrorMessage == '' && selectedPaymentMethods.length > 0 && selectedPaymentMethodsErrorMessage == '');
    }

    const handleNext = () => {
        if(activeStep == 0) {
            if(isFirstStepValid()) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        } else if(activeStep == 1)  {
            if(isSecondStepValid()) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        } else if(activeStep == 2) {
            var offerPaymentMethods = [];
            selectedPaymentMethods.map((method) => {
                offerPaymentMethods.push({
                    name: method.payment_method.slug
                })
            });
            var requestObject = {
                base_unit: selectedCryptoCurrency.id.toLowerCase(),
                quote_unit: selectedFiatCurrency.code.toLowerCase(),
                side: selectedSideName.toLowerCase(),
                price: finalPrice,
                origin_amount: totalAmount,
                min_order_amount: minOrderAmount,
                max_order_amount: maxOrderAmount,
                time_limit: selectedPaymentTimeLimit,
                margin: floatingPercentage,
                payment_methods: offerPaymentMethods
            };
            requestObject['note'] = notes;
            requestObject['auto_reply'] = autoReply;
            console.log(requestObject);
            dispatch(createOffer(requestObject));
        } else {
            
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const getSides = () => {
        return(
            <>
            <div className={classes.sidesDiv}>
                {sides.map((sideItem) => {
                    return <div className={selectedSideName == sideItem['value'] ? classes.activeSide : classes.inActiveSide} onClick={e => handleSideChange(sideItem['value'])}>{sideItem['title']}</div>
                })}
            </div>
            </>
        );
    }

    const getSteps = () => {
        return ['Set Type & Price', 'Set Total Amount & Payment Method', 'Set Remarks & Automatic Response'];
    }
      
    const getStepContent = (step: number) => {
        switch (step) {
          case 0:
            return getFirstStep();
          case 1:
            return getSecondStep();
          case 2:
            return getThirdStep();
          default:
            return 'Unknown step';
        }
    }

    const fiatPopperOpen = Boolean(fiatAnchorEl);
    const fiatPopperId = fiatPopperOpen ? 'fiat-currencies' : undefined;

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
                        getOptionLabel={(option: FiatCurrency) => option ? option.code : ''}
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

    const getFirstStep = () => {
        return (
            <>
                <div>
                    <FormControl component="fieldset">
                        <FormLabel component="div">Asset</FormLabel>
                            {loadingCryptoCurrencies && !selectedCryptoCurrency ?  
                                <div style={{ display: 'flex' }}>
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} /> 
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} /> 
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} /> 
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} /> 
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} /> 
                                </div>
                            : 
                            <RadioGroup row aria-label="position" name="position" value={selectedCryptoCurrency.id} onChange={handleCryptoCurrencyChange}>
                                {cryptoCurrencies.map((cryptoCurrency, index) => {
                                    return (
                                        <>
                                            <FormControlLabel
                                                value={cryptoCurrency.id}
                                                control={<Radio color="secondary" />}
                                                label={cryptoCurrency.id.toUpperCase()}
                                            />
                                        </>
                                    );
                                })}
                            </RadioGroup>
                            }
                    </FormControl>
                </div>
                <div style={{  }}>
                    <FormControl component="fieldset" className={classes.filtersDiv}>
                        <FormLabel component="div" className={classes.linkLabel} style={{ marginBottom: '8px' }}>
                            <span style={{ marginRight: '4px' }}>With Cash</span>
                            <InfoOutlinedIcon fontSize="small"/>
                        </FormLabel>
                        {renderFiatCurrencyDrowdown()}
                    </FormControl>
                </div>
                <Divider style={{ borderTop: '1px dashed rgba(0, 0, 0, 0.12)', backgroundColor: '#0000', margin: '8px 0px 24px 0px' }} />
               <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '24px' }}>
                        <FormLabel component="div" style={{ marginBottom: '8px' }}>Your Price</FormLabel>
                        <Typography variant="h5">{`${finalPrice} ${selectedFiatCurrency ? selectedFiatCurrency.code : ''}`}</Typography>
                    </div>
                    {/* <div>
                        <FormLabel component="div" className={classes.linkLabel}>
                            <span style={{ marginRight: '4px' }}>Highest Order Price</span>
                            <InfoOutlinedIcon fontSize="small"/>
                        </FormLabel>
                        <Typography variant="h5">₨ 168.75</Typography>
                    </div> */}
               </div>

               <div style={{ marginTop: '24px' }}>
                    <FormControl component="fieldset">
                        <FormLabel component="div">Price Type</FormLabel>
                        <RadioGroup row aria-label="position" name="position" defaultValue={selectedPriceType} onChange={handlePriceTypeChange}>
                            {priceTypes.map((priceType) => {
                                return (
                                    <>
                                        <FormControlLabel
                                            value={priceType['value']}
                                            control={<Radio color="secondary" />}
                                            label={priceType['name']}
                                        />
                                    </>
                                );
                            })}
                        </RadioGroup>
                    </FormControl>
                </div>
                {selectedPriceType == 'fixed' ? 
                    <div style={{ marginTop: '0px' }}>
                        <FormControl variant="outlined" error={fixedAmountErrorMessage != ''}>
                            <FormLabel component="div">Fixed</FormLabel>
                            <TextField
                                className={clsx(classes.numberInput, classes.amountInput)}
                                margin="dense"
                                variant="outlined"
                                size="small"
                                type="number"
                                autoComplete='off'
                                inputProps={{style: { textAlign: 'center', }}}
                                value={fixedAmount}
                                onChange={(e) => {
                                    handleFixedAmountChanged(e)
                                }}
                                error={fixedAmountErrorMessage != ''}
                                InputProps={{
                                    startAdornment: <InputAdornment position="end" className={classes.amountFieldActionButtons}>
                                        <RemoveOutlinedIcon fontSize="small" onClick={() => fixedAmountChangedFromActionButton(false)} />
                                    </InputAdornment>,
                                    endAdornment: <InputAdornment position="end" className={classes.amountFieldActionButtons}>
                                        <AddOutlinedIcon fontSize="small" onClick={() => fixedAmountChangedFromActionButton(true)} />
                                    </InputAdornment>,
                                }}
                            />
                            {fixedAmountErrorMessage && <FormHelperText id="sell-text" style={{ marginLeft: '0px', fontSize: 14 }}>{fixedAmountErrorMessage}</FormHelperText>}
                        </FormControl>
                    </div> : <div style={{ marginTop: '0px' }}>
                    <FormControl variant="outlined" error={floatingPercentageErrorMessage != ''}>
                        <FormLabel component="div">Floating Price Margin%</FormLabel>
                        <TextField
                            className={clsx(classes.numberInput, classes.amountInput)}
                            margin="dense"
                            variant="outlined"
                            size="small"
                            type="number"
                            autoComplete='off'
                            inputProps={{style: { textAlign: 'center', }}}
                            value={floatingPercentage}
                            onChange={(e) => {
                                handleFloatingPercentageChanged(e)
                            }}
                            error={floatingPercentageErrorMessage != ''}
                            InputProps={{
                                startAdornment: <InputAdornment position="end" className={classes.amountFieldActionButtons}>
                                    <RemoveOutlinedIcon fontSize="small" onClick={() => floatingPercentageChangedFromActionButton(false)} />
                                </InputAdornment>,
                                endAdornment: <InputAdornment position="end" className={classes.amountFieldActionButtons}>
                                    <AddOutlinedIcon fontSize="small" onClick={() => floatingPercentageChangedFromActionButton(true)} />
                                </InputAdornment>,
                            }}
                        />
                        {floatingPercentageErrorMessage && <FormHelperText id="sell-text" style={{ marginLeft: '0px', fontSize: 14 }}>{floatingPercentageErrorMessage}</FormHelperText>}
                        </FormControl>
                    </div>
                }
                
               {selectedPriceType != 'fixed' ? <div style={{ display: 'flex'}}>
                    <Tooltip title="Floating price = Market price x exchange rate x price margin" arrow style={{ marginRight: '4px', borderBottom: '1px dashed' }}>
                        <Typography>Pricing Formula</Typography>
                    </Tooltip>
                    <Typography style={{ marginRight: '4px' }}>{currentRate} * {floatingPercentage}% ≈</Typography>
                    <Typography style={{ marginRight: '4px', fontWeight: 700 }}>{finalPrice}</Typography>
                    <Typography>{selectedFiatCurrency.code.toUpperCase()}</Typography>
                </div> : ''}
            </>
        );
    }

    const getSecondStep = () => {
        return (
            <>
                <div className={classes.secondStepContentDiv}>
                    <FormControl variant="outlined" fullWidth error={totalAmountErrorMessage != ''}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <FormLabel component="div">Total Amount</FormLabel>
                            <FormLabel>{`Available: ${selectedWallet.balance} ${selectedCryptoCurrency.id.toUpperCase()}`}</FormLabel>
                        </div>
                        <TextField
                            className={classes.numberInput}
                            margin="dense"
                            variant="outlined"
                            size="small"
                            type="number"
                            autoComplete='off'
                            fullWidth={true}
                            value={totalAmount}
                            onChange={(e) => {
                                handleTotalAmountChanged(e)
                            }}
                            error = {totalAmountErrorMessage != ''}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <span className={classes.maxButton} onClick={() => setWalletAllAmount()}>
                                            {/* <FormattedMessage id={'page.body.swap.input.tag.max'} /> */}
                                            All
                                        </span>
                                        <Divider className={classes.inputAdornmentDivider} orientation="vertical" style={{ margin: '0px 8px' }} />
                                    <Typography>{selectedCryptoCurrency.id.toUpperCase()}</Typography>
                                </InputAdornment>,
                            }}
                        />
                        {totalAmountErrorMessage && <FormHelperText id="sell-text" style={{ marginLeft: '0px', fontSize: 14 }}>{totalAmountErrorMessage}</FormHelperText>}
                    </FormControl>
                </div>
                <div className={classes.secondStepContentDiv} style={{ marginTop: '16px' }}>
                    <FormLabel component="div">Order Limit</FormLabel>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl variant="outlined" fullWidth error={minOrderAmountErrorMessage != ''}>
                            <TextField
                                className={classes.numberInput}
                                margin="dense"
                                variant="outlined"
                                size="small"
                                type="number"
                                autoComplete='off'
                                fullWidth={true}
                                value={minOrderAmount}
                                onChange={(e) => {
                                    handleMinOrderAmountChanged(e)
                                }}
                                error = {minOrderAmountErrorMessage != ''}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <Typography>{selectedFiatCurrency.code.toUpperCase()}</Typography>
                                    </InputAdornment>,
                                }}
                            />
                            {minOrderAmountErrorMessage && <FormHelperText id="sell-text" style={{ marginLeft: '0px', fontSize: 14 }}>{minOrderAmountErrorMessage}</FormHelperText>}
                        </FormControl>
                        <Typography style={{ margin: '0px 8px', fontWeight: 700, fontSize: '16px' }}>~</Typography>
                        <FormControl variant="outlined" fullWidth error={maxOrderAmountErrorMessage != ''}>
                            <TextField
                                className={classes.numberInput}
                                margin="dense"
                                variant="outlined"
                                size="small"
                                type="number"
                                autoComplete='off'
                                fullWidth={true}
                                value={maxOrderAmount}
                                onChange={(e) => {
                                    handleMaxOrderAmountChanged(e)
                                }}
                                error = {maxOrderAmountErrorMessage != ''}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <Typography>{selectedFiatCurrency.code.toUpperCase()}</Typography>
                                    </InputAdornment>,
                                }}
                            />
                            {maxOrderAmountErrorMessage && <FormHelperText id="sell-text" style={{ marginLeft: '0px', fontSize: 14 }}>{maxOrderAmountErrorMessage}</FormHelperText>}
                        </FormControl>
                    </div>
                </div>
                <Divider style={{ borderTop: '1px dashed rgba(0, 0, 0, 0.12)', backgroundColor: '#0000', margin: '8px 0px 16px 0px' }} />
                <div className={classes.secondStepContentDiv}>
                    <FormLabel component="div">Payment Method</FormLabel>
                    <Typography style={{ marginTop: '8px' }}>Select upto 5 payment methods</Typography>
                    {selectedPaymentMethods.map((selectedPaymentMethod, index) => {
                        const paymentDetailsObj = JSON.parse(selectedPaymentMethod.user_payment_detail);
                        return (
                            <>
                                <div className={classes.paymentMethodDiv}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Chip size="small" label={selectedPaymentMethod.payment_method.name} style={{ borderRadius: '8px' }}/>
                                        <Tooltip title="Remove" arrow>
                                            <CloseIcon onClick={() => handlePaymentMethodDeletion(selectedPaymentMethod)}/>
                                        </Tooltip>
                                    </div>
                                    {Object.entries(paymentDetailsObj).map(([key, value]) => {
                                        return (
                                            <>
                                                <div style={{ marginTop: '16px' }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <Typography style={{ color: 'rgb(94, 102, 115)', }}>{key}</Typography>
                                                        <Typography style={{ marginLeft: '24px', fontWeight: 700 }}>{value}</Typography>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })}
                                </div>
                            </>
                        );
                    })}
                   
                    <Button
                        style={{ marginTop: '4px' }}
                        variant="outlined"
                        color="secondary"
                        onClick={handlePaymentMethodDialogClickOpen}
                        startIcon={<AddOutlinedIcon fontSize="small"/>}
                    >
                        Add
                    </Button>
                    <Typography className={classes.paymentMethodError}>{selectedPaymentMethodsErrorMessage}</Typography>
                </div>
                <div className={classes.secondStepContentDiv} style={{ marginTop: '16px' }}>
                    <FormLabel component="div">Payment Time Limit</FormLabel>
                    <FormControl variant="outlined" size="small" style={{ marginTop: '8px' }}>
                        <Select
                            value={selectedPaymentTimeLimit}
                            onChange={handlePaymentTimeLimitChange}
                            >
                            {paymentTimeLimits.map((paymentTimeLimit) => {
                                return <MenuItem value={paymentTimeLimit['value']}>{paymentTimeLimit['name']}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>

                <Dialog
                    fullScreen={fullScreenPaymentDialog}
                    fullWidth={true}
                    maxWidth='md'
                    open={paymentMethodDialogOpen}
                    onClose={handlePaymentMethodDialogClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle>
                        <Typography variant="h6">Select payment method</Typography>
                        <IconButton aria-label="close" className={classes.closeButton} onClick={handlePaymentMethodDialogClose}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                    <DialogContent style={{ height: '392px', overflow: 'auto' }}>
                        {userPaymentMethodsLoading 
                        ? <div style={{ textAlign: 'center', padding: '150px 0px' }}>
                            <CircularProgress size={20} />
                        </div>
                        : userPaymentMethods.map((userPaymentMethod, index) => {
                            const paymentDetailsObj = JSON.parse(userPaymentMethod.user_payment_detail);
                            return (
                                <>
                                    <div className={classes.paymentMethodDiv} onClick={e => handlePaymentMethodSelection(userPaymentMethod)}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Chip size="small" label={userPaymentMethod.payment_method.name} style={{ borderRadius: '8px' }}/>
                                            {/* <Link to="/profile/payment/p2p" target="_blank" className={classes.editPaymentMethodLink}>
                                                <EditIcon />
                                            </Link> */}
                                        </div>
                                        {Object.entries(paymentDetailsObj).map(([key, value]) => {
                                            return (
                                                <>
                                                    <div style={{ marginTop: '16px' }}>
                                                        <div style={{ display: 'flex' }}>
                                                            <Typography style={{ color: 'rgb(94, 102, 115)', }}>{key}</Typography>
                                                            <Typography style={{ marginLeft: '24px', fontWeight: 700 }}>{value}</Typography>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })}
                                        
                                    </div>
                                </>
                            );
                        })}
                    </DialogContent>
                    <DialogActions style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px' }}>
                        <Link to="/profile" target="_blank" className={classes.addPaymentMethodButton}>
                            <Button
                                size="small"
                                variant="outlined"
                                color="secondary"
                                onClick={handlePaymentMethodDialogClose}
                                startIcon={<AddOutlinedIcon fontSize="small"/>}
                            >
                                Add new
                            </Button>
                        </Link>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => loadUserPaymentMethods()}
                            startIcon={<RefreshIcon fontSize="small"/>}
                        >
                            Refresh
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    const getThirdStep = () => {
        return (
            <>
                <div style={{ width: '90%' }}>
                    <FormLabel component="div">Remarks (Optional)</FormLabel>
                    <TextField
                        placeholder="Please do not include any crypto-related words, such as crypto, P2P, C2C, BTC, USDT, ETH etc."
                        margin="dense"
                        size="small"
                        multiline
                        fullWidth
                        rows={3}
                        rowsMax={3}
                        autoComplete="off"
                        variant="outlined"
                        value={notes}
                        onChange={(e) => {
                            handleNotesChanged(e);
                        }}
                    />
                </div>
                <div style={{ marginTop: '16px', width: '90%' }}>
                    <FormLabel component="div">Auto Reply (Optional)</FormLabel>
                    <TextField
                        placeholder="Auto reply message will be sent to the counterparty once the order is created"
                        margin="dense"
                        size="small"
                        multiline
                        fullWidth
                        rows={3}
                        rowsMax={3}
                        autoComplete="off"
                        variant="outlined"
                        value={autoReply}
                        onChange={(e) => {
                            handleAutoReplyChanged(e)
                        }}
                    />
                </div>
                {/* <div style={{ marginTop: '16px', width: '90%' }}>
                    <FormLabel component="div">Counterparty Conditions</FormLabel>
                    <div style={{ display: 'flex' }}>
                        <Checkbox
                            checked={true}
                            color="secondary"
                            disabled
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        <Typography style={{ marginTop: '8px' }}>Completed KYC</Typography>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Checkbox
                            // checked={false}
                            color="secondary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                        <div style={{ display: 'flex', marginTop: '8px' }}>
                            <Typography>Registered</Typography>
                            <TextField 
                                type="number" 
                                inputProps={{ className: classes.registerDaysInput }} 
                            />
                            <Typography style={{ marginLeft: '8px' }}>day(s) ago</Typography>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Checkbox
                            // checked={false}
                            color="secondary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                        <div style={{ display: 'flex', marginTop: '8px' }}>
                            <Typography>Holdings more than</Typography>
                            <TextField 
                                type="number" 
                                inputProps={{ className: classes.holdingDaysInput }} 
                            />
                            <Typography style={{ marginLeft: '8px' }}>BTC</Typography>
                        </div>
                    </div>
                </div> */}
            </>
        );
    }

    return (
        <>
            <PageHeader pageTitle={'Post Ad'} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={clsx(classes.pageContent, classes.contentDiv)} >
                    <Stepper activeStep={activeStep}>
                    {getSteps().map((label) => (
                        <Step key={label}>
                            <StepLabel>
                                <Typography className={classes.stepLabel}>{label}</Typography>
                            </StepLabel>
                        </Step>
                    ))}
                    </Stepper>
                    <div>
                        {getSides()}
                        
                        <div>
                            {getStepContent(activeStep)}
                            <div className={classes.stepsButtonsDiv}>
                                <Button disabled={activeStep === 0 || P2POfferCreateLoading} onClick={handleBack}>
                                    Back
                                </Button>
                                <Button
                                    disabled={P2POfferCreateLoading}
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                >
                                    {activeStep === getSteps().length - 1 ? P2POfferCreateLoading ? <CircularProgress size={20} /> : 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                        
                    </div>
                </Paper>
            </Box>
        </>
    );    
}

export const P2PPostAdScreen = P2PPostAdComponent;