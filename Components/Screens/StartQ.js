import { View, Button, Text, TextInput, StyleSheet, KeyboardAvoidingView,TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { addDoc, collection, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { async } from '@firebase/util';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//*🚩StartQ View*//
//*모드별로 다른 화면 구성*//
const StartQ = (props) => {
  const [mode, setmode] = useState("Question");
  const [Answer, setAnswer] = useState();
  const route = useRoute();
  const email = route.params.useremail
  let content = null;

  //⚙️function : get Answer
  //DB에서 이미 답변한 질문인지 확인하는 함수, 답변했으면 mode="Answered"
  const getAnswer = async () => {
    try {
      const q = query(collection(db, `/userInfo/${route.params.useremail}/Answers`), where('Qnum', "==", `${route.params.qnum}`), where('Q', "==", "what do you think the problem asking you to do?"))
      const data = await getDocs(q);
      const Data = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      if (Data[0].Qnum == route.params.qnum) {
        setAnswer(Data[0].A)
        setmode("Answered")
      }
    } catch (error) {
      console.log(error)
      console.log("ERROR: user didn't write answer")
    }
  }

  //함수호출
  useEffect(() => {
    getAnswer();
  }, [])





  //모드별 화면
  //mode 'Question': 기본 화면
  if (mode === "Question") {
    content =
      <KeyboardAwareScrollView scrollEnabled={true} behavior='padding'>
        <View style={{alignItems:'center'}}>
          <Main
            mode={mode}
            setmode={setmode} />
        </View>
      </KeyboardAwareScrollView>
    //mode 'Answer': 메시지, 버튼 추가
  } else if (mode === "Answer") {
    content =
      <KeyboardAwareScrollView scrollEnabled={true} behavior='padding'>
        <View style={{alignItems:'center'}}>
          <Main
            mode={mode}
            setmode={setmode} />
          <Celebrate />
        </View>
      </KeyboardAwareScrollView>
    //mode 'Answered' : 작성했던 답변 확인, 다음 화면으로 가는 버튼
  } else if (mode === "Answered") {
    content =
      <KeyboardAwareScrollView scrollEnabled={true} behavior='padding'>
        <View style={{alignItems:'center'}}>
          <Done Answer={Answer} />
        </View>
      </KeyboardAwareScrollView>
  }

  //보여지는 화면
  return (content)
};


//*♾️Main View*//
const Main = (props) => {
  const [mainQ, setmainQ] = useState();
  const [addA, setaddA] = useState();
  const route = useRoute();
  const Qname = route.params.qnum

  //⚙️function : GetQ
  //DB에서 메인 질문을 갖고오는 함수
  const GetQ = async () => {
    console.log(`/QandA/${Qname}/Start`)
    try {
      const data = await getDocs(collection(db, `/QandA/${Qname}/Start`))
      const Data = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      console.log(Data)
      setmainQ(Data[0].MainQ)
    } catch (error) {
      console.log(error.massage)
      console.log('ERROR: in GetQ')
    }
  }

  //⚙️function : addAnswer
  //DB에서 선행 질문에 대한 (질문번호,질문,답안,등록 시간)을 DB에 삽입하는 함수
  const docRef = doc(db, "userInfo", route.params.useremail)
  const colRef = collection(docRef, "Answers")
  const addAnswer = async () => {
    try {
      await addDoc(colRef, {
        Qnum: route.params.qnum,
        Q: 'what do you think the problem asking you to do?',
        A: addA,
        createAt: new Date(),
      });
      console.log("answer added")
    } catch (error) {
      console.log(error.massage)
      console.log('ERROR: in addAnswer')
    }
  }

  //함수 호출
  useEffect(() => {
    GetQ()
  }, [])


  //보여지는 화면
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.box}>
        <Text style={styles.Header}>{route.params.title}</Text>
        <Text style={styles.text}>{mainQ}</Text>
      </View>
      <Text style={styles.subQ}>
        💡what do you think {"\n"}      the problem asking you to do?
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Write your answer"
        value={addA}
        onChangeText={(text) => {
          setaddA(text);
        }}
        onSubmitEditing={() => { props.setmode("Answer"); addAnswer(); }}
      />
    </View>
  )
}

//*♾️Done View*//
//모드가 Answered일 때(이미 답변했을 때) 보여줄 화면
const Done = (props) => {
  const [mainQ, setmainQ] = useState();
  const route = useRoute();
  const navigation = useNavigation();
  const Qname = route.params.qnum

  //⚙️function : GetQ
  //DB에서 메인 질문을 갖고오는 함수
  const GetQ = async () => {
    console.log(`/QandA/${Qname}/Start`)
    try {
      const data = await getDocs(collection(db, `/QandA/${Qname}/Start`))
      const Data = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      console.log(Data)
      setmainQ(Data[0].MainQ)
    } catch (error) {
      console.log(error.massage)
      console.log('ERROR: in Done')
    }
  }

  //함수호출
  useEffect(() => { GetQ() }, [])


  //보여지는 화면
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.box}>
        <Text style={styles.Header}>{route.params.title}</Text>
        <Text style={styles.text}>{mainQ}</Text>
      </View>
      <Text style={styles.subQ}>
        💡what do you think {"\n"}      the problem asking you to do?
      </Text>
      <TextInput
        style={styles.input}
        value={props.Answer}
      />
      <View>
        <Text style={styles.celebrateText}>
          ✨ Good Job ! ✨
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("ChooseQ",
              {
                title: route.params.title,
                qnum: route.params.qnum,
                useremail: route.params.useremail
              })}>
          <Text style={styles.btntext}>Let's solve it!</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


//*♾️Celebrate Component*//
//축하메시지와 버튼 컴포넌트
const Celebrate = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  return (
    <View>
      <Text style={styles.celebrateText}>
        ✨ Good Job !✨
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("ChooseQ",
            {
              title: route.params.title,
              qnum: route.params.qnum,
              useremail: route.params.useremail
            })}>
        <Text style={styles.btntext}>Let's solve it!</Text>
      </TouchableOpacity>
    </View>
  )
}


//✨스타일시트
const styles = StyleSheet.create({
  box: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: "#F9F8F8",
    width: 330,
    height: 270,
    backgrountRadius: 8,
    borderColor: "#C9E1FF",
    borderWidth: 3,
    borderRadius: 20,
  },
  text: {
    marginTop: 23,
    marginLeft: 23,
    marginRight: 23,
    fontSize: 14,
    textAlign: 'center'
  },
  Header: {
    marginTop: 0,
    fontSize: 20,
    padding: 10,
    backgroundColor: "#C9E1FF",
    width: 330,
    height: 50,
    textAlign: 'center',
    fontWeight: 'bold',
    overflow: "hidden",
    backgrountRadius: 8,
    borderColor: "#C9E1FF",
    borderWidth: 1,
    borderRadius: 20,
  },
  input: {
    margin: 20,
    height: 100,
    width: 325,
    borderColor: "#DDDDDD",
    borderWidth: 2,
    backgroundColor: "#F9F8F8",
    backgrountRadius: 8,
    borderRadius: 10,
  },
  celebrateText: {
    backgroundColor: '#C1F4C5',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddin: 20,
    borderColor: "#C1F4C5",
    borderWidth: 2,
    backgrountRadius: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  subQ: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold'

  }, button: {
    backgroundColor: '#4D96FF',
    overflow: "hidden",
    backgrountRadius: 8,
    borderColor: "#4D96FF",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    width: 165,
    height: 40,
    margin: 11,
    justifyContent: 'center',
    alignContent: 'center',
    margin: 50,
  
  },btntext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#FFF",
  },
});

export default StartQ;



