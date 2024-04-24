### Requisitos Previos

Primero, asegúrate de tener Node.js y npm instalados en tu sistema. Puedes verificar si están instalados ejecutando los siguientes comandos en tu terminal:

```bash
node -v
npm -v
```
Si no están instalados, descárgalos e instálalos desde el sitio web oficial de Node.js: [Link al entorno de Ejecucion](https://nodejs.org.)

## a) Pasos para la instalación:

1. Ejecutar `npm install`.
2. Seguir con `npm start` o para desarrollo `npx nodemon`.

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

### c) Migración de la base de datos y Poblado

1. Existe un archivo `.env.example`, el cual tiene los campos necesarios a ser llenados para la base de datos y otras variables de uso general. Pasos:
    1. Copiar `.env.example` y crear cambiarle el nombre a `.env`
    2. Completar `.env` con los valores correspondientes

### d) Migración de la base de datos y Poblado

#### d.1) Requisitos previos:

1. Tener instalado `npm install -g sequelize-cli` de manera global

    1. Nota: Es posible que en entornos windows no tenga permisos de ejecucion. En cuyo caso, debera entrar al PowerShell y ejecutar el siguiente comando `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`, con esto ya podra ejecutar el comando `sequelize db:seed:all`.   

#### d.2) Migracion de la base de datos:

```bash
npm run db:create
npm run db:reset
```
### d) Inicialización de la base de datos con datos de prueba (Seed)

Para inicializar la base de datos con datos de prueba, sigue estos pasos:

1. Ejecuta el comando de seed proporcionado por tu ORM o herramienta de administración de bases de datos. Por ejemplo, con Sequelize, podrías ejecutar:

```bash
sequelize db:seed:all
```
