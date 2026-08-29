import cron from 'node-cron'
import { markMissedTasks } from '../controllers/task.controller.js'
import { updateRevisionStatuses } from '../controllers/revision.controller.js'

export const initCronJobs = () => {
  // Mark overdue tasks as missed — every day at 00:05
  cron.schedule('5 0 * * *', async () => {
    console.log('⏰ [CRON] Running: markMissedTasks')
    try {
      const count = await markMissedTasks()
      console.log(`✅ [CRON] Marked ${count} tasks as missed.`)
    } catch (err) {
      console.error('❌ [CRON] markMissedTasks failed:', err.message)
    }
  })

  // Update revision statuses — every day at 00:10
  cron.schedule('10 0 * * *', async () => {
    console.log('⏰ [CRON] Running: updateRevisionStatuses')
    try {
      await updateRevisionStatuses()
    } catch (err) {
      console.error('❌ [CRON] updateRevisionStatuses failed:', err.message)
    }
  })

  console.log('✅ Cron jobs initialized.')
}
