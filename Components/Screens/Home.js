import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Button, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import { async } from '@firebase/util';
import { addDoc, collection, doc, getDocs, query, where, getDoc, } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase'

//📁이미지 URL 객체
const imageURL = {
    'Jennifer': require("../../assets/curtain.png"),
    'Todd': require("../../assets/picture.png"),
    'Jen': require("../../assets/run.png"),
    'Ava': require("../../assets/shape.png"),
    'Mario': require("../../assets/tent.png"),
    'Jim': require("../../assets/car.png"),
    'Owen': require("../../assets/bush.png"),
    'Elena': require("../../assets/poker-cards.png")
}

//📁Qnum 배열
const Qnums = {
    1: "Q1",
    2: "Q2",
    3: "Q3",
    4: "Q4",
    5: "Q5",
    6: "Q6",
    7: "Q7",
    8: "Q8"
}

//📁Qnum 배열
const Points = {
    Q1: 0,
    Q2: 0,
    Q3: 0,
    Q4: 0,
    Q5: 0,
    Q6: 0,
    Q7: 0,
    Q8: 0
}

//*🚩HOME VIEW*//
const Home = (props) => {
    const [mypoints, setMypoints] = useState();
    const [forRender, setRender] = useState();
    const auth = getAuth();
    const navigation = useNavigation();
    const route = useRoute();


    //⚙️function: getPoints
    //유저의 전체 점수와 각 전략별 점수를 갖고 오는 함수
    const getPoints = async () => {
        const data = await getDocs(collection(db, `/userInfo/${route.params.useremail}/Points`));
        const Data = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        const Exist = data.docs.map(doc => (doc.exists()))
        console.log("문서 존재 여부: " + Exist[0])

        if (Exist[0] === true) {
            setMypoints(5 * Data.length)                //문서 개수 * 5 = 전체 점수 

            for (let i in Data) {                       //각 전략별 점수 배열에 할당
                for (let j in Qnums) {
                    if (Data[i].Qnum === Qnums[j]) {
                        Points[Qnums[j]] += 5
                        console.log(Points)
                    }
                }
            }
            setRender(Points)
            console.log(Points)
        } else {
            console.log("There aren't points")
        }
    }

    //⚙️function: initPoints
    //로그아웃 시 Poins객체 초기화
    const initPoints = () => {
        for (let i in Points) {
            Points[i] = 0;
        }
        console.log("Points초기화")
        console.log(Points)
    }

    //☎️call function
    useEffect(() => {
        initPoints()
        getPoints()
    },[forRender])

    //*♾️Choose View*//
    //TouchableOpacity(클릭에 반응하는) 캐릭터 생성 컴포넌트
    const Choose = (props) => {
        const UserEmail = route.params.useremail;
        return (
            <TouchableOpacity
                onPress={() => {
                    return (navigation.navigate("StartQ",
                        {
                            title: props.title,
                            qnum: props.qnum,
                            useremail: UserEmail
                        }))
                }}
                style={{ alignItems: 'center' }}>
                <Image
                    style={styles.image}
                    source={imageURL[props.name]}
                />
                <Text style={styles.text}>{props.title}</Text>
                <Text style={styles.points}>points {Points[props.qnum]}/15</Text>
            </TouchableOpacity>
        );
    }

    //*🖼️Visible screen*//
    return (
        <View style={styles.HomeView}>
            <View style={{ flexDirection:'row'}}>
                <TouchableOpacity style={styles.button} onPress={() => { setRender(Date()) }}><Text style={styles.btntext}>Reset Points</Text></TouchableOpacity>
                <TouchableOpacity style={styles.logout} onPress={() => { initPoints(); signOut(auth); navigation.reset({ routes: [{ name: 'Login' }] }); }}><Text style={styles.btntext}>Logout</Text></TouchableOpacity ></View>
            <ScrollView>
                <View style={{ padding: 20 }} />
                <View style={{
                    flex: 0.3,
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}>
                    <Image
                        style={{ width: 40, height: 40, marginBottom: 20 }}
                        source={require("../../assets/smiling-face.png")} />
                    <Text style={{ flex: 1, fontSize: 25, fontWeight: 'bold' }}>CHOOSE WHAT YOU WANT!</Text>
                    <Text style={styles.mypoints}>{route.params.username} POINTS: {mypoints} / 120</Text>

                </View>
                <View style={styles.Character}>
                    <Choose name='Todd' title="Todd's order" qnum="Q1" />
                    <Choose name='Jen' title="Jen's running goal" qnum="Q2" />
                </View>
                <View style={styles.Character}>
                    <Choose name='Jennifer' title="Jennifer's curtains" qnum="Q3" />
                    <Choose name='Elena' title="Elena's cardgame" qnum="Q4" />
                </View>
                <View style={styles.Character}>
                    <Choose name='Mario' title="Mario's camping" qnum="Q5" />
                    <Choose name='Ava' title="Ava's rectangle" qnum="Q6" />
                </View>
                <View style={styles.Character}>
                    <Choose name='Jim' title="Jim's rent Car" qnum="Q7" />
                    <Choose name='Owen' title="Owen's garden" qnum="Q8" />
                </View>
                <View style={{ padding: 50 }}></View>
            </ScrollView>
        </View>

    );
}


//✨스타일 시트
const styles = StyleSheet.create({
    HomeView: {
        flex: 1,
        paddind: 20,
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    Character: {
        marginTop: 50,
        marginBottom: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    text: {
        flex: 1,
        padding: 5,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: "#F9F8F8",
        overflow: "hidden",
        backgrountRadius: 8,
        borderColor: "#F9F8F8",
        borderWidth: 1,
        borderRadius: 8
    },
    image: {
        width: 80,
        height: 80,
        overflow: 'hidden',
        marginBottom: 10,

    },
    points: {
        flex: 1,
        padding: 5,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: "#C1F4C5",
        overflow: "hidden",
        backgrountRadius: 8,
        borderColor: "#C1F4C5",
        borderWidth: 1,
        borderRadius: 8
    },
    mypoints: {
        flex: 1,
        padding: 5,
        marginTop: 20,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#FFF',
        overflow: "hidden",
        backgrountRadius: 8,
        borderColor: "#FFF",
        borderWidth: 1,
        borderRadius: 8,
        color: "#393E46"

    }, button: {
        backgroundColor: '#FFBF00',
        overflow: "hidden",
        backgrountRadius: 8,
        borderColor: "#FFBF00",
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        width: 165,
        height: 40,
        margin:11,
        justifyContent:'center',
        alignContent:'center',

    }, btntext: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#FFF",
        

    }, logout: {
        backgroundColor: '#4D96FF',
        overflow: "hidden",
        backgrountRadius: 8,
        borderColor: "#4D96FF",
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        width: 165,
        height: 40,
        margin:11,
        justifyContent:'center',
        alignContent:'center',
    },
});

export default Home;