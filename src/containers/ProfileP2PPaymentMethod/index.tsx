import * as React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { 
    Paper,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    useMediaQuery,
    GridList
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import clsx from  'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';

//Local imports
import { useStyles } from './style';


type Props = RouterProps & InjectedIntlProps;
const ProfileP2PPaymentMethodComponent = (props: Props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));
    const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = React.useState(false);

    const handlePaymentMethodDialogClickOpen = () => {
        setPaymentMethodDialogOpen(true);
    };
    
    const handlePaymentMethodDialogClose = () => {
        setPaymentMethodDialogOpen(false);
    };
    return (
        <>
            <div className={classes.tabsHeader} style={{ margin: '16px 0px' }}>
                <div>
                    <Link to="/profile/payment/p2p" className={classes.activePage}>
                            <Typography variant="h6" component="div" display="inline">
                                P2P
                            </Typography>
                    </Link>
                </div>
            </div>
            <div>
                <div className={classes.p2pInfoDiv}>
                    <Typography variant="body1" className={classes.p2pInfo}>P2P payment methods: When you sell cryptocurrencies, the payment method added will be displayed to buyer as options to accept payment, please ensure that the account owner’s name is consistent with your verified name on Binance. You can add up to 20 payment methods.</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon fontSize="small"/>}
                        onClick={handlePaymentMethodDialogClickOpen}
                    >
                        Add a payment method
                    </Button>
                </div>
                <Paper style={{ margin: '16px 0px' }}>
                    <div style={{ display: 'flex', backgroundColor: 'rgb(250, 250, 250)', padding: '16px', justifyContent: 'space-between' }}>
                        <Typography variant="h6" style={{ fontWeight: 700 }}>Jazzcash</Typography>
                        <div>
                            <Button>Edit</Button>
                            <Button>Delete</Button>
                        </div>
                    </div>
                    <div style={{ marginTop: '16px', padding: '16px', }} >
                        <div className={classes.paymentMethodInfoDiv}>
                            <Typography style={{ color: 'rgb(94, 102, 115)', }}>Full Name</Typography>
                            <Typography style={{ marginLeft: '24px', fontWeight: 700 }}>Muhammad Usman</Typography>
                        </div>
                        <div className={classes.paymentMethodInfoDiv}>
                            <Typography style={{ color: 'rgb(94, 102, 115)', }}>Mobile Number</Typography>
                            <Typography style={{ marginLeft: '24px', fontWeight: 700 }}>03478451114</Typography>
                        </div>
                    </div>
                </Paper>
            </div>

            <Dialog
                fullScreen={fullScreenDialog}
                fullWidth={true}
                maxWidth='sm'
                open={paymentMethodDialogOpen}
                onClose={handlePaymentMethodDialogClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Select a Payment Methods</Typography>
                            <CloseIcon onClick={e => handlePaymentMethodDialogClose()} style={{ cursor: 'pointer', }}/>
                        </div>
                        <div style={{ marginTop: '8px' }}>
                            <TextField
                                type="text"
                                placeholder='Search payment method...'
                                name="search"
                                autoComplete='off'
                                size="small"
                                color="secondary"
                                fullWidth
                                // value={searchedValue}
                                // onChange={this.handleInputSearchChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent style={{ height: '392px', overflow: 'auto' }}>
                    <div style={{ marginTop: '16px' }}>
                        <GridList cellHeight={40} cols={fullScreenDialog ? 1 : 2}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method1</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography>Payment Method2</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method3</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={classes.paymentMethodsDiv}></div>
                                <Link to="/profile/payment/p2p/1" className={classes.paymentMethodLink}>
                                    <Typography >Payment Method4</Typography>
                                </Link>
                            </div>
                        </GridList>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export const ProfileP2PPaymentMethod = ProfileP2PPaymentMethodComponent;