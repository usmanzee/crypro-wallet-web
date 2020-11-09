/* tslint:disable jsx-no-multiline-js */
import * as React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import { Theme, withStyles} from '@material-ui/core/styles';

interface ProfileTwoFactorAuthProps {
    is2faEnabled?: boolean;
    navigateTo2fa?: (enable2fa: boolean) => void;
    openModal?: () => void;
    classes?: any;
}

interface ProfileTwoFactorAuthState {
    is2faEnabled: boolean;
}

const useStyles = (theme: Theme) => ({
    rootSecurity: {
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.only('xs')]: {
            display: 'block',
        },
    }
});


type Props = ProfileTwoFactorAuthProps;

class ProfileTwoFactorAuthComponent extends React.Component<Props, ProfileTwoFactorAuthState> {
    constructor(props: ProfileTwoFactorAuthProps) {
        super(props);

        this.state = {
            is2faEnabled: props.is2faEnabled || false,
        };
    }

    public componentWillReceiveProps(next: ProfileTwoFactorAuthProps) {
        if (next.is2faEnabled !== this.props.is2faEnabled) {
            this.setState({
                is2faEnabled: next.is2faEnabled || false,
            });
        }
    }

    public render() {
        const { classes } = this.props;
        const { is2faEnabled } = this.state;
        const className = is2faEnabled ? 'pg-profile-page__label-value__enabled'
                                       : 'pg-profile-page__label-value__disabled';

        return (
            <React.Fragment>
                <Box mt={2}>
                    <Paper variant="outlined" style={{ padding: '8px' }}>
                        <div className={ classes.rootSecurity }>
                            <div style={{ display: 'block' }}>
                                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
                                    <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication" />: 
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    <span className={className}>
                                        {is2faEnabled ? <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.message.enable" />
                                                    : <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.message.disable" />}
                                    </span>
                                </Typography>
                            </div>
                            <div style={{ margin: '16px 0px 0px' }}>
                                <Switch
                                    checked={is2faEnabled}
                                    onChange={this.handleToggle2fa}
                                    color="primary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </div>
                        </div>
                    </Paper>
                </Box>
                {/* <label className="pg-profile-page__label">
                    <div>
                        <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication" />
                    </div>
                    <span className={className}>
                    {is2faEnabled ? <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.message.enable" />
                                  : <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.message.disable" />}
                    </span>
                </label>
                <Form>
                    <Form.Check
                        type="switch"
                        id="2fa-switch"
                        label=""
                        onChange={this.handleToggle2fa}
                        checked={is2faEnabled}
                    />
                </Form> */}
            </React.Fragment>
        );
    }

    private handleToggle2fa = () => {
        if (this.props.navigateTo2fa) {
            this.props.navigateTo2fa(!this.state.is2faEnabled);
        }
    };
}

export const ProfileTwoFactorAuth = withStyles(useStyles)(ProfileTwoFactorAuthComponent);
