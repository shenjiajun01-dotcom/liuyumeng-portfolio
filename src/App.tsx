import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Mail,
  Menu,
  Phone,
  Plus,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import {
  awards,
  experience,
  pageImage,
  profile,
  projects,
  skills,
  type Category,
} from "./content";

// 站点可能部署在子路径（如 GitHub Pages 的项目站点），静态资源需要带 base 前缀。
const BASE = import.meta.env.BASE_URL;

const PortfolioReader = lazy(() => import("./PortfolioReader"));
const filters: ("全部作品" | Category)[] = [
  "全部作品",
  "景观更新",
  "空间设计",
  "手绘表达",
  "多元探索",
];
const navItems = [
  { href: "#work", label: "作品集" },
  { href: "#about", label: "关于我" },
  { href: "#experience", label: "实践经历" },
  { href: "#contact", label: "联系我" },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("全部作品");
  const [reader, setReader] = useState<{
    pages: number[];
    title: string;
    initialPage?: number;
  } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleProjects =
    filter === "全部作品"
      ? projects
      : projects.filter((project) => project.category === filter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
      },
      { rootMargin: "-18% 0px -60% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("section[id], footer[id]")
      .forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const openProject = (id: string) => {
    const project = projects.find((entry) => entry.id === id)!;
    setReader({ pages: project.pages, title: project.title });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      copyTimeout.current = setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#work">
        跳转到作品集
      </a>
      <header className="header">
        <a className="wordmark" href="#home" aria-label="刘雨朦，返回首页">
          <span className="brand-symbol">
            y<span>.</span>
          </span>
          <span>
            刘雨朦<span className="wordmark-en">LIU YUMENG</span>
          </span>
        </a>
        <nav
          className={`navigation ${menuOpen ? "is-open" : ""}`}
          id="main-navigation"
          aria-label="主导航"
        >
          {navItems.map((item) => (
            <a
              className={activeSection === item.href ? "active" : ""}
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <span className="nav-dot" />
            </a>
          ))}
        </nav>
        <a className="header-download" href={profile.resume} download>
          <span>下载简历</span>
          <ArrowDownToLine size={15} />
        </a>
        <button
          className="icon-button menu-toggle"
          aria-label={menuOpen ? "关闭导航" : "打开导航"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <img
            className="hero-image"
            src={`${BASE}assets/hero.webp`}
            alt="校园师范林改造设计，绿荫与水景间的白色休憩亭"
            width="2100"
            height="1234"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <motion.div
              className="hero-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="status-dot" /> ENVIRONMENT & LANDSCAPE DESIGN
            </motion.div>
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.12 }}
            >
              刘雨朦<span>LIU YUMENG</span>
            </motion.h1>
            <motion.p
              className="hero-statement"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
            >
              于自然中观察，
              <br />
              在空间里回应。
            </motion.p>
            <a className="hero-link" href="#work">
              探索作品 <ArrowDownRight />
            </a>
          </div>
          <div className="hero-bottom">
            <span>景观 · 空间 · 视觉表达</span>
            <span className="hero-credit">
              校园师范林改造 / 梅韵师心 · 林润德芳
            </span>
            <a href="#work" aria-label="向下浏览作品" className="scroll-cue">
              <ArrowDown size={18} />
            </a>
          </div>
          <span className="hero-side">PORTFOLIO / SELECTED EXPLORATIONS</span>
        </section>

        <section
          className="work-section section-shell"
          id="work"
          aria-labelledby="work-title"
        >
          <Reveal className="section-heading">
            <div className="section-title-row">
              <h2 id="work-title">
                设计作品<span className="english-heading">Selected Works</span>
              </h2>
              <span className="section-counter">01 — 06</span>
            </div>
            <p className="section-intro">
              从在地文化出发，探索人与场所之间的更多可能。
            </p>
          </Reveal>
          <div className="work-toolbar">
            <div className="filter-list" role="group" aria-label="作品分类">
              {filters.map((item) => (
                <button
                  key={item}
                  aria-pressed={filter === item}
                  className={filter === item ? "selected" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                  {item === "全部作品" && <sup>06</sup>}
                </button>
              ))}
            </div>
            <button
              className="text-link portfolio-open"
              onClick={() =>
                setReader({
                  pages: Array.from({ length: 19 }, (_, index) => index + 1),
                  title: "完整作品集",
                })
              }
            >
              完整作品集 <ArrowUpRight size={17} />
            </button>
          </div>
          <div
            className={`project-grid ${filter !== "全部作品" ? "is-filtered" : ""}`}
          >
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project, index) => (
                <motion.article
                  className={`project project-${project.id}`}
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                >
                  <button
                    className="project-image-button"
                    onClick={() => openProject(project.id)}
                    aria-label={`查看${project.title}作品详情`}
                  >
                    <img
                      src={project.cover}
                      alt={project.subtitle}
                      width="1300"
                      height="900"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="project-image-overlay" />
                    <span className="project-number">/{project.id}</span>
                    {project.id === "04" && (
                      <span className="built-label">
                        <span /> 已落地
                      </span>
                    )}
                    <span className="project-open">
                      <ArrowUpRight size={26} />
                    </span>
                  </button>
                  <div className="project-caption">
                    <div>
                      <span className="project-category">
                        {project.category} / {project.english}
                      </span>
                      <h3>
                        <button onClick={() => openProject(project.id)}>
                          {project.title}
                        </button>
                      </h3>
                      <p>{project.subtitle}</p>
                    </div>
                    <span className="project-page">
                      P. {project.printedPages}
                    </span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
          <div className="archive-bar">
            <span>每一次探索，都有迹可循。</span>
            <button
              className="text-link"
              aria-expanded={archiveOpen}
              aria-controls="all-spreads"
              onClick={() => setArchiveOpen(!archiveOpen)}
            >
              {archiveOpen ? "收起全部跨页" : "浏览全部跨页"}{" "}
              <span className="small-count">19</span>
              <ChevronDown className={archiveOpen ? "rotated" : ""} size={17} />
            </button>
          </div>
          {archiveOpen && (
            <div className="archive-grid" id="all-spreads">
              {Array.from({ length: 19 }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() =>
                      setReader({
                        pages: Array.from(
                          { length: 19 },
                          (_, index) => index + 1,
                        ),
                        title: "完整作品集",
                        initialPage: page,
                      })
                    }
                    aria-label={`查看作品集 PDF 第 ${page} 页`}
                  >
                    <img
                      src={pageImage(page, true)}
                      alt={`作品集第 ${page} 个跨页`}
                      loading="lazy"
                      width="760"
                      height="270"
                    />
                    <span>
                      {String(page).padStart(2, "0")} / 19{" "}
                      <ArrowUpRight size={14} />
                    </span>
                  </button>
                ),
              )}
            </div>
          )}
        </section>

        <section
          className="about-section section-shell"
          id="about"
          aria-labelledby="about-title"
        >
          <Reveal className="about-layout">
            <div className="portrait-wrap">
              <img
                src={`${BASE}assets/portrait.webp`}
                alt="刘雨朦个人证件照"
                loading="lazy"
                width="640"
                height="760"
              />
              <div className="portrait-caption">
                <span>刘雨朦</span>
                <span>设计，是观察的延伸。</span>
              </div>
            </div>
            <div className="about-content">
              <span className="eyebrow">A LITTLE ABOUT ME</span>
              <h2 id="about-title">
                让场所拥有记忆，
                <br />
                让设计贴近日常。
              </h2>
              <p className="about-lead">
                我是刘雨朦，一名关注地域文化与空间体验的设计学习者。
              </p>
              <p className="body-copy">
                从场地分析、方案推演到建模与视觉表达，我希望把对自然、人文和日常生活的观察，转化为可感知的空间。擅长将地域文化元素转译为设计语言，也持续探索手绘与
                AI 辅助创作的可能。
              </p>
              <div className="education">
                <div>
                  <span className="education-date">2026.09 — 2029.06</span>
                  <h3>
                    武汉理工大学 <span>硕士 · 在读</span>
                  </h3>
                  <p>设计</p>
                </div>
                <div>
                  <span className="education-date">2022.09 — 2026.06</span>
                  <h3>
                    宁波大学 <span>本科</span>
                  </h3>
                  <p>环境艺术设计（景观方向）</p>
                </div>
              </div>
              <div className="about-bottom">
                <span>出生于 2004.05</span>
                <a className="text-link" href={profile.resume} download>
                  下载简历 <ArrowDownToLine size={16} />
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal className="skills-area">
            <div className="minor-heading">
              <h3>设计工具箱</h3>
              <span>从想法，到表达。</span>
            </div>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div className="skill-group" key={skill.title}>
                  <span className="skill-index">0{index + 1}</span>
                  <h4>{skill.title}</h4>
                  <span className="skill-english">{skill.english}</span>
                  <div className="tool-list">
                    {skill.tools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section
          className="experience-section section-shell"
          id="experience"
          aria-labelledby="experience-title"
        >
          <Reveal className="section-heading">
            <h2 id="experience-title">
              在实践中生长<span className="english-heading">Experience</span>
            </h2>
            <p className="section-intro">把课堂里的思考，带进真实的场景。</p>
          </Reveal>
          <div className="experience-list">
            {experience.map((entry) => (
              <Reveal
                className={`experience-row ${entry.project ? "featured-experience" : ""}`}
                key={entry.company}
              >
                <div className="experience-period">
                  {entry.period}
                  {entry.project && (
                    <span className="practice-label">
                      <span /> 设计实践
                    </span>
                  )}
                </div>
                <div className="experience-body">
                  <div className="experience-title">
                    <h3>{entry.company}</h3>
                    <span>{entry.role}</span>
                  </div>
                  <p>{entry.description}</p>
                  {entry.details && (
                    <p className="experience-details">{entry.details}</p>
                  )}
                  {entry.project && (
                    <>
                      <button
                        className="experience-toggle"
                        aria-expanded={expanded}
                        aria-controls="sangeng-project"
                        onClick={() => setExpanded(!expanded)}
                      >
                        <span>
                          查看相关作品{" "}
                          <span className="chapter-label">PORTFOLIO / 04</span>
                        </span>
                        {expanded ? <X size={19} /> : <Plus size={19} />}
                      </button>
                      {expanded && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="internship-project"
                          id="sangeng-project"
                        >
                          <button
                            className="internship-preview"
                            onClick={() => openProject("04")}
                            aria-label="打开第04部分：大徐江岸新屋景观改造"
                          >
                            <img
                              src={pageImage(11)}
                              alt="作品集第04部分，大徐江岸新屋景观改造完整跨页，印刷页18至19"
                              width="2600"
                              height="920"
                              loading="lazy"
                            />
                            <span className="project-open">
                              <ArrowUpRight />
                            </span>
                          </button>
                          <div className="internship-caption">
                            <div>
                              <h4>大徐江岸新屋 · 景观改造</h4>
                              <span>
                                已落地项目 / 作品集第 04 部分 / 印刷页 18–19
                              </span>
                            </div>
                            <button
                              className="text-link"
                              onClick={() => openProject("04")}
                            >
                              放大查看 <ArrowUpRight size={17} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="campus-row">
            <span className="experience-period">2023.07 — 2024.07</span>
            <div>
              <span className="campus-label">校园经历</span>
              <h3>宁波大学潘天寿建筑与艺术设计学院</h3>
              <span className="campus-role">美编部主席</span>
              <p>
                组织技能培训、团队建设与活动海报制作；统筹迎新晚会、校园文化节等校园大型活动的宣传工作。
              </p>
            </div>
          </Reveal>
        </section>

        <section
          className="awards-section section-shell"
          aria-labelledby="awards-title"
        >
          <Reveal className="awards-layout">
            <div>
              <h2 id="awards-title">
                努力的回响
                <span className="english-heading">Honors & Awards</span>
              </h2>
              <ul className="honors-note" aria-label="在校荣誉">
                <li>省政府奖学金</li>
                <li>校三好学生</li>
                <li>校优秀学生干部</li>
              </ul>
            </div>
            <div className="awards-list">
              {awards.map((award) => (
                <div className="award-row" key={award.title}>
                  <span className="award-year">{award.year}</span>
                  <h3>{award.title}</h3>
                  <span className="award-level">{award.level}</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="contact-section section-shell" id="contact">
        <Reveal>
          <div className="contact-top">
            <span className="eyebrow">LET'S MAKE SOMETHING MEANINGFUL</span>
            <span className="contact-status">
              <span className="status-dot" /> 期待下一次设计相遇
            </span>
          </div>
          <div className="contact-heading">
            <h2>
              从一次对话开始<span>Let's connect.</span>
            </h2>
            <a
              className="contact-arrow"
              href={`mailto:${profile.email}`}
              aria-label="发送邮件给刘雨朦"
            >
              <ArrowUpRight />
            </a>
          </div>
          <div className="contact-links">
            <div>
              <Mail size={17} />
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <button
                className="icon-button copy-button"
                title={copied ? "已复制邮箱" : "复制邮箱"}
                aria-label={copied ? "已复制邮箱" : "复制邮箱"}
                onClick={copyEmail}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
              <span role="status" className="copy-status">
                {copied ? "已复制" : ""}
              </span>
            </div>
            <div>
              <Phone size={17} />
              <a href={`tel:${profile.phone}`}>{profile.phone}</a>
            </div>
            <a
              className="text-link footer-download"
              href={profile.portfolio}
              download
            >
              下载作品集 PDF <ArrowDownToLine size={17} />
            </a>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} 刘雨朦 LIU YUMENG</span>
            <span>观察自然 · 感知空间 · 持续探索</span>
            <a href="#home">
              回到顶部 <ArrowRight className="back-top-icon" size={15} />
            </a>
          </div>
        </Reveal>
      </footer>
      <AnimatePresence>
        {reader && (
          <Suspense
            fallback={
              <div className="reader-loading" role="status">
                <span>作品加载中</span>
                <button
                  className="icon-button"
                  aria-label="取消打开作品"
                  onClick={() => setReader(null)}
                >
                  <X />
                </button>
              </div>
            }
          >
            <PortfolioReader
              key={reader.title}
              {...reader}
              onClose={() => setReader(null)}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

function ArrowDownRight() {
  return <ArrowLeft className="down-right-icon" size={17} />;
}

export default App;
