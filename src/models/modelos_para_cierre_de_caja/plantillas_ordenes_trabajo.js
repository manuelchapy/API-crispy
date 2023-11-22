const metodos_pago_efectivo_ordenes_trabajo = {
    dolares:                 0,
    pesos:                   0,
    bolivares:               0,
}

const metodos_pago_transferencia_ordenes_trabajo = {
    dolares:                 0,
    pesos:                   0,
    bolivares:               0,
}

const metodos_pago_pago_movil_ordenes_trabajo = {
    dolares:                 0,
    pesos:                   0,
    bolivares:               0,
}

const metodos_pago_zelle_ordenes_trabajo = {
    dolares:                 0,
    pesos:                   0,
    bolivares:               0,
}

const metodos_pago_bancolombia_ordenes_trabajo = {
    dolares:                 0,
    pesos:                   0,
    bolivares:               0,
}

const metodos_pago_binance_ordenes_trabajo = {
    dolares:                 0,
    pesos:                   0,
    bolivares:               0,
}

const metodos_pago_tarjeta_credito_ordenes_trabajo = {
    dolares:                 0,
    pesos:                   0,
    bolivares:               0,
}

const metodos_pago_tarjeta_debito_ordenes_trabajo = {
    dolares:                 0,
    pesos:                   0,
    bolivares:               0,
}

const totales_pagos_ordenes_trabajo = {
    dolares:                 0,
    pesos:                   0,
    bolivares:               0,
}

const cantidad_ordenes_trabajo = {
    cantidad: 0,
    primera_orden_trabajo: 0,
    ultima_orden_trabajo: 0
}

const cantidad_ordenes_trabajo_anuladas = {
    cantidad: 0
}

const cantidad_ordenes_trabajo_credito = {
    cantidad: 0,
    primera_orden_trabajo: {},
    ultima_orden_trabajo: {}
}

const totales_debe_ordenes_trabajo_credito = {
    dolares:                 0,
    pesos:                   0,
    bolivares:               0,
}

const lista_ordenes_trabajo_credito = [];
const cantidad_items     = [];
const pagos_zelle        = [];
const pagos_bancolombia  = [];
const pagos_pago_movil   = [];
const pagos_binance      = [];
const ordenes_anuladas = [];

const balance_ordenes_trabajo = {
    metodos_pago_efectivo_ordenes_trabajo,
    metodos_pago_transferencia_ordenes_trabajo,
    metodos_pago_pago_movil_ordenes_trabajo,
    metodos_pago_zelle_ordenes_trabajo,
    metodos_pago_bancolombia_ordenes_trabajo,
    metodos_pago_binance_ordenes_trabajo,
    metodos_pago_tarjeta_credito_ordenes_trabajo,
    metodos_pago_tarjeta_debito_ordenes_trabajo,
    totales_pagos_ordenes_trabajo,
    cantidad_ordenes_trabajo,
    cantidad_ordenes_trabajo_anuladas,
    ordenes_anuladas,
    cantidad_items,
    cantidad_ordenes_trabajo_credito,
    totales_debe_ordenes_trabajo_credito,
    lista_ordenes_trabajo_credito,
    pagos_zelle,
    pagos_bancolombia,
    pagos_pago_movil,
    pagos_binance
}

module.exports = {    metodos_pago_efectivo_ordenes_trabajo,
                      metodos_pago_transferencia_ordenes_trabajo,
                      metodos_pago_pago_movil_ordenes_trabajo,
                      metodos_pago_zelle_ordenes_trabajo,
                      metodos_pago_bancolombia_ordenes_trabajo,
                      metodos_pago_binance_ordenes_trabajo,
                      metodos_pago_tarjeta_credito_ordenes_trabajo,
                      metodos_pago_tarjeta_debito_ordenes_trabajo,
                      cantidad_ordenes_trabajo,
                      cantidad_ordenes_trabajo_anuladas,
                      ordenes_anuladas,
                      totales_pagos_ordenes_trabajo,
                      cantidad_items,
                      cantidad_ordenes_trabajo_credito,
                      totales_debe_ordenes_trabajo_credito,
                      lista_ordenes_trabajo_credito,
                      balance_ordenes_trabajo
                };