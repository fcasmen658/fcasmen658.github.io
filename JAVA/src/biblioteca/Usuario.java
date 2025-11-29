package biblioteca;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.regex.Pattern;

/**
 * Representa a un usuario de la biblioteca.
 */
public class Usuario {
    private static final int MAX_PRESTAMOS_ACTIVOS = 5;
    private static final Pattern ID_PATTERN = Pattern.compile("[A-Za-z0-9]{6,12}");

    private final String id;
    private String nombre;
    private String email;
    private Direccion direccion;
    private final Prestamo[] prestamosActivos;
    private int totalPrestamosActivos;

    public Usuario(String id, String nombre, String email, Direccion direccion) {
        this.id = validarId(id);
        setNombre(nombre);
        setEmail(email);
        setDireccion(direccion);
        this.prestamosActivos = new Prestamo[MAX_PRESTAMOS_ACTIVOS];
    }

    private String validarId(String valor) {
        if (valor == null || !ID_PATTERN.matcher(valor.trim()).matches()) {
            throw new IllegalArgumentException("El id del usuario debe tener entre 6 y 12 caracteres alfanumericos");
        }
        return valor.trim();
    }

    public String getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        if (nombre == null || nombre.trim().length() < 2) {
            throw new IllegalArgumentException("El nombre del usuario debe tener al menos 2 caracteres");
        }
        this.nombre = nombre.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null) {
            throw new IllegalArgumentException("El email del usuario no es valido");
        }
        String limpio = email.trim();
        if (!limpio.contains("@") || !limpio.contains(".")) {
            throw new IllegalArgumentException("El email del usuario no es valido");
        }
        this.email = limpio;
    }

    public Direccion getDireccion() {
        return direccion;
    }

    public void setDireccion(Direccion direccion) {
        if (direccion == null) {
            throw new IllegalArgumentException("La direccion es obligatoria");
        }
        this.direccion = direccion;
    }

    public Prestamo[] getPrestamosActivos() {
        return Arrays.copyOf(prestamosActivos, totalPrestamosActivos);
    }

    public void agregarPrestamoActivo(Prestamo prestamo) {
        if (prestamo == null) {
            throw new IllegalArgumentException("El prestamo es obligatorio");
        }
        if (totalPrestamosActivos >= MAX_PRESTAMOS_ACTIVOS) {
            throw new IllegalArgumentException("El usuario ya tiene el maximo de prestamos activos");
        }
        prestamosActivos[totalPrestamosActivos++] = prestamo;
    }

    public void cerrarPrestamoActivo(Prestamo prestamo) {
        if (prestamo == null) {
            return;
        }
        for (int i = 0; i < totalPrestamosActivos; i++) {
            if (prestamosActivos[i] == prestamo) {
                int elementosAMover = totalPrestamosActivos - i - 1;
                if (elementosAMover > 0) {
                    System.arraycopy(prestamosActivos, i + 1, prestamosActivos, i, elementosAMover);
                }
                prestamosActivos[--totalPrestamosActivos] = null;
                break;
            }
        }
    }

    public boolean puedePedir() {
        return totalPrestamosActivos < MAX_PRESTAMOS_ACTIVOS;
    }

    public boolean matches(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return false;
        }
        String patron = normalizar(texto);
        String candidato = normalizar(id + " " + nombre + " " + email + " " + direccion.toString());
        return candidato.contains(patron);
    }

    private String normalizar(String valor) {
        String normalized = Normalizer.normalize(valor, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        return normalized.toLowerCase().trim();
    }

    @Override
    public String toString() {
        return id + "|" + nombre + "|" + email + "|" + direccion.getLocalidad();
    }
}
