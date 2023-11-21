class GeneradorPassword {
  constructor() {
    this.contrasenasGeneradas = this.cargarContrasenasDesdeLocalStorage();
    this.apiKey = 'aeQviv94iFzeyZattE//rg==ZM3l8jb6nNqvgVR7';
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
    const numero = document.getElementById("numero").checked,
          caracteres = document.getElementById("caracteres").checked;

    if (!numero && !caracteres) {
      document.getElementById("error-message").textContent = "Debe seleccionar al menos un criterio para la contraseña.";
      return null;
    }

    document.getElementById("error-message").textContent = "";
    return { longitud, numero, caracteres };
  }

  async obtenerPasswordDesdeAPI(longitud, excludeNumbers, excludeSpecialChars) {
        const apiUrl = `https://api.api-ninjas.com/v1/passwordgenerator?length=${longitud}&exclude_numbers=${excludeNumbers}&exclude_special_chars=${excludeSpecialChars}`;

    const requestOptions = {
      method: 'GET',
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await fetch(apiUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      //Respuesta del Api
      mostrarExito();
      return result.random_password;
    } catch (error) {
      mostrarError();
      console.error('Error al comunicarse con el Api:', error);
      return null;
    }
  }

  async generarPassword() {
    const opciones = this.obtenerOpciones();
    if (!opciones) return;

    const passwordGenerado = await this.obtenerPasswordDesdeAPI(
            opciones.longitud,
            !opciones.numero,
            !opciones.caracteres
            );
    if (!passwordGenerado) {
      console.error('Error al obtener la contraseña desde la API');
      return;
    }

    const fechaHoraActual = new Date(),
          fecha = fechaHoraActual.toLocaleDateString(),
          hora = fechaHoraActual.toLocaleTimeString(),
          id = Date.now();
    this.contrasenasGeneradas.push({
      id: id,
      contraseña: passwordGenerado,
      fecha: fecha,
      hora: hora
    });
    this.guardarContrasenasEnLocalStorage();
    this.actualizarInterfazContrasenaGenerada(passwordGenerado, id, fecha, hora);
    this.restablecerFormulario();
  }

  actualizarInterfazContrasenaGenerada(password, id, fecha, hora) {
    document.getElementById("contrasena-generada").textContent = `Última Contraseña Generada: ${password}`;
    const listaPassword = document.getElementById("lista-contrasenas"),
          nuevaCont = listaPassword.insertRow(-1);
    nuevaCont.setAttribute("data-id", id);
    const celdas = [password, fecha, hora];
    for (let i = 0; i < celdas.length; i++) {
      const nuevaCelda = nuevaCont.insertCell(i);
      nuevaCelda.textContent = celdas[i];
    }
    const nuevaCeldaEliminar = nuevaCont.insertCell(3),
          eliminarBtn = document.createElement("button");
          eliminarBtn.className = "btn btn-danger btn-sm";
          eliminarBtn.textContent = "Eliminar";
          eliminarBtn.onclick = () => this.borrarContrasena(id);
          nuevaCeldaEliminar.appendChild(eliminarBtn);
  }
  restablecerFormulario() {
    document.getElementById("longitud").value = "";
    document.getElementById("numero").checked = false;
    document.getElementById("caracteres").checked = false;
  }

  borrarContrasena(id) {
    Swal.fire({
      title: "¿Estas Seguro de continuar?",
      text: "La contraseña se eliminara permanentemente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const index = this.contrasenasGeneradas.findIndex(item => item.id === id);
        if (index !== -1) {
          this.contrasenasGeneradas.splice(index, 1);
          this.guardarContrasenasEnLocalStorage();
        }
        const filaAEliminar = document.querySelector(`#lista-contrasenas tr[data-id="${id}"]`);
        if (filaAEliminar) {
          filaAEliminar.remove();
        }
        Swal.fire({
          title: "Eliminado!",
          text: "Contraseña eliminada.",
          icon: "success"
        });
      }
    });
    
  }
}
const generador = new GeneradorPassword();
generador.contrasenasGeneradas = generador.cargarContrasenasDesdeLocalStorage();
generador.contrasenasGeneradas.forEach((contrasena) => {
  generador.actualizarInterfazContrasenaGenerada(contrasena.contraseña, contrasena.id, contrasena.fecha, contrasena.hora);
});
document.getElementById("generarBtn").addEventListener("click", () => {
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('spinner').style.display = 'inline-block';
  generador.generarPassword();
  setTimeout(function() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('spinner').style.display = 'none';
  }, 2000);
});
function buscarInfo() {
  const textoBusqueda = document.getElementById("busqueda").value.toLowerCase(),
        contrasenas = document.querySelectorAll("#lista-contrasenas tr");
  contrasenas.forEach((contrasena) => {
    const contenido = contrasena.textContent.toLowerCase();
    contrasena.style.display = contenido.includes(textoBusqueda) ? "table-row" : "none";
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

//SweetAlerts
function mostrarExito() {
  Swal.fire({
    icon: 'success',
    title: '¡Éxito!',
    text: 'Constraseña generada correctamente.',
  });
}
function mostrarError() {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Ha ocurrido un Error.',
  });
}
