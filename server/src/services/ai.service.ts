import { GoogleGenerativeAI } from '@google/generative-ai';
import { Activity } from '@prisma/client';
import { RecommendInput, TURKISH_LABELS } from '../utils/scoring.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface AiRecommendation {
  selectedId: string;
  planBId: string | null;
  reason: string;
  firstStep: string;
}

function buildPrompt(input: RecommendInput, candidates: Activity[]): string {
  const activitiesText = candidates
    .map(
      (a, i) =>
        `${i + 1}. [ID: ${a.id}] ${a.title} (Kategori: ${a.category}, Süre: ${a.durationMin}-${a.durationMax}dk, Enerji: ${a.energyLevel}, Konum: ${a.location}, Maliyet: ${a.cost}, Sosyal: ${a.social}, Mood: ${a.moodTags.join(', ')})`
    )
    .join('\n');

  const t = TURKISH_LABELS;

  return `Sen Beaconia uygulamasının yapay zeka asistanısın. Kullanıcının ruh haline ve tercihlerine göre en uygun aktiviteyi seçip, sıcak ve samimi bir dille Türkçe açıklama yapmalısın.

KULLANICI BİLGİLERİ:
- Boş zamanı: ${input.duration} dakika
- Enerji seviyesi: ${t.energy[input.energy] || input.energy}
- Ruh hali: ${input.mood ? (t.mood[input.mood] || input.mood) : 'belirtilmedi'}
- Konum: ${t.location[input.location] || input.location}
- Bütçe: ${t.cost[input.cost] || input.cost}
- Sosyal tercih: ${t.social[input.social] || input.social}

ADAY AKTİVİTELER:
${activitiesText}

GÖREV:
1. Kullanıcının durumuna en uygun aktiviteyi seç (selectedId).
2. Alternatif olarak bir Plan B seç (planBId). Eğer tek aday varsa null yaz.
3. "reason" alanında kullanıcıya neden bu aktiviteyi önerdiğini samimi, kişisel ve motive edici bir dille açıkla (2-3 cümle, Türkçe).
4. "firstStep" alanında kullanıcının hemen başlayabileceği somut bir ilk adım yaz (1 cümle, Türkçe).

ZORUNLU: Sadece aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:
{"selectedId": "...", "planBId": "..." veya null, "reason": "...", "firstStep": "..."}`;
}

export async function getAiRecommendation(
  input: RecommendInput,
  candidates: Activity[]
): Promise<AiRecommendation | null> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(buildPrompt(input, candidates));
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('AI yanıtından JSON çıkarılamadı:', text);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]) as AiRecommendation;

    // Dönen ID'lerin gerçekten aday listesinde olduğunu doğrula
    const candidateIds = candidates.map((c) => c.id);
    if (!candidateIds.includes(parsed.selectedId)) {
      console.error('AI geçersiz aktivite ID döndürdü:', parsed.selectedId);
      return null;
    }

    if (parsed.planBId && !candidateIds.includes(parsed.planBId)) {
      parsed.planBId = null;
    }

    return parsed;
  } catch (error) {
    console.error('AI servisi hatası:', error);
    return null;
  }
}
