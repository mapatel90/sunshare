/**
 * JWT Token Utilities
 * 
 * આ file JWT tokens generate અને verify કરવા માટે છે
 */

import jwt from 'jsonwebtoken';

// JWT Secret Key (આ .env.local માંથી આવશે)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // 7 days

/**
 * Generate JWT token
 * 
 * @param {Object} payload - User data to encode in token
 * @param {string} expiresIn - Token expiry time (default: 7d)
 * @returns {string} JWT token
 */
export function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  try {
    // Remove sensitive data from payload
    const { password, ...safePayload } = payload;
    
    const token = jwt.sign(safePayload, JWT_SECRET, {
      expiresIn,
      issuer: 'sunshare-app'
    });
    
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
}

/**
 * Verify JWT token
 * 
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'sunshare-app'
    });
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Token expired:', error.message);
      return null;
    }
    
    if (error.name === 'JsonWebTokenError') {
      console.error('Invalid token:', error.message);
      return null;
    }
    
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Decode token without verification (for debugging)
 * 
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload
 */
export function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}

/**
 * Generate refresh token (longer expiry)
 * 
 * @param {Object} payload - User data
 * @returns {string} Refresh token
 */
export function generateRefreshToken(payload) {
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
  return generateToken(payload, refreshExpiresIn);
}

/**
 * Extract token from Authorization header
 * 
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
export function extractTokenFromHeader(authHeader) {
  if (!authHeader) return null;
  
  // Support both "Bearer token" and just "token"
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return authHeader;
}

