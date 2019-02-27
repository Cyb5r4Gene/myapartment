import React from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GreenRedVersion from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';

export default class HomeDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      key: props.index,
      flatName: props.data.flatName,
      street: props.data.street,
      zipcode: props.data.zipcode,
      city: props.data.city,
      country: props.data.country,
    };
  }

  // Function used to edit flat details 
  editFlat = () => {
    var flatName = this.state.flatName.trim();
    var street = this.state.street.trim();
    var zipcode = this.state.zipcode // no need to trim - we allow only numbers
    var city = this.state.city.trim();
    var country = this.state.country.trim();

    if (flatName.length == 0) {
      alert("You must enter flat's name.");
      return;
    }

    if (street.length == 0) {
      alert("You must enter the street name.");
      return;
    }

    if (zipcode.length == 0) {
      alert("You must enter the street name.");
      return;
    }

    if (city.length == 0) {
      alert("You must enter the city name.");
      return;
    }

    if (country.length == 0) {
      alert("You must enter the country name.");
      return;
    }

    var flatDetails = {
      flatName: flatName,
      street: street,
      zipcode: zipcode,
      city: city,
      country: country
    }
    this.props.edit(flatDetails, this.state.key);
  }

  /**
   * Function used to validate home details
   * @param {string} text to be validated
   * @param {string} type of the input
   */
  validateHomeDetails(text, type) {
    alph = /^[a-zA-Z\s]*$/
    str = /^[a-zA-Z0-9\.\s]*$/
    num = /^[0-9]*$/

    if (type == 'flatName') {
      if (!alph.test(text)) alert("Flat name can contain only letters!");
      else this.setState({ flatName: text })
    }
    else if (type == 'street') {
      if (!str.test(text)) alert("Street can contain only letters and numbers!");
      else this.setState({ street: text })
    }
    else if (type == 'zipcode') {
      if (!num.test(text)) alert("Zip code can contain only numbers!")
      else this.setState({ zipcode: text })
    }
    else if (type == 'city') {
      if (!alph.test(text)) alert("City can contain only letters!");
      else this.setState({ city: text })
    }
    else { // po dihet qe country
      if (!alph.test(text)) alert("Country can contain only letters!");
      else this.setState({ country: text })
    }

  }

  render() {
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
              marginVertical: 80,
              marginHorizontal: 10,
              backgroundColor: GreenRedVersion.mainGreen,
            }}>
            <Text style={styles.headline}>Edit a flat details</Text>
            <Icon
              name={'ios-close'}
              size={30}
              style={styles.inputIconCancel}
              color={GreenRedVersion.white07}
              onPress={() => {
                this.props.edit()
              }} />

            <View style={styles.inputContainer}>
              <Icon
                name={'ios-home'}
                size={28}
                color={GreenRedVersion.white09}
                style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={'Flat name'}
                placeholderTextColor={GreenRedVersion.white07}
                underlineColorAndroid='transparent'
                value={this.state.flatName}
                returnKeyType={"next"}
                onChangeText={(input) => this.validateHomeDetails(input, "flatName")}
                onSubmitEditing={() => { this.streetTextInput.focus() }} />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name={'ios-map'}
                size={28}
                color={GreenRedVersion.white09}
                style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={'Street'}
                placeholderTextColor={GreenRedVersion.white07}
                underlineColorAndroid='transparent'
                value={this.state.street}
                onChangeText={(input) => this.validateHomeDetails(input, "street")}
                ref={(input) => { this.streetTextInput = input; }}
                onSubmitEditing={() => { this.cityTextInput.focus() }} />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name={'ios-business'}
                size={28}
                color={GreenRedVersion.white09}
                style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={'City'}
                placeholderTextColor={GreenRedVersion.white07}
                underlineColorAndroid='transparent'
                value={this.state.city}
                returnKeyType={"next"}
                onChangeText={(input) => this.validateHomeDetails(input, "city")}
                ref={(input) => { this.cityTextInput = input; }}
                onSubmitEditing={() => { this.zipcodeTextInput.focus() }} />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name={'ios-code'}
                size={28}
                color={GreenRedVersion.white09}
                style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={'Zip code'}
                placeholderTextColor={GreenRedVersion.white07}
                underlineColorAndroid='transparent'
                value={this.state.zipcode}
                keyboardType='phone-pad'
                onChangeText={(input) => this.validateHomeDetails(input, "zipcode")}
                returnKeyType={"next"}
                ref={(input) => { this.zipcodeTextInput = input; }}
                onSubmitEditing={() => { this.countryTextInput.focus() }} />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name={'ios-flag'}
                size={28}
                color={GreenRedVersion.white09}
                style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={'Country'}
                placeholderTextColor={GreenRedVersion.white07}
                underlineColorAndroid='transparent'
                value={this.state.country}
                returnKeyType={"done"}
                onChangeText={(input) => this.validateHomeDetails(input, "country")}
                ref={(input) => { this.countryTextInput = input; }} />
            </View>

            <TouchableOpacity style={styles.btnSignUp}
              onPress={this.editFlat.bind(this)}>
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
    paddingLeft: 45,
    fontSize: Fonts.size16,
    color: GreenRedVersion.white07,
    justifyContent: 'center'
  },
  inputIcon: {
    position: 'absolute',
    top: 8,
    left: 10,
  },
  inputIconCancel: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  inputContainer: {
    width: '90%',
    marginHorizontal: '5%',
    borderRadius: 25,
    backgroundColor: GreenRedVersion.black03,
    marginTop: 10,
  },
  btnSignUp: {
    width: '90%',
    height: 45,
    borderRadius: 25,
    fontSize: Fonts.size16,
    backgroundColor: GreenRedVersion.mainRed09,
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: '5%'
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
});