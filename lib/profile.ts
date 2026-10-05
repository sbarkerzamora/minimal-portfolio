import profileData from "@/public/profile.json"

type ProfileData = typeof profileData

const sectionIds: Record<string, string> = {
  Inicio: "inicio",
}

function normalizeTitle(title: string) {
  return title
    .toLowerCase()
    .split(" & ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" & ")
}

export const profile = profileData as ProfileData

export const portfolioProfile = {
  professional: profileData.perfil_profesional,
  homeHero: profileData.hero_inicio,
  recentProjects: profileData.hero_proyectos_recientes,
  featuredProjects: profileData.proyectos_destacados,
  stackCategorias: profileData.stack_categorias,
  stats: profileData.estadisticas,
  stack: profileData.stack_tecnologico,
  experience: profileData.experiencia_laboral,
  education: profileData.educacion,
  services: profileData.servicios,
  contact: profileData.contacto,
  en: profileData.en,
  email: profileData.perfil_profesional.enlaces.email,
  navigation: profileData.perfil_profesional.navegacion.map((label) => ({
    label,
    href: `#${sectionIds[label] ?? label.toLowerCase().replaceAll(" ", "-")}`,
  })),
  displayTitle: normalizeTitle(profileData.perfil_profesional.titulo_principal),
}

export type PortfolioProfile = typeof portfolioProfile

export function getPortfolioProfile(locale: "es" | "en"): PortfolioProfile {
  if (locale === "es") return portfolioProfile

  const { en } = profileData
  const recentDescriptions: Record<string, string> = en.hero_proyectos_recientes
  const featuredTranslations: Record<
    string,
    Pick<
      PortfolioProfile["featuredProjects"][number],
      "categoria" | "descripcion"
    > &
      Partial<
        Pick<PortfolioProfile["featuredProjects"][number], "nombre" | "impacto">
      >
  > = en.proyectos_destacados

  return {
    ...portfolioProfile,
    professional: {
      ...portfolioProfile.professional,
      titulo_principal: en.titulo_principal,
      resumen_perfil: en.resumen_perfil,
      descripcion_hero: en.descripcion_hero,
      filosofia_trabajo: en.filosofia_trabajo,
      enfoque: en.enfoque,
      valores: en.valores,
      logros_destacados: en.logros_destacados,
      navegacion: en.navegacion,
    },
    homeHero: {
      ...portfolioProfile.homeHero,
      ...en.hero_inicio,
    },
    recentProjects: portfolioProfile.recentProjects.map((project) => ({
      ...project,
      descripcion: recentDescriptions[project.nombre] ?? project.descripcion,
    })),
    featuredProjects: portfolioProfile.featuredProjects.map((project) => {
      const translation = featuredTranslations[project.nombre]
      const translatedText = {
        nombre: translation?.nombre ?? project.nombre,
        categoria: translation?.categoria ?? project.categoria,
        descripcion: translation?.descripcion ?? project.descripcion,
      }

      return project.impacto === undefined
        ? { ...project, ...translatedText }
        : {
            ...project,
            ...translatedText,
            impacto: translation?.impacto ?? project.impacto,
          }
    }),
    // These translation arrays follow the base order, as in the bilingual CV.
    stackCategorias: portfolioProfile.stackCategorias.map(
      (category, index) => ({
        ...category,
        ...en.stack_categorias[index],
      })
    ),
    experience: portfolioProfile.experience.map((item, index) => ({
      ...item,
      ...en.experiencia_laboral[index],
    })),
    education: {
      ...portfolioProfile.education,
      descripcion: en.educacion.descripcion,
      certificados_relevantes: en.educacion.certificados_relevantes,
    },
    services: {
      ...portfolioProfile.services,
      ...en.servicios,
      items: portfolioProfile.services.items.map((item, index) => ({
        ...item,
        ...en.servicios.items[index],
      })),
    },
    contact: en.contacto,
    navigation: portfolioProfile.navigation.map((item, index) => ({
      ...item,
      label: en.navegacion[index] ?? item.label,
    })),
    displayTitle: normalizeTitle(en.titulo_principal),
  }
}
