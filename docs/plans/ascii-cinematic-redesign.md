# Plan de rediseno: ASCII Cinematic

Fecha: 2026-09-07.

Estado: aprobado e implementado. Los resultados reales, las desviaciones medidas
y la cobertura pendiente se registran en la seccion 13.

## 1. Objetivo y alcance

Reemplazar el sistema visual actual del portfolio de Stephan Barker por una
identidad oscura basada en la imagen proporcionada: materia digital, trama ASCII,
luz ambar y profundidad cinematografica. No es un cambio de colores sobre el
layout de Spotify: se replantean composicion, tipografia, navegacion, superficies,
controles, estados y movimiento de toda la web.

- Conservar contenido profesional, traducciones ES/EN, enlaces y funcionalidades
  ajenas a Spotify. Mantener `public/profile.json` como fuente principal.
- Usar `public/hero-video.mp4` como fondo del hero. Su URL es `/hero-video.mp4`.
- Mantener la experiencia oscura actual, sin selector ni cambio por preferencias
  guardadas o apariencia del sistema.
- Eliminar completamente reproductor, iframe, SDK, OAuth, rutas, tipos,
  configuracion y dependencias de layout de Spotify.
- Entregar primero este plan. Implementar solamente despues de su aprobacion.
- Fidelidad prevista: interfaz de produccion, responsive y accesible; no un mockup.

Audiencia: fundadores, equipos de producto y colaboradores que evaluan capacidad
tecnica y criterio visual. La accion principal sigue siendo iniciar una
conversacion mediante la reserva existente; proyectos, GitHub y CV aportan prueba.

## 2. Lectura de la referencia

### Rasgos observados y traduccion a interfaz

| Evidencia en la imagen                            | Regla para el nuevo sistema                                                   |
| ------------------------------------------------- | ----------------------------------------------------------------------------- |
| Campo oscuro carbon con siluetas y grandes vacios | Fondo casi negro; espacio negativo real; pocas superficies elevadas.          |
| Caracteres, puntos y signos construyen la imagen  | Trama como material visual del medio, no como tipografia del contenido.       |
| Luz ambar, cobre y blanco luminoso                | Ambar como acento funcional; blanco ligeramente calido como tinta principal.  |
| Azules y violetas apagados en la zona superior    | Conservarlos en el video; no convertirlos en una segunda paleta de botones.   |
| Contraste entre luz difusa y reticula precisa     | Medios atmosfericos con texto y controles nitidos, sin desenfocarlos.         |
| Diagonales que conducen hacia la luz              | Hero con campo visual libre y encuadre intencional, no un mosaico de paneles. |
| Encuadre horizontal con esquinas discretas        | Hero panoramico y radios contenidos; abandonar pastillas y avatar gigante.    |

Direccion elegida: **ASCII Cinematic**, una imagen luminosa codificada en una
superficie oscura, acompanada de composicion grafica sobria. Tres palabras de
voz visual: fosforica, granular, precisa.

Referencias ancla: la imagen del usuario, el video real del repositorio y el
material de una pantalla de fosforo ambar visto de cerca. No se usaran interfaces
de terminal como plantilla, comandos ficticios, cursores parpadeantes, codigo de
relleno ni recursos de marca de Spotify.

Escena de uso: una persona revisa trabajos y trayectoria desde su portatil o
telefono; el encuadre oscuro prolonga el video sin competir con la lectura.
El tema oscuro es una decision explicita del encargo, no una suposicion sobre
las preferencias del visitante.

### Comprobacion del recurso

Se verifico el archivo con metadatos de video y un fotograma real:

- H.264, 832 x 464, 30 fps, 5,2 segundos, sin pista de audio.
- 3.356.567 bytes, aproximadamente 3,2 MiB.
- El fotograma reproduce la estetica ASCII de la referencia; no necesita un
  segundo filtro ASCII ni una conversion WebGL en tiempo real.
- La resolucion y la trama forman parte del caracter visual. Revisar su ampliacion
  en desktop y el recorte en movil, sin prometer detalle inexistente.
- El fotograma de inspeccion es temporal; todavia no existe un poster en `public`.

No se generan maquetas adicionales porque este entorno no dispone de generacion
nativa de imagenes. La direccion se apoya en la referencia y el recurso real,
no en imagenes sinteticas ni placeholders.

## 3. Contrato de contenido y funcionalidad

El estado del worktree es la linea base, no el ultimo commit. Hay cambios locales
previos en interfaz, idiomas, reservas, datos y recursos; no revertirlos ni
reemplazarlos con versiones historicas.

| Contenido actual                                    | Contrato de conservacion                                                                                                   |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Identidad, avatar, titulo, resumen y disponibilidad | Conservar datos y etiquetas actuales. No inventar disponibilidad en tiempo real.                                           |
| Tres metricas: +8, +20, +15                         | Conservar cifras y significado; presentarlas como informacion secundaria.                                                  |
| Cuatro proyectos recientes                          | Justo, Pateperro Android, Tu Menu Digital y pateperro.online backend/frontend; mantener enlaces, descripcion y stack.      |
| Cuatro categorias de stack                          | Web App, Backend/API, Android App y Product Manager Digital; conservar las 20 tecnologias y sus nombres.                   |
| Cuatro experiencias                                 | Justo, pateperro.online, Tu Menu Digital y White Shark Media; conservar periodos, roles, descripciones y logros.           |
| Acerca de                                           | Conservar fotografia, filosofia, enfoque, cinco valores y educacion Platzi.                                                |
| Catalogo de nueve proyectos                         | Conservar nombres, categorias, enlaces y todos sus datos en el perfil. No fusionarlo con recientes ni deduplicar entradas. |
| Tres servicios                                      | Conservar titulos, descripciones y tags.                                                                                   |
| Actividad GitHub                                    | Conservar usuario, consulta, cache, grafico y distincion explicita entre datos reales y fallback.                          |
| Contacto                                            | Conservar CTA, subtitulo, reservas Cal.com y descarga CV. No introducir formulario, CRM ni campos nuevos.                  |
| Idiomas y SEO                                       | Conservar ES/EN, cookie `portfolio_locale`, Server Action, `html lang`, metadata, canonical y JSON-LD.                     |
| CV                                                  | Conservar `/api/cv`, descarga y contenido bilingue completo.                                                               |

Tambien se conservan los campos hoy no visibles: certificados, logros destacados,
imagenes y descripciones extensas de proyectos, email y stack adicional del CV.
El rediseno no es una limpieza del esquema ni una reescritura de la biografia.

Las traducciones de varias colecciones dependen de indices y otras de nombres.
No reordenar ni renombrar datos sin mantener ambas versiones equivalentes.
Las discrepancias previas de contenido se registran, no se corrigen de oficio.

Unicamente se agrega o ajusta microcopy funcional ES/EN para menu, control del
video y estados accesibles. Se elimina el copy exclusivo de Spotify.

## 4. Sistema de diseno propuesto

### Color y tokens

Estrategia: interfaz predominantemente carbon y blanco, con acento ambar en
aproximadamente 5-10% de la superficie funcional. El video puede concentrar mas
color. El esmeralda deja de ser el acento de marca; los colores propios de logos
y fotografias se conservan cuando aportan reconocimiento.

Valores iniciales en OKLCH, pendientes de medir sobre las superficies finales:

| Token semantico            | Propuesta               | Uso                                                              |
| -------------------------- | ----------------------- | ---------------------------------------------------------------- |
| `background`               | `oklch(0.14 0.004 260)` | Lienzo carbon.                                                   |
| `foreground`               | `oklch(0.96 0.008 85)`  | Texto principal, no blanco azulado.                              |
| `card`                     | `oklch(0.19 0.006 260)` | Superficie puntual, no una caja por seccion.                     |
| `popover`                  | `oklch(0.22 0.006 260)` | Menu y dialogo opacos.                                           |
| `secondary`, `muted`       | `oklch(0.24 0.006 260)` | Controles secundarios y zonas de apoyo.                          |
| `muted-foreground`         | `oklch(0.74 0.008 85)`  | Metadatos y texto secundario legible.                            |
| `primary`, `brand`, `ring` | `oklch(0.80 0.145 75)`  | Accion principal, enlaces destacados y foco.                     |
| `primary-foreground`       | `oklch(0.16 0.008 75)`  | Texto oscuro sobre ambar.                                        |
| `accent`                   | `oklch(0.27 0.025 75)`  | Hover o seleccion tenue.                                         |
| `border`                   | `oklch(0.33 0.008 260)` | Separadores decorativos discretos.                               |
| `input`                    | `oklch(0.55 0.012 75)`  | Limites de controles cuando sean necesarios para identificarlos. |
| `destructive`              | `oklch(0.72 0.17 30)`   | Errores, nunca identidad decorativa.                             |

Completar los tokens `*-foreground` con tinta de contraste adecuado y armonizar
`chart-*`. No aplicar busquedas y reemplazos indiscriminados de verde a ambar.
Los cinco niveles del grafico tendran luminancias distinguibles y una leyenda.
Un borde decorativo tenue no sustituye el limite accesible de un control.

El pedido de reemplazar el sistema visual fundamenta cambiar los valores de tema
y la tipografia en `app/globals.css`, manteniendo los nombres semanticos de
shadcn. No editar fuentes bajo `components/ui/*`; adaptar su apariencia mediante
tokens, variantes existentes y composicion del proyecto. Revisar el efecto global
de radios y estados antes de introducir excepciones por componente.

El oscuro actual sigue forzado. No reactivar controles de tema. Las convenciones
generales de `AGENTS.md` sobre claro/oscuro y esmeralda deben alinearse con este
encargo al implementar, conservando todas las instrucciones ajenas al diseno.

### Tipografia

- Familia principal: **Schibsted Grotesk**, elegida por su claridad en interfaces
  y sus formas firmes frente a la textura del video. Catalogo y licencia OFL
  comprobados; no esta instalada todavia.
- Descartar los reflejos Inter, Space Grotesk e IBM Plex Mono. La referencia no
  justifica convertir todo el sitio en una terminal monoespaciada.
- Autoalojar una fuente variable WOFF2 con `next/font/local`, licencia incluida
  y soporte ES/EN. No descargar fuentes de terceros durante una visita ni
  depender de una peticion a Google durante cada build.
- Usar `ui-monospace` solo para fechas, metadatos cortos o leyendas del grafico;
  no cargar una segunda fuente por defecto ni aplicarla al cuerpo.
- Pesos 400, 500 y 700. H1 fluido entre 40 y 88 px, H2 entre 28 y 44 px,
  H3 entre 20 y 26 px, cuerpo 16-18 px, etiquetas 13-14 px.
- Titulares con interlineado 1,04-1,12 y tracking no inferior a -0,04em.
  Cuerpo con interlineado 1,6-1,7 y ancho de 60-70ch.
- `text-wrap: balance` en titulares y `pretty` en parrafos. Probar los nombres
  reales y el texto ingles; no truncar informacion esencial para que encaje.

### Geometria, textura e iconos

- Contenedor centrado de hasta 1200 px; hero visual de hasta 1440 px.
- Margenes laterales de 20 px en movil, 32 px en tablet y 48 px en desktop.
- Escala espacial: 4, 8, 12, 16, 24, 32, 48, 64, 96 y 128 px. Separacion
  entre secciones de 64-112 px, ajustada al contenido; agrupaciones mas compactas.
- Radios pequenos y coherentes, aproximadamente 4-8 px en controles y 8-12 px
  en medios/dialogos. Sin bordes laterales de acento, grandes pastillas ni
  tarjetas anidadas.
- Bordes de 1 px y superficies mates. La luz vive principalmente en el video,
  no en sombras gigantes, glassmorphism o gradientes de texto.
- La trama existente se muestra en el hero. Un eco estatico muy tenue puede
  aparecer en un separador o cierre, fuera del texto; no cubrir toda la pagina.
- Iconos funcionales de `@phosphor-icons/react`, imports SSR donde corresponda;
  sin iconos genericos decorativos sobre cada titulo. Los logos de tecnologias
  existentes siguen siendo marcas, no se reemplazan por iconos inventados.
- Objetivos tactiles de al menos 44 x 44 px. Foco visible en ambar con separacion
  de la superficie; iconos sin texto con nombre accesible.

## 5. Composicion y rediseno por elemento

Se conserva la secuencia de contenido: hero, recientes, stack, experiencia,
acerca, catalogo, servicios, actividad y contacto. La variedad procede de la
composicion, no de agregar secciones ficticias.

| Elemento y archivo actual                         | Nueva presentacion y comportamiento                                                                                                                                                                                                                             |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shell e `IconNavigation`, `spotify-portfolio.tsx` | Renombrar a `portfolio.tsx` / `Portfolio`. Sustituir rail lateral por cabecera superior horizontal; eliminar desplazamiento izquierdo y estructura de aplicacion musical.                                                                                       |
| Cabecera desktop                                  | Nombre como marca tipografica, enlaces de seccion, ES/EN y reserva. Fondo carbon opaco y separador discreto; sticky sin cristal. Cambiar al menu compacto antes de que el texto se comprima.                                                                    |
| `MobileNavigation`                                | Retirar barra inferior. Menu desplegable desde cabecera con los seis destinos, incluido Contacto; cierre al navegar o con Escape, foco y `aria-expanded`. Preferir disclosure simple sobre crear otro modal.                                                    |
| Skip link y anclas                                | Mantener `#inicio`, `#proyectos`, `#stack`, `#experiencia`, `#acerca`, `#contacto`; un `main`, jerarquia de headings y espacio superior para foco bajo cabecera sticky.                                                                                         |
| Hero                                              | Video panoramico de fondo, nombre dominante y bloque textual concentrado en una zona oscura, dejando visible la luz a la derecha. Contenedor centrado, alineacion de texto a la izquierda y espacio para respirar.                                              |
| Avatar y disponibilidad                           | Retrato secundario de aproximadamente 64-80 px, marco discreto sin resplandor. Disponibilidad en texto con pequena senal ambar, sin simular verificacion ni conexion musical.                                                                                   |
| Acciones del hero                                 | Conservar CV y GitHub; eliminar Play de Spotify. CV como accion principal local, GitHub como enlace secundario. La reserva sigue accesible en cabecera y contacto.                                                                                              |
| Metricas                                          | Una linea de datos compactos bajo el resumen o al pie del hero; cifras reales, sin contadores animados ni tres tarjetas gigantes.                                                                                                                               |
| Proyectos recientes                               | Cuatro bloques de trabajo con marca real, titulo, descripcion legible, tecnologias y enlace externo. Dos columnas amplias en desktop, una en movil; reemplazar numero de pista y filas musicales.                                                               |
| Categorias de stack                               | Secciones abiertas por categoria con titulo, descripcion y tecnologias alineadas; sin cuatro cards clonadas. Tags planos de baja jerarquia, sin saturacion de bordes o iconos.                                                                                  |
| `technology-loop.tsx` y `LogoLoop.tsx`            | Sustituir cinta automatica por franja estatica que envuelve logos y nombres. Conservar todas las tecnologias deduplicadas; evitar movimiento permanente fuera del hero.                                                                                         |
| Experiencia                                       | Trayectoria en filas espaciosas, periodo al margen en desktop y sobre el rol en movil. Jerarquia rol/empresa/logros; sin acordeon que esconda contenido ni linea luminosa lateral.                                                                              |
| Acerca y educacion                                | Fotografia personal con encuadre amplio y texto en dos columnas; una columna en movil. Valores como lista sencilla y educacion como bloque tipografico con enlace, sin tarjeta dentro de tarjeta.                                                               |
| Catalogo                                          | Indice de nueve trabajos con nombre, categoria y flecha externa. Retirar numeracion decorativa de pista; hover y foco sobre toda la fila sin ocultar enlaces o datos.                                                                                           |
| Servicios                                         | Tres bloques de oferta separados por espacio y reglas finas, con descripcion y tags. Evitar tres iconos Code y cards identicas; no agregar precios ni CTA inexistentes.                                                                                         |
| `github-activity.tsx`                             | Panel de prueba tecnica sobrio, usuario y total claros, procedencia visible. Escala ambar con leyenda y enlace GitHub. No presentar datos sinteticos como actividad real.                                                                                       |
| `lazy-contribution-graph.tsx`                     | Placeholder con dimensiones estables y mensaje ES/EN. Importar el grafico al acercarse al viewport, sin bloquear contenido anterior.                                                                                                                            |
| `contribution-graph/index.tsx`                    | Ajustar celdas, etiquetas, leyenda y tooltip al sistema; permitir scroll horizontal identificado en movil, no scroll de toda la pagina. Dar acceso por teclado a informacion equivalente sin cientos de tab stops.                                              |
| Contacto                                          | Cierre amplio con el CTA y subtitulo existentes, reserva ambar y CV secundario; sin convertirlo en formulario ni reutilizar una gran card generica.                                                                                                             |
| `booking-dialog.tsx`                              | Redisenar envoltura, titulo, cierre, estados y enlace externo. Mantener dialogo nativo compartido, Escape, foco restaurado, scroll lock y carga diferida del calendario. Configurar el tema oscuro oficial de Cal.com, sin intentar estilizar DOM cross-origin. |
| `language-selector.tsx`                           | ES/EN compacto y legible, seleccion por forma/subrayado ademas del color. Mantener cookie, Server Action, pending, botones deshabilitados y error recuperable.                                                                                                  |
| Botones, enlaces y tags                           | Mismo vocabulario visual en toda la web: primario ambar, secundario outline, terciario ghost/link. Variantes shadcn sin modificar su fuente; eliminar overrides de color aislados del sistema anterior.                                                         |
| `FadeContent.tsx`                                 | Revisar cada uso; entrada breve solo donde marque jerarquia. Suprimir cascadas uniformes sobre todas las secciones y mantener contenido visible antes de hidratar. Retirar GSAP solo si ya no hay consumidores.                                                 |
| `CRTWarp.tsx`                                     | Sustituir por video; retirar este efecto y, si quedan sin usos, `three` y `@types/three`. No conservar un render loop invisible ni introducir otro shader.                                                                                                      |
| Iconos del sitio y Open Graph                     | Redisenar `icon.tsx`, `apple-icon.tsx`, `favicon.ico` y `opengraph-image.tsx`: marca de Stephan, carbon/ambar, tipografia y textura estatica acotada. Sin Spotify; preservar metadata y URLs.                                                                   |
| PDF `/api/cv`                                     | Conservar datos, idiomas y descarga. Mantener soporte de impresion; alinear jerarquia y acento cuando corresponda, sin convertir todas sus paginas en fondos negros.                                                                                            |

No existe un footer independiente que haya que migrar ni se propone agregar
blog, paginas de detalle o nuevas rutas de contenido. Los componentes de
`components/ui/*` no utilizados quedan fuera de la limpieza y no se regeneran.

## 6. Hero de video: contrato tecnico y accesible

Implementar un unico `hero-video.tsx` cliente para el medio y su control;
titular, resumen, enlaces y estructura permanecen renderizados en servidor.

1. Generar `public/hero-poster.webp` desde el video suministrado y verificar su
   encuadre. Mostrarlo en el HTML inicial con espacio reservado y carga prioritaria
   si es candidato LCP. Eliminar la prioridad innecesaria del antiguo avatar grande.
2. Usar video HTML nativo, `muted`, `loop`, `playsInline`, sin audio ni controles
   de reproductor musical. No agregar una libreria de video, iframe o servicio.
3. Render inicial con poster y sin fuente activa de video. Despues de hidratar,
   comprobar movimiento reducido y ahorro de datos, cuando este disponible;
   asignar `/hero-video.mp4` e intentar `play()` solo cuando proceda. `preload`
   por si solo no evita descarga si el navegador recibe autoplay y una fuente.
4. Con `prefers-reduced-motion: reduce`, ahorro de datos o sin JavaScript,
   mantener el poster sin autoplay. Responder a cambios de preferencia en vivo.
5. Incorporar un pequeno control visible y accesible junto al hero:
   "Pausar fondo" / "Reproducir fondo", y sus equivalentes ingleses. Es una
   funcion de accesibilidad del fondo, no un reemplazo del reproductor Spotify.
6. Pausar fuera de viewport o con la pestana oculta. Reanudar solo si sigue
   permitido y no hubo pausa manual; no reiniciar por un cambio ES/EN.
7. Ante rechazo de autoplay, espera o error de red, mantener poster y contenido
   completos. No mostrar un spinner gigante ni bloquear el CTA; informar junto al
   control si un intento manual falla. Solo fundir poster/video cuando haya frame.
8. El medio es decorativo, `aria-hidden`, sin foco. El control queda fuera de ese
   contenedor y es accesible. No necesita subtitulos al no contener narracion ni
   informacion que no este en el HTML.
9. Usar `object-fit: cover` y ajustar `object-position` tras comprobar desktop,
   tablet y movil. Altura flexible segun contenido, no `100vh` rigido ni una
   relacion 16:9 que recorte texto. Reservar siempre la geometria.
10. Aplicar un scrim oscuro localizado bajo el texto, manteniendo visible la
    trama y el foco luminoso. Comprobar contraste a lo largo del clip completo,
    no solo en el poster. No desenfocar o pixelar el texto.

Preservar el MP4 suministrado. Evaluar fast-start y una variante comprimida solo
si la medicion justifica el trabajo y sin degradar la trama. No duplicar descargas
con varias copias activas del video ni presentarlo como optimizado antes de medir.
Revisar continuidad del loop y ausencia de destellos peligrosos en el clip real.

## 7. Retirada completa de Spotify

### Archivos exclusivos a eliminar

- `components/portfolio/spotify-player.tsx`.
- `lib/spotify-auth.ts`.
- `lib/spotify-messages.ts`, actualmente nuevo en el worktree.
- `types/spotify-web-playback.d.ts`.
- `app/api/spotify/login/route.ts`.
- `app/api/spotify/callback/route.ts`.
- `app/api/spotify/token/route.ts`.
- `app/api/spotify/logout/route.ts`.

### Archivos mixtos y configuracion

- Conservar y renombrar `spotify-portfolio.tsx`; contiene el portfolio completo.
  Actualizar import y render en `app/page.tsx`; eliminar props, variables y CTA
  exclusivos de Spotify sin perder el proveedor de reservas ni idioma.
- Eliminar claves `player` ES/EN de `lib/portfolio-copy.ts` y mensajes exclusivos.
- Quitar `.player-range`, sus pseudoestados, `--range-progress` y
  `.spotify-player-dialog` de `app/globals.css`.
- Eliminar el permiso `i.scdn.co` de `next.config.ts`. Conservar PDFKit y
  configuracion Turbopack. Revisar tooltips viejos tras retirar el rail.
- Retirar referencias a `SPOTIFY_CLIENT_ID`, `SPOTIFY_REDIRECT_URI` y
  `SPOTIFY_CONTEXT_URI` de codigo, plantilla de entorno y documentacion vigente.
  Mantener `NEXT_PUBLIC_SITE_URL`; nunca copiar valores secretos al plan.
- No hay paquete npm Spotify instalado: el SDK llega por script remoto.
  No eliminar `pkce-challenge` o `jose` del lockfile, pertenecen al tooling shadcn.
- Retirar iframe `open.spotify.com/embed`, script `sdk.scdn.co`, artwork,
  enlaces de atribucion, namespace `Spotify` y callback global del SDK.
- Eliminar alturas y offsets del player: 56/72 px, variantes embed 224/176 px
  y espaciadores 136/304/88/192 px. Como tambien desaparece la navegacion inferior,
  no dejar una reserva inferior equivalente; conservar safe-area donde corresponda.
- Recalcular margenes de foco y anclas para la nueva cabecera. Eliminar
  `#spotify-player` del contenido sin romper las otras anclas.
- Actualizar `README.md` y sustituir la direccion de `DESIGN.md`. Conservar el
  plan `spotify-home-redesign.md` como registro historico, marcandolo superado
  con enlace a este plan; no borrarlo ni tratarlo como especificacion vigente.

### Despliegue y sesiones previas

La retirada del repositorio no revoca permisos en un proveedor externo. En el
despliegue, revisar las tres variables Spotify y la aplicacion OAuth; revocar o
desactivar solo si es exclusiva del portfolio y con autorizacion del responsable.
No tocar una aplicacion compartida ni asumir acceso a produccion.

Las cookies `spotify_access_token`, `spotify_access_expires_at`,
`spotify_code_verifier`, `spotify_granted_scopes`, `spotify_refresh_token` y
`spotify_oauth_state` existentes son HttpOnly con Path `/api/spotify`; quedaran
sin uso hasta expirar. No conservar endpoints de tokens por compatibilidad ni
borrar `portfolio_locale`. Si se exige expiracion inmediata de sesiones ya
instaladas, acordar ese paso operativo antes de desplegar, sin introducir una
capa permanente para una integracion eliminada.

Regenerar compilacion y tipos de Next para no validar bundles o rutas obsoletos
de `.next`. Una URL antigua con `?spotify=connected#spotify-player` no debe
activar codigo ni solicitudes al proveedor; no requiere una ruta de compatibilidad.

## 8. Estados y movimiento

| Superficie         | Estados que deben quedar disenados y comprobados                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Acciones y enlaces | Reposo, hover, focus-visible, active, disabled cuando proceda; feedback no basado solo en color.                                 |
| Menu movil         | Cerrado, abierto, navegacion y cierre con teclado; sin enlaces enfocables cuando esta oculto.                                    |
| Video              | Poster inicial, cargando, reproduciendo, pausado manualmente, pausa automatica, movimiento reducido, autoplay rechazado y fallo. |
| Selector ES/EN     | Idioma actual, pending, error y recuperacion; control sin saltos de ancho.                                                       |
| Reserva            | Cerrado, abierto, cerrando, loading, ready, failed y timeout; enlace directo disponible incluso si falla el script.              |
| GitHub             | Carga del grafico, datos reales, respaldo explicitamente etiquetado, vacio/fallo y detalle de fecha/conteo accesible.            |
| Imagenes y logos   | Dimensiones reservadas, fallo de imagen sin perder titulo/enlace, tecnologia sin logo con su nombre intacto.                     |

El fallback actual de GitHub genera datos sinteticos, no una copia de actividad
real. Mantener una etiqueta inequivoca y no presentar su total como contribuciones
verificadas. No ampliar esta tarea a cambiar el proveedor de datos.

Microinteracciones de 140-200 ms y apertura de dialogo de hasta 220 ms, con
ease-out y sin rebotes. Entrada del hero breve, sin ocultar el contenido base;
evitar aplicar la misma animacion a todas las secciones. No scroll-jacking,
parallax, cursor personalizado ni animacion continua de la trama por CSS.

`prefers-reduced-motion` elimina entradas y desplazamiento suave, detiene el
video y deja todos los estados utilizables. La pausa debe detener el trabajo,
no solo congelar la apariencia mientras sigue ejecutandose un render loop.

## 9. Implementacion por fases

Registro de ejecucion: las fases de sistema visual, retirada de Spotify, hero,
contenido e interacciones estan implementadas. TypeScript y lint pasaron antes
de editar y despues de la integracion; la compilacion de produccion y pruebas
de navegador finales tambien pasaron. Se mantuvo el worktree como linea base.
No se genero una nueva serie de capturas anterior al rediseno; las capturas de
verificacion corresponden a la interfaz implementada.

Las listas siguientes conservan la matriz original del plan para futuras
regresiones; no sustituyen el registro de resultados de la seccion 13 ni implican
que pruebas de dispositivos no disponibles se hayan ejecutado.

### Fase 0. Linea base

- [ ] Registrar cambios locales y capturas desktop/movil de ambas lenguas sin
      modificar el trabajo existente. Ejecutar validaciones base y anotar fallos previos.
- [ ] Contrastar conteos, enlaces y campos usados por pagina, metadata y CV.
- [ ] Leer las guias instaladas de Next relevantes y las APIs de los componentes
      shadcn que se vayan a componer; no cambiar versiones por este rediseno.

### Fase 1. Contrato visual y recursos

- [ ] Actualizar `DESIGN.md` con tokens, tipografia, ritmo, estados y reglas de
      medios aprobados. Alinear las instrucciones visuales en `PRODUCT.md` y `AGENTS.md`.
- [ ] Incorporar fuente local y licencia; preparar poster desde el MP4.
- [ ] Aplicar tokens en `app/globals.css` y tipografia en `app/layout.tsx`.
      Verificar contraste y primitivas existentes sin tocar `components/ui/*`.
- [ ] Mantener rutas de recursos editables desde el perfil cuando resulte
      practico, sin migrar o sobrescribir su contenido profesional.

### Fase 2. Composicion neutral y retirada

- [ ] Renombrar composicion principal a `Portfolio`, preservando sus datos,
      proveedores y contratos. Actualizar `app/page.tsx`.
- [ ] Eliminar todos los archivos y conexiones Spotify de la seccion 7.
- [ ] Rehacer cabecera desktop, menu movil y anclas; retirar rail, barra inferior
      y reservas de espacio. No agregar una barra sustituta sin necesidad.
- [ ] Comprobar typecheck, lint, idioma, CV y reservas antes de seguir.

### Fase 3. Hero y componentes de contenido

- [ ] Implementar video, poster, scrim y control accesible; retirar CRTWarp.
- [ ] Redisenar avatar, informacion profesional, acciones y metricas.
- [ ] Redisenar recientes, stack, franja de tecnologias, experiencia, acerca,
      educacion, catalogo, servicios y contacto siguiendo la matriz completa.
- [ ] No dividir cada bloque estatico en un archivo nuevo por defecto; extraer
      solo unidades reutilizables o con una frontera cliente/servidor real.

### Fase 4. Interacciones y superficies auxiliares

- [ ] Aplicar el sistema a ES/EN, dialogo Cal.com y todos sus estados.
- [ ] Redisenar grafico GitHub, carga, leyenda y acceso alternativo a detalles.
- [ ] Revisar botones, enlaces, iconos, tags, tooltips, focus, loaders y errores.
- [ ] Actualizar iconos de sitio, Open Graph y presentacion del CV donde proceda.
- [ ] Retirar efectos/imports sin consumidores. Usar pnpm para dependencias y
      regenerar su lockfile; no editar entradas transitivas manualmente.

### Fase 5. Verificacion y cierre

- [ ] Ejecutar la matriz de aceptacion de la seccion 10 y corregir regresiones.
- [ ] Actualizar README, archivar la direccion anterior como superada y documentar
      recursos, configuracion restante y verificaciones realmente realizadas.
- [ ] Revisar diff final y confirmar que no se perdieron cambios ajenos.

## 10. Criterios de aceptacion

### Fidelidad y responsive

- [ ] La referencia se reconoce por material ASCII, contraste luminoso y acento
      ambar; la pagina ya no se percibe como una aplicacion musical repintada.
- [ ] Cada elemento de la matriz tiene tratamiento nuevo y estados coherentes.
      No quedan botones violetas/verdes heredados o cards antiguas aisladas.
- [ ] Capturas a 360, 390, 768, 1024 y 1440 px, incluyendo viewport bajo en
      horizontal, verificadas en ES y EN. Revisar hasta 1920 px el video ampliado.
- [ ] Zoom 200% y reflow a 320 px sin scroll horizontal de pagina ni texto
      cortado. El grafico puede desplazarse dentro de su propio contenedor.
- [ ] Menu, dialogo y video no ocultan foco, CTA o contenido; safe-area correcta.
- [ ] Carga de fuente, poster, fotos y grafico sin saltos de layout visibles.

### Accesibilidad y rendimiento

- [ ] WCAG 2.2 AA: texto normal >= 4,5:1; texto grande, controles y foco >= 3:1
      donde aplique; contraste del hero probado en varios momentos del clip.
- [ ] Teclado completo, skip link, orden de foco, nombres accesibles, Escape y
      restauracion de foco; informacion de GitHub no exclusiva del hover.
- [ ] Pruebas con movimiento reducido, sin JavaScript, ahorro de datos cuando
      exista, autoplay bloqueado y fallo del MP4; poster y contenido permanecen.
- [ ] Cal.com falla de forma recuperable con enlace externo. ES/EN conserva
      selected/pending/error y no reinicia el video por accidente.
- [ ] Safari/iOS y Chromium/Android, ademas de desktop, comprobados cuando el
      entorno permita ejecutarlos; registrar lo no probado sin afirmar cobertura.
- [ ] Objetivos medidos: LCP <= 2,5 s, CLS <= 0,05 e INP <= 200 ms. La prueba de
      laboratorio no sustituye INP de campo; registrar contexto y resultados reales.
- [ ] Sin Three.js en el bundle si su unico consumidor era CRTWarp; ningun
      shader o loop de logos activo. Contenido principal sigue en Server Components.

### Eliminacion de Spotify y conservacion

- [ ] Busqueda sin coincidencias activas de Spotify en `app`, `components`,
      `lib`, `types`, configuracion y plantilla de entorno; excluir dependencias,
      artefactos generados y documentos que registran explicitamente su retirada.
- [ ] Cero solicitudes a `accounts.spotify.com`, `api.spotify.com`,
      `open.spotify.com`, `sdk.scdn.co`, `i.scdn.co` o `/api/spotify/*`, tanto al
      cargar como al navegar, cambiar idioma y abrir reservas.
- [ ] Los cuatro endpoints antiguos devuelven 404 con sus metodos originales:
      GET login/callback y POST token/logout. El build no lista esas rutas.
- [ ] Sin SDK, iframe, globals, nuevas cookies Spotify, espaciador del player
      ni enlace `#spotify-player` en el DOM. Enlaces antiguos no reactivan nada.
- [ ] Conservados los cuatro recientes, cuatro categorias, cuatro experiencias,
      nueve proyectos, tres servicios, cinco valores, educacion y tres metricas.
- [ ] `/api/cv` entrega PDF bilingue; enlaces reales, reservas, GitHub, traduccion,
      `html lang`, metadata, JSON-LD, sitemap y robots siguen funcionando.

Comandos existentes para la implementacion, usando Bun para scripts y pnpm como
gestor de paquetes:

```bash
bun run typecheck
bun run lint
bun run build
git diff --check
```

No hay una suite E2E o un runner de tests de aplicacion instalado. Las pruebas
de navegador y red deben ejecutarse y registrarse, no darse por cubiertas por
TypeScript. Si se automatizan, mantener escenarios pequenos centrados en idioma,
CV, reservas, video y ausencia de Spotify, sin un cambio amplio de tooling.

## 11. Riesgos y decisiones delimitadas

- **Legibilidad frente a atmosfera:** el fondo tiene blancos intensos en
  movimiento; resolver con encuadre y scrim, no con sombras de texto desmedidas.
- **Recursos faltantes:** las imagenes de proyectos/servicios nombradas en JSON
  no estan todas en `public`. Usar logos y composicion textual reales; no activar
  rutas rotas ni inventar screenshots. Avatar y foto de acerca si existen.
- **Fuente y marcas:** incluir licencia, validar caracteres ES/EN y no confundir
  la marca tipografica propia con el logo de Spotify. Las tecnologias sin logo
  mapeado, como Dokploy, Hostinger o Brevo, conservan nombre visible sin huecos.
- **Trabajo local:** idioma, reservas, foto personal y video forman parte de la
  linea base aunque haya archivos sin seguimiento. El rediseno no los descarta.
- **Cal.com externo:** solo controlar envoltura y opciones oficiales. Su diseno
  interno no puede prometer una coincidencia pixel-perfect con el portfolio.
- **Limpieza excesiva:** no tocar backend del CV, datos GitHub, cookies de idioma
  o primitivas shadcn para borrar Spotify. No agregar compatibilidad sin un caso
  real y acordado de sesiones existentes.
- **Alcance:** sin upgrades generales de dependencias, CMS, nuevas paginas,
  filtros, formularios, integraciones o cambios de contenido no solicitados.

## 12. Referencias de implementacion

- `PRODUCT.md`, `DESIGN.md` y el worktree actual como contexto de producto.
- `.opencode/skills/impeccable/reference/brand.md`, `shape.md`, `layout.md`,
  `typeset.md`, `animate.md`, `adapt.md` y `audit.md` segun la fase.
- `.agents/skills/shadcn/SKILL.md` y componentes instalados antes de componer UI.
- `node_modules/next/dist/docs/01-app/02-guides/videos.md`.
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`.
- [Catalogo Schibsted Grotesk](https://fonts.google.com/specimen/Schibsted+Grotesk).
- [Fuente original y licencia OFL](https://github.com/schibsted/schibsted-grotesk).

El usuario aprobo proceder con este plan. La implementacion local se completo
sin modificar credenciales externas ni configuracion del proveedor OAuth.

## 13. Resultado y verificacion

### Implementacion realizada

- `Portfolio` reemplaza la composicion anterior. Cabecera horizontal de servidor,
  disclosure movil nativo y orden visual/teclado coincidente; sin rail, barra
  inferior, reproductor o espaciadores heredados.
- Sistema carbon/blanco/ambar, Schibsted Grotesk local con licencia, nueva
  jerarquia y tratamiento de todas las secciones. Los valores finales de tokens
  estan en `DESIGN.md` y `app/globals.css`; los de la seccion 4 eran la propuesta.
- Video decorativo con poster eager de prioridad alta, control de pausa,
  recuperacion de errores y seguimiento independiente de movimiento reducido
  y ahorro de datos. La pausa manual se conserva entre cambios ES/EN.
- MP4 original intacto. La medicion de transferencia justifico generar
  `public/hero-video.webm` VP9: 1.595.990 bytes frente a 3.356.567 bytes, un 52,4%
  menos. Misma resolucion 832 x 464, 30 fps y 5,2 segundos; fotograma revisado
  visualmente y SSIM global de 0,960652 con cuadros alineados. Los navegadores
  sin soporte VP9 siguen usando `/hero-video.mp4`.
- Fuente local de 70.444 bytes y poster WebP de 72.830 bytes. No hay solicitudes
  a Google Fonts en build ni durante la visita.
- Reservas, selector ES/EN, grafico, leyenda y consulta por fecha adaptados.
  Idioma con mejora progresiva, incluso sin JavaScript, y enlace de reserva
  alternativo visible en contacto sin JavaScript.
- Iconos, favicon, Open Graph y presentacion del CV actualizados. PDF imprimible
  de dos paginas A4, espanol seguido de ingles, con texto y enlaces conservados.
- Retirados cliente, iframe, SDK, OAuth, tipos, mensajes, rutas, estilos y
  configuracion Spotify. Tambien CRTWarp, FadeContent y LogoLoop, y sus
  dependencias sin consumidores: Three.js, GSAP y `@types/three`.
- Conservados los datos profesionales y cambios locales previos. Sin cambios
  a los archivos fuente `components/ui/*`, comprobado mediante Git.

### Comprobaciones ejecutadas

- `bun run typecheck`, `bun run lint`, `bun run build` y `git diff --check`:
  correctos. La lista de rutas del build no contiene Spotify.
- Chromium headless sobre produccion local: ES/EN a 320, 360, 390, 768, 1024,
  1440 y 1920 px. Sin overflow horizontal de pagina, un H1 y conteos preservados
  de recientes, categorias, experiencias, catalogo y servicios.
- Capturas revisadas de hero desktop/movil, proyectos, fotografia y acerca,
  actividad desktop/movil, menu, contacto y dialogo real de Cal.com.
- Menu: seis destinos, apertura, Escape, foco en destino y cierre al salir con
  Tab. Validaciones aisladas adicionales en viewport horizontal bajo.
- Video: reproduccion, pausa manual, cambio ES/EN, pausa fuera de viewport,
  preferencias en vivo, ahorro de datos simulado combinado con movimiento
  reducido, fallo de red que mantiene poster y reintento recuperado.
- Idioma: cookie y documento actualizados, valor invalido rechazado con feedback
  recuperable, y cambio ES/EN mediante formulario nativo con JavaScript desactivado.
- GitHub: carga al aproximarse, un tab stop en reticula, flechas y detalle de
  fecha; pruebas aisladas de anios bisiestos y columnas completas. Fuente
  sintetica explicitamente distinguida de la actividad verificada.
- Cal.com real: script solo despues de abrir, estado listo, iframe oscuro,
  cierre con Escape y foco restaurado. Pruebas aisladas de error, timeout,
  respuesta tardia y reapertura con calendario conservado. No se envio una reserva.
- `/api/cv` entrega 200 y un PDF valido con nombre de descarga conservado.
  Iconos, Open Graph, robots, sitemap, poster y video responden correctamente.
- GET login/callback y POST token/logout bajo `/api/spotify/`: 404. Cero
  peticiones Spotify/scdn al cargar, navegar, cambiar idioma y abrir reservas.
- Ninguna excepcion JavaScript en los escenarios de integracion.

### Medicion de laboratorio

Lighthouse 13.4.1, HeadlessChrome 152, build de produccion servido en loopback.
Corrida final: 2026-09-07, 21:05 UTC. Emulacion movil 412 x 823, CPU x4,
red simulada de 1638,4 Kbps y RTT de 150 ms; no es un telefono fisico.

| Indicador           | Resultado       |
| ------------------- | --------------- |
| Performance         | 93/100          |
| Accessibility       | 100/100         |
| Best Practices      | 100/100         |
| SEO                 | 100/100         |
| FCP / Speed Index   | 1,06 s / 1,06 s |
| LCP                 | 3,28 s          |
| CLS                 | 0,0025          |
| TBT                 | 33 ms           |
| Transferencia total | 1.981.282 bytes |

No quedaron auditorias automaticas de accesibilidad fallidas, incluyendo las
de peso cero. Se corrigio el nombre accesible de la marca movil para incluir
su texto visible SB. Estos resultados no equivalen a certificacion WCAG.

La transferencia bajo desde aproximadamente 3,74 MB con MP4 a 1,98 MB con WebM.
El LCP movil simulado sigue por encima del objetivo de 2,5 s; no se declara ese
objetivo cumplido ni se atribuye una mejora de LCP a la reduccion del video.
El CLS cumple el presupuesto. INP de campo no se ha medido; TBT no lo sustituye.

Vercel Doctor: 99/100 en los archivos modificados detectados por la herramienta,
con una advertencia por falta de politica explicita de cache del PDF. No se
cambio su politica de backend como parte del rediseno.

### Cobertura y pendientes

- Pendiente medir LCP e INP en el despliegue y dispositivos reales, y continuar
  la optimizacion del LCP movil respecto del presupuesto del plan.
- No se ejecutaron Safari/iOS, Android fisico, lector de pantalla real ni una
  auditoria formal de flashes del video. La prueba a 320 px comprueba reflow,
  no reemplaza una sesion manual de zoom 200% en todos los navegadores.
- Las pruebas de componentes con Cal y fallos simulados se distinguen de la
  apertura real del calendario, que tambien fue comprobada.
- El responsable de despliegue debe retirar las variables Spotify obsoletas
  de los entornos que administra y decidir la revocacion de permisos externos.
  No se leyo ni modifico `.env`, ni se borraron cookies de idioma o permisos
  de aplicaciones potencialmente compartidas.
- Los artefactos de esta sesion estan en `/tmp/opencode`: capturas `ascii-*.png`,
  PDF `ascii-integration-cv.pdf`, reporte `ascii-lighthouse.json` y comprobacion
  `ascii-portfolio-check.mjs`. Son artefactos locales, no una suite E2E instalada.
