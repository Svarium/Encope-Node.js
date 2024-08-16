const createResponseError = require('../../helpers/createResponseError');
const { editProyectState, editParteSemanal, getAllProducts, getAllTallers, getProyectsDone, getLastproyects, editarCantidadAProducir, editarCostoUnitario, eliminarProductoDelProyecto, agregarProductoAlProyecto, editarCantidadProducida, actualizarEgresos, actualizarObservaciones, removeInsumo, getProyectsPending, getProyectsDelayed, getCountProducts, getAllDbProducts } = require('../../services/stockServices');


module.exports = {

    editState : async (req,res) => {
            try {
                const id = req.params.id;
                const state = await editProyectState(id)
                return res.status(200).json({
                    ok:true,
                    data:{
                        message:"Estado actualizado"
                    }
                })
            } catch (error) {
                console.log(error);
                return createResponseError(res, error)
            }
    },

    addRemanentes : async (req,res) => {
        try {

            const id = req.params.id;
            const data = req.body.remanentes
            const parte = await editParteSemanal(id, data)

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Campo remanentes actualizado"
                }
            })
            
        } catch (error) {
            console.log(error);
                return createResponseError(res, error)
        }
    },

    allProducts : async (req,res) => {
        try {

            const productsInDB = await getCountProducts()

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Productos en base de datos",
                    productsInDB,

                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    getAllProducts : async(req,res) => {
        try {

            const allProducts = await getAllDbProducts()

            return res.status(200).json({
                ok:true,
                data:{
                    message:'Todos los productos existentes',
                    allProducts,
                    count: allProducts.length
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    allTallers : async (req,res) => {
        try {

            const tallersInDB = await getAllTallers()

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Talleres en base de datos",
                    tallersInDB
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    allProyectsDone : async (req,res) => {
        try { 

            const proyectsDone = await getProyectsDone()

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Proyectos Finalizados",
                    proyectsDone
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    allProyectsInProgress : async (req,res) => {
        try { 

            const proyectsPending = await getProyectsPending()

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Proyectos Finalizados",
                    proyectsPending
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    allProyectsDelayed : async (req,res) => {
        try { 

            const proyectsDelayed = await getProyectsDelayed()

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Proyectos Finalizados",
                    count: proyectsDelayed.length,
                    proyectsDelayed

                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    lastProyects : async (req,res) => {
        try {

            const proyects = await getLastproyects()

            return res.status(200).json({
                ok:true,
                data:{
                    message: "Últimos Proyectos agregados",
                    proyects
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    updateCantidadAProducir: async (req,res) => {
        try {

            const proyectoId = req.params.id;
            const productoId = req.body.productoId;
            const cantidad = req.body.cantidad;

            const updateCantidad = await editarCantidadAProducir(proyectoId, productoId, cantidad);

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Cantidad actualizada correctamente"
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    updateCostoUnitario: async (req,res) => {
        try {

        const proyectoId = req.params.id;
        const productoId = req.body.productoId;
        const costo = req.body.costoUnitario;

        const updateCosto = await editarCostoUnitario(proyectoId, productoId, costo);
        return res.status(200).json({
            ok:true,
            data:{
                message:"Costo unitrario actualizado correctamente"
            }
        })



        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    eliminarProducto: async (req,res) => {
        try {

            const proyectoId = req.params.id;
            const productoId = req.body.productoId;

            const deleteProduct = await eliminarProductoDelProyecto(proyectoId, productoId);
            return res.status(200).json({
                ok:true,
                data:{
                    message:"Producto Eliminado correctamente"
                }
            })  

            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    agregarProducto: async(req,res) => {
        try {

            const proyectoId = req.body.proyectoId;
            const productoId = req.body.productoId;

            const productos = await agregarProductoAlProyecto(proyectoId, productoId)

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Producto agregados correctamente",                 
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    cantidadProducida : async(req,res) => {
        try {

            const proyectoId = req.params.id;
            const productoId = req.body.productoId;
            const cantidad = req.body.cantidad;

            const nuevaCantidad = await editarCantidadProducida(proyectoId, productoId, cantidad);

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Cantidad actualizada correctamente",                 
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    egresos: async (req, res) => {
        try {
          const proyectoId = req.params.id;
          const productoId = req.body.productoId;
          const egresos = req.body.egresos;
      
          const nuevaCantidad = await actualizarEgresos(proyectoId, productoId, egresos);
      
          return res.status(200).json({
            ok: true,
            data: {
              message: "Egresos actualizados correctamente",
            }
          });
      
        } catch (error) {
          console.log(error);
      
          // Verifica si el error es debido a egresos mayores que la cantidad producida
          if (error.status && error.status === 400) {
            // Envía el mensaje de error al frontend
            return res.status(error.status).json({
              ok: false,
              error: {
                message: error.message,
              },
            });
          } else {
            // Maneja otros errores
            return res.status(error.status || 500).json({
              ok: false,
              error: {
                message: error.message || "Error al actualizar los egresos",
              },
            });
          }
        }
      },

      observaciones: async(req,res) => {
        try {

            const proyectoId = req.params.id;           
            const observaciones = req.body.observaciones;

            const nuevasObservaciones = await actualizarObservaciones(proyectoId, observaciones)

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Observaciones actualizadas correctamente",                 
                }
            })    
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
      },

      deleteInsumo : async (req,res) => {

        try {
            const idProducto = req.params.id;
            const idInsumo = req.body.insumo;
            const remove = await removeInsumo(idProducto, idInsumo);

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Insumo removido correctamente"
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }

      }

   
      
    
}