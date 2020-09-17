import * as React from "react";
import "./buyCrypto.css";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { 
    Box, 
    Container, 
    Typography,
    Paper,
    Grid,
    TextField,
    // InputAdornment
 } from '@material-ui/core';
 import Autocomplete from '@material-ui/lab/Autocomplete';
 import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
//  import CheckIcon from '@material-ui/icons/Check';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';

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
//     supportedMethods: PaymentMethod[]
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
    }
  }),
);

const BuyCryptoScreen = () => {
    const classes = useStyles();

    const [fiatCurrencies, setFiatCurrencies] = React.useState<Currency[]>([]);
    const [cryptoCurrencies, setCryptoCurrencies] = React.useState<Currency[]>([]);

    const [fiatCurrencyOption, setFiatCurrencyOption] = React.useState<Currency | null>(null);
    const [cryptoCurrencyOption, setCryptoCurrencyOption] = React.useState<Currency | null>(null);
    
    const [alignment, setAlignment] = React.useState<string | null>(paymentChannels[0]['value']);



    React.useEffect(() => {
        if(!fiatCurrencies.length) {
            getCurrencies();
        } else {
            //setFiatCurrencyOption(fiatCurrencies[0]);
        }
        if(!cryptoCurrencies.length) {
            getCurrencies();
        } else {
            setCryptoCurrencyOption(cryptoCurrencies[0]);
        }
    }, [fiatCurrencies, cryptoCurrencies]);

    
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

    const fiatCurrencyOptionChengeEvent = () => {
        
    }
    const cryptoCurrencyOptionChengeEvent = () => {

    }


  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment);
  };

    return (
        <>
            <Box className={classes.root}>
                <Container className={classes.container}>
                    <Paper elevation={5} className={classes.paper}>
                        <Typography variant="h5" component="div" color="primary" className={classes.pageHeader} gutterBottom>Buy Crypto</Typography>
                        <Typography component="div" className={classes.pageContent}>
                            <Grid item container>
                                <Grid item md={4}>
                                <TextField
                                    id="amount"
                                    label="I want to spend"
                                    placeholder="Enter Amount"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                />
                                </Grid>
                                <Grid item md={2}>
                                <Autocomplete
                                    id="fiat-currency"      
                                    clearOnBlur={false}                             
                                    options={fiatCurrencies}
                                    value={fiatCurrencyOption}
                                    getOptionLabel={(option: Currency) => {   
                                        return option ? option.code : ""
                                    }}
                                    
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
                                    freeSolo={false}
                                    options={cryptoCurrencies}
                                    value={cryptoCurrencyOption}
                                    getOptionLabel={(option) => {   
                                        return option ? option.code : ""
                                    }}
                                    renderOption={(option) => (
                                        <>
                                          {/* <img src={option.icon_url} style={{ width: "10%", marginRight: "5px" }}/> */}
                                          <span>{ option ? option.code : "" }</span>
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
                                                // InputProps={{
                                                //     ...params.InputProps,
                                                //     startAdornment: (
                                                //       <InputAdornment position="start">
                                                //         <img src={selectedCryptoIcon} style={{ width: "2em", height: "2em" }}/>
                                                //       </InputAdornment>
                                                //     )
                                                //   }}
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
                                        value={alignment}
                                        exclusive
                                        onChange={handleAlignment}
                                        orientation="horizontal"
                                        >
                                        {paymentChannels.map((paymentChannel) => {
                                            return (
                                                <ToggleButton
                                                    key={paymentChannel.id}
                                                    classes={{ root: classes.paymentMethodButton, selected: classes.selectedPaymentMethodButton }}
                                                    value={paymentChannel.value}
                                                    >
                                                    <img src={`/assests/${paymentChannel.iconUrl}`} className={classes.paymentChannelIcon} alt="Buy Crypto"/>
                                                    <span> {paymentChannel.name}</span>
                                                    <span style={{ marginLeft: "3rem" }}>
                                                        {paymentChannel.supportedMethods.map((supportedMethod) => {
                                                            return (
                                                                <img key={supportedMethod.id} src={`assests/${supportedMethod.iconUrl}`} style={{ height: "2rem", width: "2rem" }} alt="Buy Crypto"/>
                                                                
                                                            )
                                                        })}
                                                    </span>
                                                </ToggleButton>
                                            )
                                        })}   
                                    </ToggleButtonGroup>  
                                </Grid>
                                <Grid item md={6}>
                                        <Paper variant="outlined" style={{ padding: "1rem" }}>
                                            <Typography variant="button" display="block" gutterBottom>Disclaimer</Typography>
                                            <Typography variant="subtitle1" display="block" gutterBottom>
                                                You will now leave Binance.com and be taken to Banxa. Services relating to payments are provided by Banxa which is a separate platform owned by a third party. Please read and agree to Banxa's Terms of Use before using their service. For any questions relating to payments, please contact support@banxa.com. Binance does not assume any responsibility for any loss or damage caused by the use of this payment service.
                                            </Typography>
                                        </Paper>
                                </Grid>
                            </Grid>
                        </Typography>
                       
                    </Paper>
                </Container>
            </Box>
        </>
    );
}

export {
    BuyCryptoScreen
}

export const paymentChannels = [
    {
        "id": 1,
        "name": "MoonPay",
        "value": "moonpay",
        "iconUrl": "moonpay.svg",
        "supportedMethods": [
            {
                "id": 1,
                "name": "visa",
                "iconUrl": "visa.svg"
            },
            {
                "id": 2,
                "name": "mastercard",
                "iconUrl": "mastercard.svg"
            }

        ]
    },
    // {
    //     "id": 2,
    //     "name": "Simplex",
    //     "value": "simplex",
    //     "iconUrl": "simplex.svg",
    //     "supportedMethods": [
    //         {
    //             "id": 1,
    //             "name": "visa",
    //             "iconUrl": "visa.svg"
    //         },
    //         {
    //             "id": 2,
    //             "name": "mastercard",
    //             "iconUrl": "mastercard.svg"
    //         }

    //     ]
    // }
]