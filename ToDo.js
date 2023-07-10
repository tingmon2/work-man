import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput} from "react-native";
import PropTypes from "prop-types";

const {width, height} = Dimensions.get('window');

export default class ToDo extends React.Component{
    constructor(props) {  // replace state = {}
        //console.log(props);
        super(props); // from App.js
        this.state = { isEditing: false, textValue: props.text} // from current component
    }
    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        id: PropTypes.number.isRequired,
        uncompleteToDo: PropTypes.func.isRequired,
        completeToDo: PropTypes.func.isRequired,
        updateToDo: PropTypes.func.isRequired
    }
/*     state = {
        isCompleted: false, // this is only for the css, not actually handle the data in the app
        isEditing: false,
        textValue: ""
    }; 
    _toggleComplete = () => {
        this.setState(prevState => { //get previous state
            return {
                isCompleted: !prevState.isCompleted  //modify previous state of isCompleted
            }
        })
    } */

    _toggleComplete = (event) => {
        event.stopPropagation(); 
        const { isCompleted, completeToDo, uncompleteToDo, id } = this.props;
        if(isCompleted){
            uncompleteToDo(id);
        }
        else{
            completeToDo(id);
        }
    }
    _editTrue = (event) => {
        event.stopPropagation();
        this.setState({
            isEditing: true
        });
    }
    _editFalse = (event) => {
        event.stopPropagation(); // prevent scrollview moving when touching icon
        const { textValue } = this.state;
        const { id, updateToDo } = this.props;
        updateToDo(id, textValue);
        this.setState({
            isEditing: false
        });
    }
    _controlText = (text) => {
        this.setState({
            textValue: text
        });
    }

    render() {
        const { isEditing, textValue } = this.state;
        const { text, id, deleteToDo, isCompleted } = this.props; // allow to use props of parent
        return (
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._toggleComplete} >
                        <View style={[styles.circle, isCompleted ? styles.completedCircle : styles.uncompletedCircle]}></View>
                    </TouchableOpacity>
                    {isEditing ? (
                        <TextInput 
                        style={[styles.text, styles.input]} 
                        value={textValue} 
                        onChangeText={this._controlText} 
                        autoFocus={true} 
                        multiline={true} 
                        onBlur={this._editFalse} 
                        returnKeyType="done" underlineColorAndroid={"transparent"}>
                        </TextInput>
                    ) : (
                        <Text style={[styles.text, isCompleted ? styles.completedText : styles.uncompletedText]}>{text}</Text>
                    )}
                </View>
                {!isCompleted ? (isEditing? (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._editFalse}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>📌</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._editTrue}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>✏️</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPressOut={(event) =>{
                            event.stopPropagation()
                            deleteToDo(id)}}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>❌</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )) : (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={(event) =>{
                            event.stopPropagation()
                            deleteToDo(id)}}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>❌</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width - 70,
        borderBottomColor: "red",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    text: {
        fontWeight: "600",
        fontSize: 15,
        marginVertical: 18,
        marginLeft: 5,
        width: width / 1.5
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderColor: "red",
        borderWidth: 3,
        marginRight: 7
    },
    completedCircle:{
        backgroundColor: "lightgray",
        borderColor: "royalblue"
    },
    uncompletedCircle: {
        borderColor: "red"
    },
    completedText: {
        color: "grey",
        textDecorationLine: "line-through"
    },
    uncompletedText: {
        color: "#353535"
    },
    column: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: width / 1.5
    },
    actions: {
        flexDirection: "row",
        marginHorizontal: 3
    },
    actionContainer: {
        marginVertical: 10,
        marginHorizontal: 8
    },
    input: {
        fontWeight: "600",
        fontSize: 15,
        paddingBottom: 5,
        marginVertical: 13,
        alignSelf: 'flex-start',
        //width: width / 1.5
    }
})