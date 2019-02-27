import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Firebase from '../../components/firebase';
import GreenRedVersion from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

export default class HomeNotExistsScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      homeExists: (Firebase.flatInfo.flatId == 0 || Firebase.flatInfo.flatId === undefined) ? false : true,
    }
  }

  static navigationOptions = { header: null };

  /**
   * Function used to add home
   * @param {boolean} value used to indicate if home exists
   */
  _addHome(value) { this.setState({ homeExists: value }, () => { if (this.state.homeExists) this.props.navigation.navigate("TopTabNavigatorStack") }); }

  // Function used to navigate to TopTabNavigatorStack if home exists in the database
  componentWillMount() {
    if (this.state.homeExists) this.props.navigation.navigate("TopTabNavigatorStack");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>No home exists in the database</Text>
        <View style={{ flexDirection: 'row' }}>

          <TouchableOpacity style={[
            styles.touchableOpacity,
            styles.touchableOpacityAdd]}
            onPress={() => { this.props.navigation.navigate('AddHome', { addHome: this._addHome.bind(this) }) }}>
            <Text style={styles.touchableOpacityText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableOpacity: {
    width: '40%',
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
  },
  touchableOpacityAdd: {
    backgroundColor: GreenRedVersion.mainGreen09,
    borderRadius: 25,
  },
  touchableOpacityText: {
    fontSize: Fonts.size16,
    textAlign: 'center',
    color: GreenRedVersion.white09,
  }
});