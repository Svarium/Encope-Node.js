const { validationResult } = require("express-validator");
const db = require("../database/models")
const fs = require("fs");
const { error } = require("console");


module.exports = {

    //renderiza la vista del detalle de la noticia
    detail : (req,res) => {
      const id = req.params.id


      db.Noticias.findByPk(id, {
        include:["images"],
      })
      .then(noticia => {
        return res.render('noticias/detalleNoticia',{
          noticia,
          title: "Noticias"
        })
      })
      .catch(error => console.log(error))
    },


    //renderiza la vista para el formulario de agregar noticia
    add:(req,res) => {
        return res.render("noticias/addNoticia",{
            title: "Agrega noticia"
        })
    },

    //guarda la noticia en la base de datos
    store:(req,res) => {
        const errors = validationResult(req);
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

        /*    return res.send(errors.mapped()) */

        if (errors.isEmpty()){
            const {titulo, descripcion, video} = req.body

            db.Noticias.create({
                titulo:titulo.trim(),
                descripcion:descripcion.trim(),
                video:video.trim()
            })
            .then((noticia) => {
                req.files.forEach((image)=> {
                    db.Image.create({
                        name:image.filename,
                        noticiaId:noticia.id
                    });
                })

                return res.redirect('/')
            })
            .catch((error) => console.log(error))

        } else {

            if (req.files.length) {
                req.files.forEach((file) => {
                  fs.existsSync(`./public/images/imagesNoticias/${file.filename}`) &&
                    fs.unlinkSync(`./public/images/imagesNoticias/${file.filename}`);
                });
              }

        return res.render("noticias/addNoticia",{
            errors:errors.mapped(),
            old:req.body,
            title: "Agrega noticia"
        })      
        
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
                    title:"Editar Noticia"
                })
            })            
    },

    //edita la noticia en la base de datos
    update: (req, res) => {
        const errors = validationResult(req);
        const idNoticia = req.params.id;
      
        if (errors.isEmpty()) {
          let { 
            titulo,
            descripcion, 
            video
          } = req.body;
      
          db.Noticias.update(
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
          )
          .then((result) => {
            if (result[0] > 0) {
              // Si no reemplaza imagen
              if (req.files.length === 0) {
                return res.redirect("/inicio");
              } else {
                // 1- Eliminar las imágenes antiguas de la base de datos
                db.Image.destroy({
                  where: {
                    noticiaId: idNoticia
                  }
                })
                .then(() => {
                  // 2- Eliminar los archivos de las imágenes antiguas
                  db.Image.findAll({
                    where: {
                      noticiaId: idNoticia
                    }
                  })
                  .then((images) => {
                    images.forEach((noticiaImage) => {
                      const imagePath = `./public/images/imagesNoticias/${noticiaImage.image}`;
                      if (fs.existsSync(imagePath)) {
                        try {
                          fs.unlinkSync(imagePath);
                        } catch (error) {
                          throw new Error(error);
                        }
                      } else {
                        console.log("No se encontró el archivo");
                      }
                    });
                  })
                  .catch((error) => {
                    throw new Error(error);
                  });
      
                  // 3- Crear los registros de las nuevas imágenes en la base de datos
                  const files = req.files.map((file) => {
                    return {
                      name: file.filename,
                      noticiaId: idNoticia
                    };
                  });
                  db.Image.bulkCreate(files)
                  .then(() => {
                    return res.redirect("/inicio");
                  })
                  .catch((error) => {
                    throw new Error(error);
                  });
                })
                .catch((error) => {
                  throw new Error(error);
                });
              }
            } else {
              console.log("No se encontró la noticia");
              return res.redirect("/inicio");
            }
          })
          .catch((error) => {
            throw new Error(error);
          });
                         
        
        } else {

            const { id } = req.params;

            if (req.files.length) {
                req.files.forEach((file) => {
                  fs.existsSync(`./public/images/imagesNoticias/${file.filename}`) &&
                    fs.unlinkSync(`./public/images/imagesNoticias/${file.filename}`);
                });
              }

              db.Noticias.findByPk(id, {
                include:["images"],
            })
            .then(noticia => {
                return res.render('noticias/editNoticia',{
                    noticia,
                    title:"Editar Noticia"
                })
            })        
        }

    },
    
    //elimina la noticia de la base de datos
    remove:(req,res) => {
        const idNoticia = req.params.id;

        // 1- Eliminar las imágenes asociadas a la noticia de la base de datos
        db.Image.destroy({
          where: {
            noticiaId: idNoticia
          }
        })
        .then(() => {
          // 2- Eliminar los archivos de las imágenes asociadas a la noticia
          db.Image.findAll({
            where: {
              noticiaId: idNoticia
            }
          })
          .then((images) => {
            images.forEach((noticiaImage) => {
              const imagePath = `./public/images/imagesNoticias/${noticiaImage.image}`;
              if (fs.existsSync(imagePath)) {
                try {
                  fs.unlinkSync(imagePath);
                } catch (error) {
                  throw new Error(error);
                }
              } else {
                console.log("No se encontró el archivo");
              }
            });
      
            // 3- Eliminar la noticia de la base de datos
            db.Noticias.destroy({
              where: {
                id: idNoticia
              }
            })
            .then(() => {
              return res.redirect("/inicio");
            })
            .catch((error) => {
              throw new Error(error);
            });
          })
          .catch((error) => {
            throw new Error(error);
          });
        })
        .catch((error) => {
          throw new Error(error);
        });
    }









}

