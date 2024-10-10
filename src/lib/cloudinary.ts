import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Configuración de Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadImageToCloudinary = async (image: string) => {
	try {
		const uploadResponse = await cloudinary.uploader.upload(image, {
			folder: 'hackathon',
		})

		fs.unlinkSync(image)
		return uploadResponse
	} catch (error) {
		fs.unlinkSync(image)
		throw new Error('Error uploading image to Cloudinary')
	}
}

const updateBackgroundImage = async (image: string, promp: string) => {
	return cloudinary.image(image, {
		effect: 'gen_background_replace:' + promp,
	})
}

const removebackgroundImage = async (image: string) => {
	return cloudinary.url(image, {
		transformation: [
			{ width: 500, height: 500, crop: 'fill' },
			{ effect: 'background_removal' },
		],
	})
}

export {
	cloudinary,
	uploadImageToCloudinary,
	updateBackgroundImage,
	removebackgroundImage,
}
