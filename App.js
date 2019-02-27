import React from 'react';
import Nav from './navigation/nav';
import Firebase from './components/firebase';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      component: <Nav />
    }
    Firebase.init();
  }

  render() {
    return (
      this.state.component
    );
  }
}

