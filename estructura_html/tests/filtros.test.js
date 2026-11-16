// Pruebas unitarias de filtrarPaquetes (filtros.js) con el test runner nativo de Node
import { test } from "node:test"
import assert from "node:assert/strict"
import { filtrarPaquetes } from "../src/recursos/js/filtros.js"

// Paquetes de prueba: pocos datos y controlados, para saber qué resultado esperar
const paquetes = [
    { id: "bariloche", destino: "Bariloche", precio: 420000, tipoViaje: "aventura", fechaSalida: "2026-12-10" },
    { id: "florianopolis", destino: "Florianópolis", precio: 580000, tipoViaje: "playa", fechaSalida: "2027-01-15" },
    { id: "rio-de-janeiro", destino: "Río de Janeiro", precio: 610000, tipoViaje: "playa", fechaSalida: "2027-02-05" },
    { id: "buenos-aires", destino: "Buenos Aires", precio: 150000, tipoViaje: "ciudad", fechaSalida: "2026-11-28" }
]

// Criterios vacíos: igual a no tocar ningún filtro del formulario
const sinFiltros = { destino: "", fechaDesde: "", fechaHasta: "", precioMin: "", precioMax: "", tiposViaje: [] }

test("sin filtros devuelve todos los paquetes", () => {
    const resultado = filtrarPaquetes(paquetes, sinFiltros)
    assert.equal(resultado.length, 4)
})

test("filtra por tipo de viaje playa", () => {
    const resultado = filtrarPaquetes(paquetes, { ...sinFiltros, tiposViaje: ["playa"] })
    assert.deepEqual(resultado.map((p) => p.id), ["florianopolis", "rio-de-janeiro"])
})

test("filtra por destino aunque tenga tildes y espacios", () => {
    const resultado = filtrarPaquetes(paquetes, { ...sinFiltros, destino: "rio-de-janeiro" })
    assert.deepEqual(resultado.map((p) => p.id), ["rio-de-janeiro"])
})

test("filtra por rango de precios", () => {
    const resultado = filtrarPaquetes(paquetes, { ...sinFiltros, precioMin: "200000", precioMax: "600000" })
    assert.deepEqual(resultado.map((p) => p.id), ["bariloche", "florianopolis"])
})

test("filtra por rango de fechas", () => {
    const resultado = filtrarPaquetes(paquetes, { ...sinFiltros, fechaDesde: "2027-01-01", fechaHasta: "2027-01-31" })
    assert.deepEqual(resultado.map((p) => p.id), ["florianopolis"])
})

test("devuelve un arreglo vacío si nada coincide", () => {
    const resultado = filtrarPaquetes(paquetes, { ...sinFiltros, precioMax: "100000" })
    assert.equal(resultado.length, 0)
})

test("no modifica el arreglo original", () => {
    filtrarPaquetes(paquetes, { ...sinFiltros, tiposViaje: ["playa"] })
    assert.equal(paquetes.length, 4)
})
