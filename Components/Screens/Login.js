import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TextInput, Button,StyleSheet,Text,SafeAreaView, Alert,Image } from 'react-native';
import { db } from '../../firebase';
import { addDoc , collection, where, query } from 'firebase/firestore';
import firestore from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword } from "firebase/auth";
import Home from './Home';
import Start from './Start';
import { useNavigation } from '@react-navigation/native';
import Log from '../../assets/Log.png';


const Logins = (props) => {
    const navigation = useNavigation();
    const[ addID, setAddID ]=useState("");
    const[ addPass, setAddPass ]=useState("");


    const login = () => {

    const auth = getAuth();
    signInWithEmailAndPassword(auth, addID, addPass)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.addID);
        alert("성공로그인!!완료!");
        navigation.reset({routes: [{name: 'Start', params: {username: addID}}]}); //스택 초기화 (뒤로가기 ben)

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        console.log(errorCode);

        if(errorCode=="auth/invalid-email"){
          alert("아이디는 이메일 형식으로 입력해주세요.")
        }if(errorCode=="auth/user-not-found"){
          alert("잘못 입력했거나 등록되지 않은 유저입니다.")
        }if(errorCode=="auth/wrong-password"){
          alert("비밀번호가 틀렸습니다.")
        }if(errorCode=="auth/internal-error"){
          alert("비밀번호를 입력하시오.")
        }
        
        
      });
    }
  
  return(
  <View style= {{
    marginTop:10,
    backgroundColor:'#F4FA58'
  }}>
    <StatusBar style="auto"/>
    <View style = {{alignItems:'center'}}>
      <Image 
      style={{
      width: 500,
      height: 500,
      marginBottom: 15,}}
      source={Log}/>
    </View>
  <SafeAreaView >
      <TextInput 
      style={styles.input}
      onChangeText={text=>setAddID(text)}
      value={addID}
      placeholder="로그인할 ID입력"/>
  
      <TextInput 
      style={styles.input}
      onChangeText={text=>setAddPass(text)}
      value={addPass}
      placeholder="로그인할 비번입력"
      secureTextEntry/>
    <View style={styles.fixToText}>
    <Button title="로그인" onPress={login} color="#424242" />
    <Button title="회원가입" color="#819FF7" onPress={()=>{navigation.reset({routes: [{name: "Signup"}]});
  }} />
  </View>
  
    </SafeAreaView>
    </View>
  )
    
  
}
  const styles = StyleSheet.create({
  input: {
    height : 40,
    margin : 12,
    borderWidth : 1,
    padding : 10, 
    textAlign:'center',
    backgroundColor:'#D8D8D8'
  },
  fixToText:{
    flexDirection:'row-reverse',
    justifyContent:'space-around'
  }
  });
  

  export default Logins;