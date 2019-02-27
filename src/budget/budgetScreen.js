import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import BudgetItem from './components/budgetItem';
import Firebase from '../../components/firebase';
import WhoPayed from './components/whoPayed';
import GreenRedVersion from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

export default class BudgetScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      data: (Firebase.flatInfo.budget != null && Firebase.flatInfo.budget != undefined) ?
        Object.keys(Firebase.flatInfo.budget)
          .map(function (key) { return [key, Firebase.flatInfo.budget[key]] }).reverse() : [],
      itemToChange: null,
      roommates: Firebase.roommates,
    }
  }

  static navigationOptions = { header: null };
  
  // used to know which item to render differently as a WhoPayed component
  changeState(id) { this.setState({ itemToChange: id }); }

  // start the listener for changes under flats/flatId/budget
  componentDidMount() {
    var that = this;
    var flatRef = Firebase.database.ref().child(`flats/${Firebase.flatInfo.flatId}/budget`);
    flatRef.on('value', function (snap) {
      var obj = snap.val();
      that.setState({
        data: (obj != null && obj != undefined) ?
          Object.keys(obj).map(function (key) {
            return [key, obj[key]]
          }).reverse() : [],
      })
      console.log("Data Updated Budget")
    })
  }

  render() {
    // sumOwn - how much do your flatmates own you
    //    calculation is made - sum of total debt * (number of roommates without you) / (number of roommates with you)
    // youOwn - how much you own your flatmates
    let sumOwn = 0, youOwn = 0;

    let budgetItems = this.state.data.map((val, key) => {

      key = val[0];
      // we take the number of roommates  from the list of payed items because all the roommates will use that item
      if (val[1].payed !== undefined) { // <- Validation if there is only one user in the flat
        // The user the registers a shopping item is not included in the list to pay, because of this the array payed is undefined
        let roommates = Object.keys(val[1].payed).length;
        if (val[1].boughtBy == Firebase.userInfo.uid) {
          let payed = 0;
          Object.keys(val[1].payed).forEach((key) => {
            if (Object.values(val[1].payed[key])[1])
              payed++; // count roommates who have payed the item
          })
          // price * (roommates without you / roommates with you) -> debt for the item you bought
          // the part that is beign subtract is the sum the roommates have payed you back
          sumOwn += ((parseFloat(val[1].price) * roommates / (roommates + 1))
            - (parseFloat(val[1].price) * payed / (roommates + 1)));
        } else {
          // validation when a user enters a new home and there are no items bought
          if (val[1].payed[Firebase.userInfo.uid] != null && val[1].payed[Firebase.userInfo.uid] !== undefined) {
            // sum the debt where you didn't pay yet
            if (Object.values(val[1].payed[Firebase.userInfo.uid])[1] == false)
              youOwn += (parseFloat(val[1].price) / (roommates + 1));
          }
        }
      }
      // second condition -> there is only one user in the flat -> there is no need for who payed
      if (val[0] != this.state.itemToChange || val[1].payed === undefined) {
        return <BudgetItem key={key} keyval={key} val={val[1]} roommate={this.state.roommates[val[1].boughtBy]}
          currentUserId={Firebase.userInfo.uid} changeState={this.changeState.bind(this)} />
      }
      else {
        return <WhoPayed key={key} keyval={key} val={val[1]} currentUserId={Firebase.userInfo.uid}
          changeState={this.changeState.bind(this)} />
      }
    })

    return (
      <View style={styles.container}>
        <View style={styles.headLine}>
          <View style={styles.ownText}>
            <Text style={{ fontSize: Fonts.size16, color: GreenRedVersion.black05, textAlign: 'center' }}>You own your flatmates</Text>
            <Text style={{ fontSize: 30, color: GreenRedVersion.white, textAlign: 'center' }}>{youOwn.toFixed(2)} €</Text>
          </View>
          <View style={styles.ownText}>
            <Text style={{ fontSize: Fonts.size16, color: GreenRedVersion.black05, textAlign: 'center' }}>Your flatmates own you</Text>
            <Text style={{ fontSize: 30, color: GreenRedVersion.white, textAlign: 'center' }}>{sumOwn.toFixed(2)} €</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {budgetItems}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: GreenRedVersion.mainGreen,
  },
  scrollContainer: {
    flex: 1
  },
  headLine: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    backgroundColor: GreenRedVersion.mainRed09,
  },
  ownText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});