import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const inverterTypes = await prisma.inverterType.findMany({
      orderBy: { type: 'asc' },
    });
    res.status(200).json({ success: true, data: inverterTypes });
  } catch (error) {
     console.error('Error fetching inverter types:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
