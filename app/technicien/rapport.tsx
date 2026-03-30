import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function RapportFinalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const [loading, setLoading] = useState(false);

  // --- LOGIQUE DE TRANSMISSION FRONTEND -> BACKEND ---
  const handleFinalSend = async () => {
    setLoading(true);
    try {
      let finalPhoto = "";

      // 1. TRANSFORMATION DE L'IMAGE EN TEXTE (BASE64)
      if (params.image) {
        const photoUri = params.image as string;
        const base64Photo = await FileSystem.readAsStringAsync(photoUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // On ajoute le header pour que le navigateur/mobile reconnaisse le format image
        finalPhoto = `data:image/jpeg;base64,${base64Photo}`;
      }

      // 2. ENVOI VERS LA BASE DE DONNÉES FIRESTORE (BACKEND)
      // On crée un document dans la collection "interventions"
      await addDoc(collection(db, "interventions"), {
        client: params.client,
        technicien: auth.currentUser?.email || "Inconnu",
        nature: params.nature,
        description: params.desc || "Pas de description",
        horaires: `${params.debut} - ${params.fin}`,
        photoData: finalPhoto,       // Stockage de la photo en texte
        signature: params.signature, // Stockage de la signature en texte
        dateEnvoi: serverTimestamp(), // Heure exacte du serveur Firebase
        statut: "Terminé"
      });

      Alert.alert("Succès", "Le rapport a été envoyé au patron !");
      router.replace("/technicien/dashboard");
      
    } catch (error) {
      console.error("Erreur Backend:", error);
      Alert.alert("Erreur", "Impossible de joindre la base de données.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Résumé de l'intervention</Text>
      </View>

      <View style={styles.content}>
        {/* Affichage des informations saisies */}
        <View style={styles.infoSection}>
          <Text style={styles.label}>📍 Client : <Text style={styles.val}>{params.client}</Text></Text>
          <Text style={styles.label}>🛠️ Nature : <Text style={styles.val}>{params.nature}</Text></Text>
          <Text style={styles.label}>🕒 Temps : <Text style={styles.val}>{params.debut} à {params.fin}</Text></Text>
        </View>

        {/* Aperçu de la photo terrain */}
        <Text style={styles.sectionTitle}>Photo du chantier :</Text>
        {params.image ? (
          <Image source={{ uri: params.image as string }} style={styles.previewImage} />
        ) : (
          <Text style={styles.noData}>Aucune photo prise</Text>
        )}

        {/* Aperçu de la signature */}
        <Text style={styles.sectionTitle}>Signature client :</Text>
        <Image source={{ uri: params.signature as string }} style={styles.previewSig} />

        {/* Bouton d'envoi final */}
        <TouchableOpacity 
          style={[styles.sendBtn, loading && { backgroundColor: '#ccc' }]} 
          onPress={handleFinalSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={24} color="#fff" />
              <Text style={styles.sendBtnText}> ENVOYER LE RAPPORT</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#1D3D47', padding: 40, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  infoSection: { backgroundColor: '#fff', padding: 15, borderRadius: 12, elevation: 3, marginBottom: 20 },
  label: { fontWeight: 'bold', color: '#666', marginBottom: 5 },
  val: { fontWeight: 'normal', color: '#000' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 15, color: '#1D3D47', marginBottom: 5 },
  previewImage: { width: '100%', height: 220, borderRadius: 12, backgroundColor: '#eee' },
  previewSig: { width: '100%', height: 120, borderRadius: 12, backgroundColor: '#fff', resizeMode: 'contain', borderWidth: 1, borderColor: '#ddd' },
  noData: { color: '#999', fontStyle: 'italic' },
  sendBtn: { 
    backgroundColor: '#28a745', 
    flexDirection: 'row',
    padding: 20, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 30,
    elevation: 5
  },
  sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});