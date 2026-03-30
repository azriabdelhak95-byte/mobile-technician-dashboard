import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function MesInterventions() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Charger les données à l'ouverture
  useEffect(() => {
    fetchInterventions();
  }, []);

  const fetchInterventions = async () => {
    setLoading(true);
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) return;

      // Requête pour récupérer uniquement les rapports de ce technicien
      const q = query(
        collection(db, "interventions"),
        where("technicien", "==", userEmail),
        orderBy("dateEnvoi", "desc")
      );

      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setInterventions(list);
    } catch (error) {
      console.error("Erreur historique:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.clientLabel}>CLIENT</Text>
          <Text style={styles.clientName}>{item.client}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>ENVOYÉ</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.infoRow}>
        <Ionicons name="construct" size={14} color="#666" />
        <Text style={styles.natureText}>{item.nature}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time" size={14} color="#666" />
        <Text style={styles.dateText}>
          {new Date(item.dateEnvoi).toLocaleDateString()} | {item.heureDebut} - {item.heureFin}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1D3D47" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HISTORIQUE</Text>
        <TouchableOpacity onPress={fetchInterventions}>
          <Ionicons name="refresh" size={24} color="#1D3D47" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#F07149" />
          <Text style={styles.loadingText}>Récupération de vos rapports...</Text>
        </View>
      ) : (
        <FlatList
          data={interventions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="folder-open-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Aucun rapport envoyé pour le moment.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1D3D47' },
  listContainer: { padding: 15 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15, 
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clientLabel: { fontSize: 10, color: '#999', fontWeight: 'bold' },
  clientName: { fontSize: 16, fontWeight: 'bold', color: '#1D3D47' },
  statusBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  statusText: { color: '#2E7D32', fontSize: 10, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  natureText: { marginLeft: 8, color: '#444', fontSize: 14, fontWeight: '500' },
  dateText: { marginLeft: 8, color: '#666', fontSize: 13 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  loadingText: { marginTop: 15, color: '#666' },
  emptyText: { marginTop: 15, color: '#999', textAlign: 'center' }
});