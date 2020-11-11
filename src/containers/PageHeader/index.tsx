import * as React from 'react';

import { Link } from 'react-router-dom';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageHeader: {
        padding: "32px 20px"
    },
    actionLink: {
        margin: '0px 4px'
    }
  }),
);

interface PageHeaderProps {
    pageTitle: string
    actionsLinks?: string[][]
}

type Props = PageHeaderProps & InjectedIntlProps;

const PageHeaderComponent = (props: Props) => {
    const classes = useStyles();
    const { pageTitle, actionsLinks } = props;

    const translate = (id: string) => {
        return props.intl.formatMessage({ id })
    };

    const renderActionLinks = () => (values: string[], index: number) => {
        const [name, url,] = values;
        return (
            <>
                <Link to={url} className={classes.actionLink} style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" color="secondary" size="small">
                        {translate(name)}
                    </Button>
                </Link>
            </>
        );
    }

    return (
        <>
            <Box>
                <Paper className={classes.pageHeader}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={8} lg={10}>
                            <Typography variant="h4" display="inline">{pageTitle}</Typography>
                        </Grid>
                        {actionsLinks ? 
                            <>
                                <Grid item xs={12} sm={12} md={4} lg={2}>
                                    {actionsLinks.map(renderActionLinks())}
                                </Grid>
                            </> : 
                            ''
                        }
                    </Grid>
                </Paper>
            </Box>
        </>
    );
}

export const PageHeader = injectIntl(PageHeaderComponent);
