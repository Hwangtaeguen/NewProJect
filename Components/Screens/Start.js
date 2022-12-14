import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Button, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { addDoc, collection, doc, getDocs, query, where, getDoc, } from 'firebase/firestore';
import { db } from '../../firebase'

//*๐ฉStart View*//
const Start = (props) => {
    const [name, setName] = useState();
    const navigation = useNavigation();
    const route = useRoute();
    const UserEmail = route.params.username;

    //*function: getName
    //Auth๋ก ์ด๋ฉ์ผ์ ๋ฐ๊ณ , ์ด๋ฉ์ผ์ ํตํด ์ ์  ์ด๋ฆ์ ๊ฐ๊ณ ์ค๋ ํจ์
    const getName = async() =>{
        const data = await getDocs(collection(db, `/userInfo`));
        const Data = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        const Exist = data.docs.map(doc => (doc.exists()))
        console.log("๋ฌธ์ ์กด์ฌ ์ฌ๋ถ: " + Exist[0])
        console.log(Data)

        for(let i in Data){
            if(Data[i]["์์ด๋"] === UserEmail){
               setName(Data[i]["ํ์์ด๋ฆ"])
            }
        }
        console.log(name)
    }
    
    useEffect(()=>{
        getName()
    },[])


    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
            <View style={{ flex: 1.7 }} />
            <Text style={styles.Header}>HELLO,</Text>
            <Text style={styles.text}>{name}!</Text>
            <Image
                style={{ width: 80, height: 80, marginBottom: 30 }}
                source={require("../../assets/smiling-face.png")}>
            </Image>
            <Text style={styles.text}>PRESS THE PLAY BUTTON</Text>
            <Text style={styles.text}>TO GET STARTED!</Text>
            <TouchableOpacity
                //PLAY BUTTON, HOMEํ๋ฉด ์ ํ
                onPress={() => navigation.reset({ routes: [{ name: 'Home', params: { useremail: UserEmail, username: name } }] })}
                style={{ width: 40, height: 40, }}>
                <Image
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 100,
                        overflow: 'hidden',
                    }}
                    source={require('../../assets/play.png')}
                />
            </TouchableOpacity>
            <View style={{ flex: 1.7 }} />
        </View>

    );
}

//โจ์คํ์ผ ์ํธ
const styles = StyleSheet.create({
    Header: {
        flex: 0.5,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 0,
    },
    text: {
        flex: 0.5,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 28,
        fontWeight: 'bold'
    },
});

export default Start;