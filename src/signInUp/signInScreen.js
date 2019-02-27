import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Firebase from '../../components/firebase';
import GreenRedVersion from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Loading from '../../components/loading';
import logo from '../../assets/images/condominiumColors.png';

export default class SignInScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            showPass: true,
            press: false,
            email: '',
            password: '',
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

    // Function used to login the user
    login() {
        this.setState({ loading: true }, () => {
            Firebase.auth.signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(() =>
                    this.setState({ loading: false }))
                .catch((error) => {
                    this.setState({ loading: false });
                    alert(error);
                });
        })
    }

    render() {
        return (
                <KeyboardAvoidingView style={styles.backgroundContainer} behavior="padding" enabled>
                    <View style={styles.logoContanier}>
                        <Image source={logo} style={styles.logo} />
                        <Text style={styles.logoText}>My Apartment</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Icon
                            name={'ios-person'}
                            size={28}
                            color={GreenRedVersion.white07}
                            style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={'Email'}
                            placeholderTextColor={GreenRedVersion.white07}
                            underlineColorAndroid='transparent'
                            autoCapitalize='none'
                            autoCorrect={false}
                            returnKeyType={"next"}
                            onSubmitEditing={() => { this.secondTextInput.focus(); }}
                            blurOnSubmit={false}
                            onChangeText={(email) => this.setState({ email })}
                            keyboardType='email-address'></TextInput>
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
                            autoCapitalize='none'
                            autoCorrect={false}
                            secureTextEntry={this.state.showPass}
                            placeholderTextColor={GreenRedVersion.white07}
                            underlineColorAndroid='transparent'
                            ref={(input) => { this.secondTextInput = input; }}
                            returnKeyType={"done"}
                            onChangeText={(password) => this.setState({ password })}></TextInput>

                        <TouchableOpacity style={styles.btnEyer}
                            onPress={this.showPass.bind(this)}>
                            <Icon name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'}
                                size={26}
                                color={GreenRedVersion.white07} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.btnLogin}
                        onPress={this.login.bind(this)}>
                        <Text style={styles.text}>Login</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.underLoginText, { color: GreenRedVersion.white07 }]}
                            onPress={() => this.props.navigation.navigate('ForgotPassword')}>Forgot password?</Text>
                        <Text style={[styles.underLoginText, { color: GreenRedVersion.white }]}
                            onPress={() => this.props.navigation.navigate('SignUp')}> Create an account</Text>
                    </View>
                    {(this.state.loading) ? <Loading animating={this.state.loading} color={GreenRedVersion.mainGreen09} size={'large'} /> : null}
                </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        alignItems: 'center',
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
        width:'100%'
    },
    btnEyer: {
        position: 'absolute',
        top: 8,
        right: 37,
    },
    btnLogin: {
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
    underLoginText: {
        fontSize: Fonts.size16,
        textAlign: 'center',
        marginTop: 10
    }
});


