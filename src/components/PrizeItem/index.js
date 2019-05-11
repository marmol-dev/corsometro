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
    subtitle: {
        fontSize: 11
    },
    date: {
        fontSize: 12
    }
});

// eslint-disable-next-line react/prefer-stateless-function
export class PrizeItem extends React.PureComponent {
    render() {
        return (
            <ListItem onLongPress={this.props.onLongPress} key={this.props.id}>
                <Body>
                    <View>
                        <Text>{this.props.corsasViews.length} corsas</Text>
                    </View>
                    <View >
                        <Text style={styles.subtitle}>{this.props.obtention.done ? 'Cumplido': 'No cumplido'}</Text>
                    </View>

                </Body>
                <Right>
                    <Text style={styles.date}>{this.props.formatedCreateDate}</Text>
                </Right>
            </ListItem>
        )
    }
}