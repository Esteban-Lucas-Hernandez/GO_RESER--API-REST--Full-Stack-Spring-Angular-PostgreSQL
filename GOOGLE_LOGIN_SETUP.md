# Configuración de Inicio de Sesión con Google

## Pasos para configurar el inicio de sesión con Google

### 1. Crear un proyecto en Google Cloud Console

1. Visita [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ si aún no está habilitada

### 2. Configurar credenciales OAuth 2.0

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
3. Si es la primera vez, configura la pantalla de consentimiento OAuth
4. Selecciona "Web application" como tipo de aplicación
5. Agrega las siguientes URIs de redirección:
   - `http://localhost:8080/login/oauth2/code/google` (para desarrollo local)
   - Agrega otras URIs según sea necesario para otros entornos

### 3. Obtener Client ID y Client Secret

Después de crear las credenciales, copia el Client ID y Client Secret.

### 4. Configurar las variables de entorno

Agrega las siguientes variables de entorno a tu sistema o al archivo `.env`:

```
GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
```

### 5. Endpoint de inicio de sesión

La aplicación proporciona los siguientes endpoints para el inicio de sesión con Google:

- `GET /auth/google/login` - Para iniciar sesión con Google
- `POST /auth/google/login` - Alternativa POST para iniciar sesión con Google

### 6. Flujo de autenticación

1. El cliente redirige al usuario a la URL de Google OAuth2
2. El usuario se autentica con su cuenta de Google
3. Google redirige de vuelta a la aplicación con un código de autorización
4. La aplicación intercambia el código por un token de acceso
5. Se obtiene la información del usuario de Google
6. Si el usuario no existe en la base de datos, se crea automáticamente
7. Se genera un JWT token para la sesión del usuario
8. Se devuelve el token JWT al cliente para su uso en solicitudes posteriores

### 7. Prueba del inicio de sesión

Para probar el inicio de sesión con Google, visita la siguiente URL en tu navegador:

```
http://localhost:8080/oauth2/authorization/google
```

Esto iniciará el flujo de autenticación de Google.
