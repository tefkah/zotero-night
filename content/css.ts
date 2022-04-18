import { nord } from './nord'

const editor = `

[dir] body {
  background-color: var(--body-background-color) !important;
}

[dir] a {
  background-color: var(--a-background-color) !important;
}

[dir] .ProseMirror-hideselection *::-moz-selection {
  background: var(--a-background-color) !important;
}

[dir] .ProseMirror-hideselection *::selection {
  background: var(--a-background-color) !important;
}

[dir] .ProseMirror-hideselection *::-moz-selection {
  background: var(--a-background-color) !important;
}

.ProseMirror-hideselection {
  caret-color: var(--a-background-color) !important;
}

[dir] .citation.selected,
[dir] .citation:hover {
  background-color: var(--citation-hover-background-color) !important;
}

[dir] .citation.ProseMirror-selectednode {
  background-color: var(--citation-ProseMirror-selectednode-background-color) !important;
}

[dir] .find {
  background-color: var(--find-background-color) !important;
}

[dir] .primary-editor.column-resize-handle {
  background-color: var(--primary-editor-column-resize-handle-background-color) !important;
}

[dir] .primary-editor.selectedCell:after {
  background: var(--primary-editor-selectedCell-after-background) !important;
}

[dir] .ProseMirror-gapcursor:after {
  border-top: 1px solid var(--ProseMirror-gapcursor-after-border-top) !important;
}

.primary-editor p,
.primary-editor h1,
.primary-editor h2,
.primary-editor h3,
.primary-editor h4,
.primary-editor h5,
.primary-editor h6 {
  color: var(--h6-color) !important;
}

[dir='ltr'] .primary-editor blockquote {
  border-left: 3px solid var(--blockquote-border-left) !important;
}

[dir='rtl'] .primary-editor blockquote {
  border-right: 3px solid var(--blockquote-border-left) !important;
}

[dir] .primary-editor pre {
  background: var(--pre-background) !important;
}

[dir] .primary-editor p code {
  background: var(--pre-background) !important;
}

[dir] .primary-editor table {
  border: 1px solid var(--table-border) !important;
}

[dir] .primary-editor table td,
[dir] .primary-editor table th {
  border: 1px solid var(--table-border) !important;
}

[dir] .primary-editor table .selectedCell:after {
  background: var(--primary-editor-selectedCell-after-background) !important;
}

[dir] .primary-editor table .column-resize-handle {
  background-color: var(--primary-editor-column-resize-handle-background-color) !important;
}

.ProseMirror .empty-node::before {
  color: var(--empty-node--before-color) !important;
}

[dir] .node-selected {
  background-color: var(--node-selected-background-color) !important;
}

[dir] .blocks-selected *::-moz-selection {
  background-color: var(--a-background-color) !important;
}

[dir] .blocks-selected *::selection {
  background-color: var(--a-background-color) !important;
}

[dir] .ProseMirror-selectednode {
  background-color: var(--citation-ProseMirror-selectednode-background-color) !important;
}

[dir] .primary-editor hr {
  background-color: var(--table-border) !important;
}

[dir] .primary-editor hr.ProseMirror-selectednode {
  background-color: var(--primary-editor-column-resize-handle-background-color) !important;
}

[dir] .regular-image .resized-wrapper .image {
  border: 1px solid var(--image-border) !important;
}

[dir] .external-image .resized-wrapper {
  border: 1px solid var(--image-border) !important;
}

[dir] .import-placeholder-image .image {
  background-color: var(--image-background-color) !important;
}

[dir] .popup-container .popup {
  background-color: var(--body-background-color) !important;
  border: 1px solid var(--image-border) !important;
  box-shadow: 0 0 24px 0 var(--popup-box-shadow) !important;
}

[dir] .popup-container .popup::before,
[dir] .popup-container .popup::after {
  border: solid var(--a-background-color) !important;
}

[dir] .popup-container .popup[class*='bottom']::before {
  border-bottom-color: var(--before-border-bottom-color) !important;
}

[dir] .popup-container .popup[class*='bottom']::after {
  border-bottom-color: var(--body-background-color) !important;
}

[dir] .popup-container .popup[class*='top']::before {
  border-top-color: var(--before-border-bottom-color) !important;
}

[dir] .popup-container .popup[class*='top']::after {
  border-top-color: var(--body-background-color) !important;
}

[dir] .popup-container .popup button {
  background: var(--body-background-color) !important;
}

[dir] .popup-container .popup button:hover {
  background: var(--button-hover-background) !important;
}

.findbar {
  color: var(--findbar-color) !important;
}

[dir] .findbar {
  border-bottom: 1px solid var(--image-border) !important;
}

[dir] .findbar .line .input-box {
  border: 1px solid var(--image-border) !important;
}

.findbar .line .input-box .buttons .button {
  color: var(--button-color) !important;
}

[dir] .findbar .line .input-box .buttons .button:hover {
  background-color: var(--button-hover-background) !important;
}

.findbar .line .input-box .buttons .button:active,
.findbar .line .input-box .buttons .button.active {
  color: var(--body-background-color) !important;
}

[dir] .findbar .line .input-box .buttons .button:active,
[dir] .findbar .line .input-box .buttons .button.active {
  background-color: var(--button-color) !important;
}

[dir] .findbar .line .input-box .buttons .text-button {
  border: 1px solid var(--image-background-color) !important;
}

.noticebar {
  color: var(--ProseMirror-gapcursor-after-border-top) !important;
}

[dir] .noticebar {
  border-bottom: 1px solid var(--image-border) !important;
  background: var(--noticebar-background) !important;
}

.toolbar {
  color: var(--button-color) !important;
}

[dir] .toolbar {
  border-bottom: 1px solid var(--image-border) !important;
}

.toolbar-button {
  color: var(--button-color) !important;
}

[dir] .toolbar-button:hover {
  background-color: var(--button-hover-background) !important;
}

.toolbar-button:active,
.toolbar-button.active {
  color: var(--body-background-color) !important;
}

[dir] .toolbar-button:active,
[dir] .toolbar-button.active {
  background-color: var(--button-color) !important;
}

[dir] .dropdown .popup {
  background-color: var(--body-background-color) !important;
  border: 1px solid var(--image-border) !important;
  box-shadow: 0 0 24px 0 var(--popup-box-shadow) !important;
}

[dir] .text-dropdown .popup .inline-options {
  border-bottom: 1px solid var(--image-border) !important;
}

[dir] .text-dropdown .popup .block-options .option:hover {
  background-color: var(--button-hover-background) !important;
}

.text-dropdown .popup .block-options .option.active {
  color: var(--body-background-color) !important;
}

[dir] .text-dropdown .popup .block-options .option.active {
  background-color: var(--button-color) !important;
}

[dir] .colors-dropdown .popup .grid {
  border-bottom: 1px solid var(--image-border) !important;
}

[dir] .colors-dropdown .popup .grid .color-button:hover {
  background-color: var(--button-hover-background) !important;
}

[dir] .colors-dropdown .popup .grid .icon-color {
  border: 1px solid var(--icon-color-border) !important;
}

[dir] .colors-dropdown .popup .grid .clear {
  border: 2px solid var(--ProseMirror-gapcursor-after-border-top) !important;
}

[dir] .font-colors-dropdown .popup .grid {
  border-bottom: 1px solid var(--image-border) !important;
}

[dir] .font-colors-dropdown .popup .grid .color-button:hover {
  background-color: var(--button-hover-background) !important;
}

[dir] .font-colors-dropdown .popup .grid .icon-color {
  border: 1px solid var(--icon-color-border) !important;
}

[dir] .font-colors-dropdown .popup .grid .clear {
  border: 2px solid var(--ProseMirror-gapcursor-after-border-top) !important;
}

[dir] .more-dropdown .popup hr {
  border-bottom: 1px solid var(--image-border) !important;
}

[dir] .more-dropdown .popup .option:hover {
  background-color: var(--button-hover-background) !important;
}

`

export const css = `${nord}
* {
    border: 0 !important;
    transition: color 0.15s ease, background-color 0.15s ease
}
body {
   background: var(--nord0) !important;
}
[dir] sidebarResizer {
background:    var(--nord0) !important
}
div#viewer .page .canvasWrapper, div#viewer .page .textLayer {
	        	  filter: var(--nord-filter) !important;
        		  border-image: none;
	        	}

                #viewer {
                    background-color: var(--nord0) !important;
                }
                
                #sidebarContent {
                    background-color: var(--nord0) !important;
                }
                
                #toolbarSidebar {
                    background-color: var(--nord0) !important;
                    color: var(--nord5) !important;
                    border: 0;
                }

                [dir] #toolbarContainer, [dir] #toolbarViewer {
                    background-color: var(--nord0) !important;
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
                    background-color: var(--nord2) !important;
                    color: var(--nord5) !important;
                    padding: .3rem;
                    border-color: var(--nord3) !important;
                }
                
                .annotation .highlight {
                    color: var(--nord4) !important;
                }
                .annotation:hover {
                    background-color: var(--nord3) !important;
                }
                #toolbarViewer button:hover{
                    background: var(--nord3) !important;
                    cursor: pointer !important;
                }

.splitToolbarButton {
    filter: var(--nord-filter) !important;
}

[dir] #outlineView .treeItem > a{
    color: var(--nord4) !important;
}
[dir] #annotationsView .search {
    margin: 6px 5px !important;
}

[theme='dark'] #annotationsView .search input {
    background: var(--nord4);
}

[dir] .editor .content:focus {
 cursor:text;
 background:var(--nord1) !important;
}

.editor .content:empty::before {
 content:attr(placeholder) !important;
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
#zotero-context-toolbar-extension {
    background:var(--nord0) !important;
    background-color:var(--nord0) !important;
}
box#zotero-tab-toolbar{
    background:var(--nord0) !important;
    background-color:var(--nord0) !important;
}
box#zotero-tb-split {
    background:var(--nord0) !important;
    background-color:var(--nord0) !important;
}
.notes-container, .zotero-context-notes-list {
    background-color: var(--nord1) !important;
}

#zotero-context-notes-list textbox {
    background-color: var(--nord4) !important;
}

.notes-list {
    color: var(--nord6) !important;
}

[dir] .notes-list .body-line {
    color: var(--nord4) !important;
}

[dir] .note-row .inner, .more-row{
    background-color: var(--nord1) !important
}

[dir] .header-row button {
    background-color: var(--nord6) !important;
    color: var(--nord1) !important;
    border-radius: 5px !important;
    
}

[dir] .toolbar {
    background: var(--nord0) !important;
}
.editor .toolbar-button {
color: var(--nord4)
}

.primary-editor p {

    color: var(--nord6);

}

[dir] .splitToolbarButton .button, [dir] .tool-group button, [dir] .annotation-tools button, .toolbar button {
    box-shadow: none !important;
    background: none !important;
    cursor: pointer !important;
}


[dir] .splitToolbarButton .button, [dir] .tool-group button, [dir] .annotation-tools button, .toolbar button {
    background: none;
}

[dir] .toolbar #pageNumber {
 padding:0 4px;
 background:linear-gradient(to bottom, var(--nord2), var(--nord1)) !important;
 box-shadow: none !important;
 color: var(--nord5) !important;

 border-radius:3px;
}
.toolbar #numPages {
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

#main-window[theme='dark'] .zotero-editpane-tabs tab label:not(.zotero-clicky) {
  color: var(--nord4);
}

#main-window[theme='dark'] .zotero-editpane-tabs tab[selected='true'] {
  filter: var(--nord-filter) !important;
}


#main-window[theme='dark'] toolbarbutton {
  background: none;
}

#main-window[theme='dark'] toolbarbutton dropmarker {
  filter: var(--nord-filter);
}

#main-window[theme='dark'] .toolbarbutton span {
  background: none !important;
}

${editor}
                `
