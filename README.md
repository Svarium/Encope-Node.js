## a) Pasos para la instalación:

1. Ejecutar `npm install`.
2. Seguir con `npm start`.

### b) Instalacion de Dependencias:
Asegúrate de que las siguientes dependencias estén incluidas en tu archivo `package.json`:

- bcrypt: ^5.1.0
- bcryptjs: ^2.4.3
- cookie-parser: ~1.4.4
- cors: ^2.8.5
- debug: ~2.6.9
- dotenv: ^16.0.3
- ejs: ~2.6.1
- exceljs: ^4.3.0
- express: ~4.16.1
- express-session: ^1.17.3
- express-validator: ^6.15.0
- http-errors: ~1.6.3
- method-override: ^3.0.0
- morgan: ~1.9.1
- multer: ^1.4.5-lts.1
- mysql2: ^3.2.0
- passport: ^0.6.0
- passport-google-oauth: ^2.0.0
- sequelize: ^6.37.3
- sequelize-paginate: ^1.1.6

### c) Migración de la base de datos

Para migrar la base de datos, sigue estos pasos:

1. Ejecuta el comando de migración del siguiente ORM. 

   ```bash
   sequelize db:migrate

### d) Inicialización de la base de datos con datos de prueba (Seed)

Para inicializar la base de datos con datos de prueba, sigue estos pasos:

1. Ejecuta el comando de seed proporcionado por tu ORM o herramienta de administración de bases de datos. Por ejemplo, con Sequelize, podrías ejecutar:

   ```bash
   sequelize db:seed:all
