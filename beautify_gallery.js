const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'pages', 'galerie.html');
let content = fs.readFileSync(file, 'utf8');

const splitToken = '/* IDENTICAL TO DIPLOMAS CSS */';
const endToken = '</style>';

if (content.includes(splitToken) && content.includes(endToken)) {
    const startCSS = content.substring(0, content.indexOf(splitToken));
    const endHTML = content.substring(content.indexOf(endToken));

    const newCSS = `/* ARTISTIC BENTO GRID CSS */
        .diplomas-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 250px;
            gap: 15px;
            grid-auto-flow: dense;
        }
        .diploma-item {
            background: #fff;
            border-radius: 12px;
            padding: 6px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.08);
            cursor: pointer;
            transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.4s ease;
            border: 2px solid transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 1;
            overflow: hidden;
        }
        .diploma-item:hover {
            box-shadow: 0 20px 40px rgba(193, 154, 107, 0.3);
            border-color: var(--primary-color);
            transform: translateY(-5px);
            z-index: 2;
        }
        .diploma-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 6px;
            pointer-events: none;
            transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .diploma-item:hover img {
            transform: scale(1.08);
        }
        .zoom-btn {
            position: absolute;
            bottom: 12px;
            right: 12px;
            width: 40px;
            height: 40px;
            background: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            opacity: 0;
            transform: translateY(15px);
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 2;
        }
        .diploma-item:hover .zoom-btn {
            opacity: 1;
            transform: translateY(0);
        }

        /* Bento Layout Spans */
        .diploma-item:nth-child(1),
        .diploma-item:nth-child(8),
        .diploma-item:nth-child(14),
        .diploma-item:nth-child(21) {
            grid-column: span 2;
            grid-row: span 2;
        }
        .diploma-item:nth-child(3),
        .diploma-item:nth-child(10),
        .diploma-item:nth-child(17),
        .diploma-item:nth-child(24) {
            grid-column: span 2;
            grid-row: span 1;
        }
        .diploma-item:nth-child(5),
        .diploma-item:nth-child(12),
        .diploma-item:nth-child(19) {
            grid-column: span 1;
            grid-row: span 2;
        }

        /* LIGHTBOX STYLES EXACTLY LIKE QUI-JE-SUIS */
        .lightbox {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(43, 29, 20, 0.95);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: var(--transition-smooth);
        }
        .lightbox.active {
            opacity: 1;
            visibility: visible;
        }
        .lightbox.active .lightbox-content {
            transform: scale(1);
        }
        .lightbox-zoom-container {
            position: relative;
            max-width: 94vw;
            max-height: 90vh;
            overflow: hidden;
            touch-action: none;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .lightbox-zoom-container.zoomed {
            cursor: grab;
            overflow: auto;
        }
        .lightbox-zoom-container.zoomed:active {
            cursor: grabbing;
        }
        .lightbox-content {
            max-width: 94vw;
            max-height: 88vh;
            width: auto;
            height: auto;
            object-fit: contain;
            display: block;
            border-radius: 6px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            image-rendering: -webkit-optimize-contrast;
            image-rendering: high-quality;
        }
        .lightbox-zoom-container.zoomed .lightbox-content {
            width: auto;
            height: auto;
            max-width: none;
            max-height: none;
            cursor: grab;
        }
        .lightbox-counter {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255,255,255,0.7);
            font-family: var(--font-body);
            font-size: 0.9rem;
            letter-spacing: 2px;
            z-index: 10001;
            background: rgba(0,0,0,0.3);
            padding: 6px 16px;
            border-radius: 20px;
            backdrop-filter: blur(5px);
        }
        .lightbox-close {
            position: absolute;
            top: 30px;
            right: 40px;
            color: #fff;
            font-size: 2.5rem;
            cursor: pointer;
            transition: color 0.3s;
            z-index: 10001;
        }
        .lightbox-close:hover {
            color: var(--primary-color);
        }
        .lightbox-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: #fff;
            font-size: 3rem;
            cursor: pointer;
            transition: all 0.3s;
            z-index: 10001;
            padding: 20px;
            background: rgba(0,0,0,0.2);
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .lightbox-nav:hover {
            color: var(--primary-color);
            background: rgba(0,0,0,0.4);
        }
        .lightbox-prev { left: 2%; }
        .lightbox-next { right: 2%; }
        
        @media (max-width: 1200px) {
            .diplomas-grid { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 220px; }
            .diploma-item:nth-child(24) { grid-column: span 1; }
        }
        @media (max-width: 992px) {
            .page-title { font-size: 3.5rem; }
            .page-subtitle { font-size: 1.5rem; }
            .lightbox-nav { font-size: 1.5rem; padding: 10px; width: 44px; height: 44px; }
            .lightbox-prev { left: 5px; }
            .lightbox-next { right: 5px; }
            .lightbox-close { top: 10px; right: 15px; font-size: 2rem; }
        }
        @media (max-width: 768px) {
            .page-title { font-size: 2.8rem; }
            .page-subtitle { font-size: 1.2rem; }
            .page-hero { height: 50vh; }
            
            .diplomas-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 150px; gap: 10px; }
            .lightbox-content { max-width: 96vw; max-height: 86vh; }
            .lightbox-nav { font-size: 1.5rem; padding: 10px; width: 44px; height: 44px; }
            .lightbox-prev { left: 5px; }
            .lightbox-next { right: 5px; }
            .lightbox-close { top: 10px; right: 15px; font-size: 2rem; }
            .lightbox-counter { bottom: 10px; font-size: 0.8rem; }
            .zoom-btn { opacity: 1; transform: none; width: 32px; height: 32px; font-size: 0.9rem; }
            
            /* Reset some spans for 2 columns */
            .diploma-item:nth-child(3),
            .diploma-item:nth-child(10),
            .diploma-item:nth-child(17),
            .diploma-item:nth-child(24) { grid-column: span 2; grid-row: span 1; }
            .diploma-item:nth-child(5),
            .diploma-item:nth-child(12),
            .diploma-item:nth-child(19) { grid-column: span 1; grid-row: span 2; }
        }
        @media (max-width: 480px) {
            .lightbox-content { max-width: 100vw; max-height: 82vh; border-radius: 0; }
            .lightbox-close { top: 8px; right: 12px; font-size: 1.8rem; }
            .lightbox-nav { font-size: 1.2rem; width: 36px; height: 36px; padding: 8px; }
            .lightbox-prev { left: 2px; }
            .lightbox-next { right: 2px; }
            
            /* Pinterest style for mobile */
            .diplomas-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 110px; gap: 8px; }
        }
    `;

    const finalContent = startCSS + newCSS + "\n    " + endHTML;
    fs.writeFileSync(file, finalContent, 'utf8');
    console.log("Gallery beautified!");
} else {
    console.log("Tokens not found, rewrite failed.");
}
