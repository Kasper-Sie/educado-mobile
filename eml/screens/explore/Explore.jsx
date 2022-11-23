import React, { useEffect, useState } from 'react'
import { View, Text, Platform, ScrollView } from 'react-native'
import { useFonts, VarelaRound_400Regular } from '@expo-google-fonts/dev'
import { AppLoading } from 'expo-app-loading'
import { SelectList } from 'react-native-dropdown-select-list'
import ActiveExploreCard from '../../components/explore/ActiveExploreCard'
import ExploreCard from '../../components/explore/ExploreCard'
import * as StorageService from '../../services/StorageService'

export default function Explore() {

    const [selected, setSelected] = useState(-1);

    const [views, setViews] = useState([]);

    const uniqueCategories = [{ key: 1, value: "Cleaning" }, { key: 2, value: "Health" }, { key: '6368be5d71e079ae8d537eb1', value: "Personal Finance" }]

    const [fontsLoaded] = useFonts({
        VarelaRound_400Regular
    })

    useEffect(() => {
        async function loadViews() {
            const courseList = await StorageService.getCourseList();
            const componentPromises = courseList.map(({ title, iconPath, isActive, courseId, categoryId }, index) => {
                if ((isActive && categoryId === selected) || (isActive && selected === -1)) {
                    return <ActiveExploreCard key={index} title={title} courseId={courseId} iconPath={iconPath} />;
                } else if ((!(isActive) && categoryId === selected) || (!(isActive) && selected === -1)) {
                    return <ExploreCard key={index} title={title} courseId={courseId}></ExploreCard>
                }
            });
            Promise.all(componentPromises).then(setViews);
        }
        loadViews();

    }, [selected])


    if (!fontsLoaded) {
        return AppLoading
    } else {
        return (
            <View className="bg-babyBlue basis-full flex">
                <View className="basis-1/6" style={{ justifyContent: 'center', alignItems: 'center', paddingTop: Platform.OS === 'android' ? 20 : 0 }}>
                    <Text style={{ fontSize: 40, fontFamily: 'VarelaRound_400Regular' }} className="text-gray-600"> Educado</Text>
                </View>
                <View style={{ elevation: 15, zIndex: 15 }} className="w-11/12 self-center pb-4">
                    <SelectList
                        setSelected={(val) => setSelected(val)}
                        data={uniqueCategories}
                        search={false}
                        dropdownStyles={{ backgroundColor: '#CFE9EF' }}
                        save="key"
                        label="catagories"
                        placeholder='Filter by'
                    />
                </View>
                <ScrollView>
                    <View className="grid grid-cols-2 grid-flow-col flex-wrap flex-row flex-1 justify-evenly">
                        {views}
                    </View>
                </ScrollView>
            </View>
        )
    }
}
