// Pruebas unitarias de las validaciones del formulario (formulario.js)
import { test } from "node:test"
import assert from "node:assert/strict"
import { validarEmail, validarDni } from "../src/recursos/js/formulario.js"

// Las funciones devuelven "" si el dato es válido, o un mensaje de error si no lo es

test("validarEmail acepta un correo válido", () => {
    assert.equal(validarEmail("juan@correo.com"), "")
})

test("validarEmail rechaza un correo sin arroba", () => {
    assert.notEqual(validarEmail("juancorreo.com"), "")
})

test("validarEmail rechaza el campo vacío", () => {
    assert.equal(validarEmail("   "), "Ingresá tu correo electrónico.")
})

test("validarDni acepta 8 números, con o sin puntos", () => {
    assert.equal(validarDni("40123456"), "")
    assert.equal(validarDni("40.123.456"), "")
})

test("validarDni rechaza letras o una cantidad incorrecta de números", () => {
    assert.notEqual(validarDni("4012345A"), "")
    assert.notEqual(validarDni("12345"), "")
})
