import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import pool from '../db.js';
import { sendReferralConfirmation } from '../email.js';

const router = Router();

const referralSchema = z.object({
  referrerName: z.string().trim().min(1),
  referrerEmail: z.string().trim().email(),
  referrerPhone: z.string().trim().optional(),
  friendName: z.string().trim().min(1),
  friendEmail: z.string().trim().email().optional().or(z.literal('')),
  friendCompany: z.string().trim().min(1),
  note: z.string().trim().optional(),
});

router.post('/', async (req, res) => {
  const parsed = referralSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid referral data',
      details: parsed.error.flatten(),
    });
  }

  const referral = {
    id: randomUUID(),
    ...parsed.data,
    referrerPhone: parsed.data.referrerPhone || null,
    friendEmail: parsed.data.friendEmail || null,
    note: parsed.data.note || null,
  };

  await pool.query(
    `INSERT INTO referrals (id, referrer_name, referrer_email, referrer_phone, friend_name, friend_email, friend_company, note)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      referral.id,
      referral.referrerName,
      referral.referrerEmail,
      referral.referrerPhone,
      referral.friendName,
      referral.friendEmail,
      referral.friendCompany,
      referral.note,
    ]
  );

  try {
    await sendReferralConfirmation(referral);
  } catch (error) {
    console.error('[email] Failed to send referral confirmation:', error);
  }

  return res.status(201).json(referral);
});

router.get('/', async (req, res) => {
  const adminKey = process.env.ADMIN_API_KEY;

  if (adminKey && req.get('x-api-key') !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { rows } = await pool.query(
    `SELECT
      id,
      referrer_name AS "referrerName",
      referrer_email AS "referrerEmail",
      referrer_phone AS "referrerPhone",
      friend_name AS "friendName",
      friend_email AS "friendEmail",
      friend_company AS "friendCompany",
      note,
      created_at AS "createdAt"
     FROM referrals
     ORDER BY created_at DESC`
  );

  return res.json({ items: rows });
});

export default router;
