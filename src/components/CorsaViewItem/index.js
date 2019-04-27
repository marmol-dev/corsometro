import React from "react";
import { StyleSheet } from 'react-native'
import {
  Text,
  Body,
  Right,
  ListItem,
  View
} from "native-base";

const styles = StyleSheet.create({
  address: {
    fontSize: 11
  }
});

// eslint-disable-next-line react/prefer-stateless-function
export class CorsaViewItem extends React.PureComponent {
  render() {
    return (
      <ListItem onLongPress={this.props.onRemove} key={this.props.id}>
        <Body>
          <View><Text>{this.props.disclaimer}</Text></View>
          {this.props.address && (
            <View >
              <Text style={styles.address}>{this.props.address.city}</Text>
            </View>
          )}

        </Body>
        <Right>
          <Text>{this.props.dateFromNow}</Text>
        </Right>
      </ListItem>
    )
  }
}