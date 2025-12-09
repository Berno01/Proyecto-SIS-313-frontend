/**
 * Utility para formatear fechas desde el formato de la API
 */

/**
 * Convierte un array de fecha de la API a un string formateado
 * @param fechaArray - Array de 6 números: [año, mes, día, hora, min, seg]
 * @returns String formateado como "DD/MM/YYYY HH:mm"
 * @example formatFechaVenta([2025, 11, 7, 22, 28, 54]) → "07/11/2025 22:28"
 */
export function formatFechaVenta(fechaArray: number[]): string {
  if (!fechaArray || fechaArray.length < 6) {
    return 'Fecha inválida';
  }

  const [year, month, day, hour, minute] = fechaArray;

  // Agregar ceros a la izquierda si es necesario
  const dia = day.toString().padStart(2, '0');
  const mes = month.toString().padStart(2, '0');
  const hora = hour.toString().padStart(2, '0');
  const min = minute.toString().padStart(2, '0');

  return `${dia}/${mes}/${year} ${hora}:${min}`;
}

/**
 * Convierte un array de fecha de la API a un objeto Date
 * @param fechaArray - Array de 6 números: [año, mes, día, hora, min, seg]
 * @returns Objeto Date
 */
export function arrayToDate(fechaArray: number[]): Date {
  if (!fechaArray || fechaArray.length < 6) {
    return new Date();
  }

  const [year, month, day, hour, minute, second] = fechaArray;
  // Nota: En JavaScript, los meses van de 0-11, pero la API envía 1-12
  return new Date(year, month - 1, day, hour, minute, second);
}
