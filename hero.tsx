import Image from "next/image";

export default function Hero() {
    return (
        <section className="w-full h-[80vh] relative overflow-hidden">
            <Image src="/rori.jpg" alt="Rori" fill priority className="object-cover" />
        </section>
    )
}
