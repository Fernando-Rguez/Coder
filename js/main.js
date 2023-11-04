class GeneradorPassword {
  constructor() {
    this.caracteresPermitidos = {
      minusculas: "abcdefghijklmnopqrstuvwxyz",
      mayusculas: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numeros: "0123456789",
      especiales: "!@#$%^&*()_+-=[]{}|;:'\",.<>?"
    };
    this.contrasenasGeneradas = this.cargarContrasenasDesdeLocalStorage();
  }

  cargarContrasenasDesdeLocalStorage() {
    const contrasenasGuardadas = localStorage.getItem("contrasenas");
    return contrasenasGuardadas ? JSON.parse(contrasenasGuardadas) : [];
  }

  guardarContrasenasEnLocalStorage() {
    localStorage.setItem("contrasenas", JSON.stringify(this.contrasenasGeneradas));
  }

  obtenerOpciones() {
    const longitud = parseInt(document.getElementById("longitud").value);
    if (isNaN(longitud) || longitud <= 0) {
      document.getElementById("error-message").textContent = "La longitud de la contraseña debe ser un número positivo.";
      return null;
    }
    if (longitud >= 101) {
      document.getElementById("error-message").textContent = "La longitud de la contraseña debe ser menor a 100 caracteres.";
      return null;
    }
    const mayuscula = document.getElementById("mayuscula").checked;
    const numero = document.getElementById("numero").checked;
    const caracteres = document.getElementById("caracteres").checked;

    if (!mayuscula && !numero && !caracteres) {
      document.getElementById("error-message").textContent = "Debe seleccionar al menos un criterio para la contraseña.";
      return null;
    }

    document.getElementById("error-message").textContent = "";
    return { longitud, mayuscula, numero, caracteres };
  }

  generarPassword() {
    const opciones = this.obtenerOpciones();
    if (!opciones) return;

    let caracteresUsados = "abcdefghijklmnopqrstuvwxyz";
    if (opciones.mayuscula) caracteresUsados += this.caracteresPermitidos.mayusculas;
    if (opciones.numero) caracteresUsados += this.caracteresPermitidos.numeros;
    if (opciones.caracteres) caracteresUsados += this.caracteresPermitidos.especiales;

    let passwordGenerado = "";
    for (let i = 0; i < opciones.longitud; i++) {
      const aleatorio = Math.floor(Math.random() * caracteresUsados.length);
      passwordGenerado += caracteresUsados.charAt(aleatorio);
    }

    const fechaHoraActual = new Date();
    const fecha = fechaHoraActual.toLocaleDateString();
    const hora = fechaHoraActual.toLocaleTimeString();

    // Generar un identificador único para la contraseña
    const id = Date.now(); // Puedes usar una marca de tiempo como identificador

    this.contrasenasGeneradas.push({
      id: id, // Agregar el identificador
      contraseña: passwordGenerado,
      fecha: fecha,
      hora: hora
    });

    this.guardarContrasenasEnLocalStorage();

    document.getElementById("contrasena-generada").textContent = `Última Contraseña Generada: ${passwordGenerado}`;

    const listaPassword = document.getElementById("lista-contrasenas");
    const nuevaCont = listaPassword.insertRow(-1);
    nuevaCont.setAttribute("data-id", id);
    const nuevaCelda1 = nuevaCont.insertCell(0);
    nuevaCelda1.textContent = passwordGenerado;
    const nuevaCelda2 = nuevaCont.insertCell(1);
    nuevaCelda2.textContent = fecha;
    const nuevaCelda3 = nuevaCont.insertCell(2);
    nuevaCelda3.textContent = hora;
    const nuevaCelda4 = nuevaCont.insertCell(3);
    const eliminarBtn = document.createElement("button");
    eliminarBtn.className = "btn btn-danger btn-sm";
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.onclick = () => this.borrarContrasena(id);
    nuevaCelda4.appendChild(eliminarBtn);

    document.getElementById("longitud").value = "";
    document.getElementById("mayuscula").checked = false;
    document.getElementById("numero").checked = false;
    document.getElementById("caracteres").checked = false;
  }

  borrarContrasena(id) {
    const index = this.contrasenasGeneradas.findIndex(item => item.id === id);

    if (index !== -1) {
      this.contrasenasGeneradas.splice(index, 1);
      this.guardarContrasenasEnLocalStorage();
    }

    const filaAEliminar = document.querySelector(`#lista-contrasenas tr[data-id="${id}"]`);
    if (filaAEliminar) {
      filaAEliminar.remove();
    }
  }
}

const generador = new GeneradorPassword();

generador.contrasenasGeneradas = generador.cargarContrasenasDesdeLocalStorage();

generador.contrasenasGeneradas.forEach((contrasena) => {
  const listaPassword = document.getElementById("lista-contrasenas");
  const nuevaCont = listaPassword.insertRow(-1);
  nuevaCont.setAttribute("data-id", contrasena.id);
  const nuevaCelda1 = nuevaCont.insertCell(0);
  nuevaCelda1.textContent = contrasena.contraseña;
  const nuevaCelda2 = nuevaCont.insertCell(1);
  nuevaCelda2.textContent = contrasena.fecha;
  const nuevaCelda3 = nuevaCont.insertCell(2);
  nuevaCelda3.textContent = contrasena.hora;
  const nuevaCelda4 = nuevaCont.insertCell(3);
  const eliminarBtn = document.createElement("button");
  eliminarBtn.className = "btn btn-danger btn-sm";
  eliminarBtn.textContent = "Eliminar";
  eliminarBtn.onclick = () => generador.borrarContrasena(contrasena.id);
  nuevaCelda4.appendChild(eliminarBtn);
});

document.getElementById("generarBtn").addEventListener("click", () => {
  generador.generarPassword();
});

function buscarInfo() {
  const textoBusqueda = document.getElementById("busqueda").value.toLowerCase();
  const contrasenas = document.querySelectorAll("#lista-contrasenas tr");
  contrasenas.forEach((contrasena) => {
    const contenido = contrasena.textContent.toLowerCase();
    if (contenido.includes(textoBusqueda)) {
      contrasena.style.display = "table-row";
    } else {
      contrasena.style.display = "none";
    }
  });
}

function restablecerFiltro() {
  const contrasenas = document.querySelectorAll("#lista-contrasenas tr");
  contrasenas.forEach((contrasena) => {
    contrasena.style.display = "table-row";
  });
  document.getElementById("busqueda").value = "";
}
document.getElementById("filtrarBtn").addEventListener("click", buscarInfo);
document.getElementById("restablecerBtn").addEventListener("click", restablecerFiltro);
