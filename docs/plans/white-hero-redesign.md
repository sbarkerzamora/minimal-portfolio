# Inicio blanco minimalista

## Objetivo

Presentar a Stephan Barker en una sola pantalla como **AI Engineer**, con una trayectoria reconocible y acceso directo a sus proyectos recientes. Esta etapa reemplaza la portada multipantalla, sin eliminar sus componentes ni los datos profesionales existentes.

## Dirección

- Lienzo blanco puro, tinta casi negra y gris legible; sin fondos gráficos, iconos, tarjetas ni navegación decorativa.
- Composición centrada horizontal y verticalmente: avatar, nombre, título y una descripción breve. La jerarquía nace del tamaño, el peso y el espacio, usando la Schibsted Grotesk ya instalada.
- La descripción enlaza en contexto a White Shark Media, Asistente Justo y pateperro.online. Ningún enlace se presenta como botón. Al pasar el cursor o enfocar cada enlace externo, una pequeña tarjeta muestra una captura real del destino; el enlace sigue siendo accesible y usable sin JavaScript.
- El hero ocupa todo el ancho y al menos toda la altura visible. En pantallas bajas, zoom o texto ampliado, el contenido determina la altura y se puede desplazar sin recortes.
- Tema claro predeterminado y alternativa oscura carbón/ámbar, ambas independientes de la apariencia del sistema. El selector guarda la preferencia localmente.
- Selectores de tema e idioma compactos en la esquina superior. ES usa `/` y EN usa `/en`, con URLs estables e independientes de cookies; el perfil y las etiquetas del gráfico se traducen.
- Un botón de contacto al final del hero abre un drawer lateral en escritorio e inferior en móvil. El formulario inline de Cal.com se carga al abrirlo, conserva estados de carga/error y siempre ofrece el enlace directo a la reserva.
- El iframe de Cal.com usa la altura visible del calendario para desplazarse dentro de él. En pantallas bajas, solo el cuerpo del drawer puede desplazarse; el contenedor exterior permanece fijo y mantiene el encabezado y las acciones visibles.
- El calendario de contribuciones permanece estático en móviles; el efecto Decrypt Reveal se reserva para dispositivos con puntero preciso.
- El contenido principal y los controles siguen legibles con JavaScript desactivado; el cambio de preferencias es progresivo.

## Contenido y conservación

- Guardar el texto y los enlaces de inicio en `public/profile.json`, con versión ES/EN. Mantener las demás colecciones y el CV.
- Guardar las rutas de las capturas WebP de vista previa junto a cada enlace en `public/profile.json`, incluida la cuenta de GitHub. Mantener las imágenes fuera del hero hasta que se abre una tarjeta.
- Conservar la portada anterior en `components/portfolio/archive/portfolio-2026.tsx` y sus componentes auxiliares sin tocar, para retomarla si se desea.
- Mantener el idioma en la URL y los metadatos/JSON-LD alineados con el título y resumen de cada versión. Consultar [la estrategia SEO](seo-strategy.md).

## Verificación

- Revisar lectura y reflujo a 320/390/768/1440 px y altura corta, foco de enlaces, contraste y reducción de movimiento.
- Ejecutar typecheck, lint y build con los scripts del proyecto mediante Bun.
