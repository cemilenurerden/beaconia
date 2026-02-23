import { GoogleGenerativeAI } from '@google/generative-ai';
import { Activity } from '@prisma/client';
import { RecommendInput, TURKISH_LABELS } from '../utils/scoring.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const AI_TIMEOUT = 25_000;

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

  const goalContext = input.goal
    ? {
        'self-improvement': 'Kullanıcı kendini geliştirmek, yeni şeyler öğrenmek ve kişisel gelişimine yatırım yapmak istiyor. Eğitici, zihin açıcı ve beceri kazandıran aktiviteleri tercih et.',
        fun: 'Kullanıcı eğlenmek, kafasını dağıtmak ve keyifli vakit geçirmek istiyor. Sıkıcı veya zorlayıcı aktivitelerden kaçın, neşeli ve rahat seçenekleri öner.',
        relax: 'Kullanıcı rahatlamak, stresten uzaklaşmak ve huzur bulmak istiyor. Sakinleştirici, düşük tempolu ve dinlendirici aktiviteleri tercih et.',
        productive: 'Kullanıcı üretken olmak, bir şeyler başarmak ve zamanını verimli kullanmak istiyor. Somut bir çıktısı olan, tamamlandığında tatmin hissi verecek aktiviteleri öner.',
      }[input.goal] || ''
    : '';

  const moodContext = input.mood
    ? {
        happy: 'Kullanıcı şu an mutlu ve pozitif. Bu enerjiyi koruyacak, keyifli aktiviteler öner.',
        motivated: 'Kullanıcı motive ve kararlı. Bu ivmeyi değerlendirecek, hedef odaklı aktiviteler öner.',
        excited: 'Kullanıcı heyecanlı ve coşkulu. Bu heyecanı karşılayacak dinamik aktiviteler öner.',
        sad: 'Kullanıcı üzgün hissediyor. Moralini yükseltecek, nazik ve şefkatli öneriler sun. Zorlayıcı aktivitelerden kaçın.',
        tired: 'Kullanıcı yorgun. Fazla enerji gerektirmeyen ama yine de iyi hissettirecek hafif aktiviteler öner.',
        stressed: 'Kullanıcı stresli. Rahatlatan, zihinsel yükü azaltan ve nefes aldıran aktiviteler öner.',
        bored: 'Kullanıcı sıkılmış. Dikkat çekici, merak uyandıran ve rutinden koparan aktiviteler öner.',
        relaxed: 'Kullanıcı sakin ve huzurlu. Bu hali bozmayacak, akışına bırakacak hafif aktiviteler öner.',
      }[input.mood] || ''
    : '';

  return `Sen Beaconia'nın kişisel aktivite asistanısın. Kullanıcıyı çok iyi tanıyan, samimi bir arkadaş gibi öneri yapıyorsun. Senlik cümleler kur, resmi olma.

KULLANICI PROFİLİ:
- Boş zamanı: ${input.duration} dakika
- Enerji seviyesi: ${t.energy[input.energy] || input.energy}
- Ruh hali: ${input.mood ? (t.mood[input.mood] || input.mood) : 'belirtilmedi'}
- Konum: ${t.location[input.location] || input.location}
- Bütçe: ${t.cost[input.cost] || input.cost}
- Sosyal tercih: ${t.social[input.social] || input.social}
- Amaç: ${input.goal ? (t.goal[input.goal] || input.goal) : 'belirtilmedi'}

${goalContext ? `AMAÇ DETAYI:\n${goalContext}\n` : ''}${moodContext ? `RUH HALİ DETAYI:\n${moodContext}\n` : ''}
ADAY AKTİVİTELER:
${activitiesText}

SEÇİM KRİTERLERİ (öncelik sırasına göre):
1. Ruh hali + Amaç uyumu: Kullanıcının şu anki duygusal durumuna ve hedefine en uygun aktiviteyi seç. Örneğin stresli + rahatlamak isteyen birine HIIT önerme.
2. Enerji uyumu: Düşük enerjili birine yüksek enerji gerektiren aktivite önerme.
3. Süre uyumu: Kullanıcının boş zamanına sığacak aktivite seç.
4. Konum ve bütçe: Kullanıcının bulunduğu yere ve bütçesine uygun olsun.
5. Plan B: Ana öneriden farklı bir kategoride alternatif sun. Mesela ana öneri wellness ise Plan B entertainment olabilir.

YANIT KURALLARI:
- "reason": Kullanıcıya neden bu aktiviteyi seçtiğini açıkla. Samimi, kişisel ve motive edici ol. Kullanıcının ruh halini ve amacını direkt referans al. 2-3 kısa cümle. Sen-dili kullan. Örnek: "Biraz stresli görünüyorsun, böyle zamanlarda..." gibi.
- "firstStep": Hemen şimdi yapılabilecek çok somut ve kolay bir ilk adım. Motivasyonu kırmayacak kadar basit olsun. 1 cümle.
- Plan B yoksa veya tek aday varsa planBId: null yaz.

ZORUNLU: Sadece aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:
{"selectedId": "...", "planBId": "..." veya null, "reason": "...", "firstStep": "..."}`;
}

export interface SelfAnalysisInsight {
  emoji: string;
  title: string;
  subtitle: string;
  detail: string;
}

interface SelfAnalysisData {
  totalDecisions: number;
  retryRatio: number;
  topSlot: string;
  topDecisionCategories: { category: string; pct: number }[];
  topFavoriteCategories: { category: string; count: number }[];
  topEnergy: string;
  topLocation: string;
  topSocial: string;
}

function buildSelfAnalysisPrompt(data: SelfAnalysisData): string {
  const favText = data.topFavoriteCategories.length > 0
    ? data.topFavoriteCategories.map((c) => `${c.category} (${c.count} favori)`).join(', ')
    : 'veri yok';

  return `Sen Beaconia uygulamasının kişisel analiz asistanısın. Kullanıcının aktivite verilerini inceleyerek 3-5 adet kişiselleştirilmiş içgörü üret.

KULLANICI VERİLERİ:
- Toplam aktivite: ${data.totalDecisions}
- En aktif zaman dilimi: ${data.topSlot}
- Yenileme oranı: %${Math.round(data.retryRatio * 100)} (aktiviteleri yenileme eğilimi)
- En çok yaptığı kategoriler: ${data.topDecisionCategories.map((c) => `${c.category} (%${c.pct})`).join(', ')}
- Favori kategoriler: ${favText}
- Enerji tercihi: ${data.topEnergy}
- Konum tercihi: ${data.topLocation}
- Sosyal tercih: ${data.topSocial}

İÇGÖRÜ KURALLARI:
- Her içgörü farklı bir davranış örüntüsünü yansıtsın
- Emoji: ilgili ve açıklayıcı tek bir emoji
- Başlık: 2-3 kelime, kişilik ifade eden bir etiket (örn: "Sabah İnsanı", "Seçici Ruh")
- Alt başlık (subtitle): 1 kısa cümle, kart üzerinde görünecek özet
- Detay (detail): 3-4 cümle, kart tıklandığında açılacak derin analiz. Veriye dayalı, kişisel ve motive edici. Sen-dili kullan. Kullanıcının örüntüsünü somut sayılarla destekle ve bu alışkanlığın ne anlama geldiğini açıkla.
- Yeterli veri yoksa o içgörüyü atlayabilirsin, en az 1 en fazla 5 içgörü üret

ZORUNLU: Sadece aşağıdaki JSON array formatında yanıt ver, başka hiçbir şey yazma:
[{"emoji": "🌅", "title": "...", "subtitle": "...", "detail": "..."}, ...]`;
}

export async function getSelfAnalysisInsights(
  data: SelfAnalysisData
): Promise<SelfAnalysisInsight[] | null> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await Promise.race([
      model.generateContent(buildSelfAnalysisPrompt(data)),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI timeout')), AI_TIMEOUT)
      ),
    ]);
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('Self-analysis AI yanıtından JSON çıkarılamadı:', text);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]) as SelfAnalysisInsight[];
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error('Self-analysis AI servisi hatası:', error);
    return null;
  }
}

export async function getAiRecommendation(
  input: RecommendInput,
  candidates: Activity[]
): Promise<AiRecommendation | null> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await Promise.race([
      model.generateContent(buildPrompt(input, candidates)),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI timeout')), AI_TIMEOUT)
      ),
    ]);
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
