import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import GreenRedVersion from '../../../constants/Colors';

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
export default class Roommate extends React.Component {
    constructor() {
        super();
        this.state = {
            incrementDecrement: false,
            value: null,
        }
    }

    // Function used to increment or decrement the number in the badge circle
    incrementDecrementFunction() {
        if (!this.state.incrementDecrement) {
            this.setState({
                incrementDecrement: true,
                value: this.props.count
            }, () => this.props.doWhat(true, this.props.keyval, this.props.val.name))
        }
        else {
            if (this.state.value == (this.props.count - 1)) {
                this.setState({
                    incrementDecrement: false,
                    value: null
                }, () => this.props.doWhat(false))
            }
        }
    }

    render() {
        const profilePhoto = avatarsArray[this.props.val.photoURL];
        return (
            <View style={{ margin: 2, alignItems: 'center' }}>
                <TouchableOpacity style={styles.person} onPress={this.incrementDecrementFunction.bind(this)}>
                    <Image source={profilePhoto} style={styles.image} />
                    <View style={[styles.badgeCircle,
                    (this.state.value != null) ?
                        { backgroundColor: GreenRedVersion.mainRed09 } :
                        { backgroundColor: 'transparent' }]}>
                        <Text style={styles.text}>{(this.state.value != null) ? this.state.value : null}</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.text}>{this.props.val.name.split(" ")[0]}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    person: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: GreenRedVersion.mainGreen09,
        marginHorizontal: 5,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeCircle: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: GreenRedVersion.white09
    },
    image: {
        width: 45,
        height: 45,
    },
})
