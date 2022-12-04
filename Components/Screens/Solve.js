import { View, Button, Text, TextInput, StyleSheet, Image, Alert, ToastAndroid, TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '../../firebase';
import { addDoc, collection, doc, getDocs, query, where, getDoc, } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { async } from '@firebase/util';

let stepCount = 0;

//*🚩Solve View*//
const Solve = () => {
  const [state, setState] = useState("initialization");
  const [text, setText] = useState("")
  const [show, setShow] = useState(false);
  const [promts, setPromts] = useState("");
  const [Countstep, setCountstep] = useState(0);
  const [Confirmation, setConfirmation] = useState("");
  const [End, setEnd] = useState("");
  const [UpdatePoint, setUpdatePoint] = useState(false);
  const route = useRoute();

//*📁functions*//
  //⚙️function : getAnswer
  //DB에서 이미 답변한 질문인지 확인하는 함수, 답변했으면 End="Answered" 아니면 End="Yet"
  const getAnswer = async () => {
    try {
      console.log("i got: " + promts)
      const q = query(collection(db, `/userInfo/${route.params.useremail}/Answers`), where('Qnum', "==", route.params.qnum), where('Q', "==", promts))
      const data = await getDocs(q);
      const Data = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      const Exist = data.docs.map(doc => (doc.exists()))
      console.log("문서 존재 여부: " + Exist[0])

      //문서가 존재하면(답변한 적 있다면)
      if (Exist[0] === true) {
          if (Data[0].Q === promts) {
            setPromts(promts)
            setText(Data[0].A)
            setEnd("Answered")
          }

      //문서가 없다면(답변한 적 없다면)
      } else {
        setEnd("Yet")
      }
    } catch (error) {
      console.log(error)
      console.log("ERROR: user didn't write answer")
    }
  }

  //⚙️function : UpdatePoint
  //모든 Step을 완료하면(다 풀면) 점수를 얻음 (DB에 질문번호, 전략키워드, 점수를 등록)
  const updatePoint = async () => {
    const docRef = doc(db, "userInfo", route.params.useremail)
    const colRef = collection(docRef, "Points")
    await addDoc(colRef, {
      Qnum: route.params.qnum,
      strategy: route.params.strategyType,
      Points: 5
    });
    console.log("added points")
  }

  //⚙️function : GetAnswer
  //DB에서 고른 전략의 서브 질문의 정답을 갖고오고 정답/오답 판단
  const GetAnswer = async (props) => {
    const q = query(collection(db, `/QandA/${route.params.qnum}/Answers`), where('id', "==", route.params.strategyType))
    const data = await getDocs(q);
    const Data = data.docs.map(doc => ({ ...doc.data() }))
    delete Data[0].id
    const A = Data[0][route.params.promtsNum[props]]
    console.log("answer is: " + A)
    console.log("answer type is: " + typeof (A))

    if (typeof (A) == 'object') {                       //가져온 정답이 배열 형태일 경우 (DB에 방정식은 항별로 쪼개서 배열로 저장해놓았다)
      for (let i in A) {
        if (state.includes(A[i])) {
          console.log("문자열이 같습니다. 정답")
          setShow(true)
        } else {
          console.log("문자열이 같지 않습니다. 오답")
          setShow(false)
          return
        }
      }

    } else {                                            //가져온 정답이 Object 이외, 문자열 등일 경우
      if (A == "") {                                        //빈 문자열이 정답이면 무조건 정답 처리 (모든 답이 정답일 경우)
        setShow(true)
      } else if (state === A) {                              //문자열이 정답이면 문자열과 같아야 정답 처리
        setShow(true)
      } else {                                              //위의 두가지에 해당하지 않으면 오답 처리
        setShow(false)
      }
    }
  }

  //⚙️function : GetPromts
  //DB에서 서브 질문을 갖고 오는 함수
  const GetPromts = async (props) => {
    const q = query(collection(db, `/QandA/${route.params.qnum}/Promts`), where('id', "==", route.params.strategyType))
    const data = await getDocs(q);
    const Data = data.docs.map(doc => ({ ...doc.data() }))
    delete Data[0].id
    const A = Data[0][route.params.promtsNum[props]]
    const B = Data[0]
    console.log("Question is: " + A)
    console.log("Countstep: " + Object.keys(B).length)
    setCountstep(Object.keys(B).length)         //Step의 개수 업데이트 (step개수만큼 반복하기 위해)
    setPromts(A)                                //서브 질문 업데이트
    console.log("setpromts: " + promts)
  }


  //⚙️function : GetConfirmation
  //DB에서 마지막 문구를 갖고 오는 함수 
  const GetConfirmation = async (props) => {
    const data = await getDocs(collection(db, `/QandA/${route.params.qnum}/Confirmation`))
    const Data = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    delete Data[0].id
    setConfirmation(Data[0][props])
  }

  //⚙️function : addAnswer
  //DB에 사용자가 작성한 답안을 (질문번호,질문,답안,등록 시간,정답 여부)와 함께 삽입하는 함수
  const addAnswer = async (props) => {
    const q = query(collection(db, `/QandA/${route.params.qnum}/Promts`), where('id', "==", route.params.strategyType))
    const data = await getDocs(q);
    const Data = data.docs.map(doc => ({ ...doc.data() }))
    delete Data[0].id
    const A = Data[0][route.params.promtsNum[props]]
    console.log("Question is: " + A)
    setPromts(A)

    const docRef = doc(db, "userInfo", route.params.useremail)
    const colRef = collection(docRef, "Answers")
    await addDoc(colRef, {
      Qnum: route.params.qnum,  //Qnum 등록
      Q: A,                     //질문 등록
      A: state,                 //답변 등록: 공백 제거하지 않고 등록(학생의 온전한 답)
      createAt: new Date(),     //시간 등록
      isCorrect: show           //정답 여부 등록: boolean
    });
    console.log("added answer")
  }

  //♾️TFview View
  //이미 답변한 질문이면 <Done/> 컴포넌트 반환
  //정답이면  <Correct/> 컴포넌트 반환, 오답이면 <Tryagain/> 컴포넌트 반환
  const TFview = () => {
    if (End === "Answered") {
      console.log("Already answered.")
      stepCount = Countstep;
      return (<Done />)
    } else if (state === "Solving" && Countstep === stepCount) {
      return (<Done />)
    } else if (state === "Solving" || state === "initialization") {
      return (<Text style={styles.message}>Try guess the answer!🔎</Text>)
    } else {
      return (
        show ?
          (addAnswer(stepCount),
            <View>
              <Correct />
              <Button
                title="Next Step ▶️"
                onPress={() => {
                  stepCount++
                  setState("Solving")
                  setText("")
                  if (End === "Yet" && Countstep === stepCount) {
                    setUpdatePoint(true)
                  }
                  console.log("stepCount: " + stepCount)
                }}>
              </Button>
            </View>
          )
          : <Tryagain />
      )
    }
  }

//*📁Components*//
  //♾️Correct component
  //정답을 맞추면 보이는 메세지
  const Correct = () => {
    return (
      <View>
        <Text style={styles.celebrateText}>
          ✨Good Job!😆✨
        </Text>
      </View>
    )
  }

  //♾️Tryagain component
  //오답일 경우 보이는 메세지
  const Tryagain = () => {
    return (
      <View>
        <Text style={styles.TryagainText}>
          🤔 Hmm, That looks a little different.{"\n"}
          Let's try that again 💡
        </Text>
      </View>
    )
  }

  //♾️Done component
  //서브문제를 다 풀었을 경우 보이는 메세지, 버튼
  const Done = () => {
    const navigation = useNavigation();
    return (
      <View>
        <Text style={styles.celebrateText}>
          {Confirmation}
        </Text>
        <TouchableOpacity
        style={styles.button}
          onPress={() => {
            navigation.navigate("ChooseQ", {
              title: route.params.title,
              qnum: route.params.qnum,
              useremail: route.params.useremail,
              strategyType: route.params.strategyType,
              mainQ: route.params.mainQ,
              promtsNum: route.params.promtsNum
            })
          }}><Text style={styles.btntext}>Solve the another path!</Text></TouchableOpacity>
      </View>
    )
  }

//*🔊Call functions*//
  //☎️call function: 최초 1회만 실행
  useEffect(() => {
    stepCount = 0
    console.log("stepCount is:" + stepCount)
  }, [])

  //☎️call function: state가 바뀔 때 실행
  useEffect(() => {
    GetPromts(stepCount)
    if (End !== "Answered") {
      GetAnswer(stepCount)
      GetConfirmation("Confirmation" + route.params.strategyType)
    }
  }, [state])

  //☎️call function: promts가 바뀔 때 실행
  useEffect(() => {
    if (state === "initialization") {
      getAnswer();
    }
  }, [promts])

  //☎️call function: UpdatePoint가 바뀔 때 실행
  useEffect(() => {
    if (UpdatePoint === true) {
      updatePoint()
    }
  }, [UpdatePoint])
 

//*🖼️Visible screen*//
  return (
    <KeyboardAwareScrollView scrollEnabled={true} behavior='padding'>
      <View style={{ alignItems: 'center' }}>
        <View style={styles.box}>
          <Text style={styles.Header}>{route.params.title}</Text>
          <Text style={styles.text}>{route.params.mainQ}</Text>
        </View>
        <View style={styles.stepbox}>
          <Text style={styles.stepHeader}>STEP {stepCount}/{Countstep}</Text>
          <Text style={styles.steptext}>{promts}</Text>
        </View>
        {true && <TextInput
          style={styles.input}
          placeholder="Write your answer"
          value={text}
          onChangeText={(text) => {
            setText(text);
          }}
          onSubmitEditing={() => {
            setState(text.replace(" ", ""));   //공백 제거 후 등록
          }} />}
        <TFview />
      </View>
    </KeyboardAwareScrollView>
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
  stepbox: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: "#F9F8F8",
    width: 330,
    height: 150,
    backgrountRadius: 8,
    borderColor: "#C9E1FF",
    borderWidth: 3,
    borderRadius: 20,
  },
  steptext: {
    marginTop: 23,
    marginLeft: 23,
    marginRight: 23,
    fontSize: 14,
    textAlign: 'center'
  },
  stepHeader: {
    marginTop: 0,
    fontSize: 17,
    padding: 5,
    backgroundColor: "#C9E1FF",
    width: 330,
    height: 35,
    textAlign: 'center',
    fontWeight: 'bold',
    overflow: "hidden",
    backgrountRadius: 8,
    borderColor: "#C9E1FF",
    borderWidth: 1,
    borderRadius: 20,
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
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
  TryagainText: {
    backgroundColor: '#FF9A8C',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddin: 20,

  }, button: {
    backgroundColor: '#4D96FF',
    overflow: "hidden",
    backgrountRadius: 8,
    borderColor: "#4D96FF",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    width: 260,
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
export default Solve;