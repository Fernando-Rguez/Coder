function generarPassword() {
    const longitud = parseInt(prompt("Ingrese la longitud de la contraseña deseada:"));
    if (isNaN(longitud) || longitud <= 0) {
      alert("La longitud de la contraseña debe ser un número positivo.");
      return generarPassword();
    }
    const mayuscula = confirm("¿Desea incluir letras mayúsculas?"),
          numero = confirm("¿Desea incluir números?"),
          caracteres = confirm("¿Desea incluir caracteres especiales?");
  
    if (!mayuscula && !numero && !caracteres) {
      alert("Debe seleccionar al menos un criterio para la contraseña.");
      return generarPassword();
    }
    const letrasMinusculas = "abcdefghijklmnopqrstuvwxyz",
          letrasMayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          numeros = "0123456789",
          caracteresEspeciales = "!@#$%^&*()_+-=[]{}|;:'\",.<>?";
    let caracteresPermitidos = letrasMinusculas, 
        passwordGenerado = "";
    if (mayuscula) {caracteresPermitidos += letrasMayusculas;}
    if (numero) {caracteresPermitidos += numeros;}
    if (caracteres) {caracteresPermitidos += caracteresEspeciales;}
    for (let i = 0; i < longitud; i++) {
      const aleatorio = Math.floor(Math.random() * caracteresPermitidos.length);
      passwordGenerado += caracteresPermitidos.charAt(aleatorio);
    }
    alert(`La Contraseña Generada:  ${passwordGenerado}`);
    if(passwordGenerado != ''){
        const volver = confirm("¿Desea generar una nueva contraseña?")
        if(volver){return generarPassword();}
    }
}
generarPassword();