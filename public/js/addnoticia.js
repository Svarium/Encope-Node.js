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
    const elements = $("formAddNoticia").elements;
    $("errorFormAddNoticia").innerHTML = null;
  
    for (let i = 0; i < elements.length - 2; i++) {
      if (elements[i].classList.contains("is-invalid")) {
        $("errorFormAddNoticia").innerHTML = "Hay campos con errores o están vacíos";
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


  /* INPUT IMAGENES */

  const imageRegex = /\.(jpg|jpeg|png|gif|webp)$/i;
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  
  $('images').addEventListener('change', function(e){
    const files = this.files;
    const errors = [];
    
    if (files.length > 4) {
      errors.push('Solo se pueden subir hasta 4 imágenes');
    }
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!imageRegex.test(file.name)) {
        errors.push("El archivo " + file.name + " no es una imagen válida");
        continue;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        errors.push("El archivo " + file.name + " es demasiado grande (máximo permitido: 2MB)");
        continue;
      }
      
      this.classList.add('is-valid');
      checkedFields();
    }
    
    if (errors.length > 0) {
      $('errorImages').innerHTML = errors.join("<br>");
      this.value = "";
    } else {
      $('errorImages').innerHTML = "";
    }
  });
  
  $('images').addEventListener('focus', function(e) {
    cleanError('errorImages', e);
  });

        /* CHEQUEO DE ERRORES */

        $('formAddNoticia').addEventListener('submit', function(e){
            e.preventDefault();
        
            let error = false
        
            for (let i = 0; i < this.elements.length -2; i++) {
                
                if(!this.elements[i].value.trim() || this.elements[i].classList.contains('errorInput')) {
                    error = true
                    this.elements[i].classList.add('is-invalid')
                    $('errorFormAddNoticia').innerHTML = "Hay campos vacíos o con errores!"
                }
                
            }
        
           /*  !error && this.submit() */

           if(!error){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Noticia agregada correctamente',
              showConfirmButton: false,
              timer: 2000
            })
            setTimeout(function() {
              $('formAddNoticia').submit();
            }, 2000); 
           }
        
          })