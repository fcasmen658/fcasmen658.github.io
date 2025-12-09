let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Festivos - Se cargarán dinámicamente desde la API
let festivos = {};

// Calcular festivos locales de Almería según reglas específicas
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
const santoral = {
    // 2025
    '2025-01-01': 'María Madre de Dios, Año Nuevo',
    '2025-01-02': 'Basilio Magno, Gregorio de Naciánzo',
    '2025-01-03': 'Genoveva, Prisciliano',
    '2025-01-06': 'Reyes Magos, Epifanía',
    '2025-01-17': 'Antonio Abad',
    '2025-01-20': 'Fabián, Sebastián',
    '2025-01-21': 'Inés',
    '2025-02-02': 'Candelaria, Presentación',
    '2025-02-03': 'Blas, Óscar',
    '2025-02-05': 'Águeda',
    '2025-02-10': 'Escolástica',
    '2025-02-14': 'Valentín, Valentina',
    '2025-02-21': 'Pedro Damián',
    '2025-02-28': 'Leandro, Román',
    '2025-03-17': 'Patricio',
    '2025-03-19': 'San José',
    '2025-03-25': 'Anunciación, Encarnación',
    '2025-04-17': 'Jueves Santo',
    '2025-04-18': 'Viernes Santo',
    '2025-04-20': 'Domingo de Resurrección',
    '2025-04-23': 'Jorge',
    '2025-04-25': 'Marcos',
    '2025-04-29': 'Catalina de Siena',
    '2025-05-01': 'Felipe, Santiago el Menor',
    '2025-05-02': 'Atanasio',
    '2025-05-03': 'Felipe, Santiago',
    '2025-05-15': 'Isidro Labrador',
    '2025-05-29': 'Ascensión del Señor',
    '2025-06-08': 'Pentecostés',
    '2025-06-11': 'Bernabé',
    '2025-06-13': 'Antonio de Padua',
    '2025-06-24': 'San Juan Bautista',
    '2025-06-29': 'Pedro y Pablo',
    '2025-07-03': 'Tomás Apóstol',
    '2025-07-11': 'Benito',
    '2025-07-22': 'María Magdalena',
    '2025-07-25': 'Santiago Apóstol',
    '2025-07-31': 'Ignacio de Loyola',
    '2025-08-01': 'Alfonso María de Ligorio',
    '2025-08-04': 'Juan María Vianney',
    '2025-08-10': 'Lorenzo',
    '2025-08-11': 'Clara',
    '2025-08-14': 'Maximiliano Kolbe',
    '2025-08-15': 'Asunción de María',
    '2025-08-24': 'Bartolomé',
    '2025-08-28': 'Agustín',
    '2025-08-29': 'Decapitación San Juan Bautista',
    '2025-09-03': 'Gregorio Magno',
    '2025-09-08': 'Natividad de María',
    '2025-09-14': 'Exaltación de la Cruz',
    '2025-09-21': 'Mateo Apóstol',
    '2025-09-23': 'Pío de Pietrelcina',
    '2025-09-29': 'Miguel, Gabriel y Rafael',
    '2025-10-01': 'Teresa del Niño Jesús',
    '2025-10-02': 'Ángeles Custodios',
    '2025-10-15': 'Teresa de Jesús',
    '2025-10-28': 'Simón, Judas Tadeo',
    '2025-11-01': 'Todos los Santos',
    '2025-11-02': 'Difuntos',
    '2025-11-04': 'Carlos Borromeo',
    '2025-11-10': 'León Magno',
    '2025-11-11': 'Martín de Tours',
    '2025-11-17': 'Isabel de Hungría',
    '2025-11-30': 'Andrés Apóstol',
    '2025-12-03': 'Francisco Javier',
    '2025-12-06': 'Nicolás de Bari',
    '2025-12-08': 'Inmaculada Concepción',
    '2025-12-13': 'Lucía',
    '2025-12-14': 'Juan de la Cruz',
    '2025-12-25': 'Navidad, Jesús',
    '2025-12-26': 'Esteban, Protomártir',
    '2025-12-27': 'Juan Evangelista',
    '2025-12-28': 'Santos Inocentes',
    '2025-12-31': 'Silvestre',
    // 2026
    '2026-01-01': 'María Madre de Dios, Año Nuevo',
    '2026-01-02': 'Basilio Magno, Gregorio de Naciánzo',
    '2026-01-03': 'Genoveva, Prisciliano',
    '2026-01-06': 'Reyes Magos, Epifanía',
    '2026-01-17': 'Antonio Abad',
    '2026-01-20': 'Fabián, Sebastián',
    '2026-01-21': 'Inés',
    '2026-02-02': 'Candelaria, Presentación',
    '2026-02-03': 'Blas, Óscar',
    '2026-02-05': 'Águeda',
    '2026-02-10': 'Escolástica',
    '2026-02-14': 'Valentín, Valentina',
    '2026-02-21': 'Pedro Damián',
    '2026-02-28': 'Leandro, Román',
    '2026-03-17': 'Patricio',
    '2026-03-19': 'San José',
    '2026-03-25': 'Anunciación, Encarnación',
    '2026-04-02': 'Francisco, Ofelia',
    '2026-04-03': 'Viernes Santo',
    '2026-04-05': 'Domingo de Resurrección',
    '2026-04-23': 'Jorge',
    '2026-04-25': 'Marcos',
    '2026-04-29': 'Catalina de Siena',
    '2026-05-01': 'Felipe, Santiago el Menor',
    '2026-05-02': 'Atanasio',
    '2026-05-03': 'Felipe, Santiago',
    '2026-05-14': 'Ascensión del Señor',
    '2026-05-15': 'Isidro Labrador',
    '2026-05-24': 'Pentecostés',
    '2026-05-31': 'Santísima Trinidad',
    '2026-06-11': 'Bernabé',
    '2026-06-12': 'Sagrado Corazón',
    '2026-06-13': 'Inmaculado Corazón de María',
    '2026-06-24': 'San Juan Bautista',
    '2026-06-29': 'Pedro y Pablo',
    '2026-07-03': 'Tomás Apóstol',
    '2026-07-11': 'Benito',
    '2026-07-22': 'María Magdalena',
    '2026-07-25': 'Santiago Apóstol',
    '2026-07-31': 'Ignacio de Loyola',
    '2026-08-01': 'Alfonso María de Ligorio',
    '2026-08-04': 'Juan María Vianney',
    '2026-08-10': 'Lorenzo',
    '2026-08-11': 'Clara',
    '2026-08-14': 'Maximiliano Kolbe',
    '2026-08-15': 'Asunción de María',
    '2026-08-24': 'Bartolomé',
    '2026-08-28': 'Agustín',
    '2026-08-29': 'Decapitación San Juan Bautista',
    '2026-09-03': 'Gregorio Magno',
    '2026-09-08': 'Natividad de María',
    '2026-09-14': 'Exaltación de la Cruz',
    '2026-09-21': 'Mateo Apóstol',
    '2026-09-23': 'Pío de Pietrelcina',
    '2026-09-29': 'Miguel, Gabriel y Rafael',
    '2026-10-01': 'Teresa del Niño Jesús',
    '2026-10-02': 'Ángeles Custodios',
    '2026-10-15': 'Teresa de Jesús',
    '2026-10-28': 'Simón, Judas Tadeo',
    '2026-11-01': 'Todos los Santos',
    '2026-11-02': 'Difuntos',
    '2026-11-04': 'Carlos Borromeo',
    '2026-11-10': 'León Magno',
    '2026-11-11': 'Martín de Tours',
    '2026-11-17': 'Isabel de Hungría',
    '2026-11-30': 'Andrés Apóstol',
    '2026-12-03': 'Francisco Javier',
    '2026-12-06': 'Nicolás de Bari',
    '2026-12-08': 'Inmaculada Concepción',
    '2026-12-13': 'Lucía',
    '2026-12-14': 'Juan de la Cruz',
    '2026-12-25': 'Navidad, Jesús',
    '2026-12-26': 'Esteban, Protomártir',
    '2026-12-27': 'Juan Evangelista',
    '2026-12-28': 'Santos Inocentes',
    '2026-12-31': 'Silvestre'
};

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
        const isSantoral = santoral[date];
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
initCalendar();
