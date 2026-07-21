import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db, initDb } from './src/db/index.js';
import { users, engagements, auditUniverse } from './src/db/schema.js';
import { eq, like, or, and, desc } from 'drizzle-orm';
import { SQL } from 'drizzle-orm';

const upload = multer({ storage: multer.memoryStorage() });
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-enterprise-key-2026';

// Auth Middleware
async function authenticate(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid token' });
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    
    // Ensure user exists in our DB
    const existingUser = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);
    if (existingUser.length === 0) {
       return res.status(401).json({ error: 'Unauthorized', message: 'User not found' });
    }
    req.dbUser = existingUser[0];
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Token verification failed' });
  }
}

async function startServer() {
  await initDb();
  
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
  
  // Middleware
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Auth Routes
  app.post('/api/auth/login', async (req: any, res: any, next: any) => {
    try {
      const { email, password } = req.body;
      const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (userList.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const user = userList[0];
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (e) {
      next(e);
    }
  });
  
  app.post('/api/auth/register', async (req: any, res: any, next: any) => {
    try {
      const { email, password, name } = req.body;
      const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (userList.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const newUser = await db.insert(users).values({
        email,
        passwordHash: hash,
        name: name || email.split('@')[0],
        role: 'Auditor'
      }).returning();
      const user = newUser[0];
      const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch(e) {
      next(e);
    }
  });

  app.get('/api/auth/me', authenticate, (req: any, res: any) => {
    const u = req.dbUser;
    res.json({ id: u.id, email: u.email, name: u.name, role: u.role });
  });
  
  // Users Route (for dropdowns)
  app.get('/api/users', authenticate, async (req: any, res: any, next: any) => {
     try {
       const allUsers = await db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users);
       res.json(allUsers);
     } catch (e) {
       next(e);
     }
  });

  // Annual Audit Planning Routes (Engagements)
  app.post("/api/audits", authenticate, async (req: any, res: any, next: any) => {
    try {
      const { name, department, businessUnit, financialYear, auditType, priority, status, description, startDate, expectedEndDate, planningLeadId, auditManagerId } = req.body;
      
      const newAudit = await db.insert(engagements).values({
        name,
        department,
        businessUnit,
        financialYear,
        auditType,
        priority: priority || 'Medium',
        status: status || 'Planning',
        description,
        startDate,
        expectedEndDate,
        planningLeadId: planningLeadId || null,
        auditManagerId: auditManagerId || null,
        ownerId: req.dbUser.id
      }).returning();
      res.status(201).json(newAudit[0]);
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/audits", authenticate, async (req: any, res: any, next: any) => {
    try {
      const { search, financialYear, department, status } = req.query;
      let conditions = [];
      
      if (search) {
        conditions.push(like(engagements.name, `%${search}%`));
      }
      if (financialYear) {
        conditions.push(eq(engagements.financialYear, financialYear));
      }
      if (department) {
        conditions.push(eq(engagements.department, department));
      }
      if (status) {
        conditions.push(eq(engagements.status, status));
      }

      let query = db.select().from(engagements);
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }
      
      const allAudits = await query.orderBy(desc(engagements.createdAt));
      res.json(allAudits);
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/audits/:id", authenticate, async (req: any, res: any, next: any) => {
    try {
      const audit = await db.select().from(engagements).where(eq(engagements.id, req.params.id)).limit(1);
      if (audit.length === 0) return res.status(404).json({ error: "Not found", message: "Audit not found" });
      res.json(audit[0]);
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/audits/:id", authenticate, async (req: any, res: any, next: any) => {
     try {
       const updated = await db.update(engagements)
         .set(req.body)
         .where(eq(engagements.id, req.params.id))
         .returning();
       res.json(updated[0]);
     } catch (e) {
       next(e);
     }
  });
  
  app.delete("/api/audits/:id", authenticate, async (req: any, res: any, next: any) => {
     try {
       await db.delete(engagements).where(eq(engagements.id, req.params.id));
       res.status(204).end();
     } catch (e) {
       next(e);
     }
  });

  // Audit Universe Routes
  app.post("/api/universe", authenticate, async (req: any, res: any, next: any) => {
     try {
       const { department, auditEntity, businessCriticality, auditFrequency, status } = req.body;
       const newEntity = await db.insert(auditUniverse).values({
         department,
         auditEntity,
         businessCriticality,
         auditFrequency,
         status,
         ownerId: req.dbUser.id
       }).returning();
       res.status(201).json(newEntity[0]);
     } catch (e) {
       next(e);
     }
  });

  app.get("/api/universe", authenticate, async (req: any, res: any, next: any) => {
    try {
      const { search, department, businessCriticality } = req.query;
      let conditions = [];
      
      if (search) {
        conditions.push(like(auditUniverse.auditEntity, `%${search}%`));
      }
      if (department) {
        conditions.push(eq(auditUniverse.department, department));
      }
      if (businessCriticality) {
        conditions.push(eq(auditUniverse.businessCriticality, businessCriticality));
      }

      let query = db.select().from(auditUniverse);
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }
      
      const universe = await query.orderBy(desc(auditUniverse.createdAt));
      res.json(universe);
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/universe/:id", authenticate, async (req: any, res: any, next: any) => {
     try {
       const updated = await db.update(auditUniverse)
         .set(req.body)
         .where(eq(auditUniverse.id, req.params.id))
         .returning();
       res.json(updated[0]);
     } catch (e) {
       next(e);
     }
  });
  
  app.delete("/api/universe/:id", authenticate, async (req: any, res: any, next: any) => {
     try {
       await db.delete(auditUniverse).where(eq(auditUniverse.id, req.params.id));
       res.status(204).end();
     } catch (e) {
       next(e);
     }
  });

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
