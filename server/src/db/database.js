import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultState = {
  users: [],
  projects: [],
  reviews: [],
  ai_insights: [],
  collaborations: [],
  notifications: [],
  achievements: []
};

class Database {
  constructor() {
    this.data = { ...defaultState };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure all collections exist
        for (const key of Object.keys(defaultState)) {
          if (!this.data[key]) {
            this.data[key] = [];
          }
        }
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading database, initializing fresh state:', err);
      this.data = { ...defaultState };
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // Generic collection operations
  find(collection, filterFn = null) {
    const items = this.data[collection] || [];
    if (!filterFn) return [...items];
    return items.filter(filterFn);
  }

  findById(collection, id) {
    const items = this.data[collection] || [];
    return items.find(item => item.id === id) || null;
  }

  findOne(collection, filterFn) {
    const items = this.data[collection] || [];
    return items.find(filterFn) || null;
  }

  insert(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    const record = {
      ...item,
      created_at: item.created_at || new Date().toISOString()
    };
    this.data[collection].push(record);
    this.save();
    return record;
  }

  update(collection, id, updates) {
    const items = this.data[collection] || [];
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    this.data[collection][index] = {
      ...this.data[collection][index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data[collection][index];
  }

  delete(collection, id) {
    const items = this.data[collection] || [];
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.data[collection].splice(index, 1);
    this.save();
    return true;
  }

  reset() {
    this.data = { ...defaultState };
    this.save();
  }
}

export const db = new Database();
export default db;
