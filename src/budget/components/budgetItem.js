import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import GreenRedVersion from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';

const avatarsArray = [
    require('../../../assets/images/avatars/icons1-96.png'),
    require('../../../assets/images/avatars/icons4-96.png'),
    require('../../../assets/images/avatars/icons5-96.png'),
    require('../../../assets/images/avatars/icons3-96.png'),
    require('../../../assets/images/avatars/icons2-96.png'),
    require('../../../assets/images/avatars/icons7-96.png'),
    require('../../../assets/images/avatars/icons6-96.png'),
    require('../../../assets/images/avatars/icons8-96.png'),
]
export default class BudgetItem extends React.Component {

    static navigationOptions = { header: null, };

    // Hide and show the modal
    exitModal() { this.props.changeState(this.props.keyval); }

    render() {
        const profilePhoto = avatarsArray[this.props.roommate.photoURL];
        return (
            <View style={styles.inputContainer}>
                <Image source={profilePhoto} style={styles.inputIcon} />
                <Text style={styles.textUnderIcon}>{this.props.roommate.name.split(" ")[0]}</Text>
                <TouchableOpacity style={styles.input} onPress={() => this.exitModal()}>
                    <Text style={styles.itemPrice}>- {this.props.val.price} €</Text>
                    <Text style={styles.item}>{this.props.val.itemName}</Text>
                    <Text style={styles.itemDatetime}>{this.props.val.time}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        width: '95%',
        height: 90,
        borderTopRightRadius: 45,
        borderBottomRightRadius: 45,
        borderBottomLeftRadius: 2,
        borderTopLeftRadius: 2,
        paddingLeft: 90,
        backgroundColor: GreenRedVersion.black04,
        justifyContent: 'center',
    },
    inputIcon: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: GreenRedVersion.white07,
    },
    textUnderIcon: {
        color: GreenRedVersion.white07,
        position: 'absolute',
        top: 70,
        left: 10,
        width: 60,
        textAlign: 'center',
    },
    inputContainer: {
        marginTop: 10,
    },
    itemPrice: {
        color: GreenRedVersion.mainRed09,
        fontSize: Fonts.size18,
        fontWeight: 'bold'
    },
    item: {
        color: GreenRedVersion.white09,
        fontSize: Fonts.size16,
    },
    itemDatetime: {
        position: 'absolute',
        right: 20,
        top: 35,
        color: GreenRedVersion.white07,
        fontSize: Fonts.size16,
    }
});