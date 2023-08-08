const $ = (id) => document.getElementById(id)

const emailInput = document.getElementById("email")

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
    const elements = $("resetPassForm").elements;
    $("errorPassForm").innerHTML = null;
  
    for (let i = 0; i < elements.length - 2; i++) {
      if (elements[i].classList.contains("is-invalid")) {
        $("errorPassForm").innerHTML = "Hay campos con errores o están vacíos!";
      }
    }
  };

let regExLetter = /^[A-Z]+$/i;
let regExEmail =
  /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]:+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;
let regExPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/; //mayuscula, numero y 6 a 12 caracteres
let regExPass2 =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_-])[A-Za-z\d$@$!%*?&_-]{6,12}/;



  /* INPUT EMAIL */

  $('email').addEventListener('blur', async function(e){
    
    switch (true) {
        case !this.value.trim():
            msgError('errorEmail', "El email es obligatorio", e)
            break;
        case !regExEmail.test(this.value.trim()):
            msgError('errorEmail', "Tiene que ser un email válido",e)
        break

        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  const verifyPass = async (email, password) => {
    try {
      let response = await fetch("/api/users/verify-pass", {
        method: "POST",
        body: JSON.stringify({
          email:email,
          password:password
        }),
        headers: {
          "Content-Type" : "application/json"
        }
        });
  
        let result = await response.json();
        console.log(result);
        return !result.data.existPass
    } catch (error) {
      console.error
    }
  }

  $('email').addEventListener('focus', function(e) {
    cleanError('errorEmail', e)
  })


  /* INPUT CONTRASEÑA */

  $('oldPass').addEventListener('blur', async function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorPass', "la contraseña es obligatoria", e)
            break;

        case !regExPass.test(this.value.trim()):
            msgError('errorPass', "Debe ser entre 6 y 12 caracteres y tener una mayúscula, minúscula y un número",e)
        break
         
        case await verifyPass(emailInput.value.trim(), this.value.trim()):
          msgError('errorPass', 'Credenciales Inválidas', e)
          break

        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('oldPass').addEventListener('focus', function(e) {
    cleanError('errorPass', e)
  })


  /* INPUT CONTRASEÑA */

  $('newPass').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorPass2', "la contraseña es obligatoria", e)
            break;

        case !regExPass.test(this.value.trim()):
            msgError('errorPass2', "Debe ser entre 6 y 12 caracteres y tener una mayúscula, minúscula y un número")
        break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('newPass').addEventListener('focus', function(e) {
    cleanError('errorPass', e)
  })




  /* CHEQUEO DE ERRORES */

  $('resetPassForm').addEventListener('submit', function(e){
    e.preventDefault();

    let error = false

    for (let i = 0; i < this.elements.length -2; i++) {
        
        if(!this.elements[i].value.trim() || this.elements[i].classList.contains('errorInput')) {
            error = true
            this.elements[i].classList.add('is-invalid')
            $('errorPassForm').innerHTML = "Hay campos vacíos o con errores!"
        }
        
    }

  /*   !error && this.submit() */

  if(!error){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Contraseña actualizada!',
      showConfirmButton: false,
      timer: 2000
    })
    setTimeout(function() {
      $('resetPassForm').submit();
    }, 2000); 
  }

  })