import { View, Button, Text, TextInput, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';

//기본 화면 컴포넌트
const Main = (props) =>{
return(
<View style={{alignItems:'center'}}>
        <View style={styles.box}>
            <Text>
                Todd orders pictures from a photographer.
                Each picture costs $7.50.
                A one-time shipping fee of $3.25 is added
                to the cost of the order.
                The total cost of Todd’s order before tax is $85.75.

                How many pictures did Todd order?
            </Text>
        </View>
        <Text style={{marginTop:20}}>OK. Using p to represent the number of pictures, write an equation that represents how p, $7.50 per picture, and the $3.25 shipping fee combine to make $85.75</Text>
        <TextInput 
        style={{marginTop:20}} placeholder="Write your answer" value={props.text}
        onChangeText={(text)=>{
          props.setText(text); 
        }}
        onSubmitEditing={
          ()=>props.setmode("Answer")
        }
        />
</View>
)}
//위에 정답인지 아닌지 구별하는 기능 필요. 

const Bar = (props) => {
    return(
        <TouchableOpacity
         style={{width:300,height:50,alignItems:'center',backgroundColor: '#3498db',
         padding: 16,
         margin: 10,
         borderRadius: 8,
         }}
         onPress={()=>props.nav("Solve")}>
        <Text>{props.contents}</Text>
        </TouchableOpacity>
    )
}

//축하메시지와 버튼 컴포넌트
const Celebrate = (props) => {
    return(
    <View>
      <Text style = {{backgroundColor:'#b7f4d8', textAlign:'center', fontSize:20, fontWeight:'bold'}}>
        ✨Good Job!😆✨
      </Text>
      <Button title="To the next!😎" onPress={() => {props.setmode("Question"), props.setText(""), console.log(props.stepCount)}}></Button>
    </View>
    )}
  
//정답이 아닐때 띄우는 메세지와 다시 정답을 제출하는 버튼
const Tryagain = (props) => {
  return(
  <View>
    <Text style = {{backgroundColor:'#b7f4d8', textAlign:'center', fontSize:20, fontWeight:'bold'}}>
      ✨Good Job!😆✨
    </Text>
    <Button title="Let's solve it!" onPress={() => props.nav("ChooseQ")}></Button>
  </View>
  )}


//Step완료시 완료 메시지와 버튼 컴포넌트
const Complete = (props) => {
    return(
    <View>
      <Text style = {{backgroundColor:'#b7f4d8', textAlign:'center', fontSize:20, fontWeight:'bold'}}>
        ✨Good Job!😆✨
      </Text>
      <Button title="Solve the another path😸" onPress={() => props.nav("ChooseQ")}></Button>
    </View>
)}

//step관리 변수,
let stepCount = 0;
//*Solve VIEW*//
const Solve = (props) => {
    const [text, setText] = useState("");
    const [mode, setmode] = useState("Question");   
    let content = null;
    
    const nav = (ScreenName) => {props.navigation.navigate(ScreenName)}
         //모드별 화면
         //mode 'Question': 기본 화면
         if(mode === "Question"){
            if(stepCount==2){
                content =
                <View>
                    <Main text={text} setText={setText} mode={mode} setmode={setmode}/>
                    <Complete nav={nav}/>
                </View>
            }else{
            content = 
            <View>
                <Main text={text} setText={setText} mode={mode} setmode={setmode}/>
            </View>
            }
          //mode 'Answer': 메시지, 버튼 추가
          }else if(mode === "Answer"){
            stepCount = stepCount + 1;
            content = 
            <View>
                <Main text={text} setText={setText} mode={mode} setmode={setmode}/>
                <Celebrate text={text} setText={setText} mode={mode} setmode={setmode} stepCount={stepCount}/>
            </View>
          }else if(mode === "TryAgain"){
            stepCount = stepCount + 1;
            content = 
            <View>
                <Main text={text} setText={setText} mode={mode} setmode={setmode}/>
                <Tryagain text={text} setText={setText} mode={mode} setmode={setmode} stepCount={stepCount}/>
            </View>
          }
        //보여지는 화면
        return(content)
}

//스타일시트
const styles = StyleSheet.create({
  box: {
    marginTop:20,
    justifyContent:'space-around',
    alignItems:'center',
    backgroundColor: "#fff",
    width: 300,
    height: 200,
  },
});


export default Solve;