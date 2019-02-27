import React, { Component } from 'react';
import { View, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import ShoppingScreenItem from './components/shoppingScreenItem';
import ShoppingScreenItemEdit from './components/shoppingScreenItemEdit';
import Icon from 'react-native-vector-icons/Ionicons';
import Firebase from '../../components/firebase';
import ShoppingData from './data/shoppingData';
import GreenRedVersion from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

export default class ShoppingScreen extends Component {
  constructor() {
    super();
    this.state = {
      noteArray: (Firebase.flatInfo.shopping != null && Firebase.flatInfo.shopping != undefined) ?
        Object.keys(Firebase.flatInfo.shopping)
          .map((key) => { return [key, Firebase.flatInfo.shopping[key]] }) : [],
      noteText: '',
      itemToChange: null,
      roommates: Firebase.roommates,
      itemValidation: true,
    };
  }

  static navigationOptions = {
    header: null,
  };

  // start the listener for changes under flats/flatId/shopping
  componentDidMount() {
    var that = this;
    var flatRef = Firebase.database.ref().child(`flats/${Firebase.flatInfo.flatId}/shopping`);
    flatRef.on('value', function (snap) {
      var obj = snap.val();
      that.setState({
        noteArray: (obj != null && obj != undefined) ?
          Object.keys(obj).map(function (key) { return [key, obj[key]] }).reverse() : [],
        noteText: ''
      })
      console.log("Data Updated Shopping")
    })
  }

  // Function used to add a new shopping item
  addNote() {
    var itemName = this.state.noteText.trim()
    if (itemName.length == 0) {
      alert("Enter a item name!")
      return
    }

    var newShoppingItem = {
      "itemName": this.state.noteText,
      "price": 0,
      "bought": false,
      "addedBy": Firebase.userInfo.uid,
      "boughtBy": null
    }
    ShoppingData.pushItem(newShoppingItem);
  }

  /**
   * Function used to add a new budget item
   * @param {boolean} checked used to show and hide the modal
   * @param {string} index shopping item id
   * @param {int} price shopping item price set by user
   * @param {boolean} returnItem if true -> user didn't put the price to the item
   * @param {string} itemName shopping item name
   */
  itemBought(checked, index, price, returnItem, itemName) {
    if (checked) {
      // only display the edit screen
      this.setState({ itemToChange: index })
      if (returnItem) {
        // return the old item
        var newShoppingItem = {
          "price": price,
          "bought": false,
          "boughtBy": null,
          "addedBy": Firebase.userInfo.uid,
        }
        ShoppingData.updateItem(newShoppingItem, index);
      }
    }
    else {
      // only hide the edit screen
      this.setState({ itemToChange: null })
      if (price != null) {
        // hide and update the item
        var newShoppingItem = {
          "price": price,
          "bought": true,
          "boughtBy": Firebase.userInfo.uid,
        }
        ShoppingData.updateItem(newShoppingItem, index);
        var d = new Date(); // for now
        let time = `${d.getHours()}:${d.getMinutes()}`;
        var flatmates = {};
        Object.keys(Firebase.flatInfo.roommates).forEach((key) => {
          // insert all roommates, except yourself (because you did buy the item)
          if (Firebase.userInfo.uid != key) flatmates[key] = {
            'payed': false,
            'name': Firebase.flatInfo.roommates[key].name,
            'photoURL': Firebase.flatInfo.roommates[key].photoURL,
          }
        });
        var newBudgetItem = {
          "itemName": itemName,
          "price": price,
          "boughtBy": Firebase.userInfo.uid,
          "time": time,
          "payed": flatmates,
        }
        ShoppingData.addItemToBudget(newBudgetItem);
      }
    }
  }

  /**
   * Function used to delete a shopping item
   * @param {string} key contains the id of the shopping item to be delete
   */
  deleteNote(key) { ShoppingData.deteleItem(key) }

  /**
   * Function used to validate
   * @param {string} text contrain the text that needs to be validated
   */
  validateShoppingItem(text) {
    alph = /^[a-zA-Z0-9\s]*$/
    if (alph.test(text))
      this.setState({
        itemValidation: true,
        noteText: text
      })
    else
      this.setState({ itemValidation: false });
  }

  render() {
    let notes = this.state.noteArray.map((val, key) => {
      if (val[0] != this.state.itemToChange) {
        return <ShoppingScreenItem key={val[0]} keyval={val[0]} val={val[1]} addedByRoommate={this.state.roommates[val[1].addedBy]}
          deleteMethod={() => this.deleteNote(val[0])} bought={this.itemBought.bind(this)} />
      }
      else {
        return <ShoppingScreenItemEdit key={val[0]} keyval={val[0]} val={val[1]} addedByRoommate={this.state.roommates[val[1].addedBy]}
          bought={this.itemBought.bind(this)} />
      }
    });
    return (
      <KeyboardAvoidingView style={styles.container} behavior={(Platform.OS === "ios") ? "padding" : ""} enabled>
        <View style={styles.shoppingItemInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder='Add an item'
            onChangeText={(noteText) => this.validateShoppingItem(noteText)}
            value={this.state.noteText}
            placeholderTextColor={GreenRedVersion.white07}
            underlineColorAndroid='transparent'>
          </TextInput>
          <Icon name={'ios-send'}
            size={30}
            onPress={this.addNote.bind(this)}
            style={styles.addButton}
            color={GreenRedVersion.white09}
          />
        </View>
        <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'>
          {notes}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    backgroundColor: GreenRedVersion.mainGreen
  },
  header: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 10,
    borderBottomColor: '#ddd'
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10
  },
  shoppingItemInputContainer: {
    width: '94%',
    borderRadius: 30,
    marginHorizontal: '3%',
    marginTop: 10,
    backgroundColor: GreenRedVersion.black03,
    justifyContent: 'center'
  },
  textInput: {
    width: '100%',
    color: GreenRedVersion.white09,
    paddingLeft: 30,
    paddingVertical: 10,
    fontSize: Fonts.size18
  },
  addButton: {
    position: 'absolute',
    top: 7,
    right: 20
  },
});
