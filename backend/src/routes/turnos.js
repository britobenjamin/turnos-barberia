const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

router.get("/", async (req, res) => {
  try {
    const turnos = await prisma.turno.findMany({
      orderBy: { fecha: "asc" },
    });
    res.json(turnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los turnos" });
  }
});








router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const turno = await prisma.turno.findUnique({
      where: { id: Number(id) },
    });

    if (!turno) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    res.json(turno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el turno" });
  }
});










router.post("/", async (req, res) => {
  try {
    const { nombre, apellido, telefono, fecha, horario } = req.body;

    // Validación: campos obligatorios y strings vacíos
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }
    if (!apellido || !apellido.trim()) {
      return res.status(400).json({ error: "El apellido es obligatorio" });
    }
    if (!telefono || !telefono.trim()) {
      return res.status(400).json({ error: "El teléfono es obligatorio" });
    }
    if (!fecha) {
      return res.status(400).json({ error: "La fecha es obligatoria" });
    }
    if (!horario || !horario.trim()) {
      return res.status(400).json({ error: "El horario es obligatorio" });
    }












    const fechaConvertida = new Date(fecha);
    if (isNaN(fechaConvertida.getTime())) {
      return res.status(400).json({ error: "La fecha no es válida" });
    }










    const turnoOcupado = await prisma.turno.findFirst({
      where: {
        fecha: fechaConvertida,
        horario: horario.trim(),
      },
    });

    if (turnoOcupado) {
      return res.status(400).json({ error: "Ese turno ya está ocupado, elegí otro horario" });
    }

    const nuevoTurno = await prisma.turno.create({
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
        fecha: fechaConvertida,
        horario: horario.trim(),
      },
    });

    res.status(201).json(nuevoTurno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el turno" });
  }
});









router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validación: que el turno exista
    const turnoExistente = await prisma.turno.findUnique({
      where: { id: Number(id) },
    });

    if (!turnoExistente) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    const { nombre, apellido, telefono, fecha, horario } = req.body;

    const datosActualizados = {};

    if (nombre !== undefined) {
      if (!nombre.trim()) {
        return res.status(400).json({ error: "El nombre no puede estar vacío" });
      }
      datosActualizados.nombre = nombre.trim();
    }

    if (apellido !== undefined) {
      if (!apellido.trim()) {
        return res.status(400).json({ error: "El apellido no puede estar vacío" });
      }
      datosActualizados.apellido = apellido.trim();
    }

    if (telefono !== undefined) {
      if (!telefono.trim()) {
        return res.status(400).json({ error: "El teléfono no puede estar vacío" });
      }
      datosActualizados.telefono = telefono.trim();
    }

    if (fecha !== undefined) {
      const fechaConvertida = new Date(fecha);
      if (isNaN(fechaConvertida.getTime())) {
        return res.status(400).json({ error: "La fecha no es válida" });
      }
      datosActualizados.fecha = fechaConvertida;
    }

    if (horario !== undefined) {
      if (!horario.trim()) {
        return res.status(400).json({ error: "El horario no puede estar vacío" });
      }
      datosActualizados.horario = horario.trim();
    }














    if (datosActualizados.fecha !== undefined || datosActualizados.horario !== undefined) {
      const fechaAVerificar = datosActualizados.fecha ?? turnoExistente.fecha;
      const horarioAVerificar = datosActualizados.horario ?? turnoExistente.horario;

      const turnoOcupado = await prisma.turno.findFirst({
        where: {
          fecha: fechaAVerificar,
          horario: horarioAVerificar,
          id: { not: Number(id) },
        },
      });

      if (turnoOcupado) {
        return res.status(400).json({ error: "Ese turno ya está ocupado, elegí otro horario" });
      }
    }

    const turnoActualizado = await prisma.turno.update({
      where: { id: Number(id) },
      data: datosActualizados,
    });

    res.json(turnoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el turno" });
  }
});














router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const turnoExistente = await prisma.turno.findUnique({
      where: { id: Number(id) },
    });

    if (!turnoExistente) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    await prisma.turno.delete({
      where: { id: Number(id) },
    });

    res.json({ mensaje: "Turno eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el turno" });
  }
});

module.exports = router;