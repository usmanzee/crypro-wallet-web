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
import CloseIcon from '@material-ui/icons/Close';

export interface VideoTutorialDialogProps {
    open: boolean;
    handleClose: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

   
  }),
);

/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */
type Props = VideoTutorialDialogProps & InjectedIntlProps;

const P2PVideoTutorialDialogComponent = (props: Props) => {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));
    const {
        open,
        handleClose
    } = props;

    return (
        <Dialog
            fullScreen={fullScreenDialog}
						fullWidth={true}
						maxWidth='md'
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <CloseIcon onClick={e => handleClose()} style={{ cursor: 'pointer', }}/>
          </div>
        </DialogTitle>
        <DialogContent>
            <iframe width="100%" height={fullScreenDialog ? "90%" : "350"} src="https://www.youtube.com/embed/gYRR3c_S4F0" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
        </DialogContent>
      </Dialog>
    );
};

export const P2PVideoTutorialDialog = injectIntl(P2PVideoTutorialDialogComponent)

