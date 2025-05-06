import axios from './axiosBackend'
import fs from 'fs'
import path from 'path'
import logger from './logger'

export default async function saveAsic(uxpParams) {
	const asicDirectory = process.env.ASIC_DIRECTORY
	if (asicDirectory) {
		// Перевірка наявності директорії asic; якщо вона не існує, вона створюється
		if (!fs.existsSync(asicDirectory)) {
			fs.mkdirSync(asicDirectory)
		}
	}

	try {
		const asicQuery = {
			queryId: uxpParams.queryId,
			xRoadInstance: process.env.INSTANCE_NAME,
			memberClass: process.env.CLIENT_MEMBER_CLASS,
			memberCode: process.env.CLIENT_MEMBER_CODE,
			subsystemCode: process.env.CLIENT_SUBSYSTEM
		}
		const asicUrl = `${process.env.PROTOCOL}://${process.env.SECURITY_SERVER_IP}/signature`
		const asicConfig = {
			url: asicUrl,
			method: 'get',
			params: asicQuery,
			responseType: 'arraybuffer' // Important for binary data
		}
		let asicContainerResponse = await axios.request(asicConfig)
		logger.info(
			`Response to asic container request: ${asicContainerResponse.status}.`
		) // Логування статусу відповіді та даних відповіді

		if (asicContainerResponse.status == 200) {
			const filePath = path.join(asicDirectory, `${uxpParams.queryId}.zip`)
			try {
				fs.writeFileSync(filePath, asicContainerResponse.data)
				logger.info(`Asic file saved ${uxpParams.queryId}.zip`)
			} catch (error) {
				logger.error('Error writing file:', error) // Логування помилки
			}
		} else {
			let bufferData = asicContainerResponse.data
			logger.error(`Error: ${bufferData}`) // Логування помилки
		}
	} catch (error) {
		throw error
	}
}
