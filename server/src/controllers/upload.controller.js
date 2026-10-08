import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'
import { uploadToCloudinary } from '../config/cloudinary.js'
import User from '../models/User.js'

// POST /api/uploads/profile
export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendError(res, { message: 'No file uploaded.', statusCode: 400 })
  }

  let imageUrl = null
  let publicId = null

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    try {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'plannova/profiles',
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
      })
      imageUrl = result.secure_url
      publicId = result.public_id
    } catch (err) {
      console.error('Cloudinary upload failed:', err.message)
      return sendError(res, { message: 'Image upload failed. Please try again.', statusCode: 500 })
    }
  } else {
    // Cloudinary not configured — store as base64 data URL for dev
    const base64 = req.file.buffer.toString('base64')
    imageUrl = `data:${req.file.mimetype};base64,${base64}`
  }

  await User.findByIdAndUpdate(req.user._id, { profileImage: imageUrl, profileImagePublicId: publicId })

  return sendSuccess(res, {
    message: 'Profile image uploaded.',
    data: { imageUrl },
  })
})

// POST /api/uploads/note-attachment
export const uploadNoteAttachment = asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    return sendError(res, { message: 'No files uploaded.', statusCode: 400 })
  }

  const attachments = []

  for (const file of req.files) {
    let url = null
    let publicId = null

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const result = await uploadToCloudinary(file.buffer, { folder: 'plannova/attachments' })
        url = result.secure_url
        publicId = result.public_id
      } catch (err) {
        console.error('Upload failed:', err)
      }
    } else {
      url = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    }

    attachments.push({
      url,
      publicId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    })
  }

  return sendSuccess(res, { message: 'Files uploaded.', data: { attachments } })
})
