import mongoose from 'mongoose'
import { sendError } from '../utils/apiResponse.js'

/**
 * Validates MongoDB ObjectId params before hitting controllers
 */
const objectIdCheck = (...params) => (req, res, next) => {
  for (const param of params) {
    const id = req.params[param]
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, {
        message: `Invalid ID format for parameter: ${param}`,
        statusCode: 400,
      })
    }
  }
  next()
}

export default objectIdCheck
