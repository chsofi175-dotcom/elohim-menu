// =====================================
// ELOHIM COFFEE
// whatsapp.js
// =====================================

// Número de WhatsApp del negocio
const numeroWhatsApp = "529971397079";

// =====================================
// Enviar Pedido por WhatsApp
// =====================================

function enviarWhatsApp() {

    // Validar carrito
    if (carrito.length === 0) {

        alert("Agrega al menos un producto al carrito.");

        return;

    }

    // Datos del cliente
    const nombre = document.getElementById("nombre").value.trim();
    const calle = document.getElementById("calle").value.trim();
    const paga = document.getElementById("paga").value;
    const cambio = document.getElementById("cambio").value;
    const mensajeCliente = document.getElementById("mensaje").value.trim();

    if (nombre === "") {

        alert("Escribe el nombre del cliente.");

        return;

    }

    if (calle === "") {

        alert("Escribe la dirección del cliente.");

        return;

    }

    // Productos
    let mensaje = "☕ *ELOHIM COFFEE*%0A";
    mensaje += "========================%0A%0A";

    mensaje += "👤 *Cliente:* " + nombre + "%0A";
    mensaje += "📍 *Dirección:* " + calle + "%0A%0A";

    mensaje += "🛒 *Pedido:*%0A";

    carrito.forEach(producto => {

        mensaje += "• " +
            producto.cantidad +
            " x " +
            producto.nombre +
            " - $" +
            (producto.precio * producto.cantidad).toFixed(2) +
            "%0A";

    });

    mensaje += "%0A";

    mensaje += "💰 *Total:* " +
        document.getElementById("total").textContent +
        "%0A";

    mensaje += "💵 *Paga con:* $" +
        paga +
        "%0A";

    mensaje += "💲 *Cambio:* " +
        cambio +
        "%0A%0A";

    mensaje += "📝 *Mensaje:*%0A";

    if (mensajeCliente === "") {

        mensaje += "Sin comentarios.%0A";

    } else {

        mensaje += mensajeCliente + "%0A";

    }

    mensaje += "%0A¡Gracias por su compra! ☕";

    // Abrir WhatsApp
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

    window.open(url, "_blank");

}

// =====================================
// Evento del botón WhatsApp
// =====================================

document
.getElementById("btnWhatsApp")
.addEventListener("click", enviarWhatsApp);