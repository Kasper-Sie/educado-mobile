import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { useFonts, VarelaRound_400Regular } from '@expo-google-fonts/dev'
import { useNavigation } from '@react-navigation/native'

export default function ActiveExploreCard({ key, title, courseId, uri }) {
  const navigation = useNavigation()
  let [fontsLoaded] = useFonts({
    VarelaRound_400Regular
  })
  return (
    <Pressable
      style={{ shadowColor: 'black', elevation: 10 }}
      className="w-2/5 h-24 rounded-md items-center flex-col bg-lime-300 m-2"
      onPress={() => navigation.navigate('Course', { courseId: courseId })}
    >
      <Text style={{ fontFamily: 'VarelaRound_400Regular' }} className="pt-4">
        {title}
      </Text>
      <View className="pt-2">
        <Image className="w-10 h-10" source={{ uri: uri }}></Image>
      </View>
    </Pressable>
  )
}
