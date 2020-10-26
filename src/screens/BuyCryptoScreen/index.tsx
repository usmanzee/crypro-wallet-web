import * as React from "react";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { 
    Box, 
    Container, 
    Typography,
    Paper,
    Grid,
    TextField,
    List,
    ListItem,
    ListItemText,
    // InputAdornment,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
 } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
 import Autocomplete from '@material-ui/lab/Autocomplete';
 import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
//  import CheckIcon from '@material-ui/icons/Check';
import {
    ToggleButtonGroup,
    ToggleButton,
    Alert
} from '@material-ui/lab';

import Axios from "axios";

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
        padding: "1.5rem"
    },
    pageHeader: {
        fontWeight: 500,
        padding: "20px 0px",
        borderBottom: "1px solid rgb(233, 236, 240)"
    },
    pageContent: {
        padding: "20px 0px",
    },
    gridMarginTop: {
        marginTop: "2rem",
    },
    paymentMethodButton: {
        margin: "10px",
        color: "Black",
        '&:hover': {
            backgroundColor: "white",
            boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.38)"
        },
        '&:not(:first-child)': {
            marginLeft: "0px",
            borderLeft: "1px solid rgb(173 168 168)"
        },
        '&:not(:last-child)': {
            marginLeft: "0px",
            borderLeft: "1px solid rgb(173 168 168)"
        },
        "&$selectedPaymentMethodButton": {
            margin: "10px",
            border: "2px solid rgb(111 33 88)",
            color: "rgb(111 33 88)",
            backgroundColor: "white",
            '&:hover': {
                backgroundColor: "white",
                boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.38)"
            },
            '&:not(:first-child)': {
                marginLeft: "0px",
            },
            '&:not(:last-child)': {
                marginLeft: "0px",
            },
        }
    },
    selectedPaymentMethodButton: {},
    paymentChannelIcon: { 
        height: "1.8rem", 
        width: "1.8rem", 
        marginRight: "0.3rem" 
    },
    paymentDetails: {
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    },
    continueButton: {
        float: "right",
        color: "white",
        width: "50%",
        backgroundColor: "rgb(111 33 88)",
        '&:hover': {
            backgroundColor: "rgb(111 33 88)",
        },
    },
    iframe: {
        position: 'absolute',
        left: '0',
        right: '0',
        bottom: '0',
        top: '0',
        border: '0',
    }
  }),
);


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BuyCryptoScreen = () => {
    const classes = useStyles();

    const [amount, setAmount] = React.useState<any | undefined>('');
    const [showAmountError, setShowAmountError] = React.useState<boolean>(false);
    const [amountErrorMessage, setAmountErrorMessage] = React.useState<string | undefined>('');
    const [channelErrorMessage, setChannelErrorMessage] = React.useState<string | undefined>('');

    const [fiatCurrencies, setFiatCurrencies] = React.useState<Currency[]>([]);
    const [cryptoCurrencies, setCryptoCurrencies] = React.useState<Currency[]>([]);

    const [fiatCurrencyOption, setFiatCurrencyOption] = React.useState<Currency | null>(null);
    const [cryptoCurrencyOption, setCryptoCurrencyOption] = React.useState<Currency | null>(null);
    
    const [paymentMethod, setPaymentMethod] = React.useState<string | null>(paymentMethods[0]['value']);

    const [buyCryptoDialogOpen, setBuyCryptoDialogOpen] = React.useState(false);


    React.useEffect(() => {
        if(!fiatCurrencies.length) {
            getCurrencies();
        } else {
            setFiatCurrencyOption(fiatCurrencies[0]);
        }
        if(!cryptoCurrencies.length) {
            getCurrencies();
        } else {
            setCryptoCurrencyOption(cryptoCurrencies[0]);
        }
    }, [fiatCurrencies, cryptoCurrencies]);

    const handleClickOpen = () => {
        setBuyCryptoDialogOpen(true);
      };
    
      const handleClose = () => {
        setBuyCryptoDialogOpen(false);
      };

    
    const getCurrencies = async () => {
        await Axios.get("http://localhost:9002/api/v2/peatio/public/supported_currencies")
        .then((response) => {
            setFiatCurrencies(filterCurrencies(response.data ,'fiat'));    
            setCryptoCurrencies(filterCurrencies(response.data ,'crypto'));
            
        });
    }

    const filterCurrencies = (currencies: Currency[], type) => {
        return currencies.filter((currency: Currency) => {
            return currency.type === type
        })
    }

    const handleAmountChangeEvent = (event: any) => {
        setAmount(event.target.value);
        checkAmountLimit(event.target.value, fiatCurrencyOption);
        
    }

    const handleFiatCurrencyChangeEvent = (option: Currency | null) => {
        checkAmountLimit(amount, option);
    }
    const handleCryptoCurrencyChengeEvent = (option: Currency | null) => {
    }

    const handlePaymentMethodChange = (event: React.MouseEvent<HTMLElement>, newPaymentMethod: string | null) => {
        if (newPaymentMethod !== null && paymentMethod !== newPaymentMethod) {
            setPaymentMethod(newPaymentMethod);
            checkAmountLimit(amount, fiatCurrencyOption);
        }
    };

    const checkAmountLimit = (amount: any | undefined, baseCurrency: Currency | null)=> {

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

    const iframeStyle = 'width: auto; height: 50vh; border: none';
    const url = 'https://buy-staging.moonpay.io?apiKey=pk_test_4tW5NgbaBAFE8nhJKXt3razQZqVnL1Ul&defaultCurrencyCode=eth&colorCode=%236F2158'; 
    const buyCryptoIframe = `<iframe style="${iframeStyle}" src="${url}" allow="accelerometer; autoplay; camera; gyroscope; payment" frameborder="0"></iframe>`;

    const bcrpyo = `<div>
                        <iframe id="iFrame1" src="${url}" frameborder="0" style="box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12); height:100vh;width:auto;"></iframe>
                    </div>`

    const Iframe = (props) => {
        return (
          <div
            dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }}
          />
        );
      }

    return (
        <>
            <Box className={classes.root}>
                <Container className={classes.container}>
                    <Paper elevation={5} className={classes.paper}>
                        <Typography variant="h5" component="div" className={classes.pageHeader} gutterBottom>Buy Crypto</Typography>

                        <div className={classes.pageContent}>

                            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                                Slide in alert dialog
                            </Button>
                            <Dialog
                                open={buyCryptoDialogOpen}
                                TransitionComponent={Transition}
                                keepMounted
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-slide-title"
                                aria-describedby="alert-dialog-slide-description"
                            >
                                <DialogTitle id="alert-dialog-slide-title">{"Use Google's location service?"}</DialogTitle>
                                <DialogContent>
                                <DialogContentText id="alert-dialog-slide-description">
                                    {/* Let Google help apps determine location. This means sending anonymous location data to
                                    Google, even when no apps are running. */}
                                    <Iframe iframe={buyCryptoIframe}/>
                                </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Disagree
                                </Button>
                                <Button onClick={handleClose} color="primary">
                                    Agree
                                </Button>
                                </DialogActions>
                            </Dialog>
                            {/* <Grid container>
                                <Grid item md={4}></Grid>
                                <Grid item md={4}>
                                    <Iframe iframe={buyCryptoIframe}/>
                                </Grid>
                                <Grid item md={4}></Grid>
                            </Grid> */}
                            <Grid item container>
                                <Grid item md={4}>
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
                                <Grid item md={2}>
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
                                <Grid item md={1} style={{ textAlign: "center" }}>
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
                            </Grid>
                        </div>
                       
                    </Paper>
                </Container>
            </Box>
        </>
    );
}

export {
    BuyCryptoScreen
}

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