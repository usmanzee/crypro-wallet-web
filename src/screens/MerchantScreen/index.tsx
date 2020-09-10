import * as React from 'react';
import "./merchant.css";

import { makeStyles, createStyles, Theme, useTheme } from '@material-ui/core/styles';
import { MerchantProfile } from "../../containers/MerchantProfile";
import { MerchantApiKeys } from "../../containers/MerchantApiKeys";
import { MerchantWebsite } from "../../containers/MerchantWebsite";
import { MerchantPayments } from "../../containers/MerchantPayments";

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // height: "100%",
      // backgroundColor: "rgb(249 249 249)",
      padding: "10px"
    },
    tabs: {
      backgroundColor: "white",
      color: "rgb(111 33 88)",
    },
    tabIndicator: {
      backgroundColor: "rgb(111 33 88)"
    }
  }),
);

const MerchantScreen = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Box className={classes.root}>
        <Container>
        <AppBar position="static" color="default" >
          <Tabs
            className={classes.tabs}
            classes={{ indicator: classes.tabIndicator }}
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Profile" {...a11yProps(0)} />
            <Tab label="Key" {...a11yProps(1)} />
            <Tab label="Website" {...a11yProps(2)} />
            <Tab label="Payments" {...a11yProps(3)} />
          </Tabs>
        </AppBar>

          <TabPanel value={value} index={0} dir={theme.direction}>
            <MerchantProfile />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <MerchantApiKeys />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <MerchantWebsite />
          </TabPanel>
          <TabPanel value={value} index={3} dir={theme.direction}>
            <MerchantPayments />
          </TabPanel>
        </Container>
      </Box>
    </>
  );
}


export {
  MerchantScreen
}; 