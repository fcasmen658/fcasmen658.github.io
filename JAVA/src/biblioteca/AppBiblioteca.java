package biblioteca;

import java.time.LocalDate;
import java.util.Locale;

/**
 * Aplicacion de consola para interactuar con la biblioteca.
 */
public final class AppBiblioteca {
        private static final Biblioteca BIBLIOTECA = new Biblioteca(
            "Biblioteca DWEC",
            new Direccion("Calle Principal", "1", "29001", "Malaga"));

    private AppBiblioteca() {
    }

    public static void main(String[] args) {
        Locale.setDefault(Locale.forLanguageTag("es-ES"));
        boolean salir = false;
        while (!salir) {
            mostrarMenu();
            System.out.println("Seleccione una opcion: ");
            String opcion = Entrada.cadena();
            try {
                switch (opcion) {
                    case "1" -> altaLibro();
                    case "2" -> altaUsuario();
                    case "3" -> buscarLibros();
                    case "4" -> prestarLibro();
                    case "5" -> devolverLibro();
                    case "6" -> listarPrestamosUsuario();
                    case "7" -> mostrarListadoLibros();
                    case "8" -> {
                        salir = true;
                        mostrarMensaje("Hasta pronto\n");
                    }
                    default -> mostrarMensaje("Opcion no valida\n");
                }
            } catch (IllegalArgumentException e) {
                mostrarMensaje("Error: " + e.getMessage() + "\n");
            }
        }
    }

    private static void mostrarMenu() {
        mostrarMensaje("============ MENU ============\n" +
                "1. Alta libro\n" +
                "2. Alta usuario\n" +
                "3. Buscar libros por texto\n" +
                "4. Prestar libro\n" +
                "5. Devolver libro\n" +
                "6. Listar prestamos activos de un usuario\n" +
                "7. Listado de libros\n" +
                "8. Salir\n");
    }

    private static void altaLibro() {
        System.out.println("Registro de nuevo libro:");
        System.out.println("ISBN-13: ");
        String isbn = Entrada.cadena();
        
        String titulo = Entrada.cadena("Titulo: ");
        int anio = Entrada.entero("Anio de publicacion: ");
        Categoria categoria = leerCategoria();
        Autor[] autores = leerAutores();
        Libro libro = new Libro(isbn, titulo, anio, categoria, autores);
        int ejemplares = Entrada.leerEntero("Numero de ejemplares (>=1): ");
        if (ejemplares <= 0) {
            throw new IllegalArgumentException("Debe registrar al menos un ejemplar");
        }
        for (int i = 0; i < ejemplares; i++) {
            String codigo = Entrada.leerCadena("Codigo del ejemplar " + (i + 1) + ": ");
            libro.agregarEjemplar(new Ejemplar(codigo, libro));
        }
        BIBLIOTECA.altaLibro(libro);
        mostrarMensaje("Libro registrado correctamente\n");
    }

    private static void altaUsuario() {
        String id = Entrada.leerCadena("ID (6-12 caracteres alfanumericos): ");
        String nombre = Entrada.leerCadena("Nombre completo: ");
        String email = Entrada.leerCadena("Email: ");
        String via = Entrada.leerCadena("Via: ");
        String numero = Entrada.leerCadena("Numero: ");
        String cp = Entrada.leerCadena("Codigo postal (5 digitos): ");
        String localidad = Entrada.leerCadena("Localidad: ");
        Direccion direccion = new Direccion(via, numero, cp, localidad);
        Usuario usuario = new Usuario(id, nombre, email, direccion);
        BIBLIOTECA.altaUsuario(usuario);
        mostrarMensaje("Usuario registrado correctamente\n");
    }

    private static void buscarLibros() {
        String texto = Entrada.leerCadena("Texto a buscar: ");
        Libro[] libros = BIBLIOTECA.buscarLibros(texto);
        if (libros.length == 0) {
            mostrarMensaje("No se encontraron coincidencias\n");
            return;
        }
        for (Libro libro : libros) {
            mostrarMensaje(libro + System.lineSeparator());
        }
    }

    private static void prestarLibro() {
        String codigo = Entrada.leerCadena("Codigo del ejemplar: ");
        String idUsuario = Entrada.leerCadena("ID del usuario: ");
        LocalDate fecha = Entrada.leerFecha("Fecha de prestamo (YYYY-MM-DD, vacio para hoy): ", true, LocalDate.now());
        Prestamo prestamo = BIBLIOTECA.prestar(codigo, idUsuario, fecha);
        mostrarMensaje("Prestamo creado: " + prestamo + "\n");
    }

    private static void devolverLibro() {
        String codigo = Entrada.leerCadena("Codigo del ejemplar: ");
        LocalDate fecha = Entrada.leerFecha("Fecha de devolucion (YYYY-MM-DD, vacio para hoy): ", true, LocalDate.now());
        boolean resultado = BIBLIOTECA.devolver(codigo, fecha);
        if (resultado) {
            mostrarMensaje("Devolucion registrada\n");
        } else {
            mostrarMensaje("No se encontro un prestamo activo para ese ejemplar\n");
        }
    }

    private static void listarPrestamosUsuario() {
        String id = Entrada.leerCadena("ID del usuario: ");
        mostrarMensaje(BIBLIOTECA.listadoPrestamosUsuario(id) + System.lineSeparator());
    }

    private static void mostrarListadoLibros() {
        mostrarMensaje(BIBLIOTECA.listadoLibros());
    }

    private static Categoria leerCategoria() {
        Categoria[] categorias = Categoria.values();
        for (int i = 0; i < categorias.length; i++) {
            mostrarMensaje((i + 1) + ". " + categorias[i] + "\n");
        }
        int opcion = Entrada.leerEntero("Selecciona la categoria: ");
        if (opcion < 1 || opcion > categorias.length) {
            throw new IllegalArgumentException("Categoria invalida");
        }
        return categorias[opcion - 1];
    }

    private static Autor[] leerAutores() {
        int numeroAutores = Entrada.leerEntero("Cuantos autores tiene el libro (1-3): ");
        if (numeroAutores < 1 || numeroAutores > 3) {
            throw new IllegalArgumentException("Debe indicar entre 1 y 3 autores");
        }
        Autor[] autores = new Autor[numeroAutores];
        for (int i = 0; i < numeroAutores; i++) {
            mostrarMensaje("Autor " + (i + 1) + "\n");
            String nombre = Entrada.leerCadena("Nombre: ");
            String apellidos = Entrada.leerCadena("Apellidos: ");
            String nacionalidad = Entrada.leerCadena("Nacionalidad (opcional): ");
            autores[i] = new Autor(nombre, apellidos, nacionalidad);
        }
        return autores;
    }

    private static void mostrarMensaje(String mensaje) {
        System.out.print(mensaje);
    }
}
