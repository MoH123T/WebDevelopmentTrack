// Storage: 
// saves tasks in the browser's localStorage and exposes task data actions
var TodoStorage = (function () {
  var STORAGE_KEY = "todo_items";
  var tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // Writes the current in-memory task list to localStorage
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // Returns todays local date in the YYYY-MM-DD format used by date inputs
  function todayISO() {
    var d = new Date();
    var offset = d.getTimezoneOffset();
    var local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 10);
  }

  // Creates and saves one task, including its optional note
  function addTask(text, priority, due, note) {
    tasks.push({
      id: Date.now(),
      text: text,
      completed: false,
      priority: priority,
      due: due || null,
      createdAt: todayISO(),
      note: note || ""
    });
    save();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    save();
  }

  function toggleComplete(id, completed) {
    var task = getById(id);
    if (task) {
      task.completed = completed;
      save();
    }
  }

  function setNote(id, note) {
    var task = getById(id);
    if (task) {
      task.note = note;
      save();
    }
  }

  function getById(id) {
    return tasks.find(function (t) { return t.id === id; });
  }

  function getAll() {
    return tasks;
  }

  // Prevents duplicate task names regardless of capitalization or surrounding spaces
  function hasTaskNamed(text) {
    var normalized = text.trim().toLowerCase();
    return tasks.some(function (task) {
      return task.text.trim().toLowerCase() === normalized;
    });
  }

  function clearCompleted() {
    tasks = tasks.filter(function (t) { return !t.completed; });
    save();
  }

  function clearAll() {
    tasks = [];
    save();
  }

  return {
    addTask: addTask,
    deleteTask: deleteTask,
    toggleComplete: toggleComplete,
    setNote: setNote,
    getById: getById,
    getAll: getAll,
    hasTaskNamed: hasTaskNamed,
    clearCompleted: clearCompleted,
    clearAll: clearAll,
    todayISO: todayISO
  };
})();
