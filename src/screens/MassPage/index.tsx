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
import Papa from 'papaparse';
import { postMassWithdraws } from '../../apis/withdraw';
// import {currencies} from '../../helpers/currency';


import { withStyles, Theme } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
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
        upload: [],
        selectedCurrency: null,
        error: '',
        open: false,
        setOpen: false,
        currency: '',
        data: [],
        tx_data: [],
        otp:'',
        submitted: false,
        formatedData: []
    };

    constructor(props) {
        super(props);

        // Bind this to function updateData (This eliminates the error)
        this.updateData = this.updateData.bind(this);
    }

    public componentDidMount() {
        const { currencies, currenciesFetch } = this.props;

        if (!currencies.length) {
            currenciesFetch();
        }
    }

    onSubmit = async e => {
        e.preventDefault();

        Papa.parse(this.state.upload, {
            header: true,
            download: false,
            skipEmptyLines: true,
            // Here this is also available. So we can call our custom class method
            complete: this.updateData
        });
        this.handleClickOpen()

    };
    downloadCSV =()=>
    {
        var csv = Papa.unparse(this.state.tx_data);

        var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        //@ts-ignore
        var csvURL 
        if (navigator.msSaveBlob)
        {
            csvURL = navigator.msSaveBlob(csvData, 'download.csv');
        }
        else
        {
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

    updateData(result) {
        const data = result.data;
        // Here this is available and we can call this.setState (since it's binded in the constructor)
        this.setState({
            data: data
        }); // or shorter ES syntax: this.setState({ data });
    }

    onFilesChange = (files) => {
        this.setState({upload: files[0]})
    }

    handleChange = (event) => {
        const value = event.target.value;
        this.setState({value});
        this.setState({currency: value})
    }
    // @ts-ignore
    onChange = field => e => {
        // @ts-ignore
        this.props.onChange(field, e.target.value.trim());
    };

    updateInputValue(evt) {
        this.setState({
            otp: evt.target.value
        });
    }

    handleChangeField = (ev) => {
        this.setState({[ev.target.name]: ev.target.value})
    };


    handleClickOpen = () => {
        this.setState({setOpen: true, open: true})
    }

    handleClose = () => {
        this.setState({setOpen: false, open: false})
    }

    resetForm = () => {
    }

    handleSubmit = async () => {
        this.setState({submitted: true})
        const res_data= []
        const dic = this.state.data;
        const formatedData = await this.formateData();

        const formatedCurrenciesData = formatedData.filter((row) => {
            return row.data.length > 0
        });
        this.setState({
            // @ts-ignore
            formatedData: formatedCurrenciesData
        });

        const response = await postMassWithdraws({
            opt_code: this.state.otp,
            currencies: this.state.formatedData
        });

        // for(var index in dic) {

        //     // @ts-ignore
        //     const response = await postMassWithdraws(
        //         {
        //             // @ts-ignore
        //             rid: dic[index].BTC_Address,
        //             // @ts-ignore
        //             amount: dic[index].Amount,
        //             currency: this.state.currency,
        //             otp: this.state.otp
        //         }
        //     );
        //     if(response.data) {
        //         let resp = response.data
        //         //let w_id = ['W_ID': dic[index].W_ID]
        //         //resp['W_ID']= dic[index].W_ID
        //         // @ts-ignore
        //         let data = {'W_ID': dic[index].W_ID, ...resp}
        //         //resp.unshift(dic[index].W_ID)
        //         // @ts-ignore
        //         res_data.push(data)
        //         console.log("result", data)
        //     }

        // }
        if(response.data) {

            this.setState({setOpen: false, open: false, tx_data: response.data})
            this.downloadCSV()
            this.setState({submitted: false})
            this.resetForm();
        }

    }

    private formateData = async () => {
        const {currencies} = this.props;

        const rows = this.state.data;
        return await currencies.map(currency => {
            // @ts-ignore
            const dataInfo = rows.filter((row) => {
                // @ts-ignore
                return row.Currency === currency.id.toUpperCase() && row.BTC_Address != ''
            });

            return ({
                    currency: currency.id,
                    data: dataInfo
                });
        });
    }

    render() {
        const {data,  currency, otp} = this.state;
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
                                    acceptedFiles={['text/*', 'application/*']}
                                    maxFileSize={10000000}
                                    dropzoneText="Drag and Drop a CSV file or Click Here"
                                    showFileNamesInPreview={true}
                                    filesLimit={1}
                                    onChange={this.onFilesChange.bind(this)}
                                />
                            </FormControl>

                            <Typography variant="h6"
                                        style={{padding: 10, color: 'red', fontSize: '12px', textAlign: 'center'}}>
                                {this.state.error}
                            </Typography>
                            <FormControl margin="normal" required fullWidth>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={(e) => {
                                        this.onSubmit(e)
                                    }}
                                >
                                    Submit
                                </Button>
                            </FormControl>

                        </form>
                    </div>
                    <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
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
                                onChange={evt => this.updateInputValue(evt)}
                                value={otp}
                            />
                            
                            <Table className={classes.table}>
                                <TableHead style={{alignItems: 'center'}}>
                                    <TableRow>
                                        <TableCell padding="none">Currency</TableCell>
                                        <TableCell padding="none">Address</TableCell>
                                        <TableCell padding="none">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.map((ad, index) =>
                                            <TableRow key={index} className={
                                                // @ts-ignore
                                                ad.BTC_Address ? classes.defaultRow : classes.redRow}>
                                                
                                                <TableCell padding="none">{
                                                    // @ts-ignore
                                                ad.Currency
                                                }</TableCell>
                                                <TableCell padding="none">{
                                                    // @ts-ignore
                                                ad.BTC_Address
                                                }</TableCell>
                                                
                                                <TableCell padding="none">{
                                                    // @ts-ignore
                                                ad.Amount
                                                }</TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                            <Typography component="h1"
                            // @ts-ignore
                                variant="h5">Total: {data.reduce((partial_sum, a) => partial_sum + parseFloat(a.Amount), 0)}</Typography>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button
                                onClick={this.handleSubmit}
                                disabled={this.state.submitted}
                                color="primary"
                            >
                                Submit
                            </Button>
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