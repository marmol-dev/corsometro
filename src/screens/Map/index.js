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
import { CorsaViewsMap } from '../../components/CorsaViewsMap';
import { Subscribe } from 'unstated';
import { CorsasViewsContainer } from '../../containers';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flexGrow: 1
    }
});

const corsasViewContainer = CorsasViewsContainer.instance

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
                <Title>Mapa</Title>
                <Subtitle>
                    <Subscribe to={[corsasViewContainer]}>{cvc => cvc.getWithLocationList().length + ' corsas ubicados'}</Subscribe>
                </Subtitle>
            </Body>
            <Right></Right>
        </Header>
        <Content contentContainerStyle={styles.content}>
            <CorsaViewsMap />
        </Content>
    </Container>
)