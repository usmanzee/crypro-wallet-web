import * as React from "react";

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip';

import * as MerchantApi from "../../apis/merchant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    //   marginTop: "10px"
    },
    paper: {
      
    },
    header: {
        fontSize: "20px",
        lineHeight: "1.5",
        color: "rgb(111 33 88)",
        padding: "20px 0px",
        margin: "0px 20px",
        borderBottom: "1px solid rgb(233, 236, 240)"
    },
    body: {
        fontSize: "16px",
        padding: "30px 20px",
    },
    bodyEmpty: {
        textAlign: "center"
    },
    key: {
        fontFamily: "monospace",
        backgroundColor: "rgb(238, 238, 238)",
        marginRight: "10px",
        borderRadius: "4px",
        padding: "5px"
    },
    copyButton: {
        cursor: "pointer"
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

    const [key, setKey] = React.useState("");
    const [copyTooltipText, setCopyTooltipText] = React.useState("Copy");

    function copyToClipboard(text) {
        var textField = document.createElement('textarea')
        textField.innerText = text.key;
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        setCopyTooltipText('copied');
        textField.remove()
    };

    const setCopyTooltipTextOnMouseOut = () => {
        setCopyTooltipText('copy');
    }
    React.useEffect(() => {
        MerchantApi.getMerchantKey().then((response) => {
            console.log(response.data);
            setKey(response.data);
        });
    }, []);

    const getMerchantKey = () => {
        MerchantApi.getMerchantKey().then((response) => {
            console.log(response);
            setKey(response.data);
        });
    }
    return (
        <>
            <Box className={classes.root}>
                <Paper elevation={5} className={classes.paper}>
                    <div className={classes.header}>
                        <h3>Merchant Key</h3>
                    </div>
                    <Grid>
                        <Grid item md={12} container>
                            <div className={classes.body}>
                                { key ? (
                                    <>
                                        <span className={classes.key}>{key}</span>
                                        <Tooltip title={copyTooltipText} placement="top-start">
                                            <FileCopyIcon className={classes.copyButton} onClick={() => copyToClipboard({key})} onMouseOut={setCopyTooltipTextOnMouseOut}/>
                                        </Tooltip>
                                        
                                    </>
                                ) : (
                                    <>
                                    <div className={classes.bodyEmpty}>
                                        <p>Create an API key to create and update charges using the B4U merchant key.</p>
                                    </div>
                                    </>
                                )}
                            </div>
                        </Grid>
                    </Grid>
                    <div className={classes.footer}>
                        <div className={classes.footerLink} onClick={getMerchantKey}>{key ? "Update" : "Create"} Merchant Key</div>
                    </div>
                </Paper>
            </Box>
        </>
    );
}

export {
    MerchantApiKeys,
};
