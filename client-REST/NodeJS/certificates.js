const fs = require('fs') // Для роботи з файловою системою
const path = require('path') // Для роботи з шляхами файлів
const crypto = require('crypto')
const { execSync } = require('child_process')
const logger = require('./utils/logger')

// Generate certificate function using crypto and OpenSSL
const generateCertificate = () => {
	// Generate ECDSA key pair (P-256)
	const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
		namedCurve: 'prime256v1', // Alternatives: "secp384r1", "secp521r1"
		publicKeyEncoding: { type: 'spki', format: 'pem' },
		privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
	})

	// Write the private key to a temporary file
	const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp-'))
	const keyFilePath = path.join(tmpDir, 'key.pem')
	fs.writeFileSync(keyFilePath, privateKey)

	// Prepare OpenSSL command to generate a self-signed certificate.
	// Adjust the subject as needed.
	const subj = '/CN=example.com/O=Example Inc./C=US'
	const certFilePath = path.join(tmpDir, 'cert.pem')
	const cmd = `openssl req -new -x509 -key "${keyFilePath}" -out "${certFilePath}" -days 365 -subj "${subj}"`

	try {
		execSync(cmd)
	} catch (err) {
		logger.error('Certificate generation using OpenSSL failed:', err)
		process.exit(1)
	}

	// Read the generated certificate
	const certificate = fs.readFileSync(certFilePath, 'utf8')

	// Clean up the temporary directory and files
	fs.rmSync(tmpDir, { recursive: true, force: true })

	return {
		privateKey,
		publicKey,
		certificate
	}
}

// Define the certificates directory and file paths
const certsDir = path.resolve(__dirname, 'certs')
const keyPath = path.join(certsDir, 'key.pem')
const certPath = path.join(certsDir, 'cert.pem')

// Create the certificates directory if it does not exist
if (!fs.existsSync(certsDir)) {
	fs.mkdirSync(certsDir)
}

// Generate and save certificates if they do not already exist
if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
	const pems = generateCertificate()

	fs.writeFileSync(keyPath, pems.privateKey)
	fs.writeFileSync(certPath, pems.certificate)

	logger.info('Сертифікати згенеровані і збережені в директорію cert.')
} else {
	logger.info('Сертифікати вже існують.')
}