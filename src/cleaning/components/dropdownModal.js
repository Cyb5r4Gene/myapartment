import React from 'react';
import { Text, View, Modal, TouchableOpacity, TouchableHighlight, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GreenRedVersion from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';

export default class DropDownModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropDownSelection: this.props.label,
            dropDownPicker: false,
        };
    }

    // Function used to save the changes and toggel the modal
    setDropDownSelection(newValue) {
        this.setState({ dropDownSelection: newValue })
        this.props.onTextChange(newValue);
        this.toggelDropDownModal();
    }

    // Function used to toggel the modal
    toggelDropDownModal() { this.setState({ dropDownPicker: !this.state.dropDownPicker }) }

    render() {
        return (
            <View>
                <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => this.toggelDropDownModal()}>
                    <Text style={{ color: GreenRedVersion.white07, fontSize: Fonts.size16 }}>{this.state.dropDownSelection}</Text>

                    <Icon style={{ position: 'absolute', right: 15, bottom: 7, top: 7, color: GreenRedVersion.white07 }} name={'ios-arrow-dropdown'} size={28} />
                </TouchableOpacity>

                <Modal visible={this.state.dropDownPicker}
                    transparent={true}
                    animationType={"slide"}
                    onRequestClose={() => { }}>
                    <View style={{
                        margin: 20,
                        padding: 20,
                        backgroundColor: '#efefef',
                        bottom: 50,
                        left: 20,
                        right: 20,
                        position: 'absolute',
                        alignItems: 'center',
                        borderRadius: 20,
                    }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Please pick a value</Text>
                        {
                            this.props.selectionArray.map((value, index) => {
                                return <TouchableHighlight key={index} onPress={() => this.setDropDownSelection(value.value)} style={{ paddingVertical: 4, }}>
                                    <Text>{value.value}</Text>
                                </TouchableHighlight>
                            })
                        }

                        <TouchableHighlight onPress={() => this.toggelDropDownModal()} style={{ paddingVertical: 4, }}>
                            <Text style={{ color: '#999' }}>Cancel</Text>
                        </TouchableHighlight>

                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 45,
        borderRadius: 25,
        fontSize: Fonts.size16,
        paddingLeft: 45,
        color: GreenRedVersion.white07,
    },
});