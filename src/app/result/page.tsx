/* eslint-disable @next/next/no-img-element */
'use client'

import { ArrowBigLeft, ArrowLeft, Download } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useState } from 'react'

import { ButtonBack } from '@/components/ButtonBack'
import Footer from '@/components/landing/Footer'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useImageStore } from '@/lib/store/images'
import { cn } from '@/lib/utils'

const socialMediaSizes: Record<
  string,
  { height: number; width: number; icon: JSX.Element }
> = {
  'twitter (x)': {
    height: 600,
    width: 1200,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        fill="none"
        viewBox="0 0 1200 1227"
      >
        <path
          fill="#fff"
          d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
        />
      </svg>
    ),
  },

  facebook: {
    height: 630,
    width: 1200,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
        fill="url(#a)"
        className="size-4"
      >
        <defs>
          <linearGradient x1="50%" x2="50%" y1="97.078%" y2="0%" id="a">
            <stop offset="0%" stopColor="#0062E0" />
            <stop offset="100%" stopColor="#19AFFF" />
          </linearGradient>
        </defs>
        <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" />
        <path
          fill="#FFF"
          d="m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"
        />
      </svg>
    ),
  },

  instagram: {
    height: 1080,
    width: 1080,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 256 256"
      >
        <path
          fill="#fff"
          d="M128 23.064c34.177 0 38.225.13 51.722.745 12.48.57 19.258 2.655 23.769 4.408 5.974 2.322 10.238 5.096 14.717 9.575 4.48 4.479 7.253 8.743 9.575 14.717 1.753 4.511 3.838 11.289 4.408 23.768.615 13.498.745 17.546.745 51.723 0 34.178-.13 38.226-.745 51.723-.57 12.48-2.655 19.257-4.408 23.768-2.322 5.974-5.096 10.239-9.575 14.718-4.479 4.479-8.743 7.253-14.717 9.574-4.511 1.753-11.289 3.839-23.769 4.408-13.495.616-17.543.746-51.722.746-34.18 0-38.228-.13-51.723-.746-12.48-.57-19.257-2.655-23.768-4.408-5.974-2.321-10.239-5.095-14.718-9.574-4.479-4.48-7.253-8.744-9.574-14.718-1.753-4.51-3.839-11.288-4.408-23.768-.616-13.497-.746-17.545-.746-51.723 0-34.177.13-38.225.746-51.722.57-12.48 2.655-19.258 4.408-23.769 2.321-5.974 5.095-10.238 9.574-14.717 4.48-4.48 8.744-7.253 14.718-9.575 4.51-1.753 11.288-3.838 23.768-4.408 13.497-.615 17.545-.745 51.723-.745M128 0C93.237 0 88.878.147 75.226.77c-13.625.622-22.93 2.786-31.071 5.95-8.418 3.271-15.556 7.648-22.672 14.764C14.367 28.6 9.991 35.738 6.72 44.155 3.555 52.297 1.392 61.602.77 75.226.147 88.878 0 93.237 0 128c0 34.763.147 39.122.77 52.774.622 13.625 2.785 22.93 5.95 31.071 3.27 8.417 7.647 15.556 14.763 22.672 7.116 7.116 14.254 11.492 22.672 14.763 8.142 3.165 17.446 5.328 31.07 5.95 13.653.623 18.012.77 52.775.77s39.122-.147 52.774-.77c13.624-.622 22.929-2.785 31.07-5.95 8.418-3.27 15.556-7.647 22.672-14.763 7.116-7.116 11.493-14.254 14.764-22.672 3.164-8.142 5.328-17.446 5.95-31.07.623-13.653.77-18.012.77-52.775s-.147-39.122-.77-52.774c-.622-13.624-2.786-22.929-5.95-31.07-3.271-8.418-7.648-15.556-14.764-22.672C227.4 14.368 220.262 9.99 211.845 6.72c-8.142-3.164-17.447-5.328-31.071-5.95C167.122.147 162.763 0 128 0Zm0 62.27C91.698 62.27 62.27 91.7 62.27 128c0 36.302 29.428 65.73 65.73 65.73 36.301 0 65.73-29.428 65.73-65.73 0-36.301-29.429-65.73-65.73-65.73Zm0 108.397c-23.564 0-42.667-19.103-42.667-42.667S104.436 85.333 128 85.333s42.667 19.103 42.667 42.667-19.103 42.667-42.667 42.667Zm83.686-110.994c0 8.484-6.876 15.36-15.36 15.36-8.483 0-15.36-6.876-15.36-15.36 0-8.483 6.877-15.36 15.36-15.36 8.484 0 15.36 6.877 15.36 15.36Z"
        />
      </svg>
    ),
  },

  linkedin: {
    height: 627,
    width: 1200,
    icon: (
      <svg
        className="size-4"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 256 256"
      >
        <path
          d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"
          fill="#0A66C2"
        />
      </svg>
    ),
  },

  youtube: {
    height: 720,
    width: 1280,
    icon: (
      <svg
        viewBox="0 0 256 180"
        className="size-4"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
      >
        <path
          d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
          fill="red"
        />
        <path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z" />
      </svg>
    ),
  },

  tiktok: {
    height: 1920,
    width: 1080,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 256 290"
        className="size-4"
      >
        <path
          fill="#FF004F"
          d="M189.72022 104.42148c18.67797 13.3448 41.55932 21.19661 66.27233 21.19661V78.08728c-4.67694.001-9.34196-.48645-13.91764-1.4554v37.41351c-24.71102 0-47.5894-7.85181-66.27232-21.19563v96.99656c0 48.5226-39.35537 87.85513-87.8998 87.85513-18.11308 0-34.94847-5.47314-48.93361-14.85978 15.96175 16.3122 38.22162 26.4315 62.84826 26.4315 48.54742 0 87.90477-39.33253 87.90477-87.85712v-96.99457h-.00199Zm17.16896-47.95275c-9.54548-10.4231-15.81283-23.89299-17.16896-38.78453v-6.11347h-13.18894c3.31982 18.92715 14.64335 35.09738 30.3579 44.898ZM69.67355 225.60685c-5.33316-6.9891-8.21517-15.53882-8.20226-24.3298 0-22.19236 18.0009-40.18631 40.20915-40.18631 4.13885-.001 8.2529.6324 12.19716 1.88328v-48.59308c-4.60943-.6314-9.26154-.89945-13.91167-.80117v37.82253c-3.94726-1.25089-8.06328-1.88626-12.20313-1.88229-22.20825 0-40.20815 17.99196-40.20815 40.1873 0 15.6937 8.99747 29.28075 22.1189 35.89954Z"
        />
        <path d="M175.80259 92.84876c18.68293 13.34382 41.5613 21.19563 66.27232 21.19563V76.63088c-13.79353-2.93661-26.0046-10.14114-35.18573-20.16215-15.71554-9.80162-27.03808-25.97185-30.3579-44.898H141.8876v189.84333c-.07843 22.1318-18.04855 40.05229-40.20915 40.05229-13.05889 0-24.66039-6.22169-32.00788-15.8595-13.12044-6.61879-22.1179-20.20683-22.1179-35.89854 0-22.19336 17.9999-40.1873 40.20815-40.1873 4.255 0 8.35614.66217 12.20312 1.88229v-37.82254c-47.69165.98483-86.0473 39.93316-86.0473 87.83429 0 23.91184 9.55144 45.58896 25.05353 61.4276 13.98514 9.38565 30.82053 14.85978 48.9336 14.85978 48.54544 0 87.89981-39.33452 87.89981-87.85612V92.84876h-.00099Z" />
        <path
          fill="#00F2EA"
          d="M242.07491 76.63088V66.51456c-12.4384.01886-24.6326-3.46278-35.18573-10.04683 9.34196 10.22255 21.64336 17.27121 35.18573 20.16315Zm-65.54363-65.06015a67.7881 67.7881 0 0 1-.72869-5.45726V0h-47.83362v189.84531c-.07644 22.12883-18.04557 40.04931-40.20815 40.04931-6.50661 0-12.64987-1.54375-18.09025-4.28677 7.34749 9.63681 18.949 15.8575 32.00788 15.8575 22.15862 0 40.13171-17.9185 40.20915-40.0503V11.57073h34.64368ZM99.96593 113.58077V102.8112c-3.9969-.54602-8.02655-.82003-12.06116-.81805C39.35537 101.99315 0 141.32669 0 189.84531c0 30.41846 15.46735 57.22621 38.97116 72.99536-15.5021-15.83765-25.05353-37.51576-25.05353-61.42661 0-47.90014 38.35466-86.84847 86.0483-87.8333Z"
        />
      </svg>
    ),
  },
}

/*
c_thumb, parecido al efecto de usar object-fit:cover
h_1920 altura
w_1880 ancho
f_png cambiar imagen a png
*/
// https://res.cloudinary.com/demo/image/upload/c_thumb,h_1920,w_1080/f_png/woman-blackdress-stairs.jpg

const ResultPage = () => {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const { imageUrl, updatedBgResult } = useImageStore()
  const [mediaSelected, setMediaSelected] = useState('')

  if (imageUrl === '') {
    redirect('/form')
  }

  const handleImageLoad = () => {
    setIsImageLoading(false)
  }

  async function downloadImage(imageSrc: string) {
    let urlImageToDownload = imageSrc

    if (mediaSelected) {
      const { height, width } = socialMediaSizes[mediaSelected]
      const temp = imageSrc.split('upload/')
      const cropMode = 'c_pad'
      temp.splice(1, 0, `upload/${cropMode},h_${height},w_${width}/`)
      urlImageToDownload = temp.join('')
    }

    const image = await fetch(urlImageToDownload)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = `picture-${crypto.randomUUID()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="bg-background w-full max-w-3xl h-full flex flex-col justify-center items-center mx-auto">
      <div className='w-full flex justify-end'>
        <ButtonBack name='Nueva imagen' className='gap-1 mx-5 my-3' />
      </div>
      <section className="mt-10 px-5">
        <div className="grid sm:grid-cols-[1fr,auto,1fr] justify-items-center gap-10 mb-24">
          <figcaption>
            <span className="inline-block mb-4 text-4xl font-semibold">
              Imagen original
            </span>
            <img src={imageUrl} alt="original" className="rounded" />
          </figcaption>

          <div className="relative border border-white h-full flex-1">
            <div className="h-full w-1 bg-white absolute top-0 left-1/2 -translate-x-1/2"></div>
          </div>

          <figcaption>
            <span className="inline-block mb-4 text-4xl font-semibold">
              Imagen creada
            </span>

            <img
              src={updatedBgResult}
              onLoad={handleImageLoad}
              onError={() => setIsImageLoading(false)}
              alt="updated"
              className={cn('rounded', isImageLoading && 'opacity-0 absolute')}
            />
            {isImageLoading ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="original"
                  className="rounded opacity-0 invisible"
                />
                <Skeleton className="size-full absolute top-0 left-0" />
              </div>
            ) : (
              <>
                <div className="mt-2 flex items-center justify-between gap-5">
                  <div className=" flex-1 bg-white/10 rounded p-2 px-4">
                    {/* <Select onValueChange={(value) => setMediaSelected(value)}>
											<SelectTrigger className="w-full">
												<SelectValue
													placeholder="Red social"
													className="!capitalize"
												/>
											</SelectTrigger>
											<SelectContent>
												{Object.entries(socialMediaSizes).map(
													([key, { icon, height, width }]) => (
														<SelectItem
															key={key}
															value={key}
															className="capitalize"
														>
															<div className="flex items-center gap-2 font-semibold	">
																{icon} {key}{' '}
																<span className="opacity-50">
																	({height} x {width})
																</span>
															</div>
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select> */}
                  </div>

                  <Button
                    size="lg"
                    className="items-center gap-2"
                    onClick={() => downloadImage(updatedBgResult)}
                  >
                    <Download className="size-4" />
                    Download
                  </Button>
                </div>
              </>
            )}
          </figcaption>
        </div>
      </section>
    </main>
  )
}

export default ResultPage
