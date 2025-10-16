import { useScenes } from './useScenes';
import { useSceneStore } from '../store';

/**
 * Hook to get the currently selected scene
 * @returns The currently selected scene or null if no scene is selected
 */
export const useCurrentScene = () => {
  const { scenes } = useScenes();
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  
  return scenes[selectedSceneIndex] || null;
};
