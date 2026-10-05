# Estrategia SEO de la portada

## URLs e idiomas

- La portada española vive en `/` y la inglesa en `/en`. Cada URL sirve su idioma con y sin cookies, incluidos los bots.
- El selector de idioma enlaza ambas versiones sin depender de JavaScript. Cada una publica un canonical propio y enlaces recíprocos `hreflang="es"`, `hreflang="en"` y `x-default`.
- `sitemap.xml` contiene únicamente las dos URLs canónicas y sus alternativas. No se declara `lastmod` hasta contar con una fecha de actualización de contenido fiable.

## Contenido, metadatos y compartición

- Los títulos y descripciones específicos de ES/EN se editan en `public/profile.json` (`hero_inicio.seo` y `en.hero_inicio.seo`). Coinciden con los hechos visibles del perfil; no añaden métricas ni servicios inventados.
- Cada página conserva un único H1, texto visible en el HTML inicial, enlaces descriptivos y el avatar con alt localizado. Las capturas de vista previa se cargan al abrir sus enlaces.
- Open Graph y Twitter apuntan a la imagen social del portfolio, con el título y descripción del idioma correspondiente. La imagen social sigue la portada blanca minimalista.
- Un solo bloque JSON-LD relaciona `Person`, `WebSite` y `ProfilePage`; la identidad apunta a GitHub y no se presenta al profesional como una organización ficticia.

## Rastreabilidad

- `robots.txt` permite acceder a las páginas y a los recursos de `/_next/`; excluye las rutas `/api/` y anuncia el sitemap.
- El canonical no cambia según preferencias guardadas. La localización del documento `<html lang>` la determina la URL.

## Verificación

- Lighthouse SEO 13.5.0 en Chrome 152 móvil contra el servidor local: **100/100** para `/` y `/en` (5 de octubre de 2026). La validación de datos estructurados figura como comprobación manual en Lighthouse.
- Se comprobaron HTML inicial, idiomas con cookies contrarias, títulos, descripciones, canonical, hreflang, un H1, imágenes sociales, sitemap y respuesta de `robots.txt`.
- Tras desplegar: enviar `https://stephanbarker.com/sitemap.xml` a Search Console, probar ambas URLs en [Rich Results Test](https://search.google.com/test/rich-results) o [Schema.org Validator](https://validator.schema.org/), y revisar cobertura e indicadores reales de Core Web Vitals. La puntuación local de Lighthouse no es una medición de campo ni garantiza posiciones de búsqueda.
