//Cspell:Ignore Ionicons
import React, { useState, useEffect } from 'react';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech';

import {
  StyleSheet,
  View,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  AsyncStorage,
  Text,
  TextInput,
  TouchableOpacity,
  BackHandler,
  FlatList,
  Vibration
} from 'react-native';

export default function App() {
  const [text, setText] = useState('OK! Nova atividade');
  const [text1, setText1] = useState('Atenção! campo vazio!');
  const [text2, setText2] = useState('Atenção! Já contém esta atividade!');
  const [text3, setText3] = useState('Atenção! deseja sair do aplicativo?');
  const [text4, setText4] = useState('Atenção! excluir atividade?');
  const [text5, setText5] = useState('Adicionada');

  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState("");


  async function sair() {
    Alert.alert('Atenção', 'Você deseja sair do App?',
      [
        { text: 'Não', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Sim', onPress: () => BackHandler.exitApp() },
        Speech.speak(text3, {
          language: 'pt-BR'
        })
      ],
      { cancelable: false });
    return true;
  }

  async function addTask() {
    if (newTask === "") {
      Alert.alert("Atenção", "Campo vazio!");
      Speech.speak(text1, {
        language: 'pt-BR'
      });
      return;
    }

    const search = task.filter(task => task === newTask);

    if (search.length !== 0) {
      Alert.alert("Atenção", "ja contém esta atividade!");
      Speech.speak(text2, {
        language: 'pt-BR'
      });
      return;
    }

    Speech.speak(text, {
      language: 'pt-BR'
    });

    Speech.speak(newTask, {
      language: 'pt-BR'
    });

    Speech.speak(text5, {
      language: 'pt-BR'
    });
    setTask([...task, newTask]);
    setNewTask("");

    Keyboard.dismiss();
  }

  async function removeTask(item) {
    Vibration.vibrate()
    Alert.alert(
      "Atenção",
      "remover atividade?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => setTask(task.filter(tasks => tasks !== item))
        }
      ],
      { cancelable: false }
    );
    Speech.speak(text4, {
      language: 'pt-BR'
    });

    Speech.speak(item, {
      language: 'pt-BR'
    });
  }

  useEffect(() => {
    async function carregaDados() {
      const task = await AsyncStorage.getItem('task')
      if (task) {
        setTask(JSON.parse(task));
      }
    }
    carregaDados();
  }, []);

  useEffect(() => {
    async function salvaDados() {
      AsyncStorage.setItem("task", JSON.stringify(task));
    }
    salvaDados();
  }, [task]);

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior="padding"
        style={{ flex: 1 }}
        enabled={Platform.OS === "ios"}
      >
        <View style={styles.container}>
          <Text style={styles.Title}>Atividade da faculdade</Text>
          <View style={styles.Body}>
            <FlatList
              data={task}
              keyExtractor={item => item.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.FlatList}
              renderItem={({ item }) => (
                <View style={styles.ContainerView}>
                  <Text style={styles.Texto}>{item}</Text>
                  <TouchableOpacity onPress={() => removeTask(item)}  >
                    <MaterialIcons
                      name="delete-forever"
                      size={25}
                      color="#f64c75"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <View style={styles.Form}>
            <TextInput
              style={styles.Input}
              placeholderTextColor="#999"
              autoCorrect={true}
              value={newTask}
              placeholder="Adicione atividades..."
              maxLength={25}
              onChangeText={text => setNewTask(text)}
            />
            <TouchableOpacity style={styles.Button} onPress={() => addTask()}>
              <Ionicons name="ios-add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.ViewSair}>
            <TouchableOpacity style={styles.Button}
              onPress={() => sair()}>
              <Ionicons name="ios-exit" size={25} color="#FFF" />
            </TouchableOpacity>



          </View>
          <View>
            <Text style={styles.Text}>Desenvolvimento Fatec Itu</Text>
            <Text style={styles.Text}>Saulo Camargo</Text>
          </View>
        </View>
      </KeyboardAvoidingView>

    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 0,
    backgroundColor: "#ADD8E6"
  },
  Body: {
    flex: 1
  },
  Form: {
    padding: 0,
    height: 60,
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: "#eee"
  },
  Input: {
    flex: 1,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#eee"
  },
  ViewSair: {
    flexDirection: 'row-reverse',
  },
  ButtonComp: {
    height: 40,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c6cce",
    borderRadius: 4,
    marginLeft: 10
  },
  Button: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c6cce",
    borderRadius: 4,
    marginLeft: 10
  },

  FlatList: {
    flex: 1,
    marginTop: 5
  },
  Texto: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center"
  },
  Text: {
    fontSize: 12,
    color: "#9E9E9E",
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center"
  },

  ContainerView: {
    marginBottom: 2,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#87CEEB",

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#87CEEB"
  },
  Title: {
    fontSize: 25,
    color: "#0000CD",
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center"
  }
});


