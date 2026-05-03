const axios = require("axios");
const cheerio = require("cheerio");

const SCHOOL_BASE_URL = "https://web.dongguk.ac.kr";

const REQUEST_DELAY_MS = 150;

const SCHOOL_CATEGORY_CONFIGS = [
  { key: "generalnotice", category: "일반", listUrl: `${SCHOOL_BASE_URL}/article/generalnotice/list` },
  { key: "acdnotice", category: "학사", listUrl: `${SCHOOL_BASE_URL}/article/acdnotice/list` },
  { key: "teachnotice", category: "교직", listUrl: `${SCHOOL_BASE_URL}/article/teachnotice/list` },
  { key: "empprg", category: "취업프로그램", listUrl: `${SCHOOL_BASE_URL}/article/empprg/list` },
  { key: "jobnotice", category: "채용공고", listUrl: `${SCHOOL_BASE_URL}/article/jobnotice/list` },
  { key: "servicenotice", category: "장학/봉사", listUrl: `${SCHOOL_BASE_URL}/article/servicenotice/list` },
  { key: "event", category: "행사", listUrl: `${SCHOOL_BASE_URL}/article/event/list` },
];

// 학과 공지는 대부분 컴퓨터공학과와 같은 WISE CMS 게시판 구조를 사용한다.
// listUrl이 있으면 그대로 사용하고, 없으면 홈페이지에서 "학과공지/공지사항" 메뉴 링크를 찾아 사용한다.
const DEPARTMENT_CONFIGS = [
  {
    key: "computer",
    department: "컴퓨터공학과",
    homepageUrl: "https://ce.dongguk.ac.kr/",
    homePath: "computer",
    listUrl: "https://ce.dongguk.ac.kr/HOME/computer/sub.htm?nav_code=com1587521150&code=Ffx3UgY54z2T",
  },
  { key: "buddhist", department: "불교학과", homepageUrl: "https://buddhist.dongguk.ac.kr/", homePath: "buddhist", listUrl: "https://buddhist.dongguk.ac.kr/HOME/buddhist/sub.htm?nav_code=bud1587447348&code=Qn23DOQ4UBvU" },
  { key: "bcc", department: "불교문화콘텐츠학과", homepageUrl: "https://bcc.dongguk.ac.kr/", homePath: "buddhism", listUrl: "https://bcc.dongguk.ac.kr/HOME/buddhism/sub.htm?nav_code=bud1624006103&code=jPJDoieSKjEU" },
  { key: "mpc", department: "명상심리상담학과", homepageUrl: "https://mpc.dongguk.ac.kr/", homePath: "mpc", listUrl: "https://mpc.dongguk.ac.kr/HOME/mpc/sub.htm?nav_code=mpc1587637014&code=5HOW3KUS5F1H" },
  { key: "coreanwr", department: "웹문예학과", homepageUrl: "https://coreanwr.dongguk.ac.kr/" },
  { key: "khistory", department: "국사학과", homepageUrl: "https://khistory.dongguk.ac.kr/" },
  { key: "archaeology-arthistory", department: "고고미술사학과", homepageUrl: "https://archaeology-arthistory.dongguk.ac.kr/" },
  { key: "engl", department: "영어영문학과", homepageUrl: "https://engl.dongguk.ac.kr/" },
  { key: "japanese", department: "일어일문학과", homepageUrl: "https://japanese.dongguk.ac.kr/" },
  { key: "china", department: "중어중문학과", homepageUrl: "https://china.dongguk.ac.kr/" },
  { key: "art", department: "디자인미술학과", homepageUrl: "https://art.dongguk.ac.kr/" },
  { key: "sports", department: "스포츠건강과학부", homepageUrl: "https://sports.dongguk.ac.kr/" },
  { key: "land", department: "조경정원디자인학과", homepageUrl: "https://land.dongguk.ac.kr/" },
  { key: "police", department: "행정경찰공공학과", homepageUrl: "https://police.dongguk.ac.kr/" },
  { key: "welfare", department: "사회복지학과", homepageUrl: "https://welfare.dongguk.ac.kr/" },
  { key: "budchild", department: "아동청소년교육학과", homepageUrl: "https://budchild.dongguk.ac.kr/" },
  { key: "airtrade", department: "항공서비스무역학과", homepageUrl: "https://airtrade.dongguk.ac.kr/" },
  { key: "mgt", department: "융합경영학과", homepageUrl: "https://mgt.dongguk.ac.kr/" },
  { key: "travel", department: "호텔관광경영학전공", homepageUrl: "https://travel.dongguk.ac.kr/HOME/travel/index.htm", homePath: "travel" },
  { key: "food", department: "조리외식경영학전공", homepageUrl: "https://food.dongguk.ac.kr/" },
  { key: "babyhood", department: "유아교육과", homepageUrl: "https://babyhood.dongguk.ac.kr/" },
  { key: "homeedu", department: "가정교육과", homepageUrl: "https://homeedu.dongguk.ac.kr/" },
  { key: "mathedu", department: "수학교육과", homepageUrl: "https://mathedu.dongguk.ac.kr/" },
  { key: "healthinfo", department: "보건의료정보학과", homepageUrl: "https://healthinfo.dongguk.ac.kr/" },
  { key: "beauty", department: "뷰티아트산업학과", homepageUrl: "https://beauty.dongguk.ac.kr/" },
  { key: "biopharm", department: "바이오화학융합학부", homepageUrl: "https://class.dongguk.ac.kr/HOME/biopharm/", homePath: "biopharm" },
  { key: "infocom", department: "전자정보통신공학과", homepageUrl: "https://infocom.dongguk.ac.kr/" },
  { key: "energy", department: "원자력에너지전기공학과", homepageUrl: "https://energy.dongguk.ac.kr/" },
  { key: "safety", department: "스마트 안전공학과", homepageUrl: "https://safety.dongguk.ac.kr/" },
  { key: "smartfuturecar", department: "자동차소재부품공학과", homepageUrl: "https://smartfuturecar.dongguk.ac.kr/" },
  { key: "orient", department: "한의예과", homepageUrl: "https://orient.dongguk.ac.kr/" },
  { key: "nursing", department: "간호학과", homepageUrl: "https://nursing.dongguk.ac.kr/" },
  { key: "openmajor", department: "글로컬인재학과", homepageUrl: "https://openmajor.dongguk.ac.kr/" },
];

const http = axios.create({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  },
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanText(text = "") {
  return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function toAbsoluteUrl(path = "", baseUrl = "") {
  if (!path) return "";
  try {
    return new URL(path, baseUrl).href;
  } catch (error) {
    return "";
  }
}

function getOrigin(url = "") {
  try {
    return new URL(url).origin;
  } catch (error) {
    return url.replace(/\/$/, "");
  }
}

function removeNoise($) {
  $(
    [
      "script",
      "style",
      "noscript",
      "iframe",
      "header",
      "footer",
      "nav",
      "aside",
      "button",
      "input",
      "textarea",
      "select",
      ".popup",
      "#popupZone",
      "[class*='popup']",
      "[id*='popup']",
      ".comment",
      ".comment_list",
      ".comment_wrap",
      "[class*='comment']",
      "[id*='comment']",
      ".reply",
      "[class*='reply']",
      "[id*='reply']",
      ".sns",
      ".share",
      "[class*='share']",
      "[id*='share']",
    ].join(",")
  ).remove();
}

function extractDate(text = "") {
  const match = text.match(/\d{4}\.\d{2}\.\d{2}\.?|\d{4}-\d{2}-\d{2}/);
  if (!match) return "";
  return match[0].replace(/\.$/, "");
}

function hasOnlyPageNavigationContent(content = "") {
  const text = cleanText(content);
  const requiredNoiseWords = ["등록일", "작성자", "이전글", "다음글"];

  // 본문이 이미지/첨부파일만 있는 경우 extractContent가 상세 페이지 전체 텍스트를 가져오면서
  // 등록일, 작성자, 이전글, 다음글 같은 게시판 주변 문구만 content에 들어갈 수 있다.
  // 이 4개 문구가 모두 포함되면 유효한 본문이 아니라고 보고 크롤링 대상에서 제외한다.
  return requiredNoiseWords.every((word) => text.includes(word));
}

function extractContent($) {
  removeNoise($);

  const selectors = [
    ".contentArea td",
    ".contentArea",
    ".fr-view",
    ".article-content",
    ".board-view-content",
    ".view_cont",
    ".view-content",
    ".read_con",
    ".con_area",
    ".boardRead",
    ".bbsView",
    ".tbl_view",
    ".board_view",
    ".view",
    "#contents",
    "#content",
  ];

  for (const selector of selectors) {
    const text = cleanText($(selector).first().text());
    if (!text) continue;

    const badSignals = [
      "$(document)",
      "function(",
      "commentProc",
      "fn_goSearch",
      "append(",
      "alert(",
      "onclick=",
      "submit();",
    ];

    const hasBadSignal = badSignals.some((signal) => text.includes(signal));
    if (hasBadSignal) continue;

    if (text.length > 20) return text;
  }

  return cleanText($("body").text());
}

function toPublishedDate(dateString) {
  if (!dateString) return null;
  const normalized = dateString.replace(/\./g, "-");
  const date = new Date(`${normalized}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildNotice({ notice_scope, department, category, title, content, source_url, source_site, published_at }) {
  const now = new Date();
  return {
    notice_scope,
    department,
    category,
    title,
    content,
    source_url,
    source_site,
    published_at,
    created_at: now,
    updated_at: now,
  };
}

function findSchoolCategoryConfig(identifier = "") {
  const target = decodeURIComponent(String(identifier)).trim();
  return SCHOOL_CATEGORY_CONFIGS.find((config) => config.key === target || config.category === target);
}

function findDepartmentConfig(identifier = "") {
  const target = decodeURIComponent(String(identifier)).trim();
  return DEPARTMENT_CONFIGS.find((config) => config.key === target || config.department === target);
}

// =========================
// 학교 공지 공통 크롤러
// =========================
function getSchoolPageUrl(listUrl, pageIndex) {
  return `${listUrl}?pageIndex=${pageIndex}&`;
}

function extractSchoolUrlFromHtml(fragmentHtml = "", categoryKey = "generalnotice") {
  let match = fragmentHtml.match(/\/article\/[^\/"'<>]+\/detail\/\d+/);
  if (match) return toAbsoluteUrl(match[0], SCHOOL_BASE_URL);

  const jsPatterns = [
    /(?:goView|fnView|fn_detail|goDetail|viewArticle|detailView)\s*\(\s*['"]?(\d+)['"]?\s*\)/,
    /data-(?:id|idx|seq|no|article-id|articleid|board-id|boardid)\s*=\s*['"](\d+)['"]/
  ];

  for (const pattern of jsPatterns) {
    match = fragmentHtml.match(pattern);
    if (match) {
      return `${SCHOOL_BASE_URL}/article/${categoryKey}/detail/${match[1]}`;
    }
  }

  return "";
}

function parseSchoolListRowText(rowText = "") {
  const publishedAtRaw = extractDate(rowText);
  if (!publishedAtRaw) return null;

  const dateIndex = rowText.indexOf(publishedAtRaw);
  if (dateIndex === -1) return null;

  const beforeDate = cleanText(rowText.slice(0, dateIndex));
  const idMatch = beforeDate.match(/^(\d+)\s+(.*)$/);

  if (!idMatch) {
    // 제목 앞 번호가 숫자가 아니면(예: 공지) 제외
    return null;
  }

  const noticeId = idMatch[1];
  let title = cleanText(idMatch[2]);

  title = title
    .replace(/\s+조회\s*\d+$/g, "")
    .replace(/\s+조회수\s*\d+$/g, "")
    .replace(/\s+[가-힣A-Za-z]+$/g, "")
    .trim();

  return {
    noticeId,
    title,
    publishedAtRaw,
  };
}

function extractSchoolListItemsFromPageHtml(html, categoryKey) {
  const $ = cheerio.load(html);
  const candidateMap = new Map();

  $("tr, li, div").each((domIndex, el) => {
    const fragmentHtml = $.html(el);
    const rowText = cleanText($(el).text());

    if (!rowText) return;
    if (rowText.length < 10 || rowText.length > 220) return;

    const url = extractSchoolUrlFromHtml(fragmentHtml, categoryKey);
    if (!url) return;

    const parsed = parseSchoolListRowText(rowText);
    if (!parsed) return;

    const candidate = {
      domIndex,
      url,
      noticeId: parsed.noticeId,
      title: parsed.title,
      publishedAtRaw: parsed.publishedAtRaw,
      _textLength: rowText.length,
    };

    if (!candidate.title || candidate.title.length < 2) return;

    const existing = candidateMap.get(url);
    if (!existing || candidate._textLength < existing._textLength) {
      candidateMap.set(url, candidate);
    }
  });

  return [...candidateMap.values()]
    .sort((a, b) => a.domIndex - b.domIndex)
    .filter((item) => item.noticeId && /^\d+$/.test(item.noticeId))
    .map(({ _textLength, domIndex, ...rest }) => rest);
}

async function crawlSchoolNoticeDetail(item, category) {
  const { data: html } = await http.get(item.url);
  const $ = cheerio.load(html);
  const content = extractContent($);

  if (!content || content.length < 2) {
    console.log(`본문이 없어 학교 공지 제외: [${item.noticeId}] ${item.title}`);
    return null;
  }

  if (hasOnlyPageNavigationContent(content)) {
    console.log(`본문이 게시판 주변 문구뿐이라 학교 공지 제외: [${item.noticeId}] ${item.title}`);
    return null;
  }

  return buildNotice({
    notice_scope: "school",
    department: null,
    category,
    title: item.title,
    content,
    source_url: item.url,
    source_site: "학교 홈페이지",
    published_at: toPublishedDate(item.publishedAtRaw),
  });
}

async function crawlSingleSchoolCategory(config, sharedState = { seenUrls: new Set(), seenIds: new Set() }) {
  if (!config) throw new Error("학교 공지 카테고리 설정이 없습니다.");

  const results = [];
  let pageIndex = 1;
  let reachedNotice1 = false;

  while (!reachedNotice1) {
    const pageUrl = getSchoolPageUrl(config.listUrl, pageIndex);
    console.log(`\n=== 학교 ${config.category} pageIndex=${pageIndex} 크롤링 시작 ===`);

    const { data: html } = await http.get(pageUrl);
    const pageItems = extractSchoolListItemsFromPageHtml(html, config.key);

    console.log(`학교 ${config.category} page ${pageIndex}에서 추출한 일반 게시글 수: ${pageItems.length}`);

    if (pageItems.length === 0) break;

    for (const item of pageItems) {
      const dedupeKey = `${config.key}:${item.noticeId}`;
      if (sharedState.seenUrls.has(item.url)) continue;
      if (sharedState.seenIds.has(dedupeKey)) continue;

      const notice = await crawlSchoolNoticeDetail(item, config.category);
      if (notice) results.push(notice);

      sharedState.seenUrls.add(item.url);
      sharedState.seenIds.add(dedupeKey);

      console.log(`학교 ${config.category} 수집 완료: [${item.noticeId}] ${item.title}`);

      if (String(item.noticeId) === "1") {
        reachedNotice1 = true;
        break;
      }

      await sleep(REQUEST_DELAY_MS);
    }

    pageIndex += 1;
    if (pageIndex > 500) break;
    await sleep(REQUEST_DELAY_MS);
  }

  return results;
}

async function crawlSchoolNotices() {
  const sharedState = {
    seenUrls: new Set(),
    seenIds: new Set(),
  };

  const all = [];
  const categoryCounts = {};

  for (const config of SCHOOL_CATEGORY_CONFIGS) {
    const items = await crawlSingleSchoolCategory(config, sharedState);
    all.push(...items);
    categoryCounts[config.category] = items.length;
  }

  return {
    notices: all,
    categoryCounts,
  };
}

async function crawlSchoolCategory(identifier) {
  const config = findSchoolCategoryConfig(identifier);
  if (!config) {
    throw new Error(`지원하지 않는 학교 공지 카테고리입니다: ${identifier}`);
  }

  const notices = await crawlSingleSchoolCategory(config, {
    seenUrls: new Set(),
    seenIds: new Set(),
  });

  return {
    category: config.category,
    key: config.key,
    notices,
  };
}

// =========================
// 학과 공지 공통 크롤러
// =========================
function getConfigBaseUrl(config) {
  return getOrigin(config.homepageUrl || config.listUrl);
}

function inferHomePathFromUrl(url = "") {
  const match = String(url).match(/\/HOME\/([^\/]+)\//i);
  return match ? match[1] : "";
}

function normalizeDepartmentConfig(config) {
  const baseUrl = getConfigBaseUrl(config);
  const homePath = config.homePath || inferHomePathFromUrl(config.listUrl || config.homepageUrl) || config.key;

  return {
    ...config,
    baseUrl,
    homePath,
  };
}

function isProbablyDepartmentNoticeLink(text = "", href = "") {
  const clean = cleanText(text);
  const decodedHref = decodeURIComponent(String(href));

  if (!href) return false;
  if (/mode=view|mv_data=/i.test(decodedHref)) return false;
  if (!/sub\.htm/i.test(decodedHref)) return false;
  if (!/(nav_code|code)=/i.test(decodedHref)) return false;

  if (/학과\s*공지|공지\s*사항|공지|Notice|notice/i.test(clean)) return true;
  if (/notice|bbs|board/i.test(decodedHref)) return true;

  return false;
}

async function discoverDepartmentListUrl(rawConfig) {
  const config = normalizeDepartmentConfig(rawConfig);
  if (config.listUrl) return config.listUrl;

  const candidatePageUrls = [config.homepageUrl];
  const homeIndexUrl = `${config.baseUrl}/HOME/${config.homePath}/index.htm`;
  if (!candidatePageUrls.includes(homeIndexUrl)) candidatePageUrls.push(homeIndexUrl);

  const candidates = [];

  for (const pageUrl of candidatePageUrls) {
    try {
      const { data: html } = await http.get(pageUrl);
      const $ = cheerio.load(html);

      $("a[href]").each((index, a) => {
        const href = cleanText($(a).attr("href"));
        const text = cleanText($(a).text());
        if (!isProbablyDepartmentNoticeLink(text, href)) return;

        let score = 0;
        if (/학과\s*공지/.test(text)) score += 50;
        if (/공지\s*사항|공지/.test(text)) score += 30;
        if (/sub\.htm/i.test(href)) score += 10;
        if (href.includes(config.homePath)) score += 10;

        candidates.push({
          score,
          index,
          url: toAbsoluteUrl(href.replace(/&amp;/g, "&"), pageUrl),
          text,
        });
      });
    } catch (error) {
      console.warn(`${config.department} 메뉴 탐색 실패: ${pageUrl} - ${error.message}`);
    }
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score || a.index - b.index);
    return candidates[0].url;
  }

  throw new Error(`${config.department} 공지 목록 URL을 홈페이지에서 찾지 못했습니다.`);
}

function getDeptPageUrl(listUrl, startPage) {
  try {
    const url = new URL(listUrl);
    url.searchParams.set("startPage", String(startPage));
    return url.href;
  } catch (error) {
    const separator = listUrl.includes("?") ? "&" : "?";
    return `${listUrl}${separator}startPage=${startPage}`;
  }
}

function extractDeptDetailUrl(fragmentHtml = "", config, listUrl = "") {
  const baseUrl = config.baseUrl || getConfigBaseUrl(config);

  const hrefMatch = fragmentHtml.match(/\/HOME\/[^\/"'<>]+\/sub\.htm[^"'<>]*mode=view[^"'<>]*mv_data=[^"'<> ]+/i);
  if (hrefMatch) {
    return toAbsoluteUrl(hrefMatch[0].replace(/&amp;/g, "&"), baseUrl);
  }

  const mvDataMatch = fragmentHtml.match(/mv_data=([^"'<> ]+)/i);
  if (mvDataMatch) {
    const homePath = config.homePath || inferHomePathFromUrl(listUrl) || config.key;
    return `${baseUrl}/HOME/${homePath}/sub.htm?hmode=p&mode=view&mv_data=${mvDataMatch[1].replace(/&amp;/g, "&")}`;
  }

  return "";
}

function parseDeptNoticeId(text = "") {
  const cleaned = cleanText(text);
  if (/^\d+$/.test(cleaned)) return cleaned;

  // 제목 앞 번호가 숫자가 아니면(예: 공지) 제외
  return null;
}

function getDeptTitleCell($, tds) {
  const linkedCell = tds.toArray().find((td) => $(td).find("a[href], a[onclick]").length > 0);
  if (linkedCell) return $(linkedCell);
  return $(tds[1]);
}

function extractDeptListItemsFromPageHtml(html, rawConfig, listUrl) {
  const config = normalizeDepartmentConfig({ ...rawConfig, listUrl });
  const $ = cheerio.load(html);
  const items = [];
  const seenUrls = new Set();

  $("table tr, tbody tr").each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length < 3) return;

    const noText = cleanText($(tds[0]).text());
    const noticeId = parseDeptNoticeId(noText);
    if (!noticeId) return;

    const titleCell = getDeptTitleCell($, tds);
    let titleText = cleanText(titleCell.text())
      .replace(/^\d+\s+/, "")
      .replace(/첨부파일\s*/g, "")
      .trim();

    const rowHtml = $.html(tr);
    const rowText = cleanText($(tr).text());
    const publishedAtRaw = extractDate(rowText);

    if (!titleText || !publishedAtRaw) return;

    const firstLink = titleCell.find("a[href]").first();
    const href = cleanText(firstLink.attr("href"));
    const isUsableHref = href
      && href !== "#"
      && !href.startsWith("#")
      && !/^javascript:/i.test(href);

    let sourceUrl = "";
    if (isUsableHref) {
      sourceUrl = toAbsoluteUrl(href.replace(/&amp;/g, "&"), config.homepageUrl || config.baseUrl);
    }

    if (!sourceUrl || !/mode=view|mv_data=/i.test(sourceUrl)) {
      sourceUrl = extractDeptDetailUrl(rowHtml, config, listUrl);
    }

    if (!sourceUrl || seenUrls.has(sourceUrl)) return;
    seenUrls.add(sourceUrl);

    items.push({
      noticeId,
      title: titleText,
      publishedAtRaw,
      sourceUrl,
    });
  });

  return items;
}

async function crawlDeptNoticeDetail(item, rawConfig) {
  const config = normalizeDepartmentConfig(rawConfig);
  const { data: html } = await http.get(item.sourceUrl);
  const $ = cheerio.load(html);
  const content = extractContent($);

  if (!content || content.length < 2) {
    console.log(`본문이 없어 학과 공지 제외: ${config.department} [${item.noticeId}] ${item.title}`);
    return null;
  }

  if (hasOnlyPageNavigationContent(content)) {
    console.log(`본문이 게시판 주변 문구뿐이라 학과 공지 제외: ${config.department} [${item.noticeId}] ${item.title}`);
    return null;
  }

  return buildNotice({
    notice_scope: "department",
    department: config.department,
    category: "일반",
    title: item.title,
    content,
    source_url: item.sourceUrl,
    source_site: `${config.department} 홈페이지`,
    published_at: toPublishedDate(item.publishedAtRaw),
  });
}

async function crawlSingleDepartment(rawConfig) {
  const config = normalizeDepartmentConfig(rawConfig);
  const listUrl = await discoverDepartmentListUrl(config);
  const crawlConfig = normalizeDepartmentConfig({ ...config, listUrl });

  const results = [];
  const seenUrls = new Set();
  const seenNoticeIds = new Set();

  let startPage = 0;
  let reachedNotice1 = false;

  while (!reachedNotice1) {
    const pageUrl = getDeptPageUrl(listUrl, startPage);
    console.log(`\n=== ${crawlConfig.department} 학과공지 startPage=${startPage} 크롤링 시작 ===`);

    const { data: html } = await http.get(pageUrl);
    const pageItems = extractDeptListItemsFromPageHtml(html, crawlConfig, listUrl);

    console.log(`${crawlConfig.department} startPage=${startPage}에서 추출한 숫자 게시글 수: ${pageItems.length}`);

    if (pageItems.length === 0) break;

    for (const item of pageItems) {
      const dedupeKey = `${crawlConfig.key}:${item.noticeId}`;
      if (seenUrls.has(item.sourceUrl)) continue;
      if (seenNoticeIds.has(dedupeKey)) continue;

      const notice = await crawlDeptNoticeDetail(item, crawlConfig);
      if (notice) results.push(notice);

      seenUrls.add(item.sourceUrl);
      seenNoticeIds.add(dedupeKey);

      console.log(`${crawlConfig.department} 수집 완료: [${item.noticeId}] ${item.title}`);

      if (String(item.noticeId) === "1") {
        reachedNotice1 = true;
        break;
      }

      await sleep(REQUEST_DELAY_MS);
    }

    startPage += 10;
    if (startPage > 5000) break;
    await sleep(REQUEST_DELAY_MS);
  }

  return results;
}

async function crawlComputerDeptNotices() {
  const config = findDepartmentConfig("computer");
  return crawlSingleDepartment(config);
}

async function crawlDepartmentNotices(identifier) {
  const config = findDepartmentConfig(identifier);
  if (!config) {
    throw new Error(`지원하지 않는 학과입니다: ${identifier}`);
  }

  const notices = await crawlSingleDepartment(config);

  return {
    key: config.key,
    department: config.department,
    notices,
  };
}

async function crawlAllDepartmentNotices() {
  const all = [];
  const departmentCounts = {};
  const errors = [];

  for (const config of DEPARTMENT_CONFIGS) {
    try {
      const notices = await crawlSingleDepartment(config);
      all.push(...notices);
      departmentCounts[config.department] = notices.length;
    } catch (error) {
      departmentCounts[config.department] = 0;
      errors.push({
        key: config.key,
        department: config.department,
        message: error.message,
      });
      console.error(`${config.department} 크롤링 실패: ${error.message}`);
    }
  }

  return {
    notices: all,
    departmentCounts,
    errors,
  };
}

async function crawlAllNotices() {
  const school = await crawlSchoolNotices();
  const departments = await crawlAllDepartmentNotices();
  const allNotices = [...school.notices, ...departments.notices];

  return {
    schoolNotices: school.notices,
    schoolCategoryCounts: school.categoryCounts,
    departmentNotices: departments.notices,
    departmentCounts: departments.departmentCounts,
    departmentErrors: departments.errors,
    computerDeptNotices: departments.notices.filter((notice) => notice.department === "컴퓨터공학과"),
    allNotices,
  };
}

module.exports = {
  SCHOOL_CATEGORY_CONFIGS,
  DEPARTMENT_CONFIGS,
  findSchoolCategoryConfig,
  findDepartmentConfig,
  crawlSchoolNotices,
  crawlSchoolCategory,
  crawlSingleSchoolCategory,
  crawlComputerDeptNotices,
  crawlDepartmentNotices,
  crawlAllDepartmentNotices,
  crawlAllNotices,
};
