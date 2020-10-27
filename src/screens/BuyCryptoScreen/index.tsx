import * as React from "react";
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { fade, makeStyles, createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { CryptoIcon } from '../../components';

import { 
    RootState, 
    selectUserInfo, 
    User, 
} from '../../modules';

import { 
    MOON_PAY_URL, 
    MOON_PAY_PUBLIC_KEY 
} from '../../constants'
import { fetchMoonpayCurrencies } from '../../apis/currency';
import { fetchRate } from '../../apis/exchange';
import axios from 'axios';
import {
    ToggleButtonGroup,
    ToggleButton,
    Alert
} from '@material-ui/lab';

interface ReduxProps {
    user: User;
}

interface Currency {
    id: string;
    type: string;
    name: string;
    code: string;
    maxAmount: number;
    minAmount: number;
}

// interface PaymentMethod {
//     id: number,
//     name: string,
//     iconUrl: string
// }

// interface PaymentChannel {
//     id: number,
//     name: string,
//     value: string,
//     iconUrl: string,
//     supported_channels: PaymentMethod[]
// }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "1rem"
    },
    container: {
        
    },
    paper: {
        padding: theme.spacing(2)
    },
    pageHeader: {
        fontWeight: 500,
        padding: `${theme.spacing(1)}px 0px`,
        borderBottom: "1px solid rgb(233, 236, 240)"
    },
    pageContent: {
        padding: "20px 0px",
    },
    pageContnetText: {
        alignItems: 'center', 
        maxWidth: '400px', 
        margin: 'auto',
        [theme.breakpoints.only('sm')]: {
            display: 'none',
        },
        [theme.breakpoints.only('xs')]: {
            display: 'none',
        },
    },
    inputLabel: {
        fontWeight: 500,
        margin: `${theme.spacing(1)}px 0px`
    },
    currencySelect: {
        display: 'flex',
        cursor: 'pointer',
        padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
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
    fiatCurrencySelect: {
        display: 'flex',
        cursor: 'pointer',
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
        marginLeft:'auto', 
        marginRight:'0'
    },
    gridMarginTop: {
        marginTop: "2rem",
    },
    // paymentMethodButton: {
    //     margin: "10px",
    //     color: "Black",
    //     '&:hover': {
    //         backgroundColor: "white",
    //         boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.38)"
    //     },
    //     '&:not(:first-child)': {
    //         marginLeft: "0px",
    //         borderLeft: "1px solid rgb(173 168 168)"
    //     },
    //     '&:not(:last-child)': {
    //         marginLeft: "0px",
    //         borderLeft: "1px solid rgb(173 168 168)"
    //     },
    //     "&$selectedPaymentMethodButton": {
    //         margin: "10px",
    //         border: "2px solid rgb(111 33 88)",
    //         color: "rgb(111 33 88)",
    //         backgroundColor: "white",
    //         '&:hover': {
    //             backgroundColor: "white",
    //             boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.38)"
    //         },
    //         '&:not(:first-child)': {
    //             marginLeft: "0px",
    //         },
    //         '&:not(:last-child)': {
    //             marginLeft: "0px",
    //         },
    //     }
    // },
    // selectedPaymentMethodButton: {},
    // paymentChannelIcon: { 
    //     height: "1.8rem", 
    //     width: "1.8rem", 
    //     marginRight: "0.3rem" 
    // },
    // paymentDetails: {
    //     padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    // },
    // continueButton: {
    //     float: "right",
    //     color: "white",
    //     width: "50%",
    //     backgroundColor: "rgb(111 33 88)",
    //     '&:hover': {
    //         backgroundColor: "rgb(111 33 88)",
    //     },
    // },
    inputMargin: {
        margin: `${theme.spacing(2)}px 0px`
    },
    divider: {
        height: 28,
        margin: 4,
        // margin: '0px 8px'
    },
    iframe: {
        width: '100%', 
        height: '70vh', 
        border: 'none'
    },
    iframeLoaderDiv: {
        margin: '0px',
        padding: '0px',
        position: 'absolute',
        right: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(255, 255, 255)',
        opacity: '0.8',
    }
  }),
);


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type Props = ReduxProps;
const BuyCryptoComponent = (props: Props) => {
    const classes = useStyles();

    const [amount, setAmount] = React.useState<any | undefined>('');
    const [rate, setRate] = React.useState<string>('');
    const [showAmountError, setShowAmountError] = React.useState<boolean>(false);
    const [amountErrorMessage, setAmountErrorMessage] = React.useState<string | undefined>('');
    const [channelErrorMessage, setChannelErrorMessage] = React.useState<string | undefined>('');

    const [supportedCurrencies, setSupportedCurrencies] = React.useState<Currency[]>([]);
    const [fiatCurrencies, setFiatCurrencies] = React.useState<Currency[]>([]);
    const [cryptoCurrencies, setCryptoCurrencies] = React.useState<Currency[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [fiatAnchorEl, setFiatAnchorEl] = React.useState<null | HTMLElement>(null);

    const [fiatCurrencyOption, setFiatCurrencyOption] = React.useState<Currency | null>(null);
    const [cryptoCurrencyOption, setCryptoCurrencyOption] = React.useState<Currency | null>(null);
    
    const [paymentMethod, setPaymentMethod] = React.useState<string | null>(paymentMethods[0]['value']);

    const [buyCryptoDialogOpen, setBuyCryptoDialogOpen] = React.useState(false);
    const [fetchingRate, setFetchingRate] = React.useState(true);
    
    const [moonPayURL, setMoonPayURL] = React.useState<string>('');
    const [showIframe, setShowIframe] = React.useState<boolean>(false);
    const [iframeLoading, setIframeLoading] = React.useState<boolean>(true);

    let url = `${MOON_PAY_URL}?apiKey=${MOON_PAY_PUBLIC_KEY}&colorCode=%236F2158&walletAddress=bchtest:qrn45hfjpqd0w5p7dur5a2aasgp3nj8d8qh4exym5k`;

    const selectedFiatCurrencyCode = fiatCurrencyOption && fiatCurrencyOption.code ? fiatCurrencyOption.code : '';
    const selectedCryptoCurrencyCode = cryptoCurrencyOption && cryptoCurrencyOption.code ? cryptoCurrencyOption.code : '';

    React.useEffect(() => {
        if(!supportedCurrencies.length) {
            getSupportedCurrencies();
        }
    }, []);
    
    React.useEffect(() => {
        if(supportedCurrencies.length > 0 && !fiatCurrencies.length) {
            setFiatCurrencies(filterCurrencies(supportedCurrencies ,'fiat'));
        } else {
            setFiatCurrencyOption(fiatCurrencies[0]);
        }
    }, [supportedCurrencies, fiatCurrencies]);

    React.useEffect(() => {
        if(supportedCurrencies.length > 0 && !cryptoCurrencies.length) {
            setCryptoCurrencies(filterCurrencies(supportedCurrencies ,'crypto'));
        } else {
            setCryptoCurrencyOption(cryptoCurrencies[0]);
        }
    }, [supportedCurrencies, cryptoCurrencies]);

    React.useEffect(() => {
        checkAmountLimit();
        fetchCurrencyRate();
        updateMoonPayURL();
    }, [amount]);

    React.useEffect(() => {
        checkAmountLimit();
        fetchCurrencyRate();
        updateMoonPayURL();
    }, [cryptoCurrencyOption]);
    
    React.useEffect(() => {
        checkAmountLimit();
        fetchCurrencyRate();
        updateMoonPayURL();
    }, [fiatCurrencyOption]);


    const handleBuyModalOpen = () => {
        setBuyCryptoDialogOpen(true);
    };
    
    const handleBuyModalClose = () => {
        setBuyCryptoDialogOpen(false);
    };

    
    const getSupportedCurrencies = async () => {

        const response = await fetchMoonpayCurrencies();
        if(response.data) {
            setSupportedCurrencies(response.data);    
        }
    }

    const fetchCurrencyRate = async () => {
        if(selectedCryptoCurrencyCode && selectedFiatCurrencyCode && amount) {
            setRate('');
            setFetchingRate(true);
            const response = await fetchRate(selectedCryptoCurrencyCode, selectedFiatCurrencyCode, amount);
            if(response.data) {
                setFetchingRate(false);
                setRate(response.data);
            }
        } else {
            // setFetchingRate(false);
            setRate('');
        }
    }

    const filterCurrencies = (currencies: Currency[], type) => {
        return currencies.filter((currency: Currency) => {
            return currency.type === type
        })
    }

    const updateMoonPayURL = () => {
        setMoonPayURL (url + `&currencyCode=${selectedCryptoCurrencyCode.toLocaleLowerCase()}&baseCurrencyAmount=${amount}&baseCurrencyCode=${selectedFiatCurrencyCode.toLocaleLowerCase()}&email=${props.user.email}&externalCustomerId=${props.user.uid}`);
    }

    const handleAmountChangeEvent = (event: any) => {
        const value = event.target.value;
        setAmount(value);
    }

    const handlePaymentMethodChange = (event: React.MouseEvent<HTMLElement>, newPaymentMethod: string | null) => {
        if (newPaymentMethod !== null && paymentMethod !== newPaymentMethod) {
            setPaymentMethod(newPaymentMethod);
            // checkAmountLimit(amount, fiatCurrencyOption);
        }
    };

    const checkAmountLimit = () => {
        
        const baseCurrency = fiatCurrencyOption;
        if(amount && baseCurrency) {
            if(amount < baseCurrency.minAmount) {
                setShowAmountError(true);
                setAmountErrorMessage("Amount entered may not be suffecient for current payment channel.");
                setChannelErrorMessage(`Insufficient amount. Minimum limit is ${baseCurrency.minAmount} ${baseCurrency.code.toUpperCase()}`);
                return;
            } else {
                setShowAmountError(false);
                setAmountErrorMessage("");
                setChannelErrorMessage("");
            }
            
            if(amount > baseCurrency.maxAmount) {
                setShowAmountError(true);
                setAmountErrorMessage("Amount entered may exceed the limit of current payment channel.");
                setChannelErrorMessage(`Limit exceeded. Maximum limit per transaction is 17000 EUR ${baseCurrency.maxAmount} ${baseCurrency.code.toUpperCase()}`);
                return;
            } else {
                setShowAmountError(false);
                setAmountErrorMessage("");
                setChannelErrorMessage("");
            }
        } else {
            setShowAmountError(false);
            setAmountErrorMessage("");
            setChannelErrorMessage("");
        }
    }

    const handleCurrencySelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFiatCurrencySelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setFiatAnchorEl(event.currentTarget);
    };
    
    const handleCurrencySelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (anchorEl) {
          anchorEl.focus();
        }
        setAnchorEl(null);
    };
    
    const handleFiatCurrencySelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (fiatAnchorEl) {
          fiatAnchorEl.focus();
        }
        setFiatAnchorEl(null);
    };

    const isValidForm = () => {
        return !amount || !Boolean(Number(amount) > 0) || showAmountError || fetchingRate; 
    }

    const handleFromSubmit = () => {
        // updateMoonPayURL();
        setShowIframe(true);
        handleBuyModalOpen();
    }

    const popperOpen = Boolean(anchorEl);
    const popperId = popperOpen ? 'crypto-currencies' : undefined;

    const fiatPopperOpen = Boolean(fiatAnchorEl);
    const fiatPopperId = fiatPopperOpen ? 'fiat-currencies' : undefined;

    const renderFiatCurrencyDropDown = () => {
        return (
            <>
                <div className={classes.fiatCurrencySelect} onClick={handleFiatCurrencySelectClick}>
                    {fiatCurrencyOption ? 
                        (<>
                            <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                                { fiatCurrencyOption.code.toUpperCase() }
                            </Typography>
                            {/* <Typography variant="body2" component="div" className={classes.currencyName}>
                                { fiatCurrencyOption.name }
                            </Typography>  */}
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
                        value={fiatCurrencyOption}
                        onChange={(event: any, selectedOption: Currency | null) => {
                            setFiatCurrencyOption(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption = {(option: Currency | null | undefined) => {
                            const optionCurrency = option ? option.code.toUpperCase() : '';
                            return <React.Fragment>
                                <div style={{ display: 'flex' }}>
                                    <Chip label={ option ? option.code.toUpperCase(): '' } className={classes.currencyCode}/>
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        { option ? option.name : '' }
                                    </Typography>
                                    
                                </div>
                            </React.Fragment>
                        }}
                        options={fiatCurrencies}
                        getOptionLabel={(option: Currency | null | undefined) => option ? option.name: ''}
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

    const renderCryptoDropdown = () => {
        return (
            <>
                <div className={classes.currencySelect} onClick={handleCurrencySelectClick}>
                    {cryptoCurrencyOption ? 
                        (<>
                            <CryptoIcon code={cryptoCurrencyOption.code.toUpperCase()} width="25"/>
                            <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                                { cryptoCurrencyOption.code.toUpperCase() }
                            </Typography>
                            <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                { cryptoCurrencyOption.name }
                            </Typography> 
                            <div className={classes.selectDownArrow}>
                                <ArrowDropDownIcon/> 
                            </div>
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
                        Select
                    </div>
                    <Autocomplete
                        open
                        onClose={handleCurrencySelectClose}
                        disableCloseOnSelect={false}
                        value={cryptoCurrencyOption}
                        onChange={(event: any, selectedOption: Currency | null) => {
                            setCryptoCurrencyOption(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption = {(option: Currency | null | undefined) => {
                            const optionCurrency = option ? option.code.toUpperCase() : '';
                            return <React.Fragment>
                                <CryptoIcon code={optionCurrency} width="25"/>
                                <div style={{ display: 'flex' }}>
                                    <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                                        { option ? option.code.toUpperCase(): '' }
                                    </Typography>
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        { option ? option.name : '' }
                                    </Typography>
                                </div>
                            </React.Fragment>
                        }}
                        options={cryptoCurrencies}
                        getOptionLabel={(option: Currency | null | undefined) => option ? option.name: ''}
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
            <Box className={classes.root}>
                <Container className={classes.container}>
                    <Paper elevation={1} className={classes.paper}>
                        <Typography variant="h5" component="div" className={classes.pageHeader} gutterBottom>Buy Crypto</Typography>

                        <div className={classes.pageContent}>

                            <Grid container>
                                <Grid item md={6}>
                                   <div className={classes.pageContnetText}>
                                        <Typography variant="h4" gutterBottom>
                                            Buy Bitcoin and other cryptocurrencies easily
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            Buy and invest in minutes using your credit card, bank transfer or Apple Pay.
                                        </Typography>
                                   </div>
                                </Grid>
                                <Grid item md={6}>
                                    <Paper style={{ padding: '16px 24px' }}>
                                        <div className={classes.inputMargin}>
                                            <InputLabel htmlFor="buy" className={classes.inputLabel}>
                                                I want to buy
                                            </InputLabel>
                                            {renderCryptoDropdown()}
                                        </div>
                                        <div className={classes.inputMargin}>
                                            <InputLabel htmlFor="sell" className={classes.inputLabel}>
                                                I want to spend
                                            </InputLabel>
                                            <FormControl variant="outlined" fullWidth error={showAmountError}>
                                                <OutlinedInput
                                                    id="sell"
                                                    // label="I want to spend"
                                                    placeholder={fiatCurrencyOption ? `${fiatCurrencyOption.minAmount} - ${fiatCurrencyOption.maxAmount}` : ''}
                                                    type='number'
                                                    value={amount}
                                                    onChange={handleAmountChangeEvent}
                                                    aria-describedby="sell-text"
                                                    autoFocus={true}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <Divider className={classes.divider} orientation="vertical" style={{ margin: '0px 8px' }}/>
                                                            <div>
                                                                {renderFiatCurrencyDropDown()}
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                                {showAmountError && <FormHelperText id="sell-text">{channelErrorMessage}</FormHelperText>}
                                            </FormControl>
                                        </div>
                                        <div className={classes.inputMargin}>
                                            <InputLabel htmlFor="rate" className={classes.inputLabel}>
                                                For this much
                                            </InputLabel>
                                            <FormControl variant="outlined" fullWidth>
                                                <OutlinedInput
                                                    id="rate"
                                                    // label="For this much"
                                                    value={rate}
                                                    disabled={true}
                                                    type='text'
                                                    aria-describedby="sell-text"
                                                    // startAdornment={
                                                    //     <InputAdornment position="start">
                                                    //         {fetchingRate && <CircularProgress size={14}/>}
                                                    //     </InputAdornment>
                                                    // }
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <Divider className={classes.divider} orientation="vertical" style={{ margin: '0px 8px' }}/>
                                                            <Typography variant="h6">{cryptoCurrencyOption && cryptoCurrencyOption.code ? cryptoCurrencyOption.code.toUpperCase() : ''}</Typography>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </FormControl>
                                        </div>
                                        <div className={classes.inputMargin}>
                                            <div>
                                                <Button 
                                                    color="primary" 
                                                    variant="contained"
                                                    fullWidth 
                                                    onClick={handleFromSubmit}
                                                    disabled={isValidForm()}
                                                >
                                                Buy {cryptoCurrencyOption && cryptoCurrencyOption.code ? cryptoCurrencyOption.code.toUpperCase() : ''}
                                                </Button>
                                            </div>
                                        </div>
                                    </Paper>
                                    <Button 
                                        variant="outlined"
                                        onClick={handleBuyModalOpen}
                                    >
                                        Buy Crypto
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* <Grid container>
                                <Grid item md={4} xs={12}>
                                <TextField
                                    id="amount"
                                    label="I want to spend"
                                    type="text"
                                    name={amount}
                                    placeholder="Enter Amount"
                                    autoFocus
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    onChange={handleAmountChangeEvent}
                                    error={showAmountError}
                                    helperText={amountErrorMessage}
                                />
                                </Grid>
                                <Grid item md={2} xs={12}>
                                    <Autocomplete
                                        id="fiat-currency" 
                                        blurOnSelect     
                                        value={fiatCurrencyOption}
                                        onChange={(event: any, selectedOption: Currency | null) => {
                                            setFiatCurrencyOption(selectedOption);
                                            handleFiatCurrencyChangeEvent(selectedOption);
                                        }}                           
                                        options={fiatCurrencies}
                                        getOptionSelected={(option: Currency, value: Currency) => {
                                            return option.code == value.code;
                                        }}
                                        getOptionLabel={(option: Currency) => {   
                                            return option ? option.code.toUpperCase() : ""
                                        }}
                                        renderOption={(option) => (
                                            
                                            <span>{ option ? option.code.toUpperCase() : "" }</span>
                                        )}
                                        renderInput={(params) => {
                                            return (
                                                <TextField 
                                                {...params} 
                                                    label="Select Currency" 
                                                    placeholder="Select Your Currency" 
                                                    style={{ marginLeft: "3px" }} 
                                                    fullWidth 
                                                    InputLabelProps={{ 
                                                        shrink: true 
                                                    }} 
                                                    variant="outlined" 
                                                    />
                                                )
                                                }}
                                    />
                                </Grid>
                                <Grid item md={1} xs={12} style={{ textAlign: "center" }}>
                                    <ArrowForwardIcon fontSize="large" style={{ position: "relative", top: "10px" }}/>
                                </Grid>
                                <Grid item md={3}>
                                <Autocomplete
                                    id="crypto-currency"
                                    blurOnSelect
                                    value={cryptoCurrencyOption}
                                    onChange={(event: any, selectedOption: Currency | null) => {
                                        setCryptoCurrencyOption(selectedOption);
                                        handleCryptoCurrencyChengeEvent(selectedOption);
                                    }} 
                                    options={cryptoCurrencies}
                                    getOptionSelected={(option: Currency, value: Currency) => {
                                        return option.code == value.code;
                                    }}
                                    getOptionLabel={(option) => {   
                                        return option ? option.code.toUpperCase() : ""
                                    }}
                                    renderOption={(option) => (
                                        <>
                                          <span>{ option ? option.code.toUpperCase() : "" }</span>
                                        </>
                                    )}
                                    renderInput={(params) => {
                                        return (
                                            <TextField 
                                                {...params}
                                                label="Select Currency" 
                                                placeholder="Select Your Currency" 
                                                style={{ marginLeft: "3px" }} 
                                                fullWidth 
                                                InputLabelProps={{ 
                                                    shrink: true 
                                                }} 
                                                variant="outlined"
                                            />
                                            )
                                            }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container className={classes.gridMarginTop}>
                                <Grid item md={6}>
                                    <Typography variant="h6" gutterBottom>1. Choose your payment channel</Typography>
                                </Grid>
                                <Grid item md={6}>
                                    <Typography variant="h6" gutterBottom>2. Payment details</Typography>
                                </Grid>
                            </Grid>
                            <Grid item container>
                                <Grid item md={6}>
                                    <ToggleButtonGroup
                                        style={{ display: "block" }}
                                        value={paymentMethod}
                                        exclusive
                                        onChange={handlePaymentMethodChange}
                                        orientation="horizontal"
                                        >
                                        {paymentMethods.map((paymentChannel) => {
                                            return (
                                                <ToggleButton
                                                    key={paymentChannel.id}
                                                    
                                                    classes={{ root: classes.paymentMethodButton, selected: classes.selectedPaymentMethodButton }}
                                                    value={paymentChannel.value}
                                                    >
                                                    <img src={`/assests/${paymentChannel.iconUrl}`} className={classes.paymentChannelIcon} alt="Buy Crypto"/>
                                                    <span> {paymentChannel.name}</span>
                                                    <span style={{ marginLeft: "3rem" }}>
                                                        {paymentChannel.supported_channels.map((supportedMethod) => {
                                                            return (
                                                                <img key={supportedMethod.id} src={`assests/${supportedMethod.iconUrl}`} alt="Buy Crypto"/>
                                                                
                                                            )
                                                        })}
                                                    </span>
                                                </ToggleButton>
                                            )
                                        })}   
                                    </ToggleButtonGroup>
                                </Grid>
                                <Grid item md={6}>
                                    <Paper variant="outlined" className={classes.paymentDetails}>
                                        {showAmountError ? 
                                            <Alert severity="error" style={{ margin:"1rem 0" }}>{channelErrorMessage}</Alert> 
                                            : ""
                                        }
                                        <List style={{ borderBottom: "1px solid rgb(233, 236, 240)", marginBottom: "1rem" }}>
                                            <ListItem style={{ padding: "0" }}>
                                                <ListItemText>Payment Method</ListItemText>
                                                <ListItemText style={{ flex: "0.1 1 auto" }}> <img src="/assests/moonpay.svg" style={{ width:"2rem", height:"2rem" }}/> MoonPay</ListItemText>
                                            </ListItem>
                                            <ListItem style={{ padding: "0" }}>
                                                <ListItemText>Deposit to account</ListItemText>
                                                <ListItemText style={{ flex: "0.1 1 auto" }}> usman.jamil0308@gmail.com</ListItemText>
                                            </ListItem>
                                            <ListItem style={{ padding: "0" }}>
                                                <ListItemText>Total including fee</ListItemText>
                                                <ListItemText style={{ flex: "0.1 1 auto" }}> {amount} {fiatCurrencyOption ? fiatCurrencyOption.code.toUpperCase(): ""}</ListItemText>
                                            </ListItem>
                                            <ListItem style={{ padding: "0" }}>
                                                <ListItemText>You will get</ListItemText>
                                                <ListItemText style={{ flex: "0.1 1 auto" }}> {amount} {cryptoCurrencyOption ? cryptoCurrencyOption.code.toUpperCase(): ""}</ListItemText>
                                            </ListItem>
                                        </List>
                                        <Typography variant="h6" display="block" gutterBottom>Disclaimer</Typography>
                                        <Typography variant="subtitle1" display="block" gutterBottom>
                                            You will now leave Binance.com and be taken to Banxa. Services relating to payments are provided by Banxa which is a separate platform owned by a third party. Please read and agree to Banxa's Terms of Use before using their service. For any questions relating to payments, please contact support@banxa.com. Binance does not assume any responsibility for any loss or damage caused by the use of this payment service.
                                        </Typography>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<Checkbox name="checkedA" color="primary" />}
                                                label="I have read and agree to the Terms of Use."
                                            />
                                        </FormGroup>
                                        <Grid container>
                                            <Grid item md>
                                                <Button className={classes.continueButton} variant="contained">Continue</Button>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid> */}
                        </div>
                       
                    </Paper>
                </Container>
            </Box>

            <Dialog
                open={buyCryptoDialogOpen}
                TransitionComponent={Transition}
                keepMounted
                fullWidth
                maxWidth="xs"
                onClose={handleBuyModalClose}
            >
                <DialogContent>
                    {iframeLoading ?
                        <>
                            <div className={classes.iframeLoaderDiv}>
                                <CircularProgress style={{ position: 'absolute', left: '45%',top:'50%'  }} />
                            </div>
                        </>
                    : null}
                    <DialogContentText>
                    {showIframe ? <iframe className={classes.iframe} src={moonPayURL} onLoad={() => setIframeLoading(false)} allow="accelerometer; autoplay; camera; gyroscope; payment"></iframe> : null}

                    </DialogContentText>
                    <div style={{ padding: '0px 16px' }}>
                        <Button 
                            variant="outlined"
                            fullWidth 
                            onClick={handleBuyModalClose}
                        >
                            Exit
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
});

export const BuyCryptoScreen = injectIntl(connect(mapStateToProps)(BuyCryptoComponent))

export const paymentMethods = [
    {
        "id": 1,
        "name": "MoonPay",
        "value": "moonpay",
        "method_id": "credit_debit_card",
        "iconUrl": "moonpay.svg",
        "supported_channels": [
            {
                "id": 1,
                "name": "Visa Payment",
                "iconUrl": "visa.svg"
            },
            {
                "id": 2,
                "name": "Mastercard Payment",
                "iconUrl": "mastercard.svg"
            }

        ]
    },
    {
        "id": 2,
        "name": "SEPA",
        "value": "sepa",
        "method_id": "sepa_bank_transfer",
        "iconUrl": "sepa.png",
        "supported_channels": [
            {
                "id": 1,
                "name": "Bank Transfer",
                "iconUrl": "bank_transfer.svg"
            }

        ]
    }
]