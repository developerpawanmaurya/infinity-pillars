import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import pool from '../db.js';
import { sendBookingConfirmation } from '../email.js';

const router = Router();

const allowedServices = [
  'SEO',
  'PPC Advertising',
  'Social Media Marketing',
  'Content Marketing',
  'Email Marketing Automation',
];

const bookingSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  company: z.string().trim().min(1),
  phone: z.string().trim().optional(),
  selectedServices: z.array(z.enum(allowedServices)).min(1),
  additionalInfo: z.string().optional(),
  bookedDateTime: z.string().datetime().optional(),
  location: z.string().optional(),
});

router.post('/', async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid booking data',
      details: parsed.error.flatten(),
    });
  }

  const booking = {
    id: randomUUID(),
    ...parsed.data,
    phone: parsed.data.phone || null,
    additionalInfo: parsed.data.additionalInfo || null,
    bookedDateTime: parsed.data.bookedDateTime || null,
    location: parsed.data.location || null,
  };

  await pool.query(
    `INSERT INTO bookings (id, name, email, company, phone, selected_services, additional_info, booked_date_time, location)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      booking.id,
      booking.name,
      booking.email,
      booking.company,
      booking.phone,
      JSON.stringify(booking.selectedServices),
      booking.additionalInfo,
      booking.bookedDateTime,
      booking.location,
    ]
  );

  try {
    await sendBookingConfirmation(booking);
  } catch (error) {
    console.error('[email] Failed to send confirmation:', error);
  }

  return res.status(201).json({
    id: booking.id,
    name: booking.name,
    email: booking.email,
    company: booking.company,
    phone: booking.phone,
    selectedServices: booking.selectedServices,
    additionalInfo: booking.additionalInfo,
    bookedDateTime: booking.bookedDateTime,
    location: booking.location,
  });
});

router.get('/', async (req, res) => {
  const adminKey = process.env.ADMIN_API_KEY;

  if (adminKey && req.get('x-api-key') !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { rows } = await pool.query(
    `SELECT
      id, name, email, company, phone,
      selected_services AS "selectedServices",
      additional_info AS "additionalInfo",
      booked_date_time AS "bookedDateTime",
      location,
      created_at AS "createdAt"
     FROM bookings
     ORDER BY created_at DESC`
  );

  const items = rows.map(row => ({
    ...row,
    selectedServices: JSON.parse(row.selectedServices),
  }));

  return res.json({ items });
});

export default router;
