import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GreenRedVersion from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';

export default class NoteEdit extends React.Component {
    constructor() {
        super();
        this.state = {
            delete: 'ios-trash',
            save: 'ios-checkmark-circle',
            visible: false,
            price: null
        }
    }

    // Function used to close the price modal
    checkBoxFunc() { this.props.bought(false) }

    // Function used to save the icon as bought with price
    iconSave() { if (this.state.price != null) this.props.bought(false, this.props.keyval, this.state.price, null, this.props.val.itemName) }

    render() {
        return (
            <View style={styles.note} key={this.props.keyval}>
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.checkBoxFunc.bind(this)}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.noteText}>{this.props.val.itemName}</Text>
                        <Text style={styles.noteDate}>{this.props.addedByRoommate.name}</Text>
                    </View>


                    <View style={styles.cancleSave}>
                        <TextInput style={styles.putPrice} placeholder={'Price'}
                            placeholderTextColor={GreenRedVersion.white07}
                            keyboardType={'numeric'}
                            onChangeText={(input) => { this.setState({ price: input }) }} />
                    </View>
                </TouchableOpacity>
                <Icon onPress={this.iconSave.bind(this)}
                    style={styles.iconSave}
                    name={this.state.save} size={40} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    note: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ededed',
        backgroundColor: GreenRedVersion.white
    },
    noteText: {
        color: GreenRedVersion.mainRed09,
        fontSize: Fonts.size18,
        fontWeight: '400'
    },
    noteDate: {
        color: GreenRedVersion.mainRed09,
        fontSize: Fonts.size16,
    },
    iconSave: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 10,
        bottom: 10,
        right: 10,
        color: GreenRedVersion.mainGreen09,
    },
    putPrice: {
        marginRight: 50,
        width: 100,
        height: 50,
        fontSize: Fonts.size18,
        textAlign: 'center',
        backgroundColor: GreenRedVersion.black07,
        borderRadius: 5,
        color: GreenRedVersion.white09,
    }
});