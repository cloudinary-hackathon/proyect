/* eslint-disable @next/next/no-img-element */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
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
import { cn } from '@/lib/utils'

const themes = [
  {
    value: 'halloween',
    label: 'Halloween',
  },
  {
    value: 'navidad',
    label: 'Navidad',
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
  const [themeSelected, setThemeSelected] = useState('')
  const [imageError, setImageError] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])

  const onDrop = (acceptedFiles: any) => {
    if (acceptedFiles.length > 3) {
      setImageError('Solo puedes seleccionar 3 imagenes')
      errorToast('Solo puedes seleccionar 3 imagenes')
      return
    } else {
      setFiles(acceptedFiles)
      setImageError('')
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
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

      // formData.forEach((value, key) => {
      // 	console.log(key + ':', value)
      // })

      const { ok, data } = await uploadPhoto(formData)

      if (!ok || !data) {
        errorToast('Error al subir las imágenes')
      }

      console.log(data)

      successToast('Imágenes subidas')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-1 md:p-0"
      >
        {/* DROPZONE */}
        {files.length > 0 ? (
          <section className="grid grid-cols-3 gap-1">
            {files.map((file, index) => (
              <div
                key={index}
                className="text-sm text-neutral-500 relative shadow"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`upload-preview-${index}`}
                  className="h-48 w-full object-cover rounded-lg"
                />
                <button
				  type="button"
                  onClick={() => removeFile(index)}
                  className="bg-red-500 text-white rounded-full absolute top-1 right-1 px-2 py-1"
                >
                  &#10005;
                </button>
              </div>
            ))}
          </section>
        ) : (
          <div {...getRootProps()} className="image-dropzone">
            <input {...getInputProps()} className="hidden" />
            <FormLabel
              htmlFor="file-upload"
              className="py-7 text-neutral-300 flex flex-col gap-y-2 text-center"
            >
              <span className="text-xl">Sube o arrastra tu imagen</span>
              <span className="text-sm">Max. 3 imágenes</span>
            </FormLabel>
          </div>
        )}
        {imageError && (
          <span className="text-red-500 text-center">{imageError}</span>
        )}

        {/* THEME */}
        <section className="w-full flex gap-x-3 items-center justify-center">
          <div className="flex-1 text-center">
            <span>Selecciona un tema</span>
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
			  	type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full flex-1 justify-between"
              >
                {themeSelected
                  ? themes.find((theme) => theme.value === themeSelected)?.label
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
                            currentValue === themeSelected ? '' : currentValue,
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Descripción..."
                  className="resize-none border border-neutral-500 outline-none ring-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          className={cn('default-button', {
            'halloween-button': themeSelected === 'halloween',
            'navidad-button': themeSelected === 'navidad',
          })}
        >
          Generar imagen
        </button>
      </form>
    </Form>
  )
}

export default MainForm
