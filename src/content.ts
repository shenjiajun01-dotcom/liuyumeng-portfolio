export type Category = "景观更新" | "空间设计" | "手绘表达" | "多元探索";

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  english: string;
  category: Category;
  cover: string;
  pages: number[];
  printedPages: string;
  description: string;
  tags: string[];
};

// 站点可能部署在子路径（如 GitHub Pages 的项目站点），
// 因此所有静态资源地址都以 Vite 的 base 为前缀。
const BASE = import.meta.env.BASE_URL;

export const projects: Project[] = [
  {
    id: "01",
    title: "面传真情",
    subtitle: "张坪村饮食馆设计与改造",
    english: "A taste of local memory",
    category: "空间设计",
    cover: `${BASE}assets/project-01.webp`,
    pages: [4, 5, 6],
    printedPages: "04–09",
    description:
      "以乡村本土文化为线索，将饮食记忆融入空间。结合原有建筑结构，组织展馆动线、室内场景与建筑外观，回应张坪村的地域特色。",
    tags: ["乡村文化", "室内改造", "空间叙事"],
  },
  {
    id: "02",
    title: "凤岙怀古 · 老街新戏",
    subtitle: "戏台广场与集市空间改造",
    english: "Old streets, new stories",
    category: "景观更新",
    cover: `${BASE}assets/project-02.webp`,
    pages: [7, 8],
    printedPages: "10–13",
    description:
      "围绕戏台广场与集市空间展开更新设计，让地方文化、日常活动与公共空间相互连接，在老街中延续新的生活场景。",
    tags: ["公共空间", "街区更新", "在地文化"],
  },
  {
    id: "03",
    title: "梅韵师心 · 林润德芳",
    subtitle: "校园师范林改造",
    english: "A place to grow",
    category: "景观更新",
    cover: `${BASE}assets/project-03.webp`,
    pages: [9, 10],
    printedPages: "14–17",
    description:
      "从校园师范林的自然与人文背景出发，探索休憩、交流与纪念功能的融合，通过植物、构筑物与游线组织，建立人与校园景观的联系。",
    tags: ["校园景观", "植物空间", "人文记忆"],
  },
  {
    id: "04",
    title: "大徐江岸新屋",
    subtitle: "景观改造 · 已落地项目",
    english: "A riverside renewal",
    category: "景观更新",
    cover: `${BASE}assets/project-04.webp`,
    pages: [11],
    printedPages: "18–19",
    description:
      "宁波三更景观设计有限公司实习参与项目。围绕大徐江岸新屋开展景观改造，作品集收录设计分析、建筑与场地表达，以及项目建成后的现场照片。",
    tags: ["实习项目", "景观改造", "已落地"],
  },
  {
    id: "05",
    title: "手绘与空间想象",
    subtitle: "手绘篇",
    english: "Drawing the possibilities",
    category: "手绘表达",
    cover: `${BASE}assets/project-05.webp`,
    pages: [12, 13, 14],
    printedPages: "20–25",
    description:
      "以手绘探索空间、城市与传统文化。收录「栖于林间」「解构空间」「悬浮城市」与「屏间戏影」，从公共空间到未来城市，呈现不同尺度下的设计思考。",
    tags: ["手绘表现", "概念探索", "传统文化"],
  },
  {
    id: "06",
    title: "不止于空间",
    subtitle: "多元展示篇",
    english: "Beyond the landscape",
    category: "多元探索",
    cover: `${BASE}assets/project-06.webp`,
    pages: [15, 16, 17, 18, 19],
    printedPages: "26–35",
    description:
      "跨越装置、建筑表达、品牌与摄影。包含「流动剧场」「荷影流韵」「织构城市」、美丽琼酒瓶包装与产品建模、品牌标识及文创设计，以及宁波象山游仙寨艺术酒店摄影「再生与传承」。",
    tags: ["视觉传达", "产品建模", "建筑摄影"],
  },
];

export const profile = {
  name: "刘雨朦",
  englishName: "LIU YUMENG",
  email: "2660438409@qq.com",
  phone: "18627866502",
  birthday: "2004.05",
  portfolio: `${BASE}documents/liu-yumeng-portfolio.pdf`,
  resume: `${BASE}documents/liu-yumeng-resume.pptx`,
};

export const experience = [
  {
    period: "2026.07 — 2026.08",
    company: "湖北新文道时代教育科技有限公司",
    role: "班主任",
    description:
      "全程陪伴考生备考，监督每日学习状态、跟进复习进度，督促学习计划落地；关注学生情绪并开展心理疏导，协助解决学习与生活问题，推送考研资讯与备考指引。",
  },
  {
    period: "2024.06 — 2024.08",
    company: "武汉市江汉区维特幼儿园",
    role: "环创设计 / 美术幼师",
    description:
      "负责暑期幼儿园室内各主题环创设计，协助开展美术、手工等艺术课程，将设计表达与儿童美育相结合。",
  },
  {
    period: "2023.03 — 2024.05",
    company: "宁波三更景观设计有限公司",
    role: "项目助理",
    description:
      "协助完成大徐江岸新屋景观改造、宁波大学校地合作项目（潘天寿建筑与艺术设计学院·袁马艺术创作基地、芸济无人机学院·袁马教育培训基地）及袁马红色影院设计。",
    details:
      "使用 Photoshop、Lovart AI 制图并制作投标与汇报展板、PPT；使用 Illustrator 统一排版与色调，使用 SketchUp、AutoCAD 开展工程制图与场地建模；使用 Midjourney、Lovart、Enscape、D5 制作效果图、渲染与视频。",
    project: "04",
  },
];

export const skills = [
  {
    title: "制图与建模",
    english: "Drafting & Modeling",
    tools: ["AutoCAD", "SketchUp"],
  },
  {
    title: "渲染与视觉表现",
    english: "Rendering & Visualization",
    tools: ["Lumion / Enscape", "D5", "Photoshop", "Illustrator"],
  },
  {
    title: "AI 辅助创作",
    english: "AI-assisted Creation",
    tools: ["Lovart", "Midjourney", "ChatGPT", "TapNow"],
  },
];

export const awards = [
  {
    year: "2024",
    title: "第十九届浙江省大学生电子商务竞赛",
    level: "浙江省二等奖",
  },
  { year: "2024", title: "全国大学生健美操锦标赛", level: "全国第二名" },
  { year: "2023", title: "浙江省大学生广告艺术大赛", level: "校级一等奖" },
  { year: "2023", title: "浙江省乡村振兴大赛（文创组）", level: "校级二等奖" },
];

export const pageImage = (page: number, thumbnail = false) =>
  `${BASE}assets/${thumbnail ? "thumbs" : "pages"}/page-${String(page).padStart(2, "0")}.webp`;
export const pageProject = (page: number) =>
  projects.find((project) => project.pages.includes(page));
