/**
 * Utilitario para verificación del horario de atención del restaurante Buchisapa.
 * Considera la zona horaria oficial de Perú (America/Lima, UTC-5).
 */

export interface DaySchedule {
  isOpen: boolean;
  openTime: string; // formato "HH:mm" (24h), ej: "11:30"
  closeTime: string; // formato "HH:mm" (24h), ej: "23:45"
  name: string;
}

export interface RestaurantScheduleConfig {
  is24Hours: boolean;
  timeZone: string;
  weeklySchedule: Record<number, DaySchedule>; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  specialNotice?: string;
  allowPreOrdersOutsideHours?: boolean;
}

export interface BusinessHoursStatus {
  isOpen: boolean;
  currentDayName: string;
  currentTimeString: string;
  scheduleDescription: string;
  warningMessage: string | null;
  canPlaceOrder: boolean;
  nextOpeningString?: string;
  is24Hours: boolean;
}

// Configuración por defecto de Buchisapa
export const DEFAULT_RESTAURANT_SCHEDULE: RestaurantScheduleConfig = {
  is24Hours: false, // Horario comercial habitual con soporte de turno nocturno
  timeZone: 'America/Lima',
  allowPreOrdersOutsideHours: true,
  weeklySchedule: {
    0: { isOpen: true, openTime: '11:00', closeTime: '23:59', name: 'Domingo' },
    1: { isOpen: true, openTime: '11:00', closeTime: '23:59', name: 'Lunes' },
    2: { isOpen: true, openTime: '11:00', closeTime: '23:59', name: 'Martes' },
    3: { isOpen: true, openTime: '11:00', closeTime: '23:59', name: 'Miércoles' },
    4: { isOpen: true, openTime: '11:00', closeTime: '23:59', name: 'Jueves' },
    5: { isOpen: true, openTime: '11:00', closeTime: '23:59', name: 'Viernes' },
    6: { isOpen: true, openTime: '11:00', closeTime: '23:59', name: 'Sábado' },
  }
};

/**
 * Obtiene la fecha y hora actual en la zona horaria del restaurante (America/Lima).
 */
export function getRestaurantCurrentDateTime(timeZone = 'America/Lima'): {
  date: Date;
  dayOfWeek: number;
  hours: number;
  minutes: number;
  timeString: string;
  dayName: string;
} {
  const now = new Date();
  
  // Convertir a fecha formateada en la zona horaria de Lima
  const formatter = new Intl.DateTimeFormat('es-PE', {
    timeZone,
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = formatter.formatToParts(now);
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';

  const hours = parseInt(getPart('hour') || '0', 10);
  const minutes = parseInt(getPart('minute') || '0', 10);
  const dayName = getPart('weekday');

  // Obtener día de la semana numérico (0 = Domingo .. 6 = Sábado) en timezone Lima
  const dayNameMap: Record<string, number> = {
    'domingo': 0,
    'lunes': 1,
    'martes': 2,
    'miércoles': 3,
    'miercoles': 3,
    'jueves': 4,
    'viernes': 5,
    'sábado': 6,
    'sabado': 6
  };
  
  const normalizedDay = dayName.toLowerCase().trim();
  const dayOfWeek = dayNameMap[normalizedDay] ?? now.getDay();

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const timeString = `${formattedHours}:${formattedMinutes}`;

  return {
    date: now,
    dayOfWeek,
    hours,
    minutes,
    timeString,
    dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1)
  };
}

/**
 * Convierte "HH:mm" a minutos transcurridos desde medianoche.
 */
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Verifica si el restaurante está abierto en el momento actual o una fecha dada.
 */
export function checkBusinessHours(
  config: RestaurantScheduleConfig = DEFAULT_RESTAURANT_SCHEDULE
): BusinessHoursStatus {
  if (config.is24Hours) {
    const current = getRestaurantCurrentDateTime(config.timeZone);
    return {
      isOpen: true,
      currentDayName: current.dayName,
      currentTimeString: current.timeString,
      scheduleDescription: 'Atención continua las 24 Horas',
      warningMessage: null,
      canPlaceOrder: true,
      is24Hours: true
    };
  }

  const current = getRestaurantCurrentDateTime(config.timeZone);
  const todaySchedule = config.weeklySchedule[current.dayOfWeek];

  if (!todaySchedule || !todaySchedule.isOpen) {
    return {
      isOpen: false,
      currentDayName: current.dayName,
      currentTimeString: current.timeString,
      scheduleDescription: 'Cerrado hoy',
      warningMessage: `El restaurante se encuentra cerrado el día de hoy (${current.dayName}).`,
      canPlaceOrder: Boolean(config.allowPreOrdersOutsideHours),
      is24Hours: false
    };
  }

  const currentMinutes = current.hours * 60 + current.minutes;
  const openMinutes = timeToMinutes(todaySchedule.openTime);
  const closeMinutes = timeToMinutes(todaySchedule.closeTime);

  // Verificación normal de rango de horas
  let isCurrentlyOpen = false;

  if (closeMinutes >= openMinutes) {
    // Horario diurno regular (ej. 11:00 a 23:30)
    isCurrentlyOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  } else {
    // Horario que cruza la medianoche (ej. 18:00 a 03:00)
    isCurrentlyOpen = currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  }

  const scheduleDesc = `Lunes a Domingo de ${format12h(todaySchedule.openTime)} a ${format12h(todaySchedule.closeTime)}`;

  if (isCurrentlyOpen) {
    return {
      isOpen: true,
      currentDayName: current.dayName,
      currentTimeString: current.timeString,
      scheduleDescription: scheduleDesc,
      warningMessage: null,
      canPlaceOrder: true,
      is24Hours: false
    };
  }

  // Si está cerrado, generar mensaje de advertencia claro
  const warning = `⚠️ El restaurante está fuera de horario en este momento (Hora actual en Tarapoto: ${current.timeString} hrs). Nuestro horario de atención es de ${format12h(todaySchedule.openTime)} a ${format12h(todaySchedule.closeTime)}.`;

  return {
    isOpen: false,
    currentDayName: current.dayName,
    currentTimeString: current.timeString,
    scheduleDescription: scheduleDesc,
    warningMessage: warning,
    canPlaceOrder: Boolean(config.allowPreOrdersOutsideHours),
    nextOpeningString: `Abre a las ${format12h(todaySchedule.openTime)}`,
    is24Hours: false
  };
}

/**
 * Formato amigable de 12 horas (ej: "11:30 AM", "11:59 PM").
 */
export function format12h(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${suffix}`;
}
