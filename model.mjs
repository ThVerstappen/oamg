export const STORAGE_KEY = 'nho-study-v1';

export const initialSubjects = [
  { id: 'math', name: 'Toán học', category: 'science', color: 'peach', icon: 'math', description: 'Từng công thức nhỏ, giải những bài toán lớn.', topic: 'Đại số & Hình học', cards: [
    ['Đạo hàm của hàm số f(x) = x² là gì?', 'f′(x) = 2x', 'Quy tắc lũy thừa: đạo hàm của xⁿ là n·xⁿ⁻¹.'],
    ['Diện tích hình tròn bán kính r được tính thế nào?', 'S = πr²', 'Diện tích bằng số pi nhân với bình phương bán kính.'],
    ['Trong tam giác vuông, cạnh huyền c liên hệ với hai cạnh góc vuông a, b thế nào?', 'c² = a² + b²', 'Đây là định lý Pythagore; c là cạnh đối diện góc vuông.'],
    ['Phương trình ax² + bx + c = 0 (a ≠ 0) có hai nghiệm thực phân biệt khi nào?', 'Δ = b² − 4ac > 0', 'Δ = 0 cho nghiệm kép; Δ < 0 thì không có nghiệm thực.'],
    ['Tổng n số nguyên dương đầu tiên bằng bao nhiêu?', 'n(n + 1) / 2', 'Ghép số đầu với số cuối, mỗi cặp có tổng n + 1.'],
    ['Xác suất xuất hiện mặt 6 khi gieo một xúc xắc cân đối là bao nhiêu?', '1/6', 'Có một kết quả thuận lợi trong sáu kết quả đồng khả năng.']
  ] },
  { id: 'physics', name: 'Vật lý', category: 'science', color: 'lavender', icon: 'atom', description: 'Hiểu những quy luật của thế giới quanh mình.', topic: 'Cơ học & Điện học', cards: [
    ['Định luật II Newton được viết dưới dạng nào?', 'F⃗ = m·a⃗', 'Hợp lực tác dụng bằng khối lượng nhân gia tốc.'],
    ['Định luật Ohm cho đoạn mạch thuần trở là gì?', 'I = U / R', 'Cường độ dòng điện bằng hiệu điện thế chia điện trở.'],
    ['Động năng của vật khối lượng m, vận tốc v bằng bao nhiêu?', 'Wđ = ½mv²', 'Động năng phụ thuộc vào bình phương tốc độ của vật.'],
    ['Đơn vị SI của công và năng lượng là gì?', 'Joule (J)', 'Một joule bằng công của lực 1 N khi vật dịch chuyển 1 m theo hướng lực.'],
    ['Vận tốc ánh sáng trong chân không xấp xỉ bao nhiêu?', '3 × 10⁸ m/s', 'Giá trị chính xác là 299.792.458 m/s.'],
    ['Khối lượng riêng được tính bằng công thức nào?', 'ρ = m / V', 'Khối lượng chia cho thể tích; đơn vị SI là kg/m³.']
  ] },
  { id: 'english', name: 'Tiếng Anh', category: 'language', color: 'blue', icon: 'language', description: 'Thêm một từ mới, mở thêm một thế giới.', topic: 'Từ vựng & Ngữ pháp', cards: [
    ['“Serendipity” có nghĩa là gì?', 'Sự tình cờ may mắn', 'Dùng khi tình cờ khám phá ra điều tốt đẹp, thú vị.'],
    ['Dạng quá khứ đơn của động từ “go” là gì?', 'Went', 'Go → went → gone là một động từ bất quy tắc.'],
    ['Điền vào chỗ trống: She ___ here since 2020.', 'has lived', 'Since + mốc thời gian thường đi với hiện tại hoàn thành trong ngữ cảnh này.'],
    ['“Although” được dùng để diễn đạt điều gì?', 'Sự tương phản / nhượng bộ', 'Although it rained, we went out: Mặc dù trời mưa, chúng tôi vẫn ra ngoài.'],
    ['Dạng so sánh hơn của tính từ “good” là gì?', 'Better', 'Good → better → best là các dạng so sánh bất quy tắc.'],
    ['“Sustainable” có nghĩa là gì?', 'Bền vững', 'Ví dụ: sustainable development nghĩa là phát triển bền vững.']
  ] },
  { id: 'history', name: 'Lịch sử', category: 'humanities', color: 'green', icon: 'history', description: 'Kết nối những dấu mốc, hiểu chuyện ngày xưa.', topic: 'Lịch sử Việt Nam', cards: [
    ['Chiến thắng Bạch Đằng do Ngô Quyền lãnh đạo diễn ra năm nào?', 'Năm 938', 'Chiến thắng đánh bại quân Nam Hán, mở ra thời kỳ độc lập lâu dài.'],
    ['Ai quyết định dời đô từ Hoa Lư ra Đại La năm 1010?', 'Lý Công Uẩn (Lý Thái Tổ)', 'Sau khi dời đô, Đại La được đổi tên thành Thăng Long.'],
    ['Bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa được đọc khi nào?', 'Ngày 2/9/1945', 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn tại Quảng trường Ba Đình.'],
    ['Chiến dịch Điện Biên Phủ kết thúc thắng lợi vào ngày nào?', 'Ngày 7/5/1954', 'Chiến dịch kéo dài 56 ngày đêm, từ 13/3 đến 7/5/1954.'],
    ['Triều đại nào ba lần đánh thắng quân Mông – Nguyên?', 'Nhà Trần', 'Ba cuộc kháng chiến diễn ra vào các năm 1258, 1285 và 1287–1288.'],
    ['Người lãnh đạo cuộc khởi nghĩa Lam Sơn là ai?', 'Lê Lợi', 'Khởi nghĩa Lam Sơn diễn ra từ 1418 đến 1427; Lê Lợi sau đó lập nhà Hậu Lê.']
  ] }
].map(subject => ({ ...subject, cards: subject.cards.map(([question, answer, explanation], i) => ({ id: `${subject.id}-${i}`, question, answer, explanation })) }));

export function freshState() {
  return { subjects: structuredClone(initialSubjects), saved: [], mastered: [], results: [], notes: {} };
}

export function loadState(raw) {
  if (!raw) return freshState();
  const value = JSON.parse(raw);
  const text = (v, max) => typeof v === 'string' && v.length <= max;
  const validSubject = s => s && text(s.id, 100) && text(s.name, 80) && text(s.description, 200)
    && ['science', 'language', 'humanities', 'other'].includes(s.category)
    && ['peach', 'lavender', 'blue', 'green'].includes(s.color)
    && ['math', 'atom', 'language', 'history', 'book'].includes(s.icon)
    && text(s.topic, 100) && Array.isArray(s.cards) && s.cards.length <= 1000
    && s.cards.every(c => c && text(c.id, 100) && text(c.question, 500) && c.question.trim()
      && text(c.answer, 500) && c.answer.trim() && text(c.explanation, 1000));
  if (!value || !Array.isArray(value.subjects) || value.subjects.length > 100 || !value.subjects.every(validSubject)
    || !['saved', 'mastered'].every(key => Array.isArray(value[key]) && value[key].every(id => text(id, 100)))
    || !Array.isArray(value.results) || !value.results.every(r => r && text(r.subjectId, 100) && Number.isInteger(r.score) && Number.isInteger(r.total) && r.score >= 0 && r.score <= r.total && r.total > 0 && Number.isFinite(r.at))
    || !value.notes || Array.isArray(value.notes) || typeof value.notes !== 'object' || !Object.values(value.notes).every(n => text(n, 20000))) {
    throw new Error('Dữ liệu lưu không đúng định dạng.');
  }
  const ids = value.subjects.map(s => s.id);
  const cardIds = value.subjects.flatMap(s => s.cards.map(c => c.id));
  if (new Set(ids).size !== ids.length || new Set(cardIds).size !== cardIds.length) throw new Error('Dữ liệu có mã bị trùng.');
  return value;
}

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createQuiz(cards, random = Math.random) {
  if (new Set(cards.map(c => c.answer)).size < 4) return [];
  return shuffle(cards, random).slice(0, 10).map(card => ({
    ...card,
    options: shuffle([card.answer, ...shuffle([...new Set(cards.map(c => c.answer).filter(a => a !== card.answer))], random).slice(0, 3)], random)
  }));
}

export function filterSubjects(subjects, query, category, savedOnly = false, saved = []) {
  const normalize = value => value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const needle = normalize(query.trim());
  return subjects.filter(s => (category === 'all' || s.category === category)
    && (!savedOnly || saved.includes(s.id))
    && normalize(`${s.name} ${s.description} ${s.topic}`).includes(needle));
}
