const { validationResult } = require("express-validator");
const db = require("../database/models")
const fs = require("fs");
const path = require('path');


module.exports = {


    list: (req,res) => {   
      return res.render('noticias/allNoticias',{
        title:"Todas las noticias",       
      })
  },

    //renderiza la vista del detalle de la noticia
    detail : (req,res) => {
      const id = req.params.id    

      db.Noticias.findByPk(id, {
        include:["images"],
      })
      .then(noticia => {
        return res.render('noticias/detalleNoticia',{
          noticia,
          title: "Noticias",    
        })
      })
      .catch(error => console.log(error))
    },


    //renderiza la vista para el formulario de agregar noticia
    add:(req,res) => {      
        return res.render("noticias/addNoticia",{
            title: "Agrega noticia",          
        })
    },

    //guarda la noticia en la base de datos
    store: async (req, res) => {
      const errors = validationResult(req);

      // Validaciones adicionales para archivos
      if (!req.files.length && !req.fileValidationError) {
          errors.errors.push({
              value: "",
              msg: "La noticia debe tener por lo menos una imagen",
              param: "images",
              location: "files",
          });
      }

      if (req.fileValidationError) {
          errors.errors.push({
              value: "",
              msg: req.fileValidationError,
              param: "images",
              location: "files",
          });
      }

      // Si no hay errores, crear la noticia
      if (errors.isEmpty()) {
          try {
              const { titulo, descripcion, video } = req.body;

              // Crear la noticia en la base de datos
              const noticia = await db.Noticias.create({
                  titulo: titulo.trim(),
                  descripcion: descripcion.trim(),
                  video: video.trim()
              });

              // Guardar las imágenes asociadas a la noticia
              if (req.files.length) {
                  const imagePromises = req.files.map(image => {
                      return db.Image.create({
                          name: image.filename,
                          noticiaId: noticia.id
                      });
                  });

                  // Esperar a que todas las imágenes se guarden
                  await Promise.all(imagePromises);
              }

              // Redirigir después de crear la noticia
              return res.redirect('/');
          } catch (error) {
              console.error("Error al crear la noticia:", error);
              return res.status(500).send('Error interno del servidor');
          }
      } else {
          // Si hay errores, eliminar los archivos subidos
          if (req.files.length) {
              req.files.forEach(file => {
                  const filePath = path.join(__dirname, `../../public/images/imagesNoticias/${file.filename}`);
                  if (fs.existsSync(filePath)) {
                      fs.unlinkSync(filePath);
                  }
              });
          }

          // Renderizar el formulario con errores
          return res.render('noticias/addNoticia', {
              errors: errors.mapped(),
              old: req.body,
              title: "Agrega noticia"
          });
      }
  },

    //Renderiza el formulario de edicion para la noticia
    edit:(req,res)=>{
            const {id} = req.params;         

            db.Noticias.findByPk(id, {
                include:["images"],
            })
            .then(noticia => {
                return res.render('noticias/editNoticia',{
                    noticia,
                    title:"Editar Noticia",                    
                })
            })            
    },

    //edita la noticia en la base de datos
    update: async (req, res) => {
      const errors = validationResult(req);
      const idNoticia = req.params.id;

      if (errors.isEmpty()) {
          let { titulo, descripcion, video } = req.body;

          try {
              // Actualizar la noticia
              const result = await db.Noticias.update(
                  {
                      titulo: titulo.trim(),
                      descripcion: descripcion.trim(),
                      video: video.trim()
                  },
                  {
                      where: {
                          id: idNoticia
                      }
                  }
              );

              // Si no se encontró la noticia
              if (result[0] === 0) {
                  console.log("No se encontró la noticia");
                  return res.redirect("/inicio");
              }

              // Si no hay imágenes nuevas, redirigir
              if (req.files.length === 0) {
                  return res.redirect("/inicio");
              }

              // Eliminar imágenes antiguas de la base de datos
              const oldImages = await db.Image.findAll({ where: { noticiaId: idNoticia } });

              // Eliminar archivos de las imágenes antiguas
              const deletionPromises = oldImages.map(async (noticiaImage) => {
                  const filePath = path.join(__dirname, `../../public/images/imagesNoticias/${noticiaImage.name}`);
                  if (fs.existsSync(filePath)) {
                      fs.unlinkSync(filePath);
                  }
                  await noticiaImage.destroy();
              });

              await Promise.all(deletionPromises);

              // Crear registros de las nuevas imágenes
              const newFiles = req.files.map(file => ({
                  name: file.filename,
                  noticiaId: idNoticia
              }));

              await db.Image.bulkCreate(newFiles);

              return res.redirect("/inicio");

          } catch (error) {
              console.error("Error al actualizar la noticia:", error);
              return res.status(500).send('Error interno del servidor');
          }
      } else {
          // Si hay errores de validación, eliminar imágenes subidas
          if (req.files.length) {
              req.files.forEach(file => {
                  const filePath = path.join(__dirname, `../../public/images/imagesNoticias/${file.filename}`);
                  if (fs.existsSync(filePath)) {
                      fs.unlinkSync(filePath);
                  }
              });
          }

          try {
              // Buscar la noticia para renderizar el formulario con los datos existentes
              const noticia = await db.Noticias.findByPk(idNoticia, {
                  include: ["images"]
              });

              return res.render("noticias/editNoticia", {
                  noticia,
                  errors: errors.mapped(),
                  title: "Editar Noticia",
                  old: req.body
              });

          } catch (error) {
              console.error("Error al buscar la noticia:", error);
              return res.status(500).send('Error interno del servidor');
          }
      }
  },    
    
    //elimina la noticia de la base de datos
    destroy: (req, res) => {
      const idNoticia = req.params.id;
      db.Image.findAll({
        where: {
          noticiaId: idNoticia,
        },
      })
        .then((images) => {
          const deletionPromises = images.map((noticiaImage) => {
            fs.existsSync(`./public/images/imagesNoticias/${noticiaImage.name}`) &&
            fs.unlinkSync(`./public/images/imagesNoticias/${noticiaImage.name}`);
            return noticiaImage.destroy();
          });

          Promise.all(deletionPromises)
            .then(() => {
              db.Noticias.destroy({
                where: {
                  id: idNoticia,
                },
              }).then(() => res.redirect("/inicio"));
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
}
}

