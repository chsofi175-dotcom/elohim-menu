async function borrarPedido(){

    if(pedidoSeleccionado === null){
        alert("Selecciona un pedido.");
        return;
    }

    if(!confirm("¿Deseas eliminar este pedido permanentemente?")){
        return;
    }

    const id = pedidos[pedidoSeleccionado].id;

    await eliminarPedido(id);

    pedidoSeleccionado = null;

    detallePedido.innerHTML = `
        <p style="text-align:center;color:#888;">
            Selecciona un pedido para ver su información.
        </p>
    `;

    await cargarPedidos();

}




const secciones = {
    btnInicio: null, // Inicio muestra el panel principal
    btnInventario: document.getElementById("seccionInventario"),
    btnPedidos: document.getElementById("seccionPedidos"),
    btnHistorial: document.getElementById("seccionHistorial"),
    btnReportes: document.getElementById("seccionReportes"),
    btnAjustes: document.getElementById("seccionAjustes")
};

function mostrarSeccion(id){

    document.querySelectorAll(".panelContenido").forEach(sec=>{
        sec.style.display = "none";
    });

    if(secciones[id]){
        secciones[id].style.display = "block";
    }

    document.querySelectorAll(".opcionMenu").forEach(btn=>{
        btn.classList.remove("activa");
    });

    document.getElementById(id).classList.add("activa");

}

document.getElementById("btnInventario").onclick = ()=>mostrarSeccion("btnInventario");
document.getElementById("btnPedidos").onclick = ()=>mostrarSeccion("btnPedidos");
document.getElementById("btnHistorial").onclick = ()=>mostrarSeccion("btnHistorial");
document.getElementById("btnReportes").onclick = ()=>mostrarSeccion("btnReportes");
document.getElementById("btnAjustes").onclick = ()=>mostrarSeccion("btnAjustes");



mostrarSeccion("btnInventario");





/*=========================================
PANEL DEL DUEÑO
PARTE 3.1
Variables globales
=========================================*/
import {
    db,
    obtenerProductos,
    actualizarProducto,
    agregarProducto,
    eliminarProducto,
    obtenerPedidos,
    actualizarPedido,
    eliminarPedido,
    subirImagenProducto
} from "./firebase.js";
/*=========================================
FUNCIONES FIREBASE
=========================================*/

const listaPedidos =
document.getElementById("listaPedidos");

const detallePedido =
document.getElementById("detallePedido");

const tablaInventario =
document.getElementById("tablaInventario");

const historialPedidos =
document.getElementById("historialPedidos");

let pedidos = [];

let inventario = [];

let pedidoSeleccionado = null;


async function cargarInventario(){

    inventario = await obtenerProductos();

    mostrarInventario();

    actualizarEstadisticas();

}


/*=========================================
FECHA ACTUAL
=========================================*/

function mostrarFecha(){

    const hoy = new Date();

    const opciones = {
        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric"
    };

    document.getElementById("fechaActual").textContent =
    hoy.toLocaleDateString("es-MX", opciones);

}

/*=========================================
ESTADÍSTICAS
=========================================*/

async function actualizarEstadisticas(){

    let ventas = 0;
    let productos = 0;

    let pendientes = 0;
    let preparando = 0;
    let listos = 0;
    let entregados = 0;

    pedidos.forEach(pedido=>{

        ventas += Number(pedido.total) || 0;

        if(pedido.productos){

            pedido.productos.forEach(item=>{

                productos += Number(item.cantidad);

            });

        }

        switch(pedido.estado){

            case "Pendiente":
                pendientes++;
                break;

            case "En preparación":
                preparando++;
                break;

            case "Listo":
                listos++;
                break;

            case "Entregado":
                entregados++;
                break;

        }

    });

    document.getElementById("ventasDia").textContent =
    "$"+ventas.toFixed(2);

    document.getElementById("ingresosTotales").textContent =
    "$"+ventas.toFixed(2);

    document.getElementById("totalPedidos").textContent =
    pedidos.length;

    document.getElementById("productosInventario").textContent =
    inventario.length;

    document.getElementById("pedidosPendientes").textContent =
    pendientes;

    document.getElementById("pedidosPreparacion").textContent =
    preparando;

    document.getElementById("pedidosListos").textContent =
    listos;

    document.getElementById("pedidosEntregados").textContent =
    entregados;

    document.getElementById("reporteVentas").textContent =
    "$"+ventas.toFixed(2);

    document.getElementById("reportePedidos").textContent =
    pedidos.length;

    document.getElementById("reporteProductos").textContent =
    productos;

}

/*=========================================
GUARDAR DATOS
=========================================*/

async function guardarPedidoActual(){

    const pedido = pedidos[pedidoSeleccionado];

    console.log("Pedido completo:", pedido);
    console.log("ID:", pedido.id);
    console.log("Tipo:", typeof pedido.id);

    await actualizarPedido(
        pedido.id,
        {
            estado: pedido.estado,
            mensaje: pedido.mensaje || ""
        }
    );

}

async function cargarPedidos(){

    pedidos = await obtenerPedidos();

    mostrarPedidos();

    mostrarHistorial();

    actualizarEstadisticas();

    actualizarReportes();

}

async function guardarInventario(){

    for(const producto of inventario){

        await actualizarProducto(
            producto.id,
            {
                precio: producto.precio,
                stock: producto.stock,
                disponible: producto.stock > 0
            }
        );

    }

}




/*=========================================
INICIAR PANEL
=========================================*/


/*=========================================
PARTE 3.2
MOSTRAR PEDIDOS RECIENTES
=========================================*/

function mostrarPedidos(){

    listaPedidos.innerHTML="";

    if(pedidos.length===0){

        listaPedidos.innerHTML=`

        <div style="
        text-align:center;
        padding:40px;
        color:#777;
        ">

            <i class="fa-solid fa-receipt"
            style="font-size:60px;margin-bottom:15px;"></i>

            <h3>No hay pedidos</h3>

            <p>Cuando un cliente descargue un ticket aparecerá aquí.</p>

        </div>

        `;

        return;

    }

    pedidos.forEach((pedido,index)=>{

        let claseEstado="pendiente";

        if(pedido.estado==="En preparación"){

            claseEstado="preparacion";

        }

        if(pedido.estado==="Listo"){

            claseEstado="listo";

        }

        if(pedido.estado==="Entregado"){

            claseEstado="entregado";

        }

        listaPedidos.innerHTML+=`

        <div
        class="pedidoCard"
        onclick="seleccionarPedido(${index})">

            <h3>

                ${pedido.cliente || "Cliente"}

            </h3>

            <p>

                📞 ${pedido.telefono || "-"}

            </p>

            <p>

                📍 ${pedido.direccion || "Sin dirección"}

            </p>

            <p>

                💲 $${Number(pedido.total).toFixed(2)}

            </p>

            <span class="estadoPedido ${claseEstado}">

                ${pedido.estado}

            </span>

        </div>

        `;

    });

}

/*=========================================
SELECCIONAR PEDIDO
=========================================*/

function seleccionarPedido(indice){

    pedidoSeleccionado=indice;

    document
    .querySelectorAll(".pedidoCard")
    .forEach(card=>{

        card.classList.remove("activo");

    });

    document
    .querySelectorAll(".pedidoCard")[indice]
    .classList.add("activo");

    let pedido=pedidos[indice];

    let productosHTML="";

    pedido.productos.forEach(item=>{

        productosHTML+=`

        <div style="
        display:flex;
        justify-content:space-between;
        margin:8px 0;
        ">

            <span>

                ${item.nombre}
                <br>
                x${item.cantidad}

            </span>

            <strong>

                $${(item.precio*item.cantidad).toFixed(2)}

            </strong>

        </div>

        `;

    });

    detallePedido.innerHTML=`

    <p><strong>Cliente:</strong><br>${pedido.cliente}</p>

    <p><strong>Teléfono:</strong><br>${pedido.telefono}</p>

    <p><strong>Dirección:</strong><br>${pedido.direccion}</p>

    <p><strong>Entrega:</strong><br>${pedido.entrega}</p>

    <p><strong>Método de pago:</strong><br>${pedido.metodoPago}</p>

    <hr style="margin:15px 0;">

    <h3>Productos</h3>

    ${productosHTML}

    <hr style="margin:15px 0;">

    <p>

        <strong>Subtotal:</strong>

        $${Number(pedido.subtotal).toFixed(2)}

    </p>

    <p>

        <strong>Extras:</strong>

        $${Number(pedido.extras).toFixed(2)}

    </p>

    <p>

        <strong>Paga con:</strong>

        $${Number(pedido.pagaCon).toFixed(2)}

    </p>

    <p>

        <strong>Cambio:</strong>

        $${Number(pedido.cambio).toFixed(2)}

    </p>

    <div class="totalPedido">

        Total:
        $${Number(pedido.total).toFixed(2)}

    </div>

    `;

}

window.seleccionarPedido = seleccionarPedido;

/*=========================================
ACTUALIZAR BOTÓN
=========================================*/

document
.getElementById("btnActualizarPedidos")
.onclick = async ()=>{

    await cargarPedidos();

};

/*=========================================
PARTE 3.3
CAMBIAR ESTADO DE LOS PEDIDOS
=========================================*/

async function cambiarEstado(nuevoEstado){

    if(pedidoSeleccionado===null){

        alert("Selecciona un pedido.");

        return;

    }

    pedidos[pedidoSeleccionado].estado = nuevoEstado;

    await guardarPedidoActual();

    await cargarPedidos();

    actualizarEstadisticas();

    seleccionarPedido(pedidoSeleccionado);

}

/*=========================================
BOTÓN ACEPTAR
=========================================*/

document
.getElementById("btnAceptarPedido")
.onclick = async ()=>{

    await cambiarEstado("Pendiente");

};

/*=========================================
BOTÓN EN PREPARACIÓN
=========================================*/

document
.getElementById("btnPreparacion")
.onclick = async ()=>{

    await cambiarEstado("En preparación");

};

/*=========================================
BOTÓN LISTO
=========================================*/

document
.getElementById("btnListo")
.onclick = async ()=>{

    await cambiarEstado("Listo");

};

/*=========================================
BOTÓN ENTREGADO
=========================================*/
document
.getElementById("btnEntregado")
.onclick = async ()=>{

    await cambiarEstado("Entregado");

};


document
.getElementById("btnEliminarPedido")
.onclick = borrarPedido;






/*=========================================
ACTUALIZAR AL CAMBIAR ESTADOS
=========================================*/

const actualizarPanel=()=>{

    mostrarPedidos();

    mostrarHistorial();

    actualizarEstadisticas();

};


/*=========================================
REEMPLAZAR LA FUNCIÓN window.onload
=========================================*/

// Sustituye el window.onload anterior por este:


/*=========================================
PARTE 3.4
INVENTARIO
CARGAR - EDITAR - GUARDAR
=========================================*/

const modalInventario =
document.getElementById("modalInventario");

const imgProducto =
document.getElementById("imgProductoEditar");

const nombreProducto =
document.getElementById("nombreProductoEditar");

const precioProducto =
document.getElementById("precioProductoEditar");

const stockProducto =
document.getElementById("stockProductoEditar");

const btnEliminarProducto =
document.getElementById("btnEliminarProducto");

const btnCambiarImagen =
document.getElementById("btnCambiarImagen");

const archivoProducto =
document.getElementById("archivoProducto");

let productoEditar = null;

/*=========================================
CARGAR INVENTARIO
=========================================*/

function mostrarInventario(){

    if(!tablaInventario) return;

    tablaInventario.innerHTML="";

    inventario.forEach((producto,index)=>{

        let estado =
        producto.stock > 0
        ? "<span class='estadoDisponible'>Disponible</span>"
        : "<span class='estadoAgotado'>Agotado</span>";

        tablaInventario.innerHTML += `

        <tr>

            <td>

                <img src="${producto.imagen}">

            </td>

            <td>

                ${producto.nombre}

            </td>

            <td>

                $${Number(producto.precio).toFixed(2)}

            </td>

            <td>

                ${producto.stock}

            </td>

            <td>

                ${estado}

            </td>

            <td>

                <button
                class="btnEditar"
                onclick="editarProducto(${index})">

                    Editar

                </button>

            </td>

        </tr>

        `;

    });

}

/*=========================================
ABRIR MODAL
=========================================*/

function editarProducto(indice){

    productoEditar = indice;

    let producto = inventario[indice];

    imgProducto.src = producto.imagen;

    nombreProducto.value = producto.nombre;

    precioProducto.value = producto.precio;

    stockProducto.value = producto.stock;

    document.getElementById("tituloModalProducto").textContent =
    "Editar Producto";

    btnEliminarProducto.style.display = "inline-block";

    modalInventario.style.display = "flex";

}

window.editarProducto = editarProducto;
/*=========================================
CAMBIAR IMAGEN
=========================================*/

btnCambiarImagen.onclick = () => {

    archivoProducto.click();

};

archivoProducto.onchange = async () => {

    const archivo = archivoProducto.files[0];

    if(!archivo){

        return;

    }

    try{

        imgProducto.src = "img/cargando.gif";

        const url = await subirImagenProducto(archivo);

        imgProducto.src = url;

    }catch(error){

        console.error(error);

        alert("No se pudo subir la imagen.");

    }

};

/*=========================================
GUARDAR CAMBIOS
=========================================*/
document.getElementById("btnActualizarProducto").onclick = async () => {

    // AGREGAR PRODUCTO
    if(productoEditar === null){

        await agregarProducto({

            nombre: nombreProducto.value,

            precio: Number(precioProducto.value),

            stock: Number(stockProducto.value),

            imagen: imgProducto.src,

            disponible: Number(stockProducto.value) > 0,

            orden: inventario.length + 1

        });

    }

    // EDITAR PRODUCTO
    else{

        await actualizarProducto(

            inventario[productoEditar].id,

            {

                nombre: nombreProducto.value,

                precio: Number(precioProducto.value),

                stock: Number(stockProducto.value),

                imagen: imgProducto.src,

                disponible: Number(stockProducto.value) > 0,

                orden: inventario[productoEditar].orden

            }

        );

    }

    modalInventario.style.display = "none";

    await cargarInventario();

};

document.getElementById("btnAgregarProducto").onclick = ()=>{

    productoEditar = null;

    document.getElementById("tituloModalProducto").textContent =
    "Agregar Producto";

    imgProducto.src = "img/producto.png";

    nombreProducto.value = "";

    precioProducto.value = "";

    stockProducto.value = "";

    btnEliminarProducto.style.display = "none";

    modalInventario.style.display = "flex";

};

  

document.getElementById("btnEliminarProducto").onclick = async ()=>{

    if(productoEditar===null){

        alert("Selecciona un producto.");

        return;

    }

    if(!confirm("¿Eliminar este producto?")){

        return;

    }

    await eliminarProducto(
        inventario[productoEditar].id
    );

    modalInventario.style.display="none";

    await cargarInventario();

};

/*=========================================
CERRAR MODAL
=========================================*/

document
.getElementById("btnCancelarProducto")
.onclick = ()=>{

    modalInventario.style.display="none";

};

window.addEventListener("click",(e)=>{

    if(e.target===modalInventario){

        modalInventario.style.display="none";

    }

});

/*=========================================
CREAR INVENTARIO SI NO EXISTE
=========================================*/

/*=========================================
ACTUALIZAR PANEL
=========================================*/

/*=========================================
PARTE 3.5
HISTORIAL, REPORTES Y BOTÓN SALIR
=========================================*/

/*=========================================
ACTUALIZAR REPORTES
=========================================*/

function actualizarReportes(){

    let ventas=0;
    let totalProductos=0;
    let entregados=0;

    pedidos.forEach(pedido=>{

        ventas += Number(pedido.total)||0;

        if(pedido.estado==="Entregado"){

            entregados++;

        }

        if(pedido.productos){

            pedido.productos.forEach(producto=>{

                totalProductos += Number(producto.cantidad)||0;

            });

        }

    });

    document.getElementById("reporteVentas").textContent =
    "$"+ventas.toFixed(2);

    document.getElementById("reportePedidos").textContent =
    pedidos.length;

    document.getElementById("reporteProductos").textContent =
    totalProductos;

}

/*=========================================
MOSTRAR HISTORIAL
=========================================*/

function mostrarHistorial(){

    historialPedidos.innerHTML="";

    const entregados = pedidos.filter(
        pedido => pedido.estado==="Entregado"
    );

    if(entregados.length===0){

        historialPedidos.innerHTML=`

        <div style="
        text-align:center;
        padding:30px;
        color:#777;
        ">

            <i class="fa-solid fa-clock-rotate-left"
            style="font-size:50px;"></i>

            <h3 style="margin-top:15px;">
                No hay pedidos entregados
            </h3>

        </div>

        `;

        return;

    }

    entregados.reverse().forEach(pedido=>{

        historialPedidos.innerHTML += `

        <div class="historialCard">

            <h3>

                ${pedido.cliente}

            </h3>

            <p>

                📞 ${pedido.telefono}

            </p>

            <p>

                📍 ${pedido.direccion}

            </p>

            <p>

                💰 Total:
                $${Number(pedido.total).toFixed(2)}

            </p>

            <p>

                ✔ Estado:
                ${pedido.estado}

            </p>

        </div>

        `;

    });

}

/*=========================================
GUARDAR AJUSTES
=========================================*/

document
.getElementById("btnGuardarAjustes")
.onclick=()=>{

    const ajustes={

        negocio:
        document.getElementById("nombreNegocio").value,

        telefono:
        document.getElementById("telefonoNegocio").value,

        direccion:
        document.getElementById("direccionNegocio").value

    };

    localStorage.setItem(
        "ajustesElohim",
        JSON.stringify(ajustes)
    );

    alert("Ajustes guardados correctamente.");

};

/*=========================================
CARGAR AJUSTES
=========================================*/

function cargarAjustes(){

    const ajustes=
    JSON.parse(
    localStorage.getItem("ajustesElohim")
    );

    if(!ajustes){

        return;

    }

    document.getElementById("nombreNegocio").value =
    ajustes.negocio;

    document.getElementById("telefonoNegocio").value =
    ajustes.telefono;

    document.getElementById("direccionNegocio").value =
    ajustes.direccion;

}

/*=========================================
BOTÓN SALIR
=========================================*/

const btnSalirPanel =
document.getElementById("btnSalirPanel");

if(btnSalirPanel){

    btnSalirPanel.onclick = ()=>{

        if(confirm("¿Deseas salir del Panel del Dueño?")){

            sessionStorage.removeItem("adminLogueado");

            window.location.href = "admin.html";

        }

    };

}

/*=========================================
ACTUALIZACIÓN AUTOMÁTICA
=========================================*/

setInterval(async ()=>{

    await cargarPedidos();

},3000);

/*=========================================
INICIAR PANEL
=========================================*/

window.onload = async ()=>{

    mostrarFecha();

    cargarAjustes();

    await cargarInventario();

    await cargarPedidos();

};

/*=========================================
PARTE 6
NOTIFICACIONES DE PEDIDOS NUEVOS
=========================================*/

// IDs de pedidos ya notificados
let pedidosNotificados = new Set(
    JSON.parse(localStorage.getItem("pedidosNotificados") || "[]")
);

/*=========================================
SONIDO
=========================================*/

const sonidoPedido = new Audio("audio/notificacion.mp3");

/*=========================================
MOSTRAR NOTIFICACIÓN
=========================================*/

function mostrarNotificacion(pedido){

    if(Notification.permission === "granted"){

        new Notification("☕ Nuevo pedido",{
            body: `${pedido.cliente} realizó un pedido de $${Number(pedido.total).toFixed(2)}`,
            icon: "logo.png"
        });

    }

    sonidoPedido.play().catch(()=>{});

    const aviso = document.createElement("div");

    aviso.className = "notificacionPedido";

    aviso.innerHTML = `
        <i class="fa-solid fa-bell"></i>

        <div>
            <strong>Nuevo pedido</strong><br>
            ${pedido.cliente}
        </div>
    `;

    document.body.appendChild(aviso);

    setTimeout(()=>{
        aviso.remove();
    },5000);

}

/*=========================================
PERMISO
=========================================*/

if("Notification" in window){
    Notification.requestPermission();
}

/*=========================================
REVISAR PEDIDOS
=========================================*/

async function revisarPedidos(){

    const pedidosGuardados = await obtenerPedidos();

    for(const pedido of pedidosGuardados){

        // Solo avisar si nunca se había notificado
        if(!pedidosNotificados.has(pedido.id)){

            mostrarNotificacion(pedido);

            pedidosNotificados.add(pedido.id);

            localStorage.setItem(
                "pedidosNotificados",
                JSON.stringify([...pedidosNotificados])
            );

        }

    }

    pedidos = pedidosGuardados;

    mostrarPedidos();

    mostrarHistorial();

    actualizarEstadisticas();

    actualizarReportes();

}

/*=========================================
INICIAR
=========================================*/

revisarPedidos();

setInterval(revisarPedidos,1000);

/*=========================================
PARTE 7
CONFIRMAR O RECHAZAR PEDIDOS
Y SINCRONIZAR CON EL CLIENTE
=========================================*/

/*=========================================
CONFIRMAR PEDIDO
=========================================*/

async function confirmarPedido(){

    if(pedidoSeleccionado===null){

        alert("Selecciona un pedido.");

        return;

    }

    pedidos[pedidoSeleccionado].estado="Confirmado";

    pedidos[pedidoSeleccionado].mensaje=
    "✅ Tu pedido ha sido confirmado y será preparado.";

    await guardarPedidoActual();

    await cargarPedidos();

    seleccionarPedido(pedidoSeleccionado);

}

/*=========================================
RECHAZAR PEDIDO
=========================================*/

async function rechazarPedido(){

    if(pedidoSeleccionado===null){

        alert("Selecciona un pedido.");

        return;

    }

    let motivo = prompt("Motivo del rechazo:");

    if(motivo===null){

        return;

    }

    pedidos[pedidoSeleccionado].estado = "Rechazado";

    pedidos[pedidoSeleccionado].mensaje =
    "❌ Pedido rechazado.\nMotivo: " + motivo;

    await guardarPedidoActual();

    await cargarPedidos();

    seleccionarPedido(pedidoSeleccionado);

}

/*=========================================
BOTONES
=========================================*/

/*=========================================
BOTONES
=========================================*/

// document
// .getElementById("btnConfirmarPedido")
// .onclick = confirmarPedido;

// document
// .getElementById("btnRechazarPedido")
// .onclick = rechazarPedido;

/*=========================================
SINCRONIZAR ESTADOS
=========================================*/

/*=========================================
PEDIDOS
=========================================*/

