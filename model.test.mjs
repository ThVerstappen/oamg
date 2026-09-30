import test from 'node:test';
import assert from 'node:assert/strict';
import { freshState, loadState, createQuiz, filterSubjects, shuffle } from './model.mjs';

test('study data, search, randomized quizzes and saved progress stay consistent', () => {
  const state = freshState();
  assert.equal(state.subjects.length, 4);
  assert.equal(state.subjects.reduce((total, subject) => total + subject.cards.length, 0), 24);
  assert.equal(filterSubjects(state.subjects, 'vat ly', 'all')[0].id, 'physics');
  assert.equal(filterSubjects(state.subjects, 'đại số', 'science')[0].id, 'math');
  assert.equal(filterSubjects(state.subjects, '', 'science').length, 2);
  assert.deepEqual(filterSubjects(state.subjects, '', 'all', true, ['english']).map(s => s.id), ['english']);
  assert.equal(filterSubjects(state.subjects, 'not-a-subject', 'all').length, 0);
  for (const subject of state.subjects) {
    const original = structuredClone(subject.cards);
    const quiz = createQuiz(subject.cards, () => 0.42);
    assert.equal(quiz.length, subject.cards.length);
    for (const question of quiz) {
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.ok(question.options.includes(question.answer));
    }
    assert.deepEqual(subject.cards, original, 'Quiz creation must not change stored cards');
  }
  assert.deepEqual(createQuiz(state.subjects[0].cards.slice(0, 3)), []);
  assert.deepEqual(createQuiz(Array.from({ length: 4 }, () => ({ answer: 'same' }))), []);
  const largeDeck = Array.from({ length: 20 }, (_, i) => ({ id: String(i), question: `Q${i}`, answer: `A${i}` }));
  assert.equal(createQuiz(largeDeck).length, 10);
  const values = [1, 2, 3, 4];
  assert.deepEqual(shuffle(values, () => 0), [2, 3, 4, 1]);
  assert.deepEqual(values, [1, 2, 3, 4]);
  state.saved.push('math');
  state.mastered.push('math-0');
  state.notes.math = 'Ghi chú <script> chỉ là văn bản.';
  state.results.push({ subjectId: 'math', score: 3, total: 6, at: Date.now() });
  assert.deepEqual(loadState(JSON.stringify(state)), state);
  assert.equal(loadState(null).subjects.length, 4);
  assert.throws(() => loadState('{broken'));
  assert.throws(() => loadState('{"subjects":[]}'));
  assert.throws(() => loadState(JSON.stringify({ ...state, saved: [null] })));
  assert.throws(() => loadState(JSON.stringify({ ...state, results: [{ subjectId: 'math', score: 7, total: 6, at: 1 }] })));
  const duplicate = structuredClone(state);
  duplicate.subjects.push(duplicate.subjects[0]);
  assert.throws(() => loadState(JSON.stringify(duplicate)));
  const invalid = structuredClone(state);
  invalid.subjects[0].cards[0].answer = '   ';
  assert.throws(() => loadState(JSON.stringify(invalid)));
  assert.equal(freshState().mastered.length, 0, 'Independent sessions need independent state');
});
