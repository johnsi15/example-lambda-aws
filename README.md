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


