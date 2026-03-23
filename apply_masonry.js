const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'pages', 'galerie.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The CSS replacement block
const cssRegex = /\/\* ARTISTIC BENTO GRID CSS \*\/(.|\n)*?(?=\/\* LIGHTBOX STYLES EXACTLY LIKE QUI-JE-SUIS \*\/)/;
const newCSS = `/* FULL WIDTH ARTISTIC MASONRY CSS */
        .artistic-gallery {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 25vw; /* Height relative to screen width! */
            gap: 15px;
            padding: 0 15px; /* Full width with slight edge buffer */
            width: 100%;
            max-width: 2500px;
            margin: 0 auto;
            grid-auto-flow: dense;
        }

        .diploma-item {
            position: relative;
            overflow: hidden;
            cursor: pointer;
            border-radius: 8px; /* Modern subtle radius */
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            background: #fff;
            display: block; /* Remove old padding and borders from diploma style */
            z-index: 1;
        }
        .diploma-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            pointer-events: none;
            transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .diploma-item:hover img {
            transform: scale(1.08); /* Pro hover zoom */
        }
        .diploma-item::after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(43,29,20,0.2);
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
        }
        .diploma-item:hover::after {
            opacity: 1; /* Slight elegant darkening on hover */
        }

        /* The zoom button that user wanted identical to diplomas */
        .zoom-btn {
            position: absolute;
            bottom: 15px;
            right: 15px;
            width: 44px;
            height: 44px;
            background: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateY(15px);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 2;
            font-size: 1.1rem;
        }
        .diploma-item:hover .zoom-btn {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* The specific spans for the artistic arrangement */
        .diploma-item:nth-child(1)  { grid-column: span 2; grid-row: span 2; }
        .diploma-item:nth-child(4)  { grid-column: span 2; grid-row: span 1; }
        .diploma-item:nth-child(8)  { grid-column: span 1; grid-row: span 2; }
        .diploma-item:nth-child(11) { grid-column: span 2; grid-row: span 2; }
        .diploma-item:nth-child(15) { grid-column: span 2; grid-row: span 1; }
        .diploma-item:nth-child(18) { grid-column: span 2; grid-row: span 2; }
        .diploma-item:nth-child(23) { grid-column: span 2; grid-row: span 1; }

        @media (max-width: 992px) {
            .artistic-gallery { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 30vw; }
            .diploma-item:nth-child(4), 
            .diploma-item:nth-child(15), 
            .diploma-item:nth-child(23) { grid-column: span 2; grid-row: span 1; }
            .diploma-item:nth-child(11) { grid-column: span 2; grid-row: span 2; }
        }
        
        @media (max-width: 600px) {
            .artistic-gallery { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 45vw; gap: 8px; padding: 0 8px; }
            .diploma-item { border-radius: 6px; }
            .diploma-item:nth-child(1),
            .diploma-item:nth-child(11),
            .diploma-item:nth-child(18) { grid-column: span 2; grid-row: span 2; }
            .diploma-item:nth-child(4),
            .diploma-item:nth-child(15),
            .diploma-item:nth-child(23) { grid-column: span 2; grid-row: span 1; }
            .diploma-item:nth-child(8) { grid-column: span 1; grid-row: span 1; }
            
            .zoom-btn {
                opacity: 1 !important; /* Always visible on mobile since no hover */
                transform: translateY(0) !important;
                width: 35px; height: 35px;
                bottom: 8px; right: 8px;
                font-size: 0.9rem;
            }
        }
        
`;

content = content.replace(cssRegex, newCSS);

// Update max-width 1200, 768, 480 queries to remove any overlapping grid changes
const queryRegex1200 = /@media\s*\(max-width:\s*1200px\)\s*\{\s*\.diplomas-grid[^}]+\}\s*\.diploma-item:[^}]+\}\s*\}/g;
content = content.replace(queryRegex1200, ''); // Remove the old 1200px query entirely because we handled it above in max-width: 992px

const queryRegex768Grid = /\.diplomas-grid[^}]+\}/g;
content = content.replace(queryRegex768Grid, ''); // We will let the artistic media queries take over

// The HTML structure currently has <div class="container"> wrapping <div class="diplomas-grid">
// We need to move <div class="diplomas-grid"> OUTSIDE the container to be full width
content = content.replace('<div class="diplomas-grid">', '</div><!-- End Container -->\n                <div class="artistic-gallery">');
content = content.replace('<!-- JS will inject images here -->\n                </div>\n            </div>', '<!-- JS will inject images here -->\n                </div>');

// One minor fix: replace diplomas-grid with artistic-gallery within GSAP scroll trigger target!
content = content.replace("scrollTrigger: { trigger: '.diplomas-grid'", "scrollTrigger: { trigger: '.artistic-gallery'");

fs.writeFileSync(srcFile, content, 'utf8');
console.log('Done!');
