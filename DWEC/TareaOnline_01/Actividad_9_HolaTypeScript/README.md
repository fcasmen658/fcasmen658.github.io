# Verificador de Mayoría de Edad

Aplicación web desarrollada con **TypeScript** que verifica si una persona es mayor o menor de edad basándose en la edad introducida.

## Características

- ✅ **TypeScript**: Tipado estático y compilación a JavaScript
- ✅ **Validaciones**: Edad válida, números enteros, rangos apropiados
- ✅ **Interfaz moderna**: Diseño responsivo con gradientes y animaciones
- ✅ **Mensajes claros**: Indicadores visuales para mayor/menor de edad y errores

## Validaciones implementadas

- Campo no vacío
- Número válido
- Número entero (no decimales)
- Rango de edad: 0-150 años
- Mensaje específico para mayores (≥18) y menores (<18)

## Cómo usar

### Opción 1: Servidor local
```powershell
cd "Actividad_6_Mayoria_Edad"
python -m http.server 8002
```
Luego abre: `http://localhost:8002`

### Opción 2: Abrir directamente
Abre `index.html` en tu navegador.

## Desarrollo

Para recompilar el TypeScript:
```powershell
tsc
```

## Archivos principales

- `app.ts` - Código TypeScript principal
- `app.js` - JavaScript compilado 
- `index.html` - Estructura HTML
- `styles.css` - Estilos y animaciones
- `tsconfig.json` - Configuración TypeScript