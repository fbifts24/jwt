const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); // Analiza el cuerpo de las solicitudes

const app = express();
const port = 3000;

// Clave secreta para firmar y verificar los tokens (¡Mantener segura en una aplicación real!)
const secretKey = 'miClaveSuperSecreta123';

// Middleware para verificar el JWT en las rutas protegidas
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (token == null) {
    return res.sendStatus(401); // No autorizado
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Prohibido (token inválido)
    }
    req.user = user; // Almacena la información del usuario decodificada en la solicitud
    next();
  });
}

app.use(bodyParser.json()); // Para poder leer el cuerpo de las solicitudes JSON

// Ruta pública (no requiere autenticación)
app.get('/', (req, res) => {
  res.send('¡Servidor JWT funcionando!');
});

// Ruta protegida (requiere un JWT válido)
app.get('/protegido', verificarToken, (req, res) => {
  res.json({ message: '¡Acceso concedido a la ruta protegida!', user: req.user });
});

// Ruta para simular el login (genera un token)
app.post('/login', (req, res) => {
  // En una aplicación real, acá se verifican las credenciales del usuario
  const { username } = req.body;

  if (username) {
    const user = { username: username };
    const token = jwt.sign(user, secretKey, { expiresIn: '1m' }); // Genera un token que expira en 1 minuto
    res.json({ token: token });
  } else {
    res.status(400).send('Por favor, proporciona un nombre de usuario.');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});