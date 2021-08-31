import * as React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { 
    Box, 
    Paper,
    Typography,
    Button,
    TextField,
    useMediaQuery,
} from '@material-ui/core';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import clsx from  'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';

//Local imports
import { PageHeader } from '../../containers/PageHeader';
import { useStyles } from './style';


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


  
type Props = RouterProps & InjectedIntlProps;
const AddP2PPaymentMethodComponent = (props: Props) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [priceTypes, setPriceTypes] = React.useState([
        {'name': 'Fixed', 'value': 'fixed'},
        {'name': 'Floating', 'value': 'floating'}
    ]);

    const [selectedPriceType, setSelectedPriceType] = React.useState('fixed');
    const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreenPaymentDialog = useMediaQuery(theme.breakpoints.down('sm'));

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

   
    return (
        <>
            <PageHeader pageTitle={'Add Payment Method'} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={clsx(classes.pageContent)} >
                    <div className={classes.contentDiv}>
                        <div style={{ display: 'flex' }}>
                            <div className={classes.paymentMethodColor}></div>
                            <Typography variant="body1" style={{ fontWeight: 700, fontSize: '16px' }}>Payment Method1</Typography>
                        </div>
                        <div style={{ marginTop: '40px' }}>
                           <div>
                                <Typography variant="body1" style={{ color: 'rgb(118, 128, 143)', marginBottom: '4px', fontWeight: 700 }}>Full name</Typography>
                                <TextField
                                    type="text"
                                    placeholder='Please enter your full name'
                                    name="search"
                                    autoComplete='off'
                                    size="small"
                                    fullWidth
                                    color="secondary"
                                    // value={searchedValue}
                                    // onChange={this.handleInputSearchChange}
                                />
                           </div>
                           <div style={{ marginTop: '40px'}}>
                                <Typography variant="body1" style={{ color: 'rgb(118, 128, 143)', marginBottom: '4px', fontWeight: 700 }}>Jazzcash Phone Number</Typography>
                                <TextField
                                    type="text"
                                    placeholder='Please enter your jazz cash phone number'
                                    name="search"
                                    autoComplete='off'
                                    size="small"
                                    fullWidth
                                    color="secondary"
                                    // value={searchedValue}
                                    // onChange={this.handleInputSearchChange}
                                />
                           </div>
                           <div style={{ marginTop: '40px'}}>
                                <Typography variant="body1" style={{ color: 'rgb(118, 128, 143)', marginBottom: '4px', fontWeight: 700 }}>Other payment details (for international transfer)(Optional)</Typography>
                                <TextField
                                    type="text"
                                    placeholder='details like your own address, the address of the bank, the IBAN code and SWIFTBIC code, etc.'
                                    name="search"
                                    autoComplete='off'
                                    size="small"
                                    fullWidth
                                    color="secondary"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    rowsMax={4}
                                    // value={searchedValue}
                                    // onChange={this.handleInputSearchChange}
                                />
                           </div>
                           <div style={{ marginTop: '40px'}}>
                                <Typography variant="body1" style={{ marginBottom: '4px', fontWeight: 700 }}>Tips</Typography>
                                <Typography variant="body2" style={{ color: 'rgb(118, 128, 143)', marginBottom: '4px', }}>Tips: When you sell your cryptocurrency, the added payment method will be shown to the buyer during the transaction. To accept cash transfer, please make sure the information is correct.</Typography>
                           </div>
                           <div style={{ marginTop: '24px', display: 'flex'}}>
                                <Button variant="contained" fullWidth>Cancel</Button>
                                <Button variant="contained" color="secondary" fullWidth	style={{ marginLeft: '8px' }}>
                                    Submit
                                </Button>
                           </div>
                        </div>
                    </div>
                </Paper>
            </Box>
        </>
    );    
}

export const AddP2PPaymentMethodScreen = AddP2PPaymentMethodComponent;