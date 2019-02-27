import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import CleaningScreenItemAdd from './components/cleaningScreenItemAdd';
import CleaningScreenItem from './components/cleaningScreenItem';
import Firebase from '../../components/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import CleaningData from './data/cleaningData';
import GreenRedVersion from '../../constants/Colors';

export default class CleaningScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemAddVisible: false,
            flatListData: (Firebase.flatInfo.jobs != null && Firebase.flatInfo.jobs != undefined) ?
                Object.keys(Firebase.flatInfo.jobs)
                    .map((key) => { return [key, Firebase.flatInfo.jobs[key]] }) : [],
        }

        this.addNote = this.addNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
        this.editNote = this.editNote.bind(this);
    }

    static navigationOptions = { header: null };

    // Function used to refresh the state
    refresh() { this.setState({ itemAddVisible: !this.state.itemAddVisible }) }

    /**
     * Function used to add a new cleaning job
     * @param {Object} job contains the information about the cleaning job being added
     */
    addNote(job) { CleaningData.pushJob(job).then(() => { this.refresh() }) }

    /**
     * Function used to delete a cleaning job
     * @param {string} index contains the id of the cleaning job being deleted
     */
    deleteNote(index) { CleaningData.deteleJob(index) }

    /**
     * Function used to edit a cleaning job
     * @param {*} job contains the information about the cleaning job being edit
     * @param {*} index contains the id of the cleaning job being edit
     */
    editNote(job, index) {
        // click x to close the modal 
        if (job == null) return
        // Update the job with the changes
        CleaningData.updateJob(job, index);
    }

    // start the listener for changes under flats/flatId/jobs
    componentDidMount() {
        var that = this; 
        var flatRef = Firebase.database.ref().child(`flats/${Firebase.flatInfo.flatId}/jobs`);
        flatRef.on('value', function (snap) {
            var obj = snap.val();
            that.setState({
                flatListData: (obj != null && obj != undefined) ?
                    Object.keys(obj).map(function (key) { return [key, obj[key]] }) : []
            })
            console.log("Data updated Cleaning!");
        })
    }

    render() {
        return (
            <View
                style={{ flex: 1, backgroundColor: 'transparent', backgroundColor: GreenRedVersion.mainGreen, }}>
                <FlatList ref={"flatList"} data={this.state.flatListData}
                    renderItem={
                        ({ item, index }) => {
                            return <CleaningScreenItem item={item[1]} index={item[0]} deleteMethod={this.deleteNote} editMethod={this.editNote} />
                        }
                    }
                    keyExtractor={(k, i) => i.toString()}
                />

                <Icon style={{ position: 'absolute', right: 20, bottom: 20 }} color={GreenRedVersion.white} name={'ios-add-circle'} size={70} onPress={this.refresh.bind(this)} />
                {
                    (this.state.itemAddVisible) ?
                        <CleaningScreenItemAdd visible={this.state.itemAddVisible} onPressAdd={this.addNote} refresh={this.refresh.bind(this)} data={this.state.flatListData} />
                        : null
                }
            </View>
        );
    }
}