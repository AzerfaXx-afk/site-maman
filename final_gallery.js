const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'pages', 'galerie.html');
let content = fs.readFileSync(srcFile, 'utf8');

const regex = /\/\* FULL WIDTH ARTISTIC MASONRY CSS - EXACT LAYOUT \*\/(.|\n)*?(?=\/\* LIGHTBOX STYLES EXACTLY LIKE QUI-JE-SUIS \*\/)/;
const newCSS = `/* FULL WIDTH ARTISTIC MASONRY CSS - EXACT LAYOUT */
        .artistic-gallery {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 33.333vw; /* Perfect squares based on screen width */
            gap: 2px; /* Very thin premium line between images */
            padding: 0;
            margin: 0;
            width: 100%;
            grid-auto-flow: dense;
        }

        .diploma-item {
            position: relative;
            overflow: hidden;
            cursor: pointer;
            border-radius: 0; /* No radius */
            padding: 0;
            margin: 0;
            background: #000;
            display: block;
            z-index: 1;
            border: none;
            box-shadow: none;
            -webkit-tap-highlight-color: rgba(0,0,0,0); /* Remove blue flash on mobile tap */
        }
        .diploma-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 0;
            pointer-events: none; /* Let the div handle clicks */
            transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease;
        }
        /* Elegant hover zoom */
        @media (hover: hover) {
            .diploma-item:hover {
                z-index: 2;
            }
            .diploma-item:hover img {
                transform: scale(1.05);
                opacity: 0.9;
            }
        }

        .zoom-btn {
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            background: rgba(255,255,255,0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateY(15px);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 3;
            font-size: 1.1rem;
            pointer-events: none; /* Let parent handle clicks */
        }
        
        @media (hover: hover) {
            .diploma-item:hover .zoom-btn {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Fix for iOS Safari Double-Tap Bug */
        @media (hover: none) {
            .zoom-btn {
                opacity: 1;
                transform: translateY(0);
                background: rgba(255,255,255,0.7);
                width: 36px; height: 36px;
                bottom: 10px; right: 10px;
                font-size: 0.9rem;
            }
        }
        
        /* 
           PERFECT REPEATING 3-COLUMN MOSAIC FOR ALL 24 IMAGES
           Block 1 (Items 1-3): Big Left, 2 Small Right
           Block 2 (Items 4-6): Big Right, 2 Small Left
           This naturally alternates to create an incredible mosaic!
        */
        .diploma-item:nth-child(6n + 1) { 
            grid-column: 1 / 3; 
            grid-row: span 2; 
        }

        .diploma-item:nth-child(6n + 4) { 
            grid-column: 2 / 4; 
            grid-row: span 2; 
        }

        @media (max-width: 900px) {
            .artistic-gallery {
                grid-template-columns: repeat(2, 1fr);
                grid-auto-rows: 50vw;
            }
            .diploma-item {
                grid-column: span 1 !important;
                grid-row: span 1 !important;
            }
            /* Alternate 1 wide row, 2 squares on mobile/tablet */
            .diploma-item:nth-child(3n+1) {
                grid-column: 1 / 3 !important;
                grid-row: span 1 !important;
            }
        }

`;

content = content.replace(regex, newCSS);
if (content.includes("6n + 1")) {
    fs.writeFileSync(srcFile, content, 'utf8');
    console.log("Success! Applied absolute edge-to-edge layout for ALL images with touch-fix.");
} else {
    console.log("Failed to find replacement token.");
}
