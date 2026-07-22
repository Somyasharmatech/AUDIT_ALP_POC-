import express from "express";
import "dotenv/config";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { db, initDb } from './src/db/index.js';
import { 
  users, 
  engagements, 
  auditUniverse, 
  documents, 
  documentVersions, 
  historicalAudits, 
  historicalFindings, 
  planningQuestionnaires, 
  approvalHistory, 
  systemAuditLogs 
} from './src/db/schema.js';
import { eq, like, or, and, desc, asc, count } from 'drizzle-orm';
import {
  runDocumentIntelligence,
  runHistoricalAnalyzer,
  runSopAnalyzer,
  runFinancialAnalyzer,
  runRiskEngine,
  runPlanningGenerator,
  runScopingGenerator,
  runAuditProgramGenerator,
  orchestrateFullAuditPipeline,
  executeStage1,
  executeStage2,
  executeStage3,
  executeStage4,
  humanReviewManager,
  aiObservability
} from './server/ai/index.js';


// Setup File Upload Storage
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const uploadDisk = multer({
  storage: diskStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.xlsx', '.csv', '.doc', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF, DOCX, XLSX, and CSV are supported.'));
    }
  }
});

// Helper: Audit Logger
async function logAuditAction(
  userId: string | null,
  userName: string | null,
  action: string,
  entityType: string,
  entityId: string | null,
  details: string | null,
  ipAddress?: string
) {
  try {
    await db.insert(systemAuditLogs).values({
      userId,
      userName: userName || 'System Auditor',
      action,
      entityType,
      entityId,
      details,
      ipAddress: ipAddress || '127.0.0.1'
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

async function startServer() {
  console.log(`[STARTUP] Initial Memory: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`);
  await initDb();
  console.log(`[STARTUP] After DB Init Memory: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`);
  
  // Create admin user if not exists
  const adminExists = await db.select().from(users).where(eq(users.email, 'admin@auditalp.com')).limit(1);
  if (adminExists.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    await db.insert(users).values({
      email: 'admin@auditalp.com',
      passwordHash: hash,
      name: 'System Administrator',
      role: 'Administrator'
    });
    console.log('Admin user created: admin@auditalp.com / admin123');
  }

  // Create standard user if not exists
  const userExists = await db.select().from(users).where(eq(users.email, 'auditor@auditalp.com')).limit(1);
  if (userExists.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    await db.insert(users).values({
      email: 'auditor@auditalp.com',
      passwordHash: hash,
      name: 'John Auditor',
      role: 'Audit Manager'
    });
  }

  const app = express();
  const PORT = 3000;
  
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(morgan('dev'));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      timestamp: new Date().toISOString() 
    });
  });

  // Mock Auth Middleware for all /api routes
  app.use('/api', async (req: any, res: any, next: any) => {
    // Demo Mode: Mock User Injection
    req.user = { id: 'demo-user-id', email: 'demo@auditalp.com', name: 'Demo Audit Manager', role: 'Head of Internal Audit' };
    try {
      const existingUser = await db.select().from(users).where(eq(users.email, 'admin@auditalp.com')).limit(1);
      if (existingUser.length > 0) {
        req.dbUser = existingUser[0];
        req.user.id = existingUser[0].id;
      } else {
        req.dbUser = req.user;
      }
    } catch (e) {
      req.dbUser = req.user;
    }
    next();
  });
  
  app.get('/api/users', async (req: any, res: any, next: any) => {
     try {
       const allUsers = await db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users);
       res.json(allUsers);
     } catch (e) {
       next(e);
     }
  });

  // ==========================================
  // 1. ANNUAL AUDIT PLAN (ENGAGEMENTS) - CRUD, Archive, Search, Filter, Pagination
  // ==========================================
  
  app.get("/api/audits", async (req: any, res: any, next: any) => {
    try {
      const { search, financialYear, department, status, isArchived, page = '1', limit = '10' } = req.query;
      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 10));
      const offset = (pageNum - 1) * limitNum;

      let conditions: any[] = [];
      
      if (search) {
        conditions.push(or(
          like(engagements.name, `%${search}%`),
          like(engagements.department, `%${search}%`),
          like(engagements.description, `%${search}%`)
        ));
      }
      if (financialYear) {
        conditions.push(eq(engagements.financialYear, financialYear as string));
      }
      if (department) {
        conditions.push(eq(engagements.department, department as string));
      }
      if (status) {
        conditions.push(eq(engagements.status, status as string));
      }
      if (isArchived !== undefined && isArchived !== '') {
        conditions.push(eq(engagements.isArchived, isArchived === 'true'));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db.select()
        .from(engagements)
        .where(whereClause)
        .orderBy(desc(engagements.createdAt))
        .limit(limitNum)
        .offset(offset);

      const totalResult = await db.select({ count: count() })
        .from(engagements)
        .where(whereClause);

      const total = totalResult[0]?.count || 0;
      const totalPages = Math.ceil(total / limitNum);

      res.json({
        items,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      });
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/audits", async (req: any, res: any, next: any) => {
    try {
      const {
        financialYear,
        auditType,
        department,
        businessUnit,
        priority = 'Medium',
        status = 'Planning',
        name,
        startDate,
        expectedEndDate,
        description,
        planningLeadId,
        auditManagerId
      } = req.body;

      if (!financialYear || !auditType || !department) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Financial Year, Audit Type, and Department are required"
        });
      }

      const auditName = name || `${department} ${auditType} (${financialYear})`;

      const newAudit = await db.insert(engagements).values({
        name: auditName,
        department,
        businessUnit: businessUnit || department,
        financialYear,
        auditType,
        priority,
        status,
        startDate: startDate || null,
        expectedEndDate: expectedEndDate || null,
        description: description || '',
        planningLeadId: planningLeadId || null,
        auditManagerId: auditManagerId || null,
        ownerId: req.dbUser.id,
        knowledgeSources: req.body.knowledgeSources ? (typeof req.body.knowledgeSources === 'string' ? req.body.knowledgeSources : JSON.stringify(req.body.knowledgeSources)) : null,
        questionnaire: req.body.questionnaire ? (typeof req.body.questionnaire === 'string' ? req.body.questionnaire : JSON.stringify(req.body.questionnaire)) : null
      }).returning();

      // Automatically populate documents table if knowledge sources provided
      if (req.body.knowledgeSources) {
        try {
          const ksObj = typeof req.body.knowledgeSources === 'string' ? JSON.parse(req.body.knowledgeSources) : req.body.knowledgeSources;
          const categoryMap: Record<string, string> = {
            previousAuditReports: 'Prior Audit Report',
            currentYearDocuments: 'Charter',
            balanceSheet: 'Trial Balance',
            sop: 'SOP',
            riskRegister: 'Risk Register',
            fraudRegister: 'Fraud Register',
            regulatoryReview: 'Policy',
            rcm: 'Process Flow'
          };

          for (const [key, item] of Object.entries(ksObj)) {
            if (item && typeof item === 'object' && (item as any).name) {
              const fileItem = item as { name: string; size?: string };
              await db.insert(documents).values({
                engagementId: newAudit[0].id,
                name: fileItem.name,
                category: categoryMap[key] || 'SOP',
                fileSize: 1024,
                filePath: `/uploads/${fileItem.name}`,
                uploadedBy: req.dbUser.id,
                status: 'Active',
                aiStatus: 'Uploaded'
              });
            }
          }
        } catch (err) {
          console.error("Error populating documents from knowledge sources:", err);
        }
      }

      await logAuditAction(
        req.dbUser.id,
        req.dbUser.name,
        'CREATE_AUDIT',
        'Engagement',
        newAudit[0].id,
        `Created audit plan item: ${auditName}`,
        req.ip
      );

      res.status(201).json(newAudit[0]);
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/audits/:id", async (req: any, res: any, next: any) => {
    try {
      const audit = await db.select().from(engagements).where(eq(engagements.id, req.params.id)).limit(1);
      if (audit.length === 0) return res.status(404).json({ error: "Not found", message: "Audit engagement not found" });
      res.json(audit[0]);
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/audits/:id", async (req: any, res: any, next: any) => {
     try {
       const { id } = req.params;
       const updateData = {
         ...req.body,
         updatedAt: new Date()
       };

       const updated = await db.update(engagements)
         .set(updateData)
         .where(eq(engagements.id, id))
         .returning();

       if (updated.length === 0) {
         return res.status(404).json({ message: "Audit engagement not found" });
       }

       await logAuditAction(
         req.dbUser.id,
         req.dbUser.name,
         'UPDATE_AUDIT',
         'Engagement',
         id,
         `Updated audit plan item: ${updated[0].name}`,
         req.ip
       );

       res.json(updated[0]);
     } catch (e) {
       next(e);
     }
  });

  app.put("/api/audits/:id/archive", async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params;
      const updated = await db.update(engagements)
        .set({ isArchived: true, status: 'Archived', updatedAt: new Date() })
        .where(eq(engagements.id, id))
        .returning();

      if (updated.length === 0) return res.status(404).json({ message: "Audit engagement not found" });

      await logAuditAction(
        req.dbUser.id,
        req.dbUser.name,
        'ARCHIVE_AUDIT',
        'Engagement',
        id,
        `Archived audit plan item: ${updated[0].name}`,
        req.ip
      );

      res.json(updated[0]);
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/audits/:id/restore", async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params;
      const updated = await db.update(engagements)
        .set({ isArchived: false, status: 'Planning', updatedAt: new Date() })
        .where(eq(engagements.id, id))
        .returning();

      if (updated.length === 0) return res.status(404).json({ message: "Audit engagement not found" });

      await logAuditAction(
        req.dbUser.id,
        req.dbUser.name,
        'RESTORE_AUDIT',
        'Engagement',
        id,
        `Restored audit plan item: ${updated[0].name}`,
        req.ip
      );

      res.json(updated[0]);
    } catch (e) {
      next(e);
    }
  });

  app.delete("/api/audits/:id", async (req: any, res: any, next: any) => {
     try {
       const { id } = req.params;
       const deleted = await db.delete(engagements).where(eq(engagements.id, id)).returning();
       
       await logAuditAction(
         req.dbUser.id,
         req.dbUser.name,
         'DELETE_AUDIT',
         'Engagement',
         id,
         `Deleted audit plan item: ${deleted[0]?.name || id}`,
         req.ip
       );

       res.status(204).end();
     } catch (e) {
       next(e);
     }
  });

  // ==========================================
  // 2. AUDIT UNIVERSE - CRUD, Archive, Relationships, Search, Filter, Pagination
  // ==========================================

  app.get("/api/universe", async (req: any, res: any, next: any) => {
    try {
      const { search, department, businessCriticality, auditFrequency, isArchived, page = '1', limit = '10' } = req.query;
      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 10));
      const offset = (pageNum - 1) * limitNum;

      let conditions: any[] = [];
      
      if (search) {
        conditions.push(or(
          like(auditUniverse.auditEntity, `%${search}%`),
          like(auditUniverse.department, `%${search}%`),
          like(auditUniverse.description, `%${search}%`)
        ));
      }
      if (department) {
        conditions.push(eq(auditUniverse.department, department as string));
      }
      if (businessCriticality) {
        conditions.push(eq(auditUniverse.businessCriticality, businessCriticality as string));
      }
      if (auditFrequency) {
        conditions.push(eq(auditUniverse.auditFrequency, auditFrequency as string));
      }
      if (isArchived !== undefined && isArchived !== '') {
        conditions.push(eq(auditUniverse.isArchived, isArchived === 'true'));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db.select()
        .from(auditUniverse)
        .where(whereClause)
        .orderBy(desc(auditUniverse.createdAt))
        .limit(limitNum)
        .offset(offset);

      const totalResult = await db.select({ count: count() })
        .from(auditUniverse)
        .where(whereClause);

      const total = totalResult[0]?.count || 0;
      const totalPages = Math.ceil(total / limitNum);

      res.json({
        items,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      });
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/universe", async (req: any, res: any, next: any) => {
     try {
       const { department, auditEntity, businessUnit, auditType, businessCriticality = 'Medium', auditFrequency = 'Annual', status = 'Active', description } = req.body;
       
       if (!department || !auditEntity) {
         return res.status(400).json({ message: "Department and Audit Entity name are required" });
       }

       const newEntity = await db.insert(auditUniverse).values({
         department,
         auditEntity,
         businessUnit: businessUnit || department,
         auditType: auditType || 'Operational Audit',
         businessCriticality,
         auditFrequency,
         status,
         description: description || '',
         ownerId: req.dbUser.id
       }).returning();

       await logAuditAction(
         req.dbUser.id,
         req.dbUser.name,
         'CREATE_UNIVERSE_ENTITY',
         'AuditUniverse',
         newEntity[0].id,
         `Created universe entity: ${auditEntity} (${department})`,
         req.ip
       );

       res.status(201).json(newEntity[0]);
     } catch (e) {
       next(e);
     }
  });

  app.get("/api/universe/:id", async (req: any, res: any, next: any) => {
    try {
      const entity = await db.select().from(auditUniverse).where(eq(auditUniverse.id, req.params.id)).limit(1);
      if (entity.length === 0) return res.status(404).json({ message: "Universe entity not found" });

      // Fetch linked engagements as relationships
      const linkedEngagements = await db.select()
        .from(engagements)
        .where(eq(engagements.department, entity[0].department));

      res.json({
        ...entity[0],
        linkedEngagements
      });
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/universe/:id", async (req: any, res: any, next: any) => {
     try {
       const updated = await db.update(auditUniverse)
         .set({ ...req.body, updatedAt: new Date() })
         .where(eq(auditUniverse.id, req.params.id))
         .returning();

       if (updated.length === 0) return res.status(404).json({ message: "Universe entity not found" });

       await logAuditAction(
         req.dbUser.id,
         req.dbUser.name,
         'UPDATE_UNIVERSE_ENTITY',
         'AuditUniverse',
         req.params.id,
         `Updated universe entity: ${updated[0].auditEntity}`,
         req.ip
       );

       res.json(updated[0]);
     } catch (e) {
       next(e);
     }
  });

  app.put("/api/universe/:id/archive", async (req: any, res: any, next: any) => {
    try {
      const updated = await db.update(auditUniverse)
        .set({ isArchived: true, status: 'Archived', updatedAt: new Date() })
        .where(eq(auditUniverse.id, req.params.id))
        .returning();

      if (updated.length === 0) return res.status(404).json({ message: "Universe entity not found" });

      await logAuditAction(
        req.dbUser.id,
        req.dbUser.name,
        'ARCHIVE_UNIVERSE_ENTITY',
        'AuditUniverse',
        req.params.id,
        `Archived universe entity: ${updated[0].auditEntity}`,
        req.ip
      );

      res.json(updated[0]);
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/universe/:id/restore", async (req: any, res: any, next: any) => {
    try {
      const updated = await db.update(auditUniverse)
        .set({ isArchived: false, status: 'Active', updatedAt: new Date() })
        .where(eq(auditUniverse.id, req.params.id))
        .returning();

      if (updated.length === 0) return res.status(404).json({ message: "Universe entity not found" });

      await logAuditAction(
        req.dbUser.id,
        req.dbUser.name,
        'RESTORE_UNIVERSE_ENTITY',
        'AuditUniverse',
        req.params.id,
        `Restored universe entity: ${updated[0].auditEntity}`,
        req.ip
      );

      res.json(updated[0]);
    } catch (e) {
      next(e);
    }
  });

  app.delete("/api/universe/:id", async (req: any, res: any, next: any) => {
     try {
       const deleted = await db.delete(auditUniverse).where(eq(auditUniverse.id, req.params.id)).returning();
       
       await logAuditAction(
         req.dbUser.id,
         req.dbUser.name,
         'DELETE_UNIVERSE_ENTITY',
         'AuditUniverse',
         req.params.id,
         `Deleted universe entity: ${deleted[0]?.auditEntity || req.params.id}`,
         req.ip
       );

       res.status(204).end();
     } catch (e) {
       next(e);
     }
  });

  // ==========================================
  // 3. DOCUMENT MANAGEMENT - Upload, Metadata, Versioning, Replacement, Delete, Stream Preview
  // ==========================================

  app.post("/api/documents/upload", (req: any, res: any, next: any) => {
    uploadDisk.single('file')(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({ error: "Upload Error", message: err.message });
      }
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file provided" });
        }

        const { engagementId, universeId, category = 'SOP', name } = req.body;
        const fileBuffer = fs.readFileSync(req.file.path);
        const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        const docName = name || req.file.originalname;

        const newDoc = await db.insert(documents).values({
          engagementId: engagementId || null,
          universeId: universeId || null,
          name: docName,
          category,
          fileSize: req.file.size,
          fileType: req.file.mimetype,
          filePath: req.file.path,
          fileHash,
          uploadedBy: req.dbUser.id,
          version: 1,
          isLatest: true,
          status: 'Active'
        }).returning();

        const doc = newDoc[0];

        await db.insert(documentVersions).values({
          documentId: doc.id,
          version: 1,
          name: docName,
          filePath: req.file.path,
          fileSize: req.file.size,
          uploadedBy: req.dbUser.id,
          changeSummary: 'Initial document upload'
        });

        await logAuditAction(
          req.dbUser.id,
          req.dbUser.name,
          'UPLOAD_DOCUMENT',
          'Document',
          doc.id,
          `Uploaded document: ${docName} (${category})`,
          req.ip
        );

        res.status(201).json(doc);
      } catch (e) {
        next(e);
      }
    });
  });

  app.get("/api/documents", async (req: any, res: any, next: any) => {
    try {
      const { engagementId, universeId, category, status = 'Active' } = req.query;
      let conditions: any[] = [];

      if (status !== 'ALL') {
        conditions.push(eq(documents.status, status as string));
      }
      if (engagementId) {
        conditions.push(eq(documents.engagementId, engagementId as string));
      }
      if (universeId) {
        conditions.push(eq(documents.universeId, universeId as string));
      }
      if (category) {
        conditions.push(eq(documents.category, category as string));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      const docList = await db.select().from(documents).where(whereClause).orderBy(desc(documents.createdAt));

      res.json(docList);
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/documents/:id/file", async (req: any, res: any, next: any) => {
    try {
      const docList = await db.select().from(documents).where(eq(documents.id, req.params.id)).limit(1);
      if (docList.length === 0) return res.status(404).json({ message: "Document not found" });

      const doc = docList[0];
      if (!fs.existsSync(doc.filePath)) {
        return res.status(404).json({ message: "Physical file not found on server storage" });
      }

      res.setHeader('Content-Type', doc.fileType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.name)}"`);
      fs.createReadStream(doc.filePath).pipe(res);
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/documents/:id/version", (req: any, res: any, next: any) => {
    uploadDisk.single('file')(req, res, async (err: any) => {
      if (err) return res.status(400).json({ message: err.message });
      try {
        if (!req.file) return res.status(400).json({ message: "No file provided" });

        const docList = await db.select().from(documents).where(eq(documents.id, req.params.id)).limit(1);
        if (docList.length === 0) return res.status(404).json({ message: "Document not found" });

        const currentDoc = docList[0];
        const newVersion = currentDoc.version + 1;
        const changeSummary = req.body.changeSummary || `Updated to version ${newVersion}`;

        // Update current doc record
        const updatedDoc = await db.update(documents)
          .set({
            version: newVersion,
            fileSize: req.file.size,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            updatedAt: new Date()
          })
          .where(eq(documents.id, currentDoc.id))
          .returning();

        // Create version history snapshot
        await db.insert(documentVersions).values({
          documentId: currentDoc.id,
          version: newVersion,
          name: currentDoc.name,
          filePath: req.file.path,
          fileSize: req.file.size,
          uploadedBy: req.dbUser.id,
          changeSummary
        });

        await logAuditAction(
          req.dbUser.id,
          req.dbUser.name,
          'NEW_DOCUMENT_VERSION',
          'Document',
          currentDoc.id,
          `Uploaded version ${newVersion} for document: ${currentDoc.name}`,
          req.ip
        );

        res.json(updatedDoc[0]);
      } catch (e) {
        next(e);
      }
    });
  });

  app.get("/api/documents/:id/versions", async (req: any, res: any, next: any) => {
    try {
      const versions = await db.select()
        .from(documentVersions)
        .where(eq(documentVersions.documentId, req.params.id))
        .orderBy(desc(documentVersions.version));

      res.json(versions);
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/documents/:id/ai-status", async (req: any, res: any, next: any) => {
    try {
      const { aiStatus } = req.body; // Uploaded, Processed, Reviewed, Approved, Used in AI
      if (!aiStatus) return res.status(400).json({ message: "aiStatus is required" });

      const updated = await db.update(documents)
        .set({ aiStatus, updatedAt: new Date() })
        .where(eq(documents.id, req.params.id))
        .returning();

      if (updated.length === 0) return res.status(404).json({ message: "Document not found" });

      res.json(updated[0]);
    } catch (e) {
      next(e);
    }
  });

  app.delete("/api/documents/:id", async (req: any, res: any, next: any) => {
    try {
      const deletedDoc = await db.update(documents)
        .set({ status: 'Deleted', updatedAt: new Date() })
        .where(eq(documents.id, req.params.id))
        .returning();

      if (deletedDoc.length === 0) return res.status(404).json({ message: "Document not found" });

      await logAuditAction(
        req.dbUser.id,
        req.dbUser.name,
        'DELETE_DOCUMENT',
        'Document',
        req.params.id,
        `Deleted document: ${deletedDoc[0].name}`,
        req.ip
      );

      res.status(204).end();
    } catch (e) {
      next(e);
    }
  });

  // ==========================================
  // 4. HISTORICAL REPOSITORY - Real Audit Findings & History
  // ==========================================

  app.get("/api/historical-audits", async (req: any, res: any, next: any) => {
    try {
      const { universeId, engagementId } = req.query;
      let conditions: any[] = [];

      if (universeId) conditions.push(eq(historicalAudits.universeId, universeId as string));
      if (engagementId) conditions.push(eq(historicalAudits.engagementId, engagementId as string));

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      const audits = await db.select().from(historicalAudits).where(whereClause).orderBy(desc(historicalAudits.auditYear));

      res.json(audits);
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/historical-audits", async (req: any, res: any, next: any) => {
    try {
      const { universeId, engagementId, auditYear, auditTitle, overallOpinion = 'Qualified', overallRiskRating = 'Medium', auditorInCharge, completedDate } = req.body;
      
      const newAudit = await db.insert(historicalAudits).values({
        universeId: universeId || null,
        engagementId: engagementId || null,
        auditYear,
        auditTitle,
        overallOpinion,
        overallRiskRating,
        auditorInCharge: auditorInCharge || req.dbUser.name,
        completedDate: completedDate || null
      }).returning();

      await logAuditAction(
        req.dbUser.id,
        req.dbUser.name,
        'CREATE_HISTORICAL_AUDIT',
        'HistoricalAudit',
        newAudit[0].id,
        `Added historical audit record: ${auditTitle} (${auditYear})`,
        req.ip
      );

      res.status(201).json(newAudit[0]);
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/historical-findings", async (req: any, res: any, next: any) => {
    try {
      const { historicalAuditId, engagementId, severity, issueStatus } = req.query;
      let conditions: any[] = [];

      if (historicalAuditId) conditions.push(eq(historicalFindings.historicalAuditId, historicalAuditId as string));
      if (engagementId) conditions.push(eq(historicalFindings.engagementId, engagementId as string));
      if (severity) conditions.push(eq(historicalFindings.severity, severity as string));
      if (issueStatus) conditions.push(eq(historicalFindings.issueStatus, issueStatus as string));

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      const findings = await db.select().from(historicalFindings).where(whereClause).orderBy(desc(historicalFindings.createdAt));

      res.json(findings);
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/historical-findings", async (req: any, res: any, next: any) => {
    try {
      const { historicalAuditId, engagementId, findingCode, title, description, severity = 'Medium', isRepeat = false, repeatCount = 0, managementResponse, issueStatus = 'Open', targetClosureDate } = req.body;

      const newFinding = await db.insert(historicalFindings).values({
        historicalAuditId: historicalAuditId || null,
        engagementId: engagementId || null,
        findingCode: findingCode || `FIND-${Date.now().toString().slice(-4)}`,
        title,
        description,
        severity,
        isRepeat,
        repeatCount,
        managementResponse: managementResponse || '',
        issueStatus,
        targetClosureDate: targetClosureDate || null
      }).returning();

      await logAuditAction(
        req.dbUser.id,
        req.dbUser.name,
        'CREATE_HISTORICAL_FINDING',
        'HistoricalFinding',
        newFinding[0].id,
        `Created historical finding: ${title} (${severity})`,
        req.ip
      );

      res.status(201).json(newFinding[0]);
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/historical-findings/:id", async (req: any, res: any, next: any) => {
    try {
      const updated = await db.update(historicalFindings)
        .set(req.body)
        .where(eq(historicalFindings.id, req.params.id))
        .returning();

      if (updated.length === 0) return res.status(404).json({ message: "Finding not found" });

      res.json(updated[0]);
    } catch (e) {
      next(e);
    }
  });

  // ==========================================
  // 5. PLANNING QUESTIONNAIRE - Persist Responses & Version History
  // ==========================================

  app.get("/api/audits/:id/questionnaire", async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params;
      const latest = await db.select()
        .from(planningQuestionnaires)
        .where(eq(planningQuestionnaires.engagementId, id))
        .orderBy(desc(planningQuestionnaires.version))
        .limit(1);

      if (latest.length === 0) {
        // Return default questionnaire template if none saved yet
        return res.json({
          engagementId: id,
          version: 0,
          responses: [
            { id: 'q1', category: 'Penalty Risk', question: 'Are there statutory regulatory deadlines or monetary penalty risks attached to this business function?', answer: 'Yes', notes: 'Quarterly compliance filing deadlines exist.', evidence: 'Treasury Policy Manual' },
            { id: 'q2', category: 'Fraud Risk', question: 'Has there been any known fraud, bribery, or whistleblower incident in the last 24 months?', answer: 'No', notes: 'No reported incidents in ethics hotline log.', evidence: 'Ethics Register FY25' },
            { id: 'q3', category: 'System Changes', question: 'Have major core ERP or bank integration interfaces changed during this financial year?', answer: 'Yes', notes: 'Host-to-Host SAP bank interface migrated in Q2.', evidence: 'IT Change Ticket #8841' }
          ],
          status: 'Draft'
        });
      }

      let parsedResponses = [];
      try {
        parsedResponses = JSON.parse(latest[0].responses);
      } catch (err) {
        parsedResponses = [];
      }

      res.json({
        ...latest[0],
        responses: parsedResponses
      });
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/audits/:id/questionnaire", async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params;
      const { responses, status = 'Submitted' } = req.body;

      const previous = await db.select()
        .from(planningQuestionnaires)
        .where(eq(planningQuestionnaires.engagementId, id))
        .orderBy(desc(planningQuestionnaires.version))
        .limit(1);

      const nextVersion = previous.length > 0 ? previous[0].version + 1 : 1;
      const responsesStr = typeof responses === 'string' ? responses : JSON.stringify(responses);

      const newRecord = await db.insert(planningQuestionnaires).values({
        engagementId: id,
        version: nextVersion,
        responses: responsesStr,
        savedBy: req.dbUser.id,
        status
      }).returning();

      // Update engagement questionnaire quick reference column
      await db.update(engagements)
        .set({ questionnaire: responsesStr, updatedAt: new Date() })
        .where(eq(engagements.id, id));

      await logAuditAction(
        req.dbUser.id,
        req.dbUser.name,
        'SAVE_QUESTIONNAIRE',
        'Questionnaire',
        newRecord[0].id,
        `Saved questionnaire version ${nextVersion} for engagement ${id}`,
        req.ip
      );

      res.status(201).json({
        ...newRecord[0],
        responses: typeof responses === 'string' ? JSON.parse(responses) : responses
      });
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/audits/:id/questionnaire/versions", async (req: any, res: any, next: any) => {
    try {
      const versions = await db.select()
        .from(planningQuestionnaires)
        .where(eq(planningQuestionnaires.engagementId, req.params.id))
        .orderBy(desc(planningQuestionnaires.version));

      res.json(versions);
    } catch (e) {
      next(e);
    }
  });

  // ==========================================
  // 6. PLANNING READINESS SCORE - Dynamic Backend Calculation
  // ==========================================

  app.get("/api/audits/:id/readiness", async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params;
      const audit = await db.select().from(engagements).where(eq(engagements.id, id)).limit(1);
      if (audit.length === 0) return res.status(404).json({ message: "Engagement not found" });

      const auditItem = audit[0];

      // 1. Documents Uploaded Score (Weight: 40%)
      const uploadedDocs = await db.select()
        .from(documents)
        .where(and(eq(documents.engagementId, id), eq(documents.status, 'Active')));
      
      const docCount = uploadedDocs.length;
      const targetDocCount = 5; // Standard benchmark for comprehensive audit planning
      const docsScore = Math.min(1.0, docCount / targetDocCount) * 40;

      // 2. Questionnaire Completion Score (Weight: 20%)
      const questionnaireRec = await db.select()
        .from(planningQuestionnaires)
        .where(eq(planningQuestionnaires.engagementId, id))
        .orderBy(desc(planningQuestionnaires.version))
        .limit(1);

      let questionnaireScore = 0;
      let qAnsweredRatio = 0;
      if (questionnaireRec.length > 0) {
        try {
          const qArr = JSON.parse(questionnaireRec[0].responses);
          if (Array.isArray(qArr) && qArr.length > 0) {
            const answeredCount = qArr.filter((item: any) => item.answer && item.answer !== '').length;
            qAnsweredRatio = answeredCount / qArr.length;
            questionnaireScore = qAnsweredRatio * 20;
          }
        } catch (err) {
          questionnaireScore = 10;
        }
      } else {
        questionnaireScore = 10; // Default baseline
      }

      // 3. Historical Data Coverage (Weight: 20%)
      const historicalItems = await db.select()
        .from(historicalFindings)
        .where(eq(historicalFindings.engagementId, id));

      const historyCount = historicalItems.length;
      const historyScore = historyCount > 0 ? 20 : 15;

      // 4. Mandatory Document Checklist Score (Weight: 20%)
      const requiredCategories = ['SOP', 'Charter', 'Prior Audit Report', 'Process Flow'];
      const presentCategories = new Set(uploadedDocs.map(d => d.category));
      let fulfilledCategoriesCount = 0;
      requiredCategories.forEach(cat => {
        if (presentCategories.has(cat as any)) fulfilledCategoriesCount++;
      });

      const mandatoryDocScore = (fulfilledCategoriesCount / requiredCategories.length) * 20;

      // Total Dynamic Readiness Score
      const totalScore = Math.round(docsScore + questionnaireScore + historyScore + mandatoryDocScore);

      // Determine Grade
      let grade = 'Grade A';
      if (totalScore < 60) grade = 'Needs Data';
      else if (totalScore < 75) grade = 'Grade C';
      else if (totalScore < 88) grade = 'Grade B';

      // Persist calculated score to engagement record
      await db.update(engagements)
        .set({ readinessScore: totalScore, updatedAt: new Date() })
        .where(eq(engagements.id, id));

      res.json({
        overallScore: totalScore,
        grade,
        status: totalScore >= 85 ? 'Ready for Fieldwork' : 'In Planning Preparation',
        breakdown: {
          documentsScore: Math.round(docsScore),
          questionnaireScore: Math.round(questionnaireScore),
          historyScore: Math.round(historyScore),
          mandatoryDocScore: Math.round(mandatoryDocScore)
        },
        details: {
          uploadedDocCount: docCount,
          targetDocCount,
          questionnaireCompletedRatio: `${Math.round((questionnaireScore / 20) * 100)}%`,
          historicalFindingsCount: historyCount,
          mandatoryCategoriesFulfilled: `${fulfilledCategoriesCount}/${requiredCategories.length}`
        }
      });
    } catch (e) {
      next(e);
    }
  });

  // ==========================================
  // 7. MISSING DOCUMENTS - Automated Gap Analysis
  // ==========================================

  app.get("/api/audits/:id/missing-documents", async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params;
      const audit = await db.select().from(engagements).where(eq(engagements.id, id)).limit(1);
      if (audit.length === 0) return res.status(404).json({ message: "Engagement not found" });

      const auditType = audit[0].auditType || 'Operational Audit';

      // Define standard required document checklist based on Audit Type
      const requiredMap: Record<string, { category: string; description: string; priority: string }[]> = {
        'Financial Audit': [
          { category: 'SOP', description: 'Financial Accounting & Treasury SOP', priority: 'High' },
          { category: 'Trial Balance', description: 'Year-End Trial Balance & General Ledger Detail', priority: 'Critical' },
          { category: 'Bank Confirmation', description: 'Independent External Bank Confirmation Letters', priority: 'Critical' },
          { category: 'Prior Audit Report', description: 'Previous Year Financial Audit Findings Report', priority: 'Medium' }
        ],
        'Operational Audit': [
          { category: 'SOP', description: 'Standard Operating Procedures & Delegation Matrix', priority: 'High' },
          { category: 'Process Flow', description: 'Business Process Flowcharts & Control Diagrams', priority: 'High' },
          { category: 'Charter', description: 'Departmental Charter & Governance Policy', priority: 'Medium' },
          { category: 'Prior Audit Report', description: 'Previous Operational Review Findings', priority: 'Medium' }
        ],
        'Compliance Audit': [
          { category: 'Policy', description: 'Regulatory Compliance & Statutory Framework Policy', priority: 'Critical' },
          { category: 'SOP', description: 'Compliance Tracking & Escalation SOP', priority: 'High' },
          { category: 'Prior Audit Report', description: 'Prior Regulatory Audit & Examination Findings', priority: 'High' }
        ]
      };

      const defaultRequired = [
        { category: 'SOP', description: 'Standard Operating Procedures Manual', priority: 'High' },
        { category: 'Charter', description: 'Business Unit Organization Chart & Charter', priority: 'Medium' },
        { category: 'Process Flow', description: 'Key Control & Process Flowchart', priority: 'High' },
        { category: 'Prior Audit Report', description: 'Prior Audit Observations Summary', priority: 'Medium' }
      ];

      const requiredList = requiredMap[auditType] || defaultRequired;

      // Fetch uploaded documents
      const uploadedDocs = await db.select()
        .from(documents)
        .where(and(eq(documents.engagementId, id), eq(documents.status, 'Active')));

      const uploadedCategories = new Set(uploadedDocs.map(d => d.category));

      const missingDocuments = requiredList.filter(reqDoc => !uploadedCategories.has(reqDoc.category));
      const uploadedFulfilled = requiredList.filter(reqDoc => uploadedCategories.has(reqDoc.category));

      res.json({
        totalRequired: requiredList.length,
        totalUploaded: uploadedDocs.length,
        missingCount: missingDocuments.length,
        missingDocuments,
        uploadedFulfilled,
        allUploadedDocuments: uploadedDocs
      });
    } catch (e) {
      next(e);
    }
  });

  // ==========================================
  // 8. APPROVAL WORKFLOW - Save, Reviewer, Comments, Status, History
  // ==========================================

  app.get("/api/audits/:id/approval", async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params;
      const history = await db.select()
        .from(approvalHistory)
        .where(eq(approvalHistory.engagementId, id))
        .orderBy(desc(approvalHistory.createdAt));

      const audit = await db.select({ status: engagements.status }).from(engagements).where(eq(engagements.id, id)).limit(1);

      res.json({
        currentStatus: audit[0]?.status || 'Planning',
        approvalHistory: history
      });
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/audits/:id/approval/submit", async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params;
      const { step = 'Manager Review', reviewerId, comments } = req.body;

      const reviewer = reviewerId ? await db.select().from(users).where(eq(users.id, reviewerId)).limit(1) : [];
      const reviewerName = reviewer.length > 0 ? reviewer[0].name : 'Audit Manager';

      // Insert record in approval history
      const newEntry = await db.insert(approvalHistory).values({
        engagementId: id,
        step,
        status: 'Pending',
        reviewerId: reviewerId || null,
        reviewerName,
        comments: comments || 'Submitted planning package for manager review.',
        decidedAt: null
      }).returning();

      // Update engagement status
      await db.update(engagements)
        .set({ status: 'In Review', updatedAt: new Date() })
        .where(eq(engagements.id, id));

      await logAuditAction(
        req.dbUser.id,
        req.dbUser.name,
        'SUBMIT_FOR_APPROVAL',
        'Approval',
        newEntry[0].id,
        `Submitted audit ${id} for review (${step})`,
        req.ip
      );

      res.status(201).json(newEntry[0]);
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/audits/:id/approval/decision", async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params;
      const { decision, comments, step = 'Manager Sign-off' } = req.body; // 'Approved' | 'Changes Requested' | 'Rejected'

      if (!['Approved', 'Changes Requested', 'Rejected'].includes(decision)) {
        return res.status(400).json({ message: "Invalid decision value" });
      }

      let newAuditStatus = 'In Review';
      if (decision === 'Approved') newAuditStatus = 'Approved';
      if (decision === 'Changes Requested') newAuditStatus = 'Changes Requested';
      if (decision === 'Rejected') newAuditStatus = 'Planning';

      const entry = await db.insert(approvalHistory).values({
        engagementId: id,
        step,
        status: decision,
        reviewerId: req.dbUser.id,
        reviewerName: req.dbUser.name,
        comments: comments || `Review decision: ${decision}`,
        decidedAt: new Date()
      }).returning();

      await db.update(engagements)
        .set({ status: newAuditStatus, updatedAt: new Date() })
        .where(eq(engagements.id, id));

      await logAuditAction(
        req.dbUser.id,
        req.dbUser.name,
        'APPROVAL_DECISION',
        'Approval',
        entry[0].id,
        `Approval decision for engagement ${id}: ${decision}`,
        req.ip
      );

      res.status(201).json({
        approval: entry[0],
        newAuditStatus
      });
    } catch (e) {
      next(e);
    }
  });

  // ==========================================
  // 9. AUDIT LOGS - Track Create, Update, Delete, Approval, Upload, Review
  // ==========================================

  app.get("/api/audit-logs", async (req: any, res: any, next: any) => {
    try {
      const { search, action, entityType, userId, page = '1', limit = '15' } = req.query;
      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 15));
      const offset = (pageNum - 1) * limitNum;

      let conditions: any[] = [];

      if (search) {
        conditions.push(or(
          like(systemAuditLogs.details, `%${search}%`),
          like(systemAuditLogs.userName, `%${search}%`),
          like(systemAuditLogs.action, `%${search}%`)
        ));
      }
      if (action) {
        conditions.push(eq(systemAuditLogs.action, action as string));
      }
      if (entityType) {
        conditions.push(eq(systemAuditLogs.entityType, entityType as string));
      }
      if (userId) {
        conditions.push(eq(systemAuditLogs.userId, userId as string));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db.select()
        .from(systemAuditLogs)
        .where(whereClause)
        .orderBy(desc(systemAuditLogs.createdAt))
        .limit(limitNum)
        .offset(offset);

      const totalResult = await db.select({ count: count() })
        .from(systemAuditLogs)
        .where(whereClause);

      const total = totalResult[0]?.count || 0;
      const totalPages = Math.ceil(total / limitNum);

      res.json({
        items,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      });
    } catch (e) {
      next(e);
    }
  });

  // ==========================================
  // 10. ENTERPRISE AI ORCHESTRATION LAYER ENDPOINTS
  // ==========================================

  // 1. Document Intelligence
  app.post("/api/ai/document-intelligence", async (req: any, res: any, next: any) => {
    try {
      const { documentName, category, rawText } = req.body;
      const result = await runDocumentIntelligence({
        documentName: documentName || 'Uploaded File',
        category,
        rawText: rawText || 'Extracted document text content...'
      });

      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_DOCUMENT_INTELLIGENCE', 'AI', null, `Executed document intelligence for ${documentName}`, req.ip);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  // 2. Historical Audit Analyzer
  app.post("/api/ai/historical-analyzer", async (req: any, res: any, next: any) => {
    try {
      const { engagementName, department, engagementId } = req.body;
      
      let historicalAuditsData: any[] = [];
      let historicalFindingsData: any[] = [];

      if (engagementId) {
        historicalAuditsData = await db.select().from(historicalAudits).where(eq(historicalAudits.engagementId, engagementId));
        historicalFindingsData = await db.select().from(historicalFindings).where(eq(historicalFindings.engagementId, engagementId));
      }

      const result = await runHistoricalAnalyzer({
        engagementName,
        department,
        historicalAudits: req.body.historicalAudits || historicalAuditsData,
        historicalFindings: req.body.historicalFindings || historicalFindingsData
      });

      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_HISTORICAL_ANALYZER', 'AI', engagementId || null, `Ran historical analyzer for ${engagementName}`, req.ip);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  // 3. SOP Analyzer
  app.post("/api/ai/sop-analyzer", async (req: any, res: any, next: any) => {
    try {
      const { sopTitle, department, sopText } = req.body;
      const result = await runSopAnalyzer({
        sopTitle: sopTitle || 'Standard Operating Procedure',
        department,
        sopText: sopText || 'SOP process and control text...'
      });

      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_SOP_ANALYZER', 'AI', null, `Executed SOP analyzer for ${sopTitle}`, req.ip);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  // 4. Financial Analyzer
  app.post("/api/ai/financial-analyzer", async (req: any, res: any, next: any) => {
    try {
      const { financialYear, department, rawFinancialData } = req.body;
      const result = await runFinancialAnalyzer({
        financialYear: financialYear || 'FY2025',
        department,
        rawFinancialData: typeof rawFinancialData === 'string' ? rawFinancialData : JSON.stringify(rawFinancialData || {})
      });

      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_FINANCIAL_ANALYZER', 'AI', null, `Ran financial analyzer for ${financialYear}`, req.ip);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  // 5. Risk Engine
  app.post("/api/ai/risk-engine", async (req: any, res: any, next: any) => {
    try {
      const { engagementName, department, historicalAnalysis, financialAnalysis, sopAnalysis, questionnaireResponses, documentsSummary } = req.body;
      const result = await runRiskEngine({
        engagementName: engagementName || 'Engagement Risk Assessment',
        department: department || 'Finance',
        historicalAnalysis,
        financialAnalysis,
        sopAnalysis,
        questionnaireResponses,
        documentsSummary
      });

      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_RISK_ENGINE', 'AI', null, `Generated risk matrix for ${engagementName}`, req.ip);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  // 6. Planning Generator
  app.post("/api/ai/planning-generator", async (req: any, res: any, next: any) => {
    try {
      const { engagementName, department, financialYear, auditType, riskEngineOutput, financialOutput, historicalOutput, questionnaireResponses } = req.body;
      const result = await runPlanningGenerator({
        engagementName: engagementName || 'Audit Planning Memorandum',
        department: department || 'Internal Audit',
        financialYear: financialYear || 'FY2025',
        auditType: auditType || 'Operational Review',
        riskEngineOutput,
        financialOutput,
        historicalOutput,
        questionnaireResponses
      });

      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_PLANNING_GENERATOR', 'AI', null, `Generated planning memorandum for ${engagementName}`, req.ip);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  // 7. Scoping Generator
  app.post("/api/ai/scoping-generator", async (req: any, res: any, next: any) => {
    try {
      const { engagementName, department, auditType, sopOutput, riskOutput } = req.body;
      const result = await runScopingGenerator({
        engagementName: engagementName || 'Audit Scoping Document',
        department: department || 'Finance',
        auditType: auditType || 'Operational Review',
        sopOutput,
        riskOutput
      });

      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_SCOPING_GENERATOR', 'AI', null, `Generated scoping document for ${engagementName}`, req.ip);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  // 8. Audit Program Generator
  app.post("/api/ai/audit-program-generator", async (req: any, res: any, next: any) => {
    try {
      const { engagementName, auditType, riskOutput, scopingOutput } = req.body;
      const result = await runAuditProgramGenerator({
        engagementName: engagementName || 'Tailored Audit Program',
        auditType: auditType || 'Operational Review',
        riskOutput,
        scopingOutput
      });

      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_AUDIT_PROGRAM_GENERATOR', 'AI', null, `Generated audit test program for ${engagementName}`, req.ip);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  // 9. Master Orchestrator for Full Audit Workspace Pipeline
  app.post("/api/ai/orchestrate-full", async (req: any, res: any, next: any) => {
    try {
      const { engagementId, engagementName, department, auditType, financialYear } = req.body;

      // Fetch uploaded documents from database
      const dbDocs = engagementId ? await db.select().from(documents).where(and(eq(documents.engagementId, engagementId), eq(documents.status, 'Active'))) : [];
      const dbHistoricalFindings = engagementId ? await db.select().from(historicalFindings).where(eq(historicalFindings.engagementId, engagementId)) : [];
      const dbHistoricalAudits = engagementId ? await db.select().from(historicalAudits).where(eq(historicalAudits.engagementId, engagementId)) : [];
      
      const dbQuestionnaireRec = engagementId ? await db.select().from(planningQuestionnaires).where(eq(planningQuestionnaires.engagementId, engagementId)).orderBy(desc(planningQuestionnaires.version)).limit(1) : [];

      let parsedQ = [];
      if (dbQuestionnaireRec.length > 0) {
        try { parsedQ = JSON.parse(dbQuestionnaireRec[0].responses); } catch (e) {}
      }

      const formattedDocs = dbDocs.map(d => ({
        name: d.name,
        category: d.category,
        rawText: `Document Title: ${d.name}\nCategory: ${d.category}\nFile Size: ${d.fileSize} bytes\nVersion: ${d.version}\nSummary: Internal audit working paper for ${d.name}.`
      }));

      const fullPipelineResult = await orchestrateFullAuditPipeline({
        engagementId: engagementId || `ENG-${Date.now().toString().slice(-4)}`,
        engagementName: engagementName || 'Comprehensive Audit Review',
        department: department || 'Finance & Treasury',
        auditType: auditType || 'Operational & Financial Control Review',
        financialYear: financialYear || 'FY2025',
        documents: formattedDocs.length > 0 ? formattedDocs : [{ name: 'SOP Financial Operations.pdf', category: 'SOP', rawText: 'Standard Operating Procedure for Payment Disbursements and Wire Approvals.' }],
        historicalFindings: dbHistoricalFindings,
        historicalAudits: dbHistoricalAudits,
        questionnaireResponses: parsedQ
      });

      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_FULL_ORCHESTRATION', 'AI', engagementId || null, `Orchestrated complete AI audit pipeline for ${engagementName}`, req.ip);

      res.json(fullPipelineResult);
    } catch (e) {
      next(e);
    }
  });

  // 10. AI Observability Metrics & Telemetry Logs
  app.get("/api/ai/observability-logs", async (req: any, res: any) => {
    const { moduleName, limit = '50' } = req.query;
    const limitNum = parseInt(limit as string, 10) || 50;
    
    const logs = aiObservability.getLogs(limitNum, moduleName as string);
    const metricsSummary = aiObservability.getMetricsSummary();

    res.json({
      metricsSummary,
      logs
    });
  });

  // ==========================================
  // 11. STAGED AI ORCHESTRATION & HUMAN REVIEW API
  // ==========================================

  // Helper to construct input payload from database for an engagement
  const constructEngagementPayload = async (engagementId: string, reqBody: any) => {
    const dbEngagementRec = engagementId ? await db.select().from(engagements).where(eq(engagements.id, engagementId)).limit(1) : [];
    const eng = dbEngagementRec.length > 0 ? dbEngagementRec[0] : null;

    const dbDocs = engagementId ? await db.select().from(documents).where(and(eq(documents.engagementId, engagementId), eq(documents.status, 'Active'))) : [];
    const dbHistoricalFindings = engagementId ? await db.select().from(historicalFindings).where(eq(historicalFindings.engagementId, engagementId)) : [];
    const dbHistoricalAudits = engagementId ? await db.select().from(historicalAudits).where(eq(historicalAudits.engagementId, engagementId)) : [];
    const dbQuestionnaireRec = engagementId ? await db.select().from(planningQuestionnaires).where(eq(planningQuestionnaires.engagementId, engagementId)).orderBy(desc(planningQuestionnaires.version)).limit(1) : [];

    let parsedQ = [];
    if (dbQuestionnaireRec.length > 0) {
      try { parsedQ = JSON.parse(dbQuestionnaireRec[0].responses); } catch (e) {}
    }

    const formattedDocs = dbDocs.map(d => ({
      name: d.name,
      category: d.category,
      rawText: `Document Title: ${d.name}\nCategory: ${d.category}\nFile Size: ${d.fileSize} bytes\nVersion: ${d.version}\nSummary: Internal audit working paper for ${d.name}.`
    }));

    return {
      engagementId: engagementId || `ENG-${Date.now().toString().slice(-4)}`,
      engagementName: reqBody?.engagementName || eng?.name || 'Enterprise Operational Audit',
      department: reqBody?.department || eng?.department || 'Finance & Treasury',
      auditType: reqBody?.auditType || eng?.auditType || 'Operational & Financial Control Review',
      financialYear: reqBody?.financialYear || eng?.financialYear || 'FY2025',
      documents: formattedDocs.length > 0 ? formattedDocs : [{ name: 'SOP Financial Operations.pdf', category: 'SOP', rawText: 'Standard Operating Procedure for Payment Disbursements and Wire Approvals.' }],
      historicalFindings: dbHistoricalFindings,
      historicalAudits: dbHistoricalAudits,
      questionnaireResponses: parsedQ
    };
  };

  // Stage 1: Document Intelligence + Historical + SOP + Financial + Risk Engine -> STOP
  app.post("/api/ai/staged/stage1", async (req: any, res: any, next: any) => {
    try {
      const payload = await constructEngagementPayload(req.body.engagementId, req.body);
      const result = await executeStage1(payload);
      
      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_STAGED_STAGE_1', 'AI', req.body.engagementId || null, `Executed Stage 1 AI Risk Matrix for ${payload.engagementName}`, req.ip);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: 'Stage 1 Execution Failed', message: e.message });
    }
  });

  // Stage 2: Planning Generator -> STOP (Requires Stage 1 Human Approval)
  app.post("/api/ai/staged/stage2", async (req: any, res: any, next: any) => {
    try {
      const payload = await constructEngagementPayload(req.body.engagementId, req.body);
      const result = await executeStage2(payload);

      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_STAGED_STAGE_2', 'AI', req.body.engagementId || null, `Executed Stage 2 Planning Memorandum for ${payload.engagementName}`, req.ip);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: 'Stage 2 Execution Failed', message: e.message });
    }
  });

  // Stage 3: Scoping Generator -> STOP (Requires Stage 2 Human Approval)
  app.post("/api/ai/staged/stage3", async (req: any, res: any, next: any) => {
    try {
      const payload = await constructEngagementPayload(req.body.engagementId, req.body);
      const result = await executeStage3(payload);

      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_STAGED_STAGE_3', 'AI', req.body.engagementId || null, `Executed Stage 3 Scoping Document for ${payload.engagementName}`, req.ip);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: 'Stage 3 Execution Failed', message: e.message });
    }
  });

  // Stage 4: Audit Program Generator -> Complete (Requires Stage 3 Human Approval)
  app.post("/api/ai/staged/stage4", async (req: any, res: any, next: any) => {
    try {
      const payload = await constructEngagementPayload(req.body.engagementId, req.body);
      const result = await executeStage4(payload);

      await logAuditAction(req.dbUser.id, req.dbUser.name, 'AI_STAGED_STAGE_4', 'AI', req.body.engagementId || null, `Executed Stage 4 Audit Program for ${payload.engagementName}`, req.ip);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: 'Stage 4 Execution Failed', message: e.message });
    }
  });

  // Get Staged Status and Approval State for an engagement
  app.get("/api/ai/staged/status/:engagementId", async (req: any, res: any) => {
    const { engagementId } = req.params;
    const stages = humanReviewManager.getEngagementStages(engagementId);
    res.json({ engagementId, stages });
  });

  // Human Review Action endpoint (Approve, Reject, Request Revision, Add Comments)
  app.post("/api/ai/staged/review-action", async (req: any, res: any, next: any) => {
    try {
      const { engagementId, stageNumber, action, comments, overrideOutputs } = req.body;
      if (!engagementId || !stageNumber || !action) {
        return res.status(400).json({ error: 'Missing required parameters: engagementId, stageNumber, action' });
      }

      const updatedStage = humanReviewManager.submitReviewAction(
        engagementId,
        stageNumber as 1 | 2 | 3 | 4,
        action as 'Approve' | 'Reject' | 'Request Revision' | 'Manual Override',
        req.dbUser.id,
        req.dbUser.name,
        comments,
        overrideOutputs
      );

      // Log in system audit table
      await db.insert(approvalHistory).values({
        engagementId,
        step: updatedStage.stageName,
        status: updatedStage.status,
        reviewerId: req.dbUser.id,
        reviewerName: req.dbUser.name,
        comments: comments || `Action: ${action}`,
        decidedAt: new Date()
      });

      await logAuditAction(
        req.dbUser.id,
        req.dbUser.name,
        `AI_HUMAN_REVIEW_${action.toUpperCase()}`,
        'AI_Review',
        engagementId,
        `Human Reviewer ${req.dbUser.name} submitted ${action} for ${updatedStage.stageName}`,
        req.ip
      );

      res.json({
        success: true,
        engagementId,
        stageNumber,
        updatedStage,
        allStages: humanReviewManager.getEngagementStages(engagementId)
      });
    } catch (e) {
      next(e);
    }
  });

  // API 404 Handler - If it starts with /api but didn't match any route
  app.use('/api', (req, res) => {
    console.warn(`[API 404] ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
      success: false, 
      message: `API route not found: ${req.method} ${req.originalUrl}` 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.warn('Production dist folder not found. Serving as API only.');
      app.get('*', (req, res) => {
        res.status(404).json({ success: false, message: 'Resource not found' });
      });
    }
  }

  // Global Error Handler - Move to the VERY end
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message || 'An unexpected error occurred'
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log('-------------------------------------------------------');
    console.log(`Enterprise Audit Application Started`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Port: ${PORT}`);
    console.log(`Uploads Directory: ${uploadsDir}`);
    console.log(`Database Status: Connected (PGlite)`);
    console.log(`[STARTUP] Final Memory: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`);
    console.log(`AI Status: Gemini AI Pipeline Ready`);
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log('-------------------------------------------------------');
  });
}

startServer().catch(err => {
  console.error("CRITICAL: Server failed to start:", err);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});
