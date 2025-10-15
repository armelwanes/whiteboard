import React, { useState, useEffect, useRef } from 'react'
import { AnimationContainer, ScenePanel, ShapeToolbar, AssetLibrary } from './components/organisms'
import HandWritingTest from './pages/HandWritingTest'
import { useScenes } from './app/scenes'
import { MAX_HISTORY_STATES } from './config/constants'

function App() {
  const {
    scenes,
    loading,
    updateScene: updateSceneService,
    deleteScene: deleteSceneService,
    duplicateScene: duplicateSceneService,
    moveScene: moveSceneService,
    createScene: createSceneService,
  } = useScenes()

  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0)
  const [showHandWritingTest, setShowHandWritingTest] = useState(false)
  const [showShapeToolbar, setShowShapeToolbar] = useState(false)
  const [showAssetLibrary, setShowAssetLibrary] = useState(false)

  // Undo/Redo state management
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const isUndoRedoAction = useRef(false)

  // Add to history stack whenever scenes change
  useEffect(() => {
    if (!isUndoRedoAction.current && scenes.length > 0) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(JSON.parse(JSON.stringify(scenes)))
      
      if (newHistory.length > MAX_HISTORY_STATES) {
        newHistory.shift()
      } else {
        setHistoryIndex(historyIndex + 1)
      }
      setHistory(newHistory)
    }
    isUndoRedoAction.current = false
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes])

  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true
      setHistoryIndex(historyIndex - 1)
      // TODO: Restore scenes from history using the service
      console.log('Undo not yet implemented with new architecture')
    }
  }

  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true
      setHistoryIndex(historyIndex + 1)
      // TODO: Restore scenes from history using the service
      console.log('Redo not yet implemented with new architecture')
    }
  }

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }
      // Ctrl+Y or Cmd+Y or Ctrl+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        handleRedo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyIndex, history])

  const addScene = async () => {
    try {
      await createSceneService()
      setSelectedSceneIndex(scenes.length)
    } catch (error) {
      alert('Erreur lors de la création de la scène: ' + error.message)
    }
  }

  const deleteScene = async (index) => {
    const sceneId = scenes[index]?.id
    if (!sceneId) return

    try {
      await deleteSceneService(sceneId)
      if (selectedSceneIndex >= scenes.length - 1) {
        setSelectedSceneIndex(Math.max(0, scenes.length - 2))
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const duplicateScene = async (index) => {
    const sceneId = scenes[index]?.id
    if (!sceneId) return

    try {
      await duplicateSceneService(sceneId)
    } catch (error) {
      alert('Erreur lors de la duplication: ' + error.message)
    }
  }

  const updateScene = async (index, updatedScene) => {
    const sceneId = scenes[index]?.id
    if (!sceneId) return

    try {
      await updateSceneService(sceneId, updatedScene)
    } catch (error) {
      console.error('Error updating scene:', error)
    }
  }

  const moveScene = (index, direction) => {
    moveSceneService(index, direction)
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    setSelectedSceneIndex(targetIndex)
  }


  const handleSelectAssetFromLibrary = (asset) => {
    const currentScene = scenes[selectedSceneIndex]
    if (!currentScene) return

    const newLayer = {
      id: `layer-${Date.now()}`,
      image_path: asset.dataUrl,
      name: asset.name,
      position: { x: 100, y: 100 },
      z_index: (currentScene.layers?.length || 0) + 1,
      skip_rate: 10,
      scale: 1.0,
      opacity: 1.0,
      mode: 'draw',
      type: 'image',
    }
    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), newLayer]
    })
  }

  const handleAddShape = (shapeLayer) => {
    const currentScene = scenes[selectedSceneIndex]
    if (!currentScene) return

    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), shapeLayer]
    })
    setShowShapeToolbar(false)
  }

  // Export scenes configuration to JSON with camera images
  const handleExportConfig = async () => {
    try {
      // Import camera exporter dynamically
      const { exportAllCameras } = await import('./utils/cameraExporter')
      
      // Enhanced scenes with camera images
      const enhancedScenes = await Promise.all(scenes.map(async (scene) => {
        // Export all cameras for this scene if they exist
        if (scene.sceneCameras && scene.sceneCameras.length > 0) {
          try {
            const cameraExports = await exportAllCameras(scene, 1920, 1080)
            
            // Add image data URLs and pixel positions to each camera
            const sceneCamerasWithImages = scene.sceneCameras.map(camera => {
              const cameraExport = cameraExports.find(exp => exp.camera.id === camera.id)
              return {
                ...camera,
                exportedImageDataUrl: cameraExport ? cameraExport.imageDataUrl : null,
                pixelPosition: cameraExport?.camera?.pixelPosition || cameraExport?.config?.pixelPosition || null,
                topLeftPixelPosition: cameraExport?.camera?.topLeftPixelPosition || cameraExport?.config?.topLeftPixelPosition || null
              }
            })
            
            return {
              ...scene,
              sceneCameras: sceneCamerasWithImages
            }
          } catch (err) {
            console.error('Error exporting cameras for scene:', scene.id, err)
            return scene
          }
        }
        return scene
      }))

      const config = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        scenes: enhancedScenes,
        metadata: {
          sceneCount: scenes.length,
          totalDuration: scenes.reduce((sum, s) => sum + s.duration, 0),
          includesCameraImages: true
        }
      }
      
      const jsonString = JSON.stringify(config, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `whiteboard-config-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('Configuration exportée avec succès avec les images des caméras!')
    } catch (error) {
      console.error('Error exporting config:', error)
      alert('Erreur lors de l\'export: ' + error.message)
    }
  }

  // Import scenes configuration from JSON
  const handleImportConfig = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const config = JSON.parse(event.target.result)
        if (config.scenes && Array.isArray(config.scenes)) {
          // Use the service to bulk update scenes
          const scenesService = (await import('./app/scenes')).scenesService
          await scenesService.bulkUpdate(config.scenes)
          // Reload scenes
          window.location.reload() // Simple approach for now
        } else {
          alert('Format de fichier invalide. Le fichier doit contenir un tableau "scenes".')
        }
      } catch (error) {
        alert('Erreur lors de la lecture du fichier JSON: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  // Show hand writing test if toggled
  if (showHandWritingTest) {
    return <HandWritingTest onBack={() => setShowHandWritingTest(false)} />
  }

  // Show loading state
  if (loading && scenes.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des scènes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Shape Toolbar Modal */}
      {showShapeToolbar && (
        <ShapeToolbar
          onAddShape={handleAddShape}
          onClose={() => setShowShapeToolbar(false)}
        />
      )}

      {/* Asset Library Modal */}
      {showAssetLibrary && (
        <AssetLibrary
          onClose={() => setShowAssetLibrary(false)}
          onSelectAsset={handleSelectAssetFromLibrary}
        />
      )}

      {/* Left Panel - Scenes List */}
      <ScenePanel
        scenes={scenes}
        selectedSceneIndex={selectedSceneIndex}
        onSelectScene={setSelectedSceneIndex}
        onAddScene={addScene}
        onDeleteScene={deleteScene}
        onDuplicateScene={duplicateScene}
        onMoveScene={moveScene}
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Animation Container */}
        <AnimationContainer 
          scenes={scenes} 
          selectedSceneIndex={selectedSceneIndex}
          onSelectScene={setSelectedSceneIndex}
          updateScene={updateScene}
          onOpenShapeToolbar={() => setShowShapeToolbar(true)}
        />
      </div>

      {/* Right Panel - Properties */}
      {/**<PropertiesPanel
        scene={scenes[selectedSceneIndex]}
        selectedLayerId={selectedLayerId}
        onSelectLayer={setSelectedLayerId}
        onUpdateScene={(updatedScene) => updateScene(selectedSceneIndex, updatedScene)}
        onUpdateLayer={handleUpdateLayer}
        onDeleteLayer={handleDeleteLayer}
        onDuplicateLayer={handleDuplicateLayer}
        onMoveLayer={handleMoveLayer}
        onImageUpload={handleImageUpload}
        fileInputRef={fileInputRef}
      />**/}
    </div>
  )
}

export default App
