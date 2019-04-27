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
  }

];


export default class SideBar extends React.Component {
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
          <List
            dataArray={routes}
            contentContainerStyle={{ marginTop: 120 }}
            renderRow={route => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate(route.screen)}
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
        </Content>
      </Container>
    );
  }
}