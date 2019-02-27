import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import dateFormat from 'dateformat';

import Icon from 'react-native-vector-icons/Ionicons';
import DropDownModal from './dropdownModal';
import Firebase from '../../../components/firebase';
import DateTimePicker from 'react-native-modal-datetime-picker';
import GreenRedVersion from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Roommate from './roommate';

// used to hold the order of roommates for the cleaning job being added
var roommatesOrder = [];
export default class CleaningScreenItemAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            frequencySelection: 'Frequency',
            startDate: dateFormat(new Date(), "mm/dd/yyyy"),
            isDateTimePickerVisible: false,
            roommates: [],
            count: 1,
            titleValidation: true,
        };
    }

    componentDidMount() {
        console.log('CleaningScreenItemAdd mounted');
        if (Firebase.flatInfo.flatId != null && Firebase.flatInfo.flatId !== undefined) {
            var that = this; // pasi qe this brenda i referohet function (snap)
            var roommatesRef = Firebase.database.ref().child(`flats/${Firebase.flatInfo.flatId}/roommates`);
            roommatesRef.once('value', function (snap) {
                that.setState({
                    roommates: Object.keys(snap.val()).map((key) => { return [key, snap.val()[key]] }),
                })

                console.log("Data updated Roommates!");
            }).catch((error) => { console.log(error) });
        }
    }

    // Function used to clean the data after the modal is closed
    cleanStateData = () => {
        this.setState({
            title: '',
            frequencySelection: 'Frequency',
            orderSelection: 'Order',
            startDate: dateFormat(new Date(), "mm/dd/yyyy"),
            count: 1,
        });
        roommatesOrder = [];
    }

    // setState frequency chosen
    onFrequencyChange = (text) => this.setState({ frequencySelection: text });

    // setState visibile for datetime modal to true
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    // setState visibile for datetime modal to false
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    /**
     * Function used to set the date chosen by the user
     * @param {date} date used to know which date did the user choose and setState
     */
    _handleDatePicked = (date) => {
        this.setState({ startDate: dateFormat(date, "mm/dd/yyyy") });
        this._hideDateTimePicker();
    };

    /**
     * Function to determine the order in a cleaning job
     * @param {boolean} doWhat if true -> add roommate else pop roommate
     * @param {string} key id of the roommate
     * @param {string} roommateName name of the roommate
     */
    counter(doWhat, key, roommateName) {
        if (doWhat) {
            roommatesOrder.push({ key, roommateName });
            this.setState({ count: this.state.count + 1 })
        }
        else {
            roommatesOrder.pop();
            this.setState({ count: this.state.count - 1 })
        }
    }

    // Function which validates and save a new cleaning job
    saveJob() {
        var title = this.state.title.trim()
        if (title.length == 0 || !this.state.titleValidation) {
            alert("You must enter a valid title!");
            return;
        }

        if (this.state.frequencySelection == "Frequency") {
            alert("You must select a frequency");
            return;
        }

        if (roommatesOrder.length == 0) {
            alert("You must select at least one roommate!");
            return;
        }

        var job = {
            title: title,
            order: roommatesOrder,
            startDate: this.state.startDate,
            frequency: this.state.frequencySelection
        }

        this.cleanStateData();
        this.props.onPressAdd(job);
    }

    // Function to validate the title in a new cleaning job
    validateCleaningScreenItem(text) {
        alph = /^[a-zA-Z\s]*$/
        if (alph.test(text))
            this.setState({
                titleValidation: true,
                title: text
            })
        else
            this.setState({ titleValidation: false });
    }

    render() {
        const frequency = [
            { value: 'Every day' },
            { value: 'Every two days' },
            { value: 'Every three days' },
            { value: 'Every four days' },
            { value: 'Every five days' },
            { value: 'Every six days' },
            { value: 'Every week' },
            { value: 'Every two weeks' },
            { value: 'Every three weeks' },
            { value: 'Once a month' }]

        return (
            <Modal visible={this.props.visible}
                transparent={true}
                animationType={"fade"}
                onRequestClose={() => { }}>
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: GreenRedVersion.black07 }} behavior={(Platform.OS === "ios") ? "padding" : ""} enabled>
                    <View
                        style={{
                            borderRadius: 30,
                            shadowRadius: 10,
                            alignItems: 'center',
                            marginVertical: 100,
                            marginHorizontal: 10,
                            backgroundColor: GreenRedVersion.mainGreen
                        }}>
                        <Text style={styles.headline}>Add a cleaning job</Text>
                        <Icon
                            name={'ios-close-circle'}
                            size={30}
                            style={styles.inputIconCancel}
                            color={GreenRedVersion.white07}
                            onPress={() => {
                                this.props.refresh();
                            }} />

                        <View style={styles.inputContainer}>
                            <Icon
                                name={'ios-brush'}
                                size={28}
                                color={
                                    (this.state.titleValidation) ?
                                        GreenRedVersion.white07 :
                                        GreenRedVersion.mainRed09}
                                style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={'Title'}
                                placeholderTextColor={GreenRedVersion.white07}
                                underlineColorAndroid='transparent'
                                onChangeText={(inputText) => this.validateCleaningScreenItem(inputText)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Icon name={'ios-flash'} size={28} color={GreenRedVersion.white07} style={styles.inputIcon} />
                            <DropDownModal label={this.state.frequencySelection} selectionArray={frequency} onTextChange={this.onFrequencyChange} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Icon
                                name={'ios-calendar'}
                                size={28}
                                color={GreenRedVersion.white07}
                                style={styles.inputIcon} />
                            <TouchableOpacity style={styles.input}
                                onPress={this._showDateTimePicker}>
                                <Text style={styles.startDate}>{this.state.startDate}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked.bind(this)}
                                onCancel={this._hideDateTimePicker}
                            />
                        </View>

                        <View style={styles.avatarContainer}>
                            {
                                this.state.roommates.map((val, key) => {
                                    return <Roommate key={val[0]} val={val[1]} keyval={val[0]}
                                        count={this.state.count} doWhat={this.counter.bind(this)} />
                                })
                            }
                        </View>

                        <TouchableOpacity style={styles.btnSave}
                            onPress={this.saveJob.bind(this)}>
                            <Text style={styles.text}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 45,
        borderRadius: 25,
        paddingLeft: 45,
        backgroundColor: 'transparent',
        fontSize: Fonts.size16,
        color: GreenRedVersion.white07,
        justifyContent: 'center',
    },
    inputIcon: {
        position: 'absolute',
        top: 8,
        left: 15,
    },
    inputIconCancel: {
        position: 'absolute',
        top: 10,
        right: 20,
    },
    inputContainer: {
        width: '90%',
        marginHorizontal: '5%',
        marginTop: 10,
        backgroundColor: GreenRedVersion.black03,
        borderRadius: 25,
    },
    btnSave: {
        width: '90%',
        height: 45,
        borderRadius: 25,
        fontSize: Fonts.size16,
        backgroundColor: GreenRedVersion.mainRed09,
        justifyContent: 'center',
        marginVertical: 20,
    },
    startDate: {
        color: GreenRedVersion.white07,
        fontSize: Fonts.size16,
    },
    text: {
        color: GreenRedVersion.white07,
        fontSize: Fonts.size16,
        textAlign: 'center',
    },
    headline: {
        color: GreenRedVersion.white07,
        fontSize: Fonts.size18,
        textAlign: 'center',
        marginVertical: 10
    },
    avatarContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '90%',
        marginTop: 10,
        padding: 10,
        borderRadius: 25,
        justifyContent: 'center',
        backgroundColor: GreenRedVersion.black03,
    },
});