import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import nodemailer from 'nodemailer';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper: ensure directory exists
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Helper: save base64 dataURL to disk
const saveDataUrlToFile = (dataUrl, destDir) => {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid image data');
  }
  const mimeType = matches[1];
  const base64Data = matches[2];
  const ext = mimeType.split('/')[1] || 'png';
  const filename = `logo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  ensureDir(destDir);
  const filePath = join(destDir, filename);
  fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
  // Return public URL path (Next serves /public/* at /*)
  return `/images/logo/${filename}`;
};

// Helper: delete old logo if within logo dir
const deleteOldLogoIfSafe = (publicPath) => {
  try {
    if (!publicPath) return;
    // Only allow deletion inside /images/logo
    if (!publicPath.startsWith('/images/logo/')) return;
    const relativePath = publicPath.replace(/^[/\\]+/, '');
    const absolutePath = join(__dirname, '../../public', relativePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (e) {
    // Swallow deletion errors to avoid blocking upload
    console.warn('Failed to delete old logo', e.message);
  }
};

// Get all settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    
    // Convert array to object for easier access
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    
    res.json({
      success: true,
      data: settingsObj
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
});

// Get single setting by key
router.get('/:key', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await prisma.setting.findUnique({
      where: { key }
    });
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        key: setting.key,
        value: setting.value
      }
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching setting',
      error: error.message
    });
  }
});

// Update or create multiple settings
router.post('/bulk', authenticateToken, async (req, res) => {
  try {
    const settings = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid settings data provided'
      });
    }
    
    // Use transaction to update/create multiple settings
    const updatedSettings = await prisma.$transaction(async (prisma) => {
      const results = [];
      
      for (const [key, value] of Object.entries(settings)) {
        const setting = await prisma.setting.upsert({
          where: { key },
          update: { 
            value: String(value),
            updatedAt: new Date()
          },
          create: { 
            key, 
            value: String(value)
          }
        });
        results.push(setting);
      }
      
      return results;
    });
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
});

// Update or create single setting
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { key, value } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Key and value are required'
      });
    }
    
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { 
        value: String(value),
        updatedAt: new Date()
      },
      create: { 
        key, 
        value: String(value)
      }
    });
    
    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: setting
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating setting',
      error: error.message
    });
  }
});

// Delete setting
router.delete('/:key', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await prisma.setting.findUnique({
      where: { key }
    });
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }
    
    await prisma.setting.delete({
      where: { key }
    });
    
    res.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting setting',
      error: error.message
    });
  }
});

// Upload site logo (accepts base64 data URL), saves under public/images/logo and deletes old
router.post('/upload-logo', authenticateToken, async (req, res) => {
  try {
    const { dataUrl, oldImagePath } = req.body || {};
    if (!dataUrl) {
      return res.status(400).json({ success: false, message: 'dataUrl is required' });
    }

    const logoDir = join(__dirname, '../../public/images/logo');
    const publicPath = saveDataUrlToFile(dataUrl, logoDir);

    // Delete previous logo if provided
    deleteOldLogoIfSafe(oldImagePath);

    return res.json({ success: true, message: 'Logo uploaded', data: { path: publicPath } });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return res.status(500).json({ success: false, message: 'Error uploading logo', error: error.message });
  }
});

// Send test email using SMTP settings stored in DB
router.post('/test-email', authenticateToken, async (req, res) => {
  try {
    console.log('Received test email request with body:', req.body);
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ success: false, message: 'Recipient email (to) is required' });
    }

    // Fetch relevant SMTP settings (prefer smtp_* then legacy email_*)
    const smtpKeys = [
      'smtp_email',
      'smtp_email_from_address',
      'smtp_email_from_name',
      'smtp_email_host',
      'smtp_email_user',
      'smtp_email_password',
      'smtp_email_port',
      'smtp_email_security_type',
    ];

    const settings = await prisma.setting.findMany({ where: { key: { in: smtpKeys } } });
    // console.log('Fetched SMTP settings from DB:', settings);
    const s = settings.reduce((acc, it) => { acc[it.key] = it.value; return acc; }, {});

    const protocol = s['smtp_email'] || 'SSL';
    const fromAddress = s['smtp_email_from_address'] || '';
    const fromName = s['smtp_email_from_name'] || '';
    const host = s['smtp_email_host'] || '';
    const user = s['smtp_email_user'] || '';
    const pass = s['smtp_email_password'] || '';
    const portStr = s['smtp_email_port'] || '';

    const port = Number(portStr);
    const secure = Number(port) === 465 || (protocol || '').toUpperCase() === 'SSL';

    if (!fromAddress || !host || !user || !pass || !port) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete SMTP configuration. Please fill all required SMTP fields before testing.',
      });
    }

    const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
    await transporter.verify();

    const info = await transporter.sendMail({
      from: fromName ? `${fromName} <${fromAddress}>` : fromAddress,
      to,
      subject: 'SMTP Test Email',
      text: 'This is a test email to verify your SMTP settings.',
    });

    res.json({ success: true, message: 'Test email sent successfully', data: { messageId: info.messageId } });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ success: false, message: 'Failed to send test email', error: error.message });
  }
});

export default router;