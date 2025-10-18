import React from 'react';
import { LayersList } from '../molecules';
import LayerEditor from './LayerEditor';
import PropertiesPanel from './PropertiesPanel';
import AssetLibrary from './AssetLibrary';
import ShapeToolbar from './ShapeToolbar';
import ScenePanel from './ScenePanel';
import ContextTabs from './ContextTabs';
import { useScenes, useSceneStore, useCurrentScene } from '@/app/scenes';

const AnimationContainer: React.FC = () => {
  const currentScene = useCurrentScene();
  const showShapeToolbar = useSceneStore((state: any) => state.showShapeToolbar);
  const showAssetLibrary = useSceneStore((state: any) => state.showAssetLibrary);

  return (
    <div className="animation-container">
      {showAssetLibrary && <AssetLibrary />}
      {showShapeToolbar && <ShapeToolbar />}
      <div className="flex flex-col h-screen">
        {/* Main content area with left context tabs, center editor, and right properties */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Context Tabs Panel */}
          <div className="w-64 flex-shrink-0">
            <ContextTabs />
          </div>
          
          {/* Center: Layer Editor */}
          <div className="flex-1 overflow-y-auto">
            {currentScene && <LayerEditor />}
          </div>
          
          {/* Right: Properties Panel */}
          <div className="w-80 flex-shrink-0">
            {currentScene && <PropertiesPanel />}
          </div>
        </div>
        
        {/* Bottom: Scenes Panel */}
        <div className="h-48 border-t border-border overflow-y-auto flex-shrink-0">
          <ScenePanel />
        </div>
      </div>
    </div>
  );
};

export { AnimationContainer };