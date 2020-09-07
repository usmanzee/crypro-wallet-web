import * as React from "react";

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: "10px"
    },
    header: {
        fontSize: "20px",
        lineHeight: "1.5",
        color: "rgb(111 33 88)",
        padding: "20px 0px",
        margin: "0px 20px",
        borderBottom: "1px solid rgb(233, 236, 240);"
    },
    contactInformation: {
        padding: "20px"
    },
    account: {
        marginBottom: "20px",
        padding: "20px 0px",
        borderBottom: "1px solid rgb(233, 236, 240);"
    },
    support: {
        marginBottom: "20px",
        borderBottom: "1px solid rgb(233, 236, 240);"
    },
    password: {
        marginBottom: "20px",
        borderBottom: "1px solid rgb(233, 236, 240);"
    },
    emailMessage: {
        maxWidth: "600px",
        fontSize: "14px",
        lineHeight: "30px",
        color: "rgb(121, 127, 134)",
        margin: "0px",
    },
    email: {
        fontSize: "16px"
    }
  }),
);

const MerchantProfile = () => {
    const classes = useStyles();
    return (
        <>
            <Paper className={classes.root}>
                <div className={classes.header}>
                    <h3>Profile</h3>
                </div>
                <Grid container className={classes.root} spacing={1}>
                    <Grid item xs={6} sm={12} container style={{ borderBottom: "1px solid rgb(233, 236, 240);" }}>
                        <div className={classes.contactInformation}>
                            <div className={classes.account}>
                                <h3>Account Information</h3>
                                <div>
                                    <h5>Account email Address</h5>
                                    <p className={classes.emailMessage}>Used to sign in to your account and notify you when payments have been received.</p>
                                    <p className={classes.email}>
                                        <strong>usman@gmail.com</strong>
                                    </p>
                                </div>
                            </div>
                            <div className={classes.support}>
                                <div>
                                <h5>Account email Address</h5>
                                    <p className={classes.emailMessage}>Your support email is used on receipts to allow customers to contact you about their purchases and payment.</p>
                                    <p className={classes.email}>
                                        <strong>usman@gmail.com</strong>
                                    </p>
                                </div>
                            </div>
                            <div className={classes.password}>
                            <h3>Account Information</h3>
                                <div>
                                    <h5>Password</h5>
                                    <p className={classes.emailMessage}>Your password is used to secure access to your account. You’ll need your existing password on hand to change it.</p>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}

export {
    MerchantProfile
}
