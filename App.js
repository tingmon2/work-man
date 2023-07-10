import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import ToDoList from './ToDoList';

const {height, width} = Dimensions.get("window");
 
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      refresh: false
    };
    this.onDateChange = this.onDateChange.bind(this);
    }
 
  onDateChange(date) {
    this.setState({
      selectedDate: date,
    });
  }

  render() {
    const { selectedDate } = this.state;
    const startDate = selectedDate ? selectedDate.toString() : '';
    return (
      <View style={styles.container}>
        <View style={{...styles.halfContainer, ...styles.calendar}}>
          <CalendarPicker
            onDateChange={this.onDateChange}
          />
        </View>
        <View style={{...styles.halfContainer, ...styles.workman}}>
          <ToDoList selectedDate={selectedDate}/>
        </View>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center',
    //marginTop: 100
  },
  halfContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  calendar: {
    flex: 1,
    //marginTop: 100,
    marginBottom: -120,
    zIndex: 1
  },
  workman: {
    flex: 1.5,
    marginTop: -50,
    justifyContent: 'center',
    alignItems: 'center',
  }
});