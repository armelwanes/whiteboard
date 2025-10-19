import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '../atoms';

interface TagSelectorProps {
  selectedTags: string[];
  availableTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  availableTags,
  onTagsChange,
}) => {
  const [newTag, setNewTag] = useState('');

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !selectedTags.includes(normalizedTag)) {
      onTagsChange([...selectedTags, normalizedTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddNewTag = () => {
    if (newTag.trim()) {
      addTag(newTag);
      setNewTag('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewTag();
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-foreground mb-2 block">
          Tags (catégories)
        </label>
        
        {/* Selected tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-purple-600 text-white px-2 py-1 rounded text-sm"
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:bg-purple-700 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Available tags */}
        {availableTags.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 dark:text-muted-foreground mb-2">
              Tags existants :
            </p>
            <div className="flex flex-wrap gap-2">
              {availableTags
                .filter(tag => !selectedTags.includes(tag))
                .map(tag => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="inline-flex items-center gap-1 bg-gray-200 dark:bg-secondary text-gray-700 dark:text-foreground hover:bg-gray-300 dark:hover:bg-secondary/80 px-2 py-1 rounded text-sm transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    #{tag}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Add new tag input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nouveau tag..."
            className="flex-1 bg-white dark:bg-secondary text-gray-900 dark:text-white text-sm px-3 py-2 rounded border border-gray-300 dark:border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            onClick={handleAddNewTag}
            size="sm"
            className="gap-1"
            disabled={!newTag.trim()}
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-muted-foreground">
        Les tags permettent de catégoriser vos assets (ex: "character", "props", "background")
      </p>
    </div>
  );
};

export default TagSelector;
