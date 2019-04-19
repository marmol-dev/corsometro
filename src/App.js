
import { Root } from 'native-base'
import { AppLoading, Font } from 'expo'
import React from 'react'
import AppContainer from './screens/Container'
export default class extends React.Component {
  state = {
    appLoaded: false
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    })
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
        <AppContainer />
      </Root> 
    )
  }
}

