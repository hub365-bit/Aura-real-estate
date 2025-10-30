import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wrench, Home as HomeIcon, AlertCircle, FileText, Camera } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Ticket } from '@/types';

type TicketType = Ticket['type'];
type TicketPriority = Ticket['priority'];

const ticketTypes: { value: TicketType; label: string; icon: React.ComponentType<any>; description: string }[] = [
  { value: 'repair', label: 'Repair', icon: Wrench, description: 'Report maintenance issues' },
  { value: 'vacate', label: 'Vacate', icon: HomeIcon, description: 'Notice to move out' },
  { value: 'complaint', label: 'Complaint', icon: AlertCircle, description: 'File a complaint' },
  { value: 'other', label: 'Other', icon: FileText, description: 'Other requests' },
];

export default function CreateTicketScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedType, setSelectedType] = useState<TicketType>('repair');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    Alert.alert('Success', 'Your ticket has been submitted successfully', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Create Ticket',
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ticket Type *</Text>
          <View style={styles.typesGrid}>
            {ticketTypes.map((type) => {
              const Icon = type.icon;
              return (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeCard,
                    selectedType === type.value && styles.typeCardActive,
                  ]}
                  onPress={() => setSelectedType(type.value)}
                  activeOpacity={0.7}
                >
                  <Icon
                    size={24}
                    color={selectedType === type.value ? Colors.light.primary : Colors.light.textSecondary}
                  />
                  <Text
                    style={[
                      styles.typeLabel,
                      selectedType === type.value && styles.typeLabelActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                  <Text style={styles.typeDescription}>{type.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority *</Text>
          <View style={styles.priorityRow}>
            {(['low', 'medium', 'high'] as TicketPriority[]).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityChip,
                  priority === p && styles.priorityChipActive,
                ]}
                onPress={() => setPriority(p)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    priority === p && styles.priorityTextActive,
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Brief description of the issue"
            placeholderTextColor={Colors.light.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Provide detailed information about your request"
            placeholderTextColor={Colors.light.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments (Optional)</Text>
          <TouchableOpacity style={styles.attachmentButton} activeOpacity={0.7}>
            <Camera size={20} color={Colors.light.primary} />
            <Text style={styles.attachmentButtonText}>Add Photos or Videos</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Ticket</Text>
        </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '48%',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    padding: 16,
    alignItems: 'center',
  },
  typeCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '10',
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 8,
    marginBottom: 4,
  },
  typeLabelActive: {
    color: Colors.light.primary,
  },
  typeDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  priorityChipActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  priorityTextActive: {
    color: Colors.light.surface,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.light.text,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 14,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    paddingVertical: 16,
    gap: 8,
  },
  attachmentButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
});
