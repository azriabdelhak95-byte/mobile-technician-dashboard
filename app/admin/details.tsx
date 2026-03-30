import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1D3D47" />
        <Text style={styles.backText}>Retour</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Rapport de {params.client}</Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.label}>Technicien : <Text style={styles.val}>{params.technicien}</Text></Text>
          <Text style={styles.label}>Horaires : <Text style={styles.val}>{params.horaires}</Text></Text>
          <Text style={styles.label}>Nature : <Text style={styles.val}>{params.nature}</Text></Text>
          <Text style={styles.label}>Description :</Text>
          <Text style={styles.desc}>{params.description || params.desc}</Text>
        </View>

        <Text style={styles.sectionTitle}>PHOTO DU CHANTIER</Text>
        {params.photoData ? (
          <Image source={{ uri: params.photoData as string }} style={styles.image} />
        ) : (
          <View style={styles.noImg}><Text>Pas de photo</Text></View>
        )}

        <Text style={styles.sectionTitle}>SIGNATURE CLIENT</Text>
        <Image source={{ uri: params.signature as string }} style={styles.signature} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backBtn: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50 },
  backText: { marginLeft: 10, fontWeight: 'bold', color: '#1D3D47' },
  scroll: { padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1D3D47', marginBottom: 20 },
  infoBox: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 10, marginBottom: 20 },
  label: { fontWeight: 'bold', color: '#666', marginBottom: 5 },
  val: { fontWeight: 'normal', color: '#000' },
  desc: { fontStyle: 'italic', marginTop: 5 },
  sectionTitle: { fontWeight: 'bold', marginTop: 10, marginBottom: 10, color: '#F07149' },
  image: { width: '100%', height: 250, borderRadius: 10, marginBottom: 20 },
  signature: { width: '100%', height: 120, resizeMode: 'contain', backgroundColor: '#f0f0f0', borderRadius: 10 },
  noImg: { height: 100, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }
});