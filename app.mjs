import { STORAGE_KEY, freshState, loadState, filterSubjects, createQuiz } from './model.mjs';

const $ = selector => document.querySelector(selector);
const icons = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  cards: '<rect x="7" y="6" width="13" height="15" rx="2"/><path d="M16 3H5a2 2 0 0 0-2 2v12M11 11h5m-5 4h5"/>',
  check: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m7 12 3 3 7-7"/>',
  bookmark: '<path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4z"/>',
  sprout: '<path d="M12 21V11M12 15C5 16 3 11 3 7c5 0 9 2 9 8ZM12 11c0-6 4-8 9-8 0 6-3 9-9 8Z"/>',
  spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  left: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  math: '<path d="m5 14 4 5L15 5h6M5 5h5M7.5 2.5v5M16 16h5m-5 4h5"/>',
  atom: '<ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4"/><circle cx="12" cy="12" r="1"/>',
  language: '<path d="M3 5h11M8 3v2m-3 3c1 4 4 7 8 9M12 5c0 6-4 11-9 13m11 3 4-11 4 11m-6.5-4h5"/>',
  history: '<path d="m3 9 9-6 9 6H3Zm2 3v6m5-6v6m4-6v6m5-6v6M3 21h18M2 9h20"/>',
  book: '<path d="M12 5v16m0-16C8 2 4 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-2-1-6-2-10 1Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v5l3 2M9 2h6m-3 0v3m6 2 2-2"/>',
  play: '<path d="m8 4 12 8-12 8z"/>',
  pause: '<path d="M8 4v16M16 4v16"/>',
  reset: '<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7"/>',
  bulb: '<path d="M9 18v-2a6 6 0 1 1 6 0v2m-6 0h6m-6 3h6m-3-10v7M3 5 1 3m20 2 2-2"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.book}</svg>`;
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// MathML avoids missing combining-arrow glyphs in the interface fonts.
const studyText = value => escape(value).replace(/([A-Za-z])⃗/g,
  '<math aria-label="vectơ $1"><mover accent="true"><mi>$1</mi><mo stretchy="false">→</mo></mover></math>');
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });

let state;
let storageWritable = true;
try { state = loadState(localStorage.getItem(STORAGE_KEY)); }
catch {
  state = freshState();
  storageWritable = false;
  const warning = document.createElement('p');
  warning.className = 'error-note';
  warning.setAttribute('role', 'alert');
  warning.textContent = 'Không đọc được dữ liệu đã lưu. Dữ liệu cũ được giữ nguyên; thay đổi mới chỉ có trong phiên này. Hãy kiểm tra quyền lưu trữ của trình duyệt.';
  $('#main').prepend(warning);
}
let view = 'library';
let category = 'all';
let study = null;
let toastTimeout;
function toast(message) {
  clearTimeout(toastTimeout);
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 4200);
}
function persist(message) {
  try {
    if (!storageWritable) throw new Error('Storage unavailable');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (message) toast(message);
    return true;
  } catch {
    toast('Chưa lưu được trên thiết bị. Hãy giữ trang mở và kiểm tra dung lượng / quyền lưu trữ.');
    return false;
  }
}
const viewNames = { library: 'Thư viện môn học', flashcards: 'Thẻ ghi nhớ', quiz: 'Luyện trắc nghiệm', saved: 'Môn học đã lưu' };
const viewTitles = { library: 'Một góc nhỏ, nhiều điều hay', flashcards: 'Lật một thẻ, nhớ thêm một điều', quiz: 'Thử sức một chút, hiểu mình hơn', saved: 'Những điều bạn muốn quay lại' };
const viewDescriptions = {
  library: 'Gom kiến thức vào đây. Cùng biến việc ôn tập thành một thói quen dễ chịu.',
  flashcards: 'Chọn một môn học, tự trả lời rồi lật thẻ để kiểm tra trí nhớ của bạn.',
  quiz: 'Chọn môn học để làm một bài trắc nghiệm ngắn, kèm giải thích cho từng câu.',
  saved: 'Những môn học đã đánh dấu, luôn sẵn sàng cho lần ôn tập tiếp theo.'
};
function renderSubjects() {
  const subjects = filterSubjects(state.subjects, $('#search').value, category, view === 'saved', state.saved);
  $('#subject-count').textContent = subjects.length;
  $('#subject-grid').innerHTML = subjects.length ? subjects.map(subject => {
    const known = subject.cards.filter(c => state.mastered.includes(c.id)).length;
    const saved = state.saved.includes(subject.id);
    return `<article class="subject-card"><div class="card-cover ${subject.color}"><span class="subject-icon">${icon(subject.icon)}</span><span class="cover-doodle" aria-hidden="true">${{ math: 'x²', atom: 'E = mc²', language: 'Aa', history: '⌛', book: '✧' }[subject.icon]}</span><button class="bookmark-button" data-save="${escape(subject.id)}" aria-label="${saved ? 'Bỏ lưu' : 'Lưu'} ${escape(subject.name)}" aria-pressed="${saved}">${icon('bookmark')}</button></div><div class="card-body"><p class="card-topic">${escape(subject.topic)}</p><h3>${escape(subject.name)}</h3><p class="card-description">${escape(subject.description)}</p><div class="card-meta"><span>${icon('cards')} ${subject.cards.length} thẻ ghi nhớ</span><span>${icon('check')} ${known} đã nhớ</span></div><button class="card-action" data-study="${escape(subject.id)}">${view === 'quiz' ? 'Luyện trắc nghiệm' : view === 'flashcards' ? 'Mở bộ thẻ' : 'Vào học thôi'} ${icon('arrow')}</button></div></article>`;
  }).join('') : `<div class="empty-state"><span>✳</span><h3>${view === 'saved' && !state.saved.length ? 'Giữ lại điều bạn muốn học' : 'Chưa tìm thấy môn học'}</h3><p>${view === 'saved' && !state.saved.length ? 'Bấm biểu tượng đánh dấu trên một môn học để lưu vào đây.' : 'Thử một từ khóa khác hoặc chọn nhóm “Tất cả”.'}</p></div>`;
}
function setView(next) {
  view = next;
  category = 'all';
  $('#search').value = '';
  $('#breadcrumb').textContent = viewNames[view];
  $('#page-title').innerHTML = `${viewTitles[view]}<span>.</span>`;
  $('#page-description').textContent = viewDescriptions[view];
  $('#library-title').firstChild.textContent = `${view === 'library' ? 'Thư viện của bạn' : viewNames[view]} `;
  document.querySelectorAll('[data-view]').forEach(button => {
    button.classList.toggle('active', button.dataset.view === view);
    if (button.dataset.view === view) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  renderFilters();
  renderSubjects();
}
function renderFilters() {
  document.querySelectorAll('[data-category]').forEach(button => {
    button.classList.toggle('active', button.dataset.category === category);
    button.setAttribute('aria-pressed', button.dataset.category === category);
  });
}
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
  category = button.dataset.category;
  renderFilters();
  renderSubjects();
}));
$('#search').addEventListener('input', renderSubjects);
$('#subject-grid').addEventListener('click', event => {
  const save = event.target.closest('[data-save]');
  if (save) {
    const id = save.dataset.save;
    state.saved = state.saved.includes(id) ? state.saved.filter(value => value !== id) : [...state.saved, id];
    persist(state.saved.includes(id) ? 'Đã lưu môn học vào góc riêng của bạn.' : 'Đã bỏ lưu môn học.');
    renderSubjects();
    // Restore keyboard focus after replacing the card list.
    const replacement = [...document.querySelectorAll('[data-save]')].find(button => button.dataset.save === id);
    (replacement || $('#search')).focus();
  }
  const button = event.target.closest('[data-study]');
  if (button) openStudy(button.dataset.study, view === 'quiz' ? 'quiz-intro' : 'flash');
});
$('#today').textContent = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
$('#add-subject').addEventListener('click', () => $('#subject-dialog').showModal());
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
$('#subject-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = data.get('name').trim();
  if (!name) { form.elements.name.setCustomValidity('Hãy nhập tên môn học.'); form.elements.name.reportValidity(); return; }
  if (state.subjects.length >= 100) { toast('Bạn đã có 100 môn học — giới hạn của phiên bản này.'); return; }
  const group = data.get('category');
  const subject = { id: crypto.randomUUID(), name, category: group, description: data.get('description').trim() || 'Một hành trình khám phá mới, bắt đầu từ hôm nay.', topic: 'Bộ thẻ của riêng bạn', color: { science: 'peach', language: 'blue', humanities: 'green', other: 'lavender' }[group], icon: 'book', cards: [] };
  state.subjects.push(subject);
  persist('Đã tạo môn học. Thêm tấm thẻ đầu tiên nhé!');
  form.reset();
  $('#subject-dialog').close();
  setView('library');
  openStudy(subject.id, 'add-card');
});
$('#subject-form').elements.name.addEventListener('input', event => event.target.setCustomValidity(''));
$('#start-learning').addEventListener('click', () => {
  const visible = filterSubjects(state.subjects, $('#search').value, category, view === 'saved', state.saved);
  const subject = visible.find(s => s.cards.some(c => !state.mastered.includes(c.id))) || visible[0];
  if (!subject) { toast('Hãy thêm hoặc chọn một môn học trước nhé.'); return; }
  openStudy(subject.id, view === 'quiz' ? 'quiz-intro' : 'flash');
});

function openStudy(id, mode) {
  const subject = state.subjects.find(s => s.id === id);
  if (!subject) return;
  study = { id, mode, index: Math.max(0, subject.cards.findIndex(c => !state.mastered.includes(c.id))), flipped: false, quiz: [], question: 0, selected: null, score: 0 };
  renderStudy();
  $('#study-dialog').showModal();
}
function currentSubject() { return state.subjects.find(s => s.id === study.id); }
function studyHeader(subject) {
  return `<div class="dialog-header"><div><p class="eyebrow">GÓC ÔN TẬP CỦA BẠN</p><h2 id="study-title">${escape(subject.name)}</h2></div><button class="icon-button" data-action="close" aria-label="Đóng cửa sổ ôn tập">✕</button></div><div class="study-tabs" role="group" aria-label="Chọn cách ôn tập"><button data-mode="flash" class="${study.mode === 'flash' ? 'active' : ''}" aria-pressed="${study.mode === 'flash'}">Thẻ ghi nhớ</button><button data-mode="quiz-intro" class="${study.mode.startsWith('quiz') || study.mode === 'result' ? 'active' : ''}" aria-pressed="${study.mode.startsWith('quiz') || study.mode === 'result'}">Trắc nghiệm</button><button data-mode="notes" class="${study.mode === 'notes' ? 'active' : ''}" aria-pressed="${study.mode === 'notes'}">Ghi chú</button></div>`;
}
function renderStudy() {
  const subject = currentSubject();
  let body = '';
  if (study.mode === 'flash') {
    const card = subject.cards[study.index];
    if (!card) body = '<div class="empty-state"><span>✳</span><h3>Mỗi hành trình bắt đầu bằng một thẻ</h3><p>Thêm câu hỏi và câu trả lời để bắt đầu ôn tập.</p><button class="button primary" data-mode="add-card">Thêm thẻ đầu tiên</button></div>';
    else {
      const mastered = state.mastered.includes(card.id);
      body = `<div class="study-meta"><span>Thẻ ${study.index + 1} / ${subject.cards.length}</span><span>${mastered ? '✓ Đã ghi nhớ' : 'Cứ từ từ, bạn làm được mà'}</span></div><button class="flashcard ${study.flipped ? 'flipped' : ''}" data-action="flip" aria-label="${study.flipped ? 'Xem câu hỏi' : 'Lật thẻ xem đáp án'}"><small>${study.flipped ? 'CÂU TRẢ LỜI' : 'THỬ NHỚ LẠI NÀO'}</small><strong>${studyText(study.flipped ? card.answer : card.question)}</strong>${study.flipped && card.explanation ? `<span class="explanation">${studyText(card.explanation)}</span>` : ''}<span class="flip-hint">${icon('reset')} Bấm để ${study.flipped ? 'xem câu hỏi' : 'lật thẻ'}</span></button><div class="study-controls"><button class="icon-button" data-action="previous" aria-label="Thẻ trước" ${study.index === 0 ? 'disabled' : ''}>${icon('left')}</button><button class="button ${mastered ? 'secondary' : 'primary'}" data-action="master" aria-pressed="${mastered}">${icon('check')} ${mastered ? 'Đã nhớ · Ôn lại sau' : 'Mình đã nhớ thẻ này'}</button><button class="icon-button" data-action="next" aria-label="Thẻ tiếp theo" ${study.index === subject.cards.length - 1 ? 'disabled' : ''}>${icon('arrow')}</button></div><div class="secondary-actions"><button class="text-button" data-mode="add-card">${icon('plus')} Thêm thẻ mới</button><button class="text-button" data-mode="quiz-intro">${icon('check')} Thử sức trắc nghiệm</button></div>`;
    }
  } else if (study.mode === 'quiz-intro') {
    const canStart = new Set(subject.cards.map(c => c.answer)).size >= 4;
    const last = state.results.filter(r => r.subjectId === subject.id).at(-1);
    body = `<div class="result"><div class="result-flower">✧</div><h3>Mình nhớ được bao nhiêu?</h3><p>${Math.min(subject.cards.length, 10)} câu hỏi ngẫu nhiên. Không áp lực thời gian.<br>Xem đáp án và giải thích sau mỗi câu.</p>${last ? `<p class="note-hint">Lần gần nhất: ${last.score}/${last.total} câu đúng · ${new Date(last.at).toLocaleDateString('vi-VN')}</p>` : ''}${canStart ? '<button class="button primary" data-action="start-quiz">Bắt đầu làm bài →</button>' : '<p class="error-note">Cần ít nhất 4 thẻ với các câu trả lời khác nhau để tạo bài trắc nghiệm.</p><button class="button secondary" data-mode="add-card">Thêm thẻ ghi nhớ</button>'}</div>`;
  } else if (study.mode === 'quiz') {
    const question = study.quiz[study.question];
    const answered = study.selected !== null;
    const correct = study.selected === question.answer;
    body = `<div class="study-meta"><span>Câu ${study.question + 1} / ${study.quiz.length}</span><span>${study.score} câu đúng</span></div><h3 class="quiz-question">${studyText(question.question)}</h3><div class="quiz-options">${question.options.map((option, index) => `<button class="quiz-option ${answered && option === question.answer ? 'correct' : answered && option === study.selected ? 'wrong' : ''}" data-answer="${index}" ${answered ? 'disabled' : ''}><span>${'ABCD'[index]}</span><div>${studyText(option)}</div>${answered && option === question.answer ? '<span aria-label="Đáp án đúng">✓</span>' : answered && option === study.selected ? '<span aria-label="Đáp án sai">✕</span>' : ''}</button>`).join('')}</div>${answered ? `<div class="quiz-feedback" role="status"><strong>${correct ? 'Chính xác! Thêm một điều bạn đã nhớ.' : `Chưa đúng rồi. Đáp án là: ${studyText(question.answer)}`}</strong>${studyText(question.explanation || 'Hãy ghi nhớ đáp án này cho lần ôn tập tiếp theo nhé.')}</div><div class="study-controls"><span></span><button class="button primary" data-action="next-question">${study.question === study.quiz.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'} ${icon('arrow')}</button></div>` : ''}`;
  } else if (study.mode === 'result') {
    body = `<div class="result"><div class="result-flower">✳</div><h3>${study.score === study.quiz.length ? 'Bạn nhớ thật tốt!' : 'Mỗi lần thử, một lần tiến bộ.'}</h3><p>Đã hoàn thành bài ôn tập ${escape(subject.name)}.</p><div class="result-score">${study.score} / ${study.quiz.length}</div><p>câu trả lời chính xác</p><button class="button primary" data-action="start-quiz">${icon('reset')} Làm lại bài</button><button class="button secondary" data-mode="flash">Ôn lại thẻ</button></div>`;
  } else if (study.mode === 'notes') {
    body = `<p class="study-intro">Viết lại bằng lời của mình, để kiến thức thực sự là của bạn.</p><label class="form-label">Ghi chú cho ${escape(subject.name)}<textarea id="subject-notes" rows="10" maxlength="20000" placeholder="Một công thức, một điều vừa hiểu ra…">${escape(state.notes[subject.id] || '')}</textarea></label><p class="note-hint" id="note-status" role="status">Ghi chú được lưu tự động trên trình duyệt này.</p>`;
  } else if (study.mode === 'add-card') {
    body = `<form id="card-form"><label>Câu hỏi<textarea name="question" required maxlength="500" placeholder="Bạn muốn ghi nhớ điều gì?" rows="3"></textarea></label><label>Câu trả lời<input name="answer" required maxlength="500" placeholder="Một câu trả lời ngắn gọn"></label><label>Giải thích thêm (không bắt buộc)<textarea name="explanation" maxlength="1000" rows="3" placeholder="Thêm ví dụ hoặc mẹo để dễ nhớ hơn"></textarea></label><button type="submit" class="button primary full-width">${icon('plus')} Lưu thẻ ghi nhớ</button></form>`;
  }
  $('#study-content').innerHTML = studyHeader(subject) + body;
}
$('#study-content').addEventListener('click', event => {
  const modeButton = event.target.closest('[data-mode]');
  if (modeButton) {
    study.mode = modeButton.dataset.mode;
    study.flipped = false;
    renderStudy();
    const target = study.mode === 'add-card' ? $('#card-form textarea') : study.mode === 'notes' ? $('#subject-notes') : [...document.querySelectorAll('.study-tabs button')].find(button => button.dataset.mode === study.mode);
    target?.focus();
    return;
  }
  const answer = event.target.closest('[data-answer]');
  if (answer && study.mode === 'quiz' && study.selected === null) {
    const question = study.quiz[study.question];
    study.selected = question.options[Number(answer.dataset.answer)];
    if (study.selected === question.answer) study.score++;
    renderStudy();
    $('[data-action="next-question"]').focus();
    return;
  }
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'close') { $('#study-dialog').close(); return; }
  const subject = currentSubject();
  if (action === 'flip') study.flipped = !study.flipped;
  if (action === 'previous') { study.index = Math.max(0, study.index - 1); study.flipped = false; }
  if (action === 'next') { study.index = Math.min(subject.cards.length - 1, study.index + 1); study.flipped = false; }
  if (action === 'master') {
    const id = subject.cards[study.index].id;
    state.mastered = state.mastered.includes(id) ? state.mastered.filter(value => value !== id) : [...state.mastered, id];
    persist(state.mastered.includes(id) ? 'Đã ghi nhớ. Bạn đang tiến bộ từng chút một! 🌱' : 'Thẻ đã được đưa về danh sách cần ôn.');
    renderSubjects();
  }
  if (action === 'start-quiz') {
    const quiz = createQuiz(subject.cards);
    if (!quiz.length) return;
    Object.assign(study, { mode: 'quiz', quiz, question: 0, score: 0, selected: null });
  }
  if (action === 'next-question' && study.mode === 'quiz' && study.selected !== null) {
    if (study.question < study.quiz.length - 1) { study.question++; study.selected = null; }
    else {
      study.mode = 'result';
      state.results.push({ subjectId: subject.id, score: study.score, total: study.quiz.length, at: Date.now() });
      state.results = state.results.slice(-100);
      persist();
    }
  }
  renderStudy();
  const focusTarget = action === 'flip' ? $('[data-action="flip"]') : action === 'master' ? $('[data-action="master"]') : action === 'previous' || action === 'next' ? $('[data-action="flip"]') : $('.quiz-option') || $('[data-action="start-quiz"]');
  focusTarget?.focus();
});
$('#study-content').addEventListener('input', event => {
  if (event.target.id === 'subject-notes') {
    Object.defineProperty(state.notes, study.id, { value: event.target.value, enumerable: true, configurable: true, writable: true });
    $('#note-status').textContent = persist() ? '✓ Đã lưu ghi chú trên thiết bị.' : 'Chưa lưu được. Hãy sao chép ghi chú trước khi đóng trang.';
  }
  if (event.target.closest('#card-form')) event.target.setCustomValidity('');
});
$('#study-content').addEventListener('submit', event => {
  if (event.target.id !== 'card-form') return;
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  for (const field of ['question', 'answer']) {
    if (!data.get(field).trim()) { form.elements[field].setCustomValidity('Hãy nhập nội dung cho trường này.'); form.elements[field].reportValidity(); return; }
  }
  const subject = currentSubject();
  if (subject.cards.length >= 1000) { toast('Mỗi môn hỗ trợ tối đa 1.000 thẻ. Hãy tạo một môn học mới.'); return; }
  subject.cards.push({ id: crypto.randomUUID(), question: data.get('question').trim(), answer: data.get('answer').trim(), explanation: data.get('explanation').trim() });
  persist('Đã thêm một tấm thẻ mới vào hành trình của bạn.');
  study.index = subject.cards.length - 1;
  study.flipped = false;
  study.mode = 'flash';
  renderSubjects();
  renderStudy();
  $('[data-action="flip"]').focus();
});

const focusDuration = 25 * 60;
let remaining = focusDuration;
let timerEnd = null;
let timerInterval;
function renderTimer() {
  $('#timer').innerHTML = `${String(Math.floor(remaining / 60)).padStart(2, '0')}<span>:</span>${String(remaining % 60).padStart(2, '0')}`;
  $('#timer-toggle').innerHTML = `${icon(timerEnd ? 'pause' : 'play')}${timerEnd ? 'Tạm dừng' : remaining === focusDuration ? 'Bắt đầu tập trung' : remaining === 0 ? 'Thêm một phiên' : 'Tiếp tục'}`;
}
function tick() {
  remaining = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
  if (remaining === 0) {
    clearInterval(timerInterval);
    timerEnd = null;
    toast('Bạn đã tập trung trọn 25 phút. Nghỉ ngơi một chút nhé! 🌿');
  }
  renderTimer();
}
$('#timer-toggle').addEventListener('click', () => {
  if (timerEnd) {
    remaining = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
    timerEnd = null;
    clearInterval(timerInterval);
  } else {
    if (remaining === 0) remaining = focusDuration;
    timerEnd = Date.now() + remaining * 1000;
    timerInterval = setInterval(tick, 250);
  }
  renderTimer();
});
$('#timer-reset').addEventListener('click', () => {
  clearInterval(timerInterval);
  timerEnd = null;
  remaining = focusDuration;
  renderTimer();
});
document.addEventListener('visibilitychange', () => { if (!document.hidden && timerEnd) tick(); });
setView('library');
