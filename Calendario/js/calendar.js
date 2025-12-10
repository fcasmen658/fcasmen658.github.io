// calendar.js: Lógica principal para el funcionamiento del calendario.

// Variables globales para el mes y año actual
// (Declaradas arriba con JSDoc)
// Festivos - Se cargarán dinámicamente desde la API

// Calcular festivos locales de Almería según reglas específicas
// Devuelve un objeto con los días festivos de Almería para el año dado
/**
 * Lógica principal para el funcionamiento del calendario.
 * Este archivo contiene la lógica para calcular y mostrar el calendario,
 * así como la carga de festivos desde una API.
 */
// calendar.js: Lógica principal para el funcionamiento del calendario.

/**
 * Mes actual (0-11)
 * @type {number}
 */
let currentMonth = new Date().getMonth();

/**
 * Año actual (YYYY)
 * @type {number}
 */
let currentYear = new Date().getFullYear();

/**
 * Objeto que almacena los festivos cargados dinámicamente desde la API y locales.
 * Ejemplo: festivos['2026-12-25'] = {nombre: 'Navidad', tipo: 'Nacional'}
 * @type {Object}
 */
let festivos = {};

/**
 * Santoral: Diccionario con los santos principales por día, cargado dinámicamente desde santoral.json
 * @type {Object}
 */
let santoral = {};

/**
 * Tareas: Diccionario con las tareas por día, cargado dinámicamente desde tareas.json
 * @type {Object}
 */
let tareas = {};

/**
 * Calcula los festivos locales de Almería según reglas específicas:
 * - San Juan (24 junio) solo si es día laborable.
 * - Si San Juan cae en fin de semana, el 26 de diciembre es "Día del Pendón".
 * - Feria de Almería: 10 días, incluyendo la última semana completa de agosto.
 * - Virgen del Mar: último sábado de la Feria.
 * @param {number} year - Año a calcular.
 * @returns {Object} Objeto con los días festivos de Almería.
 */
function calculateAlmeriaHolidays(year) {
    const holidays = {};
    
    // San Juan (24 junio) - Solo si es día laborable (lunes a viernes)
    const sanJuan = new Date(year, 5, 24); // mes 5 = junio
    const sanJuanDay = sanJuan.getDay(); // 0=domingo, 1=lunes, ..., 5=viernes, 6=sábado
    const isSanJuanWeekday = sanJuanDay !== 0 && sanJuanDay !== 6; // No es domingo (0) ni sábado (6)
    
    if (isSanJuanWeekday) {
        holidays[`${year}-06-24`] = {nombre: 'San Juan (Almería)', tipo: 'Almeriense'};
    } else {
        // Si San Juan cae en fin de semana, entonces el 26 de diciembre es "Día del Pendón"
        const pendon = new Date(year, 11, 26);
        holidays[`${year}-12-26`] = {nombre: 'Día del Pendón (Almería)', tipo: 'Almeriense'};
        
        // Si el Pendón cae en domingo, también marcar el lunes
        if (pendon.getDay() === 0) {
            holidays[`${year}-12-27`] = {nombre: 'Día del Pendón (Almería)', tipo: 'Almeriense'};
        }
    }
    
    // Feria de Almería - 10 días: viernes, sábado y domingo + última semana completa de agosto
    // Encontrar el último domingo de agosto
    const lastDayOfAugust = new Date(year, 8, 0); // Último día de agosto
    const lastDay = lastDayOfAugust.getDate();
    let lastSunday = null;
    
    for (let day = lastDay; day >= 1; day--) {
        const date = new Date(year, 7, day); // mes 7 = agosto
        if (date.getDay() === 0) { // domingo
            lastSunday = day;
            break;
        }
    }
    
    // Última semana completa: de lunes a domingo
    const lastMonday = lastSunday - 6;
    
    // Viernes, sábado y domingo anteriores a la última semana
    const firstFriday = lastMonday - 3;
    const firstSaturday = lastMonday - 2;
    const firstSunday = lastMonday - 1;
    
    // Total 10 días de feria
    const feriaDays = [
        firstFriday, firstSaturday, firstSunday,  // Viernes, sábado, domingo previos
        lastMonday, lastMonday + 1, lastMonday + 2, lastMonday + 3, lastMonday + 4, lastMonday + 5, lastSunday  // Semana completa
    ];
    
    feriaDays.forEach(day => {
        holidays[`${year}-08-${String(day).padStart(2, '0')}`] = {nombre: 'Feria de Almería', tipo: 'Almeriense'};
    });
    
    // Virgen del Mar - Último sábado de la Feria (sábado de la última semana completa de agosto)
    const virgenDelMarDay = lastSunday - 1; // Sábado de la última semana
    holidays[`${year}-08-${String(virgenDelMarDay).padStart(2, '0')}`] = {
        nombre: 'Virgen del Mar (Almería) - Feria',
        tipo: 'Almeriense'
    };
    
    return holidays;
}

// Santoral completo 2025 y 2026 (selección principal de santos por día)
// Diccionario con los santos principales por día

// Calcular fase lunar usando algoritmo
function getMoonPhase(year, month, day) {
    const date = new Date(year, month, day);
    const year2 = year;
    let month2 = month + 1;
    
    if (month2 < 3) {
        year--;
        month2 += 12;
    }
    
    month2++;
    let c = 365.25 * year2;
    let e = 30.6 * month2;
    let jd = c + e + day - 694039.09;
    jd /= 29.5305882;
    
    let phase = jd - Math.floor(jd);
    
    // Determinar el emoji según la fase
    if (phase < 0.0625 || phase >= 0.9375) return '🌑'; // Luna Nueva
    if (phase < 0.1875) return '🌒'; // Creciente
    if (phase < 0.3125) return '🌓'; // Cuarto Creciente
    if (phase < 0.4375) return '🌔'; // Creciente Gibosa
    if (phase < 0.5625) return '🌕'; // Luna Llena
    if (phase < 0.6875) return '🌖'; // Menguante Gibosa
    if (phase < 0.8125) return '🌗'; // Cuarto Menguante
    if (phase < 0.9375) return '🌘'; // Menguante
    return '🌑';
}

// Cargar festivos desde la API de Nager.Date
async function loadHolidays(year) {
    try {
        // Limpiar todos los festivos anteriores del año actual
        Object.keys(festivos).forEach(key => {
            if (key.startsWith(`${year}-`)) {
                delete festivos[key];
            }
        });
        
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/ES`);
        const holidays = await response.json();
        
        holidays.forEach(holiday => {
            // Solo incluir festivos nacionales (global: true) o festivos de Andalucía (ES-AN)
            const isNational = holiday.global === true;
            const isAndalusian = holiday.counties && holiday.counties.includes('ES-AN');
            
            if (isNational || isAndalusian) {
                const [year, month, day] = holiday.date.split('-').map(Number);
                const holidayDate = new Date(year, month - 1, day);
                
                // Marcar el día original como festivo
                festivos[holiday.date] = {
                    nombre: holiday.localName || holiday.name,
                    tipo: isAndalusian ? 'Andaluz' : 'Nacional'
                };
                
                // Si el festivo cae en domingo, también marcar el lunes como festivo
                if (holidayDate.getDay() === 0) {
                    const monday = new Date(year, month - 1, day + 1);
                    const mondayDate = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
                    festivos[mondayDate] = {
                        nombre: holiday.localName || holiday.name,
                        tipo: isAndalusian ? 'Andaluz' : 'Nacional'
                    };
                }
            }
        });
        
        // Añadir festivos locales de Almería calculados dinámicamente
        const almeriaHolidays = calculateAlmeriaHolidays(year);
        Object.assign(festivos, almeriaHolidays);
        
        // Debug: verificar festivos de noviembre 2026
        if (year === 2026) {
            console.log('Festivos noviembre 2026:');
            console.log('2026-11-01:', festivos['2026-11-01']);
            console.log('2026-11-02:', festivos['2026-11-02']);
        }
        
    } catch (error) {
        console.error('Error cargando festivos:', error);
        // Mantener los festivos ya cargados si falla
    }
}

/**
 * Carga el santoral desde el archivo externo santoral.json
 */
async function loadSantoral() {
    try {
        const response = await fetch('js/santoral.json');
        santoral = await response.json();
    } catch (error) {
        console.error('Error cargando santoral:', error);
    }
}

/**
 * Carga las tareas desde el archivo externo tareas.json
 */
async function loadTareas() {
    try {
        const response = await fetch('js/tareas.json');
        tareas = await response.json();
    } catch (error) {
        console.error('Error cargando tareas:', error);
    }
}

function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month, year) {
    // Ajustar para que Lunes sea el primer día (0)
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
}

function formatDate(day, month, year) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

async function renderCalendar() {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

    document.getElementById('monthYear').textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear);

    let html = '<tr>';
    dayNames.forEach(day => {
        html += `<th>${day}</th>`;
    });
    html += '</tr>';

    // Días del mes anterior
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        html += `<td class="other-month"><div class="day-number">${day}</div></td>`;
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
        const date = formatDate(day, currentMonth, currentYear);
        const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
        const isFestivo = festivos[date];
        const keySantoral = `${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isSantoral = santoral[keySantoral];
        // Tareas: soporta array o string
        let tareasDia = tareas[keySantoral];
        if (typeof tareasDia === 'string') tareasDia = [tareasDia];
        const lunarPhase = getMoonPhase(currentYear, currentMonth, day);
        const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();

        let cellClass = '';
        if (isToday) cellClass = 'today';
        else if (isFestivo) {
            cellClass = isFestivo.tipo === 'Almeriense' ? 'festivo-almeriense' : 
                       isFestivo.tipo === 'Andaluz' ? 'festivo-andaluz' : 'festivo';
        } else if (dayOfWeek === 0 || dayOfWeek === 6) cellClass = 'weekend';

        html += `<td class="${cellClass}">
            <div class="day-number">${day}</div>
            ${lunarPhase ? `<div class="lunar-phase">${lunarPhase}</div>` : ''}
            ${isFestivo ? `<div class="festivo-label" title="${isFestivo.tipo}">🎉 ${isFestivo.nombre}</div>` : ''}
            ${isSantoral ? `<div class="santoral">${isSantoral}</div>` : ''}
            ${tareasDia && tareasDia.length ? `<div class="tareas">${tareasDia.map(t => `<div>📝 ${t}</div>`).join('')}</div>` : ''}
        </td>`;

        if ((firstDay + day) % 7 === 0) html += '</tr><tr>';
    }

    // Días del mes siguiente
    const totalCells = firstDay + daysInMonth;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let day = 1; day <= remaining; day++) {
        html += `<td class="other-month"><div class="day-number">${day}</div></td>`;
    }
    html += '</tr>';

    document.getElementById('calendar').innerHTML = html;
}

async function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    await loadHolidays(currentYear);
    await renderCalendar();
}

async function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    await loadHolidays(currentYear);
    await renderCalendar();
}

// Inicializar calendario
async function initCalendar() {
    await loadHolidays(currentYear);
    await renderCalendar();
}

// Renderizar calendario al cargar
(async function() {
    await loadSantoral();
    await loadTareas();
    await initCalendar();
})();
