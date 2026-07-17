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

  function ensureBanner() {
    let banner = document.getElementById("decision-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "decision-banner";
      document.body.prepend(banner);
    }
    banner.setAttribute("role", "status");
    banner.setAttribute("aria-live", "polite");
    if (!banner.querySelector(".ss-banner-inner")) {
      banner.innerHTML =
        '<div class="ss-banner-inner">' +
        '<div class="ss-banner-mark" aria-hidden="true"></div>' +
        '<div class="ss-banner-copy"><strong></strong><span></span></div>' +
        "</div>";
    }
    return banner;
  }

  function setBanner(state, title, detail) {
    const banner = ensureBanner();
    banner.dataset.state = state;
    const mark = banner.querySelector(".ss-banner-mark");
    const strong = banner.querySelector(".ss-banner-copy strong");
    const span = banner.querySelector(".ss-banner-copy span");
    if (!mark || !strong || !span) {
      banner.textContent = `${title}${detail ? ` — ${detail}` : ""}`;
      banner.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    mark.textContent =
      state === "ok" ? "✓" : state === "error" ? "!" : "…";
    strong.textContent = title;
    span.textContent = detail || "";
    banner.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function optionRoot(button) {
    return (
      button.closest(".ss-option, .option, article, [data-choice-option]") ||
      button.parentElement
    );
  }

  function markSelection(selectedButton) {
    const selected = optionRoot(selectedButton);
    document.querySelectorAll("[data-choice]").forEach((button) => {
      const root = optionRoot(button);
      const isSelected = button === selectedButton;
      // Keep enabled so the user can change their mind; choice-reader uses latest.
      button.disabled = false;
      if (!root) {
        return;
      }
      root.classList.toggle("is-selected", isSelected);
      root.classList.toggle("is-dimmed", !isSelected);
      root.querySelectorAll(".ss-selected-badge").forEach((node) => node.remove());
      if (isSelected) {
        const badge = document.createElement("span");
        badge.className = "ss-tag ss-selected-badge";
        badge.textContent = "Selected";
        root.prepend(badge);
      }
    });
    if (selected) {
      selected.classList.add("is-selected");
      selected.classList.remove("is-dimmed");
    }
  }

  function setChoicesBusy(busy) {
    document.querySelectorAll("[data-choice]").forEach((button) => {
      button.disabled = Boolean(busy);
    });
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
        if (button.disabled) {
          return;
        }
        const choice = button.getAttribute("data-choice");
        const issueId = button.getAttribute("data-issue-id");
        const note = button.getAttribute("data-note") || "";
        const label = button.textContent.trim() || choice;
        try {
          setChoicesBusy(true);
          setBanner(
            "pending",
            "Saving your choice…",
            `${label} (${choice})`
          );
          await recordChoice(choice, note, issueId);
          markSelection(button);
          setBanner(
            "ok",
            "Choice recorded",
            `${label} → ${choice}. Click another option to change.`
          );
          await recordEvent("choice_ui_ack", { choice });
        } catch (err) {
          setBanner(
            "error",
            "Could not save choice",
            String(err.message || err)
          );
          setChoicesBusy(false);
        }
      });
    });
  }

  window.SimpleSkillsDecision = {
    recordChoice,
    recordEvent,
    setBanner,
  };

  function wireReveals() {
    const nodes = document.querySelectorAll(
      ".ss-reveal, main.ss-main > section, main.ss-main > .ss-grid"
    );
    if (!nodes.length) {
      return;
    }
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    nodes.forEach((node, index) => {
      if (!node.classList.contains("ss-reveal")) {
        node.classList.add("ss-reveal");
      }
      node.style.transitionDelay = `${Math.min(index * 40, 200)}ms`;
      observer.observe(node);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureBanner();
    wireButtons();
    wireReveals();
    recordEvent("page_view", { path: location.pathname }).catch(() => {});
  });
})();
