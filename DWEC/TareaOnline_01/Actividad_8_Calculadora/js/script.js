// Helpers
const $ = (sel) => document.querySelector(sel);

// Manejar cambio de operación para ajustar el campo valor2
$('#op').addEventListener('change', function() {
  const val2Input = $('#val2');
  const val2Label = $('label[for="val2"]');
  
  if(this.value === 'potencia') {
    val2Input.removeAttribute('required');
    val2Input.placeholder = '(por defecto: 2)';
    val2Label.textContent = 'Valor 2 (opcional en el caso de potencia)';
  } else {
    val2Input.setAttribute('required', '');
    val2Input.placeholder = 'Ej: 2';
    val2Label.textContent = 'Valor 2';
  }
});

function parseNumber(value){
  // normaliza coma decimal
  if(typeof value !== 'string') value = String(value);
  value = value.trim().replace(',', '.');
  if(value === '') return NaN;
  return Number(value);
}

function potenciaBucles(base, exponent){
  // Solo tratamos exponentes enteros aquí
  const expInt = parseInt(exponent, 10);
  if(!Number.isFinite(base) || !Number.isFinite(exponent) || Number.isNaN(expInt)) return NaN;

  // Caso 0^0 -> indefinido
  if(base === 0 && expInt === 0) return NaN;

  let sign = 1;
  if(expInt < 0) sign = -1;
  const absExp = Math.abs(expInt);

  let result = 1;
  for(let i=0;i<absExp;i++){
    result *= base;
  }

  if(sign === -1) {
    if(result === 0) return NaN; // división por cero
    return 1 / result;
  }
  return result;
}

// Operaciones
$('#calcForm').addEventListener('submit', function(ev){
  ev.preventDefault();
  const rEl = $('#resultado');
  rEl.textContent = '';
  rEl.className = '';

  const raw1 = $('#val1').value;
  const raw2 = $('#val2').value;
  const op = $('#op').value;

  const v1 = parseNumber(raw1);
  
  // Para potencia: si valor2 está vacío, usar 2 como exponente por defecto
  let v2;
  if(op === 'potencia' && (raw2.trim() === '' || raw2.trim() === '')) {
    v2 = 2; // Valor por defecto para exponente
  } else {
    v2 = parseNumber(raw2);
  }

  // Validación especial para potencia (solo requiere v1)
  if(op === 'potencia') {
    if(Number.isNaN(v1)) {
      rEl.textContent = 'Error: introduce un número válido para la base.';
      rEl.classList.add('err');
      return;
    }
  } else {
    // Para otras operaciones, requieren ambos valores
    if(Number.isNaN(v1) || Number.isNaN(v2)){
      rEl.textContent = 'Error: introduce dos números válidos.';
      rEl.classList.add('err');
      return;
    }
  }

  let res = null;
  let ok = true;
  let errMsg = '';

  switch(op){
    case 'sum':
      res = v1 + v2;
      break;
    case 'sub':
      res = v1 - v2;
      break;
    case 'mul':
      res = v1 * v2;
      break;
    case 'div':
      if(v2 === 0){ ok = false; errMsg = 'Error: división por cero.'; }
      else res = v1 / v2;
      break;
    case 'mod':
      if(v2 === 0){ ok = false; errMsg = 'Error: módulo por cero.'; }
      else res = v1 % v2;
      break;
    case 'potencia':
      // Para potencia usamos bucle; pero necesitamos decidir manejo de exponentes no enteros
      // Requerimiento dice: "Para el cálculo de la potencia se debe hacer uso de bucles y no del operador **."
      // Interpretaremos que el exponente debe ser entero. Si no lo es, mostramos error.
      if(!Number.isInteger(v2)){
        ok = false;
        errMsg = 'Error: el exponente debe ser un número entero para esta implementación.';
      } else {
        const resultadoPotencia = potenciaBucles(v1, v2);
        if(Number.isNaN(resultadoPotencia) || !Number.isFinite(resultadoPotencia)){
          ok = false;
          errMsg = 'Error: operación de potencia no válida (p.ej. 0^0 o división por cero interna).';
        } else {
          res = resultadoPotencia;
          // Mostrar qué exponente se usó si fue el valor por defecto
          if(raw2.trim() === '') {
            // Se usó el valor por defecto
            res = { value: resultadoPotencia, showDefault: true };
          }
        }
      }
      break;
    default:
      ok = false; errMsg = 'Operación no soportada.';
  }

  if(!ok){
    rEl.textContent = errMsg;
    rEl.classList.add('err');
    return;
  }

  // Resultado: formateamos con máximo de 12 dígitos significativos evitando notación exponencial si posible
  let out;
  let finalResult;
  
  // Manejar caso especial de potencia con exponente por defecto
  if(typeof res === 'object' && res.showDefault) {
    finalResult = res.value;
    out = Math.round((finalResult + Number.EPSILON) * 1000000000) / 1000000000;
    rEl.innerHTML = `Resultado: ${out}<br>(${v1}² - Exponente por defecto: 2)`;
  } else {
    finalResult = res;
    out = String(finalResult);
    if(Number.isFinite(finalResult)){
      out = Math.round((finalResult + Number.EPSILON) * 1000000000) / 1000000000; // 9 decimales
    }
    rEl.textContent = `Resultado: ${out}`;
  }

  rEl.classList.add('ok');
});