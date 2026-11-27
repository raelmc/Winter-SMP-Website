(() => {
  const config = window.WINTER_SMP_CONFIG || {};
  const value = (key) => typeof config[key] === "string" ? config[key].trim() : "";
  const setText = (selector, text) => document.querySelectorAll(selector).forEach((node) => { node.textContent = text; });

  const serverIp = value("serverIp");
  const bedrockIp = value("bedrockIp");
  const bedrockPort = value("bedrockPort");
  const discordInvite = value("discordInvite");
  const whitelistChannel = value("whitelistChannel");

  if (serverIp) {
    setText(".server-ip-value", serverIp);
    setText(".hero-ip-value", serverIp);
    document.querySelectorAll(".copy-button").forEach((button) => {
      button.hidden = false;
      button.addEventListener("click", async () => {
        const feedback = document.querySelector(".copy-feedback");
        try {
          await navigator.clipboard.writeText(serverIp);
          feedback.textContent = "Server-IP wurde kopiert.";
        } catch {
          feedback.textContent = `Server-IP: ${serverIp}`;
        }
      });
    });
    setText(".placeholder-value", serverIp);
  }
  if (bedrockIp && !serverIp) {
    setText(".server-ip-value", bedrockIp);
    setText(".hero-ip-value", bedrockIp);
    document.querySelectorAll(".copy-button").forEach((button) => {
      button.hidden = false;
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(bedrockIp);
          document.querySelector(".copy-feedback").textContent = "Server-IP wurde kopiert.";
        } catch {
          document.querySelector(".copy-feedback").textContent = `Server-IP: ${bedrockIp}`;
        }
      });
    });
  }
  if (bedrockPort) setText(".bedrock-port-value", bedrockPort);

  if (discordInvite) {
    document.querySelectorAll(".discord-link").forEach((link) => {
      link.href = discordInvite;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.hidden = false;
    });
    const footerDiscord = document.querySelector(".footer-discord");
    const footerIcon = document.querySelector(".discord-icon");
    if (footerDiscord && footerIcon) {
      const footerLink = document.createElement("a");
      footerLink.className = "discord-link footer-discord-link";
      footerLink.href = discordInvite;
      footerLink.target = "_blank";
      footerLink.rel = "noopener noreferrer";
      footerLink.setAttribute("aria-label", "Winter SMP auf Discord");
      footerIcon.replaceWith(footerLink);
      footerLink.append(footerIcon);
    }
  }

  if (whitelistChannel) {
    const steps = document.querySelectorAll(".steps li p");
    if (steps[1]) steps[1].textContent = `Schreib deinen Minecraft-Namen in den Whitelist-Kanal „${whitelistChannel}“.`;
    const note = document.querySelector(".small-note");
    if (note && discordInvite) note.textContent = "Dein Name wird automatisch zur Whitelist hinzugefügt.";
    else if (note) note.textContent = "Discord-Einladung folgt noch.";
  }

  // Scroll reveal is grouped by section so one trigger reveals the whole category.
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealSections = Array.from(document.querySelectorAll("main .section:not(.hero)"));
    const footer = document.querySelector("footer.site-footer");
    const revealGroups = revealSections.map((section) => ({
      trigger: section,
      targets: Array.from(section.querySelectorAll(".section-heading, .info-card, .join-info, .friends-note, .server-box, .rule-card, .mods-card, .timeline-card, .team-card"))
    })).filter((group) => group.targets.length);
    if (footer) revealGroups.push({ trigger: footer, targets: [footer] });

    revealGroups.forEach((group) => {
      group.targets.forEach((target) => target.classList.add("reveal"));
      if (group.trigger.id === "progression") group.trigger.classList.add("timeline-ready");
    });
    const revealGroup = ({ trigger, targets }) => {
      if (trigger.id === "progression") trigger.classList.add("timeline-started");
      targets.forEach((target) => {
        target.style.setProperty("--reveal-delay", "0ms");
        target.classList.add("is-visible");
      });
    };
    let revealCheckPending = false;
    const checkRevealPositions = () => {
      revealCheckPending = false;
      const triggerY = window.innerHeight * 0.53;
      const nearPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      revealGroups.forEach(({ trigger, targets }) => {
        if (targets.every((target) => target.classList.contains("is-visible"))) return;
        const sectionReached = trigger.getBoundingClientRect().top <= triggerY;
        const isTeamOrFooter = trigger.id === "team" || trigger.matches("footer.site-footer");
        if (!sectionReached && !(nearPageEnd && isTeamOrFooter)) return;
        revealGroup({ trigger, targets });
      });
    };
    const scheduleRevealCheck = () => {
      if (revealCheckPending) return;
      revealCheckPending = true;
      window.requestAnimationFrame(checkRevealPositions);
    };

    document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => {
        const section = document.querySelector(link.getAttribute("href"));
        const group = revealGroups.find((item) => item.trigger === section);
        if (group) revealGroup(group);
      });
    });

    window.addEventListener("scroll", scheduleRevealCheck, { passive: true });
    window.addEventListener("resize", scheduleRevealCheck, { passive: true });
    scheduleRevealCheck();
  }
})();
