/*=========================================
ELOHIM
PANEL DEL DUEÑO
admin.js
=========================================*/

const btnInicio = document.getElementById("btnInicio");

const modalPassword = document.getElementById("modalPassword");

const password = document.getElementById("password");

const btnEntrar = document.getElementById("btnEntrar");

const btnCancelar = document.getElementById("btnCancelar");

const mensajeError = document.getElementById("mensajeError");

/*=========================================
CONTRASEÑA
=========================================*/

const CONTRASENA = "elohim2026";

/*=========================================
ABRIR VENTANA
=========================================*/

btnInicio.onclick = () => {

    modalPassword.style.display = "flex";

    password.value = "";

    mensajeError.textContent = "";

    password.focus();

};

/*=========================================
CERRAR VENTANA
=========================================*/

btnCancelar.onclick = () => {

    modalPassword.style.display = "none";

};

/*=========================================
CERRAR AL HACER CLICK AFUERA
=========================================*/

window.onclick = (e) => {

    if (e.target === modalPassword) {

        modalPassword.style.display = "none";

    }

};

/*=========================================
VALIDAR CONTRASEÑA
=========================================*/

function validarAcceso(){

    if(password.value.trim() === CONTRASENA){

        mensajeError.style.color = "green";

        mensajeError.textContent = "Acceso permitido...";

        setTimeout(() => {
            sessionStorage.setItem("adminLogueado", "true");
            window.location.href = "dueno.html";
        }, 600);

    }else{

        mensajeError.style.color = "red";

        mensajeError.textContent = "❌ Contraseña incorrecta.";

        password.select();

    }

}

/*=========================================
BOTÓN ENTRAR
=========================================*/

btnEntrar.onclick = validarAcceso;

/*=========================================
TECLA ENTER
=========================================*/

password.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        validarAcceso();

    }

});

/*=========================================
BLOQUEAR CLIC DERECHO (OPCIONAL)
=========================================*/

document.addEventListener("contextmenu",(e)=>{

    e.preventDefault();

});

/*=========================================
BLOQUEAR F12 (OPCIONAL)
=========================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="F12"){

        e.preventDefault();

    }

});