import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Shield, Copy, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function Enable2FA() {
  const [step, setStep] = useState<'intro' | 'setup' | 'verify'>('intro');
  const [verificationCode, setVerificationCode] = useState('');
  const [secretKey] = useState('JBSWY3DPEHPK3PXP');
  const [backupCodes] = useState([
    'A1B2C3D4',
    'E5F6G7H8',
    'I9J0K1L2',
    'M3N4O5P6',
    'Q7R8S9T0',
  ]);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Aura:user@example.com?secret=${secretKey}&issuer=Aura`;

  const handleCopySecret = () => {
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
    Alert.alert('Copied', 'Secret key copied to clipboard');
  };

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      Alert.alert(
        'Success',
        '2FA has been enabled successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
    }
  };

  const renderIntro = () => (
    <View style={styles.section}>
      <View style={styles.iconContainer}>
        <Shield size={64} color={colors.primary} />
      </View>
      <Text style={styles.title}>Enable Two-Factor Authentication</Text>
      <Text style={styles.description}>
        Add an extra layer of security to your account. You'll need to enter a
        code from your authenticator app each time you log in.
      </Text>

      <View style={styles.benefits}>
        <Text style={styles.benefitsTitle}>Benefits:</Text>
        <View style={styles.benefitItem}>
          <CheckCircle size={20} color={colors.success} />
          <Text style={styles.benefitText}>
            Protect your account from unauthorized access
          </Text>
        </View>
        <View style={styles.benefitItem}>
          <CheckCircle size={20} color={colors.success} />
          <Text style={styles.benefitText}>
            Required for agents, landlords, and service providers
          </Text>
        </View>
        <View style={styles.benefitItem}>
          <CheckCircle size={20} color={colors.success} />
          <Text style={styles.benefitText}>
            Secure your listings and financial data
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setStep('setup')}
      >
        <Text style={styles.primaryButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSetup = () => (
    <View style={styles.section}>
      <Text style={styles.title}>Set Up Authenticator</Text>
      <Text style={styles.description}>
        Scan this QR code with your authenticator app (Google Authenticator,
        Authy, etc.)
      </Text>

      <View style={styles.qrContainer}>
        <View style={styles.qrPlaceholder}>
          <Text style={styles.qrText}>QR Code</Text>
          <Text style={styles.qrSubtext}>Scan with authenticator app</Text>
        </View>
      </View>

      <Text style={styles.orText}>Or enter this key manually:</Text>

      <View style={styles.secretKeyContainer}>
        <Text style={styles.secretKey}>{secretKey}</Text>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={handleCopySecret}
        >
          {copiedSecret ? (
            <CheckCircle size={20} color={colors.success} />
          ) : (
            <Copy size={20} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsTitle}>Instructions:</Text>
        <Text style={styles.instructionText}>
          1. Open your authenticator app
        </Text>
        <Text style={styles.instructionText}>
          2. Tap "+" or "Add Account"
        </Text>
        <Text style={styles.instructionText}>
          3. Scan the QR code or enter the key
        </Text>
        <Text style={styles.instructionText}>
          4. Enter the 6-digit code shown in the app
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setStep('verify')}
      >
        <Text style={styles.primaryButtonText}>I've Scanned the Code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setStep('intro')}
      >
        <Text style={styles.secondaryButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderVerify = () => (
    <View style={styles.section}>
      <Text style={styles.title}>Verify Setup</Text>
      <Text style={styles.description}>
        Enter the 6-digit code from your authenticator app to complete setup
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Verification Code</Text>
        <TextInput
          style={styles.input}
          value={verificationCode}
          onChangeText={setVerificationCode}
          placeholder="Enter 6-digit code"
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />
      </View>

      <View style={styles.backupCodesContainer}>
        <Text style={styles.backupCodesTitle}>Backup Codes</Text>
        <Text style={styles.backupCodesDescription}>
          Save these codes in a secure place. You can use them to access your
          account if you lose your phone.
        </Text>
        <View style={styles.codesList}>
          {backupCodes.map((code, index) => (
            <View key={index} style={styles.codeItem}>
              <Text style={styles.codeText}>{code}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          verificationCode.length !== 6 && styles.disabledButton,
        ]}
        onPress={handleVerify}
        disabled={verificationCode.length !== 6}
      >
        <Text style={styles.primaryButtonText}>Verify & Enable 2FA</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setStep('setup')}
      >
        <Text style={styles.secondaryButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (step) {
      case 'intro':
        return renderIntro();
      case 'setup':
        return renderSetup();
      case 'verify':
        return renderVerify();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Two-Factor Authentication</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    gap: 20,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  benefits: {
    gap: 16,
    marginVertical: 12,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  qrSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  orText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 12,
  },
  secretKeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secretKey: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: 2,
  },
  copyButton: {
    padding: 8,
  },
  instructionsBox: {
    padding: 16,
    backgroundColor: colors.info + '10',
    borderRadius: 12,
    gap: 8,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: 4,
    textAlign: 'center',
  },
  backupCodesContainer: {
    padding: 16,
    backgroundColor: colors.warning + '10',
    borderRadius: 12,
    gap: 12,
  },
  backupCodesTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  backupCodesDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  codesList: {
    gap: 8,
  },
  codeItem: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: 2,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: colors.background,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
