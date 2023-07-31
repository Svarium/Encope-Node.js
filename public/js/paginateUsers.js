const $ = (el) => document.querySelector(el);

const btnPrev = $("#btn-prev-table");
const btnNext = $("#btn-next-table");
const containerItemPage = $("#container-items-page-table");
const userTable = $("#userTable");

let pageActive = 1;

const apiGetUsers = "https://encope.gob.ar/api/users/";
const getUsers = ({page=1} = {}) => {
    users = fetch(`${apiGetUsers}?page=${page}`).then((res)=> res.json())
    console.log(users);
    return users
    ;
};


const paintUsers = (users) => {
    console.log(users);
    userTable.innerHTML = "";
    users.forEach((user)=> {
        const template = `        
          <tr>
          <th scope="row">${user.name}</th>
          <td>${user.surname}</td>
          <td>${user.email}</td>
          <td>${user.rol.nombre}</td>
          <td> ${user.credencial? user.credencial : '-'} </td>
          <td>${user.destino ? user.destino.nombreDestino : '-'}</td>
          <td>
            <div class="d-flex">
              <form action="/users/rolUser/${user.id} ?_method=PUT" method="POST" id="formRolUser" class="row g-6">
                <input type="hidden" name="_method" value="PUT">
                <input type="hidden" name="userId" value="${user.id}">
               
              <div class="col-md-10">
                <label for="nuevo_rol" class="form-label">Nuevo rol:</label>
                <select name="nuevoRol" id="nuevoRol" class="form-select">
                  <option value="" selected hidden>Seleccione...</option>
                  <option value="1">SuperAdmin</option>
                  <option value="2">Admin</option>
                  <option value="3">Editor-Noticias</option>
                  <option value="4">Editor-Licitaciones</option>
                  <option value="5">Editor-Intranet</option>
                  <option value="6">Visitante</option>
                </select>
                <button type="submit" class="btn btn-primary mt-1">Actualizar</button>
              </div>               
            </form>    
            </div>
      </td>
        </tr>       
      
        `;
        userTable.innerHTML += template       
    });
}


const getPage = async (page) => {
    pageActive = page
    const {
        data:{ pages, currentPage, users},
            } = await getUsers({page});

        paintUsers(users)    
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


window.addEventListener("load", async () => {

    try {
        const {
        data:{ pages, currentPage, users},
            } = await getUsers()

        console.log(users);    

      paintUsers(users)    
      paintItemsPage({numberPages: pages, itemActive: currentPage})  
      statusPrevAndNext({currentPage, pages})
      $('#formRolUser').addEventListener('submit', function(event) {
        if (event.submitter && event.submitter.type === 'submit') {
            location.reload
        }
      })
     
      

    } catch (error) {
        console.log(error);
    }
})


btnNext.addEventListener('click', async () => {
    try {
        const {
            data:{ pages, currentPage, users}} = await getLibros({page : ++pageActive});
                paintUsers(users)    
                paintItemsPage({numberPages: pages, itemActive: currentPage})  
                statusPrevAndNext({currentPage, pages})

    } catch (error) {
        console.log(error);
    }
})

