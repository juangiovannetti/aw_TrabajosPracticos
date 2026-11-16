//Siempre los import van arriba de todo
import { obtenerPaquetes } from "./datos.js" //nombrada
import { iniciarCatalogo } from "./catalogo.js" //nombrada
import { iniciarFormulario } from "./formulario.js"
import { iniciarDetalle } from "./detalle.js" //nombrada
import { iniciarCarrito, mostrarAviso } from "./carrito.js" //nombrada
import { enviarReserva, renderizarConfirmacion } from "./reserva.js" //nombrada

// Referenciamos elementos del DOM a partir de su ID
// Los 5 HTML cargan este archivo, por eso cada elemento se usa solo si existe en la página abierta
const encabezado = document.getElementById("encabezado-principal")
const botonAbrir = document.getElementById("boton-abrir")
const botonCerrar = document.getElementById("boton-cerrar")
const contenedorPaquetes = document.getElementById("contenedor-paquetes")
const formFiltros = document.getElementById("form-filtros")
const formReserva = document.getElementById("form-reserva")
const contenedorDetalle = document.getElementById("contenedor-detalle")
const contenedorCarrito = document.getElementById("contenedor-carrito")
const resumenReserva = document.getElementById("resumen-reserva")

// Condicional para activar el MENÚ HAMBURGUESA 
if (encabezado && botonAbrir && botonCerrar) {
    // Escuchador: el botón de las tres rayas abre el menú
    botonAbrir.addEventListener('click', (evento) => {     
        encabezado.classList.add("menu-abierto")
        botonAbrir.setAttribute("aria-expanded", "true")
    })

    // Escuchador: el botón de la cruz cierra el menú
    botonCerrar.addEventListener('click', (evento) => {
        encabezado.classList.remove("menu-abierto")
        botonAbrir.setAttribute("aria-expanded", "false")
    })

    // Escuchador: la tecla Escape también cierra el menú
    document.addEventListener('keydown', (evento) => {
        if (evento.key === "Escape") {
            encabezado.classList.remove("menu-abierto")
            botonAbrir.setAttribute("aria-expanded", "false")
        }
    })
}

// CATÁLOGO (solo existe en catalogo.html)
if (contenedorPaquetes && formFiltros) {
    const paquetes = await obtenerPaquetes()

    if (paquetes) {
        iniciarCatalogo(contenedorPaquetes, formFiltros, paquetes)
    } else {
        contenedorPaquetes.innerHTML = '<p>No se pudieron cargar los paquetes. Intentá de nuevo más tarde.</p>'
    }
}

// FORMULARIO DE RESERVA (solo existe en formulario.html)
if (formReserva) {
    // Cuando los datos son válidos: se envía por WhatsApp, se avisa y se pasa a la confirmación
    iniciarFormulario(formReserva, (datos) => {
        enviarReserva(datos)
        mostrarAviso("¡Reserva enviada! Te llevamos a la confirmación...")
        setTimeout(() => {
            window.location.href = "./confirmacion.html"
        }, 2500)
    })
}

// CONFIRMACIÓN (solo existe en confirmacion.html)
if (resumenReserva) {
    renderizarConfirmacion(resumenReserva)
}

// DETALLE Y CARRITO (solo existen en detalle.html)
if (contenedorDetalle && contenedorCarrito) {
    const paquetes = await obtenerPaquetes()

    if (paquetes) {
        const paquete = iniciarDetalle(contenedorDetalle, paquetes)

        // El botón y el campo se buscan DESPUÉS de dibujar el detalle, porque los crea detalle.js
        const botonAgregar = document.getElementById("boton-agregar")
        const campoPersonas = document.getElementById("id-personas")

        if (paquete && botonAgregar && campoPersonas) {
            iniciarCarrito(contenedorCarrito, paquete, botonAgregar, campoPersonas)
        }
    } else {
        contenedorDetalle.innerHTML = '<p>No se pudo cargar el paquete. Intentá de nuevo más tarde.</p>'
    }
}