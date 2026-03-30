import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

export default function FicheIntervention() {
  const router = useRouter();
  const { nom, prenom } = useLocalSearchParams(); 

  // Les informations que le technicien doit remplir
  const [client, setClient] = useState('');
  const [nature, setNature] = useState('');
  const [description, setDescription] = useState('');

  const passerAuRapport = () => {
    // Une fois rempli, on va vers l'écran de résumé (Rapport)
    router.push({
      pathname: "/technicien/rapport",
      params: { nom, prenom, client, nature, description }
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* En-tête bleu nuit */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FICHE D'INTERVENTION</Text>
        <Text style={styles.headerTech}>TECHNICIEN : {prenom} {nom}</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Champ Client */}
        <Text style={styles.label}>CLIENT (OBLIGATOIRE)</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le nom du client"
          value={client}
          onChangeText={setClient}
        />

        {/* Nature de l'intervention */}
        <View style={styles.blueLabel}>
          <Text style={styles.blueLabelText}>NATURE DE L'INTERVENTION *</Text>
        </View>
        <TextInput
          style={styles.inputBox}
          placeholder="Ex: Maintenance préventive"
          value={nature}
          onChangeText={setNature}
        />

        {/* Description des travaux */}
        <View style={styles.blueLabel}>
          <Text style={styles.blueLabelText}>DESCRIPTION DES TRAVAUX *</Text>
        </View>
        <TextInput
          style={[styles.inputBox, styles.textArea]}
          multiline
          placeholder="Expliquez ce que vous avez fait..."
          value={description}
          onChangeText={setDescription}
        />

        {/* Section Preuves (Photo et Signature) */}
        <Text style={styles.sectionTitle}>PREUVES TERRAIN *</Text>
        <View style={styles.preuvesRow}>
          <TouchableOpacity style={styles.preuveBtn}>
            <Ionicons name="camera" size={30} color="#1D3D47" />
            <Text style={styles.preuveBtnText}>Prendre Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.preuveBtn}>
            <Ionicons name="pencil" size={30} color="#1D3D47" />
            <Text style={styles.preuveBtnText}>Signature</Text>
          </TouchableOpacity>
        </View>

        {/* Ton bouton orange de validation */}
        <TouchableOpacity style={styles.orangeBtn} onPress={passerAuRapport}>
          <Text style={styles.orangeBtnText}>GÉNÉRER LE RAPPORT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { backgroundColor: '#1D3D47', padding: 30, paddingTop: 60, alignItems: 'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerTech: { color: '#A0B3C1', fontSize: 13, marginTop: 5, textTransform: 'uppercase' },
  formContainer: { padding: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#1D3D47', marginBottom: 5 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 20 },
  blueLabel: { backgroundColor: '#1D3D47', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  blueLabelText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  inputBox: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, borderTopLeftRadius: 0, marginBottom: 20 },
  textArea: { height: 100, textAlignVertical: 'top' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1D3D47', marginBottom: 15 },
  preuvesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  preuveBtn: { flex: 0.48, backgroundColor: '#fff', borderStyle: 'dashed', borderWidth: 1, borderColor: '#1D3D47', borderRadius: 12, padding: 20, alignItems: 'center' },
  preuveBtnText: { color: '#1D3D47', fontSize: 12, marginTop: 8, fontWeight: '500' },
  orangeBtn: { backgroundColor: '#F07149', padding: 18, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 },
  orangeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});