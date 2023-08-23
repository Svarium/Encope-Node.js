const $ = (el) => document.querySelector(el);

const sectionKits = document.getElementById("kits");
const sectionStocks = document.getElementById("stocksPorDestino");

/* const URL_API_SERVER= "https://encope.gob.ar" */

const endpoitURL = "http://localhost:3000/api/cunas/";

const paintKitsDone = fetch(`${endpoitURL}/kits`)
  .then((response) => response.json())
  .then((data) => {
    if (data.ok) {
      const template = `
      <div class="card-header py-3">
	  <h5 class="m-0 font-weight-bold text-gray-800">Kits terminados</h5>
	  </div>
	  <div class="card-body">
	  <div class="text-center">
		<img class="img-fluid px-3 px-sm-4 mt-3 mb-4 " style="width: 100%;" src="/images/cunitas/kit.webp" alt=" Star Wars - Mandalorian">
									</div>
									<p>Total de kits terminados y en stock en el CPFII:</p>
									<a class="btn btn-danger" target="_blank" rel="nofollow" href="/"><strong>${data.data.data[0].cantidad}</strong> Kits terminados</a>
								</div>
							</div>
      `;
      sectionKits.innerHTML += template
    }
  });


  const paintStockDestinos = fetch(`${endpoitURL}/stocks`)
  .then((response) => response.json())
  .then((data) => {
    if(data.ok){

        data.data.stocks.forEach(stock => {
            const template = `
                             <div class="col-lg-6 mb-4">
                            <div class="card bg-dark text-white shadow">
                            <div class="card-body">
                              <p>${stock.usuario.destino.nombreDestino}</p>
                              <small>Total de ${stock.producto.nombre}: ${stock.cantidad}</small>
                        </div>
                            </div>
                                </div>
            
            `;
    
            sectionStocks.innerHTML += template
            
        });

      

    }
  });
