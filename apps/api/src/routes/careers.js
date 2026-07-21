import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import pool from '../db.js';
import { sendApplicationConfirmation } from '../email.js';

const router = Router();

const applicationSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  roleTitle: z.string().trim().min(1),
  department: z.string().trim().optional(),
  portfolioUrl: z.string().trim().optional(),
  linkedinUrl: z.string().trim().optional(),
  coverNote: z.string().trim().optional(),
});

router.post('/', async (req, res) => {
  const parsed = applicationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid application data',
      details: parsed.error.flatten(),
    });
  }

  const application = {
    id: randomUUID(),
    ...parsed.data,
    phone: parsed.data.phone || null,
    department: parsed.data.department || null,
    portfolioUrl: parsed.data.portfolioUrl || null,
    linkedinUrl: parsed.data.linkedinUrl || null,
    coverNote: parsed.data.coverNote || null,
  };

  await pool.query(
    `INSERT INTO job_applications (id, name, email, phone, role_title, department, portfolio_url, linkedin_url, cover_note)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      application.id,
      application.name,
      application.email,
      application.phone,
      application.roleTitle,
      application.department,
      application.portfolioUrl,
      application.linkedinUrl,
      application.coverNote,
    ]
  );

  try {
    await sendApplicationConfirmation(application);
  } catch (error) {
    console.error('[email] Failed to send application confirmation:', error);
  }

  return res.status(201).json(application);
});

router.get('/', async (req, res) => {
  const adminKey = process.env.ADMIN_API_KEY;

  if (adminKey && req.get('x-api-key') !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { rows } = await pool.query(
    `SELECT
      id, name, email, phone,
      role_title AS "roleTitle",
      department,
      portfolio_url AS "portfolioUrl",
      linkedin_url AS "linkedinUrl",
      cover_note AS "coverNote",
      created_at AS "createdAt"
     FROM job_applications
     ORDER BY created_at DESC`
  );

  return res.json({ items: rows });
});

export default router;
