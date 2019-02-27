import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Firebase from '../../components/firebase';
import GreenRedVersion from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Loading from '../../components/loading';

const avatarsArray = [
    require('../../assets/images/avatars/icons1-96.png'),
    require('../../assets/images/avatars/icons4-96.png'),
    require('../../assets/images/avatars/icons5-96.png'),
    require('../../assets/images/avatars/icons3-96.png'),
    require('../../assets/images/avatars/icons2-96.png'),
    require('../../assets/images/avatars/icons7-96.png'),
    require('../../assets/images/avatars/icons6-96.png'),
    require('../../assets/images/avatars/icons8-96.png'),
]
export default class SignUpScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            showPass: true,
            press: false,
            fullname: '',
            email: '',
            password: '',
            confirmpassword: '',
            personKey: null,
            loading: false,
        }
    }

    static navigationOptions = { header: null }

    // Function used to show and hide the password
    showPass = () => {
        if (this.state.press == false) {
            this.setState({ showPass: false, press: true })
        } else {
            this.setState({ showPass: true, press: false })
        }
    }

    // Function used to sign up a new person
    signUp() {
        var displayName = this.state.fullname.trim().split(" ");
        if (displayName.length != 2) {
            alert("Please write you firstname and lastname!");
            return;
        }

        var email = this.state.email.trim();
        if (!this.validateEmail(email)) {
            alert("Incorrect format of the email!");
            return
        }

        var password = this.state.password;
        var confirmpassword = this.state.confirmpassword;
        if (password !== confirmpassword) {
            alert("Passwords do not match!");
            return
        }

        var personKey = this.state.personKey;
        if (personKey == null) {
            alert("Please select and avatart!");
            return
        }

        var firstName = displayName[0].substring(0, 1).toUpperCase() + displayName[0].substring(1).toLowerCase();
        var lastName = displayName[1].substring(0, 1).toUpperCase() + displayName[1].substring(1).toLowerCase();
        displayName = firstName + " " + lastName;

        this.setState({ loading: true }, () => {
            Firebase.auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(() => {
                    var user = Firebase.auth.currentUser;
                    user.updateProfile({
                        displayName: displayName,
                        photoURL: this.state.personKey
                    })

                    var usersRef = Firebase.database.ref("/users");
                    usersRef.child(user.uid).set({
                        flatId: 0
                    })
                }).then(() => {
                    this.setState({ loading: false });
                }).catch((error) => {
                    this.setState({ loading: false });
                    alert(error);
                })
        })
    }

    // Function used to set an avatar for the person beign registered
    changeProfilPicture = (key) => this.setState({ personKey: key })

    /**
     * Function that will validate the given email
     * @param {string} email contains the email that will be used to sign up
     */
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.backgroundContainer} behavior="padding" enabled>
                <View style={styles.logoContanier}>
                    <Text style={styles.logoText}>Sign Up</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Icon
                        name={'ios-person'}
                        size={28}
                        color={GreenRedVersion.white07}
                        style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder={'Full name'}
                        placeholderTextColor={GreenRedVersion.white07}
                        underlineColorAndroid='transparent'
                        returnKeyType={"next"}
                        autoCapitalize='words'
                        onSubmitEditing={() => { this.secondTextInput.focus(); }}
                        blurOnSubmit={false}
                        onChangeText={(fullname) => this.setState({ fullname })} />
                </View>
                <View style={styles.inputContainer}>
                    <Icon
                        name={'ios-mail'}
                        size={28}
                        color={GreenRedVersion.white07}
                        style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder={'Email'}
                        placeholderTextColor={GreenRedVersion.white07}
                        underlineColorAndroid='transparent'
                        returnKeyType={"next"}
                        autoCapitalize='none'
                        ref={(input) => { this.secondTextInput = input; }}
                        onSubmitEditing={() => { this.thirdTextInput.focus() }}
                        onChangeText={(email) => this.setState({ email })}
                        keyboardType='email-address'
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon
                        name={'ios-lock'}
                        size={28}
                        color={GreenRedVersion.white07}
                        style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder={'Password'}
                        placeholderTextColor={GreenRedVersion.white07}
                        secureTextEntry={this.state.showPass}
                        underlineColorAndroid='transparent'
                        returnKeyType={"next"}
                        ref={(input) => { this.thirdTextInput = input; }}
                        onSubmitEditing={() => { this.fourthTextInput.focus() }}
                        onChangeText={(password) => this.setState({ password })}
                    />
                    <TouchableOpacity style={styles.btnEyer}
                        onPress={this.showPass.bind(this)}>
                        <Icon name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'}
                            size={26}
                            color={GreenRedVersion.white07} />
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    <Icon
                        name={'ios-lock'}
                        size={28}
                        color={GreenRedVersion.white07}
                        style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder={'Confirm password'}
                        placeholderTextColor={GreenRedVersion.white07}
                        secureTextEntry={this.state.showPass}
                        underlineColorAndroid='transparent'
                        returnKeyType={"done"}
                        ref={(input) => { this.fourthTextInput = input }}
                        onChangeText={(confirmpassword) => this.setState({ confirmpassword })}
                    />
                    <TouchableOpacity style={styles.btnEyer}
                        onPress={this.showPass.bind(this)}>
                        <Icon name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'}
                            size={26}
                            color={GreenRedVersion.white07} />
                    </TouchableOpacity>
                </View>

                <View style={styles.avatarContainer}>
                    {
                        avatarsArray.map((val, key) => {
                            return <TouchableOpacity key={key} val={val} keyval={key}
                                onPress={() => { this.changeProfilPicture(key) }}>
                                <Image
                                    source={val}
                                    style={[styles.person,
                                    (this.state.personKey == key) ?
                                        { backgroundColor: GreenRedVersion.black03 } :
                                        {}]} />
                            </TouchableOpacity>
                        })
                    }
                </View>

                <TouchableOpacity style={styles.btnSignUp}
                    onPress={this.signUp.bind(this)}>
                    <Text style={styles.text}>Sign Up</Text>
                </TouchableOpacity>
                <Text style={styles.signInText}
                    onPress={() => this.props.navigation.navigate('SignIn')}>Already have an account? Login</Text>
                { (this.state.loading) ? <Loading animating={this.state.loading} color={GreenRedVersion.mainGreen09} size={'large'} /> : null }
            </KeyboardAvoidingView>
        );
    }
}


const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        width: null,
        height: null,
        justifyContent: 'center',
        backgroundColor: GreenRedVersion.mainGreen,
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
        marginTop: 10,
    },
    btnEyer: {
        position: 'absolute',
        top: 8,
        right: 37,
    },
    btnSignUp: {
        width: '90%',
        height: 45,
        borderRadius: 25,
        fontSize: Fonts.size16,
        backgroundColor: GreenRedVersion.mainRed09,
        justifyContent: 'center',
        marginTop: 20,
        marginHorizontal: '5%',
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
    },
    avatarContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '90%',
        marginTop: 10,
        marginHorizontal: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 25,
        backgroundColor: GreenRedVersion.black03,
    },
    person: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        margin: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: GreenRedVersion.white07,
    },
});


