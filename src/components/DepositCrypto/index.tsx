// import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { CopyableTextField } from '../CopyableTextField';
import { QRCode } from '../QRCode';

import { makeStyles, Theme, createStyles, withStyles} from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Tooltip,
    Button as MaterialButton
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

export interface DepositCryptoProps {
    /**
     * Data which is used to generate QR code
     */
    data: string;
    /**
     * Define if wallet account has been activated
     */
    isAccountActivated: boolean;
    /**
     * Generate wallet address for selected wallet
     */
    handleGenerateAddress: () => void;
    /**
     * Data which is used to display error if data is undefined
     */
    error: string;
    /**
     * Defines the size of QR code component.
     * @default 118
     */
    dimensions?: number;
    /**
     *  Renders text of a component
     */
    text?: string;
    /**
     * @default 'Deposit by Wallet Address'
     * Renders text of the label of CopyableTextField component
     */
    copiableTextFieldText?: string;
    /**
     * @default 'Copy'
     *  Renders text of the label of copy button component
     */
    copyButtonText?: string;
    /**
     * Renders text alert about success copy address
     */
    handleOnCopy: () => void;
    /**
     * @default 'false'
     * If true, Button in CopyableTextField will be disabled.
     */
    disabled?: boolean;
    /**
     * Generate address button label
     */
    buttonLabel?: string;

    /**
     * Selected Wallet currecny
     */

    currency?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    networkPaper: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2)}px`,
        margin: `${theme.spacing(2)}px 0px`,
        borderRadius: '4px'
    },
    networkPaperHeader: {
        paddingBottom: theme.spacing(1),
        borderWidth: '0px 0px 1px',
        borderStyle: 'solid',
        borderColor: 'rgb(234, 236, 239)'
    },
    networkPaperContent: {
        textAlign: 'center',
        padding: `${theme.spacing(8)}px 0px`,
    },
    qrCode: {
        margin: `${theme.spacing(4)}px 0px`,
    },
    addressText: {
        marginRight: theme.spacing(1)
    },
    copyIcon: {
        color: theme.palette.primary.main,
        cursor: 'pointer'
    }
  }),
);


/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */
const DepositCryptoComponent: React.FunctionComponent<DepositCryptoProps> = (props: DepositCryptoProps) => {
    const QR_SIZE = 118;
    const {
        data,
        dimensions,
        error,
        text,
        copiableTextFieldText,
        copyButtonText,
        handleOnCopy,
        disabled,
        handleGenerateAddress,
        buttonLabel,
        isAccountActivated,
        currency,
    } = props;
    const size = dimensions || QR_SIZE;
    const [copyTooltipText, setCopyTooltipText] = React.useState<string>("Copy");

    const copyToClipboard = (text) => {
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

    const address = data ? data : error;
    
    const onCopy = !disabled ? handleOnCopy : undefined;

    const classes = useStyles();
    // const className = classnames({'cr-copyable-text-field__disabled': data === ''});

    const LightTooltip = withStyles((theme: Theme) => ({
        tooltip: {
          backgroundColor: theme.palette.common.white,
          color: 'rgba(0, 0, 0, 0.87)',
          boxShadow: theme.shadows[1],
          fontSize: 11,
        },
      }))(Tooltip);

    const getContent = () => {
        if (isAccountActivated) {
            return (
                <>
                    <Paper elevation={2} className={classes.networkPaper}>
                        <div className={classes.networkPaperHeader}>
                            <Typography variant="body1" component="div" display="inline">
                                Deposit network 
                                <LightTooltip style={{ marginLeft: '4px' }} title="Please select the corresponding Binance Deposit address format according to the public chain type of the transferred wallet. Do note that some wallets may support multiple public chain types of token transfer, like exchange wallets generally support deposits from ERC20, OMNI, and TRC20 types of USDT. Make sure that the public chain network type selected at the time of transfer is the same the one for Binance Deposits." placement="right-start">
                                    <InfoOutlinedIcon />
                                </LightTooltip>
                            </Typography>
                        </div>
                            {data ? (
                                <>
                                    <div className={classes.networkPaperContent}>
                                        <Typography variant='body1' component='div'>
                                            {currency ? currency.toUpperCase() : ''} Address
                                        </Typography>
                                        <div className={classes.qrCode}>
                                            {data ? <QRCode dimensions={size} data={data}/> : null}
                                        </div>
                                        <Typography variant='body2' component='div' display='inline' className={classes.addressText}>
                                            {data ? data : error}
                                        </Typography>
                                        <Typography variant='body2' component='div' display='inline' onClick={onCopy}>
                                            <LightTooltip style={{ marginLeft: '4px' }} title={copyTooltipText} placement="right-start">
                                                <FileCopyOutlinedIcon className={classes.copyIcon} onClick={() => copyToClipboard({address})} onMouseOut={setCopyTooltipTextOnMouseOut}/>
                                            </LightTooltip>
                                        </Typography>
                                    </div>
                                    <div style={{ marginTop: '24px' }}>
                                        <Typography variant='subtitle2' component='div' display='block'>
                                            Send only {currency ? currency.toUpperCase() : ''} to this deposit address.
                                        </Typography>
                                        <Typography variant='caption' component='div' display='block'>
                                            Sending coin or token other than {currency ? currency.toUpperCase() : ''} to this address may result in the loss of your deposit.
                                        </Typography>
                                    </div>

                                </>
                            ) : (
                                <>
                                <div className={classes.networkPaperContent}>
                                    <MaterialButton variant="contained" color="secondary" onClick={handleGenerateAddress}>
                                        {buttonLabel ? buttonLabel : 'Generate deposit address'}
                                    </MaterialButton>
                                </div>
                                </>
                            )
                            }
                    </Paper>
                    {/* <div>
                        <p className={'cr-deposit-info'}>{text}</p>
                        {data ? <div className="d-none d-md-block qr-code-wrapper"><QRCode dimensions={size} data={data}/></div> : null}
                    </div>
                    <div>
                        <form className={'cr-deposit-crypto__copyable'}>
                            <fieldset className={'cr-copyable-text-field'} onClick={onCopy}>
                                <CopyableTextField
                                    className={'cr-deposit-crypto__copyable-area'}
                                    value={data ? data : error}
                                    fieldId={data ? 'copy_deposit_1' : 'copy_deposit_2'}
                                    copyButtonText={copyButtonText}
                                    disabled={disabled}
                                    label={copiableTextFieldText ? copiableTextFieldText : 'Deposit by Wallet Address'}
                                />
                            </fieldset>
                        </form>
                    </div> */}
                </>
            );
        }

        return (
            <div className="cr-deposit-crypto__create">
                <div className="cr-deposit-crypto__create-btn">
                    <Button
                        block={true}
                        type="button"
                        onClick={handleGenerateAddress}
                        size="lg"
                        variant="primary"
                    >
                        {buttonLabel ? buttonLabel : 'Generate deposit address'}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div>
            {getContent()}
        </div>
        // <div className={className}>
        //     <div className={'cr-deposit-crypto'}>
        //         {getContent()}
        //     </div>
        // </div>
    );
};

export const DepositCrypto = DepositCryptoComponent;

