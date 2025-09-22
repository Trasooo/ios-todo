import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, KeyboardAvoidingView, Platform, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const STORAGE_KEY = 'IOS_TODO_ITEMS_V1';

export default function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [creditsVisible, setCreditsVisible] = useState(false);

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
    setItems([{ id, title: value, done: false, emoji: '📝' }, ...items]);
    setText('');
  };

  const toggleItem = (id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const openEmojiPicker = (id) => {
    setSelectedItemId(id);
    setEmojiPickerVisible(true);
  };

  const chooseEmoji = (emoji) => {
    if (!selectedItemId) return;
    setItems((prev) => prev.map((it) => (it.id === selectedItemId ? { ...it, emoji } : it)));
    setEmojiPickerVisible(false);
    setSelectedItemId(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => toggleItem(item.id)} style={[styles.checkbox, item.done && styles.checkboxDone]}>
        {item.done ? <Text style={styles.checkmark}>✓</Text> : null}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openEmojiPicker(item.id)} style={styles.emojiBadge}>
        <Text style={styles.emojiText}>{item.emoji || '📝'}</Text>
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
      <View style={styles.headerRow}>
        <Text style={styles.header}>To‑Do</Text>
        <TouchableOpacity onPress={() => setCreditsVisible(true)}>
          <Text style={styles.creditsBtn}>i</Text>
        </TouchableOpacity>
      </View>
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

      {/* Emoji Picker Modal */}
      <Modal visible={emojiPickerVisible} transparent animationType="slide" onRequestClose={() => setEmojiPickerVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Scegli un'emoji</Text>
            <View style={styles.emojiGrid}>
              {['📝','✅','⭐','🔥','📌','🕒','🏃‍♂️','💡','📚','🛒','🧹','💻','📅','🎯','📈','🔔'].map((e) => (
                <Pressable key={e} onPress={() => chooseEmoji(e)} style={styles.emojiCell}>
                  <Text style={styles.emojiPick}>{e}</Text>
                </Pressable>
              ))}
            </View>
            <TouchableOpacity onPress={() => setEmojiPickerVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Credits Modal */}
      <Modal visible={creditsVisible} transparent animationType="fade" onRequestClose={() => setCreditsVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Crediti</Text>
            <Text style={styles.creditsText}>App: Promemoria Emoji
Sviluppo: Trasooo
Tecnologie: Expo, React Native</Text>
            <TouchableOpacity onPress={() => setCreditsVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16 },
  header: { fontSize: 28, fontWeight: '700' },
  creditsBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#eee', textAlign: 'center', textAlignVertical: 'center', lineHeight: 28, fontWeight: '700' },
  inputRow: { flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginRight: 8 },
  addBtn: { backgroundColor: '#1e90ff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  addBtnText: { color: 'white', fontWeight: '600' },
  list: { padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  checkbox: { width: 28, height: 28, borderRadius: 6, borderWidth: 2, borderColor: '#1e90ff', marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: '#1e90ff' },
  checkmark: { color: 'white', fontWeight: '800' },
  emojiBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  emojiText: { fontSize: 18 },
  title: { flex: 1, fontSize: 16 },
  titleDone: { textDecorationLine: 'line-through', color: '#888' },
  delete: { color: '#ff4d4f', padding: 6 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modalCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, width: '90%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  emojiCell: { width: '20%', paddingVertical: 8, alignItems: 'center' },
  emojiPick: { fontSize: 28 },
  modalClose: { marginTop: 12, alignSelf: 'flex-end', backgroundColor: '#1e90ff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  modalCloseText: { color: '#fff', fontWeight: '600' },
  creditsText: { fontSize: 14, color: '#333', lineHeight: 20 }
});
