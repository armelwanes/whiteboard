import React from 'react';
import { LayersList } from '../molecules';
import LayerEditor from './LayerEditor';
import PropertiesPanel from './PropertiesPanel';
import AssetLibrary from './AssetLibrary';
import ShapeToolbar from './ShapeToolbar';
import ScenePanel from './ScenePanel';
import { useScenes, useSceneStore, useCurrentScene } from '@/app/scenes';

const AnimationContainer: React.FC = () => {
  const currentScene = useCurrentScene();
  const showShapeToolbar = useSceneStore((state: any) => state.showShapeToolbar);
  const showAssetLibrary = useSceneStore((state: any) => state.showAssetLibrary);

  return (
    <div className="animation-container">
      {showAssetLibrary && <AssetLibrary />}
      {showShapeToolbar && <ShapeToolbar />}
      <div className="grid grid-cols-12 gap-3 h-screen">
        <div className="col-span-2 row-span-2 overflow-y-auto">
          <ScenePanel />
        </div>
        <div className="col-span-8 row-span-2 overflow-y-auto">
          {currentScene && <LayerEditor />}
        </div>
        <div className="col-span-2 row-span-2 overflow-y-auto">
          {currentScene && <PropertiesPanel />}
        </div>
        <div className="col-span-12 ">
          {currentScene && <LayersList />}
        </div>
      </div>
    </div>
  );
};

export { AnimationContainer };