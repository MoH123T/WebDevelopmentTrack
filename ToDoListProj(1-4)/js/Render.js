// Rendering:
//  turns stored tasks into the visible list, badges, and statistics
var TodoRender = (function () {

  function isOverdue(task) {
    if (!task.due || task.completed) return false;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.due) < today;
  }

  function priorityWeight(p) {
    var weights = { hard: 0, medium: 1, easy: 2 };
    return weights[p] !== undefined ? weights[p] : 1;
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  // Applies the selected filter, search term, and sort order without changing stored tasks
  function getVisibleTasks(tasks, filter, searchTerm, sortBy) {
    var list = tasks.slice();

    if (filter === "active") {
      list = list.filter(function (t) { return !t.completed; });
    } else if (filter === "completed") {
      list = list.filter(function (t) { return t.completed; });
    }

    if (searchTerm.trim() !== "") {
      var term = searchTerm.toLowerCase();
      list = list.filter(function (t) {
        return t.text.toLowerCase().indexOf(term) !== -1 ||
          (t.note && t.note.toLowerCase().indexOf(term) !== -1);
      });
    }

    if (sortBy === "priority") {
      list.sort(function (a, b) { return priorityWeight(a.priority) - priorityWeight(b.priority); });
    } else if (sortBy === "due") {
      list.sort(function (a, b) {
        if (!a.due) return 1;
        if (!b.due) return -1;
        return new Date(a.due) - new Date(b.due);
      });
    } else if (sortBy === "alpha") {
      list.sort(function (a, b) { return a.text.localeCompare(b.text); });
    } else {
      list.sort(function (a, b) { return b.id - a.id; });
    }

    return list;
  }

  // Rebuilds the task list and updates the summary counts after each task change
  function renderList(tasks, filter, searchTerm, sortBy) {
    var $list = $("#todo-list");
    $list.empty();

    var visible = getVisibleTasks(tasks, filter, searchTerm, sortBy);

    if (visible.length === 0) {
      $list.append('<li class="empty-state">No tasks match here</li>');
    } else {
      visible.forEach(function (task) {
        var $li = $('<li>')
          .attr("data-id", task.id)
          .addClass("priority-" + task.priority)
          .toggleClass("completed", task.completed);

        var $completion = $('<label class="task-completion" title="Mark this task as completed">');
        var $checkbox = $('<input type="checkbox">').prop("checked", task.completed);
        $completion.append($checkbox);
        $completion.append($('<span class="completion-label">').text(task.completed ? "Completed" : "Complete"));

        var $main = $('<div class="task-main">');
        var $text = $('<span class="task-text">').text(task.text);
        $main.append($text);

        var $meta = $('<div class="task-meta">');
        $meta.append(
          $('<span class="badge badge-priority-' + task.priority + '">').text(task.priority)
        );

        $meta.append(
          $('<span class="badge badge-created">').text("Created: " + formatDate(task.createdAt))
        );

        if (task.due) {
          var overdue = isOverdue(task);
          $meta.append(
            $('<span class="badge badge-due">')
              .toggleClass("overdue", overdue)
              .text((overdue ? "Overdue (due " : "Due date: ") + formatDate(task.due) + (overdue ? ")" : ""))
          );
        }

        if (task.note && task.note.trim() !== "") {
          $meta.append($('<span class="badge badge-note">').text("Has note"));
        }

        $main.append($meta);

        var $actions = $('<div class="task-actions">');
        var $noteBtn = $('<button class="note-btn" title="Add / edit note">&#9998;</button>');
        var $deleteBtn = $('<button class="delete-btn" title="Delete task">&times;</button>');
        $actions.append($noteBtn, $deleteBtn);

        $li.append($completion, $main, $actions);
        $list.append($li);
      });
    }

    var total = tasks.length;
    var active = tasks.filter(function (t) { return !t.completed; }).length;
    var done = total - active;

    $("#stat-total").text(total);
    $("#stat-active").text(active);
    $("#stat-done").text(done);

    $("#items-left").text(active + " item" + (active === 1 ? "" : "s") + " left");
  }

  return {
    renderList: renderList,
    formatDate: formatDate
  };
})();
