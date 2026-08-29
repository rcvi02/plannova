import multer from 'multer'
import path from 'path'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_ATTACHMENT_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]
const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB

// Store in memory (stream to Cloudinary)
const storage = multer.memoryStorage()

const imageFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`), false)
  }
}

const attachmentFilter = (req, file, cb) => {
  if (ALLOWED_ATTACHMENT_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type.`), false)
  }
}

export const uploadProfileImage = multer({
  storage,
  limits: { fileSize: MAX_SIZE, files: 1 },
  fileFilter: imageFilter,
}).single('profileImage')

export const uploadNoteAttachment = multer({
  storage,
  limits: { fileSize: MAX_SIZE, files: 5 },
  fileFilter: attachmentFilter,
}).array('attachments', 5)
