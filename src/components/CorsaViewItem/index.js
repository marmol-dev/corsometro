import React from "react";
import {
  Text,
  Body,
  Right,
  ListItem
} from "native-base";

// eslint-disable-next-line react/prefer-stateless-function
export class CorsaViewItem extends React.PureComponent {
  render() {
    return (
      <ListItem onLongPress={this.props.onRemove} key={this.props.id}>
        <Body>
          <Text>{this.props.disclaimer}</Text>
        </Body>
        <Right>
          <Text>{this.props.dateFromNow}</Text>
        </Right>
      </ListItem>
    )
  }
}