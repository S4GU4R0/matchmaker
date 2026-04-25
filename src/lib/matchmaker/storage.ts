import { Soul, Relationship, MemoryEntry } from './types';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Client as NotionClient } from '@notionhq/client';
import { google } from 'googleapis';

export interface StorageBackend {
  saveSoul(soul: Soul): Promise<void>;
  saveRelationship(relationship: Relationship): Promise<void>;
  saveMemory(memory: MemoryEntry): Promise<void>;
  getSoul(id: string): Promise<Soul | null>;
  getRelationship(id: string): Promise<Relationship | null>;
  getMemories(relationshipId: string): Promise<MemoryEntry[]>;
}

/**
 * Local JSON file storage implementation.
 */
export class LocalFileStorage implements StorageBackend {
  private baseDir: string;

  constructor(baseDir: string = './storage') {
    this.baseDir = baseDir;
  }

  private async ensureDir() {
    await fs.mkdir(this.baseDir, { recursive: true });
    await fs.mkdir(path.join(this.baseDir, 'souls'), { recursive: true });
    await fs.mkdir(path.join(this.baseDir, 'relationships'), { recursive: true });
    await fs.mkdir(path.join(this.baseDir, 'memories'), { recursive: true });
  }

  async saveSoul(soul: Soul): Promise<void> {
    await this.ensureDir();
    await fs.writeFile(
      path.join(this.baseDir, 'souls', `${soul.id}.json`),
      JSON.stringify(soul, null, 2)
    );
  }

  async saveRelationship(relationship: Relationship): Promise<void> {
    await this.ensureDir();
    await fs.writeFile(
      path.join(this.baseDir, 'relationships', `${relationship.id}.json`),
      JSON.stringify(relationship, null, 2)
    );
  }

  async saveMemory(memory: MemoryEntry): Promise<void> {
    await this.ensureDir();
    const dir = path.join(this.baseDir, 'memories', memory.relationshipId);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, `${memory.id}.json`),
      JSON.stringify(memory, null, 2)
    );
  }

  async getSoul(id: string): Promise<Soul | null> {
    try {
      const data = await fs.readFile(path.join(this.baseDir, 'souls', `${id}.json`), 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async getRelationship(id: string): Promise<Relationship | null> {
    try {
      const data = await fs.readFile(path.join(this.baseDir, 'relationships', `${id}.json`), 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async getMemories(relationshipId: string): Promise<MemoryEntry[]> {
    try {
      const dir = path.join(this.baseDir, 'memories', relationshipId);
      const files = await fs.readdir(dir);
      const memories = await Promise.all(
        files.map(async (file) => {
          const data = await fs.readFile(path.join(dir, file), 'utf-8');
          return JSON.parse(data);
        })
      );
      return memories.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch {
      return [];
    }
  }
}

/**
 * Notion backend implementation (Placeholder for key logic).
 */
export class NotionStorage implements StorageBackend {
  private client: NotionClient;
  private soulDatabaseId: string;

  constructor(apiKey: string, soulDatabaseId: string) {
    this.client = new NotionClient({ auth: apiKey });
    this.soulDatabaseId = soulDatabaseId;
  }

  async saveSoul(soul: Soul): Promise<void> {
    // In a real implementation, we'd map soul traits to Notion properties
    console.log(`[Notion] Saving soul ${soul.name} to database ${this.soulDatabaseId}`);
    // await this.client.pages.create({ ... });
  }

  async saveRelationship(relationship: Relationship): Promise<void> {
    console.log(`[Notion] Saving relationship ${relationship.id}`);
  }

  async saveMemory(memory: MemoryEntry): Promise<void> {
    console.log(`[Notion] Saving memory entry: ${memory.content.substring(0, 20)}...`);
  }

  async getSoul(id: string): Promise<Soul | null> { return null; }
  async getRelationship(id: string): Promise<Relationship | null> { return null; }
  async getMemories(relationshipId: string): Promise<MemoryEntry[]> { return []; }
}

/**
 * Google Drive backend implementation (Placeholder for key logic).
 */
export class GoogleDriveStorage implements StorageBackend {
  private drive: any;

  constructor(auth: any) {
    this.drive = google.drive({ version: 'v3', auth });
  }

  async saveSoul(soul: Soul): Promise<void> {
    console.log(`[Google Drive] Saving soul ${soul.name} as JSON file.`);
  }

  async saveRelationship(relationship: Relationship): Promise<void> {
    console.log(`[Google Drive] Saving relationship ${relationship.id}`);
  }

  async saveMemory(memory: MemoryEntry): Promise<void> {
    console.log(`[Google Drive] Saving memory ${memory.id}`);
  }

  async getSoul(id: string): Promise<Soul | null> { return null; }
  async getRelationship(id: string): Promise<Relationship | null> { return null; }
  async getMemories(relationshipId: string): Promise<MemoryEntry[]> { return []; }
}

/**
 * Orchestrator that can sync across multiple backends.
 */
export class StorageOrchestrator {
  private backends: StorageBackend[] = [];

  constructor(backends: StorageBackend[]) {
    this.backends = backends;
  }

  async syncSoul(soul: Soul) {
    await Promise.all(this.backends.map(b => b.saveSoul(soul)));
  }

  async syncRelationship(relationship: Relationship) {
    await Promise.all(this.backends.map(b => b.saveRelationship(relationship)));
  }

  async syncMemory(memory: MemoryEntry) {
    await Promise.all(this.backends.map(b => b.saveMemory(memory)));
  }
}
