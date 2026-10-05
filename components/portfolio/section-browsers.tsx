"use client"

import { ArrowUpRight, Briefcase, GraduationCap } from "@phosphor-icons/react"
import { useId, useState } from "react"
import AccordionGallery from "@/components/react-bits/AccordionGallery"
import Carousel from "@/components/react-bits/Carousel"
import DepthCarousel from "@/components/react-bits/DepthCarousel"
import AnimatedTabs from "@/components/smoothui/animated-tabs"
import { DirectionAwareTabs } from "@/components/cult/direction-aware-tabs"
import {
  MinimalCard,
  MinimalCardTitle,
  MinimalCardDescription,
} from "@/components/cult/minimal-card"
import { LoadingCarousel } from "@/components/cult/loading-carousel"
import {
  DitherImage,
  DitherImageFrame,
  DitherImageContent,
  DitherImageCaption,
} from "@/components/cult/dither-image"
import { TechnologyList } from "@/components/portfolio/technology-list"
import { Button } from "@/components/ui/button"
import { useElementSize } from "@/hooks/use-element-size"
import { getPortfolioMedia } from "@/lib/portfolio-media"
import type { Locale } from "@/lib/portfolio-copy"
import type { PortfolioProfile } from "@/lib/profile"

export function RecentBrowser({
  projects,
  locale,
}: {
  projects: PortfolioProfile["recentProjects"]
  locale: Locale
}) {
  const [active, setActive] = useState(0)
  const { ref: stageRef, height } = useElementSize()
  const project = projects[active]
  const media = getPortfolioMedia("recent", active, locale, project.nombre)
  return (
    <div
      className="requires-js flex h-full min-h-0 flex-col gap-3"
      data-browser="recent"
    >
      <div
        ref={stageRef}
        className="min-h-0 flex-[1.7] overflow-x-auto overflow-y-hidden p-1"
      >
        <div className="h-full min-w-[460px]">
          <AccordionGallery
            height={Math.max(48, height - 8)}
            items={projects.map((item, index) => ({
              image: getPortfolioMedia("recent", index, locale, item.nombre)
                .src,
              alt: getPortfolioMedia("recent", index, locale, item.nombre).alt,
              label: item.nombre,
              link: item.enlace,
            }))}
            defaultIndex={0}
            onActiveChange={setActive}
            trigger="click"
            orientation="horizontal"
            expandRatio={0.62}
            gap={8}
            radius={8}
            tilt={0}
            parallax={0.2}
            duration={0.25}
            accentColor="#efb654"
            overlayColor="#0c0e10"
            textColor="#f4f1ec"
            label={locale === "es" ? "Proyectos recientes" : "Recent projects"}
          />
        </div>
      </div>
      <MinimalCard
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-5 py-4"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-4">
          <MinimalCardTitle>{project.nombre}</MinimalCardTitle>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-11 shrink-0"
          >
            <a
              href={project.enlace}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${locale === "es" ? "Abrir" : "Open"} ${project.nombre}`}
            >
              <ArrowUpRight />
            </a>
          </Button>
        </div>
        <MinimalCardDescription>{project.descripcion}</MinimalCardDescription>
        <p className="px-1 text-xs leading-relaxed text-muted-foreground">
          {project.stack.join(" / ")}
        </p>
        {media.notice && (
          <p className="px-1 text-xs text-muted-foreground">
            {media.notice} · {active + 1}/{projects.length}
          </p>
        )}
      </MinimalCard>
    </div>
  )
}

export function StackBrowser({
  categories,
  locale,
}: {
  categories: PortfolioProfile["stackCategorias"]
  locale: Locale
}) {
  const [active, setActive] = useState("0")
  const id = useId()
  const category = categories[Number(active)]
  return (
    <div
      className="requires-js flex h-full min-h-0 flex-col gap-5"
      data-browser="stack"
    >
      <div className="shrink-0 overflow-x-auto py-1">
        <AnimatedTabs
          tabs={categories.map((item, index) => ({
            id: String(index),
            label: item.nombre,
          }))}
          activeTab={active}
          onChange={setActive}
          layoutId={id}
          label={
            locale === "es"
              ? "Categorías tecnológicas"
              : "Technology categories"
          }
          panelId={`${id}-panel`}
          variant="underline"
        />
      </div>
      <MinimalCard
        className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8"
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
      >
        <MinimalCardTitle className="mb-3 text-2xl sm:text-3xl">
          {category.nombre}
        </MinimalCardTitle>
        <MinimalCardDescription className="mb-7">
          {category.descripcion}
        </MinimalCardDescription>
        <TechnologyList
          technologies={category.tecnologias}
          label={category.nombre}
        />
      </MinimalCard>
    </div>
  )
}

export function ExperienceBrowser({
  experience,
  locale,
}: {
  experience: PortfolioProfile["experience"]
  locale: Locale
}) {
  const { ref: stageRef, width, height } = useElementSize()
  return (
    <div
      ref={stageRef}
      className="requires-js flex h-full min-h-0 items-center justify-center"
      data-browser="experience"
    >
      <Carousel
        baseWidth={Math.min(width, 820)}
        height={height}
        autoplay={false}
        loop={false}
        locale={locale}
        items={experience.map((item, index) => ({
          id: index,
          title: item.rol,
          icon: <Briefcase className="size-4" aria-hidden="true" />,
          description: (
            <>
              <p className="mb-2 font-mono text-primary">{item.periodo}</p>
              <p className="mb-5 font-medium text-foreground">{item.empresa}</p>
              <p>{item.descripcion}</p>
              <ul className="mt-4 flex list-disc flex-col gap-2 pl-5">
                {item.logros.map((logro) => (
                  <li key={logro}>{logro}</li>
                ))}
              </ul>
            </>
          ),
        }))}
      />
    </div>
  )
}

export function AboutBrowser({
  professional,
  education,
  locale,
}: {
  professional: PortfolioProfile["professional"]
  education: PortfolioProfile["education"]
  locale: Locale
}) {
  const tabs = [
    {
      id: 0,
      label: locale === "es" ? "Perfil" : "Profile",
      content: (
        <div className="grid items-start gap-6 md:grid-cols-[0.8fr_1.2fr]">
          <DitherImage className="w-full">
            <DitherImageFrame
              aspectRatio="video"
              size="xs"
              grayscale={0.65}
              contrast={50}
              brightness={1.1}
            >
              <DitherImageContent
                src="/acerca-de.webp"
                alt={
                  locale === "es"
                    ? `${professional.nombre} junto a un río`
                    : `${professional.nombre} beside a river`
                }
                fill
                sizes="(min-width: 1024px) 400px, 100vw"
                className="object-[70%_center]"
              />
            </DitherImageFrame>
            <DitherImageCaption>{professional.nombre}</DitherImageCaption>
          </DitherImage>
          <div className="flex flex-col gap-5 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>{professional.filosofia_trabajo}</p>
            <p>{professional.enfoque}</p>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      label: locale === "es" ? "Valores" : "Values",
      content: (
        <MinimalCard className="p-6">
          <ul className="flex list-disc flex-col gap-5 pl-5 text-base leading-relaxed marker:text-primary">
            {professional.valores.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </MinimalCard>
      ),
    },
    {
      id: 2,
      label: locale === "es" ? "Educación" : "Education",
      content: (
        <MinimalCard className="flex flex-col gap-5 p-6">
          <GraduationCap className="size-7 text-primary" />
          <MinimalCardTitle>{education.institucion}</MinimalCardTitle>
          <MinimalCardDescription>
            {education.descripcion}
          </MinimalCardDescription>
          <ul className="list-disc pl-5 text-sm leading-7 text-muted-foreground">
            {education.certificados_relevantes.map((certificate) => (
              <li key={certificate}>{certificate}</li>
            ))}
          </ul>
          <Button asChild variant="outline" className="min-h-11 w-fit">
            <a
              href={`https://${education.perfil}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {locale === "es" ? "Ver perfil en Platzi" : "View Platzi profile"}
              <ArrowUpRight data-icon="inline-end" />
            </a>
          </Button>
        </MinimalCard>
      ),
    },
  ]
  return (
    <div className="requires-js h-full min-h-0" data-browser="about">
      <DirectionAwareTabs
        tabs={tabs}
        label={locale === "es" ? "Acerca de Stephan" : "About Stephan"}
      />
    </div>
  )
}

export function CatalogBrowser({
  projects,
  locale,
}: {
  projects: PortfolioProfile["featuredProjects"]
  locale: Locale
}) {
  const { ref: stageRef, width, height } = useElementSize()
  const [active, setActive] = useState(0)
  const project = projects[active]
  const media = getPortfolioMedia("catalog", active, locale, project.nombre)
  return (
    <div
      className="requires-js flex h-full min-h-0 flex-col gap-3"
      data-browser="catalog"
    >
      <div ref={stageRef} className="min-h-0 flex-[1.7] overflow-hidden">
        <DepthCarousel
          items={projects.map((item, index) => ({
            image: getPortfolioMedia("catalog", index, locale, item.nombre).src,
            alt: getPortfolioMedia("catalog", index, locale, item.nombre).alt,
          }))}
          cardWidth={Math.min(520, Math.max(220, width * 0.55))}
          cardHeight={Math.max(48, height - 54)}
          depth={width < 640 ? 90 : 170}
          spread={width < 640 ? 35 : 85}
          tilt={18}
          blur={1}
          duration={250}
          loop={false}
          autoplay={false}
          showControls
          showIndicators
          onChange={setActive}
          locale={locale}
          radius={10}
          tint="#0c0e10"
        />
      </div>
      <MinimalCard
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-5 py-4"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-4">
          <MinimalCardTitle>{project.nombre}</MinimalCardTitle>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-11 shrink-0"
          >
            <a
              href={project.enlace}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${locale === "es" ? "Abrir" : "Open"} ${project.nombre}`}
            >
              <ArrowUpRight />
            </a>
          </Button>
        </div>
        <MinimalCardDescription>{project.categoria}</MinimalCardDescription>
        <p className="px-1 text-sm leading-relaxed text-muted-foreground">
          {project.descripcion}
        </p>
        {media.notice && (
          <p className="px-1 text-xs text-muted-foreground">
            {media.notice} · {active + 1}/{projects.length}
          </p>
        )}
      </MinimalCard>
    </div>
  )
}

export function ServicesBrowser({
  services,
  locale,
}: {
  services: PortfolioProfile["services"]
  locale: Locale
}) {
  const { ref: stageRef, height } = useElementSize()
  return (
    <div
      ref={stageRef}
      className="requires-js h-full min-h-0"
      data-browser="services"
    >
      <LoadingCarousel
        mediaHeight={Math.max(40, Math.min(height * 0.48, 380))}
        locale={locale}
        autoplay={false}
        tips={services.items.map((service, index) => {
          const media = getPortfolioMedia(
            "services",
            index,
            locale,
            service.titulo
          )
          return {
            text: service.titulo,
            image: media.src,
            alt: media.alt,
            content: (
              <>
                <p>{service.descripcion}</p>
                <p className="mt-4 text-xs">{service.tags.join(" / ")}</p>
                {media.notice && <p className="mt-4 text-xs">{media.notice}</p>}
              </>
            ),
          }
        })}
      />
    </div>
  )
}
