import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { Theme, withStyles} from '@material-ui/core/styles';

import { connect, MapDispatchToProps } from 'react-redux';
import { CopyableTextField } from '../../components';
import { CopyTag } from '../../components';
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
                                {this.translate('page.body.profile.tabs.referral.title')}
                            </Typography>
                            <Typography variant="button" gutterBottom>
                                {this.translate('page.body.profile.tabs.referral.description')}
                            </Typography>
                        </Box>
                        <Box p="8px 24px 0px">
                            <Typography component="h6" variant="h5" gutterBottom style={{ fontWeight: 500 }}>
                                {this.translate('page.body.profile.tabs.referral.instruction.title')}
                            </Typography>
                            <Typography variant="body1" gutterBottom style={{ opacity: '0.8' }}>
                                {this.translate('page.body.profile.tabs.referral.instruction.description')}
                            </Typography>
                        </Box>
                        <Box p="8px 24px 0px">
                            <Typography component="div" variant="h6" gutterBottom style={{ opacity: '0.8' }}>
                                {this.translate('page.body.profile.tabs.referral.id')}
                            </Typography>
                            <Typography variant="body1" gutterBottom id="referral-id">
                                {user.uid}
                                <CopyTag text={user.uid} disabled={false} />
                            </Typography>
                        </Box>
                        <Box p="8px 24px 0px">
                            <Typography component="div" variant="h6" gutterBottom style={{ marginTop: '16px', opacity: '0.8' }}>
                                {this.translate('page.body.profile.tabs.referral.link')}
                            </Typography>
                            <Typography variant="body1" gutterBottom paragraph={true} style={{ wordBreak: 'break-all' }}>
                                {referralLink}
                                <CopyTag text={referralLink} disabled={false} />
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
