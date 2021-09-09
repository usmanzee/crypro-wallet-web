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

export interface InfoDialogProps {
    title: string;
    body: string;
    open: boolean;
    handleClose: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

   
  }),
);

type Props = InfoDialogProps & InjectedIntlProps;

const InfoDialogComponent = (props: Props) => {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));
    const {
        title,
        body,
        open,
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
            <DialogTitle id="alert-dialog-title" style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">{title}</Typography>
                    <CloseIcon onClick={e => handleClose()} style={{ cursor: 'pointer', }}/>
                </div>
            </DialogTitle>
            <DialogContent dividers style={{ padding: '12px 16px' }}>
                <Typography variant="body1" gutterBottom>{body}</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="secondary" fullWidth style={{ margin: '8px 0px' }} onClick={e => handleClose()}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const InfoDialog = injectIntl(InfoDialogComponent)

