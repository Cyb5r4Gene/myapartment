import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Firebase from '../../components/firebase';
import GreenRedVersion from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
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
      fullName: Firebase.auth.currentUser.displayName,
      email: Firebase.auth.currentUser.email,
      emailVerified: String(Firebase.auth.currentUser.emailVerified),
      photoURL: Firebase.auth.currentUser.photoURL,
      count: false,
      loading: false,
    }
  }

  static navigationOptions = { header: null };

  // Function used to refresh the screen
  refresh() { this.setState({ count: !this.state.count }) }

  render() {
    const profilePhoto = avatarsArray[this.state.photoURL];
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.topBackgroundImage} >
            <Image
              source={profilePhoto}
              style={styles.profileimage} />

            <Text style={styles.name}>
              {this.state.fullName}
            </Text>
          </View>
        </View>

        <View style={styles.bottom}>
          <View style={styles.bottomItem}>
            <View style={styles.bottomItemInner}>
              <Text style={styles.bottomItemTextLabel} >
                Email
              </Text>
            </View>
            <View style={styles.bottomItemInner}>
              <Text style={styles.bottomItemText} >
                {this.state.email}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.btnCancel} onPress={() => { this.props.navigation.navigate('ProfileEdit', { refresh: this.refresh.bind(this) }) }} >
              <Text style={styles.textEdit}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSave} onPress={() => {
              this.setState({ loading: true }, () => {
                Firebase.auth.signOut()
                  .then(() => { this.setState({ loading: false }); })
              })
            }} >
              <Text style={styles.text}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
        {(this.state.loading) ? <Loading animating={this.state.loading} color={GreenRedVersion.mainGreen09} size={'large'} /> : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    height: '40%'
  },
  topBackgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GreenRedVersion.mainGreen,
  },
  profileimage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#fff',
  },
  name: {
    textAlign: 'center',
    fontSize: 30,
    color: '#FFF',
    paddingVertical: 10
  },
  bottom: {
    height: '60%',
    flexDirection: 'column',
    padding: 5,
    alignItems: 'center'
  },
  bottomItem: {
    width: '75%',
    height: '33.33%',
    padding: 5
  },
  bottomItemInner: {
    flex: 1,
    height: '50%',
    paddingLeft: 10,
  },
  bottomItemText: {
    fontSize: Fonts.size18,
    color: '#222222',
    paddingBottom: 10,
  },
  bottomItemTextLabel: {
    fontSize: Fonts.size16,
    fontWeight: 'bold',
    color: '#222222',
    paddingTop: 30
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
});