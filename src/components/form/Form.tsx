/* eslint-disable @next/next/no-img-element */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown, LoaderCircle, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { uploadPhoto } from '@/app/actions/photos/upload-photo'
import { errorToast, successToast } from '@/components/Toasts'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useImageStore } from '@/lib/store/images'
import { cn } from '@/lib/utils'

import Footer from '../landing/Footer'

const themes = [
	{
		value: 'halloween',
		label: 'Halloween 🎃',
	},
	{
		value: 'navidad',
		label: 'Navidad 🎄',
	},
]

const formSchema = z.object({
	images: z.any(),
	description: z
		.string()
		.min(2, {
			message: 'La descripción es muy corta',
		})
		.optional(),
})

function MainForm() {
	const [open, setOpen] = useState(false)
	const [themeSelected, setThemeSelected] = useState(themes[0].value)
	const [imageError, setImageError] = useState<string | null>(null)
	const [files, setFiles] = useState<File[]>([])

	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const setData = useImageStore((state) => state.setData)

	const onDrop = (acceptedFiles: any) => {
		if (acceptedFiles[0].size >= 10000000) {
			setImageError(
				`Máximo 10 MB, tu archivo pesa ${(acceptedFiles[0].size / 1_000_000).toFixed(1)}MB`,
			)
			errorToast(
				`Máximo 10 MB, tu archivo pesa ${(acceptedFiles[0].size / 1_000_000).toFixed(1)}MB`,
			)
			return
		}
		if (acceptedFiles.length > 1) {
			setImageError('Solo puedes seleccionar 1 imagen')
			errorToast('Solo puedes seleccionar 1 imagen')
			return
		} else {
			setFiles(acceptedFiles)
			setImageError('')
		}
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
		},
		multiple: true,
	})

	const removeFile = (indexToRemove: number) => {
		setFiles((prevFiles) =>
			prevFiles.filter((_, index) => index !== indexToRemove),
		)
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (files.length === 0) {
			errorToast('Por favor selecciona al menos una imagen')
		} else if (themeSelected === '') {
			errorToast('Por favor selecciona una tematica')
		} else {
			const formData = new FormData()
			const firstImage = files[0]

			formData.append('theme', themeSelected)
			formData.append('description', values.description ?? '')
			//! current api only accepts one image
			formData.append('image', firstImage)
			// files.forEach((file, index) => {
			//   formData.append(`imagen-${index}`, file)
			// })

			// 	console.log(key + ':', value)
			// })
			// formData.forEach((value, key) => {

			setIsLoading(true)
			const { ok, data } = await uploadPhoto(formData)

			if (!ok || !data) {
				errorToast('Error al subir las imágenes')
				setIsLoading(false)
			} else {
				console.log(data)
				setIsLoading(false)
				setData(data)
				successToast('Imagen subida')
				router.push('/result')
			}
		}
	}

	return (
		<div className="w-full h-full flex flex-col">
			<section className="w-full flex justify-center items-center mt-16">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full max-w-4xl px-5"
					>
						{/* DROPZONE */}
						{files.length > 0 ? (
							<section
								className={cn(
									'flex flex-wrap items-center bg-white/10 rounded-lg p-5 min-h-[220px] border-[3px] border-transparent',
									themeSelected === 'halloween' && 'bg-orange-500/5',
									themeSelected === 'navidad' && 'bg-green-500/5',
								)}
							>
								{files.map((file, index) => (
									<div
										key={index}
										className="text-sm text-neutral-500 relative shadow"
									>
										<img
											src={URL.createObjectURL(file)}
											alt={`upload-preview-${index}`}
											className="h-[170px] w-auto object-contain rounded-lg shadow-md shadow-black"
										/>
										<button
											type="button"
											onClick={() => removeFile(index)}
											className="bg-rose-500 border-2 border-red-500 hover:bg-rose-600 text-white size-10 grid place-items-center rounded-full absolute -top-3 -right-3 hover:scale-110 transition-all duration-150 ease-linear"
										>
											<Trash2 className="size-5" />
										</button>
									</div>
								))}
							</section>
						) : (
							<div
								{...getRootProps()}
								className={cn(
									'border-[3px] rounded-lg border-dashed border-white/30 opacity-70 transition duration-200 ease-in bg-white/5',
									'hover:opacity-100 hover:border-white/50 min-h-[220px] flex justify-center items-center group',
									isDragActive && 'opacity-100 bg-white/10 border-white/50',
								)}
							>
								<input {...getInputProps()} className="hidden" />
								<FormLabel
									htmlFor="file-upload"
									className="text-neutral-300 flex flex-col gap-y-2 text-center"
								>
									<div className="flex justify-center items-center flex-col">
										<img
											src="https://cdn-icons-png.flaticon.com/128/4131/4131883.png"
											className={cn(
												'w-24 h-auto group-hover:scale-110 transition-all duration-150 group-hover:rotate-6',
												isDragActive && 'rotate-6 scale-110',
											)}
											alt="icon"
										/>
										<span className="text-2xl font-semibold">
											Sube o arrastra tu imagen
										</span>
										<span className="text-base">Max. 1 imagen</span>
									</div>
								</FormLabel>
							</div>
						)}
						{imageError && (
							<span className="text-red-500 !mt-3 block w-full text-start">
								{imageError}
							</span>
						)}

						{/* THEME */}
						<section className="w-full flex gap-x-3 items-center justify-center mb-8 mt-10 relative">
							{themeSelected === 'navidad' && (
								<div className="absolute opacity-40 text-sm -bottom-7 right-0">
									La temporada actual es de{' '}
									<span className="font-semibold">Halloween</span>{' '}
								</div>
							)}
							<div className="text-lg">
								<span>Selecciona un tema</span>
							</div>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className={cn(
											'w-full flex-1 justify-between text-lg border border-transparent',
											themeSelected === 'halloween' && 'border-orange-500',
											themeSelected === 'navidad' && 'border-green-500',
										)}
									>
										{themeSelected
											? themes.find((theme) => theme.value === themeSelected)
													?.label
											: 'Selecciona una tematica'}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandList>
											<CommandGroup>
												{themes.map((theme) => (
													<CommandItem
														key={theme.value}
														value={theme.value}
														onSelect={(currentValue) => {
															setThemeSelected(
																currentValue === themeSelected
																	? ''
																	: currentValue,
															)
															setOpen(false)
														}}
													>
														<Check
															className={cn(
																'mr-2 h-4 w-4',
																themeSelected === theme.value
																	? 'opacity-100'
																	: 'opacity-0',
															)}
														/>
														{theme.label}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</section>

						{/* DESCRIPTION */}
						<label
							htmlFor=""
							className="text-lg inline-block mb-2 text-white/80"
						>
							Agrega una descripción extra para trasnformar tu imagen
						</label>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											placeholder="Ej: Fantasmas alrededor"
											className={cn(
												'resize-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none text-lg',
												{
													'border border-orange-500':
														themeSelected === 'halloween' && files.length > 0,
													'border border-green-500':
														themeSelected === 'navidad' && files.length > 0,
												},
											)}
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-500 text-base" />
								</FormItem>
							)}
						/>

						<button
							type="submit"
							disabled={isLoading || files.length <= 0}
							className={cn(
								'default-button mt-10 flex items-center justify-center gap-2',
								{
									'halloween-button':
										themeSelected === 'halloween' && files.length > 0,
									'navidad-button':
										themeSelected === 'navidad' && files.length > 0,
								},
								'disabled:opacity-50 disabled:pointer-events-none',
							)}
						>
							{isLoading ? 'Cargando...' : 'Generar imagen'}
							{isLoading && <LoaderCircle className="size-5 animate-spin" />}
						</button>
					</form>
				</Form>
			</section>

			<Footer />
		</div>
	)
}

export default MainForm
