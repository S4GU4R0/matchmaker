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
  private relationshipDatabaseId: string;
  private memoryDatabaseId: string;

  constructor(
    apiKey: string, 
    soulDatabaseId: string, 
    relationshipDatabaseId: string, 
    memoryDatabaseId: string
  ) {
    this.client = new NotionClient({ auth: apiKey });
    this.soulDatabaseId = soulDatabaseId;
    this.relationshipDatabaseId = relationshipDatabaseId;
    this.memoryDatabaseId = memoryDatabaseId;
  }

  async saveSoul(soul: Soul): Promise<void> {
    console.log(`[Notion] Saving soul ${soul.name} to database ${this.soulDatabaseId}`);
    try {
      await this.client.pages.create({
        parent: { database_id: this.soulDatabaseId },
        properties: {
          'Name': { title: [{ text: { content: soul.name } }] },
          'ID': { rich_text: [{ text: { content: soul.id } }] },
          'Archetype': { select: { name: soul.archetype } },
          'Traits': { rich_text: [{ text: { content: JSON.stringify(soul.traits) } }] },
        } as any
      });
    } catch (error) {
      console.error("[Notion] Error saving soul:", error);
    }
  }

  async saveRelationship(relationship: Relationship): Promise<void> {
    console.log(`[Notion] Saving relationship ${relationship.id}`);
    try {
      // Find existing relationship page
      const title = `${relationship.userId} x ${relationship.soulId}`; // Simplified for search
      const response = await this.client.databases.query({
        database_id: this.relationshipDatabaseId,
        filter: {
          property: 'Relationship',
          title: { equals: title }
        }
      });

      const properties = {
        'Relationship': { title: [{ text: { content: title } }] },
        'Status': { select: { name: relationship.status } },
        'Affection': { number: relationship.metrics.affection },
        'Trust': { number: relationship.metrics.trust },
        'Health Aggregate': { number: (relationship.metrics.trust * 0.6) + (relationship.metrics.affection * 0.4) },
        'Intimacy Stage': { select: { name: relationship.stage } },
        'Last Interaction': { date: { start: new Date().toISOString() } },
      } as any;

      if (response.results.length > 0) {
        // Update
        await this.client.pages.update({
          page_id: response.results[0].id,
          properties
        });
      } else {
        // Create
        await this.client.pages.create({
          parent: { database_id: this.relationshipDatabaseId },
          properties
        });
      }
    } catch (error) {
      console.error("[Notion] Error saving relationship:", error);
    }
  }

  async saveMemory(memory: MemoryEntry): Promise<void> {
    console.log(`[Notion] Saving memory entry: ${memory.content.substring(0, 20)}...`);
    try {
      await this.client.pages.create({
        parent: { database_id: this.memoryDatabaseId },
        properties: {
          'Memory Title': { title: [{ text: { content: memory.content.substring(0, 50) + '...' } }] },
          'Timestamp': { date: { start: new Date(memory.createdAt).toISOString() } },
          'Soul ID': { rich_text: [{ text: { content: memory.soulId } }] },
          'Content': { rich_text: [{ text: { content: memory.content } }] },
          'Interpretation': { rich_text: [{ text: { content: memory.interpretation || "" } }] },
          'Weight': { number: memory.weight },
          'Salience Factor': { number: memory.salienceFactor },
          'Archived At': { date: { start: new Date().toISOString() } },
        } as any
      });
    } catch (error) {
      console.error("[Notion] Error saving memory:", error);
    }
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

  private async findOrCreateFolder(name: string, parentId?: string): Promise<string> {
    const query = `name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false${parentId ? ` and '${parentId}' in parents` : ''}`;
    const response = await this.drive.files.list({ q: query, fields: 'files(id)' });
    
    if (response.data.files.length > 0) {
      return response.data.files[0].id;
    }

    const folderMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : []
    };
    const folder = await this.drive.files.create({
      resource: folderMetadata,
      fields: 'id'
    });
    return folder.data.id;
  }

  private async saveFile(name: string, content: string, parentId: string, mimeType: string = 'text/plain') {
    // Check if file exists
    const query = `name = '${name}' and '${parentId}' in parents and trashed = false`;
    const response = await this.drive.files.list({ q: query, fields: 'files(id)' });

    if (response.data.files.length > 0) {
      // Update
      await this.drive.files.update({
        fileId: response.data.files[0].id,
        media: {
          mimeType,
          body: content
        }
      });
    } else {
      // Create
      await this.drive.files.create({
        resource: { name, parents: [parentId] },
        media: {
          mimeType,
          body: content
        }
      });
    }
  }

  private async appendToFile(name: string, content: string, parentId: string) {
    // Check if file exists
    const query = `name = '${name}' and '${parentId}' in parents and trashed = false`;
    const response = await this.drive.files.list({ q: query, fields: 'files(id)' });

    if (response.data.files.length > 0) {
      // Get current content
      const fileId = response.data.files[0].id;
      const currentFile = await this.drive.files.get({ fileId, alt: 'media' });
      const newContent = currentFile.data + '\n' + content;
      
      await this.drive.files.update({
        fileId,
        media: {
          mimeType: 'text/plain',
          body: newContent
        }
      });
    } else {
      // Create
      await this.drive.files.create({
        resource: { name, parents: [parentId] },
        media: {
          mimeType: 'text/plain',
          body: content
        }
      });
    }
  }

  async saveSoul(soul: Soul): Promise<void> {
    console.log(`[Google Drive] Saving soul ${soul.name} as JSON file.`);
    try {
      const matchmakerFolderId = await this.findOrCreateFolder('Matchmaker');
      const usersFolderId = await this.findOrCreateFolder('Users', matchmakerFolderId);
      // We don't have user ID in saveSoul, this is a limitation of the interface
      // Assuming soul.id is the key for relationships for now or we need to pass userId
    } catch (error) {
      console.error("[Google Drive] Error saving soul:", error);
    }
  }

  async saveRelationship(relationship: Relationship): Promise<void> {
    console.log(`[Google Drive] Saving relationship ${relationship.id}`);
    try {
      const matchmakerFolderId = await this.findOrCreateFolder('Matchmaker');
      const usersFolderId = await this.findOrCreateFolder('Users', matchmakerFolderId);
      const userFolderId = await this.findOrCreateFolder(relationship.userId, usersFolderId);
      const relsFolderId = await this.findOrCreateFolder('Relationships', userFolderId);
      const relFolderId = await this.findOrCreateFolder(relationship.soulId, relsFolderId);

      await this.saveFile('status.json', JSON.stringify(relationship, null, 2), relFolderId, 'application/json');
    } catch (error) {
      console.error("[Google Drive] Error saving relationship:", error);
    }
  }

  async saveMemory(memory: MemoryEntry): Promise<void> {
    console.log(`[Google Drive] Saving memory ${memory.id}`);
    try {
      const matchmakerFolderId = await this.findOrCreateFolder('Matchmaker');
      const usersFolderId = await this.findOrCreateFolder('Users', matchmakerFolderId);
      const userFolderId = await this.findOrCreateFolder(memory.userId, usersFolderId);
      const relsFolderId = await this.findOrCreateFolder('Relationships', userFolderId);
      const relFolderId = await this.findOrCreateFolder(memory.soulId, relsFolderId);

      const trace = {
        timestamp: memory.createdAt,
        content: memory.content,
        interpretation: memory.interpretation,
        weight: memory.weight,
        salienceFactor: memory.salienceFactor
      };

      await this.appendToFile('interaction_traces.jsonl', JSON.stringify(trace), relFolderId);
      
      if (memory.weight >= 7) {
        const journalEntry = `## ${new Date(memory.createdAt).toISOString().split('T')[0]}\n\n${memory.interpretation}\n\n---`;
        await this.appendToFile('journal.md', journalEntry, relFolderId);
      }
    } catch (error) {
      console.error("[Google Drive] Error saving memory:", error);
    }
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
