import React from 'react';
import HandWritingAnimation from '../components/HandWritingAnimation';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * Test page for HandWritingAnimation component
 * This page allows testing the hand-writing animation feature in isolation
 */
const HandWritingTest = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto py-8">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main App
          </Button>
        )}
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hand Writing Animation Test
          </h1>
          <p className="text-gray-400">
            Standalone test component for the JavaScript hand-writing animation implementation
          </p>
        </div>
        
        <HandWritingAnimation />
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>This is a JavaScript port of the Python sketchApi.py</p>
          <p>Located in: src/components/HandWritingAnimation.jsx</p>
        </div>
      </div>
    </div>
  );
};

export default HandWritingTest;
