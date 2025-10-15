import localStorageService from '../storage/localStorage';

interface ListParams {
  page?: number;
  limit?: number;
  filter?: string;
}

interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

interface DeleteResponse {
  success: boolean;
  id: string;
}

interface Endpoints {
  base?: string;
  list?: string;
  create?: string;
  detail?: (id: string) => string;
  update?: (id: string) => string;
  delete?: (id: string) => string;
  [key: string]: any;
}

class BaseService<T extends { id: string }> {
  protected storageKey: string;
  protected endpoints: Endpoints;

  constructor(storageKey: string, endpoints: Endpoints) {
    this.storageKey = storageKey;
    this.endpoints = endpoints;
  }

  async delay(ms = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async list(params: ListParams = {}): Promise<ListResponse<T>> {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    
    let filtered = items;
    if (params.filter) {
      filtered = items.filter((item: T) => 
        JSON.stringify(item).toLowerCase().includes(params.filter!.toLowerCase())
      );
    }

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

  async detail(id: string): Promise<T> {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    const item = items.find((i: T) => i.id === id);
    
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    return item;
  }

  async create(payload: Partial<T>): Promise<T> {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    
    const newItem = {
      ...payload,
      id: payload.id || `${this.storageKey}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T;
    
    items.push(newItem);
    localStorageService.set(this.storageKey, items);
    
    return newItem;
  }

  async update(id: string, payload: Partial<T>): Promise<T> {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    const index = items.findIndex((i: T) => i.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    items[index] = {
      ...items[index],
      ...payload,
      id,
      updatedAt: new Date().toISOString(),
    };
    
    localStorageService.set(this.storageKey, items);
    
    return items[index];
  }

  async delete(id: string): Promise<DeleteResponse> {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    const filtered = items.filter((i: T) => i.id !== id);
    
    if (filtered.length === items.length) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    localStorageService.set(this.storageKey, filtered);
    
    return { success: true, id };
  }

  async bulkUpdate(items: T[]): Promise<T[]> {
    await this.delay();
    localStorageService.set(this.storageKey, items);
    return items;
  }
}

export default BaseService;
