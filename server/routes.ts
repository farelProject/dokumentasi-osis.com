import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMediaSchema, insertProgramSchema, loginSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: { userId: number; username: string };
    }
  }
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|wmv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

// Simple session middleware (in production, use proper session store)
const sessions = new Map<string, { userId: number; username: string }>();

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function requireAuth(req: any, res: any, next: any) {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.user = sessions.get(sessionId);
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const sessionId = generateSessionId();
      sessions.set(sessionId, { userId: user.id, username: user.username });
      
      res.json({ 
        token: sessionId, 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/logout", requireAuth, (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json({ user: req.user });
  });

  // Media routes
  app.get("/api/media", async (req, res) => {
    try {
      const { search, category, type } = req.query;
      
      let media;
      if (search || category || type) {
        media = await storage.searchMedia(
          search as string || "",
          category as string,
          type as string
        );
      } else {
        media = await storage.getAllMedia();
      }
      
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const media = await storage.getMediaById(id);
      
      if (!media) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  app.post("/api/media", requireAuth, upload.array('files'), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const { title, description, category } = req.body;
      const uploadedMedia = [];

      for (const file of files) {
        const mediaData = {
          title: title || file.originalname,
          description: description || "",
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          category: category || "lainnya",
        };

        const validatedData = insertMediaSchema.parse(mediaData);
        const media = await storage.createMedia(validatedData);
        uploadedMedia.push(media);
      }

      res.json({ media: uploadedMedia, message: "Files uploaded successfully" });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(400).json({ message: "Failed to upload files" });
    }
  });

  app.put("/api/media/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedMedia = await storage.updateMedia(id, updates);
      if (!updatedMedia) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      res.json(updatedMedia);
    } catch (error) {
      res.status(400).json({ message: "Failed to update media" });
    }
  });

  app.delete("/api/media/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const media = await storage.getMediaById(id);
      
      if (!media) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      // Delete file from filesystem
      const filePath = path.join(process.cwd(), "uploads", media.filename);
      try {
        await fs.promises.unlink(filePath);
      } catch (fileError) {
        console.error("Failed to delete file:", fileError);
      }
      
      const deleted = await storage.deleteMedia(id);
      if (!deleted) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      res.json({ message: "Media deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete media" });
    }
  });

  // Serve uploaded files
  app.get("/api/uploads/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), "uploads", filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    
    res.sendFile(filePath);
  });

  // Program routes
  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await storage.getAllPrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.get("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const program = await storage.getProgramById(id);
      
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  app.post("/api/programs", requireAuth, async (req, res) => {
    try {
      const programData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(programData);
      res.status(201).json(program);
    } catch (error) {
      res.status(400).json({ message: "Failed to create program" });
    }
  });

  app.put("/api/programs/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedProgram = await storage.updateProgram(id, updates);
      if (!updatedProgram) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.json(updatedProgram);
    } catch (error) {
      res.status(400).json({ message: "Failed to update program" });
    }
  });

  app.delete("/api/programs/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProgram(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.json({ message: "Program deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete program" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
