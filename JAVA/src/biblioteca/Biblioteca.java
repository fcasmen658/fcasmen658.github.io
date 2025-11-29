package biblioteca;

import java.time.LocalDate;
import java.util.Arrays;

/**
 * Gestiona libros, usuarios y prestamos de la biblioteca.
 */
public class Biblioteca {
    public static final int MAX_LIBROS = 2000;
    public static final int MAX_USUARIOS = 1000;
    public static final int MAX_PRESTAMOS = 10000;

    private final String nombre;
    private final Direccion direccion;
    private final Libro[] libros;
    private int totalLibros;
    private final Usuario[] usuarios;
    private int totalUsuarios;
    private final Prestamo[] prestamos;
    private int totalPrestamos;

    public Biblioteca(String nombre, Direccion direccion) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la biblioteca es obligatorio");
        }
        if (direccion == null) {
            throw new IllegalArgumentException("La direccion de la biblioteca es obligatoria");
        }
        this.nombre = nombre.trim();
        this.direccion = direccion;
        this.libros = new Libro[MAX_LIBROS];
        this.usuarios = new Usuario[MAX_USUARIOS];
        this.prestamos = new Prestamo[MAX_PRESTAMOS];
    }

    public String getNombre() {
        return nombre;
    }

    public Direccion getDireccion() {
        return direccion;
    }

    public void altaLibro(Libro libro) {
        if (libro == null) {
            throw new IllegalArgumentException("El libro es obligatorio");
        }
        if (totalLibros >= MAX_LIBROS) {
            throw new IllegalArgumentException("No se pueden registrar mas libros");
        }
        if (buscarLibroPorIsbn(libro.getIsbn()) != null) {
            throw new IllegalArgumentException("Ya existe un libro con ese ISBN");
        }
        libros[totalLibros++] = libro;
    }

    public boolean bajaLibroPorIsbn(String isbn) {
        int indice = indiceLibro(isbn);
        if (indice == -1) {
            return false;
        }
        if (libros[indice].tieneEjemplares()) {
            throw new IllegalArgumentException("No se puede eliminar un libro con ejemplares");
        }
        eliminarElemento(libros, indice, totalLibros);
        totalLibros--;
        return true;
    }

    public void altaUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("El usuario es obligatorio");
        }
        if (totalUsuarios >= MAX_USUARIOS) {
            throw new IllegalArgumentException("No se pueden registrar mas usuarios");
        }
        if (buscarUsuarioPorId(usuario.getId()) != null) {
            throw new IllegalArgumentException("Ya existe un usuario con ese id");
        }
        usuarios[totalUsuarios++] = usuario;
    }

    public boolean bajaUsuario(String id) {
        int indice = indiceUsuario(id);
        if (indice == -1) {
            return false;
        }
        if (usuarios[indice].getPrestamosActivos().length > 0) {
            throw new IllegalArgumentException("El usuario tiene prestamos activos");
        }
        eliminarElemento(usuarios, indice, totalUsuarios);
        totalUsuarios--;
        return true;
    }

    public Libro buscarLibroPorIsbn(String isbn) {
        if (isbn == null) {
            return null;
        }
        String buscado = isbn.trim();
        for (int i = 0; i < totalLibros; i++) {
            if (libros[i].getIsbn().equalsIgnoreCase(buscado)) {
                return libros[i];
            }
        }
        return null;
    }

    public Libro[] buscarLibros(String texto) {
        Libro[] resultado = new Libro[totalLibros];
        int contador = 0;
        for (int i = 0; i < totalLibros; i++) {
            if (libros[i].matches(texto)) {
                resultado[contador++] = libros[i];
            }
        }
        return Arrays.copyOf(resultado, contador);
    }

    public Usuario buscarUsuarioPorId(String id) {
        if (id == null) {
            return null;
        }
        String buscado = id.trim();
        for (int i = 0; i < totalUsuarios; i++) {
            if (usuarios[i].getId().equalsIgnoreCase(buscado)) {
                return usuarios[i];
            }
        }
        return null;
    }

    public Usuario[] buscarUsuarios(String texto) {
        Usuario[] resultado = new Usuario[totalUsuarios];
        int contador = 0;
        for (int i = 0; i < totalUsuarios; i++) {
            if (usuarios[i].matches(texto)) {
                resultado[contador++] = usuarios[i];
            }
        }
        return Arrays.copyOf(resultado, contador);
    }

    public Prestamo prestar(String codigoEjemplar, String idUsuario, LocalDate fecha) {
        if (fecha == null) {
            throw new IllegalArgumentException("La fecha del prestamo es obligatoria");
        }
        Ejemplar ejemplar = buscarEjemplarPorCodigo(codigoEjemplar);
        if (ejemplar == null) {
            throw new IllegalArgumentException("No existe un ejemplar con ese codigo");
        }
        if (ejemplar.getEstado() != EstadoLibro.DISPONIBLE) {
            throw new IllegalArgumentException("El ejemplar no esta disponible");
        }
        Usuario usuario = buscarUsuarioPorId(idUsuario);
        if (usuario == null) {
            throw new IllegalArgumentException("No existe un usuario con ese id");
        }
        if (!usuario.puedePedir()) {
            throw new IllegalArgumentException("El usuario ya tiene el maximo de prestamos");
        }
        if (totalPrestamos >= MAX_PRESTAMOS) {
            throw new IllegalArgumentException("No se pueden registrar mas prestamos");
        }
        Prestamo prestamo = new Prestamo(ejemplar, usuario, fecha);
        prestamos[totalPrestamos++] = prestamo;
        return prestamo;
    }

    public boolean devolver(String codigoEjemplar, LocalDate fecha) {
        if (codigoEjemplar == null || fecha == null) {
            throw new IllegalArgumentException("Datos de devolucion invalidos");
        }
        for (int i = totalPrestamos - 1; i >= 0; i--) {
            Prestamo prestamo = prestamos[i];
            if (!prestamo.isDevuelto()
                    && prestamo.getEjemplar().getCodigo().equalsIgnoreCase(codigoEjemplar.trim())) {
                prestamo.marcarDevuelto(fecha);
                return true;
            }
        }
        return false;
    }

    public Prestamo[] prestamosActivosUsuario(String idUsuario) {
        if (idUsuario == null || idUsuario.trim().isEmpty()) {
            throw new IllegalArgumentException("El id del usuario es obligatorio");
        }
        String buscado = idUsuario.trim();
        Prestamo[] coincidencias = new Prestamo[totalPrestamos];
        int contador = 0;
        for (int i = 0; i < totalPrestamos; i++) {
            Prestamo prestamo = prestamos[i];
            if (!prestamo.isDevuelto() && prestamo.getUsuario().getId().equalsIgnoreCase(buscado)) {
                coincidencias[contador++] = prestamo;
            }
        }
        return Arrays.copyOf(coincidencias, contador);
    }

    public String listadoLibros() {
        if (totalLibros == 0) {
            return "No hay libros registrados";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < totalLibros; i++) {
            sb.append(libros[i].toString()).append(System.lineSeparator());
        }
        return sb.toString();
    }

    public String listadoPrestamos() {
        if (totalPrestamos == 0) {
            return "No hay prestamos registrados";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < totalPrestamos; i++) {
            sb.append(prestamos[i].toString()).append(System.lineSeparator());
        }
        return sb.toString();
    }

    public String listadoPrestamosUsuario(String idUsuario) {
        Prestamo[] activos = prestamosActivosUsuario(idUsuario);
        if (activos.length == 0) {
            return "El usuario no tiene prestamos activos";
        }
        StringBuilder sb = new StringBuilder();
        for (Prestamo prestamo : activos) {
            sb.append(prestamo.toString()).append(System.lineSeparator());
        }
        return sb.toString();
    }

    private int indiceLibro(String isbn) {
        if (isbn == null) {
            return -1;
        }
        String buscado = isbn.trim();
        for (int i = 0; i < totalLibros; i++) {
            if (libros[i].getIsbn().equalsIgnoreCase(buscado)) {
                return i;
            }
        }
        return -1;
    }

    private int indiceUsuario(String id) {
        if (id == null) {
            return -1;
        }
        String buscado = id.trim();
        for (int i = 0; i < totalUsuarios; i++) {
            if (usuarios[i].getId().equalsIgnoreCase(buscado)) {
                return i;
            }
        }
        return -1;
    }

    private Ejemplar buscarEjemplarPorCodigo(String codigo) {
        if (codigo == null) {
            return null;
        }
        String buscado = codigo.trim();
        for (int i = 0; i < totalLibros; i++) {
            Ejemplar ejemplar = libros[i].buscarEjemplarPorCodigo(buscado);
            if (ejemplar != null) {
                return ejemplar;
            }
        }
        return null;
    }

    private <T> void eliminarElemento(T[] array, int indice, int total) {
        int elementosAMover = total - indice - 1;
        if (elementosAMover > 0) {
            System.arraycopy(array, indice + 1, array, indice, elementosAMover);
        }
        array[total - 1] = null;
    }
}
