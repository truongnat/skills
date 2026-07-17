(() => {
  const endpointChoice = "/api/choice";
  const endpointEvent = "/api/event";

  function meta() {
    const root = document.documentElement;
    return {
      issue_id:
        root.dataset.issueId ||
        document.querySelector("[data-issue-id]")?.getAttribute("data-issue-id") ||
        null,
      session: root.dataset.session || null,
      title: document.title,
    };
  }

  async function post(url, payload) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      throw new Error(data.error || `request failed (${response.status})`);
    }
    return data;
  }

  function statusNode() {
    let node = document.getElementById("decision-server-status");
    if (!node) {
      node = document.createElement("p");
      node.id = "decision-server-status";
      node.setAttribute("role", "status");
      node.style.marginTop = "1rem";
      document.body.appendChild(node);
    }
    return node;
  }

  function setStatus(text, ok) {
    const node = statusNode();
    node.textContent = text;
    node.style.color = ok ? "inherit" : "#b00020";
  }

  async function recordChoice(choice, note, issueId) {
    const base = meta();
    const payload = {
      issue_id: issueId || base.issue_id,
      choice,
      note: note || "",
      session: base.session,
      meta: { title: base.title, href: location.href },
    };
    if (!payload.issue_id) {
      throw new Error("missing issue_id (set data-issue-id on <html> or button)");
    }
    return post(endpointChoice, payload);
  }

  async function recordEvent(type, extra) {
    const base = meta();
    return post(endpointEvent, {
      type,
      issue_id: base.issue_id,
      session: base.session,
      payload: extra || {},
    });
  }

  function wireButtons() {
    document.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          button.disabled = true;
          const choice = button.getAttribute("data-choice");
          const issueId = button.getAttribute("data-issue-id");
          const note = button.getAttribute("data-note") || "";
          await recordChoice(choice, note, issueId);
          setStatus(`Logged choice: ${choice}`, true);
          await recordEvent("choice_ui_ack", { choice });
        } catch (err) {
          setStatus(String(err.message || err), false);
          button.disabled = false;
        }
      });
    });
  }

  window.SimpleSkillsDecision = {
    recordChoice,
    recordEvent,
  };

  document.addEventListener("DOMContentLoaded", () => {
    wireButtons();
    recordEvent("page_view", { path: location.pathname }).catch(() => {});
  });
})();
