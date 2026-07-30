Descripción del proyecto

Este proyecto consiste en una aplicación web para administrar un inventario de gemas. El sistema permite que cada usuario pueda registrarse, iniciar sesión de forma segura y gestionar sus propias gemas mediante un CRUD (Crear, Leer, Actualizar y Eliminar).

Además, la aplicación incluye autenticación mediante JWT, almacenamiento de la información en MongoDB Atlas y un diseño moderno realizado con HTML, CSS y JavaScript.

Objetivos

El propósito del proyecto fue desarrollar una aplicación web completa que permitiera aplicar los conocimientos de:

HTML
CSS
JavaScript
Node.js
Express
MongoDB
Mongoose
JWT
bcrypt
Consumo de API mediante Fetch
Funcionalidades
Registro de usuarios

El sistema permite crear nuevos usuarios ingresando:

Nombre
Correo electrónico
Contraseña

La contraseña nunca se guarda en texto plano, sino que se cifra utilizando bcrypt.

Inicio de sesión

Los usuarios pueden iniciar sesión con su correo y contraseña.

Cuando las credenciales son correctas:

Se genera un token JWT.
El token se almacena en LocalStorage.
El usuario es redireccionado al menú principal.

Si las credenciales son incorrectas se muestra un mensaje de error.

Página principal

Después del inicio de sesión el usuario puede visualizar:

Su nombre
Correo electrónico
Fecha de registro
Identificador del usuario

También dispone de un menú para acceder al CRUD de gemas o cerrar sesión.

CRUD de Gemas

Cada usuario puede administrar sus gemas.

Las operaciones disponibles son:

Crear

Se pueden registrar gemas indicando:

Imagen
Nombre
Tipo
Color
Dureza (Escala Mohs)
Procedencia
Composición
Brillo
Rareza
Valor estimado

Todas las gemas almacenadas se muestran en una tabla donde es posible visualizar toda su información.

Editar

Se puede modificar cualquier dato de una gema previamente registrada.

Eliminar

El usuario puede eliminar una gema mediante un botón de confirmación.

Funciones adicionales

Además del CRUD básico, el sistema incorpora:

Búsqueda por nombre.
Filtro por tipo de gema.
Ordenamiento por dureza (ascendente y descendente).
Carga de imágenes utilizando Base64.
Mensajes de éxito y error.
Protección de rutas mediante JWT.
Tecnologías utilizadas
Frontend
HTML5
CSS3
JavaScript
Backend
Node.js
Express
Base de datos
MongoDB Atlas
Mongoose
Seguridad
JSON Web Token (JWT)
bcryptjs
Estructura del proyecto
Proyecto

│
├── public
│   ├── index.html
│   ├── login.html
│   ├── registro.html 
│   └── Gema.html
│
├── conexion.js
├── esquemaUsuario.js
├── Gemaesquema.js
├── index.js
├── server.js
│
├── package.json
├── package-lock.json
└── README.txt

API utilizada
Usuarios
Registrar usuario
POST /api/registro
Iniciar sesión
POST /api/login
Verificar token
POST /api/verificatoken
Obtener usuario autenticado
GET /api/usuario-logueado
Gemas
Obtener todas
GET /api/gemas
Obtener una gema
GET /api/gemas/:id
Crear gema
POST /api/gemas
Actualizar gema
PUT /api/gemas/:id
Eliminar gema
DELETE /api/gemas/:id
Votar una gema
PUT /api/gemas/:id/votar
Seguridad implementada

Para proteger la información de los usuarios se implementaron varias medidas:

Contraseñas cifradas con bcrypt.
Autenticación mediante JWT.
Verificación del token antes de acceder a las rutas protegidas.
Eliminación del token cuando el usuario cierra sesión.
Validación de la sesión antes de cargar las páginas privadas.
Base de datos

Se utilizaron dos colecciones principales.

Usuarios

Contiene:

Nombre
Email
Contraseña cifrada
Fecha de registro
Gemas

Contiene:

Imagen
Nombre
Tipo
Color
Dureza
Procedencia
Composición
Brillo
Rareza
Valor estimado
Cómo ejecutar el proyecto
Clonar el repositorio.
Instalar las dependencias.
npm install
Configurar el archivo .env con la cadena de conexión de MongoDB y la clave secreta del JWT.

Ejemplo:

MONGO=tu_cadena_de_conexion
SECRETO=tu_clave_secreta
Ejecutar el servidor.
node index.js

o

npm start
Abrir el navegador en:
http://localhost:3000
Conclusión

Este proyecto permitió integrar todos los conocimientos vistos durante el curso, desarrollando una aplicación web completa con autenticación, manejo de base de datos y operaciones CRUD. También se aplicaron conceptos de seguridad utilizando JWT y bcrypt para proteger la información de los usuarios. Además, se implementó una interfaz sencilla e intuitiva para facilitar la administración de las gemas, incorporando funciones de búsqueda, filtrado y ordenamiento que mejoran la experiencia del usuario.