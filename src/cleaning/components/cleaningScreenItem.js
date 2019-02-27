import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Alert, } from 'react-native';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/Ionicons';
import CleaningScreenItemEdit from './cleaningScreenItemEdit';
import GreenRedVersion from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Firebase from '../../../components/firebase';
import dateFormat from 'dateformat';
import CleaningData from '../data/cleaningData';

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
export default class FlatListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemEditVisible: false,
            roommates: Firebase.roommates,
        };
    }

    /**
     * Function used to refresh flatlist and edit the cleaning item
     * @param {Object} job contains all the information about the cleaning job
     * @param {string} index of cleaning job to be edited
     */
    refreshFlatListItem = (job, index) => {
        this.setState({ itemEditVisible: false });
        this.props.editMethod(job, index);
    }

    /**
     * Function used to calculate the days left to complete the cleaning job
     * @param {string} frequency used to convert frequency to a date
     */
    daysLeft(frequency) {
        switch (frequency) {
            case 'Every day':
                return dateFormat(new Date().getTime() + (1 * 86400000), "mm/dd/yyyy");
            case 'Every two days':
                return dateFormat(new Date().getTime() + (2 * 86400000), "mm/dd/yyyy");
            case 'Every three days':
                return dateFormat(new Date().getTime() + (3 * 86400000), "mm/dd/yyyy");
            case 'Every four days':
                return dateFormat(new Date().getTime() + (4 * 86400000), "mm/dd/yyyy");
            case 'Every five days':
                return dateFormat(new Date().getTime() + (5 * 86400000), "mm/dd/yyyy");
            case 'Every six days':
                return dateFormat(new Date().getTime() + (6 * 86400000), "mm/dd/yyyy");
            case 'Every week':
                return dateFormat(new Date().getTime() + (7 * 86400000), "mm/dd/yyyy");
            case 'Every two weeks':
                return dateFormat(new Date().getTime() + (14 * 86400000), "mm/dd/yyyy");
            case 'Every three weeks':
                return dateFormat(new Date().getTime() + (21 * 86400000), "mm/dd/yyyy");
            case 'Once a month':
                return dateFormat(new Date().getTime() + (30 * 86400000), "mm/dd/yyyy");
            default: ;
        }
    }

    render() {
        const swipeSettings = {
            autoClose: true,
            onClose: (secId, rowId, direction) => { },
            onOpen: (secId, rowId, direction) => { },
            left: [
                {
                    onPress: () => CleaningData.doneJob(this.daysLeft(this.props.item.frequency), this.props.index),
                    component:
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '70%',
                            width: '95%',
                            marginLeft: '5%',
                            marginVertical: '15%',
                            borderBottomLeftRadius: 40,
                            borderTopLeftRadius: 40,
                            backgroundColor: GreenRedVersion.blue09
                        }}>
                            <Icon style={{ color: GreenRedVersion.white }} name={'ios-checkmark'} size={40} />
                        </View>,
                    backgroundColor: 'transparent',
                },
                {
                    onPress: () => this.setState({ itemEditVisible: true }),
                    component:
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '70%',
                            width: '100%',
                            marginVertical: '15%',
                            backgroundColor: GreenRedVersion.yellow,
                        }}>
                            <Icon style={{ color: GreenRedVersion.white }} name={'ios-create'} size={25} />
                        </View>
                    ,
                    backgroundColor: 'transparent',
                },
                {
                    onPress: () => {
                        Alert.alert(
                            'Alert',
                            'Are you sure you want to delete ?',
                            [
                                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                { text: 'Yes', onPress: () => this.props.deleteMethod(this.props.index) },
                            ],
                            { cancelable: true }
                        );
                    },
                    component:
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '70%',
                            width: '95%',
                            marginRight: '5%',
                            marginVertical: '15%',
                            backgroundColor: GreenRedVersion.mainRed09,
                            borderBottomRightRadius: 40,
                            borderTopRightRadius: 40
                        }}>
                            <Icon style={{ color: GreenRedVersion.white }} name={'ios-trash'} size={25} />
                        </View>
                    , backgroundColor: 'transparent',
                }
            ],
            rowId: this.props.index,
            sectionId: 1
        };

        const profilePhoto = avatarsArray[this.state.roommates[this.props.item.order[0].key].photoURL];
        const daysLeftCalc = Math.ceil((new Date(this.props.item.startDate) - new Date()) / 86400000);
        return (
            <Swipeout {...swipeSettings} style={{ backgroundColor: 'transparent' }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        height: 75,
                        alignItems: 'center',
                    }}>
                        <Image
                            source={profilePhoto}
                            style={styles.thumbnailPhoto} />

                        <View style={styles.itemDescription}>
                            <Text style={styles.itemName}>{this.props.item.title}</Text>
                            <Text style={styles.personName}>{this.props.item.order[0].roommateName}</Text>
                            {
                                (daysLeftCalc >= 0) ?
                                    <Text style={[{ color: GreenRedVersion.white07 }, styles.daysLeftText]}>in {daysLeftCalc} days</Text> :
                                    <Text style={[{ color: GreenRedVersion.mainRed09 }, styles.daysLeftText]}>{Math.abs(daysLeftCalc)} days late</Text>
                            }
                        </View>
                    </View>
                    <View style={{ height: 1, backgroundColor: GreenRedVersion.white }} />
                </View>
                {
                    (this.state.itemEditVisible) ?
                        <CleaningScreenItemEdit visible={this.state.itemEditVisible} data={this.props.item} index={this.props.index} edit={this.refreshFlatListItem.bind(this)} />
                        : null
                }
            </Swipeout>

        );
    }
}
const styles = StyleSheet.create({
    flatListItem: {
        color: GreenRedVersion.white,
        padding: 10,
        fontSize: Fonts.size16,
    },
    thumbnailPhoto: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: GreenRedVersion.mainGreen09,
        marginLeft: 20,
        padding: 5
    },
    itemDescription: {
        width: '80%',
        flexDirection: 'column',
    },
    itemName: {
        width: '100%',
        color: GreenRedVersion.white,
        fontSize: Fonts.size18,
        fontWeight: '500',
        paddingLeft: 20,
    },
    personName: {
        width: '100%',
        color: GreenRedVersion.white07,
        fontSize: Fonts.size16,
        fontWeight: '200',
        paddingLeft: 20
    },
    daysLeftText: {
        width: '100%',
        fontSize: Fonts.size16,
        fontWeight: '200',
        paddingLeft: 20
    }
});
