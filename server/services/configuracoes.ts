import { prisma } from '../../src/lib/prisma'

export async function getConfig(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      businessName: true,
      businessPhone: true,
      businessEmail: true,
      businessAddress: true,
      businessHours: {
        orderBy: { dayOfWeek: 'asc' },
      },
    },
  })

  if (!user) return null

  return {
    businessName: user.businessName,
    businessPhone: user.businessPhone,
    businessEmail: user.businessEmail ?? '',
    businessAddress: user.businessAddress,
    openingHours: user.businessHours.map((h) => ({
      dayOfWeek: h.dayOfWeek,
      isOpen: h.isOpen,
      openTime: h.openTime,
      closeTime: h.closeTime,
    })),
    defaultAppointmentDuration: 60,
    allowOnlineBooking: true,
    sendReminders: true,
    reminderHoursBefore: 24,
    theme: 'system',
  }
}

export async function updateConfig(userId: string, data: Record<string, unknown>) {
  const { openingHours, ...userData } = data

  if (Object.keys(userData).length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: userData,
    })
  }

  if (openingHours) {
    await prisma.businessHour.deleteMany({ where: { userId } })
    await prisma.businessHour.createMany({
      data: (openingHours as { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }[]).map(
        (h) => ({ ...h, userId }),
      ),
    })
  }

  return getConfig(userId)
}
