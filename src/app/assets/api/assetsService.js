// Assets API Service
import BaseService from '../../../services/api/baseService';
import API_ENDPOINTS from '../../../config/api';
import { STORAGE_KEYS } from '../../../config/constants';

class AssetsService extends BaseService {
  constructor() {
    super(STORAGE_KEYS.ASSETS, API_ENDPOINTS.assets);
  }

  // Upload/add a new asset
  async upload(assetData) {
    const asset = {
      id: `asset-${Date.now()}`,
      name: assetData.name || 'Unnamed Asset',
      type: assetData.type || 'image',
      dataUrl: assetData.dataUrl,
      size: assetData.size || 0,
      dimensions: assetData.dimensions || null,
      ...assetData,
    };

    return super.create(asset);
  }

  // Get assets by type
  async getByType(type) {
    await this.delay();
    const result = await this.list({ page: 1, limit: 1000 });
    return result.data.filter(asset => asset.type === type);
  }

  // Search assets by name
  async search(query) {
    await this.delay();
    const result = await this.list({ page: 1, limit: 1000 });
    return result.data.filter(asset => 
      asset.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default new AssetsService();
