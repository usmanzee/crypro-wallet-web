import classnames from 'classnames';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
    Beneficiaries,
    CustomInput,
    SummaryField,
} from '../../components';
import { Decimal } from '../../components/Decimal';
import { cleanPositiveFloatInput} from '../../helpers';
import { Beneficiary } from '../../modules';

import { withStyles, Theme } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Button as MaterialButton
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const useStyles = theme => ({
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
        const { currency, withdrawDone } = this.props;

        if ((nextProps && (JSON.stringify(nextProps.currency) !== JSON.stringify(currency))) || (nextProps.withdrawDone && !withdrawDone)) {
            this.setState({
                rid:'',
                tag: '',
                amount: '',
                otpCode: '',
                total: '',
            });
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
            twoFactorAuthRequired,
            withdrawAddressLabel,
            withdrawAmountLabel,
            withdrawFeeLabel,
            withdrawTotalLabel,
            withdrawButtonLabel,
        } = this.props;

        const { classes } = this.props;

        const cx = classnames('cr-withdraw', className);
        const lastDividerClassName = classnames('cr-withdraw__divider', {
            'cr-withdraw__divider-one': twoFactorAuthRequired,
            'cr-withdraw__divider-two': !twoFactorAuthRequired,
        });

        const withdrawAmountClass = classnames('cr-withdraw__group__amount', {
          'cr-withdraw__group__amount--focused': withdrawAmountFocused,
        });

        return (
            <div className={cx}>
                <Paper elevation={2} className={classes.networkPaper}>

                    <div className="cr-withdraw-column">
                        <div className="cr-withdraw__group__address">
                            {type === 'coin' ?
                            <>
                                {/* <CustomInput
                                    type="text"
                                    label={withdrawAddressLabel || 'Withdrawal Address'}
                                    defaultLabel="Withdrawal Address"
                                    inputValue={rid}
                                    placeholder={withdrawAddressLabel || 'Widthdraw Address'}
                                    classNameInput="cr-withdraw__input"
                                    handleChangeInput={this.handleChangeInputAddress}
                                />  */}
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
                            
                        </div>
                        {currency === 'xrp' ? 
                        <div className={withdrawAmountClass}>
                            {/* <CustomInput
                                type="text"
                                label={'Withdrawal Tag'}
                                defaultLabel="Withdrawal Tag"
                                inputValue={tag}
                                placeholder={'Widthdraw Tag'}
                                classNameInput="cr-withdraw__input"
                                handleChangeInput={this.handleChangeInputTag}
                            /> */}
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
                        </div> 
                        : 
                        null
                        }
                        <div className="cr-withdraw__divider cr-withdraw__divider-one" />
                        <div className={withdrawAmountClass}>
                            {/* <CustomInput
                                type="number"
                                label={withdrawAmountLabel || 'Withdrawal Amount'}
                                defaultLabel="Withdrawal Amount"
                                inputValue={amount}
                                placeholder={withdrawAmountLabel || 'Amount'}
                                classNameInput="cr-withdraw__input"
                                handleChangeInput={this.handleChangeInputAmount}
                                isInvalid={!(Number(this.props.balance) >= Number(amount))}
                            /> */}
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
                        </div>
                        <div className={lastDividerClassName} />
                        {twoFactorAuthRequired && this.renderOtpCodeInput()}
                    </div>
                <div className="cr-withdraw-column">
                    <div className={classes.withdrawFee}>
                        {/* <SummaryField
                            className="cr-withdraw__summary-field"
                            message={withdrawFeeLabel ? withdrawFeeLabel : 'Fee'}
                            content={this.renderFee()}
                        />
                        <SummaryField
                            className="cr-withdraw__summary-field"
                            message={withdrawTotalLabel ? withdrawTotalLabel : 'Total Withdraw Amount'}
                            content={this.renderTotal()}
                        /> */}
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
                    <div className="cr-withdraw__deep">
                        {/* <Button
                            variant="primary"
                            size="lg"
                            onClick={this.handleClick}
                            disabled={Number(total) <= 0 || !Boolean(type === 'coin' ? rid : beneficiary.id) || !Boolean(otpCode.length > 5) || !(Number(this.props.balance) >= Number(total))}
                        >
                            {withdrawButtonLabel ? withdrawButtonLabel : 'Withdraw'}
                        </Button> */}
                        <MaterialButton 
                            variant="contained" 
                            color="primary"
                            size="large"
                            fullWidth={true}
                            onClick={this.handleClick}
                            disabled={Number(total) <= 0 || !Boolean(type === 'coin' ? rid : beneficiary.id) || !Boolean(otpCode.length > 5) || !(Number(this.props.balance) >= Number(total))}
                        >
                            {withdrawButtonLabel ? withdrawButtonLabel : 'Withdraw'}
                        </MaterialButton>
                    </div>
                </div>
                </Paper>
            </div>
        );
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
        const withdrawCodeClass = classnames('cr-withdraw__group__code', {
          'cr-withdraw__group__code--focused': withdrawCodeFocused,
        });

        return (
            <React.Fragment>
              <div className={withdrawCodeClass}>
                  {/* <CustomInput
                      type="number"
                      label={withdraw2faLabel || '2FA code'}
                      placeholder={withdraw2faLabel || '2FA code'}
                      defaultLabel="2FA code"
                      handleChangeInput={this.handleChangeInputOtpCode}
                      inputValue={otpCode}
                      handleFocusInput={() => this.handleFieldFocus('code')}
                      classNameLabel="cr-withdraw__label"
                      classNameInput="cr-withdraw__input"
                      autoFocus={false}
                  /> */}
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
              </div>
              <div className="cr-withdraw__divider cr-withdraw__divider-two" />
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

    private handleChangeInputAddress = (value: string) => {
        this.setState({rid: value});
    }

    private handleInputAddressChangeEvent = (event) => {
        this.setState({rid: event.target.value});
    }

    private handleChangeInputTag = (value: string) => {
        this.setState({tag: value});
    }
    private handleInputTagChangeEvent = (event) => {
        this.setState({rid: event.target.value});
    }


    private handleChangeInputAmount = (value: string) => {
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

    private handleChangeInputOtpCode = (otpCode: string) => {
        this.setState({ otpCode });
    };
    private handleInputOtpCodeChangeEvent = (event) => {
        this.setState({ otpCode: event.target.value });
    };
}

export const Withdraw = injectIntl(withStyles(useStyles as {})(WithdrawComponent) as any);