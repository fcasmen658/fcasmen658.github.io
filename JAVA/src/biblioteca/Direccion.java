package biblioteca;

import java.util.Objects;

/**
 * Objeto valor inmutable que representa una direccion postal.
 */
public final class Direccion {
    private final String via;
    private final String numero;
    private final String codigoPostal;
    private final String localidad;

    public Direccion(String via, String numero, String codigoPostal, String localidad) {
        this.via = validarTexto(via, "La via no puede estar vacia");
        this.numero = validarTexto(numero, "El numero no puede estar vacio");
        this.codigoPostal = validarCodigoPostal(codigoPostal);
        this.localidad = validarTexto(localidad, "La localidad no puede estar vacia");
    }

    private String validarTexto(String valor, String mensaje) {
        if (valor == null || valor.trim().isEmpty()) {
            throw new IllegalArgumentException(mensaje);
        }
        return valor.trim();
    }

    private String validarCodigoPostal(String cp) {
        if (cp == null || !cp.trim().matches("\\d{5}")) {
            throw new IllegalArgumentException("El codigo postal debe tener exactamente 5 digitos");
        }
        return cp.trim();
    }

    public String getVia() {
        return via;
    }

    public String getNumero() {
        return numero;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public String getLocalidad() {
        return localidad;
    }

    @Override
    public String toString() {
        return via + " " + numero + ", " + codigoPostal + " " + localidad;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof Direccion other)) {
            return false;
        }
        return via.equals(other.via)
                && numero.equals(other.numero)
                && codigoPostal.equals(other.codigoPostal)
                && localidad.equals(other.localidad);
    }

    @Override
    public int hashCode() {
        return Objects.hash(via, numero, codigoPostal, localidad);
    }
}
