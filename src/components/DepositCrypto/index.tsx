import * as React from 'react';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { QRCode } from '../QRCode';

import { makeStyles, Theme, createStyles, withStyles} from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Tooltip,
    Button
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

export interface DepositCryptoProps {
    /**
     * address which is used to generate QR code
     */
    address: string;
    /**
     * Define if wallet account has been activated
     */
    // isAccountActivated: boolean;
    /**
     * Generate wallet address for selected wallet
     */
    handleGenerateAddress: () => void;
    walletAddressLoading?: boolean;
    generatingWalletAddress?: boolean;
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
        marginRight: theme.spacing(1),
        wordBreak: 'break-all'
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
type Props = DepositCryptoProps & InjectedIntlProps;

const DepositCryptoComponent: React.FunctionComponent<DepositCryptoProps> = (props: Props) => {
    const QR_SIZE = 118;
    const {
        address,
        dimensions,
        error,
        handleOnCopy,
        handleGenerateAddress,
        walletAddressLoading,
        buttonLabel,
        currency,
    } = props;

    const size = dimensions || QR_SIZE;

    const addressText = props.intl.formatMessage({ id: 'page.body.deposit.network.address.text' }, { currency: currency ? currency.toUpperCase(): '' });
    const addressInstructionsTitle = props.intl.formatMessage({ id: 'page.body.deposit.network.address.instructions.title' }, { currency: currency ? currency.toUpperCase(): '' });
    const addressInstructionsDescription = props.intl.formatMessage({ id: 'page.body.deposit.network.address.instructions.description' }, { currency: currency ? currency.toUpperCase(): '' });

    const [copyTooltipText, setCopyTooltipText] = React.useState<string>("Copy");

    const onCopy = (textToCopy) => {
        copyToClipboard(textToCopy);
        handleOnCopy();
    }
    const copyToClipboard = (text) => {
        var textField = document.createElement('textarea')
        textField.innerText = text;
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        setCopyTooltipText('copied');
        textField.remove()
    };

    const setCopyTooltipTextOnMouseOut = () => {
        setCopyTooltipText('copy');
    }

    const classes = useStyles();

    const LightTooltip = withStyles((theme: Theme) => ({
        tooltip: {
          backgroundColor: theme.palette.common.white,
          color: 'rgba(0, 0, 0, 0.87)',
          boxShadow: theme.shadows[1],
          fontSize: 11,
        },
    }))(Tooltip);

    const getContent = () => {
        return (
            <>
                <Paper elevation={2} className={classes.networkPaper}>
                    <div className={classes.networkPaperHeader}>
                        <Typography variant="body1" component="div" display="inline">
                            <FormattedMessage id={'page.body.deposit.network.title'} /> 
                            <LightTooltip style={{ marginLeft: '4px' }} title={<FormattedMessage id={'page.body.deposit.network.message'} /> } placement="right-start">
                                <InfoOutlinedIcon />
                            </LightTooltip>
                        </Typography>
                    </div>
                    {!walletAddressLoading ? 
                        <>
                            {address ? 
                                <>
                                    <div className={classes.networkPaperContent}>
                                        <Typography variant='body1'>
                                            {addressText}
                                        </Typography>
                                        <div className={classes.qrCode}>
                                            {address ? <QRCode dimensions={size} data={address}/> : null}
                                        </div>
                                        <Typography variant='body2' display='inline' className={classes.addressText}>
                                            {address ? address : error}
                                        </Typography>
                                        <Typography variant='body2' display='inline' onClick={() => onCopy(address)} onMouseOut={setCopyTooltipTextOnMouseOut}>
                                            <LightTooltip style={{ marginLeft: '4px' }} title={copyTooltipText} placement="right-start">
                                                <FileCopyOutlinedIcon className={classes.copyIcon}/>
                                            </LightTooltip>
                                        </Typography>
                                    </div>
                                    <div style={{ marginTop: '24px' }}>
                                        <Typography variant='subtitle2' display='block'>
                                            {addressInstructionsTitle}
                                        </Typography>
                                        <Typography variant='caption' display='block'>
                                            {addressInstructionsDescription}
                                        </Typography>
                                    </div>
                                </>:
                                <>
                                    <div className={classes.networkPaperContent}>
                                        <Button variant="contained" color="secondary" onClick={handleGenerateAddress}>
                                            {buttonLabel ? buttonLabel : 'Generate deposit address'}
                                        </Button>
                                    </div>
                                </>
                            }
                        </> : 
                        <div className={classes.networkPaperContent}>
                            <CircularProgress color="secondary"/>
                        </div>
                    }
                </Paper>
            </>
        );
        
    };

    return (
        <div>
            {getContent()}
        </div>
    );
};

export const DepositCrypto = injectIntl(DepositCryptoComponent)

