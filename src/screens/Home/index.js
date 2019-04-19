//@flow

import React from "react";
import {
  StyleSheet,
  StatusBar,
  Platform,
  AsyncStorage,
  Alert
} from "react-native";
import { Font, AppLoading } from "expo";
import uuid from "react-native-uuid";
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
import colors from 'native-base/dist/src/theme/variables/commonColor'
import Prompt from 'react-native-prompt-crossplatform';
import moment from "moment";
import 'moment/locale/es'
import TasksManager from "../../utils/TasksManager";

moment.locale('es')

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const tm = new TasksManager()

export default class Home extends React.Component {

  state = {
    appLoaded: false,
    corsasViews: [],
    isClearConfirmationVisible: false,
    isAddingAvailable: true,
    isPromptVisible: false,
    promptValue: '1'
  };

  constructor() {
    super();
    this.handleAddCorsa = this.handleAddCorsa.bind(this);
    this.handleClearCorsas = this.handleClearCorsas.bind(this);
    this.handleRemoveCorsa = this.handleRemoveCorsa.bind(this)

    this.handleCancelPrompt = this.handleCancelPrompt.bind(this)
    this.handleOpenPrompt = this.handleOpenPrompt.bind(this)
    this.handleSubmitPrompt = this.handleSubmitPrompt.bind(this)
    this.handleChangePromptText = this.handleChangePromptText.bind(this)
    this.renderCorsaView = this.renderCorsaView.bind(this)
  }

  showClearCorsasViewsConfirmation() {
    if (this.state.isClearConfirmationVisible) {
      return;
    }

    this.setState({
      isClearConfirmationVisible: true
    });

    Alert.alert(
      "Eliminar Corsas?",
      "Vas a eliminar todos los Corsas que hayas visto.",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => {
            this.setState({
              isClearConfirmationVisible: false
            });
          }
        },
        {
          text: "Eliminar",
          onPress: () => {
            this.setState({
              isClearConfirmationVisible: false
            });
            this.clearCorsasViews();
          }
        }
      ],
      { cancelable: false }
    );
  }

  async componentDidMount() {
    const [corsasViewsStr] = await Promise.all([
      AsyncStorage.getItem("corsasViews"),
    ]);

    let corsasViews = [];
    if (corsasViewsStr) {
      corsasViews = JSON.parse(corsasViewsStr)
        .map(cv => ({
          ...cv,
          createDate: new Date(cv.createDate)
        }))
        .map(cv => Home.getUpdatedCorsaView(cv));
    }

    this.setState({
      appLoaded: true,
      corsasViews
    });

    this.refreshInterval = setInterval(() => {
      this.refreshCorsasViews();
    }, 10000);
  }

  refreshCorsasViews() {
    this.setState({
      corsasViews: this.state.corsasViews.map(cv => Home.getUpdatedCorsaView(cv))
    });
  }

  componentWillUnmount() {
    clearInterval(() => this.refreshInterval);
  }

  setCorsasViews(corsasViews) {
    this.setState({
      corsasViews
    });
    tm.executeInBackground(async () => {
      await AsyncStorage.setItem("corsasViews", JSON.stringify(corsasViews));
    })
  }

  addCorsaView(view) {
    this.setCorsasViews([view, ...this.state.corsasViews]);
  }

  addManyCorsaViews(views) {
    this.setCorsasViews([...views, ...this.state.corsasViews]);
  }

  removeCorsaView(idCorsaView) {
    const corsasViews = this.state.corsasViews.filter(
      cv => cv.id !== idCorsaView
    );
    this.setCorsasViews(corsasViews);
  }

  clearCorsasViews() {
    this.setCorsasViews([]);
  }

  static disclaimers = [
    "He visto un Corsa",
    "Ahí va un Corsa",
    "Corsaaaa 👊",
    "Mira: Corsa!",
    "Eooo, un Corsa!",
    "Toma, Corsa!",
    "Corsa"
  ];

  static getRandomDisclaimer() {
    const index = Math.floor(Math.random() * this.disclaimers.length);
    const disclaimer = this.disclaimers[index];

    return typeof disclaimer === "string" ? disclaimer : disclaimer();
  }

  static getUpdatedCorsaView(cv) {
    return {
      ...cv,
      dateFromNow: moment(cv.createDate).fromNow()
    };
  }

  generateManyCorsaViews(count) {
    const corsaViews = Array.from({ length: count }, () => {
      const corsaView = {
        id: uuid.v4(),
        createDate: new Date(),
        disclaimer: Home.getRandomDisclaimer()
      };
      return Home.getUpdatedCorsaView(corsaView)
    })

    this.addManyCorsaViews(corsaViews);

    return corsaViews
  }

  handleAddCorsa() {
    this.generateManyCorsaViews(1)
  }

  handleClearCorsas() {
    this.showClearCorsasViewsConfirmation();
  }

  handleRemoveCorsa(cv) {
    if (this.state.isClearConfirmationVisible) {
      return;
    }

    this.setState({
      isRemoveCorsaConfirmationVisible: true
    });

    Alert.alert(
      "Eliminar Corsa?",
      `Vas a eliminar el corsa visto ${cv.dateFromNow}.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => {
            this.setState({
              isRemoveCorsaConfirmationVisible: false
            });
          }
        },
        {
          text: "Eliminar",
          onPress: () => {
            this.setState({
              isRemoveCorsaConfirmationVisible: false
            });
            this.removeCorsaView(cv.id);
          }
        }
      ],
      { cancelable: false }
    );
  }

  openPrompt() {
    this.setState({
      isPromptVisible: true
    })
  }

  closePrompt() {
    this.setState({
      isPromptVisible: false
    })
  }

  clearPromptData() {
    this.setState({
      promptValue: '1'
    })
  }

  handleOpenPrompt() {
    this.clearPromptData()
    this.openPrompt()
  }

  handleCancelPrompt() {
    this.closePrompt()
  }

  handleChangePromptText(promptValue) {
    this.setState({
      promptValue
    })
  }

  handleSubmitPrompt() {
    const count = parseInt(this.state.promptValue)

    if (isNaN(count)) {
      return Toast.show({
        text: "Mete un número raparij@ 🙄",
      });
    }

    this.closePrompt()
    this.setState({
      isAddingAvailable: false
    });
    this.generateManyCorsaViews(count)
    Toast.show({
      text: `Raparij@, acabas de añadir ${count} corsa${count > 1 ? 's' : ''}`,
    });
  }

  renderCorsaView(cv) {
    return (
      <ListItem onLongPress={() => this.handleRemoveCorsa(cv)} key={cv.id}>
        <Body>
          <Text>{cv.disclaimer}</Text>
        </Body>
        <Right>
          <Text>{cv.dateFromNow}</Text>
        </Right>
      </ListItem>
    );
  }

  render() {
    if (!this.state.appLoaded) {
      return <AppLoading />
    }

    return (
      <>
        <Container style={styles.container}>
          <Header>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.openDrawer()}
              >
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>Corsometro</Title>
              <Subtitle>{this.state.corsasViews.length} corsas</Subtitle>
            </Body>
            <Right>
              {this.state.corsasViews.length === 0 ? null : (
                <Button onPress={this.handleClearCorsas} transparent>
                  <Icon name="trash" />
                </Button>
              )}
            </Right>
          </Header>
          <Content>
            <List
              dataArray={this.state.corsasViews}
              renderRow={this.renderCorsaView}
            />
          </Content>
          <View>
            <Fab
              active={this.state.isAddingAvailable}
              onPress={this.handleAddCorsa}
              onLongPress={this.handleOpenPrompt}
            >
              <Icon name="ios-add" />
            </Fab>
          </View>
        </Container>
        <Prompt
          title="Cuantos corsas viste?"
          inputPlaceholder="No me mientas"
          defaultValue='1'
          isVisible={this.state.isPromptVisible}
          onChangeText={this.handleChangePromptText}
          onCancel={this.handleCancelPrompt}
          onSubmit={this.handleSubmitPrompt}
          primaryColor={colors.brandPrimary}
          submitButtonText='Añadir!'
          cancelButtonText='Cancelar' />
      </>
    );
  }
}