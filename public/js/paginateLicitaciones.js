const $ = (el) => document.querySelector(el);

const btnPrev = $("#btn-prev-table-licitacion");
const btnNext = $("#btn-next-table-licitacion");
const containerItemPage = $("#container-items-page-table-publicas");
const publicasTable = $("#licitacionTable");
const botonPublicas = $('#licitacionPublica')


let pageActive = 1;

const apiGetLicitacion = "http://localhost:3000/api/licitacion";
const getLicitacion = ({page=1} = {}) => {

    licitacion = fetch(`${apiGetLicitacion}?page=${page}`).then((res)=> 
    res.json())
    return licitacion
};


const paintLicitaciones = (licitacion) => {
    publicasTable.innerHTML = "";
    licitacion.forEach(publica => {
        const template = `
            <tr>
                <td data-label="Nombre">${publica.tipo.nombre}</td>
                <td data-label="Nombre">${publica.titulo}</td>
                <td data-label="detalle"> ${publica.objetivo} </td>
                <td data-label="fecha"> ${publica.createdAt} </td>
                <td data-label="descargar" class="boton-descarga"><a href="/images/licitaciones/ ${publica.archivo} " download="licitacionPublica"> <i class="fa-sharp fa-solid fa-cloud-arrow-down"></i></a><br><br>                 
                </td>
            </tr> 
        `
        publicasTable.innerHTML += template
    });
  
}


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