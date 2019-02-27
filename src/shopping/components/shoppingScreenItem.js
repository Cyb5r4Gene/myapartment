import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GreenRedVersion from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';

export default class Note extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
        }
    }

    // Function used to open modal to put the price and save the item as bought
    checkBoxFunc() {
        if (this.props.val.bought) {
            Alert.alert(
                'Alert',
                'Do you want to return the item to the shopping list ?',
                [
                    { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'Yes', onPress: () => this.props.bought(true, this.props.keyval, null, true) },
                ],
                { cancelable: true }
            );
        }
        else { this.props.bought(true, this.props.keyval) }
    }

    render() {
        return (
            <TouchableOpacity key={this.props.keyval} style={styles.note} onPress={this.checkBoxFunc.bind(this)}>
                <Text style={[
                    styles.noteText,
                    (this.props.val.bought) ? styles.itemBought : null
                ]}>
                    {this.props.val.itemName}</Text>
                <Text style={styles.noteDate}>{this.props.addedByRoommate.name}</Text>
                <Icon onPress={this.props.deleteMethod}
                    style={styles.noteDelete}
                    name={'ios-trash'} size={40} />
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    note: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ededed',
        backgroundColor: 'transparent',
        height: 75,
    },
    noteText: {
        color: GreenRedVersion.white,
        fontSize: Fonts.size18,
        fontWeight: '500',
    },
    noteDate: {
        color: GreenRedVersion.white07,
        fontSize: Fonts.size16,
        fontWeight: '200',
    },
    noteDelete: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 10,
        bottom: 10,
        right: 10,
        color: GreenRedVersion.mainRed09
    },
    itemBought: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    }
});