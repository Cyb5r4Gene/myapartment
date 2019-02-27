import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity, TextInput, KeyboardAvoidingView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownModal from './dropdownModal';
import GreenRedVersion from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Firebase from '../../../components/firebase';
import Roommate from './roommate';
import DateTimePicker from 'react-native-modal-datetime-picker';
import dateFormat from 'dateformat';

// used to hold the order of roommates for the cleaning job being edited
var roommatesOrder = [];
export default class CleaningScreenItemEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: props.index,
            title: props.data.title,
            frequencySelection: props.data.frequency,
            startDate: props.data.startDate,
            isDateTimePickerVisible: false,
            roommates: [],
            count: 1,
        };
    }

    componentDidMount() {
        console.log("CleaningScreenItemEdit mounted");
        if (Firebase.flatInfo.flatId != null && Firebase.flatInfo.flatId !== undefined) {
            var that = this; // pasi qe this brenda i referohet function (snap)
            var roommatesRef = Firebase.database.ref().child(`flats/${Firebase.flatInfo.flatId}/roommates`);
            roommatesRef.once('value', function (snap) {
                that.setState({
                    roommates: Object.keys(snap.val()).map((key) => { return [key, snap.val()[key]] }),
                })
                console.log("Data updated Roommates!");
            }).catch(error => consloe.log(error));
        }
    }

    // Function used to clean data after the item is edited
    cleanStateData = () => {
        this.setState({ count: 1, });
        roommatesOrder = [];
    }

    /**
     * Function used to setState when the frequency is changed
     * @param {string} text used to set the frequency
     */
    onFrequencyChange = (text) => this.setState({ frequencySelection: text });

    // Function used to set visiblity to true for the date time picker
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    // Function used to set visiblity to false for the date time picker
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    /**
     * Function used to setState the date when it is changed
     * @param {date} date contains the date that the user picked
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
        // Added roommate to the array
        if (doWhat) {
            roommatesOrder.push({ key, roommateName });
            this.setState({ count: this.state.count + 1 })
        }
        // remove roommate from the array
        else {
            roommatesOrder.pop();
            this.setState({ count: this.state.count - 1 })
        }
    }

    // Function which validates and edits a cleaning job
    editJob = () => {
        var title = this.state.title.trim()
        if (title.length == 0) {
            alert("You must enter a valid title!");
            return;
        }

        if (this.state.frequencySelection == "Frequency") {
            alert("You must select a frequency");
            return;
        }

        var job = {
            title: this.state.title,
            startDate: this.state.startDate,
            frequency: this.state.frequencySelection
        }

        // Veq nese selekton naj person, perndryshe mbet e njejta order qe ka qene
        if (roommatesOrder.length != 0)
            job.order = roommatesOrder;

        this.props.edit(job, this.state.key);
        this.cleanStateData();
    }

    // Function to validate the title in a cleaning job
    validateCleaningScreenItem(text) {
        alph = /^[a-zA-Z\s]*$/
        if (alph.test(text))
            this.setState({
                title: text
            })
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
            { value: 'Once a month' }
        ]
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
                        <Text style={styles.headline}>Edit a cleaning job</Text>
                        <Icon
                            name={'ios-close-circle'}
                            size={30}
                            style={styles.inputIconCancel}
                            color={GreenRedVersion.white07}
                            onPress={() => {
                                this.cleanStateData();
                                this.props.edit()
                            }} />

                        <View style={styles.inputContainer}>
                            <Icon
                                name={'ios-brush'}
                                size={28}
                                color={GreenRedVersion.white07}
                                style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={'Title'}
                                placeholderTextColor={GreenRedVersion.white07}
                                underlineColorAndroid='transparent'
                                value={this.state.title}
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
                                style={styles.inputIcon}
                                onPress={this._showDateTimePicker} />
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
                            onPress={this.editJob.bind(this)}>
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