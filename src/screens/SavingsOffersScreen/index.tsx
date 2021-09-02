import * as React from 'react';
import { useTheme, withStyles } from '@material-ui/core/styles';
import { 
    Box, 
    Paper,
    Typography,
    Button,
    TextField,
    useMediaQuery,
    Popper,
    InputBase,
    InputLabel,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Chip,
    IconButton,
    AppBar,
    Tabs,
    Tab,
    Switch
} from '@material-ui/core';
import { StyledTableCell } from '../materialUIGlobalStyle';

import { DateRangePicker, DateRange, DateRangeDelimiter, LocalizationProvider } from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns"; // choose your lib

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import EditIcon from '@material-ui/icons/Edit';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import SystemUpdateAltOutlinedIcon from '@material-ui/icons/SystemUpdateAltOutlined';
import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import clsx from  'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';

import { P2PVideoTutorialDialog } from '../../components/P2P/P2PVideoTutorialDialog';
import { P2PLinks } from '../../components/P2P/P2PLinks';
import { setDocumentTitle } from '../../helpers';
import { PageHeader } from '../../containers/PageHeader';
import { useStyles } from './style';

import {
    useParams,
    useHistory
} from "react-router-dom";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
        {value === index && (
            <Box>
                {children}
            </Box>
        )}
        </div>
    );
}
  
function a11yProps(index: any) {
    return {
      id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const AntTabs = withStyles({
    root: {
      backgroundColor: "white",
      borderBottom: '0.1rem solid rgb(170, 170, 170)',
      boxShadow: "none"
    }
  })(Tabs);
  
type Props = RouterProps & InjectedIntlProps;
const SavingsOffersComponent = (props: Props) => {
    const classes = useStyles();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [tabValue, setTabValue] = React.useState(0);

    React.useEffect(() => {
        setDocumentTitle('Saving Crypto | Best crypto saving platform');
    }, []);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };


    const renderFlexiableSavings = () => {
        return (
            <>
                <TableContainer>
                    <Table aria-label="Savings offers">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Coin
                                </StyledTableCell>
                                <StyledTableCell>
                                    Estimated Annual Yield
                                </StyledTableCell>
                                <StyledTableCell>
                                    Yesterday's Flexbile APY & Trend
                                </StyledTableCell>
                                <StyledTableCell>
                                    Flexible Interest Per Thousand
                                </StyledTableCell>
                                <StyledTableCell>
                                    Auto Transfer
                                </StyledTableCell>
                                <StyledTableCell>
                                    Actions
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow hover>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700, fontSize: '16px' }}>USDT</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700, fontSize: '18px', color: 'rgb(248, 73, 96)' }}>0.50%</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700 }}>0.50%</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700 }}>0.0137 USDT</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                        <Switch
                                            // checked={state.checkedA}
                                            // onChange={handleChange}
                                            name="auto_subscribe"
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                    <Button variant="contained" color="secondary">
                                        Subscribe
                                    </Button>
                                    </div>
                                </StyledTableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    }

    const renderLockedSavings = () => {
        return (
            <>
                <TableContainer>
                    <Table aria-label="Savings offers">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Coin
                                </StyledTableCell>
                                <StyledTableCell>
                                    Annualized Interest Rate
                                </StyledTableCell>
                                <StyledTableCell>
                                    Duration (days)
                                </StyledTableCell>
                                <StyledTableCell>
                                    Interest Per Lot
                                </StyledTableCell>
                                <StyledTableCell>
                                    Actions
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow hover>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700, fontSize: '16px' }}>USDT</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700, fontSize: '18px', color: 'rgb(248, 73, 96)' }}>0.50%</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                    <Button variant="outlined" color="secondary" style={{ marginRight: '8px' }}>
                                            15
                                        </Button>
                                        <Button variant="outlined" color="default" style={{ marginRight: '8px' }}>
                                            30
                                        </Button>
                                        <Button variant="outlined" color="default" style={{ marginRight: '8px' }}>
                                            60
                                        </Button>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700 }}>0.0137 USDT</Typography>
                                    </div>
                                </StyledTableCell>
                                
                                <StyledTableCell>
                                    <div style={{ }}>
                                    <Button variant="contained" color="secondary">
                                        Subscribe
                                    </Button>
                                    </div>
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
            <PageHeader pageTitle={'B4U Wallet Savings'} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={classes.pageContent} >
                <AppBar position="static" color="default" style={{ boxShadow: "none" }}>
                    <AntTabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant={isSmallScreen ? "scrollable" : "standard"}
                        scrollButtons="on"
                    >
                        <Tab component="a" label='Flexible Savings' {...a11yProps(0)} />
                        <Tab component="a" label={'Locked Savings'} {...a11yProps(1)} />
                        <Tab component="a" label={'Activities'} {...a11yProps(2)} />
                    </AntTabs>
                    </AppBar>
                    <TabPanel value={tabValue} index={0}>
                        <div style={{ margin: '16px 0px' }}>
                            {renderFlexiableSavings()}
                        </div>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <div style={{ margin: '16px 0px' }}>
                            {renderLockedSavings()}
                        </div>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <Typography variant="body1">Activities</Typography>
                    </TabPanel>
                </Paper>
            </Box>
        </>
    );    
}

export const SavingsOffersScreen = SavingsOffersComponent;