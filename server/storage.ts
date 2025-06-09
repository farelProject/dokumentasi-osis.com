import { users, media, programs, type User, type InsertUser, type Media, type InsertMedia, type Program, type InsertProgram } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Media methods
  getAllMedia(): Promise<Media[]>;
  getMediaById(id: number): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;
  updateMedia(id: number, media: Partial<InsertMedia>): Promise<Media | undefined>;
  deleteMedia(id: number): Promise<boolean>;
  searchMedia(query: string, category?: string, type?: string): Promise<Media[]>;
  
  // Program methods
  getAllPrograms(): Promise<Program[]>;
  getProgramById(id: number): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program | undefined>;
  deleteProgram(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private mediaItems: Map<number, Media>;
  private programItems: Map<number, Program>;
  private currentUserId: number;
  private currentMediaId: number;
  private currentProgramId: number;
  private dataDir: string;

  constructor() {
    this.users = new Map();
    this.mediaItems = new Map();
    this.programItems = new Map();
    this.currentUserId = 1;
    this.currentMediaId = 1;
    this.currentProgramId = 1;
    this.dataDir = path.join(process.cwd(), "data");
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await fs.mkdir(path.join(process.cwd(), "uploads"), { recursive: true });
      
      // Create default admin user
      const adminUser: User = {
        id: 1,
        username: "admin",
        password: "admin123" // In production, this should be hashed
      };
      this.users.set(1, adminUser);
      this.currentUserId = 2;

      // Load existing data
      await this.loadData();
    } catch (error) {
      console.error("Failed to initialize storage:", error);
    }
  }

  private async loadData() {
    try {
      // Load media data
      const mediaPath = path.join(this.dataDir, "media.json");
      try {
        const mediaData = await fs.readFile(mediaPath, "utf-8");
        const mediaArray: Media[] = JSON.parse(mediaData);
        mediaArray.forEach(media => {
          this.mediaItems.set(media.id, media);
          if (media.id >= this.currentMediaId) {
            this.currentMediaId = media.id + 1;
          }
        });
      } catch {
        // File doesn't exist, start with empty array
        await this.saveMediaData();
      }

      // Load programs data
      const programsPath = path.join(this.dataDir, "programs.json");
      try {
        const programsData = await fs.readFile(programsPath, "utf-8");
        const programsArray: Program[] = JSON.parse(programsData);
        programsArray.forEach(program => {
          this.programItems.set(program.id, program);
          if (program.id >= this.currentProgramId) {
            this.currentProgramId = program.id + 1;
          }
        });
      } catch {
        // File doesn't exist, start with empty array
        await this.saveProgramsData();
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  }

  private async saveMediaData() {
    try {
      const mediaArray = Array.from(this.mediaItems.values());
      await fs.writeFile(
        path.join(this.dataDir, "media.json"),
        JSON.stringify(mediaArray, null, 2)
      );
    } catch (error) {
      console.error("Failed to save media data:", error);
    }
  }

  private async saveProgramsData() {
    try {
      const programsArray = Array.from(this.programItems.values());
      await fs.writeFile(
        path.join(this.dataDir, "programs.json"),
        JSON.stringify(programsArray, null, 2)
      );
    } catch (error) {
      console.error("Failed to save programs data:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Media methods
  async getAllMedia(): Promise<Media[]> {
    return Array.from(this.mediaItems.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  async getMediaById(id: number): Promise<Media | undefined> {
    return this.mediaItems.get(id);
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const id = this.currentMediaId++;
    const media: Media = {
      ...insertMedia,
      id,
      uploadedAt: new Date(),
    };
    this.mediaItems.set(id, media);
    await this.saveMediaData();
    return media;
  }

  async updateMedia(id: number, updates: Partial<InsertMedia>): Promise<Media | undefined> {
    const existing = this.mediaItems.get(id);
    if (!existing) return undefined;

    const updated: Media = { ...existing, ...updates };
    this.mediaItems.set(id, updated);
    await this.saveMediaData();
    return updated;
  }

  async deleteMedia(id: number): Promise<boolean> {
    const deleted = this.mediaItems.delete(id);
    if (deleted) {
      await this.saveMediaData();
    }
    return deleted;
  }

  async searchMedia(query: string, category?: string, type?: string): Promise<Media[]> {
    const allMedia = await this.getAllMedia();
    return allMedia.filter(media => {
      const matchesQuery = !query || 
        media.title.toLowerCase().includes(query.toLowerCase()) ||
        media.description?.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !category || media.category === category;
      
      const matchesType = !type || 
        (type === "image" && media.mimeType.startsWith("image/")) ||
        (type === "video" && media.mimeType.startsWith("video/"));
      
      return matchesQuery && matchesCategory && matchesType;
    });
  }

  // Program methods
  async getAllPrograms(): Promise<Program[]> {
    return Array.from(this.programItems.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProgramById(id: number): Promise<Program | undefined> {
    return this.programItems.get(id);
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const id = this.currentProgramId++;
    const program: Program = {
      ...insertProgram,
      id,
      createdAt: new Date(),
    };
    this.programItems.set(id, program);
    await this.saveProgramsData();
    return program;
  }

  async updateProgram(id: number, updates: Partial<InsertProgram>): Promise<Program | undefined> {
    const existing = this.programItems.get(id);
    if (!existing) return undefined;

    const updated: Program = { ...existing, ...updates };
    this.programItems.set(id, updated);
    await this.saveProgramsData();
    return updated;
  }

  async deleteProgram(id: number): Promise<boolean> {
    const deleted = this.programItems.delete(id);
    if (deleted) {
      await this.saveProgramsData();
    }
    return deleted;
  }
}

export const storage = new MemStorage();
