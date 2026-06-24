const API_URL = "http://localhost:3000/turnos";

// Referencias DOM
const formulario = document.getElementById("formulario-turno");
const cuerpoTabla = document.getElementById("cuerpo-tabla-turnos");
const inputId = document.getElementById("turno-id");
const btnSubmit = document.getElementById("btn-submit");







async function cargarTurnos() {
  try {
    const respuesta = await fetch(API_URL);
    const turnos = await respuesta.json();

    cuerpoTabla.innerHTML = "";

    turnos.forEach((turno) => {
      const fila = document.createElement("tr");

      const fechaFormateada = new Date(turno.fecha).toLocaleDateString("es-AR");

      fila.innerHTML = `
        <td>${turno.nombre}</td>
        <td>${turno.apellido}</td>
        <td>${turno.telefono}</td>
        <td>${fechaFormateada}</td>
        <td>${turno.horario}</td>
        <td>
          <button class="btn-editar" onclick="cargarTurnoParaEditar(${turno.id})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarTurno(${turno.id})">Eliminar</button>
        </td>
      `;

      cuerpoTabla.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar los turnos:", error);
    alert("No se pudieron cargar los turnos. Verificá que el servidor esté corriendo.");
  }
}












async function cargarTurnoParaEditar(id) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`);
    const turno = await respuesta.json();

    inputId.value = turno.id;
    document.getElementById("nombre").value = turno.nombre;
    document.getElementById("apellido").value = turno.apellido;
    document.getElementById("telefono").value = turno.telefono;
    document.getElementById("fecha").value = new Date(turno.fecha).toISOString().split("T")[0];
    document.getElementById("horario").value = turno.horario;

    btnSubmit.textContent = "Guardar cambios";

    // Llevamos la vista hacia el formulario
    document.getElementById("formulario-section").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Error al cargar el turno:", error);
    alert("No se pudo cargar el turno para editar.");
  }
}











// Crear o editar un turno 
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const id = inputId.value;

  const datosTurno = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    telefono: document.getElementById("telefono").value,
    fecha: document.getElementById("fecha").value,
    horario: document.getElementById("horario").value,
  };

  const esEdicion = id !== "";

  try {
    const respuesta = await fetch(esEdicion ? `${API_URL}/${id}` : API_URL, {
      method: esEdicion ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosTurno),
    });

    if (!respuesta.ok) {
      const error = await respuesta.json();
      alert("Error: " + error.error);
      return;
    }

    formulario.reset();
    inputId.value = "";
    btnSubmit.textContent = "Crear turno";
    cargarTurnos();
  } catch (error) {
    console.error("Error al guardar el turno:", error);
    alert("No se pudo guardar el turno. Verificá que el servidor esté corriendo.");
  }
});









async function eliminarTurno(id) {
  const confirmar = confirm("¿Estás seguro de que querés eliminar este turno?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) {
      const error = await respuesta.json();
      alert("Error: " + error.error);
      return;
    }

    cargarTurnos();
  } catch (error) {
    console.error("Error al eliminar el turno:", error);
    alert("No se pudo eliminar el turno.");
  }
}










// Filtrar horarios ocupados según la fecha elegida
const inputFecha = document.getElementById("fecha");
const selectHorario = document.getElementById("horario");

const horariosOriginales = Array.from(selectHorario.options).map((opcion) => ({
  value: opcion.value,
  texto: opcion.textContent,
}));

inputFecha.addEventListener("change", async () => {
  const fechaSeleccionada = inputFecha.value;

  if (!fechaSeleccionada) return;

  try {
    const respuesta = await fetch(API_URL);
    const turnos = await respuesta.json();

    const idActual = inputId.value;

    const horariosOcupados = turnos
      .filter((turno) => {
        if (idActual && Number(idActual) === turno.id) return false;
        const fechaTurno = new Date(turno.fecha).toISOString().split("T")[0];
        return fechaTurno === fechaSeleccionada;
      })
      .map((turno) => turno.horario);

    const horarioActual = selectHorario.value;

    selectHorario.innerHTML = "";
    horariosOriginales.forEach((opcion) => {
      if (opcion.value === "" || !horariosOcupados.includes(opcion.value)) {
        const nuevaOpcion = document.createElement("option");
        nuevaOpcion.value = opcion.value;
        nuevaOpcion.textContent = opcion.texto;
        selectHorario.appendChild(nuevaOpcion);
      }
    });

    // Si el horario que tenía seleccionado sigue disponible, lo mantenemos
    if (horarioActual && !horariosOcupados.includes(horarioActual)) {
      selectHorario.value = horarioActual;
    }
  } catch (error) {
    console.error("Error al verificar horarios ocupados:", error);
  }
});






cargarTurnos();