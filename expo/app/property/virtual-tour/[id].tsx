import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Maximize2,
  Info,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

interface Room {
  id: string;
  name: string;
  image: string;
  hotspots: Hotspot[];
}

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
  targetRoomId?: string;
}

const mockRooms: Room[] = [
  {
    id: 'living',
    name: 'Living Room',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800',
    hotspots: [
      {
        id: 'h1',
        x: 40,
        y: 50,
        label: 'Kitchen',
        description: 'View the modern kitchen',
        targetRoomId: 'kitchen',
      },
      {
        id: 'h2',
        x: 75,
        y: 60,
        label: 'Sofa',
        description: 'Comfortable L-shaped sofa with premium fabric',
      },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
    hotspots: [
      {
        id: 'h3',
        x: 50,
        y: 45,
        label: 'Back to Living Room',
        description: 'Return to living room',
        targetRoomId: 'living',
      },
      {
        id: 'h4',
        x: 30,
        y: 70,
        label: 'Appliances',
        description: 'Stainless steel appliances included',
      },
    ],
  },
  {
    id: 'bedroom',
    name: 'Master Bedroom',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    hotspots: [
      {
        id: 'h5',
        x: 50,
        y: 50,
        label: 'Closet',
        description: 'Walk-in closet with built-in organizers',
      },
    ],
  },
];

export default function VirtualTour() {
  const { id } = useLocalSearchParams();
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  const currentRoom = mockRooms[currentRoomIndex];

  const navigateToRoom = (roomId: string) => {
    const index = mockRooms.findIndex((r) => r.id === roomId);
    if (index !== -1) {
      setCurrentRoomIndex(index);
      setSelectedHotspot(null);
    }
  };

  const nextRoom = () => {
    if (currentRoomIndex < mockRooms.length - 1) {
      setCurrentRoomIndex(currentRoomIndex + 1);
      setSelectedHotspot(null);
    }
  };

  const prevRoom = () => {
    if (currentRoomIndex > 0) {
      setCurrentRoomIndex(currentRoomIndex - 1);
      setSelectedHotspot(null);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: currentRoom.image }}
        style={styles.panorama}
        resizeMode="cover"
      />

      {currentRoom.hotspots.map((hotspot) => (
        <TouchableOpacity
          key={hotspot.id}
          style={[
            styles.hotspot,
            {
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
            },
          ]}
          onPress={() => {
            if (hotspot.targetRoomId) {
              navigateToRoom(hotspot.targetRoomId);
            } else {
              setSelectedHotspot(hotspot);
            }
          }}
        >
          <View style={styles.hotspotDot} />
          <View style={styles.hotspotPulse} />
        </TouchableOpacity>
      ))}

      {selectedHotspot && (
        <View style={styles.infoCard}>
          <TouchableOpacity
            style={styles.closeInfo}
            onPress={() => setSelectedHotspot(null)}
          >
            <X size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.infoTitle}>{selectedHotspot.label}</Text>
          <Text style={styles.infoDescription}>
            {selectedHotspot.description}
          </Text>
        </View>
      )}

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.roomName}>{currentRoom.name}</Text>
            <Text style={styles.roomInfo}>
              {currentRoomIndex + 1} of {mockRooms.length} rooms
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowInfo(!showInfo)}
            style={styles.headerButton}
          >
            <Info size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomControls}>
          {showInfo && (
            <View style={styles.instructions}>
              <Text style={styles.instructionsText}>
                Tap the glowing dots to explore or navigate between rooms
              </Text>
            </View>
          )}

          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentRoomIndex === 0 && styles.navButtonDisabled,
              ]}
              onPress={prevRoom}
              disabled={currentRoomIndex === 0}
            >
              <ChevronLeft size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => console.log('Fullscreen')}
            >
              <Maximize2 size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                currentRoomIndex === mockRooms.length - 1 &&
                  styles.navButtonDisabled,
              ]}
              onPress={nextRoom}
              disabled={currentRoomIndex === mockRooms.length - 1}
            >
              <ChevronRight size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailList}
            contentContainerStyle={styles.thumbnailContent}
          >
            {mockRooms.map((room, index) => (
              <TouchableOpacity
                key={room.id}
                style={[
                  styles.thumbnail,
                  index === currentRoomIndex && styles.thumbnailActive,
                ]}
                onPress={() => setCurrentRoomIndex(index)}
              >
                <Image
                  source={{ uri: room.image }}
                  style={styles.thumbnailImage}
                />
                <Text style={styles.thumbnailText}>{room.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  panorama: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  roomName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
  },
  roomInfo: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  hotspot: {
    position: 'absolute',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotspotDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  hotspotPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  infoCard: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeInfo: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
    marginRight: 32,
  },
  infoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bottomControls: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  instructions: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  thumbnailList: {
    maxHeight: 100,
  },
  thumbnailContent: {
    gap: 12,
    paddingVertical: 4,
  },
  thumbnail: {
    width: 100,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: 60,
  },
  thumbnailText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#fff',
    textAlign: 'center',
    padding: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});
