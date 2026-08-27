// Confirmation:
// reuses one popup for confirmations and warning messages.
var TodoConfirm = (function () {
  var pendingAction = null;

  // Hides the popup and discards any action that was not confirmed
  function close() {
    pendingAction = null;
    $("#confirm-modal").addClass("hidden");
  }

  // Opens a two-button confirmation popup and stores its confirmed action
  function open(options) {
    pendingAction = options.onConfirm;
    $("#confirm-title").text(options.title || "Are you sure?");
    $("#confirm-message").text(options.message || "Please confirm this action.");
    $("#confirm-icon").text(options.icon || "!");
    $("#confirm-ok-btn").text(options.confirmLabel || "Confirm")
      .toggleClass("danger-btn", options.variant === "danger");
    $("#confirm-cancel-btn").removeClass("hidden");
    $("#confirm-modal").removeClass("hidden");
    $("#confirm-cancel-btn").trigger("focus");
  }

  // Opens a one-button warning popup for invalid input or other notices
  function alert(options) {
    pendingAction = null;
    $("#confirm-title").text(options.title || "Notice");
    $("#confirm-message").text(options.message || "Please review this message.");
    $("#confirm-icon").text(options.icon || "!");
    $("#confirm-cancel-btn").addClass("hidden");
    $("#confirm-ok-btn").text(options.acknowledgeLabel || "Okay").removeClass("danger-btn");
    $("#confirm-modal").removeClass("hidden");
    $("#confirm-ok-btn").trigger("focus");
  }

  $(function () {
    $("#confirm-cancel-btn").on("click", close);
    $("#confirm-ok-btn").on("click", function () {
      var action = pendingAction;
      close();
      if (typeof action === "function") action();
    });
    $("#confirm-modal").on("click", function (event) {
      if (event.target === this) close();
    });
    $(document).on("keydown", function (event) {
      if (event.key === "Escape" && !$("#confirm-modal").hasClass("hidden")) close();
    });
  });

  return { open: open, alert: alert };
})();
