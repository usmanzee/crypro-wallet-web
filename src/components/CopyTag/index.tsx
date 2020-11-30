import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { makeStyles, Theme, createStyles, withStyles} from '@material-ui/core/styles';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { 
    RootState, 
    alertPush,
} from '../../modules';

interface DispatchProps {
    fetchAlert: typeof alertPush;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        copyTag: {
            margin: '0px 8px', 
            cursor: 'pointer',
            "&:hover": {
                '& path': {
                    fill: theme.palette.secondary.main,
                }
            }
        },
    }),
);

export interface CopyTagProps {
    text: string;
    disabled?: boolean;
}

type Props = CopyTagProps & DispatchProps & InjectedIntlProps;

const CopyTagComponent = (props: Props) => {
    const classes = useStyles();
    const [copyTooltipText, setCopyTooltipText] = React.useState<string>(props.intl.formatMessage({ id: 'page.body.copy' }));

    const { text, disabled } = props;
    const onCopy = (textToCopy: string) => {
        copyToClipboard(textToCopy);
        props.fetchAlert({message: ['copied.to.clipboard'], type: 'success'});
    }
    const copyToClipboard = (text) => {
        var textField = document.createElement('textarea')
        textField.innerText = text;
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        setCopyTooltipText(props.intl.formatMessage({ id: 'page.body.copied' }));
        textField.remove()
    };

    const setCopyTooltipTextOnMouseOut = () => {
        setCopyTooltipText(props.intl.formatMessage({ id: 'page.body.copy' }));
    }

    const translate = (id: string) => props.intl.formatMessage({ id });

    const LightTooltip = withStyles((theme: Theme) => ({
        tooltip: {
          backgroundColor: theme.palette.common.white,
          color: 'rgba(0, 0, 0, 0.87)',
          boxShadow: theme.shadows[1],
          fontSize: 13,
        },
    }))(Tooltip);

    return (
        <>
            {disabled ? 
                <LightTooltip title={copyTooltipText} placement="right-start" arrow>
                    <IconButton aria-label="launch" disabled={disabled} edge="start">
                        <FileCopyOutlinedIcon className={classes.copyTag} onClick={()=>onCopy(text)} onMouseOut={setCopyTooltipTextOnMouseOut}/>
                    </IconButton>
                </LightTooltip>
            :
                <LightTooltip title={copyTooltipText} placement="right-start">
                    <FileCopyOutlinedIcon className={classes.copyTag} onClick={()=>onCopy(text)} onMouseOut={setCopyTooltipTextOnMouseOut}/>
                </LightTooltip>
            }
        </>
    );
}

CopyTagComponent.defaultProps = {
    disabled: false,
};

const mapDispatchToProps = dispatch => ({
    fetchAlert: payload => dispatch(alertPush(payload)),
});

export const CopyTag = injectIntl(connect(null, mapDispatchToProps)(CopyTagComponent) as any);