import * as React from 'react';
import { fade, makeStyles, Theme, createStyles, withStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import StarIcon from '@material-ui/icons/Star'
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import Button  from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Select from 'react-select';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';


import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';
import { connect } from 'react-redux';
import { Withdraw, WithdrawProps } from '../../../containers';
import { PageHeader } from '../../../containers/PageHeader';
import { TotalAmount } from '../../../containers/Wallets/TotalAmount';
import { ModalWithdrawConfirmation } from '../../../containers/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from '../../../containers/ModalWithdrawSubmit';
import { WalletItemProps, CryptoIcon } from '../../../components';
import { globalStyle } from '../../materialUIGlobalStyle';
import { setDocumentTitle } from '../../../helpers';

import { 
    selectUserInfo,
    RootState, 
    selectWallets, 
    selectWalletsLoading, 
    selectWithdrawProcessing,
    selectWithdrawSuccess, 
    User, 
    walletsData, 
    walletsFetch, 
    walletsWithdrawCcyFetch,
    MemberLevels,
    memberLevelsFetch,
    selectMemberLevels,
} from '../../../modules';
import { CommonError } from '../../../modules/types';
import { WalletHistory } from '../../../containers/Wallets/History';
import * as PublicDataAPI from '../../../apis/public_data';

import {
    useParams,
    useHistory
  } from "react-router-dom";

interface ReduxProps {
    user: User;
    wallets: WalletItemProps[];
    withdrawProcessing: boolean;
    withdrawSuccess: boolean;
    walletsLoading?: boolean;
    memberLevels?: MemberLevels;
}

interface DispatchProps {
    fetchWallets: typeof walletsFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    memberLevelsFetch: typeof memberLevelsFetch;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...globalStyle(theme),
    pageHeader: {
        padding: "32px 24px",
        
    },
    verificationCheckCompleted: {
        color: '#02C076',
        marginTop: '4px',
        marginLeft: '2px'
    },
    verificationCheckIncompleted: {
        color: '#848E9C',
        marginTop: '4px',
        marginLeft: '2px'
    },
    statsDiv: { 
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            justifyContent:"space-between",
            marginTop: '24px', 
        },
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            marginTop: '24px', 
        },
    },
    statDiv: { 
        [theme.breakpoints.up('sm')]: {
            display: 'flex', 
            flexDirection: 'column'
        },
        [theme.breakpoints.down('sm')]: {
            display: 'flex', 
            flexDirection: 'row',
            justifyContent:"space-between",
        },
    },
    renderp2pOffers: {
        [theme.breakpoints.only('xs')]: {
            display: 'none',
        },
    },
    renderMobileP2pOffers: {
        [theme.breakpoints.only('xl')]: {
            display: 'none',
        },
        [theme.breakpoints.only('lg')]: {
            display: 'none',
        },
        [theme.breakpoints.only('md')]: {
            display: 'none',
        },
        [theme.breakpoints.only('sm')]: {
            display: 'none',
        },
    },
    advertiserName: {
        marginBottom: '8px', color: theme.palette.secondary.main
    },
    paymentMethodChip: {
        margin: `${theme.spacing(0.5)}px`,
        fontSize: '8px',
        height: theme.spacing(2)
    }
  }),
);

const StyledTableCell = withStyles((theme: Theme) =>
createStyles({
    head: {
        backgroundColor: "rgb(228 224 224)",
        color: theme.palette.common.black,
        fontSize: 14,
    },
    body: {
        fontSize: 14,
    },
}),
)(TableCell); 

// export interface AllFiatCurrency {
//     symbol:         string;
//     name:           string;
//     symbol_native:  string;
//     decimal_digits: number;
//     rounding:       number;
//     code:           string;
//     name_plural:    string;
// }

// export interface PaymentMethod {
//     value: number;
//     label: string;
// }

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;
const P2PAdvertiserDetailComponent = (props: Props) => {
    const classes = useStyles();

    React.useEffect(() => {
        setDocumentTitle('Buy and Sell Crypto on P2P');
    }, []);

    const pageTitle = 'Advertiser details';

    const renderMobileOffers = (type: string) => {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <span>USDT</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <div>
                            <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Price</span>
                            <div style={{ display: 'flex', marginRight: '8px' }}>
                                <span style={{ fontWeight: 600, fontSize: '20px' }}>10</span>
                                <span style={{ fontWeight: 400, marginLeft: '4px',  color: 'grey' }}>BTC</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Available</span>
                            <div style={{ display: 'flex', marginRight: '8px'}}>
                                <span style={{ fontWeight: 600,  marginLeft: '8px' }}>110,542.65 USDT</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Limit</span>
                            <div style={{ display: 'flex', marginRight: '8px'}}>
                            <span style={{ fontWeight: 600,  marginLeft: '8px' }}>₨60,000.00-₨713,000.09</span>
                            </div>
                        </div>
                    </div>
                    <Button variant="contained" style={{ color: 'white',backgroundColor: type == 'buy' ? '#02C076' : 'rgb(248, 73, 96)', fontSize: 14, margin: 'auto 0px' }}>{type}</Button>
                </div>
                <div style={{ display: 'flex', marginTop: '8px', flexWrap: 'wrap' }}>
                    <Tooltip title="Payment Method1" arrow>
                        <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                    </Tooltip>
                    <Tooltip title="Payment Method2" arrow>
                        <Chip size="small" label="Payment Method2" className={classes.paymentMethodChip}/>
                    </Tooltip>
                    <Tooltip title="Payment Method3" arrow>
                        <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                    </Tooltip>
                </div>
            </>
        );
    }
    const renderOffers = (type: string) => {
        return (
            <>
                <TableContainer>
                    <Table aria-label="P2P orders table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Coin
                                </StyledTableCell>
                                <StyledTableCell>
                                    Price
                                </StyledTableCell>
                                <StyledTableCell>
                                    Limit/Available
                                </StyledTableCell>
                                <StyledTableCell>
                                    Payment
                                </StyledTableCell>
                                <StyledTableCell>
                                    Trade
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow hover>
                                <StyledTableCell>
                                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                                        <span>USDT</span>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                        <span style={{ fontWeight: 600, }}>10</span>
                                        <span style={{ fontWeight: 400, fontSize: 10, marginLeft: '4px',  color: 'grey' }}>BTC</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                                        <div style={{ display: 'flex', flexDirection: 'row'}}>
                                            <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Available</span>
                                            <span style={{ fontWeight: 600,  marginLeft: '8px' }}>110,542.65 USDT</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row'}}>
                                            <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Limit</span>
                                            <span style={{ fontWeight: 600,  marginLeft: '8px' }}>₨60,000.00-₨713,000.09</span>
                                        </div>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ width: '50%' }}>
                                        <Tooltip title="Payment Method1" arrow>
                                            <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                                        </Tooltip>
                                        <Tooltip title="Payment Method2" arrow>
                                            <Chip size="small" label="Payment Method2" className={classes.paymentMethodChip}/>
                                        </Tooltip>
                                        <Tooltip title="Payment Method3" arrow>
                                            <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                                        </Tooltip>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Link to={`trading`} style={{ textDecoration: 'none' }}>
                                    <Button variant="contained" style={{ color: 'white',backgroundColor: type == 'buy' ? '#02C076' : 'rgb(248, 73, 96)', fontSize: 14, margin: 'auto 0px' }}>{type}</Button>
                                    </Link>
                                </StyledTableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    }
    return (
        <>
            <Box>
                <Paper className={classes.pageHeader}>
                    <Grid container>
                        <Typography variant="h4" display="inline">{pageTitle}</Typography>   
                    </Grid>
                    <Grid container style={{ justifyContent:"space-between", marginTop: '40px', }}>
                        <Typography variant="h6" display="inline">SARA TRADERS</Typography>
                        <Grid style={{display: 'flex' ,justifyContent:"space-between", borderBottom: '1px solid #EAECEF' }}>
                            <div style={{ marginRight: '24px' }}>
                                <Tooltip title="Verified" arrow>
                                    <div style={{ display: 'flex' }}>
                                        <Typography variant="subtitle1" display="inline">SMS</Typography>
                                        <CheckCircleRoundedIcon fontSize='small' className={classes.verificationCheckCompleted} />
                                    </div>
                                </Tooltip>
                            </div>
                            <div style={{ marginRight: '24px' }}>
                                <Tooltip title="Verified" arrow>
                                <div style={{ display: 'flex' }}>
                                    <Typography variant="subtitle1" display="inline">Email</Typography>
                                    <CheckCircleRoundedIcon fontSize='small' className={classes.verificationCheckCompleted} />
                                </div>
                                </Tooltip>
                            </div>
                            <div style={{ }}>
                                <Tooltip title="Verification Required" arrow>
                                    <div style={{ display: 'flex' }}>
                                        <Typography variant="subtitle1" display="inline">ID Verification</Typography>
                                        <CheckCircleRoundedIcon fontSize='small' className={classes.verificationCheckIncompleted} />
                                    </div>
                                </Tooltip>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.statsDiv}>
                        <div className={classes.statDiv}>
                            <Typography variant="button" display="inline" style={{ color: '#848E9C' }}>Security deposit</Typography>
                            <Typography variant="h6" display="inline">10.00 BUSD</Typography>
                        </div>
                        <div className={classes.statDiv}>
                            <Typography variant="button" display="inline" style={{ color: '#848E9C' }}>Total orders</Typography>
                            <Typography variant="h6" display="inline">1156</Typography>
                        </div>
                        <div className={classes.statDiv}>
                            <Typography variant="button" display="inline" style={{ color: '#848E9C' }}>30d completion rate</Typography>
                            <Typography variant="h6" display="inline">99.76%</Typography>
                        </div>
                        <div className={classes.statDiv}>
                            <Typography variant="button" display="inline" style={{ color: '#848E9C' }}>30d orders</Typography>
                            <Typography variant="h6" display="inline">820</Typography>
                        </div>
                        <div className={classes.statDiv}>
                            <Typography variant="button" display="inline" style={{ color: '#848E9C' }}>Avg release time</Typography>
                            <Typography variant="h6" display="inline">2.87 Minutes</Typography>
                        </div>
                    </Grid>
                </Paper>
            </Box>
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={classes.pageContent}>
                    <Typography variant="h6" display="inline" style={{ color: '#848E9C', marginBottom: '24px' }}>Buy from the user</Typography>
                        <div className={classes.renderp2pOffers}>
                            {renderOffers('buy')}
                        </div>
                        <div className={classes.renderMobileP2pOffers}>
                            {renderMobileOffers('buy')}
                        </div>
                </Paper>
                <div style={{ marginTop: '16px' }}>
                    <Paper className={classes.pageContent}>
                        <Typography variant="h6" display="inline" style={{ color: '#848E9C', marginBottom: '24px' }}>Sell to the user</Typography>
                            <div className={classes.renderp2pOffers}>
                                {renderOffers('sell')}
                            </div>
                            <div className={classes.renderMobileP2pOffers}>
                                {renderMobileOffers('sell')}
                            </div>
                    </Paper>
                </div>
            </Box>
        </>
    );
    
}

export const P2PAdvertiserDetailScreen = P2PAdvertiserDetailComponent;