package biblioteca;

import java.time.LocalDate;

/**
 * Ejecuta el flujo feliz solicitado sin necesidad de usar el menu interactivo.
 */
public final class DemoBiblioteca {
    private DemoBiblioteca() {
    }

    public static void main(String[] args) {
        Direccion direccion = new Direccion("Calle Mayor", "10", "29001", "Malaga");
        Biblioteca biblioteca = new Biblioteca("Demo Biblioteca", direccion);

        Autor autor = new Autor("George", "Orwell", "Britanico");
        Autor[] autores = {autor};
        Libro libro = new Libro("9788497592208", "1984", 1949, Categoria.NOVELA, autores);
        libro.agregarEjemplar(new Ejemplar("L-000001", libro));
        biblioteca.altaLibro(libro);

        Usuario usuario = new Usuario("u12345", "Ana Perez", "ana@correo.es", direccion);
        biblioteca.altaUsuario(usuario);

        Prestamo prestamo = biblioteca.prestar("L-000001", "u12345", LocalDate.of(2025, 3, 1));
        System.out.println("Prestamo creado: " + prestamo);
        System.out.println("Fecha limite: " + prestamo.getFechaLimite());

        boolean devuelto = biblioteca.devolver("L-000001", LocalDate.of(2025, 3, 10));
        System.out.println("Devolucion realizada: " + devuelto);
        System.out.println("Dias de retraso: " + prestamo.diasRetraso());
    }
}
