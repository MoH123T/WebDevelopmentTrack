// Calendar: 
// renders task dates, calendar dots, and the selected days task list
var TodoCalendar = (function () {
  var viewYear, viewMonth, selectedDateStr = null;

  function init() {
    var now = new Date();
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
  }

  function toDateStr(y, m, d) {
    var mm = String(m + 1).padStart(2, "0");
    var dd = String(d).padStart(2, "0");
    return y + "-" + mm + "-" + dd;
  }

  // Finds tasks created on or due on a specific calendar date
  function tasksForDate(tasks, dateStr) {
    return tasks.filter(function (t) {
      return t.due === dateStr || t.createdAt === dateStr;
    });
  }

  // Draws the month grid, including the created and due-date dots for each day
  function renderGrid(tasks) {
    var $grid = $("#calendar-grid");
    $grid.empty();

    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    $("#calendar-month-label").text(monthNames[viewMonth] + " " + viewYear);

    var weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    weekdays.forEach(function (w) {
      $grid.append('<div class="calendar-weekday">' + w + '</div>');
    });

    var firstDay = new Date(viewYear, viewMonth, 1).getDay();
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    var todayStr = TodoStorage.todayISO();

    for (var i = 0; i < firstDay; i++) {
      $grid.append('<div class="calendar-day empty"></div>');
    }

    for (var day = 1; day <= daysInMonth; day++) {
      var dateStr = toDateStr(viewYear, viewMonth, day);
      var dayTasks = tasksForDate(tasks, dateStr);

      var $day = $('<div class="calendar-day">')
        .attr("data-date", dateStr)
        .toggleClass("today", dateStr === todayStr)
        .toggleClass("selected", dateStr === selectedDateStr);

      $day.append('<span>' + day + '</span>');

      var $dots = $('<div class="calendar-day-dots">');
      var hasDue = dayTasks.some(function (t) { return t.due === dateStr; });
      var hasCreated = dayTasks.some(function (t) { return t.createdAt === dateStr; });

      if (hasDue) $dots.append('<span class="dot dot-due"></span>');
      if (hasCreated) $dots.append('<span class="dot dot-created"></span>');

      $day.append($dots);
      $grid.append($day);
    }
  }

  // Lists the full task names beneath the calendar when the user selects a day
  function renderDayDetail(tasks, dateStr) {
    var $detail = $("#calendar-day-detail");
    $detail.empty();

    if (!dateStr) {
      $detail.append('<div class="no-notes">Click a day to see its tasks</div>');
      return;
    }

    var dayTasks = tasksForDate(tasks, dateStr);
    var d = new Date(dateStr);
    var label = d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

    $detail.append("<h3>" + label + "</h3>");

    if (dayTasks.length === 0) {
      $detail.append('<div class="no-notes">No tasks on this day</div>');
      return;
    }

    dayTasks.forEach(function (task) {
      var isCreated = task.createdAt === dateStr;
      var isDue = task.due === dateStr;

      var $item = $('<div class="calendar-task-item">');
      var $dots = $('<span class="task-item-dots">');

      if (isCreated) $dots.append('<span class="dot dot-created" title="Created on this day"></span>');
      if (isDue) $dots.append('<span class="dot dot-due" title="Due on this day"></span>');

      $item.append($dots);
      $item.append($('<span class="calendar-task-text">').text(task.text));
      $detail.append($item);
    });
  }

  function render(tasks) {
    renderGrid(tasks);
    renderDayDetail(tasks, selectedDateStr);
  }

  function prevMonth(tasks) {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    render(tasks);
  }

  function nextMonth(tasks) {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    render(tasks);
  }

  function selectDate(tasks, dateStr) {
    selectedDateStr = dateStr;
    render(tasks);
  }

  init();

  return {
    render: render,
    prevMonth: prevMonth,
    nextMonth: nextMonth,
    selectDate: selectDate
  };
})();
