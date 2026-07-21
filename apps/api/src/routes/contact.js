import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import pool from '../db.js';
import { sendContactConfirmation } from '../email.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  company: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  budget: z.string().trim().optional(),
  message: z.string().trim().min(1),
});

router.post('/', async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid message data',
      details: parsed.error.flatten(),
    });
  }

  const message = {
    id: randomUUID(),
    ...parsed.data,
    company: parsed.data.company || null,
    phone: parsed.data.phone || null,
    budget: parsed.data.budget || null,
  };

  await pool.query(
    `INSERT INTO contact_messages (id, name, email, company, phone, budget, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      message.id,
      message.name,
      message.email,
      message.company,
      message.phone,
      message.budget,
      message.message,
    ]
  );

  try {
    await sendContactConfirmation(message);
  } catch (error) {
    console.error('[email] Failed to send contact confirmation:', error);
  }

  return res.status(201).json(message);
});

router.get('/', async (req, res) => {
  const adminKey = process.env.ADMIN_API_KEY;

  if (adminKey && req.get('x-api-key') !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { rows } = await pool.query(
    `SELECT id, name, email, company, phone, budget, message, created_at AS "createdAt"
     FROM contact_messages
     ORDER BY created_at DESC`
  );

  return res.json({ items: rows });
});

export default router;
