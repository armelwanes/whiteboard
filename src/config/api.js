// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const prefix = API_BASE_URL;

export const API_ENDPOINTS = {
  scenes: {
    base: `${prefix}/scenes`,
    list: `${prefix}/scenes`,
    create: `${prefix}/scenes`,
    detail: (id) => `${prefix}/scenes/${id}`,
    update: (id) => `${prefix}/scenes/${id}`,
    delete: (id) => `${prefix}/scenes/${id}`,
    duplicate: (id) => `${prefix}/scenes/${id}/duplicate`,
    reorder: `${prefix}/scenes/reorder`,
  },
  assets: {
    base: `${prefix}/assets`,
    list: `${prefix}/assets`,
    upload: `${prefix}/assets/upload`,
    detail: (id) => `${prefix}/assets/${id}`,
    delete: (id) => `${prefix}/assets/${id}`,
  },
  export: {
    config: `${prefix}/export/config`,
    scene: (id) => `${prefix}/export/scene/${id}`,
    video: `${prefix}/export/video`,
  },
};

export default API_ENDPOINTS;
