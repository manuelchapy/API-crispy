let time = new Date(new Date().toLocaleString("en-US", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
}));

let year, month, day, hour, minute, second;
year = time.getFullYear();
month = time.getMonth() + 1;
day = time.getDate();
hour = time.getHours();
minute = time.getMinutes();
second = time.getSeconds();

let servicios = {
    time: new Date(new Date().toLocaleString("en-US", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    })),
    formatTime: year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second,
    logrado: "1",
    factura_fallida: "operacion fallida, intente de nuevo",
    date_format_left: "DATE_FORMAT(",
    date_format_right: ", '%Y-%m-%d %T') AS",
    anular_item_pedido: "5992b",
    anular_factura: "5992a"
}

  

module.exports = servicios;