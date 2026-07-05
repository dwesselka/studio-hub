export interface AppConfig {
  businessName: string
  businessPhone: string
  businessEmail: string
  businessAddress: string
  openingHours: string
  defaultAppointmentDuration: number
  allowOnlineBooking: boolean
  sendReminders: boolean
  reminderHoursBefore: number
  theme: 'light' | 'dark' | 'system'
}
