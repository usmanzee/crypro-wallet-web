import * as React from 'react';
import "./fee.css";

//Table Imports
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

//Tabs Imports
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import * as FeeApi from "../../apis/fee";

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
        <Box style={{ marginTop: "10px" }}>
          <Typography>{children}</Typography>
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
    fontSize: "14px !important",
    boxShadow: "none"
  },
  indicator: {
    backgroundColor: '#580e38',
  },
})(Tabs);

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

class FeeScreen extends React.Component<[],any> {
    constructor(props) {
        super(props);
    
        this.state = {
          withdrawlDepositFees: [],
          tradingFees: [],
          tabValue: 0
        };
      }
    componentDidMount() {
      
        this.getTradingFee();
    }
    getTradingFee() {
      FeeApi.getTradingFee().then((responseData) => {
        this.setState({
          tradingFees: responseData
        });
      });
    }
    getWithdrawlDepositFees() {
      FeeApi.getWithdrawlDepositFees().then((responseData) => {
        this.setState({
          withdrawlDepositFees: responseData
        });
      });
    }
    render() {
      
      const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
          console.log(newValue);
          this.setState({
              tabValue: newValue
            })

            if(newValue === 0) {
              this.getTradingFee();
            }

            if(newValue === 1) {
              this.getWithdrawlDepositFees();
            }
          };
        return (
          <div className="container pg-layout">
            <AppBar position="static" color="default" style={{ boxShadow: "none" }}>
              <AntTabs value={this.state.tabValue} onChange={handleChange} variant="fullWidth" indicatorColor="primary" centered>
                <Tab label="Trading Fee" {...a11yProps(0)} />
                <Tab label="Deposit & Withdrawl Fees" {...a11yProps(1)} />
              </AntTabs>
            </AppBar>
            <TabPanel value={this.state.tabValue} index={0}>
              {/* <h1>Trading Fee Schedule</h1> */}
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Group</StyledTableCell>
                        <StyledTableCell>Market</StyledTableCell>
                        <StyledTableCell>Maker</StyledTableCell>
                        <StyledTableCell>Taker</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.tradingFees.map((row) => (
                        <TableRow hover key={row.id}>
                          <StyledTableCell component="th" scope="row">
                            {row.group}
                          </StyledTableCell>
                          <StyledTableCell>{row.market_id}</StyledTableCell>
                          <StyledTableCell>{row.maker}</StyledTableCell>
                          <StyledTableCell>{row.taker}</StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={1}>
              
              {/* <h1>Deposit & Withdrawl Fees</h1> */}
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Coin/Token</StyledTableCell>
                          <StyledTableCell>Name</StyledTableCell>
                          <StyledTableCell>Withdraw Fee</StyledTableCell>
                          <StyledTableCell>Min Withdraw Fee</StyledTableCell>
                          <StyledTableCell>Withdraw Limit 24h</StyledTableCell>
                          <StyledTableCell>Withdraw Limit 72h</StyledTableCell>
                          <StyledTableCell>Deposit Fee</StyledTableCell>
                          <StyledTableCell>Min Deposit Fee</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.withdrawlDepositFees.map((row) => (
                          <TableRow key={row.id}>

                            <StyledTableCell><img style={{maxWidth: "20px"}} src={row.icon_url}/>  {row.id.toUpperCase()}</StyledTableCell>
                            <StyledTableCell>{row.name}</StyledTableCell>
                            <StyledTableCell>{row.withdraw_fee}</StyledTableCell>
                            <StyledTableCell>{row.min_withdraw_amount}</StyledTableCell>
                            <StyledTableCell>{row.withdraw_limit_24h}</StyledTableCell>
                            <StyledTableCell>{row.withdraw_limit_72h}</StyledTableCell>
                            <StyledTableCell>{row.deposit_fee}</StyledTableCell>
                            <StyledTableCell>{row.min_deposit_amount}</StyledTableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
            </TabPanel>
          </div>
        )
    }
  }

export {
  FeeScreen,
};