"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

const SPRING = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
}

export function CtaSplit({
  title,
  description,
  actions,
  image,
  alt,
  notice,
}: {
  title: string
  description: string
  actions: ReactNode
  image: string
  alt: string
  notice?: string
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="mx-auto grid min-h-full max-w-6xl items-center gap-6 md:grid-cols-2 md:gap-12">
        <motion.div
          initial={false}
          transition={shouldReduceMotion ? { duration: 0 } : SPRING}
          viewport={{ once: true }}
          whileInView={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
          }
        >
          <h2
            className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl"
            id="contact-title"
          >
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">{actions}</div>
        </motion.div>

        <motion.div
          className="relative"
          initial={false}
          transition={shouldReduceMotion ? { duration: 0 } : SPRING}
          viewport={{ once: true }}
          whileInView={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
          }
        >
          <div className="relative h-[min(24dvh,240px)] overflow-hidden rounded-xl border border-border shadow-lg md:h-[min(48dvh,440px)]">
            <Image
              alt={alt}
              className="object-cover"
              draggable={false}
              src={image}
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
            />
          </div>
          {notice && (
            <p className="mt-2 text-xs text-muted-foreground">{notice}</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default CtaSplit
