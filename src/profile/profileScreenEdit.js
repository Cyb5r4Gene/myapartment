import React from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GreenRedVersion from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Firebase from '../../components/firebase';
import ProfileData from './data/profileData';
import Loading from '../../components/loading';

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

export default class ProfileScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      fullname: Firebase.userInfo.displayName,
      email: Firebase.userInfo.email,
      currentPassword: null,
      newPassword: null,
      isDateTimePickerVisible: false,
      personKey: Firebase.userInfo.photoURL,
      showPass: false,
      loading: false,
    }
  }

  static navigationOptions = { header: null };

  // Function used to reauthenticate the user when a reset password is performed
  reauthenticate = () => {
    var user = Firebase.auth.currentUser;
    var credential = Firebase.authO.EmailAuthProvider.credential(
      this.state.email,
      this.state.currentPassword,
    );
    return user.reauthenticateAndRetrieveDataWithCredential(credential);
  }

  // Function used to update the User information
  updateUser() {
    var displayName = this.state.fullname.trim().split(" ");
    var personKey = this.state.personKey;
    if (displayName.length != 2) {
      alert("Please write you firstname and lastname!");
      return;
    }

    var email = this.state.email.trim();
    if (!this.validateEmail(email)) {
      alert("Incorrect format of the email!");
      return;
    }

    var firstName = displayName[0].substring(0, 1).toUpperCase() + displayName[0].substring(1).toLowerCase();
    var lastName = displayName[1].substring(0, 1).toUpperCase() + displayName[1].substring(1).toLowerCase();
    displayName = firstName + " " + lastName;

    var userInfo = {
      displayName: displayName,
      email: this.state.email,
      photoURL: personKey
    }

    if (this.state.newPassword != null) {
      this.setState({ loading: true }, () => {
        this.reauthenticate().then(() => {
          var user = Firebase.auth.currentUser;
          user.updatePassword(this.state.newPassword).then(() => {
            ProfileData.updateUser(userInfo).then(() => {
              var roommatesRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/roommates/${Firebase.userInfo.uid}`);
              roommatesRef.update({
                photoURL: personKey
              }).then(() => {
                this.setState({ loading: false });
                alert("Data updated!");
                this.props.navigation.state.params.refresh();
                this.props.navigation.navigate('Profile');
              });
            });
          })
        }).catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        })
      })
    }
    else {
      this.setState({ loading: true }, () => {
        ProfileData.updateUser(userInfo).then(() => {
          var roommatesRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/roommates/${Firebase.userInfo.uid}`);
          roommatesRef.update({
            photoURL: personKey
          }).then(() => {
            alert("Data updated!");
            this.setState({ loading: false });
            this.props.navigation.state.params.refresh();
            this.props.navigation.navigate('Profile');
          });
        })
      })
    }
  }

  // Function used to change the user's avatar
  changeProfilPicture = (key) => { this.setState({ personKey: key }) }

  // Function used to show and hide the passwords
  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true })
    } else {
      this.setState({ showPass: true, press: false })
    }
  }

  // Function used to validate the name
  validateEditProfile(text) {
    alph = /^[a-zA-Z\s]*$/
    if (!alph.test(text)) alert("Name can contain only letters!");
    else this.setState({ fullname: text })
  }

  // Function used to validate the email
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.backgroundContainer}>

          <Text style={styles.headLine}>Edit profile</Text>

          <View style={styles.inputContainer}>
            <Icon
              name={'ios-person'}
              size={28}
              color={GreenRedVersion.white09}
              style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={'Full name'}
              placeholderTextColor={GreenRedVersion.white07}
              value={this.state.fullname}
              underlineColorAndroid='transparent'
              autoCapitalize='words'
              returnKeyType={"next"}
              onSubmitEditing={() => { this.emailTextInput.focus(); }}
              blurOnSubmit={true}
              onChangeText={(input) => this.validateEditProfile(input)}
              keyboardType='default' />
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name={'ios-mail'}
              size={28}
              color={GreenRedVersion.white09}
              style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={'Email'}
              placeholderTextColor={GreenRedVersion.white07}
              underlineColorAndroid='transparent'
              value={this.state.email}
              autoCapitalize='none'
              returnKeyType={"next"}
              ref={(input) => { this.emailTextInput = input; }}
              onSubmitEditing={() => { this.currentPasswordTextInput.focus(); }}
              blurOnSubmit={false}
              onChangeText={(input) => this.setState({ email: input })}
              keyboardType='email-address' />
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name={'ios-lock'}
              size={28}
              color={GreenRedVersion.white09}
              style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={'Current password'}
              placeholderTextColor={GreenRedVersion.white07}
              secureTextEntry={this.state.showPass}
              underlineColorAndroid='transparent'
              autoCapitalize='none'
              returnKeyType={"next"}
              ref={(input) => { this.currentPasswordTextInput = input; }}
              oonSubmitEditing={() => { this.newPasswordTextInput.focus(); }}
              onChangeText={(input) => this.setState({ currentPassword: input })}
            />
            <TouchableOpacity style={styles.btnEyer}
              onPress={this.showPass.bind(this)}>
              <Icon name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'}
                size={26}
                color={GreenRedVersion.white09} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name={'ios-lock'}
              size={28}
              color={GreenRedVersion.white09}
              style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={'New password'}
              placeholderTextColor={GreenRedVersion.white07}
              secureTextEntry={this.state.showPass}
              underlineColorAndroid='transparent'
              autoCapitalize='none'
              returnKeyType={"next"}
              ref={(input) => { this.newPasswordTextInput = input; }}
              onChangeText={(input) => this.setState({ newPassword: input })}
            />
            <TouchableOpacity style={styles.btnEyer}
              onPress={this.showPass.bind(this)}>
              <Icon name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'}
                size={26}
                color={GreenRedVersion.white09} />
            </TouchableOpacity>
          </View>

          <View style={styles.avatarContainer}>
            {
              avatarsArray.map((val, key) => {
                return <TouchableOpacity key={key} val={val} keyval={key}
                  onPress={() => { this.changeProfilPicture(key) }}>
                  <Image
                    source={val}
                    style={[styles.person,
                    (this.state.personKey == key) ?
                      { backgroundColor: GreenRedVersion.black03 } :
                      {}]} />
                </TouchableOpacity>
              })
            }
          </View>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.btnCancel} onPress={() => { this.props.navigation.navigate('Profile') }} >
              <Text style={styles.textEdit}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSave} onPress={this.updateUser.bind(this)}>
              <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
          </View>
          {(this.state.loading) ? <Loading animating={this.state.loading} color={GreenRedVersion.mainGreen09} size={'large'} /> : null}
        </View>

      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GreenRedVersion.mainGreen,
  },
  inputContainer: {
    width: '90%',
    borderRadius: 25,
    backgroundColor: GreenRedVersion.black03,
    marginTop: 10,
    marginHorizontal: '5%',
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '85%',
    marginTop: 10,
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    backgroundColor: GreenRedVersion.black03,
  },
  input: {
    width: '100%',
    height: 45,
    fontSize: Fonts.size16,
    paddingLeft: 40,
    color: GreenRedVersion.white09,
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    top: 8,
    left: 10,
  },
  btnSave: {
    width: '40%',
    height: 50,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    fontSize: Fonts.size16,
    backgroundColor: GreenRedVersion.mainRed09,
    justifyContent: 'center',
    marginTop: 20,
  },
  btnCancel: {
    width: '40%',
    height: 50,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    fontSize: Fonts.size16,
    borderColor: GreenRedVersion.mainRed09,
    borderWidth: 1,
    backgroundColor: GreenRedVersion.white09,
    justifyContent: 'center',
    marginTop: 20,
  },
  person: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GreenRedVersion.white07,
  },
  btnEyer: {
    position: 'absolute',
    top: 8,
    right: 20,
  },
  text: {
    color: GreenRedVersion.white07,
    fontSize: Fonts.size16,
    textAlign: 'center',
  },
  textEdit: {
    color: GreenRedVersion.mainRed09,
    fontSize: Fonts.size16,
    textAlign: 'center',
  },
  headLine: {
    fontSize: Fonts.size18,
    color: GreenRedVersion.white09,
    textAlign: 'center',
    marginBottom: 20,
  }
});