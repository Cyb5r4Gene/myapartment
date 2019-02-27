import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Firebase from '../../components/firebase';
import GreenRedVersion from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

export default class AddHomeScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            flatName: '',
            street: '',
            city: '',
            zipcode: '',
            country: '',
        }
    }

    static navigationOptions = { header: null };

    // function used to add a new home with code
    addHomeForm(homeObj) { this.props.navigation.state.params.addHome(homeObj); }

    // Function used to add a new home
    addHomeWithDetails() {
        var flatName = this.state.flatName.trim();
        var street = this.state.street.trim();
        var zipcode = this.state.zipcode // no need to trim - lejojm vetem numra
        var city = this.state.city.trim();
        var country = this.state.country.trim();

        if (flatName.length == 0) {
            alert("You must enter flat's name.");
            return;
        }

        if (street.length == 0) {
            alert("You must enter the street name.");
            return;
        }

        if (zipcode.length == 0) {
            alert("You must enter the street name.");
            return;
        }

        if (city.length == 0) {
            alert("You must enter the city name.");
            return;
        }

        if (country.length == 0) {
            alert("You must enter the country name.");
            return;
        }

        var flatsRef = Firebase.database.ref("/flats");
        flatsRef.push({
            flatDetails: {
                flatName: flatName,
                street: street,
                city: city,
                zipcode: zipcode,
                country: country,
            }
        }).then((snap) => {
            Firebase.flatInfo.flatId = snap.key;
            var roommatesRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/roommates`);
            roommatesRef.child(Firebase.userInfo.uid).set({
                name: Firebase.userInfo.displayName,
                householder: true,
                photoURL: Firebase.userInfo.photoURL,
            }).then(() => {
                // ndrro flatID the tabela users pasi qe Hajde perhajr u bonem me banes
                var usersRef = Firebase.database.ref(`/users/${Firebase.userInfo.uid}`);
                usersRef.set({
                    flatId: Firebase.flatInfo.flatId
                }).then(() => {
                    Firebase.auth.signOut();
                    alert("You have been logged out for refresh reasons.\n Please log in now in your new apartment!");
                });
            })
        })
    }

    /**
   * Function used to validate home details
   * @param {string} text to be validated
   * @param {string} type of the input
   */
    validateHomeDetails(text, type) {
        alph = /^[a-zA-Z\s]*$/
        str = /^[a-zA-Z0-9\.\s]*$/
        num = /^[0-9]*$/

        if (type == 'flatName') {
            if (!alph.test(text)) alert("Flat name can contain only letters!");
            else this.setState({ flatName: text })
        }
        else if (type == 'street') {
            if (!str.test(text)) alert("Street can contain only letters and numbers!");
            else this.setState({ street: text })
        }
        else if (type == 'zipcode') {
            if (!num.test(text)) alert("Zip code can contain only numbers!")
            else this.setState({ zipcode: text })
        }
        else if (type == 'city') {
            if (!alph.test(text)) alert("City can contain only letters!");
            else this.setState({ city: text })
        }
        else { // po dihet qe country
            if (!alph.test(text)) alert("Country can contain only letters!");
            else this.setState({ country: text })
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.backgroundContainer} behavior="padding" enabled>
                <View style={styles.logoContanier}>
                    <Text style={styles.logoText}>Fill form</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Icon
                        name={'ios-home'}
                        size={26}
                        color={GreenRedVersion.white07}
                        style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder={'Flat name'}
                        placeholderTextColor={GreenRedVersion.white07}
                        underlineColorAndroid='transparent'
                        returnKeyType={"next"}
                        onSubmitEditing={() => { this.secondTextInput.focus(); }}
                        blurOnSubmit={true}
                        onChangeText={(text) => this.validateHomeDetails(text, 'flatName')} />
                </View>
                <View style={styles.inputContainer}>
                    <Icon
                        name={'ios-map'}
                        size={26}
                        color={GreenRedVersion.white07}
                        style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder={'Street'}
                        placeholderTextColor={GreenRedVersion.white07}
                        underlineColorAndroid='transparent'
                        returnKeyType={"next"}
                        blurOnSubmit={true}
                        ref={(input) => { this.secondTextInput = input; }}
                        onSubmitEditing={() => { this.thirdTextInput.focus() }}
                        onChangeText={(text) => this.validateHomeDetails(text, 'street')}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon
                        name={'ios-business'}
                        size={26}
                        color={GreenRedVersion.white07}
                        style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder={'City'}
                        placeholderTextColor={GreenRedVersion.white07}
                        underlineColorAndroid='transparent'
                        returnKeyType={"next"}
                        blurOnSubmit={true}
                        ref={(input) => { this.thirdTextInput = input; }}
                        onSubmitEditing={() => { this.fourthTextInput.focus() }}
                        onChangeText={(text) => this.validateHomeDetails(text, 'city')}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon
                        name={'ios-code'}
                        size={26}
                        color={GreenRedVersion.white07}
                        style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder={'Zip code'}
                        placeholderTextColor={GreenRedVersion.white07}
                        underlineColorAndroid='transparent'
                        returnKeyType={"next"}
                        blurOnSubmit={true}
                        ref={(input) => { this.fourthTextInput = input; }}
                        onSubmitEditing={() => { this.fifthTextInput.focus() }}
                        onChangeText={(text) => this.validateHomeDetails(text, 'zipcode')}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon
                        name={'ios-flag'}
                        size={26}
                        color={GreenRedVersion.white07}
                        style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder={'Country'}
                        placeholderTextColor={GreenRedVersion.white07}
                        underlineColorAndroid='transparent'
                        returnKeyType={"done"}
                        ref={(input) => { this.fifthTextInput = input; }}
                        onChangeText={(text) => this.validateHomeDetails(text, 'country')}
                    />
                </View>
                <TouchableOpacity style={styles.btnSave}
                    onPress={this.addHomeWithDetails.bind(this)}>
                    <Text style={styles.text}>Save</Text>
                </TouchableOpacity>
                <Text style={styles.signInText}
                    onPress={() => this.props.navigation.navigate('AddHomeCode', { addHome: this.addHomeForm.bind(this) })}>{`Already have an invitation code?\nClick here`}</Text>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: GreenRedVersion.mainGreen
    },
    logoContanier: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
    },
    logoText: {
        color: GreenRedVersion.white,
        fontSize: Fonts.size18,
        fontWeight: '500',
        marginTop: 10,
        opacity: 0.8,
    },
    input: {
        width: '90%',
        height: 45,
        borderRadius: 25,
        fontSize: Fonts.size16,
        paddingLeft: 45,
        backgroundColor: GreenRedVersion.black03,
        color: GreenRedVersion.white07,
        marginHorizontal: '5%'
    },
    inputIcon: {
        position: 'absolute',
        top: 8,
        left: 37,
    },
    inputContainer: {
        width: '100%',
        marginTop: 10,
    },
    btnSave: {
        width: '90%',
        height: 45,
        borderRadius: 25,
        fontSize: Fonts.size16,
        backgroundColor: GreenRedVersion.mainRed09,
        justifyContent: 'center',
        marginTop: 20,
        marginHorizontal: '5%'
    },
    text: {
        color: GreenRedVersion.white07,
        fontSize: Fonts.size16,
        textAlign: 'center',
    },
    signInText: {
        color: GreenRedVersion.white07,
        fontSize: Fonts.size16,
        textAlign: 'center',
        marginTop: 10
    }
});