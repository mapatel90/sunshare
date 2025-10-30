import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/AddProject', authenticateToken, async (req, res) => {
    try {
        const {
            name,
            type,
            offtaker_id,
            address1,
            address2,
            country_id,
            state_id,
            city_id,
            zipcode,
            investor_profit = '0',
            weshare_profit = '0',
            status = 1
        } = req.body;

        if (!name || !type || !offtaker_id || !address1 || !country_id || !state_id || !city_id) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const project = await prisma.project.create({
            data: {
                project_name: name,
                project_type: type,
                offtaker_id: parseInt(offtaker_id),
                address1,
                address2: address2 || '',
                countryId: parseInt(country_id),
                stateId: parseInt(state_id),
                cityId: parseInt(city_id),
                zipcode: zipcode || '',
                investor_profit,
                weshare_profit,
                status: parseInt(status)
            },
            include: {
                country: true,
                state: true,
                city: true,
                offtaker: {
                    select: { id: true, firstName: true, lastName: true, email: true }
                }
            }
        });

        res.status(201).json({ success: true, message: 'Project created successfully' });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, message: 'Error creating project' });
    }
});

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const offset = (pageInt - 1) * limitInt;

    const where = { is_deleted: 0 };

    // Optional filters
    if (search) {
      where.OR = [
        { project_name: { contains: search, mode: 'insensitive' } },
        { project_type: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status !== undefined) {
      where.status = parseInt(status);
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          offtaker: {
            select: { firstName: true, lastName: true, email: true }
          },
          city: true,
          state: true,
          country: true
        },
        skip: offset,
        take: limitInt,
        orderBy: { id: 'desc' }
      }),
      prisma.project.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: pageInt,
          limit: limitInt,
          total,
          pages: Math.ceil(total / limitInt)
        }
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.project.update({
      where: { id: parseInt(id) },
      data: { status: parseInt(status) },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get a single project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        offtaker: { select: { id: true, firstName: true, lastName: true, email: true } },
        city: true,
        state: true,
        country: true,
      },
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Get project by id error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a project by ID
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      offtaker_id,
      address1,
      address2,
      country_id,
      state_id,
      city_id,
      zipcode,
      investor_profit = '0',
      weshare_profit = '0',
      status,
    } = req.body;

    const updated = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { project_name: name }),
        ...(type !== undefined && { project_type: type }),
        ...(offtaker_id !== undefined && { offtaker_id: parseInt(offtaker_id) }),
        ...(address1 !== undefined && { address1 }),
        ...(address2 !== undefined && { address2 }),
        ...(country_id !== undefined && { countryId: parseInt(country_id) }),
        ...(state_id !== undefined && { stateId: parseInt(state_id) }),
        ...(city_id !== undefined && { cityId: parseInt(city_id) }),
        ...(zipcode !== undefined && { zipcode }),
        ...(investor_profit !== undefined && { investor_profit }),
        ...(weshare_profit !== undefined && { weshare_profit }),
        ...(status !== undefined && { status: parseInt(status) }),
      },
      include: {
        offtaker: { select: { id: true, firstName: true, lastName: true, email: true } },
        city: true,
        state: true,
        country: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a project by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.update({
      where: { id: parseInt(id) },
      data: { is_deleted: 1 }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;