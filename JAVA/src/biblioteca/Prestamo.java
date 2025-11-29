package biblioteca;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Prestamo de un ejemplar a un usuario.
 */
public class Prestamo {
    private static final int DIAS_PRESTAMO = 21;

    private final Ejemplar ejemplar;
    private final Usuario usuario;
    private final LocalDate fechaInicio;
    private final LocalDate fechaLimite;
    private boolean devuelto;
    private LocalDate fechaDevolucion;

    public Prestamo(Ejemplar ejemplar, Usuario usuario, LocalDate fechaInicio) {
        if (ejemplar == null) {
            throw new IllegalArgumentException("El ejemplar es obligatorio");
        }
        if (usuario == null) {
            throw new IllegalArgumentException("El usuario es obligatorio");
        }
        if (fechaInicio == null) {
            throw new IllegalArgumentException("La fecha de inicio es obligatoria");
        }
        this.ejemplar = ejemplar;
        this.usuario = usuario;
        this.fechaInicio = fechaInicio;
        this.fechaLimite = fechaInicio.plusDays(DIAS_PRESTAMO);
        this.ejemplar.prestar();
        this.usuario.agregarPrestamoActivo(this);
    }

    public Ejemplar getEjemplar() {
        return ejemplar;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public LocalDate getFechaLimite() {
        return fechaLimite;
    }

    public boolean isDevuelto() {
        return devuelto;
    }

    public LocalDate getFechaDevolucion() {
        return fechaDevolucion;
    }

    public int diasRetraso() {
        LocalDate referencia = devuelto ? fechaDevolucion : LocalDate.now();
        if (referencia == null || !referencia.isAfter(fechaLimite)) {
            return 0;
        }
        return (int) ChronoUnit.DAYS.between(fechaLimite, referencia);
    }

    public boolean estaVencido() {
        return !devuelto && LocalDate.now().isAfter(fechaLimite);
    }

    public void marcarDevuelto(LocalDate fecha) {
        if (fecha == null) {
            throw new IllegalArgumentException("La fecha de devolucion es obligatoria");
        }
        if (fecha.isBefore(fechaInicio)) {
            throw new IllegalArgumentException("La devolucion no puede ser anterior al inicio");
        }
        if (devuelto) {
            throw new IllegalArgumentException("El prestamo ya estaba devuelto");
        }
        this.devuelto = true;
        this.fechaDevolucion = fecha;
        ejemplar.devolver();
        usuario.cerrarPrestamoActivo(this);
    }

    @Override
    public String toString() {
        return ejemplar.getCodigo() + "|" + usuario.getId() + "|" + fechaInicio + "|" + fechaLimite + "|" + devuelto;
    }
}
