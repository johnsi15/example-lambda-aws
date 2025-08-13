# Guía completa: Despliegue de AWS Lambda con Serverless Framework

> Documentación oficial: [Serverless Framework AWS Guide](https://www.serverless.com/framework/docs/providers/aws/guide/intro)

---

## 1. Requisitos previos

- Tener una cuenta en AWS ([regístrate aquí](https://aws.amazon.com/)).
- Tener Node.js y npm instalados ([descargar Node.js](https://nodejs.org/)).
- Instalar Serverless Framework globalmente:
  ```sh
  npm install -g serverless
  ```
  [Guía de instalación Serverless](https://www.serverless.com/framework/docs/getting-started/)

---

## 2. Crear usuario IAM y credenciales en AWS

1. Ve a [IAM en AWS](https://console.aws.amazon.com/iam/).
2. Crea un usuario con permisos de tipo **AdministratorAccess** (solo para pruebas, luego puedes limitarlo).
3. Descarga el `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`.
   [Guía oficial IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)

---

## 3. Configura tu perfil de AWS en tu máquina

Instala AWS CLI si no la tienes:
```sh
sudo apt install awscli
# o
brew install awscli
```

Configura tu perfil:
```sh
aws configure --profile serverless-test
```
Sigue las instrucciones y pon tus claves y región (ej: `us-east-1`).

Puedes ver tus perfiles con:
```sh
aws configure list-profiles
```

---

## 4. Estructura y configuración mínima del proyecto

En la raíz de tu proyecto, crea el archivo `serverless.yml` así:

```yaml
service: ejemplo-lambda-aws
provider:
  name: aws
  runtime: nodejs18.x
  profile: serverless-test
  environment:
    RECEIPT_BUCKET: test-s3-jsdev
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - s3:PutObject
          Resource: arn:aws:s3:::test-s3-jsdev/receipts/*
functions:
  procesarRecibo:
    handler: index.handler
    events:
      - http:
          path: recibo
          method: post
package:
  patterns:
    - node_modules/**
    - index.js
    - index.mjs
    - package.json
```

---

## 5. Instala dependencias y prepara tu Lambda

Ejemplo de instalación del SDK:
```sh
npm install @aws-sdk/client-s3
```

Tu handler debe parsear el body y devolver el formato correcto:

```js
export const handler = async event => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event;
    const bucketName = process.env.RECEIPT_BUCKET;
    if (!bucketName) throw new Error('RECEIPT_BUCKET environment variable is not set');
    const receiptContent = `OrderID: ${data.order_id}\nAmount: $${data.amount.toFixed(2)}\nItem: ${data.item}`;
    const key = `receipts/${data.order_id}.txt`;
    await uploadReceiptToS3(bucketName, key, receiptContent);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Recibo guardado correctamente" })
    };
  } catch (error) {
    console.error(`Failed to process order: ${error.message}`);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error interno: " + error.message })
    };
  }
};
```

---

## 6. Despliega tu Lambda

```sh
serverless deploy --aws-profile serverless-test
# or
serverless deploy --aws-profile serverless-test --stage dev
# or, Si no indicas el profile en el comando (--aws-profile), Serverless Framework usará el perfil definido en la sección provider.profile
serverless deploy
```
Esto subirá tu código y dependencias a AWS.

---

## 7. Prueba tu Lambda

### Prueba local rápida
```sh
npx serverless invoke local --function procesarRecibo --path event.json
```
Donde `event.json` es un archivo con el evento de prueba:
```json
{
  "order_id": "12345",
  "amount": 99.99,
  "item": "Teclado mecánico"
}
```

### Prueba en la nube
Obtén la URL con:
```sh
serverless info --aws-profile serverless-test
```
Haz un POST:
```sh
curl -X POST https://<tu-url>.execute-api.<region>.amazonaws.com/dev/recibo \
  -H "Content-Type: application/json" \
  -d '{"order_id":"12345","amount":99.99,"item":"Teclado mecánico"}'
```

---

## 8. Ver logs y errores

```sh
serverless logs -f procesarRecibo --aws-profile serverless-test
```
Aquí verás los errores y mensajes de tu Lambda.

---

## 9. Recursos útiles

- [Serverless Framework AWS Guide](https://www.serverless.com/framework/docs/providers/aws/guide/intro)
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [API Gateway Docs](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [AWS CLI Docs](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

---

¡Listo! Con esta guía puedes crear, desplegar y probar Lambdas en AWS usando Serverless Framework, desde cero y con buenas prácticas.
