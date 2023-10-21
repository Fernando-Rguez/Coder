class GeneradorPassword {
  constructor() {
    this.caracteresPermitidos = {
      minusculas: "abcdefghijklmnopqrstuvwxyz",
      mayusculas: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numeros: "0123456789",
      especiales: "!@#$%^&*()_+-=[]{}|;:'\",.<>?"
    };
    this.contrasenasGeneradas = [];   
  }
  obtenerOpciones() {
    const longitud = parseInt(document.getElementById("longitud").value);
    if (isNaN(longitud) || longitud <= 0) {
      document.getElementById("error-message").textContent = "La longitud de la contraseña debe ser un número positivo.";
      return null;
    }
    if(longitud >= 101 ){
      document.getElementById("error-message").textContent = "La longitud de la contraseña debe ser menor a una longitud de 100 caracteres.";
      return null;
    }
    const mayuscula = document.getElementById("mayuscula").checked,
          numero = document.getElementById("numero").checked,
          caracteres = document.getElementById("caracteres").checked;

    if (!mayuscula && !numero && !caracteres) {
      document.getElementById("error-message").textContent = "Debe seleccionar al menos un criterio para la contraseña.";
      return null;
    }

    return { longitud, mayuscula, numero, caracteres };
  }

  generarPassword() {
    document.getElementById("error-message").textContent = ""; 
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

    const fechaHoraActual = new Date(),
          fecha = fechaHoraActual.toLocaleDateString(),
          hora = fechaHoraActual.toLocaleTimeString();

    // Muestra la info
    document.getElementById("contrasena-generada").textContent = `Contraseña Generada: ${passwordGenerado}`;
    const listaPassword = document.getElementById("lista-contrasenas"),
          nuevaCont = document.createElement("tr");
    nuevaCont.innerHTML = `<td>${passwordGenerado}</td><td>${fecha}</td><td>${hora}</td>`;
    listaPassword.appendChild(nuevaCont);

    // Restable los valores
    document.getElementById("longitud").value = "";
    document.getElementById("mayuscula").checked = false;
    document.getElementById("numero").checked = false;
    document.getElementById("caracteres").checked = false;
  }
}

const generador = new GeneradorPassword();

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
