const obtenerUltimosRetiros = (idDestino) => {
  return fetch(`http://localhost:3000/api/cunas/ultimosRetiros/${idDestino}`)
    .then((res) => res.json())
    .then((retiros) => {
      /*  console.log(retiros.retirosEnDestino.pop()); */

      const ultimoRetiro = retiros.retirosEnDestino.pop();
      const fechaActual = new Date();
      const fechaRetiro = new Date(ultimoRetiro.createdAt);
      // Calcula la diferencia en milisegundos
      const diferenciaEnMilisegundos = fechaActual - fechaRetiro;
      // Convierte la diferencia a horas
      const diferenciaEnHoras = diferenciaEnMilisegundos / (1000 * 60 * 60);
      // Comprueba si la diferencia es menor a 24 horas
      if (diferenciaEnHoras < 24) {
        Swal.fire({
            title: '<strong>¡Hay nuevos retiros de stock!</strong>',
            icon: 'info',
            html:
              `${ultimoRetiro.cantidadRetirada} - ${ultimoRetiro.producto.nombre} en fecha ${fechaRetiro}`,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
              '<i class="fa fa-thumbs-up"></i>',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            cancelButtonText:
              '<i class="fa fa-thumbs-down"></i>',
            cancelButtonAriaLabel: 'Thumbs down'
          })
      } else {
        Swal.fire("No hay nuevos retiros!");
      }
    })
    .catch((error) => console.log(error));
};
