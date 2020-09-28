import * as React from 'react';

//Table Imports
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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
            <AppBar position="static" style={{backgroundColor: "white", color: "black"}}>
              <Tabs value={this.state.tabValue} onChange={handleChange} aria-label="simple tabs example">

                <Tab label="Trading Fee" {...a11yProps(0)} />
                <Tab label="Deposit & Withdrawl Fees" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <TabPanel value={this.state.tabValue} index={0}>
              <h1>Trading Fee Schedule</h1>            
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Group</TableCell>
                        <TableCell>Market</TableCell>
                        <TableCell>Maker</TableCell>
                        <TableCell>Taker</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.tradingFees.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.group}
                          </TableCell>
                          <TableCell>{row.market_id}</TableCell>
                          <TableCell>{row.maker}</TableCell>
                          <TableCell>{row.taker}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={1}>
              
              <h1>Deposit & Withdrawl Fees</h1>             
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Coin/Token</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Withdraw Fee</TableCell>

                          <TableCell>Min Withdraw Fee</TableCell>
                          <TableCell>Withdraw Limit 24h</TableCell>
                          <TableCell>Withdraw Limit 72h</TableCell>
                          <TableCell>Deposit Fee</TableCell>
                          <TableCell>Min Deposit Fee</TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.withdrawlDepositFees.map((row) => (
                          <TableRow key={row.id}>

                            <TableCell><img style={{maxWidth: "20px"}} src={row.icon_url}/>  {row.id.toUpperCase()}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.withdraw_fee} {row.symbol}</TableCell>
                            <TableCell>{row.min_withdraw_amount}</TableCell>
                            <TableCell>{row.withdraw_limit_24h}</TableCell>
                            <TableCell>{row.withdraw_limit_72h}</TableCell>
                            <TableCell>{row.deposit_fee}</TableCell>
                            <TableCell>{row.min_deposit_amount}</TableCell>
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

  export {FeeScreen}
