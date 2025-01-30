// support-intercom.js
function attachIntercomHandlers() {
  // Ensure Intercom is available
  if (typeof window.Intercom === "undefined") {
    console.warn("Intercom not found, waiting for it to load...");
    setTimeout(attachIntercomHandlers, 500);
    return;
  }

  // Handle clicks on .open-intercom links and topbar intercom links
  function handleIntercomClick(e) {
    e.preventDefault();
    window.Intercom("show");
  }

  // Find all possible intercom links - now including full paths ending with #intercom
  const intercomLinks = document.querySelectorAll(
    '.open-intercom, a[href$="#intercom"], [data-intercom="true"]'
  );

  intercomLinks.forEach((link) => {
    link.removeEventListener("click", handleIntercomClick);
    link.addEventListener("click", handleIntercomClick);
  });

  // Handle hash changes
  function handleHashChange() {
    if (window.location.hash === "#intercom" && !window._intercomTriggered) {
      window._intercomTriggered = true;
      window.Intercom("show");
    } else if (window.location.hash !== "#intercom") {
      window._intercomTriggered = false;
    }
  }

  // Remove existing listener before adding new one
  window.removeEventListener("hashchange", handleHashChange);
  window.addEventListener("hashchange", handleHashChange);

  // Check hash on initial load only once
  if (!window._initialHashChecked) {
    window._initialHashChecked = true;
    handleHashChange();
  }
}

// Initial attachment
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", attachIntercomHandlers);
} else {
  attachIntercomHandlers();
}

// Also attach on load to catch any dynamic elements
window.addEventListener("load", attachIntercomHandlers);

// Reattach handlers periodically to catch dynamically added elements
setInterval(attachIntercomHandlers, 2000);
