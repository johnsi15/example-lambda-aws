import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Initialize the S3 client outside the handler for reuse
const s3Client = new S3Client()

/**
 * Lambda handler for processing orders and storing receipts in S3.
 * @param {Object} event - Input event containing order details
 * @param {string} event.order_id - The unique identifier for the order
 * @param {number} event.amount - The order amount
 * @param {string} event.item - The item purchased
 * @returns {Promise<string>} Success message
 */
export const handler = async event => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event

    const bucketName = process.env.RECEIPT_BUCKET
    if (!bucketName) {
      throw new Error('RECEIPT_BUCKET environment variable is not set')
    }

    const receiptContent = `OrderID: ${data.order_id}\nAmount: $${data.amount.toFixed(2)}\nItem: ${data.item}`
    const key = `receipts/${data.order_id}.txt`

    // Upload the receipt content to S3
    await uploadReceiptToS3(bucketName, key, receiptContent)

    console.log(`Successfully processed order ${data.order_id} and stored receipt in S3 bucket ${bucketName}`)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Recibo guardado correctamente' }),
    }
  } catch (error) {
    console.error(`Failed to process order: ${error.message}`)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Error interno: ' + error.message }),
    }
  }
}

/**
 * Helper function to upload receipt to S3
 * @param {string} bucketName - The S3 bucket name
 * @param {string} key - The S3 object key
 * @param {string} receiptContent - The content to upload
 * @returns {Promise<void>}
 */
async function uploadReceiptToS3(bucketName, key, receiptContent) {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: receiptContent,
    })

    await s3Client.send(command)
  } catch (error) {
    throw new Error(`Failed to upload receipt to S3: ${error.message}`)
  }
}
