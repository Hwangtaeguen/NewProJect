import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Start from '../Screens/Start.js';
import Home from '../Screens/Home.js';
import StartQ from '../Screens/StartQ.js';
import ChooseQ from '../Screens/ChooseQ.js';
import Logins from '../Screens/Login.js';
import Signup from '../Screens/Signup.js';
import Solve from '../Screens/Solve.js'

const Stack = createStackNavigator()
const Navi = ()=>{
    return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
         <Stack.Screen  name = "Login" component={Logins}/>
        <Stack.Screen  name = "Signup" component={Signup}/>
        <Stack.Screen  options={{ headerShown: false }} name = "Start" component={Start}/>
        <Stack.Screen  name = "Home" component={Home}/>
        <Stack.Screen name = "ChooseQ" component={ChooseQ}/>
        <Stack.Screen name = "StartQ" component={StartQ}/> 
        <Stack.Screen name = "Solve" component={Solve}/>
      </Stack.Navigator>
    </NavigationContainer>
    );
}

export default Navi;