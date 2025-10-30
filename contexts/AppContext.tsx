import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { User, FilterOptions } from '@/types';
import { mockProperties } from '@/mocks/properties';
import { mockServiceProviders } from '@/mocks/services';

export const [AppProvider, useApp] = createContextHook(() => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u10',
    name: 'James Ochieng',
    email: 'james@example.com',
    phone: '+254712345678',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=35',
    verified: true,
    subscriptionTier: 'free',
    rewardPoints: 125,
  });

  const [favorites, setFavorites] = useState<string[]>(['p1', 'p3']);
  const [following, setFollowing] = useState<string[]>(['s2', 's4']);

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      }
      return [...prev, propertyId];
    });
  }, []);

  const toggleFollow = useCallback((providerId: string) => {
    setFollowing((prev) => {
      if (prev.includes(providerId)) {
        return prev.filter((id) => id !== providerId);
      }
      return [...prev, providerId];
    });
  }, []);

  const isFavorite = useCallback(
    (propertyId: string) => {
      return favorites.includes(propertyId);
    },
    [favorites]
  );

  const isFollowing = useCallback(
    (providerId: string) => {
      return following.includes(providerId);
    },
    [following]
  );

  const getFilteredProperties = useCallback((filters: FilterOptions) => {
    let filtered = [...mockProperties];

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.propertyType) {
      filtered = filtered.filter((p) => p.propertyType === filters.propertyType);
    }

    if (filters.city) {
      filtered = filtered.filter((p) =>
        p.location.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.bedrooms !== undefined) {
      filtered = filtered.filter((p) => p.bedrooms === filters.bedrooms);
    }

    if (filters.bathrooms !== undefined) {
      filtered = filtered.filter((p) => p.bathrooms === filters.bathrooms);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.location.address.toLowerCase().includes(query) ||
          p.location.city.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => {
      if (a.boosted && !b.boosted) return -1;
      if (!a.boosted && b.boosted) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, []);

  const getFilteredServiceProviders = useCallback((searchQuery: string) => {
    if (!searchQuery) {
      return [...mockServiceProviders].sort((a, b) => {
        if (a.boosted && !b.boosted) return -1;
        if (!a.boosted && b.boosted) return 1;
        return b.rating - a.rating;
      });
    }

    const query = searchQuery.toLowerCase();
    return mockServiceProviders
      .filter(
        (sp) =>
          sp.businessName.toLowerCase().includes(query) ||
          sp.description.toLowerCase().includes(query) ||
          sp.category.toLowerCase().includes(query) ||
          sp.subCategories.some((cat) => cat.toLowerCase().includes(query))
      )
      .sort((a, b) => {
        if (a.boosted && !b.boosted) return -1;
        if (!a.boosted && b.boosted) return 1;
        return b.rating - a.rating;
      });
  }, []);

  return useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      favorites,
      following,
      toggleFavorite,
      toggleFollow,
      isFavorite,
      isFollowing,
      getFilteredProperties,
      getFilteredServiceProviders,
      allProperties: mockProperties,
      allServiceProviders: mockServiceProviders,
    }),
    [
      currentUser,
      favorites,
      following,
      toggleFavorite,
      toggleFollow,
      isFavorite,
      isFollowing,
      getFilteredProperties,
      getFilteredServiceProviders,
    ]
  );
});
