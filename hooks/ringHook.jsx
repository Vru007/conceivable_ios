// import { useEffect, useState } from 'react';
// import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

// const { RingModule } = NativeModules;

// export const useRing = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [ringData, setRingData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (Platform.OS !== 'android') {
//       setError('Ring functionality is only available on Android');
//       return;
//     }

//     const eventEmitter = new NativeEventEmitter(RingModule);
    
//     const subscriptions = [
//       eventEmitter.addListener('ringDataReceived', (data) => {
//         setRingData(data);
//       }),
      
//       eventEmitter.addListener('ringConnectionChanged', ({ connected }) => {
//         setIsConnected(connected);
//       }),
      
//       eventEmitter.addListener('ringError', ({ error }) => {
//         setError(error);
//       }),
//     ];

//     return () => {
//       subscriptions.forEach(subscription => subscription.remove());
//     };
//   }, []);

//   const startScan = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         await RingModule.startScan();
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to start scan');
//     }
//   };

//   const stopScan = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         await RingModule.stopScan();
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to stop scan');
//     }
//   };

//   return {
//     isConnected,
//     ringData,
//     error,
//     startScan,
//     stopScan,
//   };
// };