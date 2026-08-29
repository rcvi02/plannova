/**
 * Standardized API response helper
 */
export const sendSuccess = (res, { message = 'Success', data = {}, statusCode = 200, pagination = null } = {}) => {
  const response = { success: true, message, data }
  if (pagination) response.pagination = pagination
  return res.status(statusCode).json(response)
}

export const sendError = (res, { message = 'Something went wrong', statusCode = 500, errors = null } = {}) => {
  const response = { success: false, message }
  if (errors) response.errors = errors
  return res.status(statusCode).json(response)
}

export const paginationMeta = ({ page, limit, total }) => ({
  page: parseInt(page),
  limit: parseInt(limit),
  total,
  pages: Math.ceil(total / limit),
})
