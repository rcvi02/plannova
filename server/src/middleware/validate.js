import { sendError } from '../utils/apiResponse.js'

/**
 * Zod schema validation middleware factory
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    const errors = result.error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    return sendError(res, {
      message: 'Validation failed',
      statusCode: 400,
      errors,
    })
  }
  req.body = result.data
  next()
}

export default validate
