// app.js
const form       = document.getElementById('todo-form');
const input      = document.getElementById('todo-input');
const typeSelect = document.getElementById('task-type');
const list       = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 4개 캐릭터 이름 (원하는 대로 바꿔 쓰세요)
const characters = ['메인', '부캐1', '부캐2', '부캐3'];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderItem(task) {
  const item = document.createElement('div');
  item.className = 'todo-item';
  item.dataset.id = task.id;

  // 1) 체크박스 그룹
  const checks = document.createElement('div');
  checks.className = 'checks';
  task.completed.forEach((done, idx) => {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = done;
    cb.title = characters[idx];
    cb.addEventListener('change', () => {
      task.completed[idx] = cb.checked;
      saveTasks();
    });
    checks.appendChild(cb);
  });
  item.appendChild(checks);

  // 2) 텍스트
  const text = document.createElement('span');
  text.className = 'text';
  text.textContent = task.text;
  if (task.completed.every(v => v)) text.classList.add('completed');
  item.appendChild(text);

  // 3) 삭제
  const delBtn = document.createElement('button');
  delBtn.className = 'delete';
  delBtn.textContent = '삭제';
  delBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    renderTasks();
  });
  item.appendChild(delBtn);

  list.appendChild(item);
}

function renderTasks() {
  list.innerHTML = '';
  const groups = [
    { type: 'daily',  label: '일간 할 일' },
    { type: 'weekly', label: '주간 할 일' },
    { type: 'other',  label: '기타 할 일' }
  ];

  groups.forEach(g => {
    const header = document.createElement('h2');
    header.textContent = g.label;
    list.appendChild(header);

    tasks.filter(t => t.type === g.type)
         .forEach(renderItem);
  });

  // 드래그 초기화 (SortableJS)
  Sortable.create(list, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    draggable: '.todo-item'
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    type: typeSelect.value,
    completed: [false, false, false, false] // 4개 캐릭터용
  });
  saveTasks();
  renderTasks();
  input.value = '';
});

renderTasks();
