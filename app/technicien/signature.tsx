import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

const { height } = Dimensions.get('window');

export default function SignatureScreen() {
  const router = useRouter();
  const ref = useRef(null);

  const handleOK = (signature) => {
    console.log("Signature capturée");
    router.replace({
      pathname: "/technicien/fiche_technique",
      params: { signed: 'true' }
    });
  };

  const handleClear = () => ref.current?.clearSignature();
  const handleConfirm = () => ref.current?.readSignature();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIGNATURE DU CLIENT</Text>
      
      <View style={styles.signatureWrapper}>
        <SignatureCanvas
          ref={ref}
          onOK={handleOK}
          descriptionText=""
          clearText="Effacer"
          confirmText="Valider"
          autoClear={false}
          // CE STYLE WEB EST LA CLÉ POUR IPHONE
          webStyle={`
            .m-signature-pad { border: none; box-shadow: none; }
            .m-signature-pad--body { border: none; bottom: 0; }
            .m-signature-pad--footer { display: none; }
            body, html { width: 100%; height: 100%; overflow: hidden; }
          `}
        />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.btnAnnuler}>ANNULER</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnValider} onPress={handleConfirm}>
          <Text style={styles.btnText}>VALIDER LA SIGNATURE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1D3D47', 
    textAlign: 'center', 
    marginTop: 60,
    marginBottom: 20 
  },
  signatureWrapper: { 
    height: height * 0.5, // Donne une hauteur fixe (50% de l'écran)
    borderWidth: 2, 
    borderColor: '#1D3D47', 
    borderStyle: 'dashed',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F9F9F9'
  },
  buttons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 40 
  },
  btnAnnuler: { color: 'red', fontWeight: 'bold', fontSize: 16 },
  btnValider: { 
    backgroundColor: '#28a745', 
    paddingVertical: 15, 
    paddingHorizontal: 25, 
    borderRadius: 10 
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});