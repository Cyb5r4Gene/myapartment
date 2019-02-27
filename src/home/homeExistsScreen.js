import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import Firebase from '../../components/firebase';
import HomeDetails from './components/homeDetails';
import HomeData from './data/homeData';
import GreenRedVersion from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

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
export default class HomeExistsScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            itemEditVisible: false,
            flatDetails: (Firebase.flatInfo.flatDetails != null && Firebase.flatInfo.flatDetails != undefined) ?
                Firebase.flatInfo.flatDetails : '',
            roommates: Firebase.roommates,
        }
    }

    static navigationOptions = { header: null };

    // start the listener for changes under flats/flatId/roommate
    // start the listener for changes under flats/flatId/flatDetails
    componentDidMount() {
        if (Firebase.flatInfo.flatId != null && Firebase.flatInfo.flatId !== undefined) {
            var that = this; // pasi qe this brenda i referohet function (snap)
            var roommatesRef = Firebase.database.ref().child(`flats/${Firebase.flatInfo.flatId}/roommates`);
            roommatesRef.on('value', function (snap) {
                that.setState({
                    roommates: Object.keys(snap.val()).map((key) => { return [key, snap.val()[key]] }),
                })
                console.log("Data updated Roommates!");
            })
        }

        if (Firebase.flatInfo.flatId != null && Firebase.flatInfo.flatId !== undefined) {
            var that = this; // pasi qe this brenda i referohet function (snap)
            var flatRef = Firebase.database.ref().child(`flats/${Firebase.flatInfo.flatId}/flatDetails`);
            flatRef.on('value', function (snap) {
                that.setState({
                    flatDetails: snap.val(),
                })
                console.log("Data updated Home!");
            })
        }
    }

    /**
     * Function used to open a modal box where you can kick a roommate out or make him householder
     * @param {object} roommate contains roommate information
     * @param {string} key contains roommate id
     */
    kickRoommate(roommate, key) { HomeData.kickRoommate(roommate, key) }

    /**
     * Function used to edit flat details
     * @param {Object} flatDetails contains flat information
     */
    editFlatDetails(flatDetails) {
        this.setState({ itemEditVisible: !this.state.itemEditVisible });
        // if null - we meant only to close the modal x
        if (flatDetails == null) return
        HomeData.updateHomeDetails(flatDetails);
    }

    /**
     * Fuction used to leave the flat and delete all the data
     * @param {string} roommateID to be removed from flat
     */
    leaveFlat(roommateID) { HomeData.leaveFlat(roommateID) }

    render() {
        let roommatesArray = this.state.roommates.map((roommate, key) => {
            const profilePicture = avatarsArray[roommate[1].photoURL];
            return (
                <TouchableOpacity key={key} keyval={key} val={roommate}
                    onPress={() => this.kickRoommate(roommate, key)}>
                    <Image style={styles.person} source={profilePicture} />
                    <Text style={styles.roommateName}>{roommate[1].name.split(" ")[0]}</Text>
                </TouchableOpacity>
            )
        })
        return (
            <View style={styles.linearGradient}>
                <View style={styles.top}>
                    <ImageBackground source={require('../../assets/images/roommates.jpg')}
                        style={styles.headerBackgroundImage} blurRadius={5} >
                        <TouchableOpacity style={styles.flatDetailsSection} onPress={() => {
                            this.setState({ itemEditVisible: true });
                        }}>
                            <Text style={styles.flatDetailsName}>{this.state.flatDetails.flatName}</Text>
                            <Text style={styles.flatDetailsOther}>
                                {this.state.flatDetails.street + " | " +
                                    this.state.flatDetails.zipcode}
                            </Text>
                            <Text style={styles.flatDetailsOther}>
                                {this.state.flatDetails.city + " | " +
                                    this.state.flatDetails.country}
                            </Text>
                        </TouchableOpacity>
                        <HomeDetails visible={this.state.itemEditVisible} data={this.state.flatDetails} index={Firebase.flatInfo.flatId} edit={this.editFlatDetails.bind(this)} />
                    </ImageBackground>
                </View>
                <View style={styles.bottom}>
                    <View style={styles.roommatesSection}>
                        <Text style={styles.roommatesText}>ROOMMATES</Text>
                        {
                            roommatesArray
                        }
                    </View>

                    <View style={styles.touchableOpacitySection}>
                        <TouchableOpacity style={styles.touchableOpacity} onPress={() => this.props.navigation.navigate('InviteRoommate')}>
                            <Text style={styles.touchableOpacityText}>
                                INVITE
                        </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.touchableOpacity} onPress={() => {
                            Alert.alert(
                                'Leave flat',
                                'Do you want to leave the flat ?',
                                [
                                    { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                    { text: 'Yes', onPress: () => this.leaveFlat(Firebase.userInfo.uid) },
                                ],
                                { cancelable: true }
                            );
                        }}>
                            <Text style={styles.touchableOpacityText}>
                                LEAVE
                        </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    person: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: GreenRedVersion.mainGreen09,
        marginHorizontal: 5,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchableOpacity: {
        width: '46%',
        marginHorizontal: '2%',
        height: 60,
        backgroundColor: GreenRedVersion.mainRed09,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 5,
    },
    linearGradient: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: GreenRedVersion.mainGreen,
    },
    text: {
        color: GreenRedVersion.white09,
        fontSize: Fonts.size16,
    },
    top: {
        width: '100%',
        height: '30%',
    },
    headerBackgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {
        height: '70%',
        flexDirection: 'column',
        padding: 5,
    },
    touchableOpacityText: {
        textAlign: 'center',
        width: '100%',
        color: GreenRedVersion.white,
        fontSize: Fonts.size16,
        fontWeight: '600'
    },
    roommatesText: {
        textAlign: 'center',
        width: '100%',
        color: GreenRedVersion.white,
        fontSize: Fonts.size16,
        fontWeight: '600',
        marginVertical: 10,
    },
    roommatesSection: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        backgroundColor: GreenRedVersion.black04,
        borderRadius: 10,
        marginVertical: 5,
        paddingBottom: 15,
    },
    touchableOpacitySection: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 10,
    },
    flatDetailsSection: {
        backgroundColor: GreenRedVersion.black04,
        alignItems: 'center',
        borderRadius: 10,
        padding: 10
    },
    flatDetailsName: {
        fontWeight: '600',
        fontSize: 40,
        color: GreenRedVersion.white09
    },
    flatDetailsOther: {
        fontWeight: '600',
        fontSize: Fonts.size16,
        color: GreenRedVersion.white09
    },
    roommateName: {
        textAlign: 'center',
        color: GreenRedVersion.white07,
        fontSize: Fonts.size16,
    },
});