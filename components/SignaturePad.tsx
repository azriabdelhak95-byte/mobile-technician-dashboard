import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

interface Props {
  onOK: (signature: string) => void;
}

export const SignaturePad = ({ onOK }: Props) => {
  const ref = useRef<any>();

  // Cette fonction est appelée quand on appuie sur notre bouton "Valider"
  const handleConfirm = () => {
    ref.current.readSignature(); // Demande au pad de lire le dessin
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  return (
    <View style={styles.container}>
      <View style={styles.padWrapper}>
        <SignatureScreen
          ref={ref}
          onOK={onOK}
          autoClear={false}
          imageType="image/png"
          webStyle={`.m-signature-pad--footer { display: none; margin: 0px; } body,html { width: 100%; height: 100%; }`} 
        />
      </View>
      
      {/* NOS BOUTONS MAISON (Bien visibles) */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.btn, styles.btnClear]} onPress={handleClear}>
          <Text style={styles.btnTextBlack}>Effacer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleConfirm}>
          <Text style={styles.btnTextWhite}>ENREGISTRER LA SIGNATURE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 320, width: '100%' },
  padWrapper: { flex: 1, borderWidth: 1, borderColor: '#003366', borderRadius: 10, overflow: 'hidden' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnClear: { backgroundColor: '#ccc', flex: 0.3 },
  btnSave: { backgroundColor: '#003366', flex: 0.65 },
  btnTextWhite: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  btnTextBlack: { color: '#000', fontWeight: 'bold', fontSize: 13 }
});