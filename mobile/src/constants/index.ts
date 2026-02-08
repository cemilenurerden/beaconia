import { Platform } from 'react-native';

// Fiziksel cihaz: bilgisayarın Wi-Fi IP adresi
// Android emülatör: 10.0.2.2, iOS simülatör: localhost
const DEV_HOST = Platform.select({
  android: '172.20.10.3',
  ios: '172.20.10.3',
  default: 'localhost',
});

export const API_URL = __DEV__
  ? `http://${DEV_HOST}:3001`
  : 'https://api.beaconia.com';
