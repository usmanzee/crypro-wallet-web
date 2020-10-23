import * as React from 'react';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControl from '@material-ui/core/FormControl';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import Select from 'react-select';

import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';

import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {DropzoneArea} from 'material-ui-dropzone';
import CircularProgress from '@material-ui/core/CircularProgress';
import Papa from 'papaparse';
import { massWithdraws } from '../../apis/withdraw';
import axios from 'axios';

import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { 
    alertPush, 
    currenciesFetch, 
    Currency, 
    RootState, 
    selectCurrencies, 
    selectUserInfo, 
    User, 
} from '../../modules';
import { CurrencyInfo } from '../../components';
import { exit } from 'process';

interface ReduxProps {
    user: User;
    currencies: Currency[];
}

interface DispatchProps {
    fetchAlert: typeof alertPush;
    currenciesFetch: typeof currenciesFetch;
}

const useStyles = (theme: Theme) => ({
    form: {
        // width: '100%',
    },
    submit: {},
    container: {
        padding: theme.spacing(1)
    },
    paper: {
        padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`
    },
    paperHeader: {
        padding: theme.spacing(1),
        borderBottom: '1px solid #d6d5d5',
        textAlign: 'center',
    },
    paperBody: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: theme.spacing(1)
    },
    table: {
        margin: theme.spacing(1)
    },
    defaultRow: {

    },
    redRow: {
        backgroundColor: 'red'
    },
    logo: {
        height: 45,
        width: 45

    },
    withdrawalAmount: {
        width: '100%'
    }
});

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class MasspayComponent extends React.Component<Props> {

    state = {
        uploadedFile: [],
        modalOpen: false,
        fileData: [],
        responseData: [],
        otp:'',
        submitted: false,
        formatedData: [],
        massWithdrawProcessing: false,
    };

    constructor(props) {
        super(props);
    }
    public componentDidMount() {
        const { currencies, currenciesFetch } = this.props;

        if (!currencies.length) {
            currenciesFetch();
        }
    }

    onFileChange = (files) => {
        this.setState({uploadedFile: files[0]})
        this.isFileFormValid();    
    }

    onFileSubmit = async e => {
        e.preventDefault();

        let allKeyPresent = false;
        Papa.parse(this.state.uploadedFile, {
            header: true,
            download: false,
            skipEmptyLines: true,
            transformHeader:function(h) {
                let newColumnName = h;
                if(h === 'BTC_Address') {
                    newColumnName = 'address';
                }
                if(h === 'Amount') {
                    newColumnName = 'amount';
                }
                if(h === 'Currency') {
                    newColumnName = 'currency';
                }
                if(h === 'W_ID') {
                    newColumnName = 'w_id';
                }
                if(h === 'B4U_ID') {
                    newColumnName = 'b4u_id';
                }
                if(h === 'User_Name') {
                    newColumnName = 'name';
                }
                // console.log(newColumnName);
                return newColumnName;
            },
            complete: (results) => {
                const fileData = results.data;
                this.setState({
                    fileData: fileData
                });
                this.handleModalOpen();
            }
        });
    };

    handleModalOpen = () => {
        this.setState({modalOpen: true})
    }

    handleOTPChange(event) {
        this.setState({
            otp: event.target.value
        });
    }

    handleModalClose = () => {
        // this.resetDropzone();
        this.setState({modalOpen: false})
    }

    public isFileFormValid = () => {
        if(this.state.uploadedFile) {
            return true;
        }
        return false;
    }

    public isRequestFormValid = () => {
        if(this.state.submitted || !this.state.otp || !Boolean(this.state.otp.length > 5)) {
            return true;
        }
        return false;
    }

    handleRequestSubmit = async () => {
        this.setState({submitted: true})
        const formatedData = await this.formateData();

        const formatedCurrenciesData = formatedData.filter((row) => {
            return row.meta_data.length > 0
        });
        this.setState({
            // @ts-ignore
            formatedData: formatedCurrenciesData
        });

        this.setState({ massWithdrawProcessing: true }, async () => {
            try {
                
                const response = await massWithdraws({
                    otp: this.state.otp,
                    data: this.state.formatedData
                });
                
                if(response.status === 200) {
                    this.resetDropzone();
                    this.setState({modalOpen: false, responseData: response.data})
                    this.downloadCSV()
                    this.setState({otp: ''})
                    this.setState({submitted: false})
                    this.setState({massWithdrawProcessing: false});
                    this.props.fetchAlert({message: ['Request processed successfully'], type: 'success'});
                } else {
                    this.setState({submitted: false})
                    this.setState({massWithdrawProcessing: false});
                    this.props.fetchAlert({message: response.data.errors, type: 'error'});
                }

            } catch (error) {
                this.setState({massWithdrawProcessing: false});
                this.props.fetchAlert({message: error, type: 'error'});
            }
        });


    }

    public resetDropzone = () => {
         //remove upload file
         let element: HTMLElement = document.getElementsByClassName('MuiDropzonePreviewList-removeButton')[0] as HTMLElement;
         if(element) {
             element.click();
         }
    }

    private formateData = async () => {
        const {currencies} = this.props;

        const rows = this.state.fileData;
        return await currencies.map(currency => {
            // @ts-ignore
            const dataInfo = rows.filter((row) => {
                // @ts-ignore
                return row.currency === currency.id.toUpperCase() && row.btc_address != ''
            });

            return ({
                    currency: currency.id,
                    meta_data: dataInfo
                });
        });
    }

    private downloadCSV = () => {
        var csv = Papa.unparse(this.state.responseData);

        var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        //@ts-ignore
        var csvURL 
        if (navigator.msSaveBlob) {
            csvURL = navigator.msSaveBlob(csvData, 'download.csv');
        }
        else {
            csvURL = window.URL.createObjectURL(csvData);
            
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(csvData);
                link.setAttribute("href", url);
                link.setAttribute("download", 'withdraws.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    private StyledTableCell = withStyles((theme: Theme) =>
        createStyles({
            head: {
                backgroundColor: "rgb(228 224 224)",
                color: theme.palette.common.black,
            }
        }),
    )(TableCell);

    render() {
        const {fileData, otp, massWithdrawProcessing} = this.state;
        const {currencies, classes} = this.props;

        return (
            <Container className={classes.container}>
                <Paper className={classes.paper}>
                    <div className={classes.paperHeader}>
                        <Typography component="h1" variant="h5">Mass Withdrawal</Typography>
                    </div>
                    <div className={classes.paperBody}>

                        <form className={classes.form}>
                            <FormControl margin="normal" required fullWidth>
                                <DropzoneArea
                                    acceptedFiles={[".csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values"]}
                                    clearOnUnmount={true}
                                    maxFileSize={10000000}
                                    dropzoneText="Drag and Drop a CSV file or Click Here"
                                    showFileNamesInPreview={true}
                                    filesLimit={1}
                                    onChange={this.onFileChange.bind(this)}
                                />
                            </FormControl>

                            <Typography variant="h6"
                                        style={{padding: 10, color: 'red', fontSize: '12px', textAlign: 'center'}}>
                            </Typography>
                            <FormControl margin="normal" required fullWidth>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    disabled={!this.isFileFormValid()}
                                    onClick={(e) => {
                                        this.onFileSubmit(e)
                                    }}
                                >
                                    Submit
                                </Button>
                            </FormControl>

                        </form>
                    </div>
                    <Dialog open={this.state.modalOpen} onClose={this.handleModalClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Multiple Withdraws</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Followings are the Withdraws which are extracted from your file. Please review it
                                carefully. Once it is submitted it could not be back
                            </DialogContentText>
                            <TextField
                                label="OTP code"
                                className={classes.withdrawalAmount}
                                margin="dense"
                                autoFocus
                                fullWidth
                                variant="outlined"
                                onChange={event => this.handleOTPChange(event)}
                                value={otp}
                            />
                            
                            <Table className={classes.table}>
                                <TableHead style={{alignItems: 'center'}}>
                                    <TableRow>
                                        <this.StyledTableCell padding="none">Currency</this.StyledTableCell>
                                        <this.StyledTableCell padding="none">Address</this.StyledTableCell>
                                        <this.StyledTableCell padding="none">Amount</this.StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        fileData.map((ad, index) =>
                                            <TableRow key={index} className={
                                                // @ts-ignore
                                                ad.address ? classes.defaultRow : classes.redRow}>
                                                
                                                <this.StyledTableCell padding="none">{
                                                    // @ts-ignore
                                                ad.currency
                                                }</this.StyledTableCell>
                                                <this.StyledTableCell padding="none">{
                                                    // @ts-ignore
                                                ad.address
                                                }</this.StyledTableCell>
                                                
                                                <this.StyledTableCell padding="none">{
                                                    // @ts-ignore
                                                ad.amount
                                                }</this.StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                            <Typography component="h1"
                            // @ts-ignore
                                variant="h5">Total: {fileData.reduce((partial_sum, a) => partial_sum + parseFloat(a.amount), 0)}</Typography>

                        </DialogContent>
                        <DialogActions>
                            {massWithdrawProcessing ? 
                                    <CircularProgress className={classes.buttonProgress} size={18} /> :
                                <>
                                    <Button onClick={this.handleModalClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={this.handleRequestSubmit}
                                        disabled={this.isRequestFormValid()}
                                        color="primary"
                                    >
                                        Submit
                                    </Button>
                                </>
                            }
                        </DialogActions>
                    </Dialog>

                </Paper>
            </Container>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    currencies: selectCurrencies(state),
});
const mapDispatchToProps = dispatch => ({
    fetchAlert: payload => dispatch(alertPush(payload)),
    currenciesFetch: () => dispatch(currenciesFetch()),
});

export const MasspayScreen = injectIntl(withStyles(useStyles as {})(connect(mapStateToProps, mapDispatchToProps)(MasspayComponent) as any));