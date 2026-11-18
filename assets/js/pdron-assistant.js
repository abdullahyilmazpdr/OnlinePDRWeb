/**
 * PDRON — OnlinePDR Akıllı Rehberlik, RİBA & Eğitim Asistanı
 * Saf Vanilla JS + İzo-stilli (Bootstrap / template CSS ile çakışmaz)
 */
(function () {
  'use strict';

  if (typeof window === 'undefined' || window.__pdronAssistantLoaded) return;
  window.__pdronAssistantLoaded = true;

  var API_ENDPOINT = 'https://riba-onlinepdr-web.vercel.app/api/assistant';
  var STORAGE_CHAT_KEY = 'onlinepdr_pdron_chat_history';
  var STORAGE_API_KEY = 'custom_gemini_api_key';

  function normalizeTr(text) {
    return (text || '')
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, ' ')
      .trim();
  }

  var ONLINEPDR_KB = [
    {
      keywords: [
        'riba',
        'rehberlik ihtiyaci',
        'asp',
        't puani',
        'ozel hedef',
        'anket',
        'veli link',
        'ogrenci link',
        '1. sinif',
        '2. sinif',
        'anasinifi',
      ],
      answer:
        '**OnlinePDR MEB RİBA Otomasyonu:**\n' +
        '• **Platform:** [riba.onlinepdr.com](https://riba.onlinepdr.com) | Tanıtım: [onlinepdr.com/riba](https://onlinepdr.com/riba/) | Rehber: [RİBA Nedir & Nasıl Uygulanır?](https://onlinepdr.com/riba-nedir-nasil-uygulanir.html)\n' +
        '• **Otomatik Kademe Kuralları:** Okul Öncesi (27 hedef, yalnızca Veli+Öğretmen), İlkokul 1-2. sınıf (Öğrenci gizlenir), İlkokul 3-4. sınıf (Öğrenci+Veli+Öğretmen), Ortaokul (39 hedef), Lise (40 hedef) ve Özel Eğitim I./II./III. Kademe desteklidir.\n' +
        '• **Hesaplama & Çıktı:** ASP ve T-puanları MEB ağırlıklarına göre anlık hesaplanır; 2 Özel Hedef seçilerek Sınıf ve Okul Excel çizelgeleri tek tıkla indirilir.\n' +
        '• **Ortak Giriş:** Risk Haritası öğretmen şifreleriniz RİBA sisteminde de doğrudan geçerlidir.',
      suggestions: [
        'Okul Risk Haritası & ŞÖK nedir?',
        'ŞÖK için örnek yapıcı görüşler ver',
        'Genel, Yerel ve Özel Hedefler nasıl belirlenir?',
      ],
    },
    {
      keywords: [
        'risk haritasi',
        'risk',
        'sok',
        'sube ogretmenler',
        '36 risk',
        'karekod',
        'e-tablo',
        'risk.onlinepdr',
      ],
      answer:
        '**Sınıf ve Okul Risk Haritası & ŞÖK Sistemi:**\n' +
        '• **Platform:** [risk.onlinepdr.com](https://risk.onlinepdr.com) | Rehber: [onlinepdr.com/sinif-ve-okul-risk-haritasi.html](https://onlinepdr.com/sinif-ve-okul-risk-haritasi.html)\n' +
        '• **%100 KVKK Uyumlu Google Drive Mimarisi:** Veriler yalnızca okulunuzun kendi Google E-Tablosunda tutulur.\n' +
        '• **Özellikler:** E-Okul PDF listelerinden otomatik sınıf/öğretmen kurulumu, karekodlu öğretmen giriş fişleri, 36 resmi risk faktörü takibi ve tek tıkla A4 ŞÖK toplantı tutanağı çıktısı.',
      suggestions: [
        'RİBA Otomasyonu nasıl çalışır?',
        'ŞÖK için örnek yapıcı görüşler ver',
        'Akran zorbalığı durumunda ne yapılmalı?',
      ],
    },
    {
      keywords: [
        'bep',
        'akilli bep',
        'ozel egitim',
        'kaynastirma',
        'ram',
        'kaba degerlendirme',
        'bireysellestirilmis',
      ],
      answer:
        '**Akıllı BEP & Özel Eğitim Rehberliği:**\n' +
        '• **OnlinePDR Araçları:** [Akıllı BEP Programı](https://onlinepdr.com/akillibep.html), [BEP Hazırlama Rehberi](https://onlinepdr.com/bep-hazirlama-rehberi.html) ve [Kaba Değerlendirme Formu](https://onlinepdr.com/kaba-degerlendirme-formu.html).\n' +
        '• **BEP Süreci:** RAM tarafından kaynaştırma/bütünleştirme kararı alınan öğrenci için okul BEP Birimi kurulur, kaba değerlendirme sonuçlarına göre yıllık/dönemlik amaçlar belirlenir ve ölçme-değerlendirme BEP hedeflerine göre uyarlanır.',
      suggestions: [
        'Özel eğitim öğrencisi için ŞÖK kararı',
        'RİBA Özel Eğitim kademeleri nasıl işler?',
        'OnlinePDR tüm araçlar',
      ],
    },
    {
      keywords: [
        'yerel hedef',
        'genel hedef',
        'selamlasma',
        'hedef belirleme',
        'rehberlik plani',
        'sinif rehberlik',
        'yillik plan',
      ],
      answer:
        '**Genel, Yerel ve Özel Hedefler & Rehberlik Planları:**\n' +
        '• **Hedef Rehberi:** [Genel, Yerel ve Özel Hedefler](https://onlinepdr.com/genel-yerel-ozel-hedef.html) ve [Selamlaşma Genel Hedefi](https://onlinepdr.com/selamlasma-genel-hedefi.html).\n' +
        '• **Sınıf & Okul Planı Araçları:** [Sınıf Rehberlik Planı](https://onlinepdr.com/sinif-rehberlik-plani.html) ile e-Rehberlik uyumlu planlar hazırlayabilir, [Okul Rehberlik Planı Değerlendirme](https://onlinepdr.com/okul-rehberlik-plani-degerlendirme.html) aracını kullanabilirsiniz.\n' +
        '• **İl Yerel Hedefleri:** [Yerel Hedefler](https://onlinepdr.com/yerel-hedefler-2026-2027.html) sayfasından güncel hedeflere ulaşabilirsiniz.',
      suggestions: [
        'RİBA Özel Hedefler nasıl seçilir?',
        'Test, anket ve ölçekler nelerdir?',
      ],
    },
    {
      keywords: [
        'tercih',
        'yks',
        'yok atlas',
        'tyt',
        'ayt',
        'kpss',
        'taban puan',
        'atama',
        'lisans',
        'onlisans',
        'kayit yasi',
        'yas hesaplama',
      ],
      answer:
        '**YKS Tercih Robotu, KPSS Araştırması ve Hesaplama Araçları:**\n' +
        '• **YKS & Üniversite:** [Tercih Robotu](https://onlinepdr.com/tercih-robotu.html), [YÖK Atlas Kullanım Rehberi](https://onlinepdr.com/yok-atlas-kullanim-rehberi.html), [Çift Anadal & Yandal](https://onlinepdr.com/cift-anadal-yandal.html), [Yatay/Dikey Geçiş](https://onlinepdr.com/yatay-dikey-gecis.html).\n' +
        '• **KPSS Verileri:** [KPSS Araştırması](https://onlinepdr.com/KPSS-Arastirmasi.html) ([Lisans](https://onlinepdr.com/kpss-lisans-arastirmasi.html), [Önlisans](https://onlinepdr.com/kpss-onlisans-arastirmasi.html), [Ortaöğretim](https://onlinepdr.com/kpss-ortaogretim-arastirmasi.html)).\n' +
        '• **İlkokul Kayıt Yaşı:** [Okul Kayıt Yaşı Hesaplama](https://onlinepdr.com/okul-kayit-yasi-hesaplama.html) (66-68-69+ ay MEB mevzuatına göre anlık hesaplama).',
      suggestions: [
        'Test ve envanterler nelerdir?',
        'RİBA Otomasyonu nasıl çalışır?',
      ],
    },
    {
      keywords: [
        'test',
        'anket',
        'olcek',
        'envanter',
        'ogrenme stilleri',
        'mesleki egilim',
        'akademik benlik',
      ],
      answer:
        '**OnlinePDR Test, Anket ve Envanter Koleksiyonu:**\n' +
        '• **Ana Sayfa:** [Test, Anket ve Ölçekler](https://onlinepdr.com/test-anket-olcek.html)\n' +
        '• **MEB Envanterleri:** [MEB Mesleki Rehberlik Envanterleri](https://onlinepdr.com/meb-mesleki-rehberlik-envanterleri.html)\n' +
        '• **Öğrenci Ölçekleri:** [Öğrenme Stilleri Envanteri](https://onlinepdr.com/ogrenme-stilleri.html), [Mesleki Eğilim Belirleme Testi](https://onlinepdr.com/mesleki-egilim-belirleme-testi.html) ve [Akademik Benlik Kavramı Ölçeği](https://onlinepdr.com/akademik-benlik-kavrami-olcegi.html).\n' +
        '• Tüm modüller tamamen ücretsizdir ve eğitimcilerin sahada pratik kullanımı için hazırlanmıştır.',
      suggestions: [
        'RİBA Otomasyonu nedir?',
        'Okul Risk Haritası nasıl kullanılır?',
      ],
    },
    {
      keywords: ['akran zorbaligi', 'zorbalik', 'magdur', 'zorba', 'siddet'],
      answer:
        '**Akran Zorbalığı Müdahale Adımları:**\n' +
        '1. **Olayı Normalleştirmeyin:** "Çocuklar arasında olur" yaklaşımı mağduru yalnızlaştırır.\n' +
        '2. **Mağdur Öğrenciye Destek:** Güvende hissettirin, *"Bu senin suçun değil, destek istemekle doğrusunu yaptın"* mesajını verin ve sınıf içi akran desteğini güçlendirin.\n' +
        '3. **Zorbalık Yapan Öğrenciyle Görüşme:** Kalabalık önünde değil bire bir görüşün; empati ve öfke düzenleme için rehberlik servisine yönlendirin.\n' +
        '4. **Veli İletişimi:** Taraf velileri aynı anda karşılaştırmayın; her iki veli ile ayrı ayrı profesyonel bilgilendirme yapın.',
      suggestions: [
        'ŞÖK için örnek yapıcı görüşler ver',
        'Devamsız öğrenciye yaklaşım',
      ],
    },
    {
      keywords: ['sok', 'gorus', 'tutanak', 'karar', 'devamsizlik', 'parcalanmis aile'],
      answer:
        '**ŞÖK Tutanağı İçin Yapıcı MEB Görüş Şablonları:**\n' +
        '• **Akademik Destek:** *"Ders içi katılımının teşvik edilmesine, temel kazanım eksiklikleri için DYK/bireysel pekiştirme ve veli iş birliğiyle haftalık takip planı uygulanmasına karar verilmiştir."*\n' +
        '• **Devamsızlık Takibi:** *"Devamsızlık nedenlerinin veli iş birliğiyle araştırılmasına, yasal uyarı süreçlerinin işletilmesine ve rehberlik servisince okula uyum takibi yapılmasına karar verilmiştir."*\n' +
        '• **Özel Eğitim / BEP:** *"Öğrencinin BEP hedefleri doğrultusunda bireysel öğrenme hızına uygun materyal ve sınav uyarlamaları yapılmasına karar verilmiştir."*\n' +
        '• Otomatik A4 ŞÖK Tutanağı için [risk.onlinepdr.com](https://risk.onlinepdr.com) sistemini kullanabilirsiniz.',
      suggestions: [
        'Okul Risk Haritası & ŞÖK nedir?',
        'RİBA Otomasyonu nedir?',
      ],
    },
    {
      keywords: ['araclar', 'neler var', 'programlar', 'iletisim', 'hakkinda', 'kim yapti'],
      answer:
        '**OnlinePDR Eğitimciler İçin Ücretsiz Kaynak Platformu:**\n' +
        '• **RİBA Otomasyonu:** [riba.onlinepdr.com](https://riba.onlinepdr.com)\n' +
        '• **Okul Risk Haritası & ŞÖK:** [risk.onlinepdr.com](https://risk.onlinepdr.com)\n' +
        '• **Rehberlik Araçları:** [onlinepdr.com/rehberlik.html](https://onlinepdr.com/rehberlik.html)\n' +
        '• **Test & Ölçekler:** [onlinepdr.com/test-anket-olcek.html](https://onlinepdr.com/test-anket-olcek.html)\n' +
        '• **Akıllı BEP:** [onlinepdr.com/akillibep.html](https://onlinepdr.com/akillibep.html)\n' +
        '• **İletişim:** [onlinepdr.com/contact.html](https://onlinepdr.com/contact.html)',
      suggestions: [
        'RİBA Otomasyonu nasıl çalışır?',
        'Okul Risk Haritası & ŞÖK nedir?',
        'YKS & KPSS araçları nelerdir?',
      ],
    },
  ];

  function findOnlinePdrLocalAnswer(query) {
    var norm = normalizeTr(query);
    var bestScore = 0;
    var bestItem = null;

    for (var i = 0; i < ONLINEPDR_KB.length; i++) {
      var entry = ONLINEPDR_KB[i];
      var score = 0;
      for (var k = 0; k < entry.keywords.length; k++) {
        if (norm.indexOf(normalizeTr(entry.keywords[k])) !== -1) {
          score += 2;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestItem = entry;
      }
    }

    if (bestItem && bestScore >= 2) {
      return {
        answer: bestItem.answer,
        suggestions: bestItem.suggestions || [],
        score: bestScore,
      };
    }

    return {
      answer:
        'Merhabalar, ben **PDRON**! **OnlinePDR** üzerindeki rehberlik otomasyonları (RİBA, Okul Risk Haritası, Akıllı BEP, Genel/Yerel/Özel Hedefler, YKS Tercih Robotu, KPSS Araştırması) ve **MEB PDR mevzuatı** konusunda yardımcı olmak için buradayım.\n\n' +
        'Bana doğrudan şunları sorabilirsiniz:\n' +
        '• *"RİBA kademe kuralları ve ASP hesaplama nasıl çalışır?"*\n' +
        '• *"Okul Risk Haritası ve A4 ŞÖK tutanağı nasıl hazırlanır?"*\n' +
        '• *"Akıllı BEP veya Kaba Değerlendirme Formu nerede?"*\n' +
        '• *"Akran zorbalığı veya devamsızlık için ne yapabilirim?"*',
      suggestions: [
        'RİBA Otomasyonu nasıl çalışır?',
        'Okul Risk Haritası & ŞÖK nedir?',
        'OnlinePDR tüm araçlar nelerdir?',
        'ŞÖK için örnek yapıcı görüşler ver',
      ],
      score: 0,
    };
  }

  function formatTimeNow() {
    try {
      return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  }

  function injectStyles() {
    if (document.getElementById('pdron-assistant-styles')) return;
    var style = document.createElement('style');
    style.id = 'pdron-assistant-styles';
    style.textContent =
      '@keyframes pdron-breathing { 0% { transform: scale(0.96); filter: brightness(0.95); } 100% { transform: scale(1.04); filter: brightness(1.1); } }' +
      '@keyframes pdron-thinking-pulse { 0% { transform: scale(0.92) rotate(0deg); filter: hue-rotate(0deg) brightness(1.1); } 50% { transform: scale(1.08) rotate(180deg); filter: hue-rotate(45deg) brightness(1.3); } 100% { transform: scale(0.94) rotate(360deg); filter: hue-rotate(90deg) brightness(1.1); } }' +
      '@keyframes pdron-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }' +
      '@keyframes pdron-ping { 75%, 100% { transform: scale(2); opacity: 0; } }' +
      '.scroll-top { bottom: 72px !important; right: 18px !important; }' +
      '#pdron-root, #pdron-root * { box-sizing: border-box; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }' +
      '@media print { #pdron-root { display: none !important; } }' +
      '.pdron-fab { position: fixed; bottom: 18px; right: 18px; z-index: 99998; background: rgba(2, 6, 23, 0.92); color: #fff; border: 1px solid rgba(51, 65, 85, 0.85); border-radius: 9999px; padding: 8px 16px 8px 10px; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; box-shadow: 0 8px 30px rgba(2, 132, 199, 0.3); backdrop-filter: blur(10px); transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease; user-select: none; }' +
      '.pdron-fab:hover { background: #0f172a; transform: translateY(-2px); box-shadow: 0 10px 35px rgba(16, 185, 129, 0.42); }' +
      '.pdron-orb { position: relative; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }' +
      '.pdron-orb-sm { width: 24px; height: 24px; }' +
      '.pdron-orb-md { width: 36px; height: 36px; }' +
      '.pdron-orb-xs { width: 16px; height: 16px; }' +
      '.pdron-orb-ring { position: absolute; inset: -3px; border-radius: 9999px; border: 1px solid rgba(52, 211, 153, 0.35); box-shadow: 0 0 8px rgba(16, 185, 129, 0.2); pointer-events: none; }' +
      '.pdron-orb.is-thinking .pdron-orb-ring { border: 2px solid transparent; border-top-color: #34d399; border-right-color: #22d3ee; border-bottom-color: #6366f1; animation: pdron-spin 1s linear infinite; box-shadow: 0 0 14px rgba(16, 185, 129, 0.45); }' +
      '.pdron-orb-sphere { width: 82%; height: 82%; border-radius: 9999px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 35% 35%, #10b981 0%, #0284c7 45%, #1e1b4b 85%, #020617 100%); box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.35), 0 0 12px rgba(16, 185, 129, 0.35); animation: pdron-breathing 3.5s ease-in-out infinite alternate; }' +
      '.pdron-orb.is-thinking .pdron-orb-sphere { background: radial-gradient(circle at 35% 35%, #34d399 0%, #06b6d4 35%, #2563eb 70%, #0f172a 100%); animation: pdron-thinking-pulse 1.2s ease-in-out infinite alternate; }' +
      '.pdron-orb-highlight { position: absolute; top: 12%; left: 18%; width: 38%; height: 32%; border-radius: 9999px; background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0) 70%); transform: rotate(-25deg); pointer-events: none; }' +
      '.pdron-orb-core { width: 34%; height: 34%; border-radius: 9999px; background: rgba(167, 243, 208, 0.55); pointer-events: none; }' +
      '.pdron-logo { display: inline-flex; align-items: baseline; letter-spacing: -0.02em; line-height: 1; }' +
      '.pdron-logo-pdr { font-weight: 900; letter-spacing: 0.05em; }' +
      '.pdron-logo-on { font-weight: 300; font-style: italic; color: #34d399; margin-left: 2px; text-shadow: 0 0 8px rgba(52, 211, 153, 0.55); }' +
      '.pdron-dot-wrap { position: relative; width: 8px; height: 8px; display: inline-flex; margin-left: 2px; }' +
      '.pdron-dot-ping { position: absolute; inset: 0; border-radius: 9999px; background: #34d399; opacity: 0.75; animation: pdron-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }' +
      '.pdron-dot { position: relative; width: 8px; height: 8px; border-radius: 9999px; background: #10b981; }' +
      '.pdron-drawer { position: fixed; bottom: 18px; right: 18px; z-index: 100000; width: 416px; max-width: calc(100vw - 24px); height: 580px; max-height: calc(100vh - 36px); background: #fff; border-radius: 16px; box-shadow: 0 24px 60px rgba(2, 6, 23, 0.35); border: 1px solid rgba(15, 23, 42, 0.16); display: flex; flex-direction: column; overflow: hidden; }' +
      '.pdron-header { background: linear-gradient(90deg, #020617 0%, #0f172a 55%, #1e1b4b 100%); padding: 14px; color: #fff; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(16, 185, 129, 0.22); }' +
      '.pdron-header-left { display: flex; align-items: center; gap: 10px; }' +
      '.pdron-badge { font-size: 10px; background: rgba(16, 185, 129, 0.18); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); font-weight: 600; padding: 2px 8px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 4px; }' +
      '.pdron-subtitle { font-size: 11px; color: #94a3b8; margin: 2px 0 0; line-height: 1.25; }' +
      '.pdron-icon-btn { background: transparent; border: none; color: #94a3b8; width: 28px; height: 28px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; transition: background 0.15s, color 0.15s; }' +
      '.pdron-icon-btn:hover { background: rgba(255, 255, 255, 0.12); color: #fff; }' +
      '.pdron-settings { background: #0f172a; border-bottom: 1px solid #1e293b; padding: 12px; color: #e2e8f0; font-size: 12px; display: none; flex-direction: column; gap: 8px; }' +
      '.pdron-settings.open { display: flex; }' +
      '.pdron-settings-row { display: flex; gap: 8px; }' +
      '.pdron-settings input { flex: 1; padding: 6px 10px; border-radius: 8px; border: 1px solid #334155; background: #020617; color: #fff; font-size: 12px; font-family: monospace; outline: none; }' +
      '.pdron-settings button.save-btn { padding: 6px 12px; border-radius: 8px; border: none; background: #059669; color: #fff; font-weight: 600; font-size: 12px; cursor: pointer; }' +
      '.pdron-messages { flex: 1; overflow-y: auto; padding: 14px; background: #f8fafc; display: flex; flex-direction: column; gap: 12px; font-size: 12.5px; color: #1e293b; }' +
      '.pdron-msg-group { display: flex; flex-direction: column; gap: 4px; }' +
      '.pdron-msg-group.user { align-items: flex-end; }' +
      '.pdron-msg-group.assistant { align-items: flex-start; }' +
      '.pdron-bubble { max-width: 88%; padding: 11px 13px; border-radius: 16px; line-height: 1.5; word-break: break-word; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05); }' +
      '.pdron-msg-group.user .pdron-bubble { background: #0f172a; color: #fff; border-bottom-right-radius: 2px; border: 1px solid #1e293b; }' +
      '.pdron-msg-group.assistant .pdron-bubble { background: #fff; color: #1e293b; border-bottom-left-radius: 2px; border: 1px solid #e2e8f0; }' +
      '.pdron-bubble-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-bottom: 6px; margin-bottom: 6px; border-bottom: 1px solid #f1f5f9; }' +
      '.pdron-bubble-source { font-size: 10px; color: #64748b; font-weight: 500; }' +
      '.pdron-copy-btn { background: transparent; border: none; font-size: 10.5px; color: #64748b; cursor: pointer; padding: 2px 4px; border-radius: 4px; }' +
      '.pdron-copy-btn:hover { color: #059669; background: #ecfdf5; }' +
      '.pdron-time { font-size: 10px; color: #94a3b8; padding: 0 4px; }' +
      '.pdron-suggestions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; max-width: 96%; }' +
      '.pdron-sug-btn { background: #fff; border: 1px solid #cbd5e1; color: #334155; font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 9999px; cursor: pointer; text-align: left; transition: all 0.15s; }' +
      '.pdron-sug-btn:hover { background: #ecfdf5; color: #065f46; border-color: #6ee7b7; }' +
      '.pdron-quickbar { padding: 6px 12px; background: #fff; border-top: 1px solid #f1f5f9; display: flex; align-items: center; gap: 6px; overflow-x: auto; }' +
      '.pdron-quick-chip { padding: 4px 10px; border-radius: 8px; background: #f1f5f9; color: #1e293b; border: none; font-size: 11px; font-weight: 600; white-space: nowrap; cursor: pointer; transition: background 0.15s, color 0.15s; }' +
      '.pdron-quick-chip:hover { background: #ecfdf5; color: #047857; }' +
      '.pdron-form { padding: 10px; background: #fff; border-top: 1px solid #e2e8f0; display: flex; align-items: center; gap: 8px; }' +
      '.pdron-input { flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 12.5px; background: #f8fafc; color: #0f172a; outline: none; }' +
      '.pdron-input:focus { border-color: #10b981; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2); }' +
      '.pdron-send-btn { width: 38px; height: 38px; border-radius: 12px; border: 1px solid #1e293b; background: #0f172a; color: #34d399; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background 0.15s; }' +
      '.pdron-send-btn:disabled { background: #e2e8f0; border-color: transparent; color: #94a3b8; cursor: not-allowed; }' +
      '.pdron-thinking-card { display: inline-flex; align-items: center; gap: 10px; padding: 10px 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; font-size: 12px; }' +
      '.pdron-msg-bullet { display: flex; align-items: flex-start; gap: 6px; margin: 2px 0 2px 2px; }' +
      '.pdron-msg-bullet-dot { color: #10b981; font-weight: 700; }' +
      '.pdron-msg-link { color: #047857; font-weight: 600; text-decoration: underline; }';
    document.head.appendChild(style);
  }

  function createOrbEl(sizeClass, thinking) {
    var wrap = document.createElement('div');
    wrap.className = 'pdron-orb ' + sizeClass + (thinking ? ' is-thinking' : '');
    var ring = document.createElement('div');
    ring.className = 'pdron-orb-ring';
    var sphere = document.createElement('div');
    sphere.className = 'pdron-orb-sphere';
    var hl = document.createElement('div');
    hl.className = 'pdron-orb-highlight';
    var core = document.createElement('div');
    core.className = 'pdron-orb-core';
    sphere.appendChild(hl);
    sphere.appendChild(core);
    wrap.appendChild(ring);
    wrap.appendChild(sphere);
    return wrap;
  }

  function createLogoEl(theme, fontSizePx) {
    var span = document.createElement('span');
    span.className = 'pdron-logo';
    span.style.fontSize = fontSizePx + 'px';
    var pdr = document.createElement('span');
    pdr.className = 'pdron-logo-pdr';
    pdr.style.color = theme === 'dark' ? '#ffffff' : '#0f172a';
    pdr.textContent = 'PDR';
    var on = document.createElement('span');
    on.className = 'pdron-logo-on';
    on.textContent = 'ON';
    span.appendChild(pdr);
    span.appendChild(on);
    return span;
  }

  function appendInlineNodes(parent, lineText, isUser) {
    var re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\)|https?:\/\/[^\s)]+)/g;
    var lastIdx = 0;
    var match;
    while ((match = re.exec(lineText)) !== null) {
      if (match.index > lastIdx) {
        parent.appendChild(document.createTextNode(lineText.slice(lastIdx, match.index)));
      }
      var token = match[0];
      if (token.indexOf('**') === 0 && token.slice(-2) === '**') {
        var strong = document.createElement('strong');
        strong.style.color = isUser ? '#fff' : '#0f172a';
        strong.textContent = token.slice(2, -2);
        parent.appendChild(strong);
      } else if (token.charAt(0) === '`' && token.slice(-1) === '`') {
        var code = document.createElement('code');
        code.style.background = isUser ? 'rgba(255,255,255,0.15)' : '#f1f5f9';
        code.style.padding = '1px 4px';
        code.style.borderRadius = '4px';
        code.style.fontFamily = 'monospace';
        code.style.fontSize = '11px';
        code.textContent = token.slice(1, -1);
        parent.appendChild(code);
      } else if (token.charAt(0) === '[') {
        var lm = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
        if (lm) {
          var a = document.createElement('a');
          a.href = lm[2];
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'pdron-msg-link';
          if (isUser) a.style.color = '#6ee7b7';
          a.textContent = lm[1];
          parent.appendChild(a);
        } else {
          parent.appendChild(document.createTextNode(token));
        }
      } else {
        var aBare = document.createElement('a');
        aBare.href = token;
        aBare.target = '_blank';
        aBare.rel = 'noopener noreferrer';
        aBare.className = 'pdron-msg-link';
        if (isUser) aBare.style.color = '#6ee7b7';
        aBare.textContent = token;
        parent.appendChild(aBare);
      }
      lastIdx = re.lastIndex;
    }
    if (lastIdx < lineText.length) {
      parent.appendChild(document.createTextNode(lineText.slice(lastIdx)));
    }
  }

  function renderFormattedContent(container, rawText, isUser) {
    var lines = String(rawText || '').split('\n');
    for (var i = 0; i < lines.length; i++) {
      var trimmed = lines[i].trim();
      var isBullet =
        trimmed.indexOf('• ') === 0 ||
        trimmed.indexOf('- ') === 0 ||
        trimmed.indexOf('* ') === 0;
      if (isBullet) {
        var row = document.createElement('div');
        row.className = 'pdron-msg-bullet';
        var dot = document.createElement('span');
        dot.className = 'pdron-msg-bullet-dot';
        dot.textContent = '•';
        var body = document.createElement('span');
        appendInlineNodes(body, trimmed.slice(2), isUser);
        row.appendChild(dot);
        row.appendChild(body);
        container.appendChild(row);
      } else if (!trimmed) {
        var spacer = document.createElement('div');
        spacer.style.height = '6px';
        container.appendChild(spacer);
      } else {
        var p = document.createElement('p');
        p.style.margin = '2px 0';
        p.style.lineHeight = '1.5';
        appendInlineNodes(p, lines[i], isUser);
        container.appendChild(p);
      }
    }
  }

  function initWidget() {
    if (!document.body || document.getElementById('pdron-root')) return;
    injectStyles();

    var storedKey = '';
    var savedMessages = null;
    try {
      storedKey = localStorage.getItem(STORAGE_API_KEY) || '';
      var rawChat = localStorage.getItem(STORAGE_CHAT_KEY);
      if (rawChat) {
        var parsed = JSON.parse(rawChat);
        if (Array.isArray(parsed) && parsed.length > 0) savedMessages = parsed;
      }
    } catch (e) {}

    var defaultGreeting = {
      id: 'greeting',
      role: 'assistant',
      source: 'knowledge_base',
      text:
        '👋 Merhabalar! Ben **PDRON**, **OnlinePDR** araçları ve **MEB Rehberlik / RİBA / ŞÖK / BEP** süreçlerindeki akıllı çalışma arkadaşınızım.\n\n' +
        'Size şu konularda 7/24 rehberlik edebilirim:\n' +
        '• **OnlinePDR Araçları:** RİBA Otomasyonu, Okul Risk Haritası, Akıllı BEP, Hedefler, YKS Tercih Robotu ve KPSS Araştırması.\n' +
        '• **MEB Mevzuat & Rehberlik:** RİBA kademe/ASP kuralları, ŞÖK tutanağı görüş metinleri, akran zorbalığı ve BEP süreçleri.',
      suggestions: [
        'RİBA Otomasyonu nasıl çalışır?',
        'Okul Risk Haritası & ŞÖK nedir?',
        'OnlinePDR tüm araçlar nelerdir?',
        'ŞÖK için örnek yapıcı görüşler ver',
      ],
      timestamp: 'Şimdi',
    };

    var state = {
      isOpen: false,
      isLoading: false,
      customApiKey: storedKey,
      messages: savedMessages || [defaultGreeting],
    };

    var root = document.createElement('div');
    root.id = 'pdron-root';

    // 1. Floating Action Button
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'pdron-fab';
    fab.title = 'PDRON Akıllı Rehberlik & OnlinePDR Asistanını Aç';
    fab.appendChild(createOrbEl('pdron-orb-sm', false));
    fab.appendChild(createLogoEl('dark', 14));
    var fabSub = document.createElement('span');
    fabSub.textContent = 'Asistan';
    fabSub.style.fontSize = '11px';
    fabSub.style.color = '#cbd5e1';
    fabSub.style.fontWeight = '500';
    fab.appendChild(fabSub);
    var dotWrap = document.createElement('span');
    dotWrap.className = 'pdron-dot-wrap';
    var dotPing = document.createElement('span');
    dotPing.className = 'pdron-dot-ping';
    var dot = document.createElement('span');
    dot.className = 'pdron-dot';
    dotWrap.appendChild(dotPing);
    dotWrap.appendChild(dot);
    fab.appendChild(dotWrap);

    // 2. Drawer
    var drawer = document.createElement('div');
    drawer.className = 'pdron-drawer';
    drawer.style.display = 'none';

    // Header
    var header = document.createElement('div');
    header.className = 'pdron-header';
    var headerLeft = document.createElement('div');
    headerLeft.className = 'pdron-header-left';
    var headerOrbWrap = document.createElement('div');
    headerOrbWrap.appendChild(createOrbEl('pdron-orb-md', false));
    var titleWrap = document.createElement('div');
    var topTitleRow = document.createElement('div');
    topTitleRow.style.display = 'flex';
    topTitleRow.style.alignItems = 'center';
    topTitleRow.style.gap = '8px';
    topTitleRow.appendChild(createLogoEl('dark', 16));
    var statusBadge = document.createElement('span');
    statusBadge.className = 'pdron-badge';
    statusBadge.textContent = state.customApiKey ? '● Gemini 2.5' : '● Aktif';
    topTitleRow.appendChild(statusBadge);
    var subtitle = document.createElement('p');
    subtitle.className = 'pdron-subtitle';
    subtitle.textContent = 'OnlinePDR & MEB Rehberlik Asistanı';
    titleWrap.appendChild(topTitleRow);
    titleWrap.appendChild(subtitle);
    headerLeft.appendChild(headerOrbWrap);
    headerLeft.appendChild(titleWrap);

    var headerActions = document.createElement('div');
    headerActions.style.display = 'flex';
    headerActions.style.alignItems = 'center';
    headerActions.style.gap = '4px';

    var btnSettings = document.createElement('button');
    btnSettings.type = 'button';
    btnSettings.className = 'pdron-icon-btn';
    btnSettings.title = 'Yapay Zeka API Ayarları';
    btnSettings.textContent = '⚙️';

    var btnClear = document.createElement('button');
    btnClear.type = 'button';
    btnClear.className = 'pdron-icon-btn';
    btnClear.title = 'Sohbeti Sıfırla';
    btnClear.textContent = '🗑️';

    var btnClose = document.createElement('button');
    btnClose.type = 'button';
    btnClose.className = 'pdron-icon-btn';
    btnClose.title = 'Pencereyi Kapat';
    btnClose.textContent = '✕';

    headerActions.appendChild(btnSettings);
    headerActions.appendChild(btnClear);
    headerActions.appendChild(btnClose);
    header.appendChild(headerLeft);
    header.appendChild(headerActions);

    // Settings panel
    var settingsPanel = document.createElement('div');
    settingsPanel.className = 'pdron-settings';
    var settingsNote = document.createElement('div');
    settingsNote.style.fontSize = '11px';
    settingsNote.style.color = '#94a3b8';
    settingsNote.textContent =
      'PDRON dahili OnlinePDR & MEB bilgi bankasıyla çalışır. İsterseniz Google AI Studio Gemini anahtarınızı kaydedebilirsiniz:';
    var settingsRow = document.createElement('div');
    settingsRow.className = 'pdron-settings-row';
    var apiInput = document.createElement('input');
    apiInput.type = 'password';
    apiInput.placeholder = 'AIzaSy... (Boş bırakılırsa yerel mod)';
    apiInput.value = state.customApiKey;
    var saveKeyBtn = document.createElement('button');
    saveKeyBtn.type = 'button';
    saveKeyBtn.className = 'save-btn';
    saveKeyBtn.textContent = 'Kaydet';
    settingsRow.appendChild(apiInput);
    settingsRow.appendChild(saveKeyBtn);
    settingsPanel.appendChild(settingsNote);
    settingsPanel.appendChild(settingsRow);

    // Messages stream
    var msgList = document.createElement('div');
    msgList.className = 'pdron-messages';

    // Quickbar
    var quickBar = document.createElement('div');
    quickBar.className = 'pdron-quickbar';
    var quickPrompts = [
      { label: '🎯 RİBA', prompt: 'RİBA Otomasyonu nasıl çalışır?' },
      { label: '🛡️ Risk & ŞÖK', prompt: 'Okul Risk Haritası & ŞÖK nedir?' },
      { label: '🧩 BEP & Hedefler', prompt: 'Genel, Yerel ve Özel Hedefler nasıl belirlenir?' },
      { label: '📚 YKS & KPSS', prompt: 'YKS Tercih Robotu ve KPSS Araştırması nedir?' },
    ];
    for (var qIdx = 0; qIdx < quickPrompts.length; qIdx++) {
      (function (item) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'pdron-quick-chip';
        chip.textContent = item.label;
        chip.addEventListener('click', function () {
          sendMessage(item.prompt);
        });
        quickBar.appendChild(chip);
      })(quickPrompts[qIdx]);
    }

    // Form
    var form = document.createElement('form');
    form.className = 'pdron-form';
    var textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'pdron-input';
    textInput.placeholder = "PDRON'a soru sorun veya araç arayın...";
    var sendBtn = document.createElement('button');
    sendBtn.type = 'submit';
    sendBtn.className = 'pdron-send-btn';
    sendBtn.disabled = true;
    sendBtn.title = 'Gönder';
    sendBtn.textContent = '➤';
    form.appendChild(textInput);
    form.appendChild(sendBtn);

    drawer.appendChild(header);
    drawer.appendChild(settingsPanel);
    drawer.appendChild(msgList);
    drawer.appendChild(quickBar);
    drawer.appendChild(form);

    root.appendChild(fab);
    root.appendChild(drawer);
    document.body.appendChild(root);

    function persistMessages() {
      try {
        localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(state.messages.slice(-20)));
      } catch (e) {}
    }

    function updateHeaderOrb() {
      headerOrbWrap.innerHTML = '';
      headerOrbWrap.appendChild(createOrbEl('pdron-orb-md', state.isLoading));
      sendBtn.disabled = !textInput.value.trim() || state.isLoading;
      textInput.disabled = state.isLoading;
    }

    function renderMessages() {
      msgList.innerHTML = '';
      for (var i = 0; i < state.messages.length; i++) {
        (function (m) {
          var isUser = m.role === 'user';
          var group = document.createElement('div');
          group.className = 'pdron-msg-group ' + (isUser ? 'user' : 'assistant');

          var bubble = document.createElement('div');
          bubble.className = 'pdron-bubble';

          if (!isUser) {
            var bHead = document.createElement('div');
            bHead.className = 'pdron-bubble-head';
            var bLeft = document.createElement('div');
            bLeft.style.display = 'flex';
            bLeft.style.alignItems = 'center';
            bLeft.style.gap = '6px';
            bLeft.appendChild(createOrbEl('pdron-orb-xs', false));
            bLeft.appendChild(createLogoEl('light', 12));
            var bSrc = document.createElement('span');
            bSrc.className = 'pdron-bubble-source';
            bSrc.textContent = '• ' + (m.source === 'ai' ? 'Gemini AI' : 'OnlinePDR & MEB Rehber');
            bLeft.appendChild(bSrc);

            var copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'pdron-copy-btn';
            copyBtn.textContent = 'Kopyala';
            copyBtn.addEventListener('click', function () {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(m.text);
              }
              copyBtn.textContent = '✓ Kopyalandı';
              setTimeout(function () {
                copyBtn.textContent = 'Kopyala';
              }, 2000);
            });

            bHead.appendChild(bLeft);
            bHead.appendChild(copyBtn);
            bubble.appendChild(bHead);
          }

          var bodyEl = document.createElement('div');
          renderFormattedContent(bodyEl, m.text, isUser);
          bubble.appendChild(bodyEl);
          group.appendChild(bubble);

          var ts = document.createElement('span');
          ts.className = 'pdron-time';
          ts.textContent = m.timestamp || '';
          group.appendChild(ts);

          if (!isUser && Array.isArray(m.suggestions) && m.suggestions.length > 0) {
            var sugWrap = document.createElement('div');
            sugWrap.className = 'pdron-suggestions';
            for (var sIdx = 0; sIdx < m.suggestions.length; sIdx++) {
              (function (sugText) {
                var sb = document.createElement('button');
                sb.type = 'button';
                sb.className = 'pdron-sug-btn';
                sb.textContent = sugText;
                sb.disabled = state.isLoading;
                sb.addEventListener('click', function () {
                  sendMessage(sugText);
                });
                sugWrap.appendChild(sb);
              })(m.suggestions[sIdx]);
            }
            group.appendChild(sugWrap);
          }

          msgList.appendChild(group);
        })(state.messages[i]);
      }

      if (state.isLoading) {
        var loadingCard = document.createElement('div');
        loadingCard.className = 'pdron-thinking-card';
        loadingCard.appendChild(createOrbEl('pdron-orb-sm', true));
        var lTextWrap = document.createElement('div');
        var lTitle = document.createElement('div');
        lTitle.style.fontWeight = '600';
        lTitle.style.color = '#0f172a';
        lTitle.textContent = 'PDRON düşünüyor...';
        var lSub = document.createElement('div');
        lSub.style.fontSize = '10.5px';
        lSub.style.color = '#64748b';
        lSub.textContent = 'OnlinePDR & MEB mevzuatı taranıyor';
        lTextWrap.appendChild(lTitle);
        lTextWrap.appendChild(lSub);
        loadingCard.appendChild(lTextWrap);
        msgList.appendChild(loadingCard);
      }

      msgList.scrollTop = msgList.scrollHeight;
    }

    function sendMessage(overrideText) {
      var query = String(overrideText || textInput.value || '').trim();
      if (!query || state.isLoading) return;

      var userMsg = {
        id: 'u-' + Date.now(),
        role: 'user',
        text: query,
        timestamp: formatTimeNow(),
      };
      state.messages.push(userMsg);
      persistMessages();
      if (!overrideText) textInput.value = '';
      state.isLoading = true;
      updateHeaderOrb();
      renderMessages();

      var localCandidate = findOnlinePdrLocalAnswer(query);

      var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timeoutId = controller
        ? setTimeout(function () {
            controller.abort();
          }, 4500)
        : null;

      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller ? controller.signal : undefined,
        body: JSON.stringify({
          message: query,
          history: state.messages.slice(-6).map(function (m) {
            return { role: m.role, text: m.text };
          }),
          customApiKey: state.customApiKey.trim() || undefined,
          siteContext: 'onlinepdr',
        }),
      })
        .then(function (res) {
          if (timeoutId) clearTimeout(timeoutId);
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.success) {
            var useLocal =
              result.data.source !== 'ai' && localCandidate && localCandidate.score >= 2;
            state.messages.push({
              id: 'a-' + Date.now(),
              role: 'assistant',
              text: useLocal ? localCandidate.answer : result.data.reply,
              source: result.data.source || 'knowledge_base',
              suggestions: useLocal
                ? localCandidate.suggestions
                : result.data.suggestions || [],
              timestamp: formatTimeNow(),
            });
          } else {
            state.messages.push({
              id: 'a-' + Date.now(),
              role: 'assistant',
              text: localCandidate.answer,
              source: 'knowledge_base',
              suggestions: localCandidate.suggestions,
              timestamp: formatTimeNow(),
            });
          }
        })
        .catch(function () {
          if (timeoutId) clearTimeout(timeoutId);
          state.messages.push({
            id: 'a-' + Date.now(),
            role: 'assistant',
            text: localCandidate.answer,
            source: 'knowledge_base',
            suggestions: localCandidate.suggestions,
            timestamp: formatTimeNow(),
          });
        })
        .finally(function () {
          state.isLoading = false;
          persistMessages();
          updateHeaderOrb();
          renderMessages();
        });
    }

    fab.addEventListener('click', function () {
      state.isOpen = true;
      fab.style.display = 'none';
      drawer.style.display = 'flex';
      renderMessages();
      setTimeout(function () {
        textInput.focus();
      }, 120);
    });

    btnClose.addEventListener('click', function () {
      state.isOpen = false;
      drawer.style.display = 'none';
      fab.style.display = 'inline-flex';
    });

    btnSettings.addEventListener('click', function () {
      settingsPanel.classList.toggle('open');
    });

    saveKeyBtn.addEventListener('click', function () {
      state.customApiKey = apiInput.value.trim();
      try {
        if (state.customApiKey) {
          localStorage.setItem(STORAGE_API_KEY, state.customApiKey);
        } else {
          localStorage.removeItem(STORAGE_API_KEY);
        }
      } catch (e) {}
      statusBadge.textContent = state.customApiKey ? '● Gemini 2.5' : '● Aktif';
      settingsPanel.classList.remove('open');
    });

    btnClear.addEventListener('click', function () {
      if (window.confirm('PDRON sohbet geçmişini sıfırlamak istediğinize emin misiniz?')) {
        state.messages = [defaultGreeting];
        persistMessages();
        renderMessages();
      }
    });

    textInput.addEventListener('input', function () {
      sendBtn.disabled = !textInput.value.trim() || state.isLoading;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      sendMessage();
    });

    renderMessages();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
