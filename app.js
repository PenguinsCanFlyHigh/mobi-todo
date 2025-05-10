// app.js
const form       = document.getElementById('todo-form');
const input      = document.getElementById('todo-input');
const typeSelect = document.getElementById('task-type');
const list       = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 로컬 저장
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 개별 아이템 생성
function renderItem(task) {
  const item = document.createElement('div');
  item.className = 'todo-item';
  if (task.completed) item.classList.add('completed');

  // 체크박스
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveTasks();
    renderTasks();
  });
  item.appendChild(checkbox);

  // 텍스트
  const text = document.createElement('span');
  text.className = 'text';
  text.textContent = task.text;
  item.appendChild(text);

  // 삭제 버튼
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

// 렌더링: 일간 → 주간 → 기타 순서
function renderTasks() {
  list.innerHTML = '';

  const order = [
    { type: 'daily',   label: '일간 할 일' },
    { type: 'weekly',  label: '주간 할 일' },
    { type: 'other',   label: '기타 할 일' }
  ];

  order.forEach(group => {
    const groupTasks = tasks.filter(t => t.type === group.type);
    const h2 = document.createElement('h2');
    h2.textContent = group.label;
    list.appendChild(h2);
    groupTasks.forEach(renderItem);
  });
}

// 폼 제출 핸들러
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    type: typeSelect.value,
    completed: false
  });
  saveTasks();
  renderTasks();
  input.value = '';
});

// 초기 렌더
renderTasks();
