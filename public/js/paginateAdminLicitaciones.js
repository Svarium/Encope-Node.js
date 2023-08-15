const $ = (el) => document.querySelector(el);

const btnPrev = $("#btn-prev-table-licitacion-admin");
const btnNext = $("#btn-next-table-licitacion-admin");
const containerItemPage = $("#container-items-page-table-licitacion-admin");
const licitacionesTable = $("#tabla-admin-licitaciones");


let pageActive = 1;

/* const apiGetLicitacion = "https://encope.gob.ar/api/licitacion/"; */
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
       
        <tr>
        <th scope="row">${publicacion.tipo.nombre}</th>
        <td>${publicacion.titulo}</td>
        <td>${publicacion.objetivo}</td>
        <td data-label="fecha">${new Intl.DateTimeFormat('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZone: 'America/Argentina/Buenos_Aires'
          }).format(new Date(publicacion.createdAt))}</td>
        <td>${publicacion.expediente}</td>
        <td>
            <div class="d-flex justify-content-center gap-2"> 
                <a class="btn  btn-primary" href="/images/licitaciones/${publicacion.archivo}">Ver</a>
                <a class="btn  btn-success" href="/licitacion/editar/${publicacion.id}">Editar</i></a>              
          <div class="boton-modal detalle-comprar">
          <button class="btn btn-danger btn-sm" onclick="removeLicitacion(${publicacion.id})">ELIMINAR <i class="fa-solid fa-trash"></i></button>
          </div>          
            </div>
    </td>
      </tr>     
        `
        licitacionesTable.innerHTML += template
    });
  
}


const removeLicitacion = async (id) => {

    Swal.fire({
        title: 'Seguro quieres eliminar esta publicación?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrar!'
      }).then((result) => {
        if (result.isConfirmed) {
            const { ok } =  fetch(`${apiGetLicitacion}/${id}`, {
                method: "DELETE",
              }).then((res) => res.json());
              if (ok) {
                const {
                  data: { pages, currentPage, licitacion },
                } = getLicitacion({ page: pageActive });
            
                paintLicitaciones(licitacion);
                paintItemsPage({ numberPages: pages, itemActive: currentPage });
                statusPrevAndNext({ currentPage, pages });
              }      

          Swal.fire(
            'Eliminada!',
            'La publicación se eliminó correctamente',
            'success'
          )
          location.reload();
        }
      })


    
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