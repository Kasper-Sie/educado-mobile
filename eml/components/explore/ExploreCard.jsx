import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Collapsible from "react-native-collapsible";
import UpdateDate from "./ExploreUpdate";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CardLabel from "./CardLabel";
import CustomRating from "./CustomRating";
import SubscriptionButton from "./SubscriptionButton";
<<<<<<< Updated upstream
import AccessCourseButton from "./AccessCourseButton";
=======
import AccesCourseButton from "./AccesCourseButton";
import { determineCategory, determineIcon, getDifficultyLabel, getUpdatedDate } from "../../services/utilityFunctions";
>>>>>>> Stashed changes

export default function ExploreCard({ course, isPublished, subscribed }) {
  const [isCollapsed, setIsCollapsed] = useState(true);


  return isPublished ? (
    <Pressable
      className=" bg-projectWhite rounded-lg shadow-2xl mb-4 mx-4 p-6 overflow-hidden"
      onPress={() => setIsCollapsed(!isCollapsed)}
    >
      <View className="flex-col items-center">
        <View className="flex-row justify-between w-full items-center">
          <Text className="text-black font-medium text-lg">{course.title}</Text>
          <MaterialCommunityIcons
            name={isCollapsed ? "chevron-down" : "chevron-up"}
            size={25}
            color="gray"
          />
        </View>

        <View className="h-1 border-b-[1px] w-full border-gray opacity-50 pt-2"></View>

        <View className="w-full h-[0.5] bg-gray-500 opacity-50 pt-2" />
        <View className="flex-row justify-between w-full items-start">
          <View className="flex-col items-start justify-between">
            <View className="flex-row items-center justify-start pb-2 flex-wrap">
              <CardLabel
                title={determineCategory(course.category)}
                time={false}
                icon={determineIcon(course.category)}
              />
              <View className="w-2.5" />
              <CardLabel
                title={course.estimatedHours}
                time={true}
                icon={"clock-outline"}
              />
              <View className="w-2.5" />
              <CardLabel
                title={getDifficultyLabel(course.difficulty)}
                time={false}
                icon={"book-multiple-outline"}
              />
            </View>
            <View className="h-1.25 opacity-50" />
            <CustomRating rating={course.rating} />

          </View>

        </View>

      </View>


      <Collapsible className="w-full" collapsed={isCollapsed}>
        <View className="py-7 flex-row items-center justify-between px-1">
            <Text className="text-black text-m">{course.description}</Text>
        </View>

        <View>
            {
              subscribed ? (
                <AccessCourseButton course={course} />
              ) : (
                <SubscriptionButton course={course} />
              )
            }
          <UpdateDate dateUpdated={getUpdatedDate(course.dateUpdated)} />
        </View>

      </Collapsible>
      <View className=" items-start absolute">
        <View className=" rotate-[315deg] items-center">
          {subscribed ? (
            <Text className=" bg-yellow text-xs text-white font-bold px-8 -left-8 -top-4 drop-shadow-sm">
              Inscrito
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  ) : null;
}
