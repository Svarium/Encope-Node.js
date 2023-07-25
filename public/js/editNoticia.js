const $ = (id) => document.getElementById(id)

const msgError = (element, message, {target}) => {
    $(element).innerHTML = message
    target.classList.add('is-invalid')
}


const cleanError = (element, {target}) => {
    target.classList.remove('is-invalid')
    target.classList.remove('is-valid')
    $(element).innerHTML = null
}

const checkedFields = () => {
    const elements = $("formEditNoticia").elements;
    $("errorFormEditNoticia").innerHTML = null;
  
    for (let i = 0; i < elements.length - 2; i++) {
      if (elements[i].classList.contains("is-invalid")) {
        $("errorFormEditNoticia").innerHTML = "Hay campos con errores o están vacíos";
      }
    }
  };


  /* INPUT TITULO */

  $('titulo').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorTitulo', "El título es obligatorio", e)
            break;
        case this.value.trim().length < 2 || this.value.trim().length > 50 :
        msgError('errorTitulo', "Entre 2 y 50 caracteres",e)
        break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('titulo').addEventListener('focus', function(e) {
    cleanError('errorTitulo', e)
  })



  /* INPUT DESCRIPCION */

  $('descripcion').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorDescripcion', "La descripción es obligatoria", e)
            break;
        case this.value.trim().length < 2 || this.value.trim().length > 2000 :
        msgError('errorDescripcion', "Entre 2 y 2000 caracteres",e)
        break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('descripcion').addEventListener('focus', function(e) {
    cleanError('errorDescripcion', e)
  })





        /* CHEQUEO DE ERRORES */

        $('formEditNoticia').addEventListener('submit', function(e){
            e.preventDefault();
        
            let error = false
        
            for (let i = 0; i < this.elements.length -3; i++) {
                
                if(!this.elements[i].value.trim() || this.elements[i].classList.contains('errorInput')) {
                    error = true
                    this.elements[i].classList.add('is-invalid')
                    $('errorFormEditNoticia').innerHTML = "Hay campos vacíos o con errores!"
                }
                
            }
        
            if(!error){
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Noticia editada correctamente',
                showConfirmButton: false,
                timer: 2000
              })
              setTimeout(function() {
                $('formEditNoticia').submit();
              }, 2000); 
             }
        
          })