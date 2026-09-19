/**
 * RESTAURANTE BUCHISAPA - Verificación de Horario de Atención
 */

const BuchisapaBusinessHours = {
  config: {
    is24Hours: false,
    openHour: 11,
    openMinute: 0,
    closeHour: 23,
    closeMinute: 59,
    scheduleText: 'Lunes a Domingo: 11:00 AM - 11:59 PM'
  },

  check() {
    if (this.config.is24Hours) {
      return {
        isOpen: true,
        message: 'Abierto 24 Horas',
        warning: null
      };
    }

    const now = new Date();
    // En el navegador del usuario o zona horaria
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTotal = hours * 60 + minutes;

    const openTotal = this.config.openHour * 60 + this.config.openMinute;
    const closeTotal = this.config.closeHour * 60 + this.config.closeMinute;

    const isOpen = currentTotal >= openTotal && currentTotal <= closeTotal;

    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return {
      isOpen: isOpen,
      currentTime: timeString,
      schedule: this.config.scheduleText,
      warning: isOpen ? null : `⚠️ Atención: El restaurante se encuentra fuera del horario de atención en este momento (Hora actual: ${timeString}). Nuestro horario es de 11:00 AM a 11:59 PM. Tu pedido será procesado como pre-orden para el siguiente turno.`
    };
  },

  renderWarningInto(containerId) {
    const status = this.check();
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!status.isOpen && status.warning) {
      el.innerHTML = `
        <div style="background-color: #451a03; border: 1px solid #d97706; border-radius: 12px; padding: 12px 14px; margin-bottom: 14px; display: flex; align-items: flex-start; gap: 10px; color: #fef3c7; font-size: 13px; line-height: 1.4;">
          <span style="font-size: 18px;">⏰</span>
          <div>
            <div style="font-weight: 800; color: #fbbf24; margin-bottom: 3px;">Restaurante Fuera de Horario</div>
            <div>${status.warning}</div>
          </div>
        </div>
      `;
      el.style.display = 'block';
    } else {
      el.innerHTML = '';
      el.style.display = 'none';
    }
  }
};

window.BuchisapaBusinessHours = BuchisapaBusinessHours;
