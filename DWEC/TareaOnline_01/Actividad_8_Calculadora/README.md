# Calculadora simple

Pequeña aplicación web que permite realizar operaciones básicas entre dos números: suma, resta, multiplicación, división, módulo y potencia.

Cómo probar:

1. Abre un terminal en la carpeta `Actividad_8_Calculadora`.
2. Ejecuta un servidor local (por ejemplo con Python):

```powershell
python -m http.server 8001
```

3. Abre en el navegador: `http://localhost:8001`

Notas:
- La potencia se calcula usando bucles y requiere que el exponente sea un número entero.
- Se controlan errores como división por cero, módulo por cero y 0^0.
