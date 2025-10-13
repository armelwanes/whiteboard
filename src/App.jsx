import React, { useState, useEffect, useRef } from 'react'
import AnimationContainer from './components/AnimationContainer'
import ScenePanel from './components/ScenePanel'
import PropertiesPanel from './components/PropertiesPanel'
import Toolbar from './components/Toolbar'
import HandWritingTest from './pages/HandWritingTest'
import ShapeToolbar from './components/ShapeToolbar'
import sampleStory from './data/scenes'
import { createMultiTimeline } from './utils/multiTimelineSystem'
import { createSceneAudioConfig } from './utils/audioManager'

function App() {
  const [scenes, setScenes] = useState(() => {
    const saved = localStorage.getItem('whiteboard-scenes')
    return saved ? JSON.parse(saved) : sampleStory
  })
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0)
  const [showHandWritingTest, setShowHandWritingTest] = useState(false)
  const [showShapeToolbar, setShowShapeToolbar] = useState(false)
  const [selectedLayerId, setSelectedLayerId] = useState(null)
  const fileInputRef = useRef(null)

  // Save scenes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('whiteboard-scenes', JSON.stringify(scenes))
  }, [scenes])

  const addScene = () => {
    const newScene = {
      id: `scene-${Date.now()}`,
      title: 'Nouvelle Scène',
      content: 'Ajoutez votre contenu ici...',
      duration: 5,
      backgroundImage: null,
      animation: 'fade',
      layers: [],
      cameras: [],
      sceneCameras: [],
      multiTimeline: createMultiTimeline(5),
      audio: createSceneAudioConfig()
    }
    setScenes([...scenes, newScene])
    setSelectedSceneIndex(scenes.length)
  }

  const deleteScene = (index) => {
    if (scenes.length <= 1) {
      alert('Vous devez avoir au moins une scène')
      return
    }
    const newScenes = scenes.filter((_, i) => i !== index)
    setScenes(newScenes)
    if (selectedSceneIndex >= newScenes.length) {
      setSelectedSceneIndex(newScenes.length - 1)
    }
  }

  const duplicateScene = (index) => {
    const sceneToDuplicate = scenes[index]
    const duplicatedScene = {
      ...sceneToDuplicate,
      id: `scene-${Date.now()}`,
      title: `${sceneToDuplicate.title} (Copie)`,
      multiTimeline: sceneToDuplicate.multiTimeline || createMultiTimeline(sceneToDuplicate.duration)
    }
    const newScenes = [...scenes]
    newScenes.splice(index + 1, 0, duplicatedScene)
    setScenes(newScenes)
  }

  const updateScene = (index, updatedScene) => {
    const newScenes = [...scenes]
    newScenes[index] = { ...newScenes[index], ...updatedScene }
    setScenes(newScenes)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const currentScene = scenes[selectedSceneIndex]
        const newLayer = {
          id: `layer-${Date.now()}`,
          image_path: event.target.result,
          name: file.name,
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
        setSelectedLayerId(newLayer.id)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateLayer = (updatedLayer) => {
    const currentScene = scenes[selectedSceneIndex]
    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: (currentScene.layers || []).map(layer =>
        layer.id === updatedLayer.id ? updatedLayer : layer
      )
    })
  }

  const handleDeleteLayer = (layerId) => {
    const currentScene = scenes[selectedSceneIndex]
    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: (currentScene.layers || []).filter(layer => layer.id !== layerId)
    })
    setSelectedLayerId(null)
  }

  const handleAddShape = (shapeLayer) => {
    const currentScene = scenes[selectedSceneIndex]
    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), shapeLayer]
    })
    setSelectedLayerId(shapeLayer.id)
    setShowShapeToolbar(false)
  }

  const handleDuplicateLayer = (layerId) => {
    const currentScene = scenes[selectedSceneIndex]
    const layerToDuplicate = currentScene.layers?.find(l => l.id === layerId)
    if (layerToDuplicate) {
      const duplicatedLayer = {
        ...layerToDuplicate,
        id: `layer-${Date.now()}`,
        name: `${layerToDuplicate.name} (Copie)`,
        position: {
          x: (layerToDuplicate.position?.x || 0) + 20,
          y: (layerToDuplicate.position?.y || 0) + 20,
        }
      }
      updateScene(selectedSceneIndex, {
        ...currentScene,
        layers: [...(currentScene.layers || []), duplicatedLayer]
      })
    }
  }

  const handleMoveLayer = (layerId, direction) => {
    const currentScene = scenes[selectedSceneIndex]
    const layers = currentScene.layers || []
    const currentIndex = layers.findIndex(l => l.id === layerId)
    if (currentIndex === -1) return

    const newLayers = [...layers]
    if (direction === 'up' && currentIndex > 0) {
      [newLayers[currentIndex], newLayers[currentIndex - 1]] = 
        [newLayers[currentIndex - 1], newLayers[currentIndex]]
    } else if (direction === 'down' && currentIndex < newLayers.length - 1) {
      [newLayers[currentIndex], newLayers[currentIndex + 1]] = 
        [newLayers[currentIndex + 1], newLayers[currentIndex]]
    }

    // Update z_index based on new order
    newLayers.forEach((layer, index) => {
      layer.z_index = index + 1
    })

    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: newLayers
    })
  }

  const moveScene = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === scenes.length - 1)
    ) {
      return
    }
    const newScenes = [...scenes]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newScenes[index], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[index]]
    setScenes(newScenes)
    setSelectedSceneIndex(targetIndex)
  }

  // Export scenes configuration to JSON
  const handleExportConfig = () => {
    const config = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      scenes: scenes
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
  }

  // Import scenes configuration from JSON
  const handleImportConfig = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target.result)
        if (config.scenes && Array.isArray(config.scenes)) {
          setScenes(config.scenes)
          setSelectedSceneIndex(0)
          alert('Configuration importée avec succès!')
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

  return (
    <div className="app flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Shape Toolbar Modal */}
      {showShapeToolbar && (
        <ShapeToolbar
          onAddShape={handleAddShape}
          onClose={() => setShowShapeToolbar(false)}
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
