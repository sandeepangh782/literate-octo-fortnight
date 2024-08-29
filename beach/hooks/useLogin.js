import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function useLogin() {
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const login = (email, password) => {
    // Replace with your actual login logic
    if (email === 'test@example.com' && password === 'password') {
      setError(null);
      // Navigate to the next screen or perform other actions
      navigation.navigate('Home'); // Assuming 'Home' is the next screen
    } else {
      setError('Invalid email or password');
    }
  };

  return { login, error };
}