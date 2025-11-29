package biblioteca;

/**
 * Ejemplar fisico de un libro.
 */
public class Ejemplar {
    private final String codigo;
    private EstadoLibro estado;
    private final Libro libro;

    public Ejemplar(String codigo, Libro libro) {
        if (codigo == null || !codigo.trim().matches("[A-Za-z0-9-]{3,20}")) {
            throw new IllegalArgumentException("El codigo del ejemplar no es valido");
        }
        if (libro == null) {
            throw new IllegalArgumentException("El libro del ejemplar es obligatorio");
        }
        this.codigo = codigo.trim();
        this.libro = libro;
        this.estado = EstadoLibro.DISPONIBLE;
    }

    public String getCodigo() {
        return codigo;
    }

    public EstadoLibro getEstado() {
        return estado;
    }

    public void prestar() {
        if (estado == EstadoLibro.PRESTADO) {
            throw new IllegalArgumentException("El ejemplar ya esta prestado");
        }
        estado = EstadoLibro.PRESTADO;
    }

    public void devolver() {
        estado = EstadoLibro.DISPONIBLE;
    }

    public Libro getLibro() {
        return libro;
    }

    @Override
    public String toString() {
        return codigo + " (" + estado + ") -> " + libro.getTitulo();
    }
}
