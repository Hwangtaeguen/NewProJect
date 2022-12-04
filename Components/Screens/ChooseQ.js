import { View, Button, Text, TextInput, StyleSheet, Image, TouchableOpacity  } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../../firebase';
import { addDoc, collection, doc, getDocs } from 'firebase/firestore';

//*🚩ChooseQ VIEW*//
const ChooseQ = (props) => {
  return (
    <View>
      <Main />
    </View>
  )
}

//*♾️Main View*//
const Main = (props) => {
  const [strA, setStrA] = useState();
  const [strB, setStrB] = useState();
  const [strC, setStrC] = useState();
  const [mainQ, setmainQ] = useState();
  const route = useRoute()
  const Qname = route.params.qnum
  const strategy = {};

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

  //⚙️function : Getstrategy
  //DB에서 전략내용을 갖고 오는 함수
  const Getstrategy = async () => {
    try {
      const data = await getDocs(collection(db, `/QandA/${Qname}/Strategys`))
      const Data = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      delete Data.id
      console.log(Data)
      setStrA(Data[0].StrategyA)
      setStrB(Data[0].StrategyB)
      setStrC(Data[0].StrategyC)
      //strategy=Data;
    } catch (error) {
      console.log(error.massage)
    }
  }


  //함수호출
  useEffect(() => {
    Getstrategy();
    GetQ();
  }, []);

  //보여지는 화면
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.box}>
        <Text style={styles.Header}>{route.params.title}</Text>
        <Text style={styles.text}>{mainQ}</Text>
      </View>
      <Text style={{ marginTop: 25, marginBottom:10, fontSize: 20, fontWeight:'bold' }}>Which stratege do you want to try?</Text>
      <Bar contents={strA} strategyType='A' promtsNum={["A1","A2","A3","A4"]} mainQ={mainQ}></Bar>
      <Bar contents={strB} strategyType='B' promtsNum={["B1","B2","B3","B4"]} mainQ={mainQ}></Bar>
      <Bar contents={strC} strategyType='C' promtsNum={["C1","C2","C3","C4"]} mainQ={mainQ}></Bar>
    </View>
  )
}

//*♾️Bar Component*//
//Bar: 전략선택 Touchableopacity 컴포넌트
const Bar = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        style={styles.bar}
        onPress={() => navigation.navigate("Solve",
          {
            title: route.params.title,
            qnum: route.params.qnum,
            useremail: route.params.useremail,
            strategyType: props.strategyType,
            mainQ: props.mainQ,
            promtsNum: props.promtsNum
          })}>
        <Text style={styles.bartext}>{props.contents}</Text>
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
  bar: {
    width: 330,
    height: 80,
    alignItems: 'center',
    backgroundColor: '#A4CCFF',
    padding: 16,
    margin: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignContent: 'center'
  },
  bartext: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default ChooseQ;