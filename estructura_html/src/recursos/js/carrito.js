// CARRITO: guarda los paquetes elegidos en localStorage y los muestra en pantalla
// localStorage solo guarda texto, por eso se usa JSON.stringify para guardar y JSON.parse para leer

const CLAVE_CARRITO = "carritoNomada"

// Convierte un número en precio: 420000 -> $420.000
function formatearPrecio(precio) {
    return "$" + precio.toLocaleString("es-AR")
}

// Lee el carrito guardado. Si no hay nada o el dato está dañado, devuelve un arreglo vacío
function obtenerCarrito() {
    try {
        const texto = localStorage.getItem(CLAVE_CARRITO)
        return texto ? JSON.parse(texto) : []
    } catch (error) {
        console.error("No se pudo leer el carrito:", error)
        return []
    }
}

// Guarda el arreglo del carrito convertido a texto JSON
function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
}

// Agrega un paquete. Si ya estaba en el carrito, solo se actualiza la cantidad de personas
function agregarAlCarrito(paquete, personas) {
    const carrito = obtenerCarrito()
    const existente = carrito.find((item) => item.id === paquete.id)

    if (existente) {
        existente.personas = personas
    } else {
        carrito.push({
            id: paquete.id,
            nombre: paquete.nombre,
            imagen: paquete.imagen,
            descripcionImagen: paquete.descripcionImagen,
            precio: paquete.precio,
            personas: personas
        })
    }
    guardarCarrito(carrito)
}

// Quita un paquete: filter arma un arreglo nuevo sin el paquete de ese id
function quitarDelCarrito(id) {
    const carrito = obtenerCarrito().filter((item) => item.id !== id)
    guardarCarrito(carrito)
}

// Suma el precio por la cantidad de personas de cada paquete
function calcularTotal(carrito) {
    let total = 0
    carrito.forEach((item) => {
        total += item.precio * item.personas
    })
    return total
}

// Vacía el carrito (se usa cuando se confirma la reserva)
function vaciarCarrito() {
    localStorage.removeItem(CLAVE_CARRITO)
}

// Dibuja el carrito dentro de la sección <section id="contenedor-carrito">
function renderizarCarrito(contenedor) {
    const carrito = obtenerCarrito()

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <h2>Tu carrito</h2>
            <p class="carrito-vacio">Tu carrito está vacío.</p>
        `
        return
    }

    let itemsHTML = ''
    carrito.forEach((item) => {
        itemsHTML += `
            <li class="carrito-item">
                <img src="${item.imagen}" alt="${item.descripcionImagen}" width="80">
                <div class="carrito-datos">
                    <h3>${item.nombre}</h3>
                    <p>${item.personas} personas × ${formatearPrecio(item.precio)}</p>
                </div>
                <p class="carrito-precio">${formatearPrecio(item.precio * item.personas)}</p>
                <button type="button" class="boton-quitar" data-id="${item.id}">
                    Quitar
                </button>
            </li>
        `
    })

    contenedor.innerHTML = `
        <h2>Tu carrito</h2>
        <ul class="carrito-items">${itemsHTML}</ul>
        <div class="carrito-total">
            <p>Subtotal: <strong>${formatearPrecio(calcularTotal(carrito))}</strong></p>
            <a href="./formulario.html">
                Continuar con la reserva
            </a>
        </div>
    `
}

// Muestra un aviso flotante que desaparece solo a los 3 segundos
function mostrarAviso(mensaje) {
    const aviso = document.createElement("div")
    aviso.className = "aviso"
    aviso.setAttribute("role", "status")
    aviso.textContent = mensaje
    document.body.appendChild(aviso)

    setTimeout(() => {
        aviso.remove()
    }, 3000)
}

// La llama index.js en detalle.html: dibuja el carrito y escucha los botones
function iniciarCarrito(contenedor, paquete, botonAgregar, campoPersonas) {
    renderizarCarrito(contenedor)

    // Escuchador del botón "Agregar al carrito"
    botonAgregar.addEventListener("click", () => {
        const personas = Number(campoPersonas.value)

        // Validación: entre 1 y 10 personas, número entero
        if (!Number.isInteger(personas) || personas < 1 || personas > 10) {
            mostrarAviso("Elegí entre 1 y 10 personas.")
            return
        }

        agregarAlCarrito(paquete, personas)
        renderizarCarrito(contenedor)
        mostrarAviso(`${paquete.nombre} se agregó al carrito.`)
    })

    // Un solo escuchador en el contenedor para todos los botones "Quitar"
    // (los botones se vuelven a crear en cada renderizado)
    contenedor.addEventListener("click", (evento) => {
        if (evento.target.classList.contains("boton-quitar")) {
            quitarDelCarrito(evento.target.dataset.id)
            renderizarCarrito(contenedor)
            mostrarAviso("Paquete quitado del carrito.")
        }
    })
}

export { iniciarCarrito, obtenerCarrito, calcularTotal, vaciarCarrito, mostrarAviso, formatearPrecio }