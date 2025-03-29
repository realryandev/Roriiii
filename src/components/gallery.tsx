import Image from "next/image"
import Link from "next/link"

export default function Gallery() {
  const images = [
    { id: 1, src: "/rori2.jpg", alt: "Rori 1", width: 300, height: 400 },
    { id: 2, src: "/rori3.jpg", alt: "Rori 2", width: 300, height: 400 },
    { id: 3, src: "/rori4.jpg", alt: "Rori 3", width: 300, height: 400 },
  ]

  const videos = [
    { id: 4, src: "/rori5.mp4", width: 300, height: 400 },
    { id: 5, src: "/rori6.mp4", width: 300, height: 400 },
    { id: 6, src: "/rori7.mp4", width: 300, height: 400 },
    { id: 7, src: "/rori8.mp4", width: 300, height: 400 },
  ]

  return (
    <section className="px-4 md:px-8 pb-16 flex flex-wrap">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#d4a5a5]">Explore Rori&apos;s Gallery ✾</h2>

        <div className="grid grid-cols-3 gap-4 space-y-">
          {images.map((image) => (
            <div key={image.id} className="break-inside-avoid rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
              <div className="relative">
                <Link href={image.src}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="w-full h-auto object-cover" /></Link>
              </div>
            </div>
          ))}

          {videos.map((video) => (
            <div key={video.id} className="break-inside-avoid rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <video src={video.src} width={video.width} height={video.height} controls preload="metadata" playsInline className="w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
