import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, TextInput, Button,StyleSheet,Text,SafeAreaView,Image } from 'react-native';
import { db } from '../../firebase';
import { addDoc , collection, setDoc,doc , where, query, getDocs } from 'firebase/firestore';
import firestore from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Auth } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';
import Log from '../../assets/Log.png';



const Signup = (props) => {
  const navigation = useNavigation();
  const userCollectionRef=collection(db,"회원가입 학생 이름,학번");

const[ addID, setAddID ]=useState("");
const[ addPass, setAddPass ]=useState("");
const[ addName, setAddname ]=useState("");
const[ country,setCountry]=useState("");
const[ score, setscore ] = useState("0");


const sinup = () => {

const auth = getAuth();
createUserWithEmailAndPassword(auth,addID,addPass)
  .then((userCredential) => {

    
    const user = userCredential.user;//인증용
    console.log(user.addID);//인증용

    setDoc(doc(db,"회원가입 학생 이름,학번",addID),// 스토어용
    { 
      학생이름: addName,
      아이디:addID,
      반: country,
      점수:score,
    });
    setAddname("")
    alert("성공! 회원가입 완료");
    navigation.navigate("Login");
  
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    console.log(errorCode);
    if(errorCode=="auth/email-already-in-use"){
      alert("이미 가입된 이메일 입니다.")
    }if(errorCode=="auth/invalid-email"){
      alert("이메일 형식으로 입력해주세요.")
    }if(errorCode== "auth/weak-password"){
      alert("비밀번호는 6자 이상이어야 합니다.")
    }
    
  });
}



return(
<View style= {{marginTop:30}}>
<View style = {{alignItems:'center'}}>
      <Image 
      style={{
      width: 300,
      height: 300,
      marginBottom: 15,}}
      source={Log}/>
    </View>

  <StatusBar style="auto"/>
<SafeAreaView style= {{marginTop:50}}>
    <TextInput 
    style={styles.input}
    onChangeText={text=>setAddID(text)}
    value={addID}
    placeholder="E-mail"/>

    <TextInput 
    style={styles.input}
    onChangeText={text=>setAddPass(text)}
    value={addPass}
    placeholder="비밀번호"
    secureTextEntry/>

<TextInput 
    style={styles.input}
    onChangeText={text=>setAddname(text)}
    value={addName}
    placeholder="이름"
    />

<View style={{alignItems:'center'}}>
  <Text style={{fontStyle:'normal',fontSize:15,fontWeight:'600',color:'#0000FF'}}>반 선택</Text>
  <Picker 
  style = {{height:40,width:150,backgroundColor:"#D8D8D8",}}
  selectedValue = {country}
  onValueChange={(val,idx)=>setCountry(val)}>
  <Picker.Item label='1반' value="1반" style={{alignItems:'center',fontSize:15,color:'#000000'}}></Picker.Item>
  <Picker.Item label='2반' value="2반" style={{alignItems:'center',fontSize:15,color:'#000000'}}></Picker.Item>
  <Picker.Item label='3반' value="3반" style={{alignItems:'center',fontSize:15,color:'#000000'}}></Picker.Item>
  <Picker.Item label='4반' value="4반" style={{alignItems:'center',fontSize:15,color:'#000000'}} ></Picker.Item>
  </Picker>
</View>

<View style={styles.fixToText}>
  <Button title="로그인하기" color="#424242" onPress={()=>{navigation.reset({routes: [{name: "Login"}]})}}/>
  <Button title="회원가입완료" color="#819FF7" onPress={sinup} />
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
    flexDirection:'row',
    justifyContent:'space-around',
    marginTop:30,
  }
  });

export default Signup;