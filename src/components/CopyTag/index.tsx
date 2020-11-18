import * as React from 'react';
import { connect } from 'react-redux';
import { makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import IconButton from '@material-ui/core/IconButton';

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

type Props = CopyTagProps & DispatchProps;

const CopyTagComponent = (props: Props) => {
    const classes = useStyles();
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
        textField.remove()
    };

    return (
        <>
            {disabled ? 
                <IconButton aria-label="launch" disabled={disabled} edge="start">
                    <FileCopyOutlinedIcon className={classes.copyTag} onClick={()=>onCopy(text)} />
                </IconButton>
            :
                <FileCopyOutlinedIcon className={classes.copyTag} onClick={()=>onCopy(text)} />
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

export const CopyTag = connect(null, mapDispatchToProps)(CopyTagComponent)