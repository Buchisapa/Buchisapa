<?php

namespace App\Helpers;

use DateTime;
use DateTimeZone;

class BusinessHoursHelper
{
    const TIMEZONE = 'America/Lima';

    /**
     * Obtiene el estado actual del horario de atención del restaurante.
     *
     * @param bool $is24Hours
     * @param string $openTime "11:00"
     * @param string $closeTime "23:59"
     * @return array
     */
    public static function check(bool $is24Hours = false, string $openTime = '11:00', string $closeTime = '23:59'): array
    {
        $timezone = new DateTimeZone(self::TIMEZONE);
        $now = new DateTime('now', $timezone);

        $currentHour = (int)$now->format('H');
        $currentMinute = (int)$now->format('i');
        $currentTotalMinutes = ($currentHour * 60) + $currentMinute;
        $timeString = $now->format('h:i A');
        $dayName = self::getDayNameInSpanish((int)$now->format('w'));

        if ($is24Hours) {
            return [
                'is_open' => true,
                'status' => 'abierto',
                'current_time' => $timeString,
                'day' => $dayName,
                'schedule_text' => 'Atención las 24 Horas',
                'warning' => null,
                'can_order' => true,
            ];
        }

        list($openH, $openM) = explode(':', $openTime);
        list($closeH, $closeM) = explode(':', $closeTime);

        $openMinutes = ((int)$openH * 60) + (int)$openM;
        $closeMinutes = ((int)$closeH * 60) + (int)$closeM;

        $isOpen = false;
        if ($closeMinutes >= $openMinutes) {
            $isOpen = ($currentTotalMinutes >= $openMinutes && $currentTotalMinutes <= $closeMinutes);
        } else {
            // Cruce de medianoche
            $isOpen = ($currentTotalMinutes >= $openMinutes || $currentTotalMinutes <= $closeMinutes);
        }

        $formattedOpen = date('h:i A', strtotime($openTime));
        $formattedClose = date('h:i A', strtotime($closeTime));
        $scheduleText = "Lunes a Domingo de {$formattedOpen} a {$formattedClose}";

        $warning = null;
        if (!$isOpen) {
            $warning = "⚠️ Fuera de horario de atención (Hora actual: {$timeString}). Nuestro horario es de {$formattedOpen} a {$formattedClose}. Su pedido será recibido como pre-orden y preparado en el siguiente turno.";
        }

        return [
            'is_open' => $isOpen,
            'status' => $isOpen ? 'abierto' : 'cerrado',
            'current_time' => $timeString,
            'day' => $dayName,
            'schedule_text' => $scheduleText,
            'open_time' => $formattedOpen,
            'close_time' => $formattedClose,
            'warning' => $warning,
            'can_order' => true, // Permite pre-órdenes o muestra advertencia
        ];
    }

    private static function getDayNameInSpanish(int $dayOfWeek): string
    {
        $days = [
            0 => 'Domingo',
            1 => 'Lunes',
            2 => 'Martes',
            3 => 'Miércoles',
            4 => 'Jueves',
            5 => 'Viernes',
            6 => 'Sábado',
        ];
        return $days[$dayOfWeek] ?? 'Hoy';
    }
}
