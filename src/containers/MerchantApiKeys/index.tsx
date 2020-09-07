import * as React from "react";

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import * as MerchantApi from "../../apis/merchant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: "20px"
    },
    header: {
        fontSize: "20px",
        lineHeight: "1.5",
        color: "rgb(111 33 88)",
        padding: "20px 0px",
        margin: "0px 20px",
        borderBottom: "1px solid rgb(233, 236, 240);"
    },
    body: {
        fontSize: "16px",
    },
    bodyEmpty: {
        padding: "50px 20px",
    },
    footer: {
        borderTop: "1px solid rgb(233, 236, 240)",
        textAlign: "right",
        color: "rgb(111 33 88)",
        fontSize: "16px",
        padding: "20px 0px",
    },
    footerLink: {
        fontSize: "16px",
        color: "rgb(111 33 88)",
        cursor: "pointer",
        marginRight: "20px"
    }
  }),
);

const MerchantApiKeys = () => {
    const classes = useStyles();

    const createMerchantKey = () => {
        MerchantApi.createMerchantKey().then((response) => {
            console.log(response);
        });
    }
    return (
        <>
            <Paper className={classes.root}>
                <div className={classes.header}>
                    <h3>API Keys</h3>
                </div>
                <Grid container className={classes.root} spacing={1}>
                    <Grid item xs={6} sm={12} container>
                        <div className={classes.body}>
                           <div className={classes.bodyEmpty}>
                               <p>Create an API key to create and update charges using the B4U merchant API.</p>
                           </div>
                        </div>
                    </Grid>
                </Grid>
                <div className={classes.footer}>
                    <div className={classes.footerLink} onClick={createMerchantKey}>Create API Key</div>
                </div>
            </Paper>
        </>
    );
}

export {
    MerchantApiKeys,
};
