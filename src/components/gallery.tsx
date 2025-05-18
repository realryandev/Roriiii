import Image from "next/image";
import Link from "next/link";
import CustomVideoPlayer from "./CustomVideoPlayer"; // Adjust path if needed

export default function Gallery() {
  const images = [
    { id: 1, src: "/rori2.jpg", alt: "Rori 1", width: 300, height: 400 },
    { id: 2, src: "/rori3.jpg", alt: "Rori 2", width: 300, height: 400 },
    { id: 3, src: "/rori4.jpg", alt: "Rori 3", width: 300, height: 400 },
  ];

  const videos = [
    { id: 4, src: "/rori5.mp4", width: 370, height: 400, title: "Rori Video 1" },
    { id: 5, src: "/rori6.mp4", width: 370, height: 400, title: "Rori Video 2" },
    { id: 6, src: "/rori7.mp4", width: 370, height: 400, title: "Rori Video 3" },
    { id: 7, src: "/rori8.mp4", width: 370, height: 400, title: "Rori Video 4" },
  ];

  return (
    <section className="px-4 md:px-8 pb-16 flex flex-col items-center"> {/* Changed to flex flex-col items-center */}
      <div className="max-w-7xl mx-auto w-full"> {/* Added w-full */}
        <h2 className="text-3xl font-bold mb-8 text-center text-[#d4a5a5]">
          Explore Rori&apos;s Gallery ✾
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Adjusted grid for responsiveness and gap */}
          {images.map((image) => (
            <div
              key={image.id}
              className="break-inside-avoid rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              <div className="relative w-full" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}> {/* Aspect ratio box */}
                <Link href={image.src} passHref legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      layout="fill" // Use fill for responsive images within aspect ratio box
                      objectFit="cover"
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </a>
                </Link>
              </div>
            </div>
          ))}

          {videos.map((video) => (
            <div
              key={video.id}
              className="break-inside-avoid rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300" // bg-black for video player
            >
              {/* The CustomVideoPlayer itself will manage its aspect ratio via width/height props */}
              <CustomVideoPlayer
                src={video.src}
                width={video.width} // Pass width
                height={video.height} // Pass height
                // You might want to adjust the actual width/height here or use CSS for responsiveness
                // For a grid, often you want the component to fill the grid cell.
                // The width/height props on CustomVideoPlayer define its internal aspect ratio container.
                // You can add a className to further style its container if needed.
                // For example: className="w-full h-auto" if you want it to fill width and adjust height.
                // However, for a consistent grid, fixed dimensions or aspect ratios are better.
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
