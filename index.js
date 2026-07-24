const express = require('express');

const Usuario = require('./esquemaUsuario.js');
const Gema = require('./Gemaesquema.js');
const app = express();
app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const conectarBD = require('./conexion.js');
async function iniciarServidor() {
  await conectarBD();
}

iniciarServidor();

// Middleware para verificar JWT
function verificarToken(req, res, next) {
  console.log(req)
  const authHeader = req.headers['authorization'];  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  const token = authHeader.split(' ')[1];  // Espera formato "Bearer token"
  console.log(token)
  try {
    const decoded = jwt.verify(token, 'SECRETO_SUPER_SEGUR0');    // Verifica y decodifica el token
    console.log(decoded)
    req.usuarioId = decoded.id;                    // Guardamos el id del token en la request para usarlo después
    next();                                       // Token válido, continuar a la siguiente función
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}



app.get('/', async (req, res) => {
  try {
    res.send("Hola mundo")                      // Responde con la lista en formato JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error del servidor' }); // Error genérico en caso de fallo
  }
});
app.post('/api/verificatoken',verificarToken, async (req, res) => {
 console.log("entra")
  try {
    res.send("verificado")                      // Responde con la lista en formato JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error del servidor' }); // Error genérico en caso de fallo
  }
});

// Obtener todos los usuarios
app.get('/api/usuarios',verificarToken, async (req, res) => {
  try {
    const usuarios = await Usuario.find();    // Busca todos los documentos de usuarios en la BD
    res.json(usuarios);                       // Responde con la lista en formato JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error del servidor' }); // Error genérico en caso de fallo
  }
});


// Obtener todos los usuarios
app.get('/api/gemas',verificarToken, async (req, res) => {
  try {
    const gemas = await Gema.find();    // Busca todos los documentos de gemas en la BD
    res.json(gemas);                       // Responde con la lista en formato JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error del servidor' }); // Error genérico en caso de fallo
  }
});


// Obtener un usuario por ID
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id); // Busca usuario por el ID proporcionado
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' }); // Si no existe, 404
    }
    res.json(usuario); // Si existe, lo devolvemos en JSON
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear un nuevo usuario
app.post('/api/usuarios', async (req, res) => {
  try {
    console.log(req.body)
    const datosUsuario = req.body;            // Obtenemos los datos enviados en la petición
    const nuevo = new Usuario(datosUsuario);  // Creamos un nuevo documento Usuario
    const usuarioGuardado = await nuevo.save();      // Guardamos en la base de datos
    res.status(201).json(usuarioGuardado);    // Devolvemos el usuario creado con código 201 (Creado)
  } catch (error) {
    res.status(400).json({ error: 'Error al crear usuario' }); // Posibles errores de validación
  }
});
// Crear un nuevo usuario
app.post('/api/gemas', async (req, res) => {
  try {
    const datosGema = req.body;            // Obtenemos los datos enviados en la petición
    const nuevo = new Gema(datosGema);  // Creamos un nuevo documento Gema
    const gemaGuardado = await nuevo.save();      // Guardamos en la base de datos
    res.status(201).json(gemaGuardado);    // Devolvemos la gema creada con código 201 (Creado)
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la gema' }); // Posibles errores de validación
  }
});
// Actualizar un usuario existente
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const datosActualizados = req.body;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true } // opción new:true para obtener el documento actualizado
    );
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar un usuario
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});
const bcrypt = require('bcryptjs');

// Registro de un nuevo usuario
app.post('/api/registro', async (req, res) => {
  try {
    console.log(req.body)
    const { nombre, email, clave } = req.body;
    
    // 1. Generar un salt (semilla aleatoria) para el hash
    const salt = await bcrypt.genSalt(10);                  // 10 rondas de generación de salt
    // 2. Hashear la contraseña proporcionada usando el salt generado
    const hash = await bcrypt.hash(clave, salt);
    
    // 3. Crear y guardar el nuevo usuario con la contraseña hasheada
    const nuevoUsuario = new Usuario({ nombre, email, clave: hash });
    await nuevoUsuario.save();
    
    res.status(201).json({ mensaje: 'Usuario registrado con éxito', id: nuevoUsuario._id });
  } catch (error) {
    res.status(400).json({ error: 'No se pudo registrar el usuario' });
    console.log(error)
  }
});

const jwt = require('jsonwebtoken');

// Login de usuario (autenticación)
app.post('/api/login', async (req, res) => {
  try {
    const { email, clave } = req.body;
    
    // 1. Buscar al usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); // No se encontró el email
    }
    // 2. Verificar la contraseña con bcrypt.compare
    const passwordOk = await bcrypt.compare(clave, usuario.clave);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); // Contraseña incorrecta
    }
    
    // 3. Credenciales válidas: Generar token JWT
    const datosToken = { id: usuario._id };            // Podemos incluir datos en el token (p.ej. el ID de usuario)
    const secreto = 'SECRETO_SUPER_SEGUR0';            // Clave secreta para firmar el token (en producción, mantener en una variable de entorno)
    const opciones = { expiresIn: '1h' };              // El token expirará en 1 hora
    const token = jwt.sign(datosToken, secreto, opciones);
    
    // 4. Enviar el token al cliente
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});



// =====================================================
// CRUD DE GEMAS
// Todas las rutas requieren un token válido
// =====================================================

// Obtener las gemas del usuario autenticado
app.get('/api/gemas', verificarToken, async (req, res) => {
  try {
    const gemas = await Gema.find({
      creador: req.usuarioId
    }).sort({ fechaCreacion: -1 });

    res.json(gemas);

  } catch (error) {
    console.error('Error al obtener gemas:', error);

    res.status(500).json({
      error: 'Error al obtener las gemas'
    });
  }
});


// Obtener una gema específica del usuario
app.get('/api/gemas/:id', verificarToken, async (req, res) => {
  try {
    const gema = await Gema.findOne({
      _id: req.params.id,
      creador: req.usuarioId
    });

    if (!gema) {
      return res.status(404).json({
        error: 'Gema no encontrada'
      });
    }

    res.json(gema);

  } catch (error) {
    console.error('Error al obtener gema:', error);

    res.status(400).json({
      error: 'Identificador de gema inválido'
    });
  }
});


// Crear una nueva gema
app.post('/api/gemas', verificarToken, async (req, res) => {
  try {
    const {
      nombre,
      tipo,
      color,
      durezaMohs,
      procedencia,
      composicion,
      brillo,
      rareza,
      valorEstimado,
      imagenUrl
    } = req.body;

    const nuevaGema = new Gema({
      creador: req.usuarioId,
      nombre,
      tipo,
      color,
      durezaMohs,
      procedencia,
      composicion,
      brillo,
      rareza,
      valorEstimado,
      imagenUrl
    });

    const gemaGuardada = await nuevaGema.save();

    res.status(201).json(gemaGuardada);

  } catch (error) {
    console.error('Error al crear gema:', error);

    res.status(400).json({
      error: 'Error al crear la gema'
    });
  }
})



// Actualizar una gema del usuario autenticado
app.put('/api/gemas/:id', verificarToken, async (req, res) => {
  try {
    const {
      nombre,
      tipo,
      color,
      durezaMohs,
      procedencia,
      composicion,
      brillo,
      rareza,
      valorEstimado,
      imagenUrl
    } = req.body;

    const gemaActualizada = await Gema.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        nombre,
        tipo,
        color,
        durezaMohs,
        procedencia,
        composicion,
        brillo,
        rareza,
        valorEstimado,
        imagenUrl
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!gemaActualizada) {
      return res.status(404).json({
        error: 'Gema no encontrada'
      });
    }

    res.json(gemaActualizada);

  } catch (error) {
    console.error('Error al actualizar gema:', error);

    res.status(400).json({
      error: 'Error al actualizar la gema'
    });
  }
});


// Eliminar una gema del usuario autenticado
app.delete('/api/gemas/:id', verificarToken, async (req, res) => {
  try {
    const gemaEliminada = await Gema.findOneAndDelete({
      _id: req.params.id
    });

    if (!gemaEliminada) {
      return res.status(404).json({
        error: 'Gema no encontrada'
      });
    }

    res.json({
      mensaje: 'Gema eliminada correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar gema:', error);

    res.status(400).json({
      error: 'Error al eliminar la gema'
    });
  }
});
// Votar por una gema
app.put('/api/gemas/:id/votar', verificarToken, async (req, res) => {
  try {
    const { voto } = req.body;

    // Solo se permite votar +1 o -1
    if (voto !== 1 && voto !== -1) {
      return res.status(400).json({
        error: 'El voto debe ser 1 o -1'
      });
    }

    const gemaActualizada = await Gema.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          calificacion: voto
        }
      },
      {
        new: true
      }
    );

    if (!gemaActualizada) {
      return res.status(404).json({
        error: 'Gema no encontrada'
      });
    }

    res.json({
      mensaje: 'Voto registrado',
      calificacion: gemaActualizada.calificacion,
      gema: gemaActualizada
    });

  } catch (error) {
    console.error('Error al votar:', error);

    res.status(500).json({
      error: 'Error al registrar el voto'
    });
  }
});
// Obtener los datos del usuario autenticado
app.get('/api/usuario-logueado', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId).select('-clave');

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json(usuario);

  } catch (error) {
    console.error('Error obteniendo el usuario:', error);

    res.status(500).json({
      error: 'Error al obtener los datos del usuario'
    });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor API escuchando en http://localhost:${PORT}`);
});