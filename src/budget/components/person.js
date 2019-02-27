import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GreenRedVersion from '../../../constants/Colors';

export default class Person extends React.Component {

    render() {
        return (
            <TouchableOpacity style={[(this.props.style != null) ? this.props.style : styles.person,
            { borderColor: this.props.payed ? GreenRedVersion.mainGreen09 : GreenRedVersion.mainRed09 }
            ]} >
                <Icon style={{ color: GreenRedVersion.white07 }} name={'ios-person'} size={50} />
            </TouchableOpacity>)
    }
}

const styles = StyleSheet.create({
    person: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        marginHorizontal: 5,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
