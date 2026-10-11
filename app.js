const KEY = 'todos';
const list = document.getElementById('list');
const form = document.getElementById('add');
const input = document.getElementById('text');
const count = document.getElementById('count');
const clear = document.getElementById('clear');

let todos = JSON.parse(localStorage.getItem(KEY) || '[]');

function save() {
  localStorage.setItem(KEY, JSON.stringify(todos));
  render();
}

function render() {
  list.replaceChildren(...todos.map(t => {
    const li = document.createElement('li');
    li.className = t.done ? 'done' : '';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = t.done;
    cb.onchange = () => { t.done = cb.checked; save(); };
    const span = document.createElement('span');
    span.textContent = t.text;
    const del = document.createElement('button');
    del.textContent = '✕';
    del.setAttribute('aria-label', 'Delete');
    del.onclick = () => { todos = todos.filter(x => x !== t); save(); };
    li.append(cb, span, del);
    return li;
  }));
  const left = todos.filter(t => !t.done).length;
  count.textContent = `${left} left`;
}

form.onsubmit = e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, done: false });
  input.value = '';
  save();
};

clear.onclick = () => { todos = todos.filter(t => !t.done); save(); };

render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
