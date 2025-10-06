import React, { useState, useEffect } from 'react'
import AnimationContainer from './components/AnimationContainer'
import ScenePanel from './components/ScenePanel'
import KonvaSceneEditor from './components/KonvaSceneEditor'
import Toolbar from './components/Toolbar'
import sampleStory from './data/scenes'

function App() {
  const [scenes, setScenes] = useState(() => {
    const saved = localStorage.getItem('whiteboard-scenes')
    return saved ? JSON.parse(saved) : sampleStory
  })
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

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
      objects: []
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
      title: `${sceneToDuplicate.title} (Copie)`
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

  return (
    <div className="app flex h-screen overflow-hidden dark">
      {/* Left Panel - Scenes List */}
      <ScenePanel
        scenes={scenes}
        selectedSceneIndex={selectedSceneIndex}
        onSelectScene={setSelectedSceneIndex}
        onAddScene={addScene}
        onDeleteScene={deleteScene}
        onDuplicateScene={duplicateScene}
        onMoveScene={moveScene}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <Toolbar onOpenEditor={() => setIsEditorOpen(true)} />

        {/* Animation Container */}
        <AnimationContainer 
          scenes={scenes} 
          selectedSceneIndex={selectedSceneIndex}
          onSelectScene={setSelectedSceneIndex}
          onOpenEditor={() => setIsEditorOpen(true)}
        />
      </div>

      {/* Scene Editor Modal */}
      {isEditorOpen && (
        <KonvaSceneEditor
          scene={scenes[selectedSceneIndex]}
          onClose={() => setIsEditorOpen(false)}
          onSave={(updatedScene) => {
            updateScene(selectedSceneIndex, updatedScene)
            setIsEditorOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default App
