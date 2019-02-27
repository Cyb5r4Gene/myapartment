import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, Image } from 'react-native';
import BudgetData from '../data/budgetData';
import Firebase from '../../../components/firebase';
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
export default class WhoPayed extends React.Component {

    exitModal() { this.props.changeState(null); }

    /**
     * 
     * @param {string} personId used to know who payed back
     */
    payBack(personId) {
        if (Firebase.userInfo.uid == this.props.val.boughtBy) {
            Alert.alert(
                'Confirm payment',
                'Did this roommate pay you back ?',
                [
                    { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'Yes', onPress: () => BudgetData.pay(personId, this.props.keyval) },
                ],
                { cancelable: true }
            );
        }
    }

    render() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.item}>Who payed back</Text>
                <TouchableOpacity style={styles.input} onPress={() => this.exitModal()}>
                    <View style={styles.roommatesSection}>
                        {
                            Object.keys(this.props.val.payed).map((key) => {
                                const profilePhoto = avatarsArray[this.props.val.payed[key].photoURL];
                                return <View key={key} style={{alignItems:'center', marginHorizontal:1}}><TouchableOpacity style={[styles.person,
                                (this.props.val.payed[key].payed) ?
                                    { borderColor: GreenRedVersion.mainGreen09 } :
                                    { borderColor: GreenRedVersion.mainRed09 }]}
                                    onPress={() => { this.payBack(key) }}>
                                    <Image source={profilePhoto} style={styles.inputIcon} />
                                </TouchableOpacity>
                                <Text style={{ color: GreenRedVersion.black07}}>{this.props.val.payed[key].name.split(" ")[0]}</Text>
                                </View>
                            })
                        }
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 90,
        backgroundColor: GreenRedVersion.white09,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputIcon: {
        width: 50,
        height: 50,
    },
    inputContainer: {
        marginTop: 10,
    },
    item: {
        color: GreenRedVersion.white09,
        fontSize: Fonts.size16,
        textAlign: 'center',
    },
    roommatesSection: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 20,
        justifyContent: 'center',
    },
    person: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: GreenRedVersion.white07,
    }
});