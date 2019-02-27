import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Clipboard, Share } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Firebase from '../../components/firebase';
import GreenRedVersion from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import dateFormat from 'dateformat';

export default class InviteRoommateScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            code: '',
            clipboard: false,
        }
    }

    static navigationOptions = { header: null };

    // Function used to generate the invitation code
    componentDidMount() { this.generateInvitationCode() }

    // Function used to add the invitation code to the database
    addInvitationCode = async () => {
        var result = await Share.share({
            message: `Hi!\nThe invitation code to our flat is this: ${this.state.code}`
        });

        if (result.action === Share.sharedAction) {
            Firebase.database.ref(`/invitations/${this.state.code}`).set({
                flatId: Firebase.flatInfo.flatId,
                date: dateFormat(new Date(), "dd.mm.yyyy HH:MM"),
                whoInvited: Firebase.auth.currentUser.uid,
            })
        }
    }

    // Function used to generate the code
    generateInvitationCode() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 16; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        this.setState({ code: text });
    }

    // Function used to make a toast
    toast() {
        this.setState({ clipboard: true }, () => {
            setTimeout(() => {
                this.setState({ clipboard: false })
            }, 1500)
        })
    }

    render() {
        return (
            <View
                style={styles.backgroundContainer}>
                <KeyboardAvoidingView style={styles.backgroundContainer} behavior="padding" enabled>
                    <Text style={styles.logoText}>Generated code</Text>
                    <View style={styles.inputContainer}>
                        <Icon
                            name={'ios-code'}
                            size={26}
                            color={GreenRedVersion.white07}
                            style={styles.inputIcon} />
                        <Icon
                            name={'ios-copy'}
                            size={26}
                            color={GreenRedVersion.white07}
                            style={styles.inputCopy} />
                        <TouchableOpacity style={styles.input} onPress={() => {
                            Clipboard.setString(this.state.code);
                            this.toast();
                        }}>
                            <Text style={styles.text}>{this.state.code}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.btnCancel} onPress={() => { this.props.navigation.navigate('Settings') }}>
                            <Text style={styles.textCancel}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnSave}
                            onPress={this.addInvitationCode.bind(this)}>
                            <Text style={styles.shareText}>Share</Text>
                        </TouchableOpacity>
                    </View>
                    {(this.state.clipboard) ? <Text style={[{ marginTop: 10 }, styles.shareText]}>Copied to clipboard</Text> : null}
                </KeyboardAvoidingView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    backgroundContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: GreenRedVersion.mainGreen,
    },
    logoText: {
        color: GreenRedVersion.white,
        fontSize: Fonts.size18,
        fontWeight: '500',
        marginTop: 10,
        opacity: 0.8,
    },
    input: {
        width: '100%',
        height: 45,
        borderRadius: 25,
        fontSize: Fonts.size16,
        paddingLeft: 50,
        backgroundColor: GreenRedVersion.black03,
        justifyContent: 'center'
    },
    inputIcon: {
        position: 'absolute',
        top: 8,
        left: 15,
    },
    inputCopy: {
        position: 'absolute',
        top: 8,
        right: 15,

    },
    inputContainer: {
        width: '90%',
        marginHorizontal: '5%',
        marginTop: 10,
    },
    btnSave: {
        width: '45%',
        height: 50,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        fontSize: Fonts.size16,
        backgroundColor: GreenRedVersion.mainRed09,
        justifyContent: 'center',
        marginTop: 20,
    },
    btnCancel: {
        width: '45%',
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
    },
    textCancel: {
        color: GreenRedVersion.mainRed09,
        fontSize: Fonts.size16,
        textAlign: 'center',
    },
    shareText: {
        color: GreenRedVersion.white07,
        fontSize: Fonts.size16,
        textAlign: 'center',
    },
});