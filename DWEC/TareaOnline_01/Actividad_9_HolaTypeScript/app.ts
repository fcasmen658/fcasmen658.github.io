// Tipos e interfaces
interface AgeValidationResult {
  isValid: boolean;
  message: string;
  type: 'adult' | 'minor' | 'error';
}

interface FormElements extends HTMLFormElement {
  age: HTMLInputElement;
}

// Constantes
const ADULT_AGE = 18;
const MIN_AGE = 0;
const MAX_AGE = 150;

// Clase principal para manejar la verificación de edad
class AgeVerifier {
  private form: FormElements;
  private resultElement: HTMLElement;

  constructor() {
    this.form = document.getElementById('ageForm') as FormElements;
    this.resultElement = document.getElementById('result') as HTMLElement;
    this.init();
  }

  private init(): void {
    if (!this.form || !this.resultElement) {
      console.error('Elementos del DOM no encontrados');
      return;
    }

    this.form.addEventListener('submit', (event) => this.handleSubmit(event));
    this.resultElement.classList.add('hidden');
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    
    const ageInput = this.form.age;
    const result = this.validateAge(ageInput.value);
    
    this.displayResult(result);
  }

  private validateAge(ageValue: string): AgeValidationResult {
    // Verificar si el campo está vacío
    if (!ageValue.trim()) {
      return {
        isValid: false,
        message: 'Error: Por favor, introduce tu edad.',
        type: 'error'
      };
    }

    // Convertir a número
    const age = Number(ageValue);

    // Verificar si es un número válido
    if (isNaN(age)) {
      return {
        isValid: false,
        message: 'Error: Por favor, introduce un número válido.',
        type: 'error'
      };
    }

    // Verificar si es un número entero
    if (!Number.isInteger(age)) {
      return {
        isValid: false,
        message: 'Error: La edad debe ser un número entero.',
        type: 'error'
      };
    }

    // Verificar rango de edad
    if (age < MIN_AGE || age > MAX_AGE) {
      return {
        isValid: false,
        message: `Error: La edad debe estar entre ${MIN_AGE} y ${MAX_AGE} años.`,
        type: 'error'
      };
    }

    // Verificar mayoría de edad
    if (age >= ADULT_AGE) {
      return {
        isValid: true,
        message: `✅ Eres mayor de edad (${age} años). Puedes realizar actividades para adultos.`,
        type: 'adult'
      };
    } else {
      return {
        isValid: true,
        message: `⚠️ Eres menor de edad (${age} años). Te faltan ${ADULT_AGE - age} años para ser mayor de edad.`,
        type: 'minor'
      };
    }
  }

  private displayResult(result: AgeValidationResult): void {
    // Limpiar clases anteriores
    this.resultElement.className = '';
    
    // Ocultar temporalmente para la animación
    this.resultElement.classList.add('hidden');
    
    setTimeout(() => {
      // Establecer el mensaje
    this.resultElement.textContent = result.message;
    
      // Añadir la clase correspondiente
    this.resultElement.classList.add(result.type, 'show');
    }, 150);
}
}

// Función utilitaria para formatear edad
function formatAgeMessage(age: number): string {
if (age === 1) return '1 año';
return `${age} años`;
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
new AgeVerifier();
});
