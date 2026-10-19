import { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Maximize,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { pageImage, pageProject, profile } from "./content";

type Props = {
  pages: number[];
  title: string;
  initialPage?: number;
  onClose: () => void;
};

export default function PortfolioReader({
  pages,
  title,
  initialPage,
  onClose,
}: Props) {
  const [index, setIndex] = useState(
    Math.max(0, pages.indexOf(initialPage ?? pages[0])),
  );
  const [zoom, setZoom] = useState(1);
  const [loadedPage, setLoadedPage] = useState(0);
  const [failedPage, setFailedPage] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const currentPage = pages[index];
  const project = pageProject(currentPage);

  useEffect(() => {
    const focused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const dialog = dialogRef.current!;
    const bodyOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = bodyOverflow;
      focused?.focus({ preventScroll: true });
    };
  }, []);

  const changePage = (next: number) => {
    setIndex(Math.min(pages.length - 1, Math.max(0, next)));
    setZoom(1);
    stageRef.current?.scrollTo({ left: 0, top: 0 });
  };

  return (
    <motion.dialog
      ref={dialogRef}
      className="reader"
      aria-labelledby="reader-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.25 }}
      onKeyDown={(event) => {
        if (event.target instanceof HTMLSelectElement) return;
        if (event.key === "ArrowRight") {
          event.preventDefault();
          changePage(index + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          changePage(index - 1);
        }
      }}
    >
      <div className="reader-header">
        <div>
          <span className="reader-overline">LIU YUMENG / PORTFOLIO</span>
          <h2 id="reader-title">{title}</h2>
        </div>
        <div className="reader-header-actions">
          <a
            className="icon-button"
            href={`${profile.portfolio}#page=${currentPage}`}
            target="_blank"
            rel="noreferrer"
            title="打开原始 PDF"
            aria-label="在新标签页打开原始PDF"
          >
            <ExternalLink size={18} />
          </a>
          <a
            className="icon-button"
            href={profile.portfolio}
            download
            title="下载作品集"
            aria-label="下载完整作品集PDF"
          >
            <ArrowDownToLine size={19} />
          </a>
          <button
            className="icon-button close-reader"
            onClick={onClose}
            title="关闭"
            aria-label="关闭作品预览"
            autoFocus
          >
            <X size={23} />
          </button>
        </div>
      </div>
      <div className="reader-content">
        <div
          className={`reader-stage ${zoom > 1 ? "is-zoomed" : ""}`}
          ref={stageRef}
          aria-busy={loadedPage !== currentPage && failedPage !== currentPage}
        >
          {loadedPage !== currentPage && failedPage !== currentPage && (
            <div className="image-skeleton" role="status">
              正在加载作品
            </div>
          )}
          {failedPage === currentPage ? (
            <div className="reader-error">
              <p>这张作品暂时未能加载。</p>
              <button
                className="text-link"
                onClick={() => {
                  setFailedPage(0);
                  setLoadedPage(0);
                }}
              >
                重新加载 <RotateCcw size={16} />
              </button>
              <a
                href={`${profile.portfolio}#page=${currentPage}`}
                target="_blank"
                rel="noreferrer"
              >
                打开原始 PDF
              </a>
            </div>
          ) : (
            <img
              key={currentPage}
              className={`reader-image ${loadedPage === currentPage ? "is-loaded" : ""}`}
              width="2600"
              height="920"
              style={{ width: `${zoom * 100}%` }}
              src={pageImage(currentPage)}
              alt={`${project?.title ?? (currentPage === 1 ? "作品集封面" : currentPage === 2 ? "作品集设计理念" : "作品集目录")}，PDF第${currentPage}页完整跨页`}
              onLoad={() => setLoadedPage(currentPage)}
              onError={() => setFailedPage(currentPage)}
            />
          )}
        </div>
        <aside className="reader-sidebar">
          {project ? (
            <>
              <span className="reader-chapter">CHAPTER {project.id}</span>
              <h3>{project.title}</h3>
              <p className="reader-subtitle">{project.subtitle}</p>
              <p className="reader-description">{project.description}</p>
              <div className="reader-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <dl>
                <div>
                  <dt>作品分类</dt>
                  <dd>{project.category}</dd>
                </div>
                <div>
                  <dt>印刷页码</dt>
                  <dd>{project.printedPages}</dd>
                </div>
              </dl>
            </>
          ) : (
            <>
              <span className="reader-chapter">PORTFOLIO</span>
              <h3>
                {currentPage === 1
                  ? "作品集封面"
                  : currentPage === 2
                    ? "设计理念"
                    : "作品目录"}
              </h3>
              <p className="reader-description">
                一个人性化的景观，需要将人文性和历史性融入在地性。
              </p>
            </>
          )}
          <span className="reader-page-note">PDF 第 {currentPage} / 19 页</span>
        </aside>
      </div>
      <div className="reader-controls">
        <div className="reader-pagination">
          <button
            className="icon-button"
            disabled={index === 0}
            onClick={() => changePage(index - 1)}
            aria-label="上一页"
            title="上一页"
          >
            <ArrowLeft size={19} />
          </button>
          <label className="page-select-label">
            <span className="sr-only">跳转到作品页</span>
            <select
              value={index}
              onChange={(event) => changePage(Number(event.target.value))}
            >
              {pages.map((page, pageIndex) => (
                <option key={page} value={pageIndex}>
                  {String(pageIndex + 1).padStart(2, "0")} /{" "}
                  {String(pages.length).padStart(2, "0")}
                </option>
              ))}
            </select>
          </label>
          <button
            className="icon-button"
            disabled={index === pages.length - 1}
            onClick={() => changePage(index + 1)}
            aria-label="下一页"
            title="下一页"
          >
            <ArrowRight size={19} />
          </button>
        </div>
        <div className="reader-zoom">
          <button
            className="icon-button"
            disabled={zoom <= 1}
            onClick={() => setZoom(Math.max(1, zoom - 0.5))}
            aria-label="缩小作品"
            title="缩小"
          >
            <Minus size={18} />
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button
            className="icon-button"
            disabled={zoom >= 3}
            onClick={() => setZoom(Math.min(3, zoom + 0.5))}
            aria-label="放大作品"
            title="放大"
          >
            <Plus size={18} />
          </button>
          <button
            className="icon-button fit-button"
            onClick={() => {
              setZoom(1);
              stageRef.current?.scrollTo({ left: 0, top: 0 });
            }}
            aria-label="适应窗口"
            title="适应窗口"
          >
            <Maximize size={17} />
          </button>
        </div>
      </div>
    </motion.dialog>
  );
}
