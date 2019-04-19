import React from 'react'
import { StyleSheet } from 'react-native'

import {
    Container,
    Button,
    Text,
    Header,
    Content,
    Title,
    Body,
    Icon,
    Grid,
    Col,
    Right,
    Footer,
    FooterTab,
    Toast,
    Root,
    View,
    Fab,
    Spinner,
    Row,
    List,
    ListItem,
    Badge,
    Left,
    Subtitle
} from "native-base";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default ({ navigation }) => (
    <Container style={styles.container}>
        <Header>
            <Left>
                <Button
                    transparent
                    onPress={() => navigation.openDrawer()}
                >
                    <Icon name="menu" />
                </Button>
            </Left>
            <Body>
                <Title>Premis</Title>
                <Subtitle>0 premios</Subtitle>
            </Body>
            <Right></Right>
        </Header>
        <Content padder>
            <Text>Heeeey, esto aún no está listo.</Text>
        </Content>
    </Container>
)