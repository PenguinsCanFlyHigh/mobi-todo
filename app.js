// app.js
const form       = document.getElementById('todo-form');
const input      = document.getElementById('todo-input');
const typeSelect = document.getElementById('task-type');
const list       = document.getElementById('todo-list');

// ★ 1) 초기 불러오기 & 구조 마이그레이션
let raw = JSON.parse(localStorage.getItem('tasks')) || [];
let tasks = raw.map(t => {
  // 만약 기존 completed가 boolean 이면,
  if (!Array.isArray(t.completed)) {
    // 첫 칸에 기존 값을, 나머진 false로 세팅
    t.completed = [t.completed, false, false, false];
  }
  return t;
});

// 2) 캐릭터 이름 (원하는 명칭으로 변경 가능)
const characters = ['메인', '부캐1', '부캐2', '부캐3'];

// 저장함수
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 개별 아이템 렌더링
function renderItem(task) {
  const item = document.createElement('div');
  item.className = 'todo-item';
  item.dataset.id = task.id;
  // 체크박스 4개
  const checks = document.createElement('div');
  checks.className = 'checks';
  task.completed.forEach((done, i) => {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = done;
    cb.title = characters[i];
    cb.addEventListener('change', () => {
      task.completed[i] = cb.checked;
      saveTasks();
      // 텍스트 줄긋기 토글
      if (task.completed.every(v => v)) {
        item.classList.add('completed');
      } else {
        item.classList.remove('completed');
      }
    });
    checks.appendChild(cb);
  });
  item.appendChild(checks);

  // 텍스트
  const text = document.createElement('span');
  text.className = 'text';
  text.textContent = task.text;
  if (task.completed.every(v => v)) {
    item.classList.add('completed');
  }
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

// 전체 렌더
function renderTasks() {
  list.innerHTML = '';
  const groups = [
    { type: 'daily',  label: '일간 할 일' },
    { type: 'weekly', label: '주간 할 일' },
    { type: 'other',  label: '기타 할 일' }
  ];
  groups.forEach(g => {
    const h2 = document.createElement('h2');
    h2.textContent = g.label;
    list.appendChild(h2);
    tasks.filter(t => t.type === g.type)
         .forEach(renderItem);
  });

  // SortableJS 초기화 (한 번만 해도 무방합니다)
  Sortable.create(list, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    draggable: '.todo-item'
  });
}

// 폼 제출
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({
    id: Date.now(),
    text,
    type: typeSelect.value,
    completed: [false, false, false, false]
  });
  saveTasks();
  renderTasks();
  input.value = '';
});

// 첫 화면 렌더
renderTasks();
