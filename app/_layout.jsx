// import 'react-native-gesture-handler';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { useRouter, useRootNavigationState } from 'expo-router';
import Header from '../components/header';
import { AuthContext, AuthProvider } from '../context/authContext';
import { SocketProvider } from '../context/SocketContext';
import DrawerContent from '../components/DrawerContent';


const NavigationContent = () => {
  
  const { isAuthenticated, loading, ring, currentuser,getUser } = useContext(AuthContext);
  const rootNavigationState = useRootNavigationState();
  const router = useRouter();
  // const subscribed=currentuser.hasSubscribed;
  //ad the functioncality like the user hassubscribed stae 
  //is logged first call the getUser function to get the state
  // and then redirect accoding to that stata add the loader of 2 sec 
  //along with the user state for smooth transition
// console.log("auth: ", isAuthenticated);
// console.log("ring:", ring);
// console.log("key: ",!rootNavigationState?.key);
// console.log("load: ",loading);
  useEffect(() => {
    // Ensure all states are initialized before attempting navigation
    getUser();
    if (!loading && rootNavigationState?.key && isAuthenticated !== undefined && ring !== undefined) {
      if (isAuthenticated && ring) {
        router.push('/home');  // Use push instead of replace
      }
      else if (isAuthenticated && !ring)
       {
        router.push('/ring');  // Use push instead of replace
      } else if (!isAuthenticated) {
        router.push('/');  // Use push instead of replace
      }
    }
  }, [loading, isAuthenticated, ring, rootNavigationState?.key]);

  if (!loading && !rootNavigationState?.key) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  

  return (
    <>
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          
          header: () => <Header />,
          headerShown: true,
        }}
      >
        <Drawer.Screen name="index" options={{ headerShown: false }} />
        <Drawer.Screen name="(auth)" options={{ headerShown: false }} />
        <Drawer.Screen name="(ring)" options={{ headerShown: false }} />
        <Drawer.Screen name="(diffroute)" options={{ headerShown: false }} />
        <Drawer.Screen
          name="(tabs)"
          options={{
            headerShown: true,
          }}
        />
        <Drawer.Screen
          name="(profile)"
          options={{
            headerShown: true,
          }}
        />
        <Drawer.Screen
          name="(community)"
          options={{
            headerShown: true,
          }}
        />
        <Drawer.Screen
          name="(questionbot)"
          options={{
            headerShown: true,
          }}
        />
      </Drawer>
      <StatusBar style="light" />
    </>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
    <SocketProvider>
      <View style={styles.container}>
        <NavigationContent />
      </View>
      </SocketProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootLayout;
