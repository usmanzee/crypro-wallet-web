import * as React from 'react';
import classnames from 'classnames';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { QRCode } from '../QRCode';
import { makeStyles, Theme, createStyles, withStyles} from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
// import { Blur } from '../Blur';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

export interface DepositCryptoProps {
    /**
     * address which is used to generate QR code
     */
    address: string;
    /**
     * Tag which is used in deposit (i.e Ripple)
     */
    tag?: string;
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

    depositEnabled?: boolean;
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
        margin: `${theme.spacing(4)}px 0px`,
    },
    networkPaperFooter: {
        marginTop: theme.spacing(3)
    },
    tagInstruction: {
        margin: `${theme.spacing(4)}px 0px`
    },
    addressTagDiv: {
        display: 'flex',
        justifyContent: 'center'
    },
    addressDiv: {
        padding: `0px ${theme.spacing(3)}px`,
        flex: '1 1 0%'
    },
    tagDiv: {
        padding: `0px ${theme.spacing(3)}px`,
        flex: '1 1 0%'
    },
    qrCode: {
        margin: `${theme.spacing(4)}px 0px`,
    },
    addressText: {
        marginRight: theme.spacing(1),
        wordBreak: 'break-all'
    },
    copyIcon: {
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.secondary.main,
        },
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
        tag,
        dimensions,
        error,
        handleOnCopy,
        handleGenerateAddress,
        walletAddressLoading,
        buttonLabel,
        currency,
        depositEnabled,
    } = props;

    const size = dimensions || QR_SIZE;

    const addressText = props.intl.formatMessage({ id: 'page.body.deposit.network.address.text' }, { currency: currency ? currency.toUpperCase(): '' });
    const tagText = props.intl.formatMessage({ id: 'page.body.deposit.network.tag.text' }, { currency: currency ? currency.toUpperCase(): '' });
    const tagInstruction = props.intl.formatMessage({ id: 'page.body.deposit.network.tag.instruction' }, { currency: currency ? currency.toUpperCase(): '' });
    const addressInstructionsTitle = props.intl.formatMessage({ id: 'page.body.deposit.network.address.instructions.title' }, { currency: currency ? currency.toUpperCase(): '' });
    const addressInstructionsDescription = props.intl.formatMessage({ id: 'page.body.deposit.network.address.instructions.description' }, { currency: currency ? currency.toUpperCase(): '' });

    const [copyTooltipText, setCopyTooltipText] = React.useState<string>("Copy");

    // const blurCryptoClassName = classnames('pg-blur-deposit-crypto', {
    //     'pg-blur-deposit-crypto--active': true,
    // });

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

    const translate = (id: string) => props.intl.formatMessage({ id });

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
                    <div className={classes.networkPaperContent}>
                        {/* {depositEnabled === false ? (
                            <Blur
                                className={blurCryptoClassName}
                                text={translate('page.body.wallets.tabs.deposit.disabled.message')}
                            />
                        ) : null} */}
                        {depositEnabled ? 
                            <>
                                {!walletAddressLoading ? 
                                    <>
                                    {address && tag ? 
                                        <Alert severity="info" color="error" className={classes.tagInstruction}>
                                            {tagInstruction}
                                        </Alert>
                                        :
                                        ''
                                    }
                                    <div className={classes.addressTagDiv}>

                                        {address ? 
                                            <>
                                                    <div className={classes.addressDiv}>
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

                                                    {tag ?
                                                        <>
                                                            <Divider orientation="vertical" flexItem />
                                                                <div className={classes.tagDiv}>
                                                                    <Typography variant='body1'>
                                                                        {tagText}
                                                                    </Typography>
                                                                    <div className={classes.qrCode}>
                                                                        {tag ? <QRCode dimensions={size} data={tag}/> : null}
                                                                    </div>
                                                                    <Typography variant='body2' display='inline' className={classes.addressText}>
                                                                        {tag ? tag : error}
                                                                    </Typography>
                                                                    <Typography variant='body2' display='inline' onClick={() => onCopy(tag)} onMouseOut={setCopyTooltipTextOnMouseOut}>
                                                                        <LightTooltip style={{ marginLeft: '4px' }} title={copyTooltipText} placement="right-start">
                                                                            <FileCopyOutlinedIcon className={classes.copyIcon}/>
                                                                        </LightTooltip>
                                                                    </Typography>
                                                                </div>
                                                        </>:
                                                        ''
                                                    }
                                                </>:
                                                <>
                                                        <Button variant="contained" color="secondary" onClick={handleGenerateAddress}>
                                                            {buttonLabel ? buttonLabel : 'Generate deposit address'}
                                                        </Button>
                                                </>
                                            }
                                        </div>
                                    </> : 
                                        <CircularProgress color="secondary"/>
                                }
                            </> :
                            <>
                                <LockOutlinedIcon fontSize="large" color="primary" style={{ height: '80px', width: '80px' }} />
                                <Typography variant="h6">
                                    <FormattedMessage id={'page.body.wallets.tabs.deposit.disabled.message'} /> 
                                </Typography>
                            </>
                        }
                    </div>

                    {depositEnabled ? 
                        <>
                            {address ? 
                                <div className={classes.networkPaperFooter}>
                                    <Typography variant='subtitle2' display='block'>
                                        {addressInstructionsTitle}
                                    </Typography>
                                    <Typography variant='caption' display='block'>
                                        {addressInstructionsDescription}
                                    </Typography>
                                </div>
                                :
                                ''
                            }   
                        </> :
                        ''
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

