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

// 렌더링: 일간 → 주간 순으로
function renderTasks() {
  list.innerHTML = '';

  // 일간 그룹
  const dailyTasks = tasks.filter(t => t.type === 'daily');
  const h2Daily = document.createElement('h2');
  h2Daily.textContent = '일간 할 일';
  list.appendChild(h2Daily);
  dailyTasks.forEach(task => renderItem(task));

  // 주간 그룹
  const weeklyTasks = tasks.filter(t => t.type === 'weekly');
  const h2Weekly = document.createElement('h2');
  h2Weekly.textContent = '주간 할 일';
  list.appendChild(h2Weekly);
  weeklyTasks.forEach(task => renderItem(task));
}

// 개별 아이템 생성 공통 함수
function renderItem(task) {
  const item = document.createElement('div');
  item.className = 'todo-item';
  if (task.completed) item.classList.add('completed');

  const text = document.createElement('span');
  text.className = 'text';
  text.textContent = task.text;
  text.addEventListener('click', () => {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  });
  item.appendChild(text);

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

// 폼 제출 핸들러
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    type: typeSelect.value, // 일간 또는 주간
    completed: false
  });
  saveTasks();
  renderTasks();
  input.value = '';
});

// 초기 표시
renderTasks();
