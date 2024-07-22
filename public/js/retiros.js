const $ = (id) => document.getElementById(id)

const destino = document.getElementById("destino");
const producto = document.getElementById("producto");
const cantidad = document.getElementById("cantidadRetiro");





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
    const elements = $("retirosForm").elements;
    $("errorRetirosForm").innerHTML = null;
  
    for (let i = 0; i < elements.length - 2; i++) {
      if (elements[i].classList.contains("is-invalid")) {
        $("errorRetirosForm").innerHTML = "Hay campos con errores o están vacíos!";
      }
    }
  };






  verifyCantidadRetiro = async (cantidad, producto, destino) => {
    try {
      let response = await fetch("https://encope-node-js.onrender.com/api/cunas/retiroStock/",{
        method: "POST",
        body: JSON.stringify({
          cantidad:cantidad,
          producto:producto,
          destino:destino,
         
        }),
        headers:{
          "Content-Type" : "application/json"
        }
      });

      if (!response.ok) {
        // Manejar errores de respuesta HTTP aquí si es necesario
        console.error(`Respuesta HTTP no exitosa: ${response.status} ${response.statusText}`);
        return false;
      }
      
      let result = await response.json();  
      if (result && result.data && result.data.cantidadValida !== undefined) {
        console.log(result.data.cantidadValida);
        return !result.data.cantidadValida;
      } else {
        // Manejar la respuesta con una estructura inesperada aquí si es necesario
        console.error("La respuesta de la API tiene una estructura inesperada");
        return false;
      }
       
    } catch (error) {
      console.error
    }
  }



  /* INPUT DESTINO */

  $('destino').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorDestino', "El destino es obligatorio", e)
            break;
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('destino').addEventListener('focus', function(e) {
    cleanError('errorDestino', e)
  })


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
   
 cantidad.addEventListener('change', async function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorCantidad', "La cantidad es obligatoria", e)
            break;
            case this.value <= 0:
            msgError('errorCantidad', "La cantidad tiene que ser mayor o igual a 1", e)
            break;
            case await verifyCantidadRetiro(cantidad.value, producto.value, destino.value) :                    
              msgError('errorCantidad', "La cantidad a retirar no puede ser mayor que el stock existente", e)            
              break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('cantidadRetiro').addEventListener('focus', function(e) {
    cleanError('errorCantidad', e)
  })


      /* INPUT ACTA */

      $('acta').addEventListener('blur', function(e){
        switch (true) {
            case !this.value.trim():
                msgError('errorActa', "El numero de acta es obligatorio", e)
                break;
            default:
                this.classList.add('is-valid')
                checkedFields()
                break;
        }
      });
    
      $('acta').addEventListener('focus', function(e) {
        cleanError('errorActa', e)
      })
    


      /* CHEQUEO DE ERRORES */

  $('retirosForm').addEventListener('submit', function(e){
    e.preventDefault();

    let error = false

    for (let i = 0; i < this.elements.length -2; i++) {
        
        if(!this.elements[i].value.trim() || this.elements[i].classList.contains('errorInput')) {
            error = true
            this.elements[i].classList.add('is-invalid')
            $('errorRetirosForm').innerHTML = "Hay campos vacíos o con errores!"
        }
    }

    !error && this.submit()
  })
