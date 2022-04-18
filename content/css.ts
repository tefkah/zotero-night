import { nord } from './nord'

export const css = `${nord}

div#viewer .page {
	        	  filter: brightness(0.91) grayscale(0.15) invert(0.95) sepia(0.65) hue-rotate(180deg);
        		  border-image: none;
	        	}

                #viewer {
                    background-color: var(--nord1) !important;
                }
                
                #sidebarContent {
                    background-color: var(--nord2) !important;
                }
                
                #toolbarSidebar {
                    background-color: var(--nord0) !important;
                    color: var(--nord5) !important;
                }

                [dir] #toolbarContainer, [dir] #toolbarViewer {
                    background-color: var(--nord3) !important;
                    color: var(--nord5) !important;
                }

                #toolbarViewer button {
	        	  filter: brightness(0.91) grayscale(0.15) invert(0.95) sepia(0.65) hue-rotate(180deg) !important;
        		  border-image: none !important;
                }
                
                #selector .tags {
                    color: var(--nord5) !important;
                }

                .search {
                    background-color: var(--nord2) !important;
                    color: var(--nord4) !important;
                    border: 0 !important;
                }
                
                .annotation {
                    background-color: var(--nord3) !important;
                    color: var(--nord5) !important;
                }
                
                .annotation .highlight {
                    color: var(--nord4) !important;
                }
[dir] .editor .content:focus {
 cursor:text;
 background:var(--nord1) !important;
}
.editor .content:empty::before {
 content:attr(placeholder);
 color:var(--nord9) !important;
}
.editor .content:empty:focus::before {
 color:var(--nord2) !important;
}
.annotation-popup .editor .content:empty::before {
 color:var(--nord2) !important;
}
[dir] .editor .bubble {
 background-color:var(--nord6) !important;
 border:1px solid var(--nord4) !important;
 margin-top:-15px;
 border-radius:5px
}
[dir] .editor .bubble .button:hover {
 background-color: var(--nord4) !important;
}
                `
