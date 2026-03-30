import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail || !password) {
      return Alert.alert("Champs vides", "Merci de saisir vos identifiants.");
    }

    setLoading(true);

    try {
      // 1. Authentification Firebase (Vérifie le mot de passe)
      await signInWithEmailAndPassword(auth, cleanEmail, password);

      // 2. Lecture du rôle dans Firestore (Vérifie les droits)
      // L'ID du document est l'email (ex: admin@test.com)
      const userRef = doc(db, "users", cleanEmail);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        
        // On vérifie le champ 'role' (ou 'tarik' comme vu sur ta photo)
        const userRole = userData.role || userData.tarik; 

        console.log("Connexion réussie. Rôle :", userRole);

        if (userRole === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/technicien/dashboard");
        }
      } else {
        Alert.alert("Accès restreint", "Votre compte n'est pas configuré dans la base 'users'.");
        // Optionnel : déconnecter l'utilisateur s'il n'est pas dans la liste
        await auth.signOut();
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erreur", "Identifiants incorrects ou problème réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <View style={styles.card}>
        <Image 
          source={require('../../assets/images/logo_az.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <Text style={styles.title}>AZ-ENGINEERING</Text>
        <Text style={styles.subtitle}>Maintenance & Services</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            placeholderTextColor="#999"
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Mot de passe" 
            placeholderTextColor="#999"
            secureTextEntry 
            onChangeText={setPassword} 
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>SE CONNECTER</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>Authentification Cloud Sécurisée</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1D3D47', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 25, padding: 30, alignItems: 'center', elevation: 10 },
  logo: { width: 140, height: 70, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1D3D47', letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 30 },
  inputContainer: { width: '100%', marginBottom: 20 },
  input: { width: '100%', height: 55, borderWidth: 1, borderColor: '#eee', borderRadius: 12, marginBottom: 15, paddingHorizontal: 15, backgroundColor: '#f9f9f9', fontSize: 16 },
  button: { width: '100%', height: 55, backgroundColor: '#F07149', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footerText: { marginTop: 25, color: '#bbb', fontSize: 10 }
});