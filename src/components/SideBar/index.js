/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prefer-stateless-function */
import React from "react";
import { AppRegistry, Image, StatusBar } from "react-native";
import {
  Button,
  Text,
  Container,
  List,
  ListItem,
  Content,
  Icon,
  Left,
  Body,
  Right
} from "native-base";
import { UserContainer } from '../../containers/User.container'
import { Subscribe } from "unstated";

const routes = [
  {
    title: 'Corsómetro',
    screen: 'Home',
    icon: <Icon name="home" />
  },
  {
    title: 'Premios',
    screen: 'Prizes',
    icon: <Icon type='Entypo' name="price-ribbon" />
  },
  {
    title: 'Mapa',
    screen: 'Map',
    icon: <Icon name="map" />
  }

];


export default class SideBar extends React.Component {
  constructor() {
    super()
    this.userContainer = UserContainer.instance
  }

  getRoutes() {
    return [
      ...routes,
      this.userContainer.state.isLogged ? {
        title: 'Mi perfil',
        screen: 'Profile',
        icon: <Icon name="user" />
      } : {
        title: 'Iniciar sesión',
        icon: <Icon name="user" />,
        onPress: () => {
          console.log('dom something')
        } 
      }
    ]
  }

  render() {
    return (
      <Container>
        <Content>
          <Image
            source={require('../../../assets/corsas/corsa_courel.jpg')}
            style={{
              height: 120,
              width: "100%",
              alignSelf: "stretch",
              position: "absolute"
            }}
          />
          <Subscribe to={[this.userContainer]}>
            {
              uc => (
                <List
                  dataArray={this.getRoutes()}
                  contentContainerStyle={{ marginTop: 120 }}
                  renderRow={route => {
                    return (
                      <ListItem
                        button
                        onPress={() => {
                          if (route.screen) {
                            this.props.navigation.navigate(route.screen)
                          } else if (route.onPress) {
                            route.onPress()
                          }
                        }}
                        icon
                      >
                        <Left>
                          {route.icon}
                        </Left>
                        <Body>
                          <Text>{route.title}</Text>
                        </Body>
                      </ListItem>
                    );
                  }}
                />
              )
            }
          </Subscribe>
        </Content>
      </Container>
    );
  }
}