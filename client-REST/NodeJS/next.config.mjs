/** @type {import('next').NextConfig} */
// next.config.mjs

// Оголошення об'єкту конфігурації Next.js
const nextConfig = {
	// Увімкнення строгого режиму React
	reactStrictMode: true,
	// Змінні середовища для доступу у додатку
	env: {
		PROTOCOL: process.env.PROTOCOL,
		SECURITY_SERVER_IP: process.env.SECURITY_SERVER_IP,
		CERTIFICATE_ALGORITHM: process.env.CERTIFICATE_ALGORITHM,
		INSTANCE_NAME: process.env.INSTANCE_NAME,
		CLIENT_MEMBER_CLASS: process.env.CLIENT_MEMBER_CLASS,
		CLIENT_MEMBER_CODE: process.env.CLIENT_MEMBER_CODE,
		CLIENT_SUBSYSTEM: process.env.CLIENT_SUBSYSTEM,
		ASIC_DIRECTORY: process.env.ASIC_DIRECTORY,
		SERVICE_MEMBER_CLASS: process.env.SERVICE_MEMBER_CLASS,
		SERVICE_MEMBER_CODE: process.env.SERVICE_MEMBER_CODE,
		SERVICE_SUBSYSTEM: process.env.SERVICE_SUBSYSTEM,
		SERVICE_CODE: process.env.SERVICE_CODE,
		SERVICE_VERSION: process.env.SERVICE_VERSION,
		LOG_LEVEL: process.env.LOG_LEVEL,
		LOG_DIRECTORY: process.env.LOG_DIRECTORY,
		ERROR_LOG_FILE_NAME: process.env.ERROR_LOG_FILE_NAME,
		COMBINED_LOG_FILE_NAME: process.env.COMBINED_LOG_FILE_NAME,
		PURPOSE_ID: process.env.PURPOSE_ID
	}
}
// Виведення змінних середовища у консоль, якщо режим не є продакшеном
if (process.env.NODE_ENV !== 'production') {
	console.log('Loaded environment variables:', {
		PROTOCOL: process.env.PROTOCOL,
		SECURITY_SERVER_IP: process.env.SECURITY_SERVER_IP,
		INSTANCE_NAME: process.env.INSTANCE_NAME,
		CLIENT_MEMBER_CLASS: process.env.CLIENT_MEMBER_CLASS,
		CLIENT_MEMBER_CODE: process.env.CLIENT_MEMBER_CODE,
		CLIENT_SUBSYSTEM: process.env.CLIENT_SUBSYSTEM,
		ASIC_DIRECTORY: process.env.ASIC_DIRECTORY,
		SERVICE_MEMBER_CLASS: process.env.SERVICE_MEMBER_CLASS,
		SERVICE_MEMBER_CODE: process.env.SERVICE_MEMBER_CODE,
		SERVICE_SUBSYSTEM: process.env.SERVICE_SUBSYSTEM,
		SERVICE_CODE: process.env.SERVICE_CODE,
		SERVICE_VERSION: process.env.SERVICE_VERSION,
		LOG_LEVEL: process.env.LOG_LEVEL,
		LOG_DIRECTORY: process.env.LOG_DIRECTORY,
		ERROR_LOG_FILE_NAME: process.env.ERROR_LOG_FILE_NAME,
		COMBINED_LOG_FILE_NAME: process.env.COMBINED_LOG_FILE_NAME,
		PURPOSE_ID: process.env.PURPOSE_ID
	})
}
// Експортування об'єкту конфігурації Next.js
export default nextConfig