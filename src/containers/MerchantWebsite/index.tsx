import * as React from "react";

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
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
    },
    textField: {
        fontSize: "1.5rem",
        marginBottom: "5px"
    },
    button: {
        margin: theme.spacing(1),
        backgroundColor: "rgb(111 33 88)",
        '&:hover': {
            backgroundColor: "rgb(111 33 88)",
        },
    },
  }),
);

interface State {
    url: string;
    hook: string;
  }

const MerchantWebsite = () => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const [values, setValues] = React.useState<State>({
        url: '',
        hook: ''
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const submitForm = () => {
        MerchantApi.createMerchant().then((response) => {
            
        });
        setOpen(false);
    }
    return (
        <>
            <Paper className={classes.root}>
                <div className={classes.header}>
                    <h3>Whitelisted Domain</h3>
                </div>
                <Grid container className={classes.root} spacing={1}>
                    <Grid item xs={6} sm={12} container>
                        <div className={classes.body}>
                           <div className={classes.bodyEmpty}>
                               <p>If you prefer to control where your payment buttons are allowed to be embedded, add your domains and subdomains here.</p>
                           </div>
                        </div>
                    </Grid>
                </Grid>
                <div className={classes.footer}>
                    <div className={classes.footerLink} onClick={handleClickOpen}>Whitelist a domain</div>
                </div>
            </Paper>


            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Whitelist a domain</DialogTitle>
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
                            label="Website URl:"
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
                    </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        onClick={submitForm}
                    >
                    Save
                  </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export {
    MerchantWebsite,
};
