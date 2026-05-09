import pool from '../config/database.js';

const BOOKS = [
  {
    slug: 'riyad-as-salihin',
    title: "Riyad as-Salihin",
    title_ar: "رياض الصالحين",
    subtitle: "Gardens of the Righteous",
    description: "A comprehensive collection of authentic hadiths compiled by Imam al-Nawawi, covering every aspect of Islamic life and spirituality. One of the most widely read books in the Muslim world.",
    language: 'en',
    primary_text_language: 'en',
    islamic_topics: JSON.stringify(['hadith', 'spirituality']),
    author: 'Imam al-Nawawi',
    translator: null,
    publisher: null,
    published_year: null,
    cover_url: 'https://archive.org/services/img/riyad-us-saliheen',
    embed_url: 'https://archive.org/embed/riyad-us-saliheen',
    pdf_url: 'https://archive.org/download/riyad-us-saliheen/riyad-us-saliheen.pdf',
    page_count: null,
    license_class: 'public_domain',
    status: 'live',
  },
  {
    slug: 'sealed-nectar',
    title: "The Sealed Nectar",
    title_ar: "الرحيق المختوم",
    subtitle: "Biography of the Noble Prophet",
    description: "An award-winning biography of Prophet Muhammad ﷺ, written by Saif ur-Rahman Mubarakpuri. Winner of the First Prize by the Muslim World League at a worldwide competition on the Prophet's biography.",
    language: 'en',
    primary_text_language: 'en',
    islamic_topics: JSON.stringify(['seerah']),
    author: 'Saif ur-Rahman Mubarakpuri',
    translator: null,
    publisher: 'Darussalam',
    published_year: 1996,
    cover_url: 'https://archive.org/services/img/TheSealedNectarBiographyOfTheProphetMuhammadPBUH',
    embed_url: 'https://archive.org/embed/TheSealedNectarBiographyOfTheProphetMuhammadPBUH',
    pdf_url: 'https://archive.org/download/TheSealedNectarBiographyOfTheProphetMuhammadPBUH/TheSealedNectar.pdf',
    page_count: 580,
    license_class: 'public_domain',
    status: 'live',
  },
  {
    slug: 'fiqh-us-sunnah',
    title: "Fiqh us-Sunnah",
    title_ar: "فقه السنة",
    subtitle: "Vol. 1 — Purification and Prayer",
    description: "A clear and authoritative guide to Islamic jurisprudence based on the Quran and Sunnah. Covers the fundamentals of Islamic law with clear evidence from primary sources.",
    language: 'en',
    primary_text_language: 'en',
    islamic_topics: JSON.stringify(['fiqh']),
    author: 'Sayyid Sabiq',
    translator: null,
    publisher: null,
    published_year: null,
    cover_url: 'https://archive.org/services/img/FiqhUsSunnahVolume1SayyidSabiq',
    embed_url: 'https://archive.org/embed/FiqhUsSunnahVolume1SayyidSabiq',
    pdf_url: 'https://archive.org/download/FiqhUsSunnahVolume1SayyidSabiq/Fiqh-Us-Sunnah-Volume-1.pdf',
    page_count: null,
    license_class: 'public_domain',
    status: 'live',
  },
  {
    slug: 'tafsir-ibn-kathir-1',
    title: "Tafsir Ibn Kathir",
    title_ar: "تفسير ابن كثير",
    subtitle: "Vol. 1 — Abridged",
    description: "The abridged version of the renowned Tafsir by Ibn Kathir, one of the most comprehensive and authentic explanations of the Quran. An essential reference for students of Islamic knowledge.",
    language: 'en',
    primary_text_language: 'en',
    islamic_topics: JSON.stringify(['tafsir']),
    author: 'Ibn Kathir',
    translator: null,
    publisher: 'Darussalam',
    published_year: 2000,
    cover_url: 'https://archive.org/services/img/TafsirIbnKathirPart1',
    embed_url: 'https://archive.org/embed/TafsirIbnKathirPart1',
    pdf_url: 'https://archive.org/download/TafsirIbnKathirPart1/Tafsir_Ibn_Kathir_Part_1.pdf',
    page_count: null,
    license_class: 'public_domain',
    status: 'live',
  },
  {
    slug: 'forty-hadith-nawawi',
    title: "Forty Hadith",
    title_ar: "الأربعون النووية",
    subtitle: "An-Nawawi's Forty Hadith",
    description: "Imam al-Nawawi's famous collection of forty-two hadith encompassing the most fundamental principles of Islam. Essential reading for every Muslim.",
    language: 'en',
    primary_text_language: 'en',
    islamic_topics: JSON.stringify(['hadith']),
    author: 'Imam al-Nawawi',
    translator: null,
    publisher: null,
    published_year: null,
    cover_url: 'https://archive.org/services/img/FortyHadithNawawi',
    embed_url: 'https://archive.org/embed/FortyHadithNawawi',
    pdf_url: 'https://archive.org/download/FortyHadithNawawi/Forty_Hadith_Nawawi.pdf',
    page_count: null,
    license_class: 'public_domain',
    status: 'live',
  },
  {
    slug: 'three-fundamental-principles',
    title: "The Three Fundamental Principles",
    title_ar: "ثلاثة الأصول",
    subtitle: "Usool ath-Thalathah",
    description: "A foundational text of Islamic creed by Shaykh Muhammad ibn Abd al-Wahhab, covering three essential questions every Muslim must know: Who is your Lord? What is your religion? Who is your Prophet?",
    language: 'en',
    primary_text_language: 'en',
    islamic_topics: JSON.stringify(['aqeedah']),
    author: 'Muhammad ibn Abd al-Wahhab',
    translator: null,
    publisher: null,
    published_year: null,
    cover_url: 'https://archive.org/services/img/ThreeFundamentalPrinciples',
    embed_url: 'https://archive.org/embed/ThreeFundamentalPrinciples',
    pdf_url: 'https://archive.org/download/ThreeFundamentalPrinciples/Three_Fundamental_Principles.pdf',
    page_count: null,
    license_class: 'public_domain',
    status: 'live',
  },
  {
    slug: 'dont-be-sad',
    title: "Don't Be Sad",
    title_ar: "لا تحزن",
    subtitle: null,
    description: "A global bestseller offering comfort, reassurance, and practical advice drawn from the Quran and Sunnah for dealing with grief, anxiety, and the trials of life.",
    language: 'en',
    primary_text_language: 'en',
    islamic_topics: JSON.stringify(['spirituality']),
    author: "Aaidh al-Qarni",
    translator: null,
    publisher: null,
    published_year: null,
    cover_url: 'https://archive.org/services/img/DontBeSadAaidhalQarni',
    embed_url: 'https://archive.org/embed/DontBeSadAaidhalQarni',
    pdf_url: 'https://archive.org/download/DontBeSadAaidhalQarni/DontBeSad.pdf',
    page_count: null,
    license_class: 'public_domain',
    status: 'live',
  },
  {
    slug: 'stories-of-the-prophets',
    title: "Stories of the Prophets",
    title_ar: "قصص الأنبياء",
    subtitle: null,
    description: "Ibn Kathir's comprehensive retelling of the stories of the prophets from Adam to Jesus (peace be upon them all), drawn from the Quran, authentic hadiths, and historical records.",
    language: 'en',
    primary_text_language: 'en',
    islamic_topics: JSON.stringify(['seerah', 'history']),
    author: 'Ibn Kathir',
    translator: null,
    publisher: null,
    published_year: null,
    cover_url: 'https://archive.org/services/img/StoriesOfTheProphetsIbnKathir',
    embed_url: 'https://archive.org/embed/StoriesOfTheProphetsIbnKathir',
    pdf_url: 'https://archive.org/download/StoriesOfTheProphetsIbnKathir/StoriesOfTheProphets.pdf',
    page_count: null,
    license_class: 'public_domain',
    status: 'live',
  },
];

async function seedBooks() {
  let connection;
  try {
    console.log('📚 Seeding books...');
    connection = await pool.getConnection();

    for (const book of BOOKS) {
      await connection.query(
        `INSERT INTO books
          (slug, title, title_ar, subtitle, description, language, primary_text_language,
           islamic_topics, author, translator, publisher, published_year,
           cover_url, embed_url, pdf_url, page_count, license_class, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           description = VALUES(description),
           embed_url = VALUES(embed_url),
           cover_url = VALUES(cover_url),
           status = VALUES(status)`,
        [
          book.slug, book.title, book.title_ar, book.subtitle, book.description,
          book.language, book.primary_text_language, book.islamic_topics,
          book.author, book.translator, book.publisher, book.published_year,
          book.cover_url, book.embed_url, book.pdf_url, book.page_count,
          book.license_class, book.status,
        ]
      );
      console.log(`  ✓ ${book.title}`);
    }

    const [rows] = await connection.query('SELECT COUNT(*) AS total FROM books WHERE status = "live"');
    console.log(`✅ Books seeded: ${rows[0].total} live books`);
  } catch (err) {
    console.error('❌ Books seeder failed:', err);
    throw err;
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

seedBooks();
