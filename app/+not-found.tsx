import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFound() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Страница не найдена</Text>
      <Link href="/">Вернуться на главную</Link>
    </View>
  );
}
