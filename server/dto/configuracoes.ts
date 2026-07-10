export interface AppConfigResponse {
  businessName: string | null
  businessPhone: string | null
  businessEmail: string | null
  businessAddress: string | null
  openingHours: { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }[]
  defaultAppointmentDuration: number
  allowOnlineBooking: boolean
  sendReminders: boolean
  reminderHoursBefore: number
  theme: string
}
