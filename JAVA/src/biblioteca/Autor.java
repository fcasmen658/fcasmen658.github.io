package biblioteca;

/**
 * Representa a un autor de un libro.
 */
public final class Autor {
    private final String nombre;
    private final String apellidos;
    private final String nacionalidad;

    public Autor(String nombre, String apellidos, String nacionalidad) {
        this.nombre = validarTexto(nombre, "El nombre del autor es obligatorio");
        this.apellidos = validarTexto(apellidos, "Los apellidos del autor son obligatorios");
        this.nacionalidad = nacionalidad == null ? "" : nacionalidad.trim();
    }

    private String validarTexto(String valor, String mensaje) {
        if (valor == null || valor.trim().isEmpty()) {
            throw new IllegalArgumentException(mensaje);
        }
        return valor.trim();
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public String getNacionalidad() {
        return nacionalidad;
    }

    public String getNombreCompleto() {
        return apellidos + ", " + nombre;
    }

    public String iniciales() {
        String inicialNombre = extraerInicial(nombre);
        String inicialesApellidos = extraerIniciales(apellidos);
        if (inicialesApellidos.isEmpty()) {
            return inicialNombre;
        }
        return inicialNombre + " " + inicialesApellidos;
    }

    private String extraerInicial(String texto) {
        String limpio = texto.trim();
        if (limpio.isEmpty()) {
            return "";
        }
        return Character.toUpperCase(limpio.charAt(0)) + ".";
    }

    private String extraerIniciales(String texto) {
        String[] partes = texto.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String parte : partes) {
            if (parte.isEmpty()) {
                continue;
            }
            sb.append(Character.toUpperCase(parte.charAt(0))).append('.');
        }
        return sb.toString();
    }

    @Override
    public String toString() {
        if (nacionalidad.isEmpty()) {
            return getNombreCompleto();
        }
        return getNombreCompleto() + " (" + nacionalidad + ")";
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof Autor other)) {
            return false;
        }
        return normalizar(nombre).equals(normalizar(other.nombre))
                && normalizar(apellidos).equals(normalizar(other.apellidos));
    }

    @Override
    public int hashCode() {
        int result = normalizar(nombre).hashCode();
        result = 31 * result + normalizar(apellidos).hashCode();
        return result;
    }

    private String normalizar(String valor) {
        return valor.trim().replaceAll("\\s+", " ").toLowerCase();
    }
}
