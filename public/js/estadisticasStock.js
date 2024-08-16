const $ = (el) => document.querySelector(el);

const sectionKits = document.getElementById("kits");
const sectionLastProyects = document.getElementById("lastProyects");
const productsInDb = document.getElementById("productos");
const talleresInDB = document.getElementById("talleres")
const proyectsDone = document.getElementById("proyectsDone");
const proyectsPending= document.getElementById("proyectsPending");
const countDelayedProyect = document.getElementById("demorados");

const tablaProyectosDemorados = document.getElementById("tablaDeProyectosDemorados")

/* const URL_API_SERVER= "https://encope.gob.ar" */

/* const endpointURL = "https://encope.gob.ar/api/cunas/"; */

const endpointURL = "http://localhost:3000/api/stock/";

const paintKitsDone = fetch(`${endpointURL}kits`)
  .then((response) => response.json())
  .then((data) => {
    if (data.ok) {
      const template = `
      <!-- Modal -->
<div class="modal fade" id="kitsTerminados" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div class="card-header py-3">
      <h5 class="m-0 font-weight-bold text-gray-800">Kits terminados</h5>
      </div>
      <div class="card-body">
      <div class="text-center">
      <img class="img-fluid px-3 px-sm-4 mt-3 mb-4 shadow " style="width: 100%;" src="/images/cunitas/kit.webp" alt="">
                    </div>
                    <p>Total de kits terminados y en stock en el CPFII. El kit consta de.... </p>
                    <small>
                    Última actualización:
                      <strong>${new Intl.DateTimeFormat('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        timeZone: 'America/Argentina/Buenos_Aires'
                      }).format(new Date(data.data.data[0].updatedAt))}
                      </strong>
                    </small>
                    <a class="btn btn-danger mt-2" target="_blank" rel="nofollow" href="#"><strong>${data.data.data[0].cantidad}</strong> Kits terminados</a>
                  </div>
                </div>
      </div>
    </div>
  </div>
</div>
     
      `;
      sectionKits.innerHTML += template
    }
  });


  const paintLastProyects = fetch(`${endpointURL}/getLastProyects`)
  .then((response) => response.json())
  .then((data) => {
    if(data.ok){
      console.log(data.data.proyects);

        data.data.proyects.forEach(proyect => {
            const template = `
                             <div class="col-lg-3 mb-3">
                            <div class="card bg-dark text-white shadow">
                            <div class="card-body  p-2">
                              <small>${proyect.nombre.toUpperCase()}: <strong>${proyect.expediente}</strong></small>                            
                        </div>
                            </div>
                                </div>            
            `;    
            sectionLastProyects.innerHTML += template
                    });     

    }
  });

  const paintProductosInDb = fetch(`${endpointURL}/getProducts`)
  .then((response) => response.json())
  .then((data) => {
        if(data.ok){
       
      productsInDb.innerHTML +=  `
      <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Productos en Base de Datos</div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">${data.data.productsInDB}</div>
      `
     
    }
  });


  const paintTallersInDb = fetch(`${endpointURL}/getTalleres`)
  .then((response) => response.json())
  .then((data) => {
        if(data.ok){

      talleresInDB.innerHTML +=  `
      <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Talleres funcionando</div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">${data.data.tallersInDB}</div>
      `
     
    }
  });

  const paintProyectsDone = fetch(`${endpointURL}/getProyectsDone`)
  .then((response) => response.json())
  .then((data) => {
    if(data.ok){
      proyectsDone.innerHTML += `
      <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Proyectos Finalizados
											</div>
											<div class="h5 mb-0 font-weight-bold text-gray-800">${data.data.proyectsDone}</div>
      `
    }
  })

  const paintProyectsPending = fetch(`${endpointURL}/getProyectsInProgress`)
  .then((response) => response.json())
  .then((data) => {
    if(data.ok){
      proyectsPending.innerHTML += `
      <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Proyectos en proceso
											</div>
											<div class="h5 mb-0 font-weight-bold text-gray-800">${data.data.proyectsPending}</div>
      `
    }
  })


  const paintTableProyectsDelayed = fetch(`${endpointURL}/getProyectsDelayed`)
  .then((response) => response.json())
  .then((data) => {
    if(data.ok){
      console.log(data.data.count);
      
      tablaProyectosDemorados.innerHTML = ""
      countDelayedProyect.innerHTML += `${data.data.count} +`

      data.data.proyectsDelayed.forEach(item=> {
        const template = `
        <tr>
        <td data-label="Destino">${item.nombre}</td>
        <td data-label="Producto">${item.expediente} </td>
        <td data-label="Stock">${item.procedencia}</td>
        <td data-label="Stock">${item.duracion} - ${item.unidadDuracion} </td>
        <td data-label="Creado" class="text-black"> ${new Intl.DateTimeFormat('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZone: 'America/Argentina/Buenos_Aires'
        }).format(new Date(item.createdAt))} </td>
        <td data-label="Actualizado">${new Intl.DateTimeFormat('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZone: 'America/Argentina/Buenos_Aires'
        }).format(new Date(item.updatedAt))}</td>
      </tr>
        
        `;
        tablaProyectosDemorados.innerHTML += template
      })

    

    }
  })



  


 
