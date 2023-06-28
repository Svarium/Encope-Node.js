const $ = (el) => document.querySelector(el);

const btnPrev = $("#btn-prev-table-licitacion-admin");
const btnNext = $("#btn-next-table-licitacion-admin");
const containerItemPage = $("#container-items-page-table-licitacion-admin");
const licitacionesTable = $("#tabla-admin-licitaciones");


let pageActive = 1;

//const apiGetLicitacion = "https://encope.wnpower.host/api/licitacion/";

const apiGetLicitacion = "http://localhost:3000/api/licitacion/";

const getLicitacion = ({page=1} = {}) => {

    licitacion = fetch(`${apiGetLicitacion}?page=${page}`).then((res)=> 
    res.json())
    return licitacion
};

const paintLicitaciones = (licitacion) => {
    licitacionesTable.innerHTML = "";
    licitacion.forEach(publicacion => {
        const template = `
        <tbody>
       
        <tr>
        <th scope="row">${publicacion.tipo.nombre}</th>
        <td>${publicacion.titulo}</td>
        <td>$ ${publicacion.objetivo}</td>
        <td>${publicacion.createdAt}</td>
        <td>${publicacion.expediente}</td>
        <td>
            <div class="d-flex justify-content-center gap-2"> 
                <a class="btn  btn-primary" href="/images/licitaciones/${publicacion.archivo}"><i class="fa-solid fa-eye"></i></a>
                <a class="btn  btn-success" href="/licitacion/editar/${publicacion.id}"><i class="fa-solid fa-edit"></i></a>              
          <div class="boton-modal detalle-comprar">
              <label class="btn btn-sm btn-success" for="btn-modal" style="background-color: rgb(199, 54, 66);">
                <i class="fa-solid fa-trash"></i>
              </label>
          </div>          
            </div>
    </td>
      </tr>        
   <input type="checkbox" id="btn-modal">
   <div class="container-modal">
       <div class="content-modal">
           <h2>¡ATENCION!</h2>
           <p>¿Estas seguro de que deseas eliminar esta publicación?</p>
           <div class="btn-cerrar">
             <div>
               <button onclick="removelicitacion(${publicacion.id})">ELIMINAR <i class="fa-solid fa-trash"></i></button>
             </div> 
               <label for="btn-modal">CANCELAR</label>
           </div>
       </div>
       <label for="btn-modal" class="cerrar-modal"></label>
   </div>
   </input>
    </tbody>
          
        `
        licitacionesTable.innerHTML += template
    });
  
}


const removeLicitacion = async (id) => {
    const { ok } = await fetch(`${apiGetLicitacion}/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
    if (ok) {
      const {
        data: { pages, currentPage, licitacion },
      } = await getLicitacion({ page: pageActive });
  
      paintLicitaciones(licitacion);
      paintItemsPage({ numberPages: pages, itemActive: currentPage });
      statusPrevAndNext({ currentPage, pages });
    }
  };
  

const getPage = async (page) => {
    pageActive = page
    const {
        data:{ pages, currentPage, licitacion},
            } = await getLicitacion({page});

        paintLicitaciones(licitacion)    
        paintItemsPage({numberPages: pages, itemActive: currentPage})  
        statusPrevAndNext({currentPage, pages})
}

const paintItemsPage = ({numberPages, itemActive}) => {
    containerItemPage.innerHTML = ''
    for (let i = 1; i <= numberPages; i++) {
        containerItemPage.innerHTML += `
       <li class="page-item ${itemActive === i && 'active'}">
       <a class="page-link"  onclick="getPage(${i})" style="cursor: pointer;">${i}</a></li>`
        }
}

const statusPrevAndNext = ({currentPage, pages}) => {
    if(currentPage === pages){
        btnNext.hidden = true;
    }else{
        btnNext.hidden = false;
    }

    if(currentPage === 1){
        btnPrev.hidden = true;
    }else{
        btnPrev.hidden = false;
    }
}



window.addEventListener("load", async () => {

    try {
        const {
        data:{ pages, currentPage, licitacion},
            } = await getLicitacion()
              
      paintLicitaciones(licitacion)
      paintItemsPage({numberPages: pages, itemActive: currentPage})  
      statusPrevAndNext({currentPage, pages}) 

    } catch (error) {
        console.log(error);
    }
})


btnNext.addEventListener('click', async () => {
    try {
        const {
            data:{ pages, currentPage, licitacion}} = await getLicitacion({page : ++pageActive});
                paintLicitaciones(licitacion)    
                paintItemsPage({numberPages: pages, itemActive: currentPage})  
                statusPrevAndNext({currentPage, pages})

    } catch (error) {
        console.log(error);
    }
})

btnPrev.addEventListener('click', async () => {
    try {
        const {
            data:{ pages, currentPage, licitacion}} = await getLicitacion({page : --pageActive});
                paintLicitaciones(licitacion)    
                paintItemsPage({numberPages: pages, itemActive: currentPage})  
                statusPrevAndNext({currentPage, pages})

    } catch (error) {
        console.log(error);
    }
})