import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GreenRedVersion from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import HomeData from './data/homeData';

export default class AddHomeScreenCode extends React.Component {

    constructor() {
        super();
        this.state = {
            code: null,
        }
    }

    static navigationOptions = { header: null };

    // Function used to add home with code
    addHomeWithCode() {
        if (this.state.code == null) return
        HomeData.addHomeWithCode(this.state.code);
    }

    render() {
        return (
                <KeyboardAvoidingView style={styles.backgroundContainer} behavior="padding" enabled>
                    <View style={styles.logoContanier}>
                        <Text style={styles.logoText}>Enter Code</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Icon
                            name={'ios-home'}
                            size={26}
                            color={GreenRedVersion.white07}
                            style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={'Enter code'}
                            placeholderTextColor={GreenRedVersion.white07}
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => this.setState({ code: text })} />
                    </View>
                    <TouchableOpacity style={styles.btnSave}
                        onPress={this.addHomeWithCode.bind(this)}>
                        <Text style={styles.text}>Save</Text>
                    </TouchableOpacity>
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
        marginHorizontal: '5%',
    },
    text: {
        color: GreenRedVersion.white07,
        fontSize: Fonts.size16,
        textAlign: 'center',
    },
});