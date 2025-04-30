const jwt = require('jsonwebtoken');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

function verificarToken() {
  readline.question('Por favor, pega el JWT que quieres verificar: ', (token) => {
    if (!token) {
      console.log('No se proporcionó ningún token.');
      readline.close();
      return;
    }

    readline.question('Por favor, ingresa la clave secreta para verificar el token: ', (secretKey) => {
      if (!secretKey) {
        console.log('No se proporcionó ninguna clave secreta.');
        readline.close();
        return;
      }

      try {
        const decoded = jwt.verify(token, secretKey);
        console.log('La firma del token es válida. Payload decodificado:');
        console.log(decoded);
      } catch (error) {
        console.error('La verificación del token falló:', error.message);
      } finally {
        readline.close();
      }
    });
  });
}

// Llama a la función para iniciar el proceso
verificarToken();