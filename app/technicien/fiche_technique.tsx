import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { auth } from '../../firebaseConfig';

export default function FicheTechnique() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const sigRef = useRef(null);
  
  const [form, setForm] = useState({ client: '', nature: '', desc: '', debut: '', fin: '' });

  useEffect(() => {
    setUserName(auth.currentUser?.displayName || auth.currentUser?.email || "Technicien");
  }, []);

  // Empêche de dépasser 23:59 et formate le ":"
  const handleTimeChange = (text: string, field: 'debut' | 'fin') => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length >= 3) cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2, 4);
    
    // Validation simple : Heures < 24 et Minutes < 60
    const parts = cleaned.split(':');
    if (parts[0] && parseInt(parts[0]) > 23) return;
    if (parts[1] && parseInt(parts[1]) > 59) return;

    setForm({ ...form, [field]: cleaned });
  };

  const validateAndNext = (signature: string) => {
    if (!form.client || !form.debut || !form.fin) {
      Alert.alert("Champs requis", "Veuillez remplir le client et les horaires.");
      return;
    }
    router.push({
      pathname: '/technicien/rapport',
      params: { ...form, technicien: userName, image, signature }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FICHE D'INTERVENTION</Text>
        <Text style={styles.techBadge}>👷 {userName}</Text>
      </View>

      <View style={styles.padding}>
        <Text style={styles.label}>CLIENT (OBLIGATOIRE)</Text>
        <TextInput style={styles.input} placeholder="Nom du client" onChangeText={(t) => setForm({...form, client: t})} />

        <Text style={styles.label}>HORAIRES (Format HH:MM)</Text>
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, {width: '48%'}]} 
            placeholder="Début" 
            keyboardType="numeric" 
            maxLength={5}
            value={form.debut}
            onChangeText={(t) => handleTimeChange(t, 'debut')} 
          />
          <TextInput 
            style={[styles.input, {width: '48%'}]} 
            placeholder="Fin" 
            keyboardType="numeric" 
            maxLength={5}
            value={form.fin}
            onChangeText={(t) => handleTimeChange(t, 'fin')} 
          />
        </View>

        <Text style={styles.label}>PREUVES TERRAIN</Text>
        <TouchableOpacity style={styles.photoBtn} onPress={async () => {
          let res = await ImagePicker.launchCameraAsync({ quality: 0.5 });
          if (!res.canceled) setImage(res.assets[0].uri);
        }}>
          <Ionicons name="camera" size={20} color="#1D3D47" />
          <Text style={styles.photoBtnText}>{image ? "Photo OK ✅" : "Prendre Photo"}</Text>
        </TouchableOpacity>

        <View style={styles.sigContainer}>
          <SignatureCanvas ref={sigRef} onOK={validateAndNext} descriptionText="Signer ici" webStyle={`.m-signature-pad--footer {display:none;}`} />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={() => sigRef.current?.readSignature()}>
          <Text style={styles.submitBtnText}>GÉNÉRER LE RAPPORT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#1D3D47', padding: 40, alignItems: 'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  techBadge: { color: '#F07149', marginTop: 10, fontWeight: 'bold' },
  padding: { padding: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#1D3D47', marginTop: 15, marginBottom: 5 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  photoBtn: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#1D3D47', padding: 15, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  photoBtnText: { marginLeft: 10, fontWeight: 'bold' },
  sigContainer: { height: 180, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginTop: 20, overflow: 'hidden' },
  submitBtn: { backgroundColor: '#F07149', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 25 },
  submitBtnText: { color: '#fff', fontWeight: 'bold' }
});