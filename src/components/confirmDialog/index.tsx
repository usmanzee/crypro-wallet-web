import * as React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { makeStyles, Theme, createStyles, withStyles} from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

export interface confirmDialogProps {
    title: string;
    body: string;
    open: boolean;
    confimButtonText: string;
    cancelButtonText: string;
    handleConfirmClick: () => void;
    handleClose: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

   
  }),
);

type Props = confirmDialogProps & InjectedIntlProps;

const ConfirmDialogComponent = (props: Props) => {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));
    const {
        title,
        body,
        open,
        confimButtonText,
        cancelButtonText,
        handleConfirmClick,
        handleClose
    } = props;

    return (
        <Dialog
            fullScreen={fullScreenDialog}
            fullWidth={true}
            maxWidth='xs'
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">{title}</Typography>
                    <CloseIcon onClick={e => handleClose()} style={{ cursor: 'pointer', }}/>
                </div>
                <div style={{ margin: '8px 0px' }}>
                    <Typography variant="body1" gutterBottom>{body}</Typography>
                </div>
                <div style={{ display: 'flex' }}>
                    <Button variant="contained" color="default" fullWidth style={{ margin: '8px 0px' }} onClick={e => handleClose()}>
                        {cancelButtonText}
                    </Button>
                    <div style={{ margin: '0px 4px' }}></div>
                    <Button variant="contained" color="secondary" fullWidth style={{ margin: '8px 0px' }} onClick={e => handleConfirmClick()}>
                        {confimButtonText}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export const ConfirmDialog = injectIntl(ConfirmDialogComponent)

