import { Platform } from 'react-native';

// Android emülatörde localhost yerine 10.0.2.2 kullanılır
const LOCALHOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_URL = __DEV__
  ? `http://${LOCALHOST}:3000`
  : 'https://api.beaconia.com';
