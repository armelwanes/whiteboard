import React from 'react'
import AnimationContainer from './components/AnimationContainer'
import sampleStory from './data/scenes'

function App() {
  return (
    <div className="app">
      <AnimationContainer scenes={sampleStory} />
    </div>
  )
}

export default App
