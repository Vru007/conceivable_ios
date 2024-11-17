import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRing } from '../../hooks/ringHook';
const { width, height } = Dimensions.get('window');

export default function RingPage() {
  const [progress, setProgress] = useState(20);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const router = useRouter();
  // const { isConnected, ringData, error, startScan, stopScan } = useRing();
  // Texts and images corresponding to each screen
  const texts = [
    {
      mainText: "Pair your Smart Ring With App",
      subText: "Please make sure your ring close to your phone and the phone bluethooth is on, then use the App to search for your ring and Pair it.",
      image: require('../../assets/1.png')
    },
    {
      mainText: "Explore your Smart Ring",
      subText: "Please wear your ring every day to explore all kinds of vital monitors for better healthy lifestyle.",
      image: require('../../assets/3.png')
    },
    {
      mainText: "Charge to Activate your Smart ring",
      subText: "Before first use, please charge to activate your ring. the LED indicator will light in green upon successful activation",
      image: require('../../assets/2.png')
    },
    {
      mainText: "Hold your Ring close to your smartphone and click the button below. make sue the phone's Bluetooth is enable",
      subText: "Note:  The Default factory setting of your ring is hibernation mode. before paring , make sure the ring is fully charged and Bluetooth is enable.",
      image: require('../../assets/4.png')
    }
  ];

  const homeScreen = () => {
    router.push('/sign-in');
  };

  const mainHome = () => {
    router.push('/home')
  }

   const RingConnect = async () => {
  //   // Start scanning for the ring
  //   await startScan();

  //   // Add your logic to connect the ring here
  //   if (isConnected) {
  //     console.log('Ring is connected:', ringData);
  //   } else {
  //     console.log('Error connecting the ring:', error);
  //   }

  //   // Stop scanning when the connection is established or an error occurs
  //   stopScan();
  }

  const nextScreen = () => {
    if (currentTextIndex < texts.length - 1) {
      setCurrentTextIndex(prev => prev + 1);
      setProgress(prev => Math.min(prev + 25, 100));
    } else {
      router.push('/questionbot');
    }
  };

  useEffect(() => {
    if (progress >= 100) {
      homeScreen();
    }
  }, [progress]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#011F25' }}>
      <View className="mt-10 px-2" style={{ flex: 1 }}>
        {/* Progress Bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, zIndex: 10 }}>
          <View style={{ width: '90%', height: 4, backgroundColor: '#333', borderRadius: 2 }}>
            <View
              style={{
                height: 4,
                backgroundColor: 'white',
                borderRadius: 2,
                width: `${progress}%`,
              }}
            />
          </View>
        </View>

        {/* Main Text */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
            {texts[currentTextIndex].mainText}
          </Text>
          {texts[currentTextIndex].subText ? (
            <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
              {texts[currentTextIndex].subText}
            </Text>
          ) : null}
        </View>

        {/* Image Background and Button */}
        <ImageBackground
          source={texts[currentTextIndex].image}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: 20,
          }}
          resizeMode="cover"
        >
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={progress >= 90 ? RingConnect : mainHome}
              style={{
                backgroundColor: 'rgba(236, 72, 153, 0.9)', // semi-transparent pink
                padding: 16,
                borderRadius: 12,
                width: width * 0.5,
                alignSelf: 'center',
                marginTop: 'auto',
              }}
            >
              <Text style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 'semi-bold',
              }}>
                {progress >= 90 ? 'Connect Ring' : 'Don\'t have a Ring'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={nextScreen}
              style={{
                backgroundColor: 'rgba(236, 72, 153, 0.9)', // semi-transparent pink
                padding: 16,
                borderRadius: 12,
                width: width * 0.4,
                alignSelf: 'center',
                marginTop: 'auto',
              }}
            >
              <Text style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 'semi-bold',
              }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}