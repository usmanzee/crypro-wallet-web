import * as React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { makeStyles, Theme, createStyles, withStyles} from '@material-ui/core/styles';
import { Link } from "react-router-dom";

import { 
    Box, 
    Paper,
    Typography,
    Popper,
    InputBase,
    Divider,
    Button,
    Chip,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    InputLabel,
    TextField,
    InputAdornment,
    FormControl,
    Menu,
    MenuItem,
    Dialog,
    DialogContent,
    DialogTitle,
    useMediaQuery
} from '@material-ui/core';

import ReceiptIcon from '@material-ui/icons/Receipt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PlayCircleOutlineRoundedIcon from '@material-ui/icons/PlayCircleOutlineRounded';

import {
    useParams,
    useHistory
} from "react-router-dom";

export interface P2PLinksProps {
    handleVideoDialogOpen: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    videoLink: {
        [theme.breakpoints.up('sm')]: {
            color: '#000',
            marginLeft: theme.spacing(2),
            cursor: 'pointer',
            '&:hover': {
                textDecoration: 'none',
                color: '#000',
                opacity: '0.6',
            },
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        },
    },
    mobileVideoLink: {
        [theme.breakpoints.up('sm')]: {
           display: 'none'
        },
    },
    moreLink: {
        color: '#000',
        marginLeft: theme.spacing(2),
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none',
            color: '#000',
            opacity: '0.6',
        },
    },
  }),
);

/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */
type Props = InjectedIntlProps;

const P2PLinksComponent = (props: Props) => {
    const classes = useStyles();
    const theme = useTheme();
    let history = useHistory();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

    const [moreMenuAnchorEl, setMoreMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMoreMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setMoreMenuAnchorEl(event.currentTarget);
    };
    
    const handleMoreMenuClose = (url: string) => {
        setMoreMenuAnchorEl(null);
        history.push(url);
    };

    const {
        handleVideoDialogOpen
    } = props;

    return (
        <div style={{ display: 'flex' }}>
            <div className={classes.videoLink} onClick={e => handleVideoDialogOpen()}>
                <PlayCircleOutlineRoundedIcon style={{ marginBottom: '4px', marginRight: '4px' }}/>
                <Typography variant="h6" component="div"  display="inline" style={{ fontSize: '14px' }}>
                    Video Tutorial
                </Typography>   
            </div>
            <Link to="/" className={classes.moreLink}>
                <ReceiptIcon style={{ marginBottom: '4px', marginRight: '4px' }}/>
                <Typography variant="h6" component="div"  display="inline" style={{ fontSize: '14px' }}>
                    Orders
                </Typography>   
            </Link>
            <div className={classes.moreLink} onClick={e => handleMoreMenuClick(e)}>
                <MoreVertIcon style={{ marginBottom: '4px' }}/>
                <Typography variant="h6" component="div"  display="inline" style={{ fontSize: '14px' }}>
                    More
                </Typography>   
            </div>
            <Menu
                id="more-menu"
                anchorEl={moreMenuAnchorEl}
                keepMounted
                open={Boolean(moreMenuAnchorEl)}
                onClose={handleMoreMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <MenuItem onClick={e => handleMoreMenuClose('/profile/payment/p2p')}>Payment Settings</MenuItem>
                <MenuItem onClick={e => handleMoreMenuClose('/p2p/post-ad')}>Post new Ad</MenuItem>
                <MenuItem onClick={e => handleMoreMenuClose('/p2p/my-ads')}>My Ads</MenuItem>
                <MenuItem onClick={e => handleMoreMenuClose('/p2p/post-ad')}>Become a Merchant</MenuItem>
                <MenuItem onClick={e => handleVideoDialogOpen()} className={classes.mobileVideoLink}>Video Tutorial</MenuItem>
                <MenuItem onClick={e => handleMoreMenuClose('/p2p/post-ad')}>P2P Trading FAQ</MenuItem>
            </Menu>
        </div>
    );
};

export const P2PLinks = injectIntl(P2PLinksComponent)

