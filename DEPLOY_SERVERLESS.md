# Deploy de una Lambda en AWS usando Serverless Framework

Esta guía te explica cómo desplegar tu función Lambda (`index.mjs`) en AWS usando Serverless Framework, paso a paso y desde cero.

## 1. Requisitos previos

- Tener una cuenta en AWS ([regístrate aquí](https://aws.amazon.com/)).
- Tener Node.js y npm instalados en tu máquina.
- Instalar Serverless Framework globalmente:

```sh
npm install -g serverless
```

## 2. Configura tus credenciales de AWS

Ejecuta:

```sh
serverless config credentials --provider aws --key TU_AWS_ACCESS_KEY --secret TU_AWS_SECRET_KEY
```

Puedes obtener estas claves desde la consola de AWS, en IAM > Users > Security credentials.

## 3. Crea el archivo de configuración `serverless.yml`

En la raíz de tu proyecto, crea un archivo llamado `serverless.yml` con el siguiente contenido básico:

```yaml
service: ejemplo-lambda-aws
provider:
  name: aws
  runtime: nodejs18.x
  environment:
    RECEIPT_BUCKET: nombre-de-tu-bucket-s3
functions:
  procesarRecibo:
    handler: index.handler
    events:
      - http:
          path: recibo
          method: post
```

- Cambia `nombre-de-tu-bucket-s3` por el nombre real de tu bucket S3.
- Puedes cambiar el nombre de la función y la ruta si lo deseas.

## 4. Despliega tu Lambda

Ejecuta:

```sh
serverless deploy
```

Esto subirá tu código a AWS y creará los recursos necesarios.


## 5. Prueba tu Lambda

### Prueba local rápida

Puedes probar tu función Lambda localmente antes de desplegarla usando:

```sh
npx serverless invoke local --function NOMBRE_DE_TU_FUNCION
```

Reemplaza `NOMBRE_DE_TU_FUNCION` por el nombre definido en tu `serverless.yml` (por ejemplo, `procesarRecibo`).

### Prueba en la nube

Después del deploy, Serverless te mostrará una URL. Puedes probar tu Lambda haciendo un POST a esa URL (por ejemplo, usando Postman o curl).

## 6. Notas importantes

- Si cambias el código, solo ejecuta `serverless deploy` de nuevo para actualizar la Lambda.
- Puedes ver logs con:

```sh
serverless logs -f procesarRecibo
```

---

¡Listo! Con esto puedes desplegar y conectar tu Lambda con AWS usando Serverless Framework, sin experiencia previa.
