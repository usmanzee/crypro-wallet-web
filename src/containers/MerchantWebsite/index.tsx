import * as React from "react";

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import * as MerchantApi from "../../apis/merchant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        flexGrow: 1,
        // marginTop: "10px"
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
    },
    textField: {
        fontSize: "1.5rem",
        marginBottom: "5px"
    },
    saveWebsiteButton: {
        marginTop: "15px",
        backgroundColor: "rgb(111 33 88)",
        '&:hover': {
            backgroundColor: "rgb(111 33 88)",
        },
    },
  }),
);

interface WebsiteState {
    url?: string;
    hook?: string;
}

const MerchantWebsite = () => {
    const classes = useStyles();

    const [website, setWebsite] = React.useState<WebsiteState>({});
    const [open, setOpen] = React.useState(false);

    const [values, setValues] = React.useState<WebsiteState>({
        url: '',
        hook: ''
    });

    React.useEffect(() => {
        MerchantApi.getMerchantWebsiteDetail().then((response) => {
            if(response.status == 200) {
                setWebsite(response.data);

                setValues((preValues) => ({
                    ...preValues,
                    url: response.data.url,
                    hook: response.data.hook
                }));
            }
        });
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (prop: keyof WebsiteState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const submitForm = () => {
        MerchantApi.createMerchant().then((response) => {
            
        });
        setOpen(false);
    }
    return (
        <>
            <Box className={classes.root}>
                <Paper elevation={5} className={classes.paper}>
                    <div className={classes.header}>
                        <h3>Website Details</h3>
                    </div>
                    <Grid>
                        <Grid item xs={6} sm={12} container>
                            <div className={classes.body}>
                                {website ? (
                                    <>
                                        <p><strong>URL: </strong>{website.url}</p>
                                        <small><strong>Hook: </strong>{website.hook}</small>
                                    </>
                                ) : (
                                    <>
                                        <div className={classes.bodyEmpty}>
                                            <p>If you prefer to control where your payment buttons are allowed to be embedded, add your domains and subdomains here.</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Grid>
                    </Grid>
                    <div className={classes.footer}>
                                <div className={classes.footerLink} onClick={handleClickOpen}>{website ? "Update" : "Enter"} Website Details</div>
                    </div>
                </Paper>

            </Box>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Website Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                           The domain on which you plan to host a checkout widget. Be sure to include https://.
                        </DialogContentText>
                        <TextField
                            id="website-url"
                            label="Website URl:"
                            placeholder="URl (Https://your-domain.com)"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={values.url}
                            onChange={handleChange('url')}
                        />

                        <TextField
                            id="website-hook"
                            label="WebHook:"
                            placeholder="EndPoint (Https://...)"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={values.hook}
                            onChange={handleChange('hook')}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth={true}
                            className={classes.saveWebsiteButton}
                            startIcon={<SaveIcon />}
                            onClick={submitForm}
                        >
                        {website ? "Update" : "Save"}
                    </Button>
                    </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
        </>
    );
}

export {
    MerchantWebsite,
};
