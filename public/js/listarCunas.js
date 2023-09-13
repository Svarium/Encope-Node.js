window.addEventListener("load", async () => {     
Swal.fire('Ahora puedes revisar los últimos retiros de stock realizados')
const botonRetiros = document.getElementById("botonRetiros");
    if (botonRetiros) {
      botonRetiros.classList.add("blinking-button");
    }
})

const obtenerUltimosRetiros = (idDestino) => {

    return fetch(`https://encope.gob.ar/api/cunas/ultimosRetiros/${idDestino}`)
      .then((res) => res.json())
      .then((retiros) => {    

       const botonRetiros = document.getElementById("botonRetiros");
    if (botonRetiros) {
      botonRetiros.classList.remove("blinking-button");
    }
       
          const tabla = document.createElement('table');
          tabla.classList.add('table');
  
          const thead = document.createElement('thead');
          const trHead = document.createElement('tr');
          const thCantidad = document.createElement('th');
          thCantidad.textContent = 'Cantidad';
          const thProducto = document.createElement('th');
          thProducto.textContent = 'Producto';
          const thFecha = document.createElement('th');
          thFecha.textContent = 'Fecha';
  
          trHead.appendChild(thCantidad);
          trHead.appendChild(thProducto);
          trHead.appendChild(thFecha);
          thead.appendChild(trHead);
          tabla.appendChild(thead);
  
          const tbody = document.createElement('tbody');
          retiros.retirosEnDestino.forEach((retiro) => {

            const fecha = new Intl.DateTimeFormat('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZone: 'America/Argentina/Buenos_Aires'
              }).format(new Date(retiro.createdAt))
           
            const tr = document.createElement('tr');
            const tdCantidad = document.createElement('td');
            tdCantidad.textContent = retiro.cantidadRetirada;
            const tdProducto = document.createElement('td');
            tdProducto.textContent = retiro.producto.nombre;
            const tdFecha = document.createElement('td');
            tdFecha.textContent = fecha;
  
            tr.appendChild(tdCantidad);
            tr.appendChild(tdProducto);
            tr.appendChild(tdFecha);
            tbody.appendChild(tr);
          });
  
          tabla.appendChild(tbody);
  
          Swal.fire({
            title: '<strong>¡Hay nuevos retiros de stock!</strong>',
            icon: 'info',
            html: tabla.outerHTML,
            showCloseButton: true,
            focusConfirm: false,
          });      
        
      })
      .catch((error) => console.log(error));
  };