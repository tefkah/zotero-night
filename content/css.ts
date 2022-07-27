import { nord } from './nord'

const editor = `

[theme='dark'] body {
  background-color: var(--body-background-color) !important;
}

[theme='dark'] a {
  background-color: var(--a-background-color) !important;
}

[theme='dark'] .ProseMirror-hideselection *::-moz-selection {
  background: var(--a-background-color) !important;
}

[theme='dark'] .ProseMirror-hideselection *::selection {
  background: var(--a-background-color) !important;
}

[theme='dark'] .ProseMirror-hideselection *::-moz-selection {
  background: var(--a-background-color) !important;
}

[theme='dark'] .ProseMirror-hideselection {
  caret-color: var(--a-background-color) !important;
}

[theme='dark'] .citation.selected,
[theme='dark'] .citation:hover {
  background-color: var(--citation-hover-background-color) !important;
}

[theme='dark'] .citation.ProseMirror-selectednode {
  background-color: var(--citation-ProseMirror-selectednode-background-color) !important;
}

[theme='dark'] .find {
  background-color: var(--find-background-color) !important;
}

[theme='dark'] .primary-editor.column-resize-handle {
  background-color: var(--primary-editor-column-resize-handle-background-color) !important;
}

[theme='dark'] .primary-editor.selectedCell:after {
  background: var(--primary-editor-selectedCell-after-background) !important;
}

[theme='dark'] .ProseMirror-gapcursor:after {
  border-top: 1px solid var(--ProseMirror-gapcursor-after-border-top) !important;
}

[theme='dark'] .primary-editor p,
[theme='dark'] .primary-editor h1,
[theme='dark'] .primary-editor h2,
[theme='dark'] .primary-editor h3,
[theme='dark'] .primary-editor h4,
[theme='dark'] .primary-editor h5,
[theme='dark'] .primary-editor h6 {
  color: var(--h6-color) !important;
}

[theme='dark'='ltr'] .primary-editor blockquote {
  border-left: 3px solid var(--blockquote-border-left) !important;
}

[theme='dark'='rtl'] .primary-editor blockquote {
  border-right: 3px solid var(--blockquote-border-left) !important;
}

[theme='dark'] .primary-editor pre {
  background: var(--pre-background) !important;
}

[theme='dark'] .primary-editor p code {
  background: var(--pre-background) !important;
}

[theme='dark'] .primary-editor table {
  border: 1px solid var(--table-border) !important;
}

[theme='dark'] .primary-editor table td,
[theme='dark'] .primary-editor table th {
  border: 1px solid var(--table-border) !important;
}

[theme='dark'] .primary-editor table .selectedCell:after {
  background: var(--primary-editor-selectedCell-after-background) !important;
}

[theme='dark'] .primary-editor table .column-resize-handle {
  background-color: var(--primary-editor-column-resize-handle-background-color) !important;
}

[theme='dark'] .ProseMirror .empty-node::before {
  color: var(--empty-node--before-color) !important;
}

[theme='dark'] .node-selected {
  background-color: var(--node-selected-background-color) !important;
}

[theme='dark'] .blocks-selected *::-moz-selection {
  background-color: var(--a-background-color) !important;
}

[theme='dark'] .blocks-selected *::selection {
  background-color: var(--a-background-color) !important;
}

[theme='dark'] .ProseMirror-selectednode {
  background-color: var(--citation-ProseMirror-selectednode-background-color) !important;
}

[theme='dark'] .primary-editor hr {
  background-color: var(--table-border) !important;
}

[theme='dark'] .primary-editor hr.ProseMirror-selectednode {
  background-color: var(--primary-editor-column-resize-handle-background-color) !important;
}

[theme='dark'] .regular-image .resized-wrapper .image {
  border: 1px solid var(--image-border) !important;
}

[theme='dark'] .external-image .resized-wrapper {
  border: 1px solid var(--image-border) !important;
}

[theme='dark'] .import-placeholder-image .image {
  background-color: var(--image-background-color) !important;
}

[theme='dark'] .popup-container .popup {
  background-color: var(--body-background-color) !important;
  border: 1px solid var(--image-border) !important;
  box-shadow: 0 0 24px 0 var(--popup-box-shadow) !important;
}

[theme='dark'] .popup-container .popup::before,
[theme='dark'] .popup-container .popup::after {
  border: solid var(--a-background-color) !important;
}

[theme='dark'] .popup-container .popup[class*='bottom']::before {
  border-bottom-color: var(--before-border-bottom-color) !important;
}

[theme='dark'] .popup-container .popup[class*='bottom']::after {
  border-bottom-color: var(--body-background-color) !important;
}

[theme='dark'] .popup-container .popup[class*='top']::before {
  border-top-color: var(--before-border-bottom-color) !important;
}

[theme='dark'] .popup-container .popup[class*='top']::after {
  border-top-color: var(--body-background-color) !important;
}

[theme='dark'] .popup-container .popup button {
  background: var(--body-background-color) !important;
}

[theme='dark'] .popup-container .popup button:hover {
  background: var(--button-hover-background) !important;
}

[theme='dark'] .findbar {
  color: var(--findbar-color) !important;
}

[theme='dark'] .findbar {
  border-bottom: 1px solid var(--image-border) !important;
}

[theme='dark'] .findbar .line .input-box {
  border: 1px solid var(--image-border) !important;
}

[theme='dark'] .findbar .line .input-box .buttons .button {
  color: var(--button-color) !important;
}

[theme='dark'] .findbar .line .input-box .buttons .button:hover {
  background-color: var(--button-hover-background) !important;
}

[theme='dark'] .findbar .line .input-box .buttons .button:active,
[theme='dark'] .findbar .line .input-box .buttons .button.active {
  color: var(--body-background-color) !important;
}

[theme='dark'] .findbar .line .input-box .buttons .button:active,
[theme='dark'] .findbar .line .input-box .buttons .button.active {
  background-color: var(--button-color) !important;
}

[theme='dark'] .findbar .line .input-box .buttons .text-button {
  border: 1px solid var(--image-background-color) !important;
}

[theme='dark'] .noticebar {
  color: var(--ProseMirror-gapcursor-after-border-top) !important;
}

[theme='dark'] .noticebar {
  border-bottom: 1px solid var(--image-border) !important;
  background: var(--noticebar-background) !important;
}

[theme='dark'] .toolbar {
  color: var(--button-color) !important;
}

[theme='dark'] .toolbar {
  border-bottom: 1px solid var(--image-border) !important;
}

[theme='dark'] .toolbar-button {
  color: var(--button-color) !important;
}

[theme='dark'] .toolbar-button:hover {
  background-color: var(--button-hover-background) !important;
}

[theme='dark'] .toolbar-button:active,
[theme='dark'] .toolbar-button.active {
  color: var(--body-background-color) !important;
}

[theme='dark'] .toolbar-button:active,
[theme='dark'] .toolbar-button.active {
  background-color: var(--button-color) !important;
}

[theme='dark'] .dropdown .popup {
  background-color: var(--body-background-color) !important;
  border: 1px solid var(--image-border) !important;
  box-shadow: 0 0 24px 0 var(--popup-box-shadow) !important;
}

[theme='dark'] .text-dropdown .popup .inline-options {
  border-bottom: 1px solid var(--image-border) !important;
}

[theme='dark'] .text-dropdown .popup .block-options .option:hover {
  background-color: var(--button-hover-background) !important;
}

[theme='dark'] .text-dropdown .popup .block-options .option.active {
  color: var(--body-background-color) !important;
}

[theme='dark'] .text-dropdown .popup .block-options .option.active {
  background-color: var(--button-color) !important;
}

[theme='dark'] .colors-dropdown .popup .grid {
  border-bottom: 1px solid var(--image-border) !important;
}

[theme='dark'] .colors-dropdown .popup .grid .color-button:hover {
  background-color: var(--button-hover-background) !important;
}

[theme='dark'] .colors-dropdown .popup .grid .icon-color {
  border: 1px solid var(--icon-color-border) !important;
}

[theme='dark'] .colors-dropdown .popup .grid .clear {
  border: 2px solid var(--ProseMirror-gapcursor-after-border-top) !important;
}

[theme='dark'] .font-colors-dropdown .popup .grid {
  border-bottom: 1px solid var(--image-border) !important;
}

[theme='dark'] .font-colors-dropdown .popup .grid .color-button:hover {
  background-color: var(--button-hover-background) !important;
}

[theme='dark'] .font-colors-dropdown .popup .grid .icon-color {
  border: 1px solid var(--icon-color-border) !important;
}

[theme='dark'] .font-colors-dropdown .popup .grid .clear {
  border: 2px solid var(--ProseMirror-gapcursor-after-border-top) !important;
}

[theme='dark'] .more-dropdown .popup hr {
  border-bottom: 1px solid var(--image-border) !important;
}

[theme='dark'] .more-dropdown .popup .option:hover {
  background-color: var(--button-hover-background) !important;
}

`

export const css = `${nord}
[theme='dark'] * {
    border: 0 !important;
    transition: color 0.15s ease, background-color 0.15s ease, filter 0.4s ease;
}
[theme='dark'] body {
   background: var(--nord0) !important;
}
[theme='dark'] sidebarResizer {
background:    var(--nord0) !important
}

[theme='dark'] div#viewer .page {
    background-color: var(--nord0) !important;
    border: 9px solid transparent !important;

}

[theme='dark'] .page-popup-container .page-popup {
  background-color: var(--nord1);
  color: var(--nord5);
}
[theme='dark'] .page-popup-container .page-popup::before {
  background-color: var(--nord1);
  color: var(--nord5);
}
[theme='dark'] .page-popup[class*="bottom"]::after {
  border-bottom-color: var(--nord1)
}

/* div#viewer .page .canvasWrapper {
	        	  filter: var(--dark-filter) !important;
        		  border-image: none;
	        	}
                */

[theme='dark']                 #viewer {
                    background-color: var(--nord0) !important;
                }
                
[theme='dark']                 #sidebarContent {
                    background-color: var(--nord0) !important;
                }
                
[theme='dark']                 #toolbarSidebar {
                    background-color: var(--nord0) !important;
                    color: var(--nord5) !important;
                    border: 0;
                }

                [theme='dark'] #toolbarContainer, [theme='dark'] #toolbarViewer {
                    background-color: var(--nord0) !important;
                    color: var(--nord5) !important;
                }

[theme='dark']                 #toolbarViewer button {
	        	  filter: brightness(0.91) grayscale(0.15) invert(0.95) sepia(0.65) hue-rotate(180deg) !important;
        		  border-image: none !important;
              border-radius: 1rem;
                }


[theme='dark']                 #toolbarViewer #reader-toolbar-button-color-picker {
      filter: none !important;
    }
                
[theme='dark']                 #selector .tags {
                    color: var(--nord5) !important;
                }

[theme='dark']                 .search {
                    background-color: var(--nord2) !important;
                    color: var(--nord4) !important;
                    border: 0 !important;
                }
                
[theme='dark']                 .annotation {
                    background-color: var(--nord2) !important;
                    color: var(--nord5) !important;
                    padding: .3rem;
                    border-color: var(--nord3) !important;
                }
                
[theme='dark']                 .annotation .highlight {
                    color: var(--nord4) !important;
                }
[theme='dark']                 .annotation:hover {
                    background-color: var(--nord3) !important;
                }
[theme='dark']                 #toolbarViewer button:hover{
                    background: var(--nord3) !important;
                    cursor: pointer !important;
                }

[theme='dark'] .splitToolbarButton {
    filter: var(--dark-filter) !important;
}

[theme='dark'] #outlineView .treeItem > a{
    color: var(--nord4) !important;
}
[theme='dark'] #annotationsView .search {
    margin: 6px 5px !important;
}

[theme='dark'] #annotationsView .search input {
    background: var(--nord4);
}

[theme='dark'] .editor .content:focus {
 cursor:text;
 background:var(--nord1) !important;
}

[theme='dark'] .editor .content:empty::before {
 content:attr(placeholder) !important;
 color:var(--nord4);
}

[theme='dark'] .editor .content:empty:focus::before {
 color:var(--nord4);
}

[theme='dark'] .annotation-popup .editor .content:empty::before {
 color:var(--nord4);
}

[theme='dark'] .editor .bubble {
 background-color:var(--nord6) !important;
 border:1px solid var(--nord4) !important;
 margin-top:-15px;
 border-radius:5px
}
[theme='dark'] .editor .bubble .button:hover {
 background-color: var(--nord4) !important;
}
[theme='dark'] #zotero-context-toolbar-extension {
    background:var(--nord0) !important;
    background-color:var(--nord0) !important;
}
[theme='dark'] box#zotero-tab-toolbar{
    background:var(--nord0) !important;
    background-color:var(--nord0) !important;
}
[theme='dark'] box#zotero-tb-split {
    background:var(--nord0) !important;
    background-color:var(--nord0) !important;
}
[theme='dark'] .notes-container, .zotero-context-notes-list {
    background-color: var(--nord1) !important;
}

[theme='dark'] #zotero-context-notes-list textbox {
    background-color: var(--nord4) !important;
}

[theme='dark'] .notes-list {
    color: var(--nord6) !important;
}

[theme='dark'] .notes-list .body-line {
    color: var(--nord4) !important;
}

[theme='dark'] .note-row .inner, .more-row{
    background-color: var(--nord1) !important
}

[theme='dark'] .header-row button {
    background-color: var(--nord6) !important;
    color: var(--nord1) !important;
    border-radius: 5px !important;
    
}

[theme='dark'] .toolbar {
    background: var(--nord0) !important;
}
[theme='dark'] .editor .toolbar-button {
color: var(--nord4)
}

[theme='dark'] .primary-editor p {

    color: var(--nord6);

}

[theme='dark'] .splitToolbarButton .button, [theme='dark'] .tool-group button, [theme='dark'] .annotation-tools button, .toolbar button {
    box-shadow: none !important;
    background: none !important;
    cursor: pointer !important;
}


[theme='dark'] .splitToolbarButton .button, [theme='dark'] .tool-group button, [theme='dark'] .annotation-tools button, .toolbar button {
    background: none;
}

[theme='dark'] .toolbar #pageNumber {
 padding:0 4px;
 background:linear-gradient(to bottom, var(--nord2), var(--nord1)) !important;
 box-shadow: none !important;
 color: var(--nord5) !important;

 border-radius:3px;
}
[theme='dark'] .toolbar #numPages {
    color: var(--nord4) !important;
}

[theme='dark'] .zotero-editpane-tabs {
  background: var(--nord1) !important;
}

[theme='dark'] .zotero-editpane-tabs .tab {
  background: var(--nord3);
}
[theme="dark"] #zotero-context-pane-inner {
    background-color: var(--nord0);
}

[theme='dark'] .zotero-context-pane-editor-parent-line {
    background-color: var(--nord0);
    color: var(--nord4);
}
[theme='dark'] #links-container{
    background-color: var(--nord0);
    color: var(--nord4);
}
[theme="dark"] .toolbar .annotation-tools .toolbarButton > span {
    background: none !important;
}

[theme='dark'] .zotero-editpane-tabs tab label:not(.zotero-clicky) {
  color: var(--nord4);
}

[theme='dark'] .zotero-editpane-tabs tab[selected='true'] {
  filter: var(--dark-filter) !important;
}


[theme='dark'] toolbarbutton {
  background: none;
}

[theme='dark'] toolbarbutton dropmarker {
  filter: var(--dark-filter);
}

[theme='dark'] .toolbarbutton span {
  background: none !important;
}

${editor}
                `
