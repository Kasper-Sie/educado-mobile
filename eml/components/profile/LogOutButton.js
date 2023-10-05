import { View, TouchableOpacity, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LOGIN_TOKEN = '@loginToken'
const USER_INFO = '@userInfo'

export default function LogOutButton(props) {
  const navigation = useNavigation()

  async function logOut() {
    try {
      await AsyncStorage.removeItem(LOGIN_TOKEN).then((r) => {
        console.log('User logged out successfully!')
        navigation.navigate('LoginStack')
      })
    } catch (e) {
      console.log(e)
    }
  }

  const logoutAlert = () =>
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      {
        text: 'Não',
        onPress: () => console.log('No Pressed'),
        style: 'cancel'
      },
      { text: 'Sim', onPress: logOut }
    ])

  return (
    <View className="flex-row items-center justify-end px-6 mt-[-40%] mb-[20%]">
      <TouchableOpacity className="bg-[#dc2626] items-center py-2 pl-1 rounded-medium w-[15%]" onPress={logoutAlert}>
        <View>
          <MaterialCommunityIcons
            name="logout"
            size={40}
            color="white"
            testID={props.testID}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}