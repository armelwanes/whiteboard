import { useQuery, useQueryClient } from '@tanstack/react-query';
import scenesService from '../api/scenesService';
import sampleStory from '../../../data/scenes';
import { scenesKeys } from '../config';
import { Scene } from '../types';

export const useScenes = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: scenesKeys.lists(),
    queryFn: async () => {
      const result = await scenesService.list({ page: 1, limit: 1000 });
      
      if (result.data.length === 0) {
        const initialScenes = sampleStory || [];
        await scenesService.bulkUpdate(initialScenes);
        return initialScenes;
      }
      
      return result.data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: scenesKeys.lists(),
      refetchType: 'all'
    });
  };

  return {
    scenes: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    invalidate,
  };
};
