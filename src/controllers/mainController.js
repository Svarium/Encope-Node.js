const db = require("../database/models");
const fs = require('fs');
const path = require('path')
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);



module.exports = {
    home : (req,res) =>{

            return res.render('index',{
                title: 'Encope',
            });
    
    },
    inicio: async (req, res) => {
        try {
            const userLogin = req.session.userLogin;
    
            // Obtener noticias de la base de datos
            const noticias = await db.Noticias.findAll({
                include: [{
                    model: db.Image,
                    as: 'images',
                    attributes: {
                        exclude: ["id", "noticiaId", "createdAt", "updatedAt"]
                    }
                }],
                order: [["createdAt", "DESC"]],
                limit: 4,
                attributes: {
                    exclude: ["updatedAt"]
                }
            });
    
            // Leer el archivo de unidades de manera asincrónica
            const unidadFilePath = path.join(__dirname, '../data/mapa.json');
            const unidadesData = await readFileAsync(unidadFilePath, 'utf-8');
            const unidades = JSON.parse(unidadesData);
    
            // Contar talleres y unidades
            const unidadesCount = unidades.length - 1;
            let totalTalleres = 0;
    
            // Recorrer cada unidad (ignorar la primera posición)
            for (let i = 1; i < unidades.length; i++) {
                const unidad = unidades[i];
                totalTalleres += unidad.internosPorTaller.length;
            }
    
            // Renderizar la vista con los datos
            return res.render('inicio', {
                title: 'Encope',
                noticias,
                userLogin,
                unidades,
                totalTalleres,
                unidadesCount
            });
        } catch (error) {
            // Manejo de errores
            console.error('Error en el controlador inicio:', error);
            return res.status(500).send('Error interno del servidor');
        }
    },
    nosotros : (req,res)=>{  
        return res.render('nosotros',{
            title:'Nosotros',        
        })
    },
   
    mapa: (req,res) => {
        const unidadFilePath = path.join(__dirname, '../data/mapa.json');
        const unidades = JSON.parse(fs.readFileSync(unidadFilePath, 'utf-8'));
       
        return res.render('mapa',{
            title:"Mapa",           
            unidades
        })
    },

    unidadDetail: (req,res) => {
        const unidadFilePath = path.join(__dirname, '../data/mapa.json');
        const unidades = JSON.parse(fs.readFileSync(unidadFilePath, 'utf-8'));
        let id = req.params.id

        let unidad = unidades.find(unidad => unidad.id == id)

        return res.render('detalleMapa', {
            unidad,
            title:'Detalle de la unidad'
        })
    },

    contacto: (req,res) => {        
        return res.render('contacto',{         
            title:'Contacto'
        })
    },

    nuestrosProyectos: (req,res) => {
        return res.render('nuestrosProyectos',{
            title:'Nuestros proyectos'
        })
    },

    estadisticas: async (req, res) => {
        // Función para contar la cantidad total de talleres
        function contarTalleres(unidades) {
            return unidades.reduce((total, unidad, index) => {
                // Ignorar la primera unidad (índice 0)
                if (index === 0) return total;
                return total + (unidad.internosPorTaller ? unidad.internosPorTaller.length : 0);
            }, 0);
        }
        try {
            // Consultas a la base de datos
            const productosPromise = db.Producto.findAll({ attributes: ['id', 'nombre'] });
            const destinosPromise = db.destinoUsuario.findAll({ attributes: ['id', 'nombreDestino'] });
            const talleresPromise = db.Taller.findAll({ attributes: ['id', 'nombre'] });

            // Leer y parsear el archivo JSON de unidades
            const unidadFilePath = path.join(__dirname, '../data/mapa.json');
            const unidades = JSON.parse(fs.readFileSync(unidadFilePath, 'utf-8'));

            // Contar unidades y talleres
            const unidadesCount = unidades.length - 1;
            const totalTalleres = contarTalleres(unidades);

            // Ejecutar todas las consultas en paralelo
            const [productos, destinos, talleres] = await Promise.all([productosPromise, destinosPromise, talleresPromise]);

            // Renderizar la vista con los datos obtenidos
            return res.render('stock/estadistica', {
                title: 'Estadísticas',
                productos,
                destinos,
                talleres,
                unidades,
                totalTalleres,
                unidadesCount,
            });
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return res.status(500).render('error', { message: 'Hubo un problema al obtener las estadísticas.', error });
        }
    }, 

    intranet: (req,res) => {       
        return res.render('intranet/intranet',{
            title:"Sistema de Gestión Web - ENCOPE",         
        })

    }  
}