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
    Checkbox
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

import {
    useParams,
    useHistory
} from "react-router-dom";


  
type Props = RouterProps & InjectedIntlProps;
const P2PPostAdComponent = (props: Props) => {
    const classes = useStyles();

    const theme = useTheme();
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

    const [selectedPriceType, setSelectedPriceType] = React.useState('fixed');
    const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = React.useState(false);
    const [fetchingRate, setFetchingRate] = React.useState(false);

    const dispatch = useDispatch();
    const currencies = useSelector(selectCurrencies);
    const currenciesLoading = useSelector(selectCurrenciesLoading);
    const fiatCurrencies = useSelector(selectFiatCurrencies);
    const fiatCurrenciesLoading = useSelector(selectFiatCurrenciesLoading);

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

    const getExchangeRates = async () => {
            setFetchingRate(true);
            // setWalletsToAmount('');
            const response = await fetchRate(selectedCryptoCurrency.id.toLowerCase(), selectedFiatCurrency.code.toLowerCase(), 1);
            if (response.data) {
                setFetchingRate(false);
                // setWalletsToAmount(response.data);
            }
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handlePriceTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPriceType((event.target as HTMLInputElement).value);
    };

    const handlePaymentMethodDialogClickOpen = () => {
        setPaymentMethodDialogOpen(true);
    };
    
    const handlePaymentMethodDialogClose = () => {
        setPaymentMethodDialogOpen(false);
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
                        <FormLabel component="legend">Asset</FormLabel>
                            {loadingCryptoCurrencies && !selectedCryptoCurrency ?  
                                <div style={{ display: 'flex' }}>
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} /> 
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} /> 
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} /> 
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} /> 
                                    <Skeleton width={50} style={{ marginLeft: '8px' }} /> 
                                </div>
                            : 
                            <RadioGroup row aria-label="position" name="position" defaultValue={selectedCryptoCurrency.id}>
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
                        <FormLabel component="legend" className={classes.linkLabel}>
                            <span style={{ marginRight: '4px' }}>With Cash</span>
                            <InfoOutlinedIcon fontSize="small"/>
                        </FormLabel>
                        {renderFiatCurrencyDrowdown()}
                        {/* {fiatCurrenciesLoading && !selectedFiatCurrency ?  
                                <Skeleton width={50} style={{ marginLeft: '8px' }} /> 
                            : 
                            <RadioGroup row aria-label="position" name="position" defaultValue={selectedFiatCurrency ? selectedFiatCurrency.code: ''}>
                                {fiatCurrencies.map((fiatCurrency, index) => {
                                    console.log(selectedFiatCurrency);
                                    return (
                                        <>
                                            <FormControlLabel
                                                value={fiatCurrency.code}
                                                control={<Radio color="secondary" />}
                                                label={fiatCurrency.code.toUpperCase()}
                                            />
                                        </>
                                    );
                                })}
                            </RadioGroup>
                            } */}
                    </FormControl>
                </div>
                <Divider style={{ borderTop: '1px dashed rgba(0, 0, 0, 0.12)', backgroundColor: '#0000', margin: '8px 0px 24px 0px' }} />
               <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '24px' }}>
                        <FormLabel component="legend">Your Price</FormLabel>
                        <Typography variant="h5">₨ 164.52</Typography>
                    </div>
                    <div>
                        <FormLabel component="legend" className={classes.linkLabel}>
                            <span style={{ marginRight: '4px' }}>Highest Order Price</span>
                            <InfoOutlinedIcon fontSize="small"/>
                        </FormLabel>
                        <Typography variant="h5">₨ 168.75</Typography>
                    </div>
               </div>

               <div style={{ marginTop: '24px' }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Price Type</FormLabel>
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
                <div style={{ marginTop: '0px' }}>
                    <FormLabel component="legend">{selectedPriceType == 'fixed' ? 'Fixed' : 'Floating Price Margin%'}</FormLabel>
                    <TextField
                        className={clsx(classes.numberInput, classes.amountInput)}
                        value={selectedPriceType == 'fixed' ? '164.52' : '100.00'}
                        margin="dense"
                        variant="outlined"
                        size="small"
                        type="number"
                        autoComplete='off'
                        inputProps={{style: { textAlign: 'center', }}}
                        InputProps={{
                            startAdornment: <InputAdornment position="end" className={classes.amountFieldActionButtons}>
                                <RemoveOutlinedIcon fontSize="small" />
                            </InputAdornment>,
                            endAdornment: <InputAdornment position="end" className={classes.amountFieldActionButtons}>
                                <AddOutlinedIcon fontSize="small" />
                            </InputAdornment>,
                        }}
                    />
                </div> 
            
               {selectedPriceType != 'fixed' ? <div style={{ display: 'flex'}}>
                    <Tooltip title="Floating price = Market price x exchange rate x price margin" arrow style={{ marginRight: '4px', borderBottom: '1px dashed' }}>
                        <Typography>Pricing Formula</Typography>
                    </Tooltip>
                    <Typography style={{ marginRight: '4px' }}>164.52 * 100.00% ≈</Typography>
                    <Typography style={{ marginRight: '4px', fontWeight: 700 }}>164.52</Typography>
                    <Typography>PKR</Typography>
                </div> : ''}
            </>
        );
    }

    const getSecondStep = () => {
        return (
            <>
                <div className={classes.secondStepContentDiv}>
                    <FormLabel component="legend">Total Amount</FormLabel>
                    <TextField
                        className={classes.numberInput}
                        margin="dense"
                        variant="outlined"
                        size="small"
                        type="number"
                        autoComplete='off'
                        fullWidth={true}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <Typography>USDT</Typography>
                            </InputAdornment>,
                        }}
                    />
                </div>
                <div className={classes.secondStepContentDiv} style={{ marginTop: '16px' }}>
                    <FormLabel component="legend">Order Limit</FormLabel>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            className={classes.numberInput}
                            margin="dense"
                            variant="outlined"
                            size="small"
                            type="number"
                            autoComplete='off'
                            fullWidth={true}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <Typography>PKR</Typography>
                                </InputAdornment>,
                            }}
                        />
                        <Typography style={{ margin: '0px 8px', fontWeight: 700, fontSize: '16px' }}>~</Typography>
                        <TextField
                            className={classes.numberInput}
                            margin="dense"
                            variant="outlined"
                            size="small"
                            type="number"
                            autoComplete='off'
                            fullWidth={true}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <Typography>PKR</Typography>
                                </InputAdornment>,
                            }}
                        />
                    </div>
                </div>
                <Divider style={{ borderTop: '1px dashed rgba(0, 0, 0, 0.12)', backgroundColor: '#0000', margin: '8px 0px 16px 0px' }} />
                <div className={classes.secondStepContentDiv}>
                    <FormLabel component="legend">Payment Method</FormLabel>
                    <Typography>Select upto 5 payment methods</Typography>
                    <div className={classes.paymentMethodDiv}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Chip size="small" label="Payment Method" style={{ borderRadius: '8px' }}/>
                            <Tooltip title="Remove" arrow>
                                <CloseIcon />
                            </Tooltip>
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex' }}>
                                <Typography style={{ color: 'rgb(94, 102, 115)', }}>Full Name</Typography>
                                <Typography style={{ marginLeft: '24px', fontWeight: 700 }}>Muhammad Usman</Typography>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <Typography style={{ color: 'rgb(94, 102, 115)', }}>Mobile Number</Typography>
                                <Typography style={{ marginLeft: '24px', fontWeight: 700 }}>03478451114</Typography>
                            </div>
                        </div>
                    </div>
                    <Button
                        style={{ marginTop: '4px' }}
                        variant="outlined"
                        color="secondary"
                        onClick={handlePaymentMethodDialogClickOpen}
                        startIcon={<AddOutlinedIcon fontSize="small"/>}
                    >
                        Add
                    </Button>
                </div>
                <div className={classes.secondStepContentDiv} style={{ marginTop: '16px' }}>
                    <FormLabel component="legend">Payment Time Limit</FormLabel>
                    <FormControl variant="outlined" size="small">
                        <Select
                            value={10}
                            // onChange={handleChange}
                            >
                            <MenuItem value={10}>15 min</MenuItem>
                            <MenuItem value={20}>30 min</MenuItem>
                            <MenuItem value={30}>1 hour</MenuItem>
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
                        <div className={classes.paymentMethodDiv} onClick={e => handlePaymentMethodDialogClose()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Chip size="small" label="Payment Method" style={{ borderRadius: '8px' }}/>
                                <Link to="/profile/payment/p2p" target="_blank" className={classes.editPaymentMethodLink}>
                                    <EditIcon />
                                </Link>
                            </div>
                            <div style={{ marginTop: '16px' }}>
                                <div style={{ display: 'flex' }}>
                                    <Typography style={{ color: 'rgb(94, 102, 115)', }}>Full Name</Typography>
                                    <Typography style={{ marginLeft: '24px', fontWeight: 700 }}>Muhammad Usman</Typography>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <Typography style={{ color: 'rgb(94, 102, 115)', }}>Mobile Number</Typography>
                                    <Typography style={{ marginLeft: '24px', fontWeight: 700 }}>03478451114</Typography>
                                </div>
                            </div>
                        </div>
                        <div className={classes.paymentMethodDiv} onClick={e => handlePaymentMethodDialogClose()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Chip size="small" label="Payment Method" style={{ borderRadius: '8px' }}/>
                                <Link to="/profile" target="_blank" className={classes.editPaymentMethodLink}>
                                    <EditIcon />
                                </Link>
                            </div>
                            <div style={{ marginTop: '16px' }}>
                                <div style={{ display: 'flex' }}>
                                    <Typography style={{ color: 'rgb(94, 102, 115)', }}>Full Name</Typography>
                                    <Typography style={{ marginLeft: '24px', fontWeight: 700 }}>Muhammad Usman</Typography>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <Typography style={{ color: 'rgb(94, 102, 115)', }}>Mobile Number</Typography>
                                    <Typography style={{ marginLeft: '24px', fontWeight: 700 }}>03478451114</Typography>
                                </div>
                            </div>
                        </div>
                        <div className={classes.paymentMethodDiv} onClick={e => handlePaymentMethodDialogClose()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Chip size="small" label="Payment Method" style={{ borderRadius: '8px' }}/>
                                <Link to="/profile" target="_blank" className={classes.editPaymentMethodLink}>
                                    <EditIcon />
                                </Link>
                            </div>
                            <div style={{ marginTop: '16px' }}>
                                <div style={{ display: 'flex' }}>
                                    <Typography style={{ color: 'rgb(94, 102, 115)', }}>Full Name</Typography>
                                    <Typography style={{ marginLeft: '24px', fontWeight: 700 }}>Muhammad Usman</Typography>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <Typography style={{ color: 'rgb(94, 102, 115)', }}>Mobile Number</Typography>
                                    <Typography style={{ marginLeft: '24px', fontWeight: 700 }}>03478451114</Typography>
                                </div>
                            </div>
                        </div>
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
                            onClick={handlePaymentMethodDialogClose}
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
                    <FormLabel component="legend">Remarks (Optional)</FormLabel>
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
                    />
                </div>
                <div style={{ marginTop: '16px', width: '90%' }}>
                    <FormLabel component="legend">Auto Reply (Optional)</FormLabel>
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
                    />
                </div>
                <div style={{ marginTop: '16px', width: '90%' }}>
                    <FormLabel component="legend">Counterparty Conditions</FormLabel>
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
                            checked={false}
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
                            checked={false}
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
                </div>
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
                        {activeStep === getSteps().length ? (
                        <div>
                            <Typography>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Button onClick={handleReset}>
                            Reset
                            </Button>
                        </div>
                        ) : (
                        <div>
                            {getStepContent(activeStep)}
                            <div className={classes.stepsButtonsDiv}>
                                <Button disabled={activeStep === 0} onClick={handleBack}>
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                >
                                    {activeStep === getSteps().length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                        )}
                    </div>
                </Paper>
            </Box>
        </>
    );    
}

export const P2PPostAdScreen = P2PPostAdComponent;