import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * 生成JWT Token
 */
export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    } as any)
}

/**
 * 验证JWT Token
 */
export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

/**
 * 解码JWT Token（不验证）
 */
export const decodeToken = (token: string): any => {
    try {
        return jwt.decode(token)
    } catch (error) {
        return null
    }
}
