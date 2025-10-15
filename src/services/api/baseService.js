// Base Service for API operations with mock implementation
import localStorageService from '../storage/localStorage';

/**
 * Base service class for CRUD operations
 * Currently uses localStorage as mock, can be replaced with real HTTP client
 */
class BaseService {
  constructor(storageKey, endpoints) {
    this.storageKey = storageKey;
    this.endpoints = endpoints;
  }

  // Simulate API delay
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // List all items
  async list(params = {}) {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    
    // Basic filtering support
    let filtered = items;
    if (params.filter) {
      filtered = items.filter(item => 
        JSON.stringify(item).toLowerCase().includes(params.filter.toLowerCase())
      );
    }

    // Pagination support
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
    };
  }

  // Get single item by ID
  async detail(id) {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    const item = items.find(i => i.id === id);
    
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    return item;
  }

  // Create new item
  async create(payload) {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    
    const newItem = {
      ...payload,
      id: payload.id || `${this.storageKey}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    items.push(newItem);
    localStorageService.set(this.storageKey, items);
    
    return newItem;
  }

  // Update existing item
  async update(id, payload) {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    const index = items.findIndex(i => i.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    items[index] = {
      ...items[index],
      ...payload,
      id, // Preserve ID
      updatedAt: new Date().toISOString(),
    };
    
    localStorageService.set(this.storageKey, items);
    
    return items[index];
  }

  // Delete item
  async delete(id) {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    const filtered = items.filter(i => i.id !== id);
    
    if (filtered.length === items.length) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    localStorageService.set(this.storageKey, filtered);
    
    return { success: true, id };
  }

  // Bulk update
  async bulkUpdate(items) {
    await this.delay();
    localStorageService.set(this.storageKey, items);
    return items;
  }
}

export default BaseService;
