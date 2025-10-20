import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

// Configurar dayjs
dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export const useDateFormat = () => {
  const formatRelativeTime = (date: string | Date) => {
    return dayjs(date).fromNow()
  }

  const formatDate = (date: string | Date, format: string = 'DD/MM/YYYY HH:mm') => {
    return dayjs(date).format(format)
  }

  const isToday = (date: string | Date) => {
    return dayjs(date).isSame(dayjs(), 'day')
  }

  const isRecent = (date: string | Date, hours: number = 1) => {
    return dayjs().diff(dayjs(date), 'hour') < hours
  }

  return {
    formatRelativeTime,
    formatDate,
    isToday,
    isRecent
  }
}