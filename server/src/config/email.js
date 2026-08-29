import nodemailer from 'nodemailer'

const createTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email not configured — emails will be logged to console only')
    return null
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: parseInt(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  })
}

export const transporter = createTransporter()

export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.log(`📧 [EMAIL MOCK] To: ${to} | Subject: ${subject}`)
    return { messageId: 'mock-id' }
  }
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'StudyFlow <noreply@studyflow.app>',
    to,
    subject,
    html,
  }
  return transporter.sendMail(mailOptions)
}

export default transporter
