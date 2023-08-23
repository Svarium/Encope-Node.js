const $ = (el) => document.querySelector(el);

const sectionKits = document.getElementById("kits");
const sectionStocks = document.getElementById("stocksPorDestino");
const productsInDb = document.getElementById("productos");
const editoresIndb = document.getElementById("editores");

/* const URL_API_SERVER= "https://encope.gob.ar" */

const endpointURL = "http://localhost:3000/api/cunas/";

const paintKitsDone = fetch(`${endpointURL}/kits`)
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


  const paintStockDestinos = fetch(`${endpointURL}/stocks`)
  .then((response) => response.json())
  .then((data) => {
    if(data.ok){

        data.data.stocks.forEach(stock => {
            const template = `
                             <div class="col-lg-4 mb-3">
                            <div class="card bg-dark text-white shadow">
                            <div class="card-body text-center p-2">
                              <small><strong>${stock.producto.nombre.toUpperCase()}: ${stock.cantidad}</strong></small>                            
                        </div>
                            </div>
                                </div>
            
            `;    
            sectionStocks.innerHTML += template
                    });     

    }
  });

  const paintProductosInDb = fetch(`${endpointURL}/productos`)
  .then((response) => response.json())
  .then((data) => {
    if(data.ok){

      productsInDb.innerHTML +=  `
      <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Productos en Base de Datos</div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">${data.total}</div>
      `
     
    }
  });

  const paintEditores = fetch(`${endpointURL}/editores`)
  .then((response) => response.json())
  .then((data) => {
    if(data.ok){
      editoresIndb.innerHTML += `
      <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Usuarios Editores
											</div>
											<div class="h5 mb-0 font-weight-bold text-gray-800">${data.total}</div>
      `
    }
  })



  


 
