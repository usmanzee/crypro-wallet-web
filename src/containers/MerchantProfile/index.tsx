import * as React from "react";

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import UpdateIcon from '@material-ui/icons/Update';
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
    contactInformation: {
        padding: "30px 20px",
    },
    account: {
        marginBottom: "20px",
        borderBottom: "1px solid rgb(233, 236, 240)"
    },
    support: {
        marginBottom: "20px",
        borderBottom: "1px solid rgb(233, 236, 240)"
    },
    password: {
        marginBottom: "20px",
        borderBottom: "1px solid rgb(233, 236, 240)"
    },
    emailMessage: {
        maxWidth: "600px",
        fontSize: "14px",
        lineHeight: "30px",
        color: "rgb(121, 127, 134)",
        margin: "0px",
        display: "inline-flex"

    },
    email: {
        fontSize: "16px"
    },
    changePasswordButton: {
        float: "right",
        color: "white",
        backgroundColor: "rgb(111 33 88)",
        '&:hover': {
            backgroundColor: "rgb(111 33 88)",
        },
    },
    passwordSubmitButton: {
        color: "white",
        marginTop: "15px",
        backgroundColor: "rgb(111 33 88)",
        '&:hover': {
            backgroundColor: "rgb(111 33 88)",
        },
    },
  }),
);

interface PasswordState {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const MerchantProfile = () => {
    const classes = useStyles();

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [passwordValues, setPasswordValues] = React.useState<PasswordState>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleClickDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handlePasswordInputChange = (prop: keyof PasswordState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const name = event.target.name;
        console.log(name, value);
        setPasswordValues({ ...passwordValues, [prop]: value });
    };

    const handlePasswordFormSubmit = () => {
        let data = {
            old_password: passwordValues.currentPassword,
            new_password: passwordValues.newPassword,
            confirm_password: passwordValues.confirmPassword
        };
        MerchantApi.changeMerchantPassword(data).then((response) => {
            console.log(response);
        });
        setDialogOpen(false);
    }

    return (
        <>
            <Box className={classes.root}>
                <Paper elevation={5} className={classes.paper}>
                    <div className={classes.header}>
                        <h3>Profile</h3>
                    </div>
                    <Grid>
                        <Grid item md={12}>
                            <div className={classes.contactInformation}>
                                <div className={classes.account}>
                                    <h3>Account Information</h3>
                                    <div>
                                        <h5>Account Email Address</h5>
                                        <p className={classes.emailMessage}>Used to sign in to your account and notify you when payments have been received.</p>
                                        <p className={classes.email}>
                                            <strong>usman@gmail.com</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className={classes.support}>
                                    <div>
                                    <h5>Support Email Address</h5>
                                        <p className={classes.emailMessage}>Your support email is used on receipts to allow customers to contact you about their purchases and payment.</p>
                                        <p className={classes.email}>
                                            <strong>usman@gmail.com</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className={classes.password}>
                                <h3>Password</h3>
                                    <div>
                                        <p className={classes.emailMessage}>Your password is used to secure access to your account. You’ll need your existing password on hand to change it.</p>
                                        <Button variant="contained" className={classes.changePasswordButton} onClick={handleClickDialogOpen}>
                                            Change Password
                                        </Button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        </DialogContentText>
                        <TextField
                            id="current-password"
                            label="Current Password"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            type="password"
                            value={passwordValues.currentPassword}
                            name="currentPassword"
                            onChange={handlePasswordInputChange("currentPassword")}
                        />

                        <TextField
                            id="new-password"
                            label="New Password"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            type="password"
                            value={passwordValues.newPassword}
                            name="newPassword"
                            onChange={handlePasswordInputChange("newPassword")}
                        />
                        <TextField
                            id="confirm-password"
                            label="Confirm Password"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            type="password"
                            value={passwordValues.confirmPassword}
                            name="confirmPassword"
                            onChange={handlePasswordInputChange("confirmPassword")}
                        />
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth={true}
                            className={classes.passwordSubmitButton}
                            startIcon={<UpdateIcon />}
                            onClick={handlePasswordFormSubmit}
                            disabled={false}
                        >   
                        Change Password
                    </Button>
                    </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
        </>
    );
}

export {
    MerchantProfile
}
