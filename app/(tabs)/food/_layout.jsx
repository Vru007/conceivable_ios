import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
export default function FoodLayout() {
  return (
    <>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="foodDetails" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="shoppinglist" options={{headerShown:false}}/>
      
    </Stack>
    <StatusBar style="light"/>
    </>
  );
}