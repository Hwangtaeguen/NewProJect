import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, TextInput, Button,StyleSheet,Text,SafeAreaView } from 'react-native';
import { db } from '../../firebase';
import { addDoc , collection, setDoc,doc , where, query, getDocs } from 'firebase/firestore';
import firestore from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Auth } from 'firebase/auth';
import Home from './Home';



const Signup = (props) => {
  const navigation = useNavigation();
  const userCollectionRef=collection(db,"회원가입 학생 이름,학번");

const[ addID, setAddID ]=useState("");
const[ addPass, setAddPass ]=useState("");
const[ addName, setAddname ]=useState("");
const[ addAge, setAddage ]=useState("");
const[ selected, setSelected ] = useState("");
const[ score, setscore ] = useState("0");

const sinup = () => {

const auth = getAuth();
createUserWithEmailAndPassword(auth,addID,addPass)
  .then((userCredential) => {

    
    const user = userCredential.user;//인증용
    console.log(user.addID);//인증용

    setDoc(doc(db,"userInfo",addID),// 스토어용
    { 
      학생이름: addName,
      학번: addAge,
      아이디:addID,
      점수:score,

    });

    setAddname("")
    setAddage("")
    alert("성공! 회원가입 완료");

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    console.log(errorCode);
  });
}


// const qqqq = () => {

//   const q = query(userCollectionRef, 
//     where("비밀번호", "==", '1234567'),
//     orderBy("비밀번호", "desc"),
//     limit(1)
//     );

//     const data = getDocs(q);
//     const newData = data.docs.map(doc => ({ ...doc.data()}));
//     setSelected(newData);
//   }



// const addtoDB = async ()=>{
//   try{
//     await addDoc(collection(db,"회원가입 학생 이름,학번"),{
//       addName: addName,
//       addAge: addAge,
//     });
//     alert("성공!정상적으로 업로드 완료")
//     setAddname("")
//     setAddage("")
//   }catch(error){
//     console.log(error.message)
//   }
// }




return(
<View>
  <View>

  </View>
  <StatusBar style="auto"/>
<SafeAreaView style= {{marginTop:50}}>
    <TextInput 
    style={styles.input}
    onChangeText={text=>setAddID(text)}
    value={addID}
    placeholder="생성할 아이디 입력"/>

    <TextInput 
    style={styles.input}
    onChangeText={text=>setAddPass(text)}
    value={addPass}
    placeholder="생성할 비밀번호"
    secureTextEntry/>

<TextInput 
    style={styles.input}
    onChangeText={text=>setAddname(text)}
    value={addName}
    placeholder="이름"
    />

<TextInput 
    style={styles.input}
    onChangeText={text=>setAddage(text)}
    value={addAge}
    placeholder="반 번호"
    />
  <Button title="로그인페이지로이동" onPress={()=>{navigation.reset({routes: [{name: "Login"}]})}}/>
  <Button title="회원가입버튼" onPress={sinup} />


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
},
});

export default Signup;