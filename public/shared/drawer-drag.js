// Drag-to-close for the phone slide-out menu.
// While the menu is open, a sideways drag anywhere moves the panel with
// the finger and fades the backdrop to match; it can be pushed back open
// mid-drag, and on release it settles the way it was flicked, or else to
// whichever state it is nearer. The app's CSS owns the open and closed
// positions and the transition between them — the panel must close by
// sliding (a translateX), not by shrinking — and this only overrides them
// inline while the finger is down.
//
// Close-only on purpose: dragging right from the left edge belongs to the
// dashboard's tool rail, and a menu opening on the same gesture would fight it.
//
//   attachDrawerDrag({ panel, backdrop, isActive, close }) → detach()
//     panel, backdrop: selectors, looked up when a drag starts
//     isActive():      is the menu open on a phone right now
//     close():         put the app into its closed state (class or React state)
function attachDrawerDrag({ panel, backdrop, isActive, close }) {
  const SLOP = 10;          // travel before a touch is judged a drag or a scroll
  const FLICK = 0.3;        // px/ms; a faster release goes the way it was flung
  const VELOCITY_MS = 100;  // release speed is measured over this last stretch
  let state = 'idle';       // 'pending' until the touch picks a direction, then 'drag'
  let touchId, startX = 0, startY = 0, base = 0, width = 0, offset = 0;
  let panelEl, backdropEl, samples = [], draggedAt = 0;

  const ours = (list) => Array.from(list).find((t) => t.identifier === touchId);

  function onStart(e) {
    if (state === 'drag') return;   // a second finger mid-drag changes nothing
    draggedAt = 0;
    state = 'idle';
    if (!isActive() || e.touches.length !== 1) return;
    const t = e.touches[0];
    touchId = t.identifier;
    startX = t.clientX;
    startY = t.clientY;
    state = 'pending';
  }

  function onMove(e) {
    if (state === 'idle') return;
    const t = ours(e.touches);
    if (!t) return;
    if (state === 'pending') {
      const dx = t.clientX - startX, dy = t.clientY - startY;
      if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return;
      if (Math.abs(dy) >= Math.abs(dx)) { state = 'idle'; return; }   // a scroll
      panelEl = document.querySelector(panel);
      backdropEl = backdrop && document.querySelector(backdrop);
      if (!panelEl) { state = 'idle'; return; }
      // Grab the panel where it is now, even partway through opening.
      const rect = panelEl.getBoundingClientRect();
      state = 'drag';
      base = Math.min(0, rect.left);
      width = rect.width;
      startX = t.clientX;
      samples = [];
      panelEl.style.transition = 'none';
      if (backdropEl) backdropEl.style.transition = 'none';
    }
    e.preventDefault();   // keep the menu from scrolling under a sideways drag
    offset = Math.min(0, Math.max(-width, base + t.clientX - startX));
    panelEl.style.transform = `translateX(${offset}px)`;
    if (backdropEl) backdropEl.style.opacity = 1 + offset / width;
    const now = performance.now();
    samples.push([now, t.clientX]);
    while (samples.length > 2 && now - samples[0][0] > VELOCITY_MS) samples.shift();
  }

  function onEnd(e) {
    if (state === 'idle' || !ours(e.changedTouches)) return;
    const wasDrag = state === 'drag';
    state = 'idle';
    if (!wasDrag) return;
    draggedAt = performance.now();
    // Speed over the last moments only: a finger that stopped before lifting
    // should settle by position, not by an earlier flick.
    const now = performance.now();
    const recent = samples.filter(([time]) => now - time <= VELOCITY_MS);
    let v = 0;
    if (recent.length > 1) {
      const [t0, x0] = recent[0], [t1, x1] = recent[recent.length - 1];
      if (t1 > t0) v = (x1 - x0) / (t1 - t0);
    }
    const shut = Math.abs(v) > FLICK ? v < 0 : -offset > width / 2;
    // Hand the position back to the CSS in the same frame as the state
    // change, so its transition animates on from where the finger left it.
    for (const el of [panelEl, backdropEl]) {
      if (!el) continue;
      el.style.transition = '';
      el.style.transform = '';
      el.style.opacity = '';
    }
    if (shut) close();
  }

  // A drag that began on a menu item would otherwise fire that item's click
  // on release and open what you were only dragging past. Only the click that
  // straight follows the drag is swallowed, not some later unrelated one.
  function onClick(e) {
    if (!draggedAt || performance.now() - draggedAt > 400) return;
    draggedAt = 0;
    e.preventDefault();
    e.stopPropagation();
  }

  document.addEventListener('touchstart', onStart, { passive: true });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd, { passive: true });
  document.addEventListener('touchcancel', onEnd, { passive: true });
  document.addEventListener('click', onClick, true);
  return () => {
    document.removeEventListener('touchstart', onStart);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
    document.removeEventListener('touchcancel', onEnd);
    document.removeEventListener('click', onClick, true);
  };
}
