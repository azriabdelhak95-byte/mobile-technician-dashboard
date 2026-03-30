import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig';

export default function AdminDashboard() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTotalHistory();
  }, []);

  const fetchTotalHistory = async () => {
    setLoading(true);
    try {
      // Le patron voit TOUT, classé par date la plus récente
      const q = query(collection(db, "interventions"), orderBy("dateEnvoi", "desc"));
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setInterventions(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({ pathname: '/admin/details', params: { id: item.id, ...item } })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={styles.date}>{new Date(item.dateEnvoi).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.techInfo}>👷 Technicien : {item.technicien}</Text>
      <Text style={styles.nature}>{item.nature}</Text>
      <View style={styles.footer}>
        <Text style={styles.hours}>{item.horaires}</Text>
        <Ionicons name="chevron-forward" size={20} color="#F07149" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>ESPACE ADMINISTRATION</Text>
        <TouchableOpacity onPress={fetchTotalHistory}>
          <Ionicons name="refresh-circle" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1D3D47" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={interventions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Aucun rapport disponible.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  topBar: { backgroundColor: '#1D3D47', padding: 20, paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  list: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  clientName: { fontSize: 17, fontWeight: 'bold', color: '#1D3D47' },
  date: { fontSize: 12, color: '#666' },
  techInfo: { color: '#F07149', fontSize: 13, fontWeight: '600', marginBottom: 5 },
  nature: { color: '#444', marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  hours: { fontSize: 12, color: '#999' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});