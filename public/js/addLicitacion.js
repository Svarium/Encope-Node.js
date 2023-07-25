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
    const elements = $("formAddLicitacion").elements;
    $("errorFormAddLicitacion").innerHTML = null;
  
    for (let i = 0; i < elements.length - 2; i++) {
      if (elements[i].classList.contains("is-invalid")) {
        $("errorFormAddLicitacion").innerHTML = "Hay campos con errores o están vacíos";
      }
    }
  };


  //expresiones regulares para comparar los campos

let regExLetter = /^[A-Z]+$/i;
let regExEmail =
  /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]:+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;
let regExPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/; //mayuscula, numero y 6 a 12 caracteres
let regExPass2 =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_-])[A-Za-z\d$@$!%*?&_-]{6,12}/;

/* INPUT EXPEDIENTE */

$('expediente').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorExpediente', "El expediente es obligatorio", e)
            break;
        case this.value.trim().length < 2 || this.value.trim().length > 40 :
        msgError('errorExpediente', "Entre 2 y 40 caracteres",e)
        break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('expediente').addEventListener('focus', function(e) {
    cleanError('errorExpediente', e)
  })

  /* INPUT NOMBRE */

  $('nombre').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorNombre', "El Nombre de la publicación es obligatorio", e)
            break;
        case this.value.trim().length < 2 || this.value.trim().length > 50 :
        msgError('errorNombre', "Entre 2 y 50 caracteres",e)
        break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('nombre').addEventListener('focus', function(e) {
    cleanError('errorNombre', e)
  })

  /* INPUT OBJETIVO */


 $('objetivo').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorObjetivo', "El objetivo es obligatorio", e)
            break;
        case this.value.trim().length < 2 || this.value.trim().length > 255 :
        msgError('errorObjetivo', "Entre 2 y 255 caracteres",e)
        break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('objetivo').addEventListener('focus', function(e) {
    cleanError('errorObjetivo', e)
  })

  /* INPUT ARCHIVO */

  const regExExt = /^.*\.pdf$/i;

    $('archivo').addEventListener('change', function(e){
      switch (true) {
          case !regExExt.exec(this.value):
              $('errorArchivo').innerHTML = "Solo se admiten archivos pdf"
              break;
          case this.isDefaultNamespace.length > 1 :   
          $('errorArchivo').innerHTML = "Solo una archivo por publicación"
          break
          default:
              this.classList.add('is-valid')
              checkedFields()
              break;
      }
    });
    $('archivo').addEventListener('focus', function(e) {
      cleanError('errorArchivo', e)
    })

    /* INPUT TIPO DE PUBLICACION */

    $('tipo').addEventListener('blur', function(e){
        switch (true) {
            case !this.value.trim():
                msgError('errorTipo', "El tipo es obligatorio", e)
                break;
            default:
                this.classList.add('is-valid')
                checkedFields()
                break;
        }
      });
    
      $('tipo').addEventListener('focus', function(e) {
        cleanError('errorTipo', e)
      })

      /* CHEQUEO DE ERRORES */

  $('formAddLicitacion').addEventListener('submit', function(e){
    e.preventDefault();

    let error = false

    for (let i = 0; i < this.elements.length -1; i++) {
        
        if(!this.elements[i].value.trim() || this.elements[i].classList.contains('errorInput')) {
            error = true
            this.elements[i].classList.add('is-invalid')
            $('errorFormAddLicitacion').innerHTML = "Hay campos vacíos o con errores!"
        }
        
    }

    if(!error){
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Publicación agregada correctamente!',
        showConfirmButton: false,
        timer: 2000
      })
      setTimeout(function() {
        $('formAddLicitacion').submit();
      }, 2000); 
     }

  })