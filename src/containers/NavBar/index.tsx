import * as React from 'react';
//import { Card, Accordion } from 'react-bootstrap';
//import BellIcon from '../../assets/images/BellIcon';
import { getNotifications } from '../../apis/exchange';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { compose } from 'redux';
//import { Moon } from '../../assets/images/Moon';
//import { Sun } from '../../assets/images/Sun';
//import { colors } from '../../constants';
import {
    changeColorTheme,
    RootState,
    selectCurrentColorTheme,
} from '../../modules';

export interface ReduxProps {
    colorTheme: string;
}

interface DispatchProps {
    changeColorTheme: typeof changeColorTheme;
}

export interface OwnProps {
    onLinkChange?: () => void;
}

type Props = OwnProps & ReduxProps & DispatchProps;

class NavBarComponent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showNotification: false,
            notifications: []
        };
    }
    public async componentDidMount  (){
        try {
        const notification = await getNotifications();
        if (notification.length > 0){
            this.setState({notifications: notification});
        } 
        } catch (error) {
          console.log(error);
        }
    };
    // private renderNotification = () => {
    //     //const { location } = this.props;
    //     if (window.location.pathname.includes('/wallets')) {
    //         return null;
    //     }

    //     return <BellIcon 
    //     width='22' 
    //     active={true} 
    //     //@ts-ignore
    //     onClick={() =>this.setState({showNotification: !this.state.showNotification}) } />;
    // };
    
    public render() {
       // const { colorTheme } = this.props;
        //const tradingCls = window.location.pathname.includes('/wallets')
        //@ts-ignore
        // const notification = this.state.notifications.length>0
        // //@ts-ignore
        // && this.state.notifications.map((item, i ) => {
        //     return(
        //         <Card key={i}>
        //             <Accordion.Toggle as={Card.Header} eventKey={item.id}>
        //             {item.subject} <span>Date: {item.created_at}</span>
        //             </Accordion.Toggle>
        //             <Accordion.Collapse eventKey="0">
        //             <Card.Body>{item.body}</Card.Body>
        //             </Accordion.Collapse>
        //         </Card>

        //     );
        // }, this);

        return (
            <div className={'pg-navbar'}>
                {/* {this.renderNotification()}  */}
                {/* <div 
                //@ts-ignore
                style={this.state.showNotification ? {} : { display: 'none' }}>
                <div className="notification-wrapper">
                <Accordion defaultActiveKey="0">
                {notification ? notification:  <Card >
                    <Accordion.Toggle as={Card.Header} 
                    //@ts-ignore
                    eventKey="0">
                    No Notifications
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>}                       
                </Accordion>
                </div>
                </div> */}
                
                <div className="pg-navbar__header-settings">
                    {/* <div className="pg-navbar__header-settings__switcher">
                        <div
                            className="pg-navbar__header-settings__switcher__items"
                            onClick={e => this.handleChangeCurrentStyleMode(colorTheme === 'light' ? 'basic' : 'light')}
                        >
                            {this.getLightDarkMode()}
                        </div>
                    </div> */}
                </div>
            </div>
        );
    }

    // private getLightDarkMode = () => {
    //     const { colorTheme } = this.props;

    //     if (colorTheme === 'basic') {
    //         return (
    //             <React.Fragment>
    //                 <div className="switcher-item">
    //                     <Sun fillColor={colors.light.navbar.sun}/>
    //                 </div>
    //                 <div className="switcher-item switcher-item--active">
    //                     <Moon fillColor={colors.light.navbar.moon}/>
    //                 </div>
    //             </React.Fragment>
    //         );
    //     }

    //     return (
    //         <React.Fragment>
    //             <div className="switcher-item switcher-item--active">
    //                 <Sun fillColor={colors.basic.navbar.sun}/>
    //             </div>
    //             <div className="switcher-item">
    //                 <Moon fillColor={colors.basic.navbar.moon}/>
    //             </div>
    //         </React.Fragment>
    //     );
    // };

    // private handleChangeCurrentStyleMode = (value: string) => {
    //     this.props.changeColorTheme(value);
    // };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        colorTheme: selectCurrentColorTheme(state),
    });

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeColorTheme: payload => dispatch(changeColorTheme(payload)),
    });

export const NavBar = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(NavBarComponent) as any; // tslint:disable-line
