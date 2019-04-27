//@flow

import React from "react";
import {
  StyleSheet,
  AsyncStorage,
  Alert,
  FlatList
} from "react-native";
import { AppLoading, Permissions } from "expo";
import {
  Container,
  Button,
  Header,
  Content,
  Title,
  Body,
  Icon,
  Right,
  Toast,
  View,
  Fab,
  Left,
  Subtitle
} from "native-base";
import colors from 'native-base/dist/src/theme/variables/commonColor'
import Prompt from 'react-native-prompt-crossplatform';
import {CorsaViewItem} from '../../components/CorsaViewItem'

import TasksManager from "../../utils/TasksManager";
import { Subscribe } from "unstated";
import { CorsasViewsContainer, TimerContainer } from "../../containers";

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const tm = new TasksManager()


export default class Home extends React.Component {
  state = {
    appLoaded: false,
    isClearConfirmationVisible: false,
    isAddingAvailable: true,
    isPromptVisible: false,
    promptValue: '1',

    gpsIsBusy: false,
    gpsHasPermissions: false,
    gpsIsEnabled: false
  };

  constructor() {
    super();

    // Handlers
    // Various
    this.handleAddCorsa = this.handleAddCorsa.bind(this);
    this.handleClearCorsas = this.handleClearCorsas.bind(this);
    this.handleRemoveCorsa = this.handleRemoveCorsa.bind(this)
    this.handleToggleGps = this.handleToggleGps.bind(this)
    // Prompt
    this.handleCancelPrompt = this.handleCancelPrompt.bind(this)
    this.handleOpenPrompt = this.handleOpenPrompt.bind(this)
    this.handleSubmitPrompt = this.handleSubmitPrompt.bind(this)
    this.handleChangePromptText = this.handleChangePromptText.bind(this)

    //Containers
    this.corsasViewsContainer = CorsasViewsContainer.instance
    this.timerContainer = new TimerContainer(60 * 1000)
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
            this.corsasViewsContainer.clear()
          }
        }
      ],
      { cancelable: false }
    );
  }

  static async setStorageGpsStatus(status) {
    await AsyncStorage.setItem('gpsStatus', JSON.stringify(status))
  }

  static async getStorageGpsStatus() {
    const status = await AsyncStorage.getItem("gpsStatus")

    if (!status) {
      return false
    }

    return JSON.parse(status)
  }

  async componentDidMount() {
    const [, gpsStatus] = await Promise.all([
      this.requestGpsPermissions(),
      Home.getStorageGpsStatus()
    ]);

    this.setState({
      appLoaded: true,
      gpsIsEnabled: gpsStatus,
    });
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
    this.timerContainer.destroy()
  }

  async handleAddCorsa() {
    /*if (this.state.gpsIsEnabled) {
      const location = await Location.getCurrentPositionAsync({});
      console.log('location', location)
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
      if (address.length >= 1) {
        Alert.alert(`Te he pillado`, `Sé que estás en ${address[0].city}`)
      }
    }

    return;*/
    this.corsasViewsContainer.add(CorsasViewsContainer.generate(1))
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
            this.corsasViewsContainer.remove(cv.id)
          }
        }
      ],
      { cancelable: false }
    );
  }

  async requestGpsPermissions() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)

    this.setState({
      gpsHasPermissions: status === 'granted'
    })

    return status === 'granted'
  }

  async handleToggleGps() {
    if (this.state.gpsIsBusy) {
      return
    }

    this.setState({
      gpsIsBusy: true
    })

    let newStatus

    if (!this.state.gpsIsEnabled) {
      let hasPermissions = this.state.gpsHasPermissions
      if (!hasPermissions) {
        hasPermissions = await this.requestGpsPermissions()
      }

      newStatus = hasPermissions === true
    } else {
      newStatus = false
    }

    this.setState({
      gpsIsBusy: false,
      gpsIsEnabled: newStatus
    })

    tm.executeInBackground(() => Home.setStorageGpsStatus(newStatus))
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
    this.corsasViewsContainer.add(CorsasViewsContainer.generate(count))
    Toast.show({
      text: `Raparij@, acabas de añadir ${count} corsa${count > 1 ? 's' : ''}`,
    });
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
              <Subscribe to={[this.corsasViewsContainer]}>
                {cv => <Subtitle>{cv.state.list.length} corsas</Subtitle>}
              </Subscribe>
            </Body>
            <Right>
              <Button onPress={this.handleToggleGps} transparent>
                <Icon type="MaterialIcons" name={this.state.gpsIsEnabled ? 'gps-fixed' : 'gps-not-fixed'} />
              </Button>
              <Subscribe to={[this.corsasViewsContainer]}>
                {
                  cv => cv.state.list.length === 0 ? null : (
                    <Button onPress={this.handleClearCorsas} transparent>
                      <Icon name="trash" />
                    </Button>
                  )
                }
              </Subscribe>
            </Right>
          </Header>
          <Content>
            <Subscribe to={[this.corsasViewsContainer, this.timerContainer]}>
              {
                cv => (
                  <FlatList 
                    data={cv.getFormatedList()} 
                    keyExtractor={cv => cv.id}
                    inverted
                    refreshing
                    renderItem={cv => <CorsaViewItem {...cv.item} onRemove={() => this.handleRemoveCorsa(cv.item)} />} 
                  />
                )
              }
            </Subscribe>
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