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
  recentProjects: profileData.hero_proyectos_recientes,
  stackCategorias: profileData.stack_categorias,
  stats: profileData.estadisticas,
  stack: profileData.stack_tecnologico,
  contact: profileData.contacto,
  en: profileData.en,
  email: profileData.perfil_profesional.enlaces.email,
  navigation: profileData.perfil_profesional.navegacion.map((label) => ({
    label,
    href: `#${sectionIds[label] ?? label.toLowerCase().replaceAll(" ", "-")}`,
  })),
  displayTitle: normalizeTitle(profileData.perfil_profesional.titulo_principal),
}
