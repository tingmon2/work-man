import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
import ToDo from './ToDo';
import { AppLoading } from 'expo';
import 'react-native-get-random-values';
import * as Random from 'expo-random';

const {height, width} = Dimensions.get("window");

export default class extends React.Component {
  constructor(props) {
    //console.log(props);
    super (props);
    this.state = { // consider state as a database in your app. that is why we make toDos as an object not array. it makes more easier to manipulate datas.
      newInput: "",
      isLoading: false,
      toDos: {}
    }
  }

  _load = async () => {
    try{
      const toDos = await AsyncStorage.getItem("toDos");
      //const parsedIsLoading = await AsyncStorage.getItem("newInput");
      //console.log(parsedIsLoading);
      //console.log(toDos);
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        isLoading: true,
        toDos: parsedToDos || {}
      })
    }
    catch (e) {
      console.log(e);
    }
  }
  _controlNewInput = text => {
    this.setState({
      newInput: text
    })
  }
  componentDidMount = () => {
    this._load()
  }
  addToDo = () => {
    const { newInput } = this.state;
    const { selectedDate }  = this.props;
    if (newInput !== "" ){
      this.setState(prevState => {
        const ID = parseInt(new Date().getMilliseconds().toString() + new Date().getUTCMilliseconds().toString()); //uuidv4();
        const newObject = {
          [ID]: {  // set the name(id) of the object like database
            id: ID,
            isCompleted: false,
            text: newInput,
            createdAt: selectedDate.toString()
          }
        };
        const newState = {
          ...prevState,        // load previous states that we already have. in this case, only isLoading because rest of the states will be modified
          newInput: "",        // set input state empty
          toDos: {          // make a new object named toDos
            ...prevState.toDos,  // get previous state of data list
            ...newObject
          }
        }
        // newState -> isLoading/newInput/toDos
        // toDos -> objects named by ID -> an object that contains data
        // console.log(prevState);
        // console.log(newObject);
        // console.log(newState);
        this._saveToDos(newState.toDos);
        return { ...newState }; // research spread statement
      });
    }
  }
  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      // console.log(delete toDos.id);
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    })
  }
  _uncompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      // console.log(newState);
      this._saveToDos(newState.toDos);
      return { ...newState }
    });
  }
  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      // console.log(newState);
      this._saveToDos(newState.toDos);
      return { ...newState }
    });
  }
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      };
      // console.log(newState);
      this._saveToDos(newState.toDos);
      return { ...newState }
    });
  }
  _saveToDos = (newToDos) => {
    // console.log(newToDos);
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
    // AsyncStorage only accepts string type
  }

  _filterToDo = (createdAt) => {
    const { selectedDate } = this.props;
    //console.log("filtering...", createdAt.toString(), selectedDate.toString())
    return createdAt.toString() == selectedDate.toString();
  }

  render() {
    const { newInput, isLoading, toDos } = this.state;
    const { selectedDate } = this.props;
    //console.log(selectedDate);
    if(!isLoading){
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='blue' barStyle='light-content'/>
        <Text style={styles.title}>Workman aka Slave</Text>
        <View style={styles.card}>
          <TextInput style={styles.newInput} placeholder={"Enter your Task"} value={newInput} onChangeText={this._controlNewInput} placeholderTextColor={"#999"} returnKeyType={"done"} autoCorrect={false} onSubmitEditing={this.addToDo} underlineColorAndroid={"transparent"} />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).reverse().map(toDo =>
              <ToDo 
              key={toDo.id}
              {...toDo} 
              deleteToDo={this._deleteToDo} 
              uncompleteToDo={this._uncompleteToDo} 
              completeToDo={this._completeToDo} 
              updateToDo={this._updateToDo}
              />).filter(toDo => this._filterToDo(toDo.props.createdAt))}
            {/* console.log(Object.values(toDos)) // Object.values() will returns an array with keys inside -> strip one layer of the object so we can modify the inside objects*/}
          </ScrollView>
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
  },
  title: {
    color: 'white',
    fontSize: 30,
    marginTop: 120,
    fontWeight: "600",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 50,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.8,
        shadowRadius: 10,
        shadowOffset: {
          height:-10,
          width:10
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  newInput: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 20
  },
  toDos: {
    alignItems: 'center'
  }
});
