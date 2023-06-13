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
    const elements = $("formRegister").elements;
    $("errorForm").innerHTML = null;
  
    for (let i = 0; i < elements.length - 2; i++) {
      if (elements[i].classList.contains("is-invalid")) {
        $("errorForm").innerHTML = "Hay campos con errores o están vacíos!";
      }
    }
  };

  const verifyEmail = async (email) => {
    try {
      let response = await fetch("http://localhost:3000/api/users/verify-email", {
        method: "POST",
        body: JSON.stringify({
          email:email
        }),
        headers: {
          "Content-Type" : "application/json"
        }
        });
  
        let result = await response.json();
        console.log(result);
        return result.data.existUser
    } catch (error) {
      console.error
    }
  }

//expresiones regulares para comparar los campos

let regExLetter = /^[A-Z]+$/i;
let regExEmail =
  /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]:+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;
let regExPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/; //mayuscula, numero y 6 a 12 caracteres
let regExPass2 =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_-])[A-Za-z\d$@$!%*?&_-]{6,12}/;

/* INPUT NAME */

$('name').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorName', "El nombre es obligatorio", e)
            break;
        case this.value.trim().length < 2 || this.value.trim().length > 50 :
        msgError('errorName', "Entre 2 y 50 caracteres",e)
        break
        case !regExLetter.test(this.value.trim()):
            msgError('errorName', "Solo caracteres alfabeticos",e)
        break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('name').addEventListener('focus', function(e) {
    cleanError('errorName', e)
  })

  /* INPUT SURNAME */

  $('surname').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorSurname', "El apellido es obligatorio", e)
            break;
        case this.value.trim().length < 2 || this.value.trim().length > 50 :
        msgError('errorSurname', "Entre 2 y 50 caracteres",e)
        break
        case !regExLetter.test(this.value.trim()):
            msgError('errorSurname', "Solo caracteres alfabeticos",e)
        break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('surname').addEventListener('focus', function(e) {
    cleanError('errorSurname', e)
  })


  /* INPUT EMAIL */

  $('userEmail').addEventListener('blur', async function(e){
    
    switch (true) {
        case !this.value.trim():
            msgError('errorEmail', "El email es obligatorio", e)
            break;
        case !regExEmail.test(this.value.trim()):
            msgError('errorEmail', "Tiene que ser un email válido",e)
        break
        case await verifyEmail(this.value.trim()) :
          msgError('errorEmail', "El email ya se encuentra en uso", e)
          
        break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('userEmail').addEventListener('focus', function(e) {
    cleanError('errorEmail', e)
  })

  /* INPUT CONTRASEÑA */

  $('password').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorPass', "la contraseña es obligatoria", e)
            break;

        case !regExPass.test(this.value.trim()):
            msgError('errorPass', "Debe ser entre 6 y 12 caracteres y tener una mayúscula, minúscula y un número",e)
        break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('password').addEventListener('focus', function(e) {
    cleanError('errorPass', e)
  })


  /* INPUT PASSWORD 2 */

  $('password2').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorPass2', "Confirme la contraseña", e)
            break;

        case this.value.trim() !== $('password').value.trim():
            msgError('errorPass2', "La confirmación no coincide",e)
        break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('password2').addEventListener('focus', function(e) {
    cleanError('errorPass2', e)
  })



    /* INPUT IMAGE */

    const regExExt = /(.jpg|.jpeg|.png|.gif|.webp)$/i;

    $('icon').addEventListener('change', function(e){
      switch (true) {
          case !regExExt.exec(this.value):
              $('errorIcon').innerHTML = "Solo se admiten imágenes jpg | jpeg | png | webp"
              break;
          case this.isDefaultNamespace.length > 1 :   
          $('errorIcon').innerHTML = "Solo una imagen"
          break
          default:
              this.classList.add('is-valid')
              checkedFields()
              break;
      }
    });
    $('icon').addEventListener('focus', function(e) {
      cleanError('errorIcon', e)
    })


    /* CHEQUEO DE ERRORES */

  $('formRegister').addEventListener('submit', function(e){
    e.preventDefault();

    let error = false

    for (let i = 0; i < this.elements.length -1; i++) {
        
        if(!this.elements[i].value.trim() || this.elements[i].classList.contains('errorInput')) {
            error = true
            this.elements[i].classList.add('is-invalid')
            $('errorForm').innerHTML = "Hay campos vacíos o con errores!"
        }
        
    }

    !error && this.submit()

  })