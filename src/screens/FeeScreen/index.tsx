import * as React from 'react';

import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
//Table Imports
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

//Tabs Imports
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { CryptoIcon } from '../../components';

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
          <Typography component="div">{children}</Typography>
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


const useStyles = (theme: Theme) => ({
    pageHeader: {
		fontWeight: 500,
		padding: `${theme.spacing(1)}px 0px`,
		borderBottom: "1px solid rgb(233, 236, 240)"
	}
});

interface IState {
    withdrawlDepositFees: any[];
	tradingFees: any[];
	tabValue: number;
}
type Props =  InjectedIntlProps;

class FeeComponent extends React.Component<Props, IState> {
	
	constructor(props: Props) {
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
      	// const {classes} = this.props;
      	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
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
          <>
		  <Container>
		  		<Box p={[1, 3]}>
					<Paper>
						{/* <Typography variant="h5" component="div" className={classes.pageHeader} gutterBottom>
							Fee Schedule
                        </Typography> */}
						<AppBar position="static" color="default" style={{ boxShadow: "none" }}>
						<AntTabs value={this.state.tabValue} onChange={handleChange} variant="fullWidth" indicatorColor="primary" centered>
							<Tab component="a" label="Trading Fee" {...a11yProps(0)} />
							<Tab component="a" label="Deposit & Withdrawl Fees" {...a11yProps(1)} />
						</AntTabs>
						</AppBar>
						<TabPanel value={this.state.tabValue} index={0}>
						{/* <h1>Trading Fee Schedule</h1> */}
							<TableContainer>
							<Table>
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
									<StyledTableCell>{row.maker * 100}%</StyledTableCell>
									<StyledTableCell>{row.taker * 100}%</StyledTableCell>
									</TableRow>
								))}
								</TableBody>
							</Table>
							</TableContainer>
						</TabPanel>
						<TabPanel value={this.state.tabValue} index={1}>
						
						{/* <h1>Deposit & Withdrawl Fees</h1> */}
							<TableContainer>
								<Table>
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

										<StyledTableCell>
											{row.icon_url ? 
											<img width="25" src={row.icon_url} style={{ marginRight: '8px' }}/>
											:
											<CryptoIcon width="25" code={row.id.toUpperCase()} />
											}
											{row.id.toUpperCase()}
										</StyledTableCell>
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
				  	</Paper>
				</Box>
			</Container>
          </>
        )
    }
}

export const FeeScreen = injectIntl(withStyles(useStyles as {})(FeeComponent) as any);