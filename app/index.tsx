import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Patient = {
  fullName: string;
  phone: string;
  birthDate: string;
  password: string;
  iin: string;
};

type Appointment = {
  doctor: string;
  date: string;
};

const doctors = ['Айболит', 'Борменталь', 'Странный'];

export default function Index() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [screen, setScreen] = useState<'login' | 'register' | 'home' | 'appointment' | 'schedule' | 'medical' | 'results' | 'profile'>('login');

  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regData, setRegData] = useState<Patient>({
    fullName: '',
    phone: '',
    birthDate: '',
    password: '',
    iin: '',
  });

  const [profileData, setProfileData] = useState<Patient | null>(null);

  const [apptDoctor, setApptDoctor] = useState(doctors[0]);
  const [apptDate, setApptDate] = useState('');

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('patient');
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (stored) {
        const p = JSON.parse(stored);
        setPatient(p);
        setProfileData(p);
        setScreen('login');
      } else {
        setScreen('register');
      }
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    })();
  }, []);

  const savePatient = async (data: Patient) => {
    setPatient(data);
    setProfileData(data);
    await AsyncStorage.setItem('patient', JSON.stringify(data));
  };

  const saveAppointments = async (list: Appointment[]) => {
    setAppointments(list);
    await AsyncStorage.setItem('appointments', JSON.stringify(list));
  };

  const handleLogin = () => {
    if (patient && loginPhone === patient.phone && loginPassword === patient.password) {
      setScreen('home');
      setLoginPhone('');
      setLoginPassword('');
    } else {
      Alert.alert('Ошибка', 'Неверные данные');
    }
  };

  const renderLogin = () => (
    <View style={{ padding: 16 }}>
      <Text>Вход</Text>
      <TextInput placeholder="Телефон" value={loginPhone} onChangeText={setLoginPhone} style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <TextInput placeholder="Пароль" value={loginPassword} onChangeText={setLoginPassword} secureTextEntry style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <Button title="Войти" onPress={handleLogin} />
      <Button title="Регистрация" onPress={() => setScreen('register')} />
    </View>
  );

  const renderRegister = () => (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text>Регистрация</Text>
      <TextInput placeholder="ФИО" value={regData.fullName} onChangeText={(t) => setRegData({ ...regData, fullName: t })} style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <TextInput placeholder="Телефон" value={regData.phone} onChangeText={(t) => setRegData({ ...regData, phone: t })} style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <TextInput placeholder="Дата рождения" value={regData.birthDate} onChangeText={(t) => setRegData({ ...regData, birthDate: t })} style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <TextInput placeholder="ИИН" value={regData.iin} onChangeText={(t) => setRegData({ ...regData, iin: t })} style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <TextInput placeholder="Пароль" value={regData.password} onChangeText={(t) => setRegData({ ...regData, password: t })} secureTextEntry style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <Button title="Сохранить" onPress={() => { savePatient(regData); setScreen('home'); }} />
      <Button title="У меня уже есть аккаунт" onPress={() => setScreen('login')} />
    </ScrollView>
  );

  const renderHome = () => (
    <View style={{ padding: 16 }}>
      <Text>Главная</Text>
      <Button title="Запись на приём" onPress={() => setScreen('appointment')} />
      <Button title="Расписание" onPress={() => setScreen('schedule')} />
      <Button title="Медкарта" onPress={() => setScreen('medical')} />
      <Button title="Результаты лечения" onPress={() => setScreen('results')} />
      <Button title="Профиль" onPress={() => setScreen('profile')} />
      <Button title="Выйти" onPress={() => setScreen('login')} />
    </View>
  );

  const renderAppointment = () => (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text>Запись на приём</Text>
      <Text>Выберите врача:</Text>
      {doctors.map((d) => (
        <Button key={d} title={d} onPress={() => setApptDoctor(d)} />
      ))}
      <Text>Выбран: {apptDoctor}</Text>
      <TextInput placeholder="Дата" value={apptDate} onChangeText={setApptDate} style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <Button title="Подтвердить" onPress={() => { if (apptDate) { const list = [...appointments, { doctor: apptDoctor, date: apptDate }]; saveAppointments(list); setApptDate(''); setScreen('schedule'); } }} />
      <Button title="Назад" onPress={() => setScreen('home')} />
    </ScrollView>
  );

  const renderSchedule = () => (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text>Расписание</Text>
      {appointments.map((a, i) => (
        <Text key={i}>{a.date} - {a.doctor}</Text>
      ))}
      <Button title="Назад" onPress={() => setScreen('home')} />
    </ScrollView>
  );

  const renderMedical = () => (
    <View style={{ padding: 16 }}>
      <Text>Медкарта</Text>
      <Text>ФИО: {patient?.fullName}</Text>
      <Text>Телефон: {patient?.phone}</Text>
      <Text>Дата рождения: {patient?.birthDate}</Text>
      <Text>ИИН: {patient?.iin}</Text>
      <Button title="Назад" onPress={() => setScreen('home')} />
    </View>
  );

  const results = ['Осмотр: кариес', 'Лечение: пломба', 'Рентген: без патологии'];
  const renderResults = () => (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text>Результаты лечения</Text>
      {results.map((r, i) => (
        <Text key={i}>{r}</Text>
      ))}
      <Button title="Назад" onPress={() => setScreen('home')} />
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text>Профиль</Text>
      <TextInput placeholder="ФИО" value={profileData?.fullName} onChangeText={(t) => setProfileData({ ...(profileData as Patient), fullName: t })} style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <TextInput placeholder="Телефон" value={profileData?.phone} onChangeText={(t) => setProfileData({ ...(profileData as Patient), phone: t })} style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <TextInput placeholder="Дата рождения" value={profileData?.birthDate} onChangeText={(t) => setProfileData({ ...(profileData as Patient), birthDate: t })} style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <TextInput placeholder="ИИН" value={profileData?.iin} onChangeText={(t) => setProfileData({ ...(profileData as Patient), iin: t })} style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <TextInput placeholder="Пароль" value={profileData?.password} onChangeText={(t) => setProfileData({ ...(profileData as Patient), password: t })} secureTextEntry style={{ borderWidth: 1, marginVertical: 8, padding: 4 }} />
      <Button title="Сохранить" onPress={() => { savePatient(profileData as Patient); setScreen('home'); }} />
      <Button title="Назад" onPress={() => setScreen('home')} />
    </ScrollView>
  );

  switch (screen) {
    case 'login':
      return renderLogin();
    case 'register':
      return renderRegister();
    case 'home':
      return renderHome();
    case 'appointment':
      return renderAppointment();
    case 'schedule':
      return renderSchedule();
    case 'medical':
      return renderMedical();
    case 'results':
      return renderResults();
    case 'profile':
      return renderProfile();
    default:
      return renderLogin();
  }
}
