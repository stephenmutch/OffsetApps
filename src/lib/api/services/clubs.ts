import { useApi } from '../hooks';
import { Club } from '../types';
import { useState, useEffect } from 'react';

/**
 * Hook for managing club data from the Offset API
 */
export function useClubs() {
  const { request, loading, error } = useApi();
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const result = await request(client => client.getClubs());
    if (result) {
      // Convert record to array and add id
      const clubsArray = Object.entries(result).map(([id, club]) => ({
        ...club,
        id
      }));
      setClubs(clubsArray);
    }
  };

  const getClub = async (id: string) => {
    return await request(client => client.getClub(id));
  };

  return {
    clubs,
    loading,
    error,
    fetchClubs,
    getClub
  };
}