// RESERVA: envía la reserva por WhatsApp, la guarda en localStorage y la muestra en confirmacion.html
import { obtenerCarrito, calcularTotal, vaciarCarrito, formatearPrecio } from "./carrito.js"

// Número de WhatsApp de la agencia (549 + característica + número, sin 0 ni 15)
const NUMERO_WHATSAPP = "5493511234567"
const CLAVE_RESERVA = "reservaNomada"

// Arma un número de reserva a partir de la fecha y hora actual: NV-2026-482193
function generarNumeroReserva() {
    const anio = new Date().getFullYear()
    const sufijo = String(Date.now()).slice(-6)
    return `NV-${anio}-${sufijo}`
}

// Arma el texto del mensaje con los datos del cliente y los paquetes del carrito
function armarMensaje(reserva) {
    let mensaje = `Hola Nómada Viajes! Quiero confirmar la reserva ${reserva.numero}\n\n`
    mensaje += `Nombre: ${reserva.cliente.nombre}\n`
    mensaje += `DNI: ${reserva.cliente.dni}\n`
    mensaje += `Email: ${reserva.cliente.email}\n`
    mensaje += `Teléfono: ${reserva.cliente.telefono}\n`

    if (reserva.cliente.fecha) {
        mensaje += `Fecha estimada: ${reserva.cliente.fecha}\n`
    }

    if (reserva.items.length > 0) {
        mensaje += `\nPaquetes:\n`
        reserva.items.forEach((item) => {
            mensaje += `- ${item.nombre}: ${item.personas} personas (${formatearPrecio(item.precio * item.personas)})\n`
        })
        mensaje += `Total: ${formatearPrecio(reserva.total)}\n`
    } else if (reserva.cliente.destino) {
        // Si el carrito está vacío, se envía como consulta por el destino escrito en el formulario
        mensaje += `\nDestino de interés: ${reserva.cliente.destino}\n`
    }

    if (reserva.cliente.mensaje) {
        mensaje += `\nComentarios: ${reserva.cliente.mensaje}\n`
    }
    return mensaje
}

// Recibe los datos del formulario, arma la reserva, la guarda y abre WhatsApp
function enviarReserva(datosCliente) {
    const carrito = obtenerCarrito()

    const reserva = {
        numero: generarNumeroReserva(),
        cliente: datosCliente,
        items: carrito,
        total: calcularTotal(carrito)
    }

    // Se guarda para mostrarla en confirmacion.html
    localStorage.setItem(CLAVE_RESERVA, JSON.stringify(reserva))

    // encodeURIComponent convierte espacios, tildes y saltos de línea para que viajen bien en la URL
    const enlace = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(armarMensaje(reserva))}`
    window.open(enlace, "_blank")

    // La reserva ya se envió: se vacía el carrito
    vaciarCarrito()
    return reserva
}

// Lee la última reserva guardada (o null si no hay ninguna)
function obtenerUltimaReserva() {
    try {
        const texto = localStorage.getItem(CLAVE_RESERVA)
        return texto ? JSON.parse(texto) : null
    } catch (error) {
        console.error("No se pudo leer la reserva:", error)
        return null
    }
}

// Dibuja el resumen de la reserva en confirmacion.html
function renderizarConfirmacion(contenedor) {
    const reserva = obtenerUltimaReserva()

    if (!reserva) {
        contenedor.innerHTML = `
            <h1>Todavía no hiciste ninguna reserva</h1>
            <p>Elegí un paquete en el catálogo, agregalo al carrito y completá tus datos.</p>
            <a href="./catalogo.html">Ver paquetes</a>
        `
        return
    }

    let itemsHTML = ''
    reserva.items.forEach((item) => {
        itemsHTML += `<li>${item.nombre}: ${item.personas} personas — ${formatearPrecio(item.precio * item.personas)}</li>`
    })

    contenedor.innerHTML = `
        <h1>¡Reserva enviada!</h1>
        <p><strong>Número de reserva:</strong> ${reserva.numero}</p>
        <p>Gracias, ${reserva.cliente.nombre}. Recibimos tu solicitud por WhatsApp y un asesor te va a contactar al ${reserva.cliente.telefono} o a ${reserva.cliente.email}.</p>
        ${reserva.items.length > 0 ? `<ul class="resumen-items">${itemsHTML}</ul><p><strong>Total:</strong> ${formatearPrecio(reserva.total)}</p>` : ''}
        <a href="./index.html">Volver al inicio</a>
    `
}

export { enviarReserva, renderizarConfirmacion }