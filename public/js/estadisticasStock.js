const $ = (el) => document.querySelector(el);

const sectionProductsTable = document.getElementById("tablaDeProductosenDB");
const sectionLastProyects = document.getElementById("lastProyects");
const productsInDb = document.getElementById("productos");
const talleresInDB = document.getElementById("talleres")
const proyectsDone = document.getElementById("proyectsDone");
const proyectsPending= document.getElementById("proyectsPending");
const countDelayedProyect = document.getElementById("demorados");
const countProductsInDB = document.getElementById("productsCount");

const tablaProyectosDemorados = document.getElementById("tablaDeProyectosDemorados")

/* const URL_API_SERVER= "https://test.encope.gob.ar" */

/* const endpointURL = "https://test.encope.gob.ar/api/cunas/"; */

const endpointURL = "https://test.encope.gob.ar/api/stock/";

const paintProductsInDB = fetch(`${endpointURL}getAllProducts`)
  .then((response) => response.json())
  .then((data) => {
    if (data.ok) {    
      
      sectionProductsTable.innerHTML = ""
      countProductsInDB.innerHTML = `${data.data.count}+`
      data.data.allProducts.forEach(item=> {
        const template = `
        <tr>
        <td data-label="Imagen"><img src="/images/productos/${item.imagen}" alt="image-product" style="width: 70px; height: 70px;" class="rounded-circle shadow-sm"></td>
        <td data-label="Nombre">${item.nombre}</td>
        <td data-label="Detalle">${item.detalle} </td>
        <td data-label="Unidad de medida">${item.unidadDeMedida} </td>
        <td data-label="Ficha Técnica" class="text-black"><a href="/images/fichas/${item.ficha}" target="_blank" class="btn btn-outline-success btn-sm">Ficha <i class="fa-solid fa-cloud-arrow-down"></i></a></td>
      </tr>
        
        `;
        sectionProductsTable.innerHTML += template
      })
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
      countDelayedProyect.innerHTML += `${data.data.count}+`

      data.data.proyectsDelayed.forEach(item=> {
        const template = `
        <tr>
        <td data-label="Nombre">${item.nombre}</td>
        <td data-label="Expediente">${item.expediente} </td>
        <td data-label="Procedencia">${item.procedencia}</td>
        <td data-label="Duración">${item.duracion} - ${item.unidadDuracion} </td>
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



  


 
