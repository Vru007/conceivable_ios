import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import CircularProgressBar from '../../components/progressBar.jsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getScores } from '../../api/scores.jsx';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../context/authContext';

const ProgressPage = () => {
  const { currentuser } = useContext(AuthContext);
  const [selectedScore, setSelectedScore] = useState({
    name: 'Conceivable',
  });
  
  const router=useRouter();
  
  console.log("currentuse: ",currentuser);
  console.log("index: ",currentuser.index);
  const [scores, setScores] = useState({
    Conceivable: 10,
    Energy: 50,
    Blood: 80,
    Hormones: 60,
    HRV: 70,
    'Vo2 Max': 50,
    'Blood sugar': 50,
    Sleep: 50,
    Stress: 40,
    steps: 30
  });
  const [apiScores, setApiScores] = useState({
    scores: {
      createdAt: -1,
      temperature: -1,
      blood: -1,
      hormones: -1,
      energy: -1,
      stress: -1
    },
    conceivableScore: {
      all: [],
      thisMonthConceivableScore: -1,
      firstMonthConceivableScore: -1,
      averageConceivableScore: -1
    }
  });


  const dailyEngagementItems = [
    { name: 'Energy', icon:require('../../assets/energy.png') }, 
    { name: 'Blood', icon: require('../../assets/blood.png')}, 
    { name: 'Hormones', icon: require('../../assets/hormone.png') }, 
    { name: 'HRV',icon: require('../../assets/heart.png')}, 
    { name: 'Vo2 Max', icon: require('../../assets/spo2.png') }, 
    { name: 'sugar', icon: require('../../assets/sugar.png') }, 
    { name: 'Sleep', icon: require('../../assets/sleep.png') }, 
    { name: 'Stress', icon: require('../../assets/stress.png') },
    { name: 'steps', icon: require('../../assets/steps.png') },
  ];

  const handleItemPress = (item) => {
    setSelectedScore({
      name: item.name,
      value: scores[item.name]
    });
  };

  const handleAnalyze = () => {
    setSelectedScore({
      name: 'Conceivable',
      value: scores.Conceivable
    });
  };
 
  const handlePress=()=>{
    console.log("presses: ");
    router.push('/questionbot');
  }
  
    const fetchScores = async () => {
      try {
        const response = await getScores();
        setApiScores(response);
        
        // Update the frontend scores with API data where applicable
        setScores(prevScores => ({
          ...prevScores,
          Energy: response.scores.energy !== -1 ? response.scores.energy : prevScores.Energy,
          Blood: response.scores.blood !== -1 ? response.scores.blood : prevScores.Blood,
          Hormones: response.scores.hormones !== -1 ? response.scores.hormones : prevScores.Hormones,
          Stress: response.scores.stress !== -1 ? response.scores.stress : prevScores.Stress,
          Conceivable: response.conceivableScore.thisMonthConceivableScore !== -1 
            ? response.conceivableScore.thisMonthConceivableScore 
            : prevScores.Conceivable
        }));
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

  

  useFocusEffect(
    React.useCallback(() => {
      fetchScores();  
      handleAnalyze(); 
    }, []) // Empty dependency array since we want it to run every time the screen is focused
  );

  return (
    <SafeAreaView className="flex-grow bg-[#011F25] px-6">
    
    {currentuser.index!=8 && <View>
       
      <Text className="text-white"></Text>
       <TouchableOpacity onPress={()=>handlePress()} className="rounded-lg p-4 border border-[#0097A0] mt-4 "><Text className="text-white">Click to start Fetching</Text></TouchableOpacity>
      </View>}
      
      {currentuser.index===8 &&
      <View>
    
      <Text className="text-white font-semibold text-2xl pb-2 ">Progress</Text>
      <ScrollView showsVerticalScrollIndicator={false} className="mb-24" >
     <View style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }} className="bg-[rgba(0, 151, 160, 0.1)] mt-5 rounded-lg">
      <View className="items-center mb-6 ">
       <View style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }} className="bg-[rgba(0, 151, 160, 0.1)] rounded-full" ><View className="bg-[rgba(0, 151, 160, 0.5)] rounded-full p-2"><CircularProgressBar percentage={selectedScore.value} radius={120} strokeWidth={20}  /></View></View>
        <Text className="text-2xl text-pink-400 mt-4 font-semibold">{selectedScore.name} Score</Text>
      </View>
      </View>
      <View className="my-6">
        <Text className="text-white mb-5 font-semibold text-lg">Daily Engagement</Text>
        <View className="flex-row flex-wrap justify-between">
          {dailyEngagementItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
              className={`w-[30%] py-5 px-4 rounded-lg items-center mb-4 ${
                selectedScore.name === item.name ? "border border-[#0097A0]" : ""
              }`}
            //   className={`bg-[#003B45] py-4 px-5 rounded-lg items-center mx-1 flex-1 ${
            //     stressLevel === "Low" ? "border border-[#0097A0]" : ""
            //   }`}
              onPress={() => handleItemPress(item)}
            >
            <Image style={{width:32, height:32}} source={item.icon}></Image>
              <Text className={`text-sm mt-2 ${
                selectedScore.name === item.name ? "text-white" : "text-[#00D7C3]"
              }`}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity className="bg-pink-400 rounded-lg py-4 mb-6" onPress={handleAnalyze}>
        <Text className="text-center text-white text-lg">Analyse</Text>
      </TouchableOpacity>
      </ScrollView>
      </View>
        }
    </SafeAreaView>
  );
};

export default ProgressPage;
