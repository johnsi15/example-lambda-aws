# Introducción a AWS Lambda

## ¿Qué es AWS Lambda?

AWS Lambda es un servicio de computación sin servidor (serverless) que te permite ejecutar código sin tener que aprovisionar ni administrar servidores. Solo pagas por el tiempo de cómputo que consumes.

## Conceptos Básicos

- **Función Lambda:** Es el código que escribes y subes a AWS Lambda. Puede estar en varios lenguajes como Node.js, Python, Java, etc.
- **Evento:** Es lo que desencadena la ejecución de tu función Lambda (por ejemplo, una petición HTTP, un archivo subido a S3, etc).
- **Handler:** Es el punto de entrada de tu función Lambda, es decir, la función que AWS Lambda invoca cuando se ejecuta.

## ¿Cómo funciona?

1. Escribes tu función Lambda.
2. La subes a AWS Lambda.
3. Configuras un evento que la dispare (por ejemplo, una petición HTTP a través de API Gateway).
4. AWS ejecuta tu función solo cuando ocurre el evento.

## Primeros Pasos

### 1. Crear una cuenta en AWS

Regístrate en [AWS](https://aws.amazon.com/).

### 2. Acceder a AWS Lambda

- Ve a la consola de AWS.
- Busca "Lambda" en el buscador de servicios.

### 3. Crear tu primera función Lambda

1. Haz clic en "Create function".
2. Elige "Author from scratch".
3. Dale un nombre a tu función.
4. Elige el lenguaje de programación (por ejemplo, Python 3.9).
5. Haz clic en "Create function".

### 4. Escribir el código

Ejemplo en Python:

```python
def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'body': '¡Hola desde Lambda!'
    }
```

### 5. Probar tu función

- Haz clic en "Test".
- Crea un evento de prueba (puedes dejar el que viene por defecto).
- Haz clic en "Test" de nuevo y verás la respuesta.

## ¿Cómo se conecta Lambda con otros servicios?

Puedes configurar tu Lambda para que se ejecute cuando:

- Se sube un archivo a S3.
- Se inserta un registro en DynamoDB.
- Se recibe una petición HTTP (usando API Gateway).
- Entre otros.

## Buenas prácticas

- Mantén tus funciones pequeñas y enfocadas en una sola tarea.
- Usa variables de entorno para configuraciones.
- Maneja los errores correctamente.
- Usa roles de IAM para dar permisos mínimos necesarios.


## ¿Cómo probar tu Lambda localmente?

Si tienes instalado Serverless Framework, puedes hacer una prueba rápida de tu función Lambda localmente con el siguiente comando:

```sh
npx serverless invoke local --function NOMBRE_DE_TU_FUNCION
```

Reemplaza `NOMBRE_DE_TU_FUNCION` por el nombre definido en tu `serverless.yml` (por ejemplo, `procesarRecibo`).

Más información y pasos detallados para desplegar tu Lambda en AWS están en el archivo [`DEPLOY_SERVERLESS.md`](./DEPLOY_SERVERLESS.md).

## Recursos útiles

- [Documentación oficial de AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Tutorial: Crear una función Lambda](https://docs.aws.amazon.com/lambda/latest/dg/getting-started-create-function.html)
- [AWS Lambda en YouTube (video introductorio)](https://www.youtube.com/watch?v=eOBq__h4OJ4)

## Idempotencia

Se dice que las AWS Lambda (y en general, las funciones serverless) deben ser idempotentes porque AWS puede ejecutar la misma Lambda más de una vez para el mismo evento, ya sea por errores, reintentos automáticos o por la forma en que el sistema garantiza la entrega del evento.

## ¿Qué significa que una función sea idempotente?
Una función es idempotente si ejecutarla una o varias veces con el mismo input produce siempre el mismo resultado y no genera efectos secundarios adicionales.

## ¿Por qué es importante la idempotencia en Lambdas?
- Reintentos automáticos: Si ocurre un error en la entrega o ejecución, AWS puede volver a invocar la Lambda con el mismo evento.

- Garantía de entrega: En sistemas distribuidos, para garantizar que un evento se procese, puede enviarse más de una vez.

- Evitar efectos secundarios: Si tu Lambda, por ejemplo, escribe en una base de datos, envía un correo, o realiza un cobro, y no es idempotente, podrías tener datos duplicados, correos dobles o cobros múltiples.

## Ejemplo simple
Supón que tienes una Lambda que recibe un evento para crear un usuario:

- No idempotente: Si el evento llega dos veces, se crean dos usuarios iguales.
- Idempotente: Si el evento llega dos veces con el mismo identificador, solo se crea un usuario (o se ignora el duplicado).

## Resumen
Las Lambdas deben ser idempotentes para evitar problemas en caso de reintentos o entregas duplicadas de eventos. Así, si la función se ejecuta más de una vez con el mismo input, no genera efectos secundarios indeseados ni datos duplicados.


---

## Resumen de buenas prácticas de codificación para funciones Lambda en Node.js

1. **Separa el controlador de Lambda de la lógica del núcleo**: Facilita las pruebas unitarias y el mantenimiento del código.
   
    ```js
    // core.js
    export function suma(a, b) { return a + b; }
    // handler.mjs
    import { suma } from './core.js';
    export const handler = async (event) => ({ resultado: suma(event.a, event.b) });
    ```

2. **Controla las dependencias**: Empaqueta todas las dependencias necesarias con tu función para evitar cambios inesperados por actualizaciones del entorno de AWS Lambda.
   
    - Usa un archivo `package.json` y ejecuta `npm install` o `pnpm install` antes de empaquetar.

3. **Minimiza la complejidad de las dependencias**: Prefiere frameworks sencillos para reducir el tiempo de arranque (cold start).
   
    - Prefiere usar solo el SDK de AWS y utilidades nativas de Node.js cuando sea posible.

4. **Reduce el tamaño del paquete de implementación**: Solo incluye lo necesario para acelerar la descarga y el desempaquetado.
   
    - Elimina dependencias y archivos no usados antes de desplegar.

5. **Reutiliza el entorno de ejecución**: Inicializa clientes de SDK y conexiones fuera del handler para mejorar el rendimiento y reutilizar recursos entre invocaciones.
   
    ```js
    // Se inicializa fuera del handler
    import AWS from 'aws-sdk';
    const s3 = new AWS.S3();
    export const handler = async (event) => { /* usa s3 aquí */ };
    ```

6. **Evita almacenar datos sensibles o de usuario en el entorno de ejecución**: No uses variables globales para datos de usuario o eventos, ya que pueden compartirse entre invocaciones.
   
    ```js
    // INCORRECTO
    let usuarioActual;
    export const handler = async (event) => { usuarioActual = event.user; };
    ```

7. **Utiliza directivas keep-alive para conexiones persistentes**: Configura keep-alive en clientes HTTP/HTTPS para evitar errores por conexiones inactivas.
   
    ```js
    import https from 'https';
    const agent = new https.Agent({ keepAlive: true });
    // Usar agent en peticiones HTTP
    ```

8. **Usa variables de entorno para parámetros operativos**: No codifiques valores sensibles o configuraciones directamente en el código.
   
    ```js
    const bucket = process.env.BUCKET_NAME;
    ```

9. **Evita invocaciones recursivas**: No hagas que la función se invoque a sí misma para prevenir bucles y costos inesperados.
   
    - Si necesitas procesamiento asíncrono, usa colas (SQS) o Step Functions.

10. **No uses APIs no documentadas o privadas**: Limítate a las APIs públicas y documentadas para evitar problemas de compatibilidad.
   
    - Consulta siempre la documentación oficial de AWS.

11. **Escribe código idempotente**: Asegúrate de que la función maneje correctamente eventos duplicados y no genere efectos secundarios adicionales.
   
    ```js
    // Ejemplo: solo crear si no existe
    if (!(await existeRegistro(event.id))) {
      await crearRegistro(event.id);
    }
    ```

Estas prácticas ayudan a crear funciones Lambda más seguras, eficientes, fáciles de mantener y menos propensas a errores en producción.


