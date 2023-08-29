const $ = (id) => document.getElementById(id)

cantidadInput = document.getElementById("cantidad")



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
    const elements = $("iniciarStock").elements;
    $("errorFormStock").innerHTML = null;
  
    for (let i = 0; i < elements.length - 2; i++) {
      if (elements[i].classList.contains("is-invalid")) {
        $("errorFormStock").innerHTML = "Hay campos con errores o están vacíos!";
      }
    }
  };


  verifyCantidad = async (cantidad) => {
    try {
      let response = await fetch("http://localhost:3000/api/cunas/cantidadKit",{
        method: "POST",
        body: JSON.stringify({
          cantidad:cantidad
        }),
        headers:{
          "Content-Type" : "application/json"
        }
      });
      
      let result = await response.json();  
      console.log(result.data.validateCantidad);   

     return !result.data.validateCantidad
       
    } catch (error) {
      console.error
    }
  }

  /* INPUT PRODUCTO */

  $('producto').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorProducto', "El producto es obligatorio", e)
            break;
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('producto').addEventListener('focus', function(e) {
    cleanError('errorProducto', e)
  })


  /* INPUT CANTIDAD */

  $('cantidad').addEventListener('blur', async function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorCantidadInicial', "La cantidad es obligatoria", e)
            break;
            case this.value <= 0:
            msgError('errorCantidadInicial', "La cantidad tiene que ser mayor o igual a 1", e)
            break;
            case await verifyCantidad(this.value) :           
              msgError('errorCantidadInicial', "La cantidad de productos es insuficiente para armar nuevos kits", e)            
              break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('cantidad').addEventListener('focus', function(e) {
    cleanError('errorCantidadInicial', e)
  })


  /* CHEQUEO DE ERRORES */

  $('iniciarStock').addEventListener('submit', function(e){
    e.preventDefault();

    let error = false

    for (let i = 0; i < this.elements.length -2; i++) {
        
        if(!this.elements[i].value.trim() || this.elements[i].classList.contains('errorInput')) {
            error = true
            this.elements[i].classList.add('is-invalid')
            $('errorFormStock').innerHTML = "Hay campos vacíos o con errores!"
        }
    }

    !error && this.submit()
  })

