// Main controller: 
// connects page interactions to storage and rendering modules
$(function () {
  var currentFilter = "all";
  var currentSort = "created";
  var searchTerm = "";
  var activeNoteTaskId = null;

  // Toast: 
  // displays a brief success message then automatically hides it
  function showToast(message) {
    var $toast = $("#toast");
    $toast.text(message).removeClass("hidden");
    clearTimeout($toast.data("timer"));
    var timer = setTimeout(function () {
      $toast.addClass("hidden");
    }, 1800);
    $toast.data("timer", timer);
  }

  // Refreshes the visible task list using the current filter, search, and sort settings
  function refresh() {
    TodoRender.renderList(TodoStorage.getAll(), currentFilter, searchTerm, currentSort);
  }

  // Shows either the Add Task or My Tasks section and updates its selected tab
  function showView(viewId) {
    $(".app-view").addClass("hidden");
    $("#" + viewId).removeClass("hidden");
    $(".view-tab").removeClass("active").attr("aria-selected", "false");
    $(".view-tab[data-view='" + viewId + "']").addClass("active").attr("aria-selected", "true");
    if (viewId === "add-view") $("#todo-input").trigger("focus");
  }

  $(".view-tab").on("click", function () {
    showView($(this).data("view"));
  });

  // Blocks dates before today from being used as a task due date
  function isPastDueDate(dateStr) {
    return dateStr && dateStr < TodoStorage.todayISO();
  }

  function warnPastDueDate() {
    TodoConfirm.alert({
      title: "Past due dates are not allowed",
      message: "Choose today or a future date for this task.",
      icon: "!",
      acknowledgeLabel: "Okay"
    });
  }

  $("#due-input").attr("min", TodoStorage.todayISO()).on("change", function () {
    if (isPastDueDate($(this).val())) {
      $(this).val("");
      warnPastDueDate();
    }
  });

  // Add task
  $("#todo-form").on("submit", function (e) {
    e.preventDefault();
    var value = $("#todo-input").val().trim();
    if (value === "") return;

    var priority = $("#priority-input").val();
    var due = $("#due-input").val();
    var note = $("#new-task-note").val().trim();

    if (isPastDueDate(due)) {
      $("#due-input").val("");
      warnPastDueDate();
      return;
    }

    if (TodoStorage.hasTaskNamed(value)) {
      TodoConfirm.alert({
        title: "Task already exists",
        message: 'A task named "' + value + '" already exists. Use a different name.',
        icon: "!",
        acknowledgeLabel: "Okay"
      });
      return;
    }

    var message = 'Add "' + value + '" (' + priority + ' priority)' +
      (due ? " due " + TodoRender.formatDate(due) : "") + "?";

    TodoConfirm.open({
      title: "Add this task?",
      message: message,
      icon: "+",
      confirmLabel: "Add Task",
      onConfirm: function () {
        TodoStorage.addTask(value, priority, due, note);

        $("#todo-input").val("");
        $("#due-input").val("");
        $("#new-task-note").val("");
        $("#priority-input").val("easy");

        refresh();
        showView("tasks-view");
        showToast("Task added");
      }
    });
  });

  // Toggle complete
  $("#todo-list").on("change", "input[type='checkbox']", function () {
    var id = $(this).closest("li").data("id");
    TodoStorage.toggleComplete(id, $(this).prop("checked"));
    refresh();
  });

  // Delete task
  $("#todo-list").on("click", ".delete-btn", function () {
    var id = $(this).closest("li").data("id");
    var task = TodoStorage.getById(id);
    if (!task) return;
    TodoConfirm.open({
      title: "Delete this task?",
      message: 'Delete "' + task.text + '"? This cannot be undone.',
      icon: "!",
      variant: "danger",
      confirmLabel: "Delete task",
      onConfirm: function () {
        TodoStorage.deleteTask(id);
        refresh();
        showToast("Task deleted");
      }
    });
  });

  // Open note editor for a task
  $("#todo-list").on("click", ".note-btn, .badge-note", function () {
    var id = $(this).closest("li").data("id");
    var task = TodoStorage.getById(id);
    if (!task) return;

    activeNoteTaskId = id;
    $("#notes-modal-title").text("Note: " + task.text);
    $("#notes-textarea").val(task.note || "");
    $("#notes-modal").removeClass("hidden");
    $("#notes-textarea").trigger("focus");
  });

  // Save note
  $("#save-note-btn").on("click", function () {
    if (activeNoteTaskId !== null) {
      TodoStorage.setNote(activeNoteTaskId, $("#notes-textarea").val());
      refresh();
      showToast("Note saved");
    }
    $("#notes-modal").addClass("hidden");
  });

  // Open standalone all-notes view
  $("#notes-view-btn").on("click", function () {
    var $container = $("#all-notes-list");
    $container.empty();

    var withNotes = TodoStorage.getAll().filter(function (t) { return t.note && t.note.trim() !== ""; });

    if (withNotes.length === 0) {
      $container.append('<div class="no-notes">No notes written yet</div>');
    } else {
      withNotes.forEach(function (task) {
        var $card = $('<div class="note-card">');
        $card.append($('<div class="note-card-title">').text(task.text));
        $card.append($('<div class="note-card-text">').text(task.note));
        $container.append($card);
      });
    }

    $("#all-notes-modal").removeClass("hidden");
  });

  // Open calendar view
  $("#calendar-view-btn").on("click", function () {
    TodoCalendar.render(TodoStorage.getAll());
    $("#calendar-modal").removeClass("hidden");
  });

  $("#cal-prev").on("click", function () {
    TodoCalendar.prevMonth(TodoStorage.getAll());
  });

  $("#cal-next").on("click", function () {
    TodoCalendar.nextMonth(TodoStorage.getAll());
  });

  $("#calendar-grid").on("click", ".calendar-day:not(.empty)", function () {
    var dateStr = $(this).data("date");
    TodoCalendar.selectDate(TodoStorage.getAll(), dateStr);
  });

  // Close modals
  $(".modal-close").on("click", function () {
    var target = $(this).data("close");
    $("#" + target).addClass("hidden");
  });

  $(".modal-overlay").on("click", function (e) {
    if (e.target === this) {
      $(this).addClass("hidden");
    }
  });

  // Filters
  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    currentFilter = $(this).data("filter");
    refresh();
  });

  // Search
  $("#search-input").on("input", function () {
    searchTerm = $(this).val();
    refresh();
  });

  // Sort
  $("#sort-select").on("change", function () {
    currentSort = $(this).val();
    refresh();
  });

  // Clear completed
  $("#clear-completed").on("click", function () {
    var completed = TodoStorage.getAll().filter(function (task) { return task.completed; }).length;
    if (completed === 0) return;
    TodoConfirm.open({
      title: "Clear completed tasks?",
      message: "Delete " + completed + " completed task" + (completed === 1 ? "" : "s") + "?",
      icon: "!",
      variant: "danger",
      confirmLabel: "Clear completed",
      onConfirm: function () {
        TodoStorage.clearCompleted();
        refresh();
        showToast("Completed tasks cleared");
      }
    });
  });

  // Clear all
  $("#clear-all").on("click", function () {
    if (TodoStorage.getAll().length === 0) return;
    TodoConfirm.open({
      title: "Delete all tasks?",
      message: "Delete every task? This cannot be undone.",
      icon: "!",
      variant: "danger",
      confirmLabel: "Delete all",
      onConfirm: function () {
        TodoStorage.clearAll();
        refresh();
        showToast("All tasks cleared");
      }
    });
  });

  refresh();
});
