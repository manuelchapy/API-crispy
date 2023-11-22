const modeloFactura = {
    numero_factura:                     Number,
    id_cliente:                         Number,
    total_bolivares:                    Number,
    total_dolares:                      Number,
    total_pesos:                        Number,
    descuento_bolivares:                Number,
    descuento_dolares:                  Number,
    descuento_pesos:                    Number,
    tasa_bolivar_dia:                   Number,
    tasa_pesos_dia:                     Number,
    IGTF_bolivares:                     Number,
    IGTF_dolares:                       Number, 
    IGTF_pesos:                         Number,
    base_imponible_bolivares:           Number,
    base_imponible_dolares:             Number,
    debe_dolares:                       Number,
    id_tipo_factura:                    Number,
    id_usuario:                         Number,
    id_estado_factura:                  Number,
    fecha_creacion_orden_trabajo:       String,
    fecha_creacion_factura:             String,
    fecha_cancelacion:                  String,
    impreso:                            Number,
    factura_qr:                         Number
}

module.exports = modeloFactura;