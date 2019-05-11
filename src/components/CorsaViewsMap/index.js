/* eslint-disable react-native/no-color-literals */
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';
import { Subscribe } from 'unstated';
import { CorsasViewsContainer, CORSAS_VIEWS_CONTAINER_KEYS } from '../../containers/CorsasViews.container';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});

export class CorsaViewsMap extends Component {
  state = {
    initialRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
    locationResult: null,
    location: { coords: { latitude: 37.78825, longitude: -122.4324 } },
  };

  constructor() {
    super()
    this.corsaViewsContainer = CorsasViewsContainer.getJoinedInstance()
  }

  componentDidMount() {
    const initialRegion = this.getInitialRegion()

    if (initialRegion) {
      this.setState({
        initialRegion
      })
    }
  }

  getInitialRegion() {
    const { list } = this.corsaViewsContainer.state

    const latestCorsaViewWithLocation = [...list].reverse().find(cv => cv.location)

    if (!latestCorsaViewWithLocation) {
      return null
    }

    const { latitude, longitude } = latestCorsaViewWithLocation.location.coords

    return {
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
  }

  getCorsaViewsWithLocation() {
    return this.corsaViewsContainer
      .getWithLocationList()
      .map(cv => CorsasViewsContainer.formatCorsaView(cv))
  }

  render() {
    return (
      <View style={styles.container}>
        <Subscribe to={[this.corsaViewsContainer]}>
          {
            cvc => (
              <MapView
                style={StyleSheet.absoluteFillObject}
                initialRegion={this.getInitialRegion()}
              >
                {
                  this.getCorsaViewsWithLocation().map(cv => (
                    <MapView.Marker
                      key={cv.id}
                      coordinate={cv.location.coords}
                      title={cv.disclaimer}
                      description={cv.dateFromNow}
                    />
                  ))
                }
              </MapView>
            )
          }
        </Subscribe>

      </View>
    );
  }
}
