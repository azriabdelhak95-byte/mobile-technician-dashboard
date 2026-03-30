import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Tableau de bord Technicien</Text>
      </View>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/technicien/fiche_technique')}>
        <Ionicons name="add-circle" size={40} color="#F07149" />
        <Text style={styles.cardText}>Nouvelle Intervention</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/technicien/mes_interventions')}>
        <Ionicons name="list" size={40} color="#1D3D47" />
        <Text style={styles.cardText}>Mes Interventions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20, paddingTop: 60 },
  header: { marginBottom: 30 },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#1D3D47' },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15, elevation: 4 },
  cardText: { fontSize: 18, fontWeight: '600', marginLeft: 20, color: '#1D3D47' }
});