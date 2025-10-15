const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const prefix = API_BASE_URL;

export const API_ENDPOINTS = {
  scenes: {
    base: `${prefix}/scenes`,
    list: `${prefix}/scenes`,
    create: `${prefix}/scenes`,
    detail: (id: string) => `${prefix}/scenes/${id}`,
    update: (id: string) => `${prefix}/scenes/${id}`,
    delete: (id: string) => `${prefix}/scenes/${id}`,
    duplicate: (id: string) => `${prefix}/scenes/${id}/duplicate`,
    reorder: `${prefix}/scenes/reorder`,
  },
  assets: {
    base: `${prefix}/assets`,
    list: `${prefix}/assets`,
    upload: `${prefix}/assets/upload`,
    detail: (id: string) => `${prefix}/assets/${id}`,
    delete: (id: string) => `${prefix}/assets/${id}`,
  },
  export: {
    config: `${prefix}/export/config`,
    scene: (id: string) => `${prefix}/export/scene/${id}`,
    video: `${prefix}/export/video`,
  },
};

export default API_ENDPOINTS;
