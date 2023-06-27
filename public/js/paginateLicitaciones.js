const $ = (el) => document.querySelector(el);

const btnPrev = $("#btn-prev-table");
const btnNext = $("#btn-next-table");
const containerItemPage = $("#container-items-page-table-publicas");
const publicasTable = $("#publicasTable");
const botonPublicas = $('#licitacionPublica')


let pageActive = 1;

const apiGetLicitacion = "http://localhost:3000/api/licitacion";
const getLicitacion = ({page=1} = {}) => {

    licitacion = fetch(`${apiGetLicitacion}?page=${page}`).then((res)=> 
    res.json())
    console.log(licitacion);
    return licitacion
};


const paintPublicas = (licitacion) => {
    publicasTable.innerHTML = "";
    let publicas = licitacion.filter(licita => licita.tipo.nombre === "Licitación Pública")
    publicas.forEach(publica => {
        const template = `
            <tr>
                <td data-label="Nombre">${publica.titulo}</td>
                <td data-label="detalle"> ${publica.objetivo} </td>
                <td data-label="fecha"> ${publica.createdAt} </td>
                <td data-label="Expediente"> ${publica.expediente} </td>
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

        paintPublicas(licitacion)    
        paintItemsPage({numberPages: pages, itemActive: currentPage})  
        statusPrevAndNext({currentPage, pages})
}

const paintItemsPage = ({numberPages, itemActive}) => {
    containerItemPage.innerHTML = ''
    for (let i = 1; i <= numberPages; i++) {
        containerItemPage.innerHTML += `
       <li class="page-item ${itemActive === i && 'active'}">
       <a class="page-link" href="#" onclick="getPage(${i})">${i}</a></li>`
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



botonPublicas.addEventListener("click", async () => {

    try {
        const {
        data:{ pages, currentPage, licitacion},
            } = await getLicitacion()

        console.log(licitacion);  
        
        paintPublicas(licitacion)

     
      paintItemsPage({numberPages: pages, itemActive: currentPage})  
      statusPrevAndNext({currentPage, pages}) 

    } catch (error) {
        console.log(error);
    }
})


btnNext.addEventListener('click', async () => {
    try {
        const {
            data:{ pages, currentPage, licitacion}} = await getLibros({page : ++pageActive});
                paintPublicas(licitacion)    
                paintItemsPage({numberPages: pages, itemActive: currentPage})  
                statusPrevAndNext({currentPage, pages})

    } catch (error) {
        console.log(error);
    }
})

btnNext.addEventListener('click', async () => {
    try {
        const {
            data:{ pages, currentPage, licitacion}} = await getLibros({page : ++pageActive});
                paintPublicas(licitacion)    
                paintItemsPage({numberPages: pages, itemActive: currentPage})  
                statusPrevAndNext({currentPage, pages})

    } catch (error) {
        console.log(error);
    }
})