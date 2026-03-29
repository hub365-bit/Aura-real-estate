# 🔌 Backend Usage Examples

This document shows how to integrate the backend API into your frontend screens.

## Setup

The tRPC client is already configured in `lib/trpc.ts`. You can use it in two ways:

1. **In React components** - Use `trpc` hooks
2. **Outside React** - Use `trpcClient` directly

## Example 1: Login Screen Integration

### Original (Mock):
```typescript
const handleLogin = () => {
  Alert.alert('Success', 'Login successful!', [
    { text: 'OK', onPress: () => router.replace('/(tabs)') }
  ]);
};
```

### With Backend:
```typescript
import { trpc } from '@/lib/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      // Store auth token
      await AsyncStorage.setItem('authToken', data.token);
      
      // Store user data
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      
      Alert.alert('Success', 'Login successful!');
      router.replace('/(tabs)');
    },
    onError: (error) => {
      Alert.alert('Login Failed', error.message);
    }
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    // ... UI code
    <TouchableOpacity 
      style={styles.loginButton} 
      onPress={handleLogin}
      disabled={loginMutation.isLoading}
    >
      <Text style={styles.loginButtonText}>
        {loginMutation.isLoading ? 'Signing In...' : 'Sign In'}
      </Text>
    </TouchableOpacity>
  );
}
```

## Example 2: Properties List

### With Backend:
```typescript
import { trpc } from '@/lib/trpc';

export default function PropertiesScreen() {
  const [filter, setFilter] = useState<'rental' | 'sale'>('rental');
  
  const { data, isLoading, error, refetch } = trpc.properties.list.useQuery({
    type: filter,
    available: true,
    limit: 20,
    offset: 0,
  });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading properties...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <Text>Error: {error.message}</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={data?.properties || []}
      renderItem={({ item }) => <PropertyCard property={item} />}
      onRefresh={refetch}
      refreshing={isLoading}
    />
  );
}
```

## Example 3: Create Property Listing

```typescript
import { trpc } from '@/lib/trpc';

export default function CreatePropertyScreen() {
  const router = useRouter();
  
  const createPropertyMutation = trpc.properties.create.useMutation({
    onSuccess: (data) => {
      Alert.alert('Success', 'Property listed successfully!');
      router.back();
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    }
  });

  const handleSubmit = () => {
    createPropertyMutation.mutate({
      type: 'rental',
      title: 'Modern 2BR Apartment',
      description: 'Beautiful apartment in Westlands',
      price: 75000,
      currency: 'KSh',
      category: 'Apartment',
      location: {
        address: 'Westlands, Nairobi',
        lat: -1.2696,
        lng: 36.8065,
        area: 'Westlands',
        city: 'Nairobi',
        country: 'Kenya'
      },
      images: ['url1', 'url2'],
      videos: [],
      amenities: ['WiFi', 'Parking', 'Security'],
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200
    });
  };

  return (
    <TouchableOpacity 
      onPress={handleSubmit}
      disabled={createPropertyMutation.isLoading}
    >
      <Text>
        {createPropertyMutation.isLoading ? 'Creating...' : 'Create Listing'}
      </Text>
    </TouchableOpacity>
  );
}
```

## Example 4: Booking Creation

```typescript
import { trpc } from '@/lib/trpc';

export default function BookPropertyScreen() {
  const router = useRouter();
  const { id: propertyId } = useLocalSearchParams();
  
  const createBookingMutation = trpc.bookings.create.useMutation({
    onSuccess: (data) => {
      // Navigate to booking details with QR code
      router.push(`/booking/details/${data.booking.id}`);
    },
    onError: (error) => {
      Alert.alert('Booking Failed', error.message);
    }
  });

  const handleBook = () => {
    createBookingMutation.mutate({
      propertyId: propertyId as string,
      checkIn: new Date('2024-02-01'),
      checkOut: new Date('2024-02-05'),
      guests: 2,
      specialRequests: 'Early check-in if possible'
    });
  };

  return (
    <TouchableOpacity onPress={handleBook}>
      <Text>Book Now</Text>
    </TouchableOpacity>
  );
}
```

## Example 5: Analytics Dashboard

```typescript
import { trpc } from '@/lib/trpc';

export default function AnalyticsDashboard() {
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  const endDate = new Date();

  const { data, isLoading } = trpc.analytics.dashboard.useQuery({
    startDate,
    endDate
  });

  if (isLoading) return <ActivityIndicator />;

  return (
    <ScrollView>
      <Text>Total Properties: {data?.overview.totalProperties}</Text>
      <Text>Total Views: {data?.overview.totalViews}</Text>
      <Text>Completed Bookings: {data?.overview.completedBookings}</Text>
      <Text>Revenue: KSh {data?.overview.totalRevenue.toLocaleString()}</Text>
      
      {/* Render chart with data?.chartData */}
    </ScrollView>
  );
}
```

## Example 6: Rewards & Leaderboard

```typescript
import { trpc } from '@/lib/trpc';

export default function RewardsScreen() {
  const { data, isLoading } = trpc.rewards.get.useQuery();
  const addPointsMutation = trpc.rewards.addPoints.useMutation();

  const handleAction = (action: 'comment' | 'rating' | 'booking') => {
    const points = { comment: 20, rating: 50, booking: 30 }[action];
    
    addPointsMutation.mutate({ action, points }, {
      onSuccess: (data) => {
        Alert.alert('Reward!', `You earned ${data.earned} points!`);
      }
    });
  };

  return (
    <View>
      <Text>Your Points: {data?.points}</Text>
      <Text>Your Rank: #{data?.userRank}</Text>
      
      <FlatList
        data={data?.leaderboard}
        renderItem={({ item }) => (
          <View>
            <Text>#{item.rank} {item.name}</Text>
            <Text>{item.points} points</Text>
          </View>
        )}
      />
    </View>
  );
}
```

## Example 7: Notifications

```typescript
import { trpc } from '@/lib/trpc';

export default function NotificationsScreen() {
  const { data, refetch } = trpc.notifications.list.useQuery({
    unreadOnly: false
  });
  
  const markReadMutation = trpc.notifications.markRead.useMutation({
    onSuccess: () => {
      refetch(); // Refresh the list
    }
  });

  const handleMarkRead = (id: string) => {
    markReadMutation.mutate({ id });
  };

  return (
    <View>
      <Text>Unread: {data?.unreadCount}</Text>
      
      <FlatList
        data={data?.notifications}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleMarkRead(item.id)}>
            <View style={!item.read && styles.unread}>
              <Text>{item.title}</Text>
              <Text>{item.message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
```

## Example 8: Create Review

```typescript
import { trpc } from '@/lib/trpc';

export default function CreateReviewScreen() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const createReviewMutation = trpc.reviews.create.useMutation({
    onSuccess: () => {
      // Award points for review
      addPointsMutation.mutate({ action: 'rating', points: 50 });
      
      Alert.alert('Success', 'Review submitted!');
      router.back();
    }
  });

  const addPointsMutation = trpc.rewards.addPoints.useMutation();

  const handleSubmit = () => {
    createReviewMutation.mutate({
      propertyId: propertyId as string,
      rating,
      comment,
      images: []
    });
  };

  return (
    <View>
      {/* Rating stars UI */}
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Share your experience..."
        multiline
      />
      
      <TouchableOpacity onPress={handleSubmit}>
        <Text>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## Example 9: Social Posts Feed

```typescript
import { trpc } from '@/lib/trpc';

export default function FeedScreen() {
  const [offset, setOffset] = useState(0);
  
  const { data, isLoading, fetchNextPage, hasNextPage } = 
    trpc.posts.list.useInfiniteQuery(
      {
        type: 'post',
        limit: 10
      },
      {
        getNextPageParam: (lastPage) => 
          lastPage.hasMore ? lastPage.posts.length : undefined,
      }
    );

  const posts = data?.pages.flatMap(page => page.posts) ?? [];

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
    />
  );
}
```

## Example 10: Create Business Page

```typescript
import { trpc } from '@/lib/trpc';

export default function CreateBusinessScreen() {
  const router = useRouter();
  
  const createBusinessMutation = trpc.businesses.create.useMutation({
    onSuccess: (data) => {
      Alert.alert('Success', 'Business page created!');
      router.push(`/business/${data.business.id}`);
    }
  });

  const handleCreate = () => {
    createBusinessMutation.mutate({
      name: 'Westlands Properties',
      description: 'Premium real estate in Westlands area',
      category: 'Real Estate',
      logo: 'https://example.com/logo.png',
      location: {
        address: 'Westlands, Nairobi',
        lat: -1.2696,
        lng: 36.8065
      }
    });
  };

  return (
    <TouchableOpacity onPress={handleCreate}>
      <Text>Create Business Page</Text>
    </TouchableOpacity>
  );
}
```

## Using tRPC Outside React Components

```typescript
// lib/utils/booking-helper.ts
import { trpcClient } from '@/lib/trpc';

export async function createQuickBooking(propertyId: string) {
  try {
    const result = await trpcClient.bookings.create.mutate({
      propertyId,
      checkIn: new Date(),
      checkOut: new Date(Date.now() + 86400000),
      guests: 1
    });
    
    return result.booking;
  } catch (error) {
    console.error('Booking failed:', error);
    throw error;
  }
}

export async function fetchPropertyDetails(id: string) {
  const property = await trpcClient.properties.get.query({ id });
  return property;
}
```

## Auth Context Integration

```typescript
// contexts/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trpcClient } from '@/lib/trpc';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Load stored auth on app start
    AsyncStorage.getItem('authToken').then(setToken);
    AsyncStorage.getItem('user').then(data => 
      data && setUser(JSON.parse(data))
    );
  }, []);

  const login = async (email: string, password: string) => {
    const result = await trpcClient.auth.login.mutate({ email, password });
    
    await AsyncStorage.setItem('authToken', result.token);
    await AsyncStorage.setItem('user', JSON.stringify(result.user));
    
    setToken(result.token);
    setUser(result.user);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['authToken', 'user']);
    setToken(null);
    setUser(null);
  };

  return { user, token, login, logout };
});
```

## Key Points

1. **Always handle loading states** - Show loading indicators
2. **Handle errors gracefully** - Show user-friendly error messages
3. **Refresh data** - Use `refetch()` or `invalidateQueries()`
4. **Optimistic updates** - Update UI immediately, rollback on error
5. **Store auth token** - Use AsyncStorage for persistence
6. **Use React Query features** - Caching, refetching, pagination

## Testing

```typescript
// Test in console or test file
import { trpcClient } from '@/lib/trpc';

// Test login
const loginResult = await trpcClient.auth.login.mutate({
  email: 'test@example.com',
  password: 'password123'
});
console.log('Token:', loginResult.token);

// Test fetching properties
const properties = await trpcClient.properties.list.query({
  type: 'rental',
  limit: 5
});
console.log('Properties:', properties.properties);
```

---

✅ All backend routes are ready to use! Replace mock data in your screens with these tRPC calls.
