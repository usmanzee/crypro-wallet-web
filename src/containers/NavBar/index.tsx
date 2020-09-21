import * as React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
// import { Button } from 'react-bootstrap';
import BellIcon from '../../assets/images/BellIcon';
// import { getNotifications } from '../../apis/exchange';
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

import * as ExchangeApi from "../../apis/exchange";
// import { NotificationType } from '../../charting_library/charting_library.min';

// interface Notification {
//     id: number,
//     subject: string,
//     body: string,
//     created_at: Date,
//     updated_at: Date,
// }

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

class NavBarComponent extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showNotification: false,
            notifications: []
        };
    }
    public async componentDidMount  (){

        try {
            await ExchangeApi.getNotifications().then((responseData) => {
                this.setState({
                    notifications: responseData
                });
              });
        //const notification = await getNotifications();
        // if (notification.length > 0){
        //     this.setState({notifications: notification});
        // } 
        } catch (error) {
          console.log(error);
        }
    };
    private renderNotification = () => {
        //const { location } = this.props;
        if (window.location.pathname.includes('/wallets')) {
            return null;
        }

        return <BellIcon 
        width='22' 
        active={true} 
        //@ts-ignore
        onClick={() =>this.setState({showNotification: !this.state.showNotification}) } />;
    };
    
    public render() {
        return (
            <div className={'pg-navbar'}>
                {this.renderNotification()} 
                <div 
                //@ts-ignore
                style={this.state.showNotification ? {} : { display: 'none' }}>
                
                <div className="notification-wrapper">
                    <div className="notification-header">
                        <span>Notifications</span>
                        <a href="#" className="notification-view-all">View All</a>
                    </div>
                    <div className="notification-body">
                    <ListGroup>
                        {this.state.notifications.map((notification) => {    
                            return (
                                <ListGroup.Item action href={`notification ${notification.id}`}>
                                    <Card.Title style={{ color: "black" }}>{ notification.subject }</Card.Title>
                                    <Card.Text>
                                        {notification.body}
                                    </Card.Text>
                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                    </div>
                    {/* <div className="notification-footer">
                        <a href="#" className="notification-view-all">View All Notifications</a>
                    </div> */}
                {/* <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                        Click me!
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>Hello! I'm the body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1">
                        Click me!
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                        <Card.Body>Hello! I'm another body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion> */}
                </div>
                </div>
                
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
