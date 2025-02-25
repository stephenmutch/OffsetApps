import { useApi } from '../hooks';
import { Group } from '../types';
import { useState, useEffect } from 'react';

/**
 * Hook for managing group data from the Offset API
 */
export function useGroups() {
  const { request, loading, error } = useApi();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const result = await request(client => client.getGroups());
    if (result) {
      setGroups(result);
    }
  };

  const getGroup = async (id: string) => {
    return await request(client => client.getGroup(id));
  };

  return {
    groups,
    loading,
    error,
    fetchGroups,
    getGroup
  };
}