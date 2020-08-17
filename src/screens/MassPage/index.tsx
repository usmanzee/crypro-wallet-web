import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import Select from 'react-select';  

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
import {currencies} from '../../helpers/currency';


const styles =  {
    form: {
        width: '100%', // Fix IE 11 issue.
        // marginTop: theme.spacing.unit,
    },
    submit: {},
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: '20px',
        marginRight: '20px',
        // marginRight: theme.spacing.unit * 3,
        // [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        //     width: 400,
        //     marginLeft: 'auto',
        //     marginRight: 'auto',
        // },
    },
    paper: {
        // marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    logo: {
        height: 45,
        width: 45

    },
    withdrawalAmount: {
        width: '100%'
    }
};

class MassPage extends React.Component {
    state = {
        upload: [],
        selectedOption: null,
        error: '',
        open: false,
        setOpen: false,
        currency: '',
        data: [],
        tx_data: [],
        otp:'',
        submitted: false
    };

    constructor(props) {
        // Call super class
        super(props);

        // Bind this to function updateData (This eliminates the error)
        this.updateData = this.updateData.bind(this);
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
        this.setState({data: data}); // or shorter ES syntax: this.setState({ data });
        console.log('file', this.state.data)
    }

    onFilesChange = (files) => {
        console.log(files)
        this.setState({upload: files[0]})
    }


    handleChange = (selectedOption) => {
        this.setState({selectedOption});
        this.setState({currency: selectedOption.value})
        console.log(`Option selected:`, selectedOption);
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
        //codeWithdraws();
        //setOpen(true);
    }

    handleClose = () => {
        this.setState({setOpen: false, open: false})
        //setOpen(false);
    }
    handleSubmit =  async () => {
        this.setState({submitted: true})
        const res_data= []
        const dic = this.state.data
        for(var index in dic) {

            // @ts-ignore
            const  response =  await postMassWithdraws(
                {
                    // @ts-ignore
                    rid: dic[index].BTC_Address,
                    // @ts-ignore
                    amount: dic[index].Amount,
                    currency: this.state.currency,
                    otp: this.state.otp
                }
            );
            if(response.data) {
                let resp = response.data
                //let w_id = ['W_ID': dic[index].W_ID]
                //resp['W_ID']= dic[index].W_ID
                // @ts-ignore
                let data = {'W_ID': dic[index].W_ID, ...resp}
                //resp.unshift(dic[index].W_ID)
                // @ts-ignore
                res_data.push(data)
                console.log("result", data)
            }

        }
        this.setState({setOpen: false, open: false, tx_data: res_data})
        console.log("fulltx", this.state.tx_data)
        this.downloadCSV()
        this.setState({submitted: false})

    }

    render() {
        //const {classes,} = this.props;
        const {data,  currency, otp} = this.state;


        return (
            // @ts-ignore
            <main sytle={{
                width: 'auto',
                display: 'block', // Fix IE 11 issue.
                marginLeft: '20px',
                marginRight: '20px',

            }}>
                <CssBaseline/>
                <Paper 
                // @ts-ignore
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                    <Typography component="h1" variant="h5">Mass Withdrawal</Typography>
                    
                    <form 
                    // @ts-ignore
                    className={styles.form}>

                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="text">Currency</InputLabel>
                            <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChange.bind(this)}
                                isSearchable
                                name={currency}
                                options={currencies}
                            />
                        </FormControl>
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
                                style={{backgroundColor:'#6f2158'}}
                                type="submit"
                                variant="contained"
                                color="primary"
                                // @ts-ignore
                                className={styles.submit}
                                onClick={(e) => {
                                    this.onSubmit(e)
                                }}
                            >
                                Upload File
                            </Button>
                        </FormControl>

                    </form>
                    <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Multiple Withdraws</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Followings are the Withdraws which are extracted from your file. Please review it
                                carefully. Once it is submitted it could not be back
                            </DialogContentText>
                            <TextField
                                label="OTP code"
                                // @ts-ignore
                                className={styles.withdrawalAmount}
                                margin="dense"
                                autoFocus
                                fullWidth
                                variant="outlined"
                                onChange={evt => this.updateInputValue(evt)}
                                value={otp}
                            />
                            
                            <Table className={
                                // @ts-ignore
                                styles.table}>
                                <TableHead style={{alignItems: 'center'}}>
                                    <TableRow>
                                        <TableCell padding="none">Address</TableCell>
                                        <TableCell padding="none">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.map((ad, index) =>
                                            <TableRow key={index}>
                                                
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
                                color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>

                </Paper>
            </main>
        );
    }
}

 export {MassPage};
