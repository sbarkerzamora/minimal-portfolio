import profileData from "@/public/profile.json"
import PDFDocument from "pdfkit"

type Lang = "es" | "en"

export async function GET() {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 48, bottom: 48, left: 56, right: 56 },
    info: {
      Title: `CV - ${profileData.perfil_profesional.nombre}`,
      Author: profileData.perfil_profesional.nombre,
    },
  })

  const chunks: Buffer[] = []
  doc.on("data", (chunk: Buffer) => chunks.push(chunk))

  await new Promise<void>((resolve) => {
    doc.on("end", () => resolve())
    buildPDF(doc, "es")
    doc.addPage()
    buildPDF(doc, "en")
    doc.end()
  })

  const pdfBuffer = Buffer.concat(chunks)

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="Stephan_Barker_CV_Profesional_EN_ES.pdf"',
    },
  })
}

function buildPDF(doc: PDFKit.PDFDocument, lang: Lang) {
  const p = profileData.perfil_profesional
  const en = profileData.en
  const { experiencia_laboral: experienciaES } = profileData
  const experienciaEN = en.experiencia_laboral
  const stack = profileData.stack_tecnologico

  const isES = lang === "es"
  const experiencia = isES ? experienciaES : experienciaEN

  const gray = "#6b7280"
  const emerald = "#059669"
  const black = "#111827"

  const S: {
    title: string
    profile: string
    values: string[]
    categoryLabels: Record<string, string>
    secProfile: string
    secStack: string
    secExperience: string
    secValues: string
  } = {
    title: isES ? p.titulo_principal : en.titulo_principal,
    profile: isES ? p.resumen_perfil : en.resumen_perfil,
    values: isES ? p.valores : en.valores,
    categoryLabels: isES
      ? {
          frontend_moderno: "Frontend Moderno",
          backend_y_datos: "Backend & Datos",
          devops_e_infraestructura: "DevOps & Infraestructura",
          pagos_y_comercio: "Pagos & Comercio",
          herramientas_y_flujo: "Herramientas & Flujo",
        }
      : en.categoryLabels,
    secProfile: isES ? "PERFIL PROFESIONAL" : "PROFESSIONAL PROFILE",
    secStack: isES ? "STACK TECNOLÓGICO" : "TECH STACK",
    secExperience: isES ? "EXPERIENCIA LABORAL" : "WORK EXPERIENCE",
    secValues: isES ? "VALORES" : "VALUES",
  }

  // ── Header ──
  doc.font("Helvetica-Bold").fontSize(28).fillColor(black).text(p.nombre, { align: "left" })
  doc.moveDown(0.2)
  doc.font("Helvetica").fontSize(11).fillColor(emerald).text(S.title, { align: "left" })
  doc.moveDown(0.2)

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(gray)
    .text(
      [
        p.enlaces.portfolio.replace("https://", ""),
        p.enlaces.github.replace("https://", ""),
        p.enlaces.email,
      ].join("  ·  "),
      { align: "left" },
    )
  doc.moveDown(0.6)

  doc.moveTo(56, doc.y).lineTo(559, doc.y).strokeColor("#e5e7eb").lineWidth(1).stroke()
  doc.moveDown(0.6)

  // ── Profile ──
  doc.font("Helvetica-Bold").fontSize(10).fillColor(black).text(S.secProfile)
  doc.moveDown(0.3)
  doc.font("Helvetica").fontSize(9).fillColor(gray).text(S.profile, { align: "justify" })
  doc.moveDown(0.6)

  doc.moveTo(56, doc.y).lineTo(559, doc.y).strokeColor("#e5e7eb").lineWidth(1).stroke()
  doc.moveDown(0.6)

  // ── Stack ──
  doc.font("Helvetica-Bold").fontSize(10).fillColor(black).text(S.secStack)
  doc.moveDown(0.3)

  const xStart = 56
  const yStart = doc.y
  const colWidth = 245
  const rowGap = 16

  Object.entries(stack).forEach(([key, items], i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = xStart + col * (colWidth + 16)
    const y = yStart + row * rowGap * 2.2

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(black)
      .text(S.categoryLabels[key] ?? key, x, y, { width: colWidth })
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(gray)
      .text(items.join(" · "), x, doc.y + 3, { width: colWidth, continued: false })
  })

  doc.moveDown(3.5)

  doc.moveTo(56, doc.y).lineTo(559, doc.y).strokeColor("#e5e7eb").lineWidth(1).stroke()
  doc.moveDown(0.6)

  // ── Experience ──
  doc.font("Helvetica-Bold").fontSize(10).fillColor(black).text(S.secExperience)
  doc.moveDown(0.4)

  for (let i = 0; i < experiencia.length; i++) {
    const exp = experiencia[i]
    const expES = experienciaES[i]
    const title = `${exp.rol} · ${expES?.empresa ?? ""}`
    doc.font("Helvetica-Bold").fontSize(9).fillColor(black).text(title)
    doc.font("Helvetica").fontSize(7.5).fillColor(emerald).text(expES?.periodo ?? "")
    doc.moveDown(0.15)
    doc.font("Helvetica").fontSize(8).fillColor(gray).text(exp.descripcion, { align: "justify" })
    doc.moveDown(0.2)

    if (exp.logros?.length) {
      for (const logro of exp.logros) {
        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor(gray)
          .text(`· ${logro}`, { indent: 8, align: "justify" })
      }
    }
    doc.moveDown(0.5)
  }

  if (doc.y > 720) {
    doc.addPage()
  }

  // ── Values ──
  doc.font("Helvetica-Bold").fontSize(10).fillColor(black).text(S.secValues)
  doc.moveDown(0.3)
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(gray)
    .text(S.values.join("  ·  "), { align: "justify" })
}
