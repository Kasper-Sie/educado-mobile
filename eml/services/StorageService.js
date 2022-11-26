import * as api from '../api/api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DirectoryService from '../services/DirectoryService';

const TEST_COURSE = '@testCourse';
const COURSE_LIST = '@courseList';

export const getTestCourseFromApi = async () => {

    try {

        let localCourse = JSON.parse(await AsyncStorage.getItem(TEST_COURSE));

        if (localCourse == null) {

            return await api.getTestCourse().then(

                async testCourse => {
                    testCourse.data.sections[0].exercises[0].content.url = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4";
                    let course = JSON.stringify(testCourse);
                    await AsyncStorage.setItem(TEST_COURSE, course);
                    return course;
                }
            );
        } else return localCourse;

    } catch (e) {
        console.error(e);
    }
}

export const getCourseList = async () => {

    try {

        // Check if the course list is already downloaded
        let courseList = JSON.parse(await AsyncStorage.getItem(COURSE_LIST));

        if (courseList == null) {
            //should be changed to new api method with auth
            return await api.getCourses().then(

                async list => {

                    let newCourseList = [];

                    for (const course of list.data) {

                        const courseId = course.id;

                        const localCourse = JSON.parse(await AsyncStorage.getItem(courseId));

                        // Make new list with member isDownloaded
                        newCourseList.push({
                            title: course.title,
                            courseId: course.id,
                            iconPath: course.category.icon, //Icon should be downloaded too
                            categoryId: course.category.id,
                            isActive: localCourse !== null,
                        });
                    }

                    // Save new courseList for this key and return it.
                    await AsyncStorage.setItem(COURSE_LIST, JSON.stringify(newCourseList));
                    return newCourseList;
                }

            );

        } else return courseList;

    } catch (e) {
        console.error(e);
    }

}
export const getCourseById = async (courseId) => {

    try {

        const course = JSON.parse(await AsyncStorage.getItem(courseId));

        if (course == null) {

            return await api.getCourse(courseId).then(
                async requestedCourse => {
                    let courseContent = [];


                    courseContent.title = requestedCourse.data.title;

                    for (const section of requestedCourse.data.sections) {

                        let currentSection = {
                            sectionId: section.id,
                            isComplete: false,
                            sectionNumber: section.sectionNumber,
                            exercises: []
                        }
                        let exerciseContent = [];
                        for (const exercise of section.exercises) {
                            let currentExercise = {
                                obj: exercise,
                                isComplete: false
                            }

                            exerciseContent.push(currentExercise)
                        }

                        currentSection.exercises = exerciseContent;

                        courseContent.push(currentSection);
                        await AsyncStorage.setItem(section.id, JSON.stringify(currentSection));
                    }
                    //courseContent.SortBy(courseContent.sectionNumber);

                    await AsyncStorage.setItem(courseId, JSON.stringify(courseContent));
                    return courseContent;
                }
            );

        } else return course;
    } catch (e) {
        console.error(e);
    }

}

export const updateCompletionStatus = async (sectionId, exerciseId) => {
    try {
        let section = JSON.parse(await AsyncStorage.getItem(sectionId));

        if (section !== null && exerciseId != null) {
            for (const ex of section.exercises) {
                if (ex.obj.id == exerciseId && ex.isComplete != true) {
                    ex.isComplete = true;
                    break;
                }
            }

        } else if (exerciseId == null) {
            section.isComplete = true
        } else {
            // explode
        }
        await AsyncStorage.setItem(sectionId, JSON.stringify(section));
    } catch (e) {
        console.error(e);
    }
}

export const getNextExercise = async (sectionId) => {
    try {
        let currentSection = JSON.parse(await AsyncStorage.getItem(sectionId))

        for (const exercise of currentSection.exercises) {
            if (!exercise.isComplete) {
                return exercise;
            }
        }

    } catch (e) {
        console.error(e);
    }
}

export const downloadCourse = async (courseId) => {

    if (courseId !== undefined) {

        try {

            const course = JSON.parse(await AsyncStorage.getItem(courseId));

            if (course !== null) {

                const courseDirectory = course.data.title;
                const category = course.data.category.name;
                const icon = course.data.category.icon;
                const sections = course.data.sections;

                //making directory for the course
                await DirectoryService.CreateDirectory(courseDirectory);

                //downloading the icon for the course
                await DirectoryService.DownloadAndStoreContent(icon, courseDirectory, category)
                    .then(localUri => {
                        course.data.category.icon = localUri;
                    })
                    .catch(error => { console.log(error) });

                //downloading each video of the exercises and storing in their respective sections
                for (const section of sections) {

                    const sectionDirectory = courseDirectory + '/' + sections.title;
                    await DirectoryService.CreateDirectory(sectionDirectory);

                    for (const exercise of section) {

                        const url = exercise.content.url;

                        await DirectoryService.DownloadAndStoreContent(url, sectionDirectory, exercise.title)
                            .then(localUri => {
                                exercise.content.url = localUri;
                            })
                            .catch(error => { console.log(error); });
                    }
                }

                //store the downloaded course back in the AsyncStorage
                await AsyncStorage.setItem(courseId, JSON.stringify(course));

            } else {
                return console.log("error: course not found!");
            }

        } catch (e) {
            console.error(e);
        }

    } else console.log("error: course id is not defined!");
}

//getSectionList(course-id)
//getSectionById(section-id)
//getExerciseList(section-id)
//getNextExerciseBySectionId(section-id)
//getWrongFeedback(exercise-id)

//updateExercise(exercise-id)

/*
 {
  "on_wrong_feedback": {
    "type": "video",
    "uri": "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
  }
}
 */

//Icon also should be downloaded

//When Logout: back button should be disabled!!!!
