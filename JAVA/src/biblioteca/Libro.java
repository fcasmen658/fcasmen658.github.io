package biblioteca;

import java.text.Normalizer;
import java.time.LocalDate;
import java.util.Arrays;

/**
 * Entidad que representa un libro dentro del catalogo.
 */
public class Libro implements Comparable<Libro> {
    private static final int MAX_AUTORES = 3;
    private static final int MAX_EJEMPLARES = 50;

    private final String isbn;
    private String titulo;
    private int anio;
    private Categoria categoria;
    private final Autor[] autores;
    private int totalAutores;
    private final Ejemplar[] ejemplares;
    private int totalEjemplares;

    public Libro(String isbn, String titulo, int anio, Categoria categoria, Autor[] autoresIniciales) {
        this.isbn = validarIsbn(isbn);
        setTitulo(titulo);
        setAnio(anio);
        setCategoria(categoria);
        this.autores = new Autor[MAX_AUTORES];
        this.ejemplares = new Ejemplar[MAX_EJEMPLARES];
        if (autoresIniciales == null || autoresIniciales.length == 0 || autoresIniciales.length > MAX_AUTORES) {
            throw new IllegalArgumentException("Debe proporcionar entre 1 y 3 autores");
        }
        for (Autor autor : autoresIniciales) {
            addAutor(autor);
        }
    }

    private String validarIsbn(String valor) {
        if (valor == null || !valor.trim().matches("\\d{13}")) {
            throw new IllegalArgumentException("El ISBN debe tener exactamente 13 digitos");
        }
        return valor.trim();
    }

    public void addAutor(Autor autor) {
        if (autor == null) {
            throw new IllegalArgumentException("El autor no puede ser nulo");
        }
        if (totalAutores >= MAX_AUTORES) {
            throw new IllegalArgumentException("No se pueden agregar mas de " + MAX_AUTORES + " autores");
        }
        for (int i = 0; i < totalAutores; i++) {
            if (autores[i].equals(autor)) {
                throw new IllegalArgumentException("El autor ya esta asignado al libro");
            }
        }
        autores[totalAutores++] = autor;
    }

    public boolean removeAutor(Autor autor) {
        if (autor == null) {
            return false;
        }
        for (int i = 0; i < totalAutores; i++) {
            if (autores[i].equals(autor)) {
                int elementosAMover = totalAutores - i - 1;
                if (elementosAMover > 0) {
                    System.arraycopy(autores, i + 1, autores, i, elementosAMover);
                }
                autores[--totalAutores] = null;
                return true;
            }
        }
        return false;
    }

    public String autoresComoCadena() {
        if (totalAutores == 0) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < totalAutores; i++) {
            if (i > 0) {
                sb.append("; ");
            }
            sb.append(autores[i]);
        }
        return sb.toString();
    }

    public int numPalabrasTitulo() {
        if (titulo.trim().isEmpty()) {
            return 0;
        }
        return titulo.trim().split("\\s+").length;
    }

    public boolean containsPalabraEnTitulo(String palabra) {
        if (palabra == null || palabra.trim().isEmpty()) {
            return false;
        }
        String buscada = normalizarBusqueda(palabra);
        String[] palabras = normalizarBusqueda(titulo).split("\\s+");
        for (String palabraTitulo : palabras) {
            if (palabraTitulo.equals(buscada)) {
                return true;
            }
        }
        return false;
    }

    public boolean matches(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return false;
        }
        String patron = normalizarBusqueda(texto);
        String tituloNormalizado = normalizarBusqueda(titulo);
        String autoresNormalizados = normalizarBusqueda(autoresComoCadena());
        return tituloNormalizado.contains(patron)
            || (!autoresNormalizados.isEmpty() && autoresNormalizados.contains(patron));
    }

    public void agregarEjemplar(Ejemplar ejemplar) {
        if (ejemplar == null) {
            throw new IllegalArgumentException("El ejemplar no puede ser nulo");
        }
        if (ejemplar.getLibro() != this) {
            throw new IllegalArgumentException("El ejemplar debe pertenecer a este libro");
        }
        if (totalEjemplares >= MAX_EJEMPLARES) {
            throw new IllegalArgumentException("No se pueden registrar mas ejemplares para este libro");
        }
        ejemplares[totalEjemplares++] = ejemplar;
    }

    public boolean tieneEjemplares() {
        return totalEjemplares > 0;
    }

    public Ejemplar obtenerEjemplarDisponible() {
        for (int i = 0; i < totalEjemplares; i++) {
            Ejemplar ejemplar = ejemplares[i];
            if (ejemplar.getEstado() == EstadoLibro.DISPONIBLE) {
                return ejemplar;
            }
        }
        return null;
    }

    public Ejemplar buscarEjemplarPorCodigo(String codigo) {
        if (codigo == null) {
            return null;
        }
        String buscado = codigo.trim();
        for (int i = 0; i < totalEjemplares; i++) {
            if (ejemplares[i].getCodigo().equalsIgnoreCase(buscado)) {
                return ejemplares[i];
            }
        }
        return null;
    }

    public String getIsbn() {
        return isbn;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        if (titulo == null || titulo.trim().length() < 3) {
            throw new IllegalArgumentException("El titulo debe tener al menos 3 caracteres");
        }
        this.titulo = titulo.trim();
    }

    public int getAnio() {
        return anio;
    }

    public void setAnio(int anio) {
        if (anio <= 0) {
            throw new IllegalArgumentException("El anio debe ser mayor que cero");
        }
        this.anio = anio;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        if (categoria == null) {
            throw new IllegalArgumentException("La categoria es obligatoria");
        }
        this.categoria = categoria;
    }

    public Autor[] getAutores() {
        return Arrays.copyOf(autores, totalAutores);
    }

    public Ejemplar[] getEjemplares() {
        return Arrays.copyOf(ejemplares, totalEjemplares);
    }

    public boolean esAntiguo() {
        return anio <= LocalDate.now().getYear() - 50;
    }

    public boolean tituloContiene(String fragmento) {
        if (fragmento == null || fragmento.trim().isEmpty()) {
            return false;
        }
        return titulo.toLowerCase().contains(fragmento.trim().toLowerCase());
    }

    public String tituloEnMayusculas() {
        return titulo.toUpperCase();
    }

    public String[] palabrasTitulo() {
        return titulo.trim().split("\\s+");
    }

    private String normalizarBusqueda(String texto) {
        String normalized = Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return normalized.toLowerCase().trim();
    }

    @Override
    public int compareTo(Libro otro) {
        int cmp = String.CASE_INSENSITIVE_ORDER.compare(this.titulo, otro.titulo);
        if (cmp != 0) {
            return cmp;
        }
        return Integer.compare(this.anio, otro.anio);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof Libro other)) {
            return false;
        }
        return isbn.equals(other.isbn);
    }

    @Override
    public int hashCode() {
        return isbn.hashCode();
    }

    @Override
    public String toString() {
        return isbn + "|" + titulo + "|" + anio + "|" + categoria + "|[" + autoresComoCadena() + "]";
    }
}
