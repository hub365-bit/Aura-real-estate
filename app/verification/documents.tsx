import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FileText, Upload, CheckCircle, Clock, XCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

type DocumentType = 'id' | 'kra' | 'license' | 'other';
type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'not_uploaded';

interface Document {
  type: DocumentType;
  name: string;
  description: string;
  status: DocumentStatus;
  uploadDate?: string;
}

export default function DocumentVerificationScreen() {
  const insets = useSafeAreaInsets();

  const [documents, setDocuments] = useState<Document[]>([
    {
      type: 'id',
      name: 'National ID / Passport',
      description: 'Valid government-issued identification',
      status: 'approved',
      uploadDate: '2025-01-15',
    },
    {
      type: 'kra',
      name: 'KRA PIN Certificate',
      description: 'Kenya Revenue Authority PIN certificate',
      status: 'pending',
      uploadDate: '2025-01-20',
    },
    {
      type: 'license',
      name: 'Business License',
      description: 'Valid business operating license',
      status: 'not_uploaded',
    },
    {
      type: 'other',
      name: 'Supporting Documents',
      description: 'Additional verification documents',
      status: 'not_uploaded',
    },
  ]);

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} color={Colors.light.success} />;
      case 'pending':
        return <Clock size={20} color={Colors.light.secondary} />;
      case 'rejected':
        return <XCircle size={20} color={Colors.light.error} />;
      default:
        return <Upload size={20} color={Colors.light.textSecondary} />;
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return Colors.light.success;
      case 'pending':
        return Colors.light.secondary;
      case 'rejected':
        return Colors.light.error;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getStatusText = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return 'Verified';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Upload Required';
    }
  };

  const handleUpload = (doc: Document) => {
    Alert.alert('Upload Document', `Select ${doc.name} to upload`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Choose File',
        onPress: () => {
          Alert.alert('Success', 'Document uploaded successfully and is pending review');
          setDocuments((prev) =>
            prev.map((d) =>
              d.type === doc.type
                ? { ...d, status: 'pending', uploadDate: new Date().toISOString().split('T')[0] }
                : d
            )
          );
        },
      },
    ]);
  };

  const approvedCount = documents.filter((d) => d.status === 'approved').length;
  const totalRequired = documents.length - 1;
  const verificationProgress = (approvedCount / totalRequired) * 100;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Document Verification',
          headerStyle: {
            backgroundColor: Colors.light.surface,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
          },
        }}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <FileText size={32} color={Colors.light.primary} />
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Verification Status</Text>
              <Text style={styles.statusSubtitle}>
                {approvedCount} of {totalRequired} documents verified
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${verificationProgress}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📋 Why We Need Verification</Text>
          <Text style={styles.infoText}>
            Document verification helps us ensure the safety and security of all users on our
            platform. Verified accounts have access to premium features and gain the trust of
            potential clients.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Required Documents</Text>

        {documents.map((doc, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.documentCard,
              doc.status === 'approved' && styles.documentCardApproved,
              doc.status === 'rejected' && styles.documentCardRejected,
            ]}
            onPress={() => doc.status === 'not_uploaded' && handleUpload(doc)}
            activeOpacity={doc.status === 'not_uploaded' ? 0.7 : 1}
          >
            <View style={styles.documentHeader}>
              <View style={styles.documentLeft}>
                <View
                  style={[
                    styles.documentIconContainer,
                    { backgroundColor: getStatusColor(doc.status) + '20' },
                  ]}
                >
                  <FileText size={20} color={getStatusColor(doc.status)} />
                </View>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  <Text style={styles.documentDescription}>{doc.description}</Text>
                </View>
              </View>
              <View style={styles.documentRight}>
                {getStatusIcon(doc.status)}
              </View>
            </View>

            <View style={styles.documentFooter}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(doc.status) + '15' },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: getStatusColor(doc.status) },
                  ]}
                >
                  {getStatusText(doc.status)}
                </Text>
              </View>
              {doc.uploadDate && (
                <Text style={styles.uploadDate}>
                  Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                </Text>
              )}
            </View>

            {doc.status === 'not_uploaded' && (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleUpload(doc)}
              >
                <Upload size={16} color={Colors.light.primary} />
                <Text style={styles.uploadButtonText}>Upload Document</Text>
              </TouchableOpacity>
            )}

            {doc.status === 'rejected' && (
              <View style={styles.rejectionNote}>
                <Text style={styles.rejectionNoteText}>
                  Document was rejected. Please upload a clear, valid copy.
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {approvedCount === totalRequired && (
          <View style={styles.successCard}>
            <CheckCircle size={48} color={Colors.light.success} />
            <Text style={styles.successTitle}>All Documents Verified!</Text>
            <Text style={styles.successText}>
              Your account is fully verified. You now have access to all premium features.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statusCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  infoCard: {
    backgroundColor: Colors.light.info + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  documentCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  documentCardApproved: {
    borderColor: Colors.light.success + '40',
  },
  documentCardRejected: {
    borderColor: Colors.light.error + '40',
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  documentRight: {
    marginLeft: 12,
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  uploadDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary + '15',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  rejectionNote: {
    backgroundColor: Colors.light.error + '10',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  rejectionNoteText: {
    fontSize: 13,
    color: Colors.light.error,
    lineHeight: 18,
  },
  successCard: {
    backgroundColor: Colors.light.success + '15',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
