export type ParsedCv = {
  text: string;
  name?: string;
  skills: string[];
  workExperience: string[];
  projects: string[];
  technologies: string[];
  achievements: string[];
};

const sectionPatterns = {
  skills: /(?:skills|technical skills|core competencies)([\s\S]*?)(?:experience|work|projects|education|achievements|$)/i,
  workExperience: /(?:experience|work experience|employment)([\s\S]*?)(?:projects|education|skills|achievements|$)/i,
  projects: /(?:projects|selected projects)([\s\S]*?)(?:experience|education|skills|achievements|$)/i,
  achievements: /(?:achievements|awards|impact)([\s\S]*?)(?:experience|projects|education|skills|$)/i
};

function linesFromSection(text: string, pattern: RegExp) {
  const match = text.match(pattern);
  if (!match?.[1]) return [];
  return match[1]
    .split(/\n|•|-/)
    .map((line) => line.trim())
    .filter((line) => line.length > 2)
    .slice(0, 12);
}

export async function extractPdfText(file: File): Promise<ParsedCv> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  try {
    const parsed = await parser.getText();
    const text = parsed.text.replace(/\r/g, "").trim();
    return parseCvText(text);
  } finally {
    await parser.destroy();
  }
}

export function parseCvText(text: string): ParsedCv {
  const firstUsefulLine = text
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 2 && !line.includes("@"));

  const technologies = Array.from(
    new Set(
      (text.match(/\b(React|Next\.js|Node\.js|TypeScript|JavaScript|Python|Java|Go|AWS|Docker|Kubernetes|PostgreSQL|MySQL|Prisma|GraphQL|REST|Redis|Kafka|GCP|Azure)\b/gi) ?? []).map(
        (item) => item.trim()
      )
    )
  ).slice(0, 20);

  return {
    text,
    name: firstUsefulLine,
    skills: linesFromSection(text, sectionPatterns.skills),
    workExperience: linesFromSection(text, sectionPatterns.workExperience),
    projects: linesFromSection(text, sectionPatterns.projects),
    technologies,
    achievements: linesFromSection(text, sectionPatterns.achievements)
  };
}
