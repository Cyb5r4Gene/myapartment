import React from 'react';
import { StyleSheet, Text, View, Image, } from 'react-native';
import Firebase from '../components/firebase';
import GreenRedVersion from '../constants/Colors';
import Fonts from '../constants/Fonts';

export default class SplashScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            isUserLoggedIn: false,
        }
    }

    componentDidMount() {
        // Start counting when the page is loaded
        Firebase.auth.onAuthStateChanged(user => {
            if (user != null) {
                // save the user for later use
                Firebase.userInfo = user;
                try {
                    // set the user reference to the database
                    var userRef = Firebase.database.ref().child(`users/${user.uid}`);
                    // find the flatid for the given user
                    userRef.once('value', (snap) => {
                        var flatRef = Firebase.database.ref().child(`flats/${snap.val().flatId}/`);
                        var flatId = snap.val().flatId;
                        flatRef.once('value', (snap) => {
                            // save all the flat data in the flatInfo
                            Firebase.flatInfo = snap.val();
                            Firebase.flatInfo.flatId = flatId;
                            Firebase.getRoommates();
                            this.props.navigation.navigate("BottomTabNavigator");
                        })
                    })
                } catch (error) { alert(error) }
            } else { this.props.navigation.navigate("SignInOut") }
        })
    }

    componentWillMount() { this.logo = require('../assets/images/condominiumColors.png'); }

    render() {
        return (
            <View
                style={styles.backgroundContainer}>
                <View style={styles.logoContanier}>
                    <Image source={this.logo} style={styles.logo} />
                    <Text style={styles.logoText}>My Apartment</Text>
                </View>
            </View>
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
        fontSize: Fonts.size22,
        fontWeight: '500',
        marginTop: 10,
        opacity: 0.8,
    },
});
