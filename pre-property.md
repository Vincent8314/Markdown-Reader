```css
pre {
  overflow-x: auto;              /* shows a horizontal scrollbar only when the content is wider than the element */
  scrollbar-width: thin;         /* makes the scrollbar thinner than the default; "none" removes it entirely */
  scrollbar-color: #888 #eee;    /* sets the thumb to #888 and the track to #eee */
  scrollbar-gutter: stable;      /* keeps the space for the scrollbar even when it's hidden, so the layout doesn't shift */
}

pre::-webkit-scrollbar {
  width: 12px;                   /* makes the vertical scrollbar 12px wide */
  height: 12px;                  /* makes the horizontal scrollbar 12px tall */
  background: #eee;              /* paints the entire scrollbar area #eee */
}

pre::-webkit-scrollbar-track {
  background: #f5f5f5;           /* paints the rail #f5f5f5 */
  border-radius: 6px;            /* rounds the ends of the rail */
}

pre::-webkit-scrollbar-track-piece {
  background: #ddd;              /* paints the parts of the rail that the thumb isn't sitting on #ddd */
}

pre::-webkit-scrollbar-thumb {
  background: #888;              /* paints the handle #888 */
  border-radius: 6px;            /* rounds the ends of the handle */
  border: 2px solid #eee;        /* puts a 2px #eee border around the handle, making it look inset */
  min-height: 30px;              /* forces the handle to be at least 30px long so it's easy to grab */
  cursor: grab;                  /* changes the mouse pointer to a grab hand when hovering the handle */
}

pre::-webkit-scrollbar-thumb:hover {
  background: #666;              /* darkens the handle to #666 when the mouse is over it */
}

pre::-webkit-scrollbar-thumb:active {
  background: #444;              /* darkens the handle to #444 while you're dragging it */
}

pre::-webkit-scrollbar-button {
  display: none;                 /* removes the arrow buttons from both ends of the scrollbar */
  width: 12px;                   /* makes each arrow button 12px wide (only applies if display is block) */
  height: 12px;                  /* makes each arrow button 12px tall (only applies if display is block) */
  background: #ccc;              /* paints each arrow button #ccc (only applies if display is block) */
}

pre::-webkit-scrollbar-corner {
  background: #f0f0f0;           /* paints the little square where the horizontal and vertical scrollbars meet #f0f0f0 */
}

pre::-webkit-resizer {
  background: #ccc;              /* paints the resize grip in the bottom-right corner #ccc */
  cursor: nwse-resize;           /* changes the mouse pointer to a diagonal resize arrow over the grip */
}   
```