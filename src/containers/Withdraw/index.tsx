import classnames from 'classnames';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import * as React from 'react';
import {
    Beneficiaries,
} from '../../components';
import { Decimal } from '../../components/Decimal';
import { cleanPositiveFloatInput} from '../../helpers';
import { Beneficiary } from '../../modules';

import { withStyles, Theme } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Button
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = (theme: Theme) => ({
    networkPaper: {
        padding: `${theme.spacing(3)}px ${theme.spacing(3)}px`,
        margin: `${theme.spacing(2)}px 0px`,
        borderRadius: '4px'
    },
    networkPaperHeader: {
        paddingBottom: theme.spacing(1),
        borderWidth: '0px 0px 1px',
        borderStyle: 'solid',
        borderColor: 'rgb(234, 236, 239)'
    },
    withdrawFee: {
        padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
});

export interface WithdrawProps {
    currency: string;
    balance: number;
    fee: number;
    onClick: (rid: string, amount: string, total: string, beneficiary: Beneficiary, otpCode: string) => void;
    fixed: number;
    className?: string;
    type: 'fiat' | 'coin';
    withdrawProcessing?: boolean;
    withdrawSuccess?: boolean;
    resetForm?: () => void;
    twoFactorAuthRequired?: boolean;
    withdrawAddressLabel?: string;
    withdrawAmountLabel?: string;
    withdraw2faLabel?: string;
    withdrawFeeLabel?: string;
    withdrawTotalLabel?: string;
    withdrawButtonLabel?: string;
    withdrawDone: boolean;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    data: {
        address: '',
    },
};

interface WithdrawState {
    rid: string;
    tag: string;
    amount: string;
    beneficiary: Beneficiary;
    otpCode: string;
    withdrawAmountFocused: boolean;
    withdrawCodeFocused: boolean;
    total: string;
}

type Props = WithdrawProps & InjectedIntlProps;

class WithdrawComponent extends React.Component<Props, WithdrawState> {
    public state = {
        rid:'',
        tag: '',
        amount: '',
        beneficiary: defaultBeneficiary,
        otpCode: '',
        withdrawAmountFocused: false,
        withdrawCodeFocused: false,
        total: '',
    };

    public componentWillReceiveProps(nextProps) {
        const { currency, withdrawDone, withdrawSuccess } = this.props;

        if ((nextProps && (JSON.stringify(nextProps.currency) !== JSON.stringify(currency))) || (nextProps.withdrawDone && !withdrawDone)) {
            this.setState({
                rid:'',
                tag: '',
                amount: '',
                otpCode: '',
                total: '',
            });
        }

        if(withdrawSuccess != nextProps.withdrawSuccess) {
            this.resetFormData();
        }
    }

    public render() {
        const {
            rid,
            tag,
            amount,
            beneficiary,
            total,
            withdrawAmountFocused,
            otpCode,
        } = this.state;
        const {
            className,
            currency,
            type,
            withdrawProcessing,
            withdrawSuccess,
            twoFactorAuthRequired,
            withdrawAddressLabel,
            withdrawAmountLabel,
            withdrawFeeLabel,
            withdrawTotalLabel,
            withdrawButtonLabel,
        } = this.props;

        const { classes } = this.props;

        return (
            <Paper elevation={2} className={classes.networkPaper}>
                <form id="withdrawl_form">
                {type === 'coin' ?
                    <>
                        <TextField
                            type="text"
                            label={withdrawAddressLabel || 'Withdrawal Address'}
                            value={rid}
                            style={{ padding: 8 }}
                            placeholder={withdrawAddressLabel || 'Widthdraw Address'}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            onChange = {this.handleInputAddressChangeEvent}
                            autoFocus={true}
                            
                        />
                    </>
                    : 
                    <Beneficiaries
                        currency={currency}
                        type={type}
                        onChangeValue={this.handleChangeBeneficiary}
                    />
                }
                {currency === 'xrp' ? 
                        <TextField
                            type="text"
                            label={'Withdrawal Tag'}
                            value={tag}
                            style={{ padding: 8 }}
                            placeholder={'Widthdraw Tag'}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            onChange = {this.handleInputTagChangeEvent}
                            
                        />
                    : 
                    null
                }
                <TextField
                    type="number"
                    label={withdrawAmountLabel || 'Withdrawal Amount'}
                    value={amount}
                    style={{ padding: 8 }}
                    placeholder={withdrawAmountLabel || 'Amount'}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    onChange = {this.handleInputAmountChangeEvent}
                    error={!(Number(this.props.balance) >= Number(amount))}
                    
                />
                {twoFactorAuthRequired && this.renderOtpCodeInput()}
                <div className={classes.withdrawFee}>
                    <Typography variant='button' component='div' display='inline' style={{ margin: '0px 8px' }}>
                        {withdrawFeeLabel ? withdrawFeeLabel : 'Fee'}:
                    </Typography>
                    <Typography variant='body2' component='div' display='inline'>
                        {this.renderFee()}
                    </Typography>
                    <br />
                    <Typography variant='button' component='div' display='inline' style={{ margin: '0px 8px' }}>
                        {withdrawTotalLabel ? withdrawTotalLabel : 'Total Withdraw Amount'}:
                    </Typography>
                    <Typography variant='body2' component='div' display='inline'>
                        {this.renderTotal()}
                    </Typography>
                </div>
                <Button 
                    variant="contained" 
                    color="primary"
                    size="large"
                    fullWidth={true}
                    onClick={this.handleClick}
                    disabled={Number(total) <= 0 || !Boolean(type === 'coin' ? rid : beneficiary.id) || !Boolean(otpCode.length > 5) || !(Number(this.props.balance) >= Number(total)) || withdrawProcessing}
                >
                    {withdrawProcessing ? <CircularProgress size={18} color="inherit"/> :  withdrawButtonLabel}
                </Button>
                </form>
            </Paper>
        );
    }

    private resetFormData = () => {
        // console.log('reset form');
        this.props.resetForm();
        this.setState({
            rid:'',
            tag: '',
            amount: '',
            otpCode: '',
            total: '',
        });
    }

    private renderFee = () => {
        const { fee, fixed, currency } = this.props;

        return (
            <span>
                <Decimal fixed={fixed}>{fee.toString()}</Decimal> {currency.toUpperCase()}
            </span>
        );
    };

    private renderTotal = () => {
        const total = this.state.total;
        const { fixed, currency } = this.props;

        return total ? (
            <span>
                <Decimal fixed={fixed}>{total.toString()}</Decimal> {currency.toUpperCase()}
            </span>
        ) : <span>0 {currency.toUpperCase()}</span>;
    };

    private renderOtpCodeInput = () => {
        const { otpCode, withdrawCodeFocused } = this.state;
        const { withdraw2faLabel } = this.props;
        return (
            <React.Fragment>
                  <TextField
                    type="number"
                    label={withdraw2faLabel || '2FA code'}
                    value={otpCode}
                    style={{ padding: 8 }}
                    placeholder={withdraw2faLabel || '2FA code'}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    onFocus={() => this.handleFieldFocus('code')}
                    onChange = {this.handleInputOtpCodeChangeEvent}
                    autoFocus={false}
                    
                />
            </React.Fragment>
        );
    };

    private handleClick = () => this.props.onClick(
        this.state.tag.length > 1 ? `${this.state.rid}?dt=${this.state.tag}` : this.state.rid,
        this.state.amount,
        this.state.total,
        this.state.beneficiary,
        this.state.otpCode,
    );

    private handleFieldFocus = (field: string) => {
        switch (field) {
            case 'amount':
                this.setState(prev => ({
                    withdrawAmountFocused: !prev.withdrawAmountFocused,
                }));
                break;
            case 'code':
                this.setState(prev => ({
                    withdrawCodeFocused: !prev.withdrawCodeFocused,
                }));
                break;
            default:
                break;
        }
    };

    private handleInputAddressChangeEvent = (event) => {
        this.setState({rid: event.target.value});
    }

    private handleInputTagChangeEvent = (event) => {
        this.setState({rid: event.target.value});
    }

    private handleInputAmountChangeEvent = (event) => {
        const value = event.target.value;
        const { fixed } = this.props;

        const convertedValue = cleanPositiveFloatInput(String(value));
        const condition = new RegExp(`^(?:[\\d-]*\\.?[\\d-]{0,${fixed}}|[\\d-]*\\.[\\d-])$`);
        if (convertedValue.match(condition)) {
            const amount = (convertedValue !== '') ? Number(parseFloat(convertedValue).toFixed(fixed)) : '';
            const total = (amount !== '') ? (amount + Number(this.props.fee)).toFixed(fixed) : '';

            if (Number(total) <= 0) {
                this.setTotal((0).toFixed(fixed));
            } else {
                this.setTotal(total);
            }

            this.setState({
                amount: convertedValue,
            });
        }
    };

    private setTotal = (value: string) => {
        this.setState({ total: value });
    };

    private handleChangeBeneficiary = (value: Beneficiary) => {
        this.setState({
            beneficiary: value,
        });
    };

    private handleInputOtpCodeChangeEvent = (event) => {
        this.setState({ otpCode: event.target.value });
    };
}

export const Withdraw = injectIntl(withStyles(useStyles as {})(WithdrawComponent) as any);