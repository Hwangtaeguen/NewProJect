import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TextInput, Button, StyleSheet, Text, SafeAreaView, Alert } from 'react-native';
import { db } from '../../firebase';
import { addDoc, collection, where, query } from 'firebase/firestore';
import firestore from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import Home from './Home';
import Start from './Start';
import { useNavigation } from '@react-navigation/native';


const Logins = (props) => {
  const navigation = useNavigation();
  const [addID, setAddID] = useState("");
  const [addPass, setAddPass] = useState("");

  const login = () => {

    const auth = getAuth();
    signInWithEmailAndPassword(auth, addID, addPass)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.addID);
        alert("로그인 성공!");
        navigation.reset({ routes: [{ name: 'Start', params: { useremail: addID } }] }); //스택 초기화 (뒤로가기 ben)

      })
      .catch((error) => {
        alert("실패, 정확히 입력해주세요")
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        console.log(errorCode);

      });
  }

  return (
    <View>
      <StatusBar style="auto" />
      <SafeAreaView style={{ marginTop: 50 }}>
        <TextInput
          style={styles.input}
          onChangeText={text => setAddID(text)}
          value={addID}
          placeholder="로그인할 ID입력" />

        <TextInput
          style={styles.input}
          onChangeText={text => setAddPass(text)}
          value={addPass}
          placeholder="로그인할 비번입력"
          secureTextEntry />

        <Button title="로그인 버튼" onPress={login} />
        <Button title="회원가입페이지로이동" onPress={() => {
          navigation.reset({ routes: [{ name: "Signup" }] });
        }} />

      </SafeAreaView>
    </View>
  )


}
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
  },
});


export default Logins;