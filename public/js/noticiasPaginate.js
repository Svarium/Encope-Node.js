const $ = (el) => document.querySelector(el)

const btnPrev = $('#btn-prev-card-noticia')
const btnNext = $('#btn-next-card-noticia')
const containerItemPage = $('#container-items-page-card-noticia')
const sectionNoticiaCard = $('#section-noticias-card')

const URL_API_SERVER= "http://localhost:3000"

/* const URL_API_SERVER= "CAMBIAR A LA DIRECCION DE VNPOWER" */

let pageActive=1;

const apiGetNoticias = `${URL_API_SERVER}/api/noticias`
const getNoticias = ({page=1} = {}) => {
    return fetch(`${apiGetNoticias}?page=${page}`).then(res => res.json())
}

const paintNoticias = (noticia) => {

    sectionNoticiaCard.innerHTML = '';

    noticia.forEach(noti => {
        const template = `        
        <div class="card ms-3 mb-3" style="width: 18rem;">
        <img src="/images/imagesNoticias/${noti.images[0].name}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${noti.titulo}</h5>
          <p class="card-text">${noti.descripcion.slice(0,100)}...</p>
          <a href="/noticias/detalle/${noti.id}" class="btn btn-primary">Leer más</a>
        </div>
      </div>      
        `;
        sectionNoticiaCard.innerHTML += template
    });
}

const getPage = async (page) => {
    pageActive = page
    const {
        data:{ pages, currentPage, noticia},
            } = await getNoticias({page});

        paintNoticias(noticia)    
        paintItemsPage({numberPages: pages, itemActive: currentPage})  
        statusPrevAndNext({currentPage, pages})
}

const paintItemsPage = ({numberPages, itemActive}) => {
    containerItemPage.innerHTML = ''
    for (let i = 1; i <= numberPages; i++) {
        containerItemPage.innerHTML += `
       <li class="page-item ${itemActive === i && 'active'}">
       <a class="page-link" href="#" onclick="getPage(${i})">${i}</a></li>
       `
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

btnNext.addEventListener('click', async () => {
    try {
        const {
            data:{ pages, currentPage, noticia}} = await getNoticias({page : ++pageActive});
                paintNoticias(noticia)    
                paintItemsPage({numberPages: pages, itemActive: currentPage})  
                statusPrevAndNext({currentPage, pages})

    } catch (error) {
        console.log(error);
    }
})

btnPrev.addEventListener('click', async () => {
    try {
        const {
            data:{ pages, currentPage, noticia}} = await getNoticias({page : --pageActive});
                paintNoticias(noticia)    
                paintItemsPage({numberPages: pages, itemActive: currentPage})  
                statusPrevAndNext({currentPage, pages})

    } catch (error) {
        console.log(error);
    }
})




window.addEventListener("load", async () => {

    try {
        const {
        data:{ pages, currentPage, noticia},
            } = await getNoticias()

        console.log(noticia);    

      paintNoticias(noticia)    
      paintItemsPage({numberPages: pages, itemActive: currentPage})  
      statusPrevAndNext({currentPage, pages})

    } catch (error) {
        console.log(error);
    }
})


