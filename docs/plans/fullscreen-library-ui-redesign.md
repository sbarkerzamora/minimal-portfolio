# Plan: portfolio fullscreen con componentes de bibliotecas

Estado: propuesta para revisión, antes de implementar.

Fuentes consultadas: documentación y registros públicos de septiembre de 2026.

## 1. Objetivo y decisiones del encargo

Reemplazar las composiciones particulares de las secciones por componentes
reales de React Bits, Cult UI y SmoothUI. La variedad debe proceder de las
galerías, carruseles, pestañas y bloques publicados por estas bibliotecas.

- Cada sección principal ocupará exactamente una pantalla, en escritorio,
  tablet, móvil y orientación horizontal.
- El documento se recorre verticalmente entre secciones. Las colecciones se
  recorren horizontalmente dentro de cada sección.
- Utilizar los siete fondos indicados por el usuario, sin sustituirlos por
  aproximaciones hechas a mano.
- Mantener la paleta actual: carbón, blanco cálido y ámbar, junto con Schibsted
  Grotesk y el tema oscuro fijo.
- Utilizar imágenes de placeholder hasta recibir las imágenes definitivas.
- Mantener contenido, traducciones ES/EN, enlaces, CV, GitHub y reservas Cal.com.
- El hero conserva Originkit Ascii Wave, instalado en la iteración anterior.
- Esta entrega es solamente el plan. No instala estas nuevas bibliotecas ni
  modifica la interfaz, las dependencias o la configuración MCP.

**Límite de diseño:** no crear nuevas tarjetas, galerías, timelines, dibujos ASCII
o shaders propios. Se permite componer componentes publicados, conectar datos,
ajustar tamaño y colores y corregir comportamiento para cumplir los requisitos.
Todo componente visual nuevo debe tener una referencia verificable de origen.

## 2. Punto de partida

La implementación actual está en `components/portfolio/portfolio.tsx` y utiliza
Ascii Wave en `hero-wave.tsx`. Los datos proceden de `public/profile.json` y
`lib/profile.ts`. El worktree contiene trabajo previo que debe conservarse.

El nuevo alcance sustituirá la galería asimétrica propia, las columnas del stack,
la línea temporal, las franjas de servicios y el arte de `ascii-artwork.tsx`.
Las reglas anteriores de altura flexible y de un único fondo para todo el
portfolio quedan superadas por este encargo.

Se conservarán las nueve secciones: inicio, recientes, stack, experiencia,
acerca de, catálogo, servicios, actividad y contacto. La altura fullscreen se
aplica a estas secciones principales, no a cada `<section>` interno de una
biblioteca ni al diálogo de reservas.

## 3. Inventario de bibliotecas e instalación

### Cult UI

Fuentes:

- [MCP Server](https://www.cult-ui.com/docs/mcp-server).
- [Catálogo](https://www.cult-ui.com/docs/components/hero-color-panels).

Cult utiliza el MCP y el CLI de shadcn, no requiere un servidor propio separado
para este trabajo. El MCP de shadcn ya está disponible en el entorno.

Namespace documentado, que se añadiría al objeto `registries` de
`components.json` al implementar, conservando las entradas existentes:

```json
{
  "registries": {
    "@cult-ui": "https://cult-ui.com/r/{name}.json"
  }
}
```

También admite instalación por URL directa. La documentación pública y el JSON
de Loading Carousel se han consultado. Una consulta al dominio sin `www` devolvió
429; la URL canónica con `www` permitió leer el componente. Registrar cualquier
fallo real de instalación, sin sustituir componentes silenciosamente.

### React Bits

Fuentes:

- [Instalación](https://reactbits.dev/get-started/installation).
- [Índice oficial para herramientas](https://reactbits.dev/llms.txt).
- Registros `https://reactbits.dev/r/<Nombre>-TS-TW.json`.

Las páginas se renderizan en cliente y la extracción HTML mostró poco contenido;
por eso el inventario se contrastó con el índice oficial, búsquedas del registro
y los tipos y dependencias del código publicado.

Existen variantes JS/TS con CSS/Tailwind. Para este proyecto se elegirán las
variantes **TypeScript + Tailwind**, identificadas con `TS-TW`.
`@react-bits` ya está configurado en `components.json`.

### SmoothUI

Fuentes:

- [Instalación](https://smoothui.dev/docs/guides/installation).
- [Índice de componentes](https://smoothui.dev/llms.txt).
- [Bloques](https://smoothui.dev/docs/blocks).

Ofrece CLI propio y registro shadcn. Se utilizará el registro `@smoothui`, ya
configurado, para mantener una sola vía de instalación. El inventario consultado
incluye 130 componentes y 34 bloques; se seleccionan los relevantes para este
portfolio, no se propone instalar el catálogo completo.

## 4. Inventario funcional y selección

### Componentes candidatos verificados

| Biblioteca / componente                                                                                | Interacción y API observadas                                                                                                                                 | Decisión                                                                                                              |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| React Bits [Accordion Gallery](https://reactbits.dev/components/accordion-gallery)                     | Paneles expansibles, `items`, `trigger`, `orientation`, altura numérica, imágenes, etiquetas y enlaces. GSAP.                                                | Principal para recientes. Requiere corregir su cambio forzado a vertical en móvil.                                    |
| React Bits [Carousel](https://reactbits.dev/components/carousel)                                       | Carrusel de tarjetas con `drag="x"`, indicadores, `baseWidth`, `autoplay`, `loop`; ítems con título, descripción e icono. Motion.                            | Principal para experiencia, con contenido completo y altura adaptable.                                                |
| React Bits [Depth Carousel](https://reactbits.dev/components/depth-carousel)                           | Galería con profundidad, arrastre, teclado, controles, indicadores y `onChange`. Sus ítems son imágenes, no fichas completas. GSAP, sin otro renderer WebGL. | Principal para catálogo, acompañado de la ficha del proyecto activo.                                                  |
| React Bits [Circular Gallery](https://reactbits.dev/components/circular-gallery)                       | Galería circular de imágenes.                                                                                                                                | Inventariada como alternativa visual; no seleccionada para evitar sumar otra escena gráfica.                          |
| React Bits [Stack](https://reactbits.dev/components/stack)                                             | Pila de tarjetas con gestos y transiciones.                                                                                                                  | Inventariada; no necesaria en la selección principal.                                                                 |
| Cult UI [Loading Carousel](https://www.cult-ui.com/docs/components/loading-carousel)                   | Carrusel horizontal basado en shadcn/Embla; `tips`, navegación, indicadores, proporción e `onTipChange`.                                                     | Principal para servicios. Necesita hacer opcional el autoplay y sincronizar los datos ES/EN.                          |
| Cult UI [Feature Carousel](https://www.cult-ui.com/docs/components/feature-carousel)                   | Presentación por pasos con campos de imágenes `step1...step4`, autoplay y control manual.                                                                    | No seleccionado: su contrato de pasos e imágenes encaja peor con las tres ofertas actuales.                           |
| Cult UI [3D Carousel](https://www.cult-ui.com/docs/components/three-d-carousel)                        | Carrusel 3D de fotografías.                                                                                                                                  | Inventariado; se prefiere Depth Carousel por su API explícita de selección y controles.                               |
| Cult UI [Direction Aware Tabs](https://www.cult-ui.com/docs/components/direction-aware-tabs)           | Pestañas horizontales con transición direccional; `tabs: { id, label, content }[]`.                                                                          | Principal para acerca de: perfil, valores y educación.                                                                |
| Cult UI [Minimal Card](https://www.cult-ui.com/docs/components/minimal-card)                           | Primitivas `MinimalCard`, `MinimalCardTitle`, `MinimalCardDescription`, `MinimalCardImage`.                                                                  | Ficha de metadatos cuando una galería solo admite imágenes. No crear otra tarjeta propia.                             |
| Cult UI [Dither Image](https://www.cult-ui.com/docs/components/dither-image)                           | Figura y variantes de revelado con dithering CSS mediante `dither-plugin`; usa `next/image`.                                                                 | Tratamiento de la fotografía de acerca y, donde encaje, placeholders. Sustituye el efecto fotográfico manual.         |
| SmoothUI [Animated Tabs](https://smoothui.dev/docs/components/animated-tabs)                           | Variantes underline/pill/segment, selección controlada, flechas, Home/End y movimiento reducido. Motion.                                                     | Principal para las cuatro categorías tecnológicas, variante underline.                                                |
| SmoothUI [Scrollable Card Stack](https://smoothui.dev/docs/components/scrollable-card-stack)           | El código usa `deltaY`, gestos verticales y `touchAction: none`.                                                                                             | No seleccionado: aunque admita flechas laterales, su navegación gestual es vertical y puede interferir con la página. |
| SmoothUI [Interactive Image Selector](https://smoothui.dev/docs/components/interactive-image-selector) | Cuadrícula para seleccionar imágenes y acciones de selección.                                                                                                | No seleccionado: no es un carrusel de lectura horizontal.                                                             |
| SmoothUI [Infinite Slider](https://smoothui.dev/docs/components/infinite-slider)                       | Banda continua de elementos.                                                                                                                                 | Solo candidato secundario para logos; no sustituye la navegación manual por contenido esencial.                       |
| SmoothUI [Reviews Carousel](https://smoothui.dev/docs/components/reviews-carousel)                     | Carrusel de reseñas.                                                                                                                                         | No seleccionado: el portfolio no contiene testimonios; no inventarlos para usar el componente.                        |
| SmoothUI [Contribution Graph](https://smoothui.dev/docs/components/contribution-graph)                 | Gráfico anual con desplazamiento horizontal; ya está integrado y adaptado en el proyecto.                                                                    | Conservar su procedencia y funciones, ajustando el contenedor fullscreen.                                             |
| SmoothUI [CTA 2 / CtaSplit](https://smoothui.dev/docs/blocks/cta)                                      | Bloque publicado con texto, dos acciones e imagen en composición dividida.                                                                                   | Principal para contacto, conectado a la reserva y CV existentes.                                                      |

Las descripciones del catálogo no se consideran prueba de accesibilidad. Las
adaptaciones necesarias se detallan abajo a partir del código realmente leído.

## 5. Mapa definitivo propuesto por sección

| Sección               | Fondo solicitado                                                     | Componente de contenido propuesto             | Contenido y navegación                                                                                                       |
| --------------------- | -------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Inicio                | Originkit Ascii Wave actual                                          | Hero existente con el componente instalado    | Identidad, resumen, disponibilidad, métricas, CV y GitHub en una pantalla.                                                   |
| Proyectos recientes   | [Topography](https://reactbits.dev/backgrounds/topography)           | React Bits Accordion Gallery                  | Cuatro proyectos, imágenes temporales y selección horizontal; nombre, descripción, tecnologías y enlace del proyecto activo. |
| Stack tecnológico     | [Sliced Waves](https://reactbits.dev/backgrounds/sliced-waves)       | SmoothUI Animated Tabs                        | Cuatro pestañas horizontales, una por categoría. Conservar las 20 tecnologías y la colección de logos.                       |
| Experiencia           | [Scanner](https://reactbits.dev/backgrounds/scanner)                 | React Bits Carousel                           | Cuatro tarjetas horizontales, una por experiencia, con período, empresa, rol, descripción y todos los logros.                |
| Acerca de             | Carbón base, no se indicó otro fondo                                 | Cult Direction Aware Tabs + Dither Image      | Perfil/filosofía/enfoque, valores y educación mediante tres paneles. Usar la fotografía personal disponible.                 |
| Catálogo de proyectos | [Soft Aurora](https://reactbits.dev/backgrounds/soft-aurora)         | React Bits Depth Carousel + Cult Minimal Card | Nueve imágenes navegables con ficha sincronizada: nombre, categoría y enlace. Mantener todos los datos del perfil.           |
| ¿Qué hago?            | [Grainient](https://reactbits.dev/backgrounds/grainient)             | Cult Loading Carousel                         | Tres diapositivas manuales, cada una con imagen temporal, título, descripción y tags del servicio.                           |
| Actividad de GitHub   | [Grid Scan](https://reactbits.dev/backgrounds/grid-scan)             | SmoothUI Contribution Graph existente         | Calendario horizontal por fechas/meses, leyenda, total, procedencia y consulta accesible.                                    |
| POTENCIA TU PROYECTO  | [Faulty Terminal](https://reactbits.dev/backgrounds/faulty-terminal) | SmoothUI CTA 2 / CtaSplit                     | CTA y subtítulo originales, reserva Cal.com, CV e imagen temporal.                                                           |

No se fuerza un carrusel para un único CTA o para el hero. La navegación
horizontal se aplica a las colecciones; el gráfico ya tiene un eje horizontal.
La variedad queda en componentes publicados, no en recreaciones de sus demos.

## 6. Fondos: identificadores, dependencias y paleta

Se verificaron los siete registros `TS-TW`, incluidos sus tipos públicos.

| ID exacto de registro  | Motor/dependencias declaradas                                     | Controles reales para la adaptación                                                                    |
| ---------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `Topography-TS-TW`     | `ogl@^1.0.11`                                                     | `lowColor`, `midColor`, `highColor`, `speed`, `pixelSize`, `glow`, `opacity`, `grainIntensity`.        |
| `SlicedWaves-TS-TW`    | `ogl@^1.0.11`                                                     | `color1`, `color2`, `color3`, `columns`, `rows`, `speed`, `glow`, `opacity`.                           |
| `Scanner-TS-TW`        | `ogl@^1.0.11`                                                     | `color1`, `color2`, `color3`, `speed`, `sweepSpeed`, `scanDirection`, `scanline`, `opacity`.           |
| `SoftAurora-TS-TW`     | `ogl@^1.0.11`                                                     | `color1`, `color2`, `speed`, `brightness`, `colorSpeed`, `enableMouseInteraction`.                     |
| `Grainient-TS-TW`      | `ogl@^1.0.11`                                                     | `color1`, `color2`, `color3`, `timeSpeed`, `grainAmount`, `grainAnimated`, `saturation`.               |
| `GridScan-TS-TW`       | `three@^0.180.0`, `postprocessing@^6.36.0`, `face-api.js@^0.22.2` | `linesColor`, `scanColor`, `scanOpacity`, `enablePost`, `enableWebcam`, `enableGyro`, `showPreview`.   |
| `FaultyTerminal-TS-TW` | `ogl@^1.0.11`                                                     | `tint`, `pause`, `timeScale`, `scanlineIntensity`, `glitchAmount`, `flickerAmount`, `noiseAmp`, `dpr`. |

Reglas de configuración:

- Traducir los tokens actuales al formato que acepte cada API. No conservar los
  violetas/rosas de las demos ni crear una paleta diferente por sección.
- Usar carbón para las zonas bajas, ámbar para la señal y blanco cálido para
  máximos de luz. Controlar brillo/opacidad y colocar una capa oscura de lectura.
- Los fondos siguen su estética original: Topography no se convierte en otro
  shader ASCII ni Soft Aurora en un dibujo generado a mano.
- En Grid Scan: `enableWebcam=false`, `enableGyro=false`, `showPreview=false`,
  `scanOnClick=false`; comenzar con `enablePost=false` para limitar coste.
- En Faulty Terminal: desactivar flicker y aberración cromática, mantener ruido
  y distorsión moderados y no insertar comandos o texto ficticio en la interfaz.
- Desactivar reacciones del fondo al puntero cuando compitan con el arrastre del
  carrusel. El fondo decorativo no captura gestos, clics o foco.

## 7. Ajustes de integración necesarios, sin inventar componentes

### Accordion Gallery

El código actual contiene `max-[520px]:!flex-col`: `orientation="horizontal"`
por sí solo no mantiene la disposición horizontal en móvil.

1. Retirar esa imposición vertical y los tamaños mínimos verticales asociados;
   conservar el diseño, imágenes, expansión y transiciones del componente.
2. Usar `trigger="click"`, `defaultIndex={0}` y navegación por foco/teclado.
3. Medir la altura disponible y pasarla al prop numérico `height`.
4. En pantallas estrechas, contener la galería en desplazamiento horizontal
   nativo. Como punto de partida: ancho interno mínimo de 460 px,
   `expandRatio` cercano a 0,62 y separación de 8 px; comprobar que el panel
   activo cabe y que los paneles colapsados conservan objetivos de 44 px.
5. Corregir flechas para mover también el foco al panel seleccionado. El código
   actual cambia el índice desde el panel enfocado, pero no mueve ese foco.
6. Su API solo admite `image`, `label`, `link`, `alt`: no hay descripción,
   tecnologías ni `onChange`. Añadir un callback de selección mínimo al origen
   instalado y sincronizar la información con las primitivas Minimal Card.
   No presentar esa extensión como una propiedad ya existente del registro.

### Carousel de experiencia

- `CarouselItem` publica `title`, `description: string`, `id`, `icon`.
- Mantener su composición de tarjeta y desplazamiento `drag="x"`.
- Ampliar únicamente la ranura de descripción a contenido React para conservar
  empresa, período y una lista semántica de logros. No aplanarlos en texto truncado.
- Adaptar ancho y alturas rígidas al espacio disponible; `baseWidth` no es una
  API de altura. Mantener `autoplay=false`, `round=false` y controles manuales.
- Completar los nombres accesibles y navegación por teclado donde falten;
  sustituir los iconos de demostración por Phosphor.

### Depth Carousel del catálogo

Sus ítems son `string | { image, alt }`. No admite de forma nativa título,
categoría o enlace. Se utilizará su `onChange(index, item)` para sincronizar una
Minimal Card con los datos del proyecto activo, sin reescribir el carrusel.

Configurar `autoplay=false`, `showControls=true`, `showIndicators=true`, dimensiones
medidas y profundidad reducida en móvil. Las nueve entradas deben ser alcanzables;
no sustituirlas por nueve imágenes sin enlaces o información.

### Loading Carousel de servicios

El registro utiliza Embla y acepta `tips: { text, image, url? }[]`.
Hay tres diferencias concretas respecto de una integración directa:

- El plugin Autoplay se activa siempre; `showProgress=false` no lo desactiva.
  Añadir una opción explícita de autoplay desactivada para este portfolio.
- `displayTips` se inicializa con `useState` y no sigue posteriores cambios de
  `tips`. Sincronizar ES/EN conservando el índice y con `shuffleTips=false`.
- Revisar el cálculo de dirección: no buscar un índice entero dentro de la
  lista de posiciones fraccionales de Embla. Usar índice anterior y nuevo.

Usar navegación e indicadores visibles. Inyectar descripción/tags en la ranura
de contenido existente mediante primitivas de la biblioteca, conservando la
imagen y la estructura del carrusel. Sustituir el `priority` antiguo de todas
las imágenes por carga prioritaria solo donde corresponda a la versión de Next.

### Acerca de y contacto

- Direction Aware Tabs admite contenido React por pestaña: permite conservar
  biografía, cinco valores y educación sin diseñar un widget nuevo.
- Dither Image usa `dither-plugin` y necesita su import en Tailwind 4. Mantener
  texto y controles fuera del marco filtrado; no usar el generador ASCII propio.
- CTA 2 exporta `CtaSplit` con contenido de demo fijo. Parametrizar texto, imagen
  y acciones con el perfil, manteniendo su composición dividida. Reemplazar las
  llamadas de demo por BookingButton y el enlace real al CV.
- Los cambios de altura, datos, eventos y accesibilidad son adaptaciones de
  integración. No autorizan volver a diseñar las tarjetas o crear nuevos shaders.

## 8. Una pantalla por sección, sin perder contenido

### Contrato geométrico

- Nueve contenedores principales identificables, cada uno con `height: 100dvh`,
  `box-sizing: border-box` y fallback `100vh` para navegadores sin `dvh`.
- No utilizar solamente `min-height: 100vh`: permitiría que las secciones se
  alargasen varias pantallas, incumpliendo el encargo.
- La cabecera será fija y su altura real se reservará dentro de cada pantalla,
  incluyendo safe areas. No sumar una cabecera en flujo a un hero de 100dvh.
- Distribución interna: título/contexto, área flexible `minmax(0, 1fr)` y
  controles. Los carruseles no llevan alturas arbitrarias de 500 px que excedan
  el espacio disponible en landscape.
- Medir el área útil mediante ResizeObserver cuando la biblioteca solo acepte
  dimensiones numéricas. Recalcular al cambiar orientación, tamaño o idioma.

### Contenido que no cabe

- Mostrar una entrada o grupo activo por vez mediante el componente horizontal.
- Permitir `overflow-y: auto` dentro del panel de texto activo si su contenido
  excede el área disponible. La sección exterior mantiene su altura de pantalla.
- Conservar botones de navegación fuera de ese scroll para que siempre sean
  visibles. Las imágenes pueden reducir su área; los textos esenciales no se
  ocultan, recortan ni encogen a tamaños ilegibles.
- El scroll interno es una salida para alturas pequeñas o zoom, no la forma
  principal de recorrer las colecciones.
- No capturar la rueda vertical para mover carruseles horizontales. Arrastre
  horizontal, botones y flechas navegan ítems; el desplazamiento vertical nativo
  permite cambiar de sección sin atrapamientos.
- El menú conserva las anclas existentes. Se pueden añadir anclas de catálogo,
  servicios y actividad como navegación, sin crear páginas nuevas.

## 9. Política de imágenes temporales

Las imágenes temporales serán fotografías reales de placeholder, no tarjetas
dibujadas, composiciones ASCII propias ni capturas inventadas de productos.

- Fuentes verificadas: [Picsum 1015](https://picsum.photos/id/1015/info) y
  [Picsum 1018](https://picsum.photos/id/1018/info), con enlace al origen y autor.
  Los ejemplos publicados de Accordion Gallery también utilizan Picsum.
- Durante la implementación, elegir y descargar un conjunto estable a
  `public/placeholders/`, optimizarlo a WebP y registrar su procedencia.
- Preparar formatos horizontales y verticales según el componente. No usar una
  URL aleatoria que cambie en cada render ni depender de la CDN de la biblioteca.
- Cubrir cuatro previews recientes, nueve posiciones del catálogo, tres
  servicios y la imagen del CTA. Un proyecto repetido puede reutilizar la misma
  imagen sin fusionar sus entradas de contenido.
- Avatar y fotografía personal existentes son contenido real y se conservan.
- Mantener rutas de imagen y marca `isPlaceholder` editables desde
  `public/profile.json` o su adaptador de media. Cambiar la imagen definitiva no
  debe requerir modificar JSX ni el componente de la biblioteca.
- Incluir un aviso discreto ES/EN de imagen temporal y alt coherente. Nunca
  describir una foto de paisaje como una captura real de una aplicación.
- Dar dimensiones y `sizes` correctos; cargar primero el slide visible, después
  sus vecinos y diferir las demás imágenes.

## 10. Presupuesto de fondos y movimiento

Se conservan todos los fondos solicitados, pero no se ejecutan simultáneamente.

1. Renderizar contenido y una captura estática del fondo en servidor.
2. Las capturas se obtendrán del componente real configurado con la paleta;
   no se dibujará un fondo sustituto propio.
3. Cargar dinámicamente el renderer de la sección activa. Mantener como máximo
   un fondo animado en ejecución, incluyendo Ascii Wave del hero.
4. Al salir de la sección, desmontar o detener realmente el componente y
   liberar su renderer. Durante el cambio, el resto muestra sus capturas.
5. Con documento oculto, ahorro de datos o movimiento reducido, usar la versión
   estática. La pausa manual persiste entre navegación, idiomas y preferencias.
6. Un control común de pausa con el botón existente debe detener todos los
   fondos activos. No añadir siete controles superpuestos ni un reproductor.
7. Mantener carruseles sin autoplay. Las transiciones se reducen sin bloquear
   selección, enlaces o lectura cuando está activo movimiento reducido.

**Hallazgos de código que condicionan la implementación:**

- Los seis fondos OGL no comparten una propiedad pública de pausa. Poner
  `speed=0` no garantiza detener `requestAnimationFrame`.
- Faulty Terminal sí expone `pause`, pero su bucle sigue solicitando frames;
  esa propiedad por sí sola no cumple el presupuesto fuera de pantalla.
- Grid Scan importa `face-api.js` estáticamente y carga modelos en un efecto
  dependiente de `modelsPath`, separado del flag de webcam. `enableWebcam=false`
  por sí solo no evita esas descargas. Condicionar esa ruta y mover su import a
  carga diferida dentro de la opción de cámara, desactivada en este portfolio.
- Confirmar limpieza de RAF, listeners y contextos al desmontar cada registro.
  No deducir que está resuelto solo porque la imagen deja de verse.
- Verificar compatibilidad de `postprocessing` con Three.js ya instalado;
  no degradar Three.js automáticamente y romper Ascii Wave.

## 11. Instalación prevista después de aprobar el plan

Gestor: pnpm. CLI de componentes: shadcn instalado en el proyecto. Scripts de
Next y validación: Bun. No cambiar versiones de Next/React por este trabajo.

Primero revisar los cambios con `--dry-run`, añadir el namespace Cult y confirmar
destinos e importaciones. No usar `--overwrite` sobre componentes existentes.
El CLI admite `--path` para dirigir nuevas piezas cuando no tengan un destino
de registro explícito; revisar los `target` de SmoothUI antes de reubicarlas.

```bash
pnpm exec shadcn add @react-bits/Topography-TS-TW @react-bits/SlicedWaves-TS-TW @react-bits/Scanner-TS-TW @react-bits/SoftAurora-TS-TW @react-bits/Grainient-TS-TW @react-bits/GridScan-TS-TW @react-bits/FaultyTerminal-TS-TW --dry-run

pnpm exec shadcn add @react-bits/AccordionGallery-TS-TW @react-bits/Carousel-TS-TW @react-bits/DepthCarousel-TS-TW --dry-run

pnpm exec shadcn add @smoothui/animated-tabs @smoothui/cta-2 --dry-run

pnpm exec shadcn add https://cult-ui.com/r/loading-carousel.json https://cult-ui.com/r/direction-aware-tabs.json https://cult-ui.com/r/minimal-card.json https://cult-ui.com/r/dither-image.json --dry-run
```

Tras revisar cada lote, ejecutar su instalación sin `--dry-run` y auditar el
resultado. Los comandos anteriores se documentan, no se han ejecutado aquí.

Dependencias previstas según los registros:

- OGL para seis fondos; Three.js/postprocessing para Grid Scan.
- GSAP para Accordion Gallery y Depth Carousel.
- Motion para Carousel, Cult y SmoothUI seleccionados.
- Embla y su plugin Autoplay llegan con Loading Carousel y su dependencia
  shadcn `carousel`; desactivar el plugin en esta experiencia.
- `dither-plugin` para el tratamiento fotográfico de Cult.
- Revisar importaciones de `react-icons`/`lucide-react` y adaptarlas a Phosphor.
  Eliminar una dependencia de iconos solo después de comprobar sus consumidores.
- Revisar los registros auxiliares `tokens` y `data` que pueda añadir SmoothUI;
  no reemplazar por ellos los tokens del tema ni cargar el contenido de demo.

Preservar las fuentes shadcn ya instaladas. Colocar adaptadores de datos y
viewport en `components/portfolio/`, con imports explícitos a las piezas de
origen. Mantener responsabilidades de servidor/cliente y cargar los fondos
desde límites cliente pequeños.

## 12. Secuencia de implementación

1. **Línea base:** registrar el worktree, contenido y controles actuales;
   actualizar DESIGN/README para que el alcance anterior no siga como regla activa.
2. **Instalación y procedencia:** inspeccionar dry-runs, instalar por lotes y
   registrar origen de cada componente. Sustituir datos de demostración.
3. **Altura de pantalla:** construir los contenedores fullscreen y medir sus
   áreas útiles antes de integrar los fondos animados.
4. **Contenido horizontal:** conectar componentes y todas las colecciones;
   aplicar las adaptaciones concretas de la sección 7.
5. **Placeholders:** descargar imágenes estables, conectar metadatos editables
   y aplicar Dither Image donde está propuesto.
6. **Fondos exactos:** instalar sus presets con la paleta actual, generar
   capturas y conectar el gestor de visibilidad/pausa.
7. **Verificación:** probar cada sección e interacción y corregir resultados
   reales antes de dar por terminado el rediseño.

## 13. Criterios de aceptación

- [ ] Todos los componentes visuales nuevos tienen origen en el inventario;
      no quedan las ilustraciones o tarjetas propias sustituidas por este plan.
- [ ] Cada uno de los siete fondos coincide con la sección asignada.
- [ ] Las nueve secciones principales miden `window.innerHeight` con una
      tolerancia de 1 px tras estabilizarse el viewport, sin márgenes externos extra.
- [ ] Verificado a 320, 390, 768, 1024, 1440 y 1920 px, en ES/EN y landscape;
      incluir un viewport de 844 x 390 y zoom de 200%.
- [ ] Las colecciones conservan navegación horizontal también en móvil.
      No se reintroduce el breakpoint vertical de Accordion Gallery.
- [ ] Todos los cuatro recientes, cuatro categorías, cuatro experiencias,
      nueve proyectos y tres servicios son alcanzables y tienen contenido completo.
- [ ] No hay texto esencial truncado ni botones ocultos bajo el header;
      los paneles que lo necesiten pueden desplazarse internamente.
- [ ] Flechas, Tab, Home/End donde apliquen, foco visible, objetivos de 44 px,
      nombres ES/EN y anuncio de selección comprobados en las instancias reales.
- [ ] Los slides inactivos no dejan enlaces invisibles en el orden de foco.
- [ ] La rueda vertical y el gesto vertical permiten navegar la página;
      los carruseles no secuestran ese eje.
- [ ] Los placeholders se reconocen como temporales, son estables y todas sus
      rutas responden. Cambiarlos por imágenes reales no requiere rediseñar componentes.
- [ ] Solo un fondo se anima a la vez; pausa, movimiento reducido, pestaña
      oculta y cambio de sección detienen las llamadas de dibujo, no solo el tiempo.
- [ ] No se solicitan webcam, giroscopio o modelos faciales para Grid Scan.
- [ ] La página mantiene contenido, imágenes estáticas, CV y alternativas
      necesarias cuando JavaScript o WebGL no están disponibles.
- [ ] Idioma, Cal.com, PDF bilingüe, GitHub, metadata y JSON-LD siguen funcionando.
- [ ] Spotify sigue ausente; no se reactiva video en el hero.
- [ ] Pasan `bun run typecheck`, `bun run lint`, `bun run build` y
      `git diff --check`. Documentar capturas y métricas de la nueva implementación,
      sin reutilizar como resultado los valores de la iteración anterior.

## 14. Estado de esta entrega

Se han inventariado fuentes reales, APIs y dependencias, y definido los
reemplazos y adaptaciones. No se han instalado los componentes de este plan,
descargado placeholders ni aplicado la altura fullscreen en esta etapa.

La implementación queda pendiente de aprobar esta selección de componentes.
