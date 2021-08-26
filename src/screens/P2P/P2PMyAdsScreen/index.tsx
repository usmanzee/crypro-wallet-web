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
import { PageHeader } from '../../../containers/PageHeader';
import { useStyles } from './style';


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


  
type Props = RouterProps & InjectedIntlProps;
const P2PMyAdsComponent = (props: Props) => {
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
            <PageHeader pageTitle={'My Ads'} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={clsx(classes.pageContent)} >

                    <div className={classes.tabsHeader}>
                        <div>
                            <Link to="/p2p/offers" className={classes.inActivePage}>
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
                        <div style={{ display: 'flex' }}>
                           
                        </div>
                    </div>
                </Paper>
            </Box>
        </>
    );    
}

export const P2PMyAdsScreen = P2PMyAdsComponent;