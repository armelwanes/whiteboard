import { createMultiTimeline } from '../utils/multiTimelineSystem';

// Sample story: "The Journey of Learning"
export const sampleStory = [
  {
    id: 'scene-1',
    title: 'Le Début',
    content: 'Il était une fois un étudiant curieux qui rêvait de maîtriser la programmation...',
    duration: 5,
    backgroundImage: null,
    animation: 'fade',
    layers: [],
    cameras: [],
    multiTimeline: createMultiTimeline(5)
  },
  {
    id: 'scene-2',
    title: 'La Découverte',
    content: 'Il découvre le monde fascinant du développement web avec React et Vite.',
    duration: 5,
    backgroundImage: null,
    animation: 'fade',
    layers: [],
    cameras: [],
    multiTimeline: createMultiTimeline(5)
  },
  {
    id: 'scene-3',
    title: 'Les Défis',
    content: 'Le chemin n\'était pas facile. Chaque bug était une énigme à résoudre.',
    duration: 5,
    backgroundImage: null,
    animation: 'fade',
    layers: [],
    cameras: [],
    multiTimeline: createMultiTimeline(5)
  },
  {
    id: 'scene-4',
    title: 'La Persévérance',
    content: 'Mais avec de la pratique et de la détermination, les compétences se développent.',
    duration: 5,
    backgroundImage: null,
    animation: 'fade',
    layers: [],
    cameras: [],
    multiTimeline: createMultiTimeline(5)
  },
  {
    id: 'scene-5',
    title: 'Le Succès',
    content: 'Finalement, le projet prend vie. Une application magnifique et fonctionnelle!',
    duration: 5,
    backgroundImage: null,
    animation: 'fade',
    layers: [],
    cameras: [],
    multiTimeline: createMultiTimeline(5)
  }
];

// You can add more stories here
export const stories = {
  learning: sampleStory,
  // Add more story templates...
};

export default sampleStory;
