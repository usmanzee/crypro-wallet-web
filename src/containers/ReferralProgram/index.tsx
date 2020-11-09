import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { Theme, withStyles} from '@material-ui/core/styles';

import { connect, MapDispatchToProps } from 'react-redux';
import { CopyableTextField } from '../../components';
import {
    alertPush,
    RootState,
    selectUserInfo,
    User,
} from '../../modules';

interface ReduxProps {
    user: User;
}

interface DispatchProps {
    fetchSuccess: typeof alertPush;
}


type CopyTypes = HTMLInputElement | null;

const copy = (id: string) => {
    const copyText: CopyTypes = document.querySelector(`#${id}`);

    if (copyText) {
        copyText.select();

        document.execCommand('copy');
        (window.getSelection() as any).removeAllRanges(); // tslint:disable-line
    }
};

const useStyles = (theme: Theme) => ({
    rootPaper: {
       
    },
    rootContent: {
        background: theme.palette.primary.main,
        color: '#fff'
    },
    copyTag: {
        margin: '0px 8px', 
        cursor: 'pointer',
        "&:hover": {
            '& path': {
                fill: theme.palette.secondary.main,
            }
        }
    }
});

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class ReferralProgramClass extends React.Component<Props> {
    //tslint:disable-next-line:no-any
    public static propsTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public doCopy = () => {
        copy('referral-id');
        this.props.fetchSuccess({message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'});
    };

    public onCopy = (textToCopy) => {
        this.copyToClipboard(textToCopy);
        this.props.fetchSuccess({message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'});
    }
    public copyToClipboard = (text) => {
        var textField = document.createElement('textarea')
        textField.innerText = text;
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
    };

    public render() {
        const { classes, user } = this.props;
        const referralLink = `${window.document.location.origin}/signup?refid=${user.uid}`;

        return (
            <>
                <Box mt={2} mb={2}>
                        <Box p={4} className={classes.rootContent}>
                            <Typography variant="h4" gutterBottom style={{ fontWeight: 500 }}>
                                Invite Friends & Earn Crypto Together
                            </Typography>
                            <Typography variant="button" gutterBottom>
                                Earn up to 40% commission every time your friends make a trade on B4U.
                            </Typography>
                        </Box>
                        <Box p="8px 24px 0px">
                            <Typography component="h6" variant="h5" gutterBottom style={{ fontWeight: 500 }}>
                                Invite Now
                            </Typography>
                            <Typography variant="body1" gutterBottom style={{ opacity: '0.8' }}>
                                Use your unique link to invite your friends over message or email. Your default invitation code can also be shared in real life or as a screenshot.
                            </Typography>
                        </Box>
                        <Box p="8px 24px 0px">
                            <Typography component="div" variant="h6" gutterBottom style={{ opacity: '0.8' }}>
                                Default Referral ID
                            </Typography>
                            <Typography variant="body1" gutterBottom id="referral-id">
                                {user.uid}
                                <FileCopyOutlinedIcon className={classes.copyTag}  onClick={() => this.onCopy(user.uid)} />
                            </Typography>
                        </Box>
                        <Box p="8px 24px 0px">
                            <Typography component="div" variant="h6" gutterBottom style={{ marginTop: '16px', opacity: '0.8' }}>
                                Default Referral Link
                            </Typography>
                            <Typography variant="body1" gutterBottom paragraph={true} style={{ wordBreak: 'break-all' }}>
                                {referralLink}
                                <FileCopyOutlinedIcon className={classes.copyTag} onClick={() => this.onCopy(referralLink)}/>
                            </Typography>
                        </Box>
                </Box> 
                {/* <div className="pg-profile-page__referral mb-3">
                    <fieldset className="pg-copyable-text__section" onClick={this.doCopy}>
                        <legend className="cr-deposit-crypto__copyable-title">
                            <FormattedMessage id="page.body.profile.header.referralProgram"/>
                        </legend>
                        <CopyableTextField
                            className="pg-copyable-text-field__input"
                            value={referralLink}
                            fieldId="referral-id"
                            copyButtonText={this.translate('page.body.profile.content.copyLink')}
                        />
                    </fieldset>
                </div> */}
            </>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchSuccess: payload => dispatch(alertPush(payload)),
});

// tslint:disable-next-line
export const ReferralProgram = injectIntl(withStyles(useStyles as {})(connect(mapStateToProps, mapDispatchToProps)(ReferralProgramClass) as any));
