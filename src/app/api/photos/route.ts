import fs from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

import {
	updateBackgroundImage,
	uploadImageToCloudinary,
} from '@/lib/cloudinary'
import prisma from '@/lib/prisma'
import { THEMA } from '@/types'
import { FormOutputData } from '@/types/api/photo'

export async function POST(request: Request) {
	try {
		const formData = await request.formData()

		const image = formData.get('image') as File
		const theme = formData.get('theme') as THEMA
		const description = formData.get('description') as string

		if (!image || !theme || !description) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			)
		}
		const tempDir = path.join(process.cwd(), 'temp')
		const filePath = path.join(tempDir, image.name)

		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir)
		}

		const fileBuffer = await image.arrayBuffer()
		fs.writeFileSync(filePath, Buffer.from(fileBuffer))

		const cloudinaryResult: any = await uploadImageToCloudinary(filePath)
		const imageUrl = cloudinaryResult.secure_url

		// guardar el registro en DB
		await prisma.userImage.create({
			data: {
				path: cloudinaryResult.public_id,
			},
		})
		// hacer el cambio de fondo

		const imageWithBackground = await updateBackgroundImage(
			cloudinaryResult.public_id,
			description || 'with thematics background' + theme,
		)

		const respose: FormOutputData = {
			imageId: imageWithBackground,
			url: imageUrl,
			theme: theme,
			description: description,
		}

		return NextResponse.json(respose, { status: 200 })
	} catch (error: unknown) {
		console.error('Error in POST /api/v1/upload:', error)
		return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
	}
}
