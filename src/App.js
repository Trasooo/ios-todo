import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const STORAGE_KEY = 'IOS_TODO_ITEMS_V1';

export default function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch (e) {
        // noop
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);

  const addItem = () => {
    const value = text.trim();
    if (!value) return;
    const id = Date.now().toString();
    setItems([{ id, title: value, done: false }, ...items]);
    setText('');
  };

  const toggleItem = (id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => toggleItem(item.id)} style={[styles.checkbox, item.done && styles.checkboxDone]}>
        {item.done ? <Text style={styles.checkmark}>✓</Text> : null}
      </TouchableOpacity>
      <Text style={[styles.title, item.done && styles.titleDone]}>{item.title}</Text>
      <TouchableOpacity onPress={() => deleteItem(item.id)}>
        <Text style={styles.delete}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>To‑Do</Text>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Add a task"
            value={text}
            onChangeText={setText}
            onSubmitEditing={addItem}
            returnKeyType="done"
            style={styles.input}
          />
          <TouchableOpacity onPress={addItem} style={styles.addBtn}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(it) => it.id}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: '700', padding: 16 },
  inputRow: { flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginRight: 8 },
  addBtn: { backgroundColor: '#1e90ff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  addBtnText: { color: 'white', fontWeight: '600' },
  list: { padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  checkbox: { width: 28, height: 28, borderRadius: 6, borderWidth: 2, borderColor: '#1e90ff', marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: '#1e90ff' },
  checkmark: { color: 'white', fontWeight: '800' },
  title: { flex: 1, fontSize: 16 },
  titleDone: { textDecorationLine: 'line-through', color: '#888' },
  delete: { color: '#ff4d4f', padding: 6 }
});
