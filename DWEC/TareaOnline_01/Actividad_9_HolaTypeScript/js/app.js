const ADULT_AGE = 18;
const MIN_AGE = 0;
const MAX_AGE = 150;
class AgeVerifier {
    constructor() {
        this.form = document.getElementById('edadForm');
        this.resultElement = document.getElementById('resultado');
        this.init();
    }
    init() {
        if (!this.form || !this.resultElement) {
            console.error('Elementos del DOM no encontrados');
            return;
        }
        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
        this.resultElement.classList.add('hidden');
    }
    handleSubmit(event) {
        event.preventDefault();
        const ageInput = this.form.edad;
        const result = this.validateAge(ageInput.value);
        this.displayResult(result);
    }
    validateAge(ageValue) {
        if (!ageValue.trim()) {
            return {
                isValid: false,
                message: 'Error: Por favor, introduce tu edad.',
                type: 'error'
            };
        }
        const age = Number(ageValue);
        if (isNaN(age)) {
            return {
                isValid: false,
                message: 'Error: Por favor, introduce un número válido.',
                type: 'error'
            };
        }
        if (!Number.isInteger(age)) {
            return {
                isValid: false,
                message: 'Error: La edad debe ser un número entero.',
                type: 'error'
            };
        }
        if (age < MIN_AGE || age > MAX_AGE) {
            return {
                isValid: false,
                message: `Error: La edad debe estar entre ${MIN_AGE} y ${MAX_AGE} años.`,
                type: 'error'
            };
        }
        if (age >= ADULT_AGE) {
            return {
                isValid: true,
                message: `✅ Eres mayor de edad (${age} años). Puedes realizar actividades para adultos.`,
                type: 'adult'
            };
        }
        else {
            return {
                isValid: true,
                message: `⚠️ Eres menor de edad (${age} años). Te faltan ${ADULT_AGE - age} años para ser mayor de edad.`,
                type: 'minor'
            };
        }
    }
    displayResult(result) {
        this.resultElement.className = '';
        this.resultElement.classList.add('hidden');
        setTimeout(() => {
            this.resultElement.textContent = result.message;
            this.resultElement.classList.add(result.type, 'show');
        }, 150);
    }
}
function formatAgeMessage(edad) {
    if (edad === 1)
        return '1 año';
    return `${edad} años`;
}
document.addEventListener('DOMContentLoaded', () => {
    new AgeVerifier();
});
