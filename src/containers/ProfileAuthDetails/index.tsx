import cr from 'classnames';
import { History } from 'history';
import * as React from 'react';
// import { Button } from 'react-bootstrap';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ProfileTwoFactorAuth } from '../';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { CustomInput, Modal } from '../../components';
import { PASSWORD_REGEX } from '../../helpers';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { Theme, withStyles} from '@material-ui/core/styles';

import {
    RootState,
    selectUserInfo,
    User,
} from '../../modules';
import {
    changePasswordFetch,
    selectChangePasswordSuccess,
    selectTwoFactorAuthSuccess,
    toggle2faFetch,
    toggleUser2fa,
} from '../../modules/user/profile';

const useStyles = (theme: Theme) => ({
    flexRows: {
        display: 'flex'
    },
    rootSecurity: {
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.only('xs')]: {
            display: 'block',
        },
    }
});

interface ReduxProps {
    user: User;
    passwordChangeSuccess?: boolean;
    toggle2FASuccess?: boolean;
}

interface RouterProps {
    history: History;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface DispatchProps {
    changePassword: typeof changePasswordFetch;
    clearPasswordChangeError: () => void;
    toggle2fa: typeof toggle2faFetch;
    toggleUser2fa: typeof toggleUser2fa;
}

interface ProfileProps {
    showModal: boolean;
}

interface State {
    showChangeModal: boolean;
    showModal: boolean;
    oldPassword: string;
    newPassword: string;
    confirmationPassword: string;
    oldPasswordFocus: boolean;
    newPasswordFocus: boolean;
    confirmPasswordFocus: boolean;
    code2FA: string;
    code2FAFocus: boolean;
}

type Props = ReduxProps & DispatchProps & RouterProps & ProfileProps & InjectedIntlProps & OnChangeEvent;

class ProfileAuthDetailsComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showChangeModal: false,
            showModal: false,
            oldPassword: '',
            newPassword: '',
            confirmationPassword: '',
            oldPasswordFocus: false,
            newPasswordFocus: false,
            confirmPasswordFocus: false,
            code2FA: '',
            code2FAFocus: false,
        };
    }

    public componentWillReceiveProps(next: Props) {
        const { toggle2FASuccess } = this.props;

        if (next.passwordChangeSuccess) {
            this.setState({
                showChangeModal: false,
                oldPassword: '',
                newPassword: '',
                confirmationPassword: '',
                confirmPasswordFocus: false,
            });
        }

        if (next.toggle2FASuccess && next.toggle2FASuccess !== toggle2FASuccess) {
            this.props.toggleUser2fa();
        }
    }

    public render() {
        const {
            user,
            classes
        } = this.props;
        const {
            oldPasswordFocus,
            newPasswordFocus,
            confirmationPassword,
            oldPassword,
            newPassword,
            confirmPasswordFocus,
        } = this.state;

        const oldPasswordClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': oldPasswordFocus,
        });

        const newPasswordClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': newPasswordFocus,
        });

        const confirmPasswordClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': confirmPasswordFocus,
        });

        const changeModalBody = (
            <div className="cr-email-form__form-content">
                <div className={oldPasswordClass}>
                    <CustomInput
                        type="password"
                        label={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.old'})}
                        placeholder={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.old'})}
                        defaultLabel="Old password"
                        handleChangeInput={this.handleOldPassword}
                        inputValue={oldPassword}
                        handleFocusInput={this.handleClickFieldFocus('oldPasswordFocus')}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={true}
                    />
                </div>
                <div className={newPasswordClass}>
                    <CustomInput
                        type="password"
                        label={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.new'})}
                        placeholder={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.new'})}
                        defaultLabel="New password"
                        handleChangeInput={this.handleNewPassword}
                        inputValue={newPassword}
                        handleFocusInput={this.handleClickFieldFocus('newPasswordFocus')}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={false}
                    />
                </div>
                <div className={confirmPasswordClass}>
                    <CustomInput
                        type="password"
                        label={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.conf'})}
                        placeholder={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.conf'})}
                        defaultLabel="Password confirmation"
                        handleChangeInput={this.handleConfPassword}
                        inputValue={confirmationPassword}
                        handleFocusInput={this.handleClickFieldFocus('confirmPasswordFocus')}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={false}
                    />
                </div>
                <div className="cr-email-form__button-wrapper">
                    <Button
                        disabled={!this.isValidForm()}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary" 
                    >
                        {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change' })}
                    </Button>
                </div>
            </div>
        );

        const modal = this.state.showChangeModal ? (
            <div className="cr-modal">
              <form className="cr-email-form" onSubmit={this.handleChangePassword}>
                <div className="pg-change-password-screen">
                  {this.renderChangeModalHeader()}
                  {changeModalBody}
                </div>
              </form>
            </div>
        ) : null;

        return (
            <>
                <Box mt={2}>
                    <Grid container>
                        <Grid item md={12}>
                            <div className={classes.flexRows}>
                                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>UID:</Typography>
                                <Typography variant="h5" gutterBottom style={{ marginLeft: '8px' }}>{user.uid}</Typography>
                            </div>
                            <div className={classes.flexRows}>
                                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>Email:</Typography>
                                <Typography variant="h5" gutterBottom style={{ marginLeft: '8px' }}>{user.email}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
                <Box mt={2}>
                    <Paper variant="outlined" style={{ padding: '8px' }}>
                        <div className={classes.rootSecurity}>
                            <div style={{ display: 'block' }}>
                                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
                                    {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password'})}
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    ************
                                </Typography>
                            </div>
                            <div style={{ margin: '16px 0px 0px' }}>
                                <Button
                                    onClick={this.showChangeModal}
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >
                                    {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change'})}
                                </Button>
                            </div>
                        </div>
                    </Paper>
                </Box>
                {modal}
                {this.renderProfileTwoFactor()}
                 <div className="pg-profile-page__box pg-profile-page__left-col__basic">

                <Modal
                    className="pg-profile-page__disable-2fa-modal"
                    show={this.state.showModal}
                    header={this.renderModalHeader()}
                    content={this.renderModalBody()}
                    footer={this.renderModalFooter()}
                />
                 </div>
                {/* <div className="pg-profile-page__box pg-profile-page__left-col__basic">
                    <div className="pg-profile-page__box-header pg-profile-page__left-col__basic__info-row">
                        <div className="pg-profile-page__left-col__basic__info-row__block">
                            <div className="pg-profile-page__row pg-profile-page__details-user">
                                <div style={{ fontSize: '24px', fontWeight: 500 }}>Email: </div>
                                {user.email}
                            </div>
                            <div className="pg-profile-page__row">
                                <div style={{ fontSize: '24px', fontWeight: 500 }}>UID: </div>
                                <p>{user.uid}</p>
                            </div>
                        </div>
                    </div>
                    <div className="pg-profile-page__row">
                        <div>
                            <div className="pg-profile-page__label">
                                {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password'})}
                            </div>
                            <div>
                                ************
                            </div>
                        </div>
                        <Button
                           onClick={this.showChangeModal}
                           variant="contained"
                           color="primary"
                           size="large"
                        >
                            {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change'})}
                        </Button>
                        {modal}
                    </div>
                    {this.renderProfileTwoFactor()}
                    <Modal
                        className="pg-profile-page__disable-2fa-modal"
                        show={this.state.showModal}
                        header={this.renderModalHeader()}
                        content={this.renderModalBody()}
                        footer={this.renderModalFooter()}
                    />
                </div> */}
            </>
        );
    }

    private renderProfileTwoFactor = () => {
        return (
            <React.Fragment>
                {/* <div className="pg-profile-page__row">
                    <ProfileTwoFactorAuth is2faEnabled={this.props.user.otp} navigateTo2fa={this.handleNavigateTo2fa}/>
                </div> */}
                <ProfileTwoFactorAuth is2faEnabled={this.props.user.otp} navigateTo2fa={this.handleNavigateTo2fa}/>
            </React.Fragment>
        );
    };

    private renderModalHeader = () => {
        return (
            <div className="cr-email-form__options-group">
                <div className="cr-email-form__option">
                    <div className="cr-email-form__option-inner">
                        <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.modalHeader"/>
                        <div className="cr-email-form__cros-icon" onClick={this.closeModal}>
                            <CloseIcon className="close-icon" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    private renderModalBody = () => {
        const { code2FA, code2FAFocus } = this.state;

        const code2FAClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': code2FAFocus,
        });

        return (
            <div className="pg-exchange-modal-submit-body pg-exchange-modal-submit-body-2fa">
                <div className={code2FAClass}>
                    <CustomInput
                        type="text"
                        label="2FA code"
                        placeholder="2FA code"
                        defaultLabel=""
                        handleFocusInput={this.handleClickFieldFocus('code2FAFocus')}
                        handleChangeInput={this.handleChange2FACode}
                        inputValue={code2FA}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={true}
                    />
                </div>
            </div>
        );
    };

    private renderModalFooter = () => {
        const { code2FA } = this.state;
        const isValid2FA = code2FA.match('^[0-9]{6}$');

        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    disabled={!isValid2FA}
                    onClick={this.handleDisable2FA}
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    {this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.twoFactorAuthentication.disable'})}
                </Button>
            </div>
        );
    };

    private renderChangeModalHeader = () => (
        <div className="cr-email-form__options-group">
            <div className="cr-email-form__option">
                <div className="cr-email-form__option-inner">
                    <FormattedMessage id="page.body.profile.header.account.content.password.change"/>
                    <div className="cr-email-form__cros-icon" onClick={this.handleCancel}>
                        <CloseIcon className="close-icon" />
                    </div>
                </div>
            </div>
        </div>
    );

    private handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        this.props.changePassword({
            old_password: this.state.oldPassword,
            new_password: this.state.newPassword,
            confirm_password: this.state.confirmationPassword,
        });
    };

    private handleChange2FACode = (value: string) => {
        this.setState({
            code2FA: value,
        });
    };

    private handleDisable2FA = () => {
        this.props.toggle2fa({
            code: this.state.code2FA,
            enable: false,
        });
        this.closeModal();
        this.handleChange2FACode('');
    };

    private closeModal = () => {
        this.setState({
            showModal: false,
        });
      };

    private showChangeModal = () => {
        this.setState({
            showChangeModal: true,
        });
    };

    private handleNavigateTo2fa = (enable2fa: boolean) => {
        if (enable2fa) {
            this.props.history.push('/security/2fa', { enable2fa });
        } else {
            this.setState({
                showModal: !this.state.showModal,
            });
        }
    };

    private handleOldPassword = (value: string) => {
        this.setState({
            oldPassword: value,
        });
    };

    private handleConfPassword = (value: string) => {
        this.setState({
            confirmationPassword: value,
        });
    };

    private handleNewPassword = (value: string) => {
        this.setState({
            newPassword: value,
        });
    };

    private handleCancel = () => {
        this.setState({
            showChangeModal: false,
            oldPassword: '',
            newPassword: '',
            confirmationPassword: '',
        });
    };

    private handleClickFieldFocus = (field: string) => () => {
        this.handleFieldFocus(field);
    };

    private handleFieldFocus = (field: string) => {
        // @ts-ignore
        this.setState(prev => ({
            [field]: !prev[field],
        }));
    };

    private isValidForm() {
        const {
            confirmationPassword,
            oldPassword,
            newPassword,
        } = this.state;
        const isNewPasswordValid = newPassword.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = newPassword === confirmationPassword;

        return oldPassword && isNewPasswordValid && isConfirmPasswordValid;
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    passwordChangeSuccess: selectChangePasswordSuccess(state),
    toggle2FASuccess: selectTwoFactorAuthSuccess(state),
});

const mapDispatchToProps = dispatch => ({
    changePassword: ({ old_password, new_password, confirm_password }) =>
        dispatch(changePasswordFetch({ old_password, new_password, confirm_password })),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    toggleUser2fa: () => dispatch(toggleUser2fa()),
});


export const ProfileAuthDetails = injectIntl(withStyles(useStyles as {})(withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileAuthDetailsComponent) as any)));
