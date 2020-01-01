
import { Root } from 'native-base'
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React from 'react'
import AppContainer from './screens/Container'
import { Provider } from 'unstated';
import { Ionicons, MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

import { CorsasViewsContainer, CORSAS_VIEWS_CONTAINER_KEYS } from './containers/CorsasViews.container';
import { PrizesContainer } from './containers/Prizes.container';
export default class extends React.Component {
  state = {
    appLoaded: false
  }

  async componentDidMount() {
    await Promise.all([
      CorsasViewsContainer.getInstanceByKey(CORSAS_VIEWS_CONTAINER_KEYS.CURRENT).load(),
      CorsasViewsContainer.getInstanceByKey(CORSAS_VIEWS_CONTAINER_KEYS.HISTORIC).load(),
      PrizesContainer.instance.load(),
      Font.loadAsync({
        Roboto: require('../node_modules/native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('../node_modules/native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      }),
    ])
    this.setState({
      appLoaded: true
    })
  }

  render() {
    if (!this.state.appLoaded) {
      return <AppLoading />
    }

    return (
      <Root>
        <Provider>
          <AppContainer />
        </Provider>
      </Root>
    )
  }
}

