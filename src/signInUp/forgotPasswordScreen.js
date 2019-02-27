import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Firebase from '../../components/firebase';
import GreenRedVersion from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Loading from '../../components/loading';

export default class ForgotPasswordScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            email: '',
            loading: false,
        }
    }

    static navigationOptions = { header: null };

    /**
     * Function used to validate the input email
     * @param {string} email contains the email that should be sent to recover the password
     */
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Function used to send the email to recover the password
    resetPassword() {
        if (this.validateEmail(this.state.email)) {
            this.setState({ loading: true }, () => {
                Firebase.auth.sendPasswordResetEmail(this.state.email).then(() => {
                    this.setState({ loading: false });
                    alert("Email sent, please check your inbox!");
                }).catch(function (error) {
                    this.setState({ loading: false });
                    alert(error);
                });
            })
        } else { alert('Incorrect email format!') }
    }

    render() {
        return (
                <KeyboardAvoidingView style={styles.backgroundContainer} behavior="padding" enabled>
                    <View style={styles.logoContanier}>
                        <Text style={styles.logoText}>Enter email</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Icon
                            name={'ios-mail'}
                            size={26}
                            color={GreenRedVersion.white07}
                            style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={'Enter email'}
                            placeholderTextColor={GreenRedVersion.white07}
                            underlineColorAndroid='transparent'
                            autoCapitalize='none'
                            keyboardType='email-address'
                            onChangeText={(text) => this.setState({ email: text })} />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.btnCancel} onPress={() => this.props.navigation.navigate('SignIn')}>
                            <Text style={styles.textCancel}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnSave}
                            onPress={this.resetPassword.bind(this)}>
                            <Text style={styles.text}>Send</Text>
                        </TouchableOpacity>
                    </View>
                    {(this.state.loading) ? <Loading animating={this.state.loading} color={GreenRedVersion.mainGreen09} size={'large'} /> : null}
                </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        width: null,
        height: null,
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
        width:'100%'
    },
    btnEyer: {
        position: 'absolute',
        top: 8,
        right: 37,
    },
    btnSave: {
        width: '40%',
        height: 50,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        fontSize: Fonts.size16,
        backgroundColor: GreenRedVersion.mainRed09,
        justifyContent: 'center',
        marginTop: 20,
    },
    btnCancel: {
        width: '40%',
        height: 50,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        fontSize: Fonts.size16,
        backgroundColor: GreenRedVersion.white09,
        justifyContent: 'center',
        marginTop: 20,
    },
    text: {
        color: GreenRedVersion.white07,
        fontSize: Fonts.size16,
        textAlign: 'center',
    },
    textCancel: {
        color: GreenRedVersion.mainRed09,
        fontSize: Fonts.size16,
        textAlign: 'center',
    },
});