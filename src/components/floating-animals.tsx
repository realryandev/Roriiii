"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Cat, Dog, Fish, Bird, Rabbit } from "lucide-react"

type Animal = {
  id: number
  Icon: React.ElementType
  x: number
  y: number
  size: number
  rotation: number
  color: string
  delay: number
  duration: number
}

export function FloatingAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([])

  useEffect(() => {
    const icons = [Cat, Dog, Fish, Bird, Rabbit]
    const colors = ["#FFD6E0", "#FFEFCF", "#D5F2E3", "#C5E0F5", "#E9D3FF"]

    const newAnimals = Array.from({ length: 8 }).map((_, i) => {
      return {
        id: i,
        Icon: icons[Math.floor(Math.random() * icons.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 24,
        rotation: Math.random() * 20 - 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 20,
      }
    })

    setAnimals(newAnimals)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {animals.map((animal) => (
        <motion.div
          key={animal.id}
          initial={{
            x: `${animal.x}vw`,
            y: `${animal.y}vh`,
            rotate: animal.rotation,
            opacity: 0,
          }}
          animate={{
            x: [`${animal.x}vw`, `${(animal.x + 20) % 100}vw`, `${(animal.x - 10 + 100) % 100}vw`, `${animal.x}vw`],
            y: [`${animal.y}vh`, `${(animal.y - 15 + 100) % 100}vh`, `${(animal.y + 10) % 100}vh`, `${animal.y}vh`],
            rotate: [animal.rotation, animal.rotation + 10, animal.rotation - 5, animal.rotation],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: animal.duration,
            delay: animal.delay,
            ease: "easeInOut",
          }}
          style={{ position: "absolute" }}
          className="opacity-70"
        >
          <animal.Icon size={animal.size} color={animal.color} strokeWidth={1.5} fill={animal.color} />
        </motion.div>
      ))}
    </div>
  )
}
