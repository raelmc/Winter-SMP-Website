(() => {
  const config = window.WINTER_SMP_CONFIG || {};
  const value = (key) => typeof config[key] === "string" ? config[key].trim() : "";
  const setText = (selector, text) => document.querySelectorAll(selector).forEach((node) => { node.textContent = text; });

  const serverIp = value("serverIp");
  const bedrockIp = value("bedrockIp");
  const bedrockPort = value("bedrockPort");
  const discordInvite = value("discordInvite");
  const whitelistChannel = value("whitelistChannel");

  // Zentrale Termine: in site-config.js gepflegt; alle sichtbaren Daten und Countdown nutzen diese Werte.
  const startTime = new Date(value("serverStart") || "2027-01-08T20:00:00+01:00");
  const diamondTime = new Date(value("diamondUnlock") || "2027-01-15T20:00:00+01:00");
  const endTime = new Date(value("endUnlock") || "2027-01-22T20:00:00+01:00");
  const germanDate = (date, options) => new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", ...options }).format(date);
  setText("#home-start-date", `${new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "short", timeZone: "Europe/Berlin" }).format(startTime)} (${germanDate(startTime, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })})`);
  const startLongDateTime = `${germanDate(startTime, { day: "numeric", month: "long", year: "numeric" })}, ${germanDate(startTime, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })} Uhr`;
  const faqItems = [
    { question: "Wie trete ich dem Winter-SMP bei?", answer: "Schreib deinen eigenen Minecraft-Namen oder den Minecraft-Namen einer Freundin oder eines Freundes in den Whitelist-Kanal auf unserem Discord. Der Name wird automatisch zur Whitelist hinzugefügt. Die Serveradresse und die Anleitungen für Java (PC) und Bedrock, inklusive Konsole, findest du unter „Beitreten“." },
    { question: "Welche Minecraft-Version brauche ich?", answer: [
      { text: "Java (PC): Mit Version 26.3 kannst du direkt beitreten. Mit " },
      { link: "ViaFabricPlus", href: "https://modrinth.com/mod/viafabricplus" },
      { text: " kannst du auch mit einer anderen Client-Version beitreten." }, { break: true },
      { text: "Bedrock: Verwende immer die neueste Bedrock-Version." }
    ] },
    { question: "Ich kann dem Server nicht beitreten. Was kann ich tun?", answer: "Prüfe zuerst, ob du deinen Minecraft-Namen richtig in den Whitelist-Kanal geschrieben hast und die Serveradresse stimmt. Bei Bedrock brauchst du zusätzlich den angegebenen Port. Wenn es trotzdem nicht klappt, öffne ein Support-Ticket auf Discord und schick am besten die Fehlermeldung mit." },
    { question: "Kann ich auch später noch einsteigen?", answer: "Ja, du musst nicht direkt zum Start dabei sein. Trag einfach deinen Minecraft-Namen auf Discord für die Whitelist ein und steig ein, wenn du Zeit hast." },
    { question: "Warum werden die Rüstungsstufen nach und nach freigeschaltet?", answer: "Die gestaffelte Freischaltung sorgt für längeren Spielspaß. Außerdem können Spielerinnen und Spieler, die weniger Zeit haben, leichter mithalten." },
    { question: "Ab wann darf ich Diamant- und Netherite-Rüstung tragen?", answer: "Zum Start ist Eisen die höchste erlaubte Rüstungsstufe. Ab dem 15. Januar 2027 um 20:00 Uhr darfst du Diamantrüstung tragen. Der Endkampf findet am 22. Januar 2027 um 20:00 Uhr statt. Netherite kann erst nach dem Endkampf gecraftet werden. So verlierst du keine Netherite-Ausrüstung, falls du beim Endkampf von der End-Insel fällst und deine Ausrüstung verlierst." },
    { question: "Muss ich beim End-Fight-Event dabei sein?", answer: "Nein, die Teilnahme ist freiwillig. Wenn du an dem Termin keine Zeit hast, kannst du trotzdem ganz normal weiterspielen." },
    { question: "Brauche ich Mods, um mitzuspielen?", answer: "Nein, Mods sind keine Pflicht. Die Mods aus der Liste für Java (PC) und das Modpack Rendarium sind aber ausdrücklich empfohlen." },
    { question: "Woher weiß ich, ob ein Mod oder eine Aktion im Spiel erlaubt ist?", answer: "Schau zuerst unter „Regeln“ in die Listen „Erlaubt“ und „Verboten“. Wenn du dir danach immer noch unsicher bist oder etwas unklar ist, frag auf Discord nach, bevor du den Mod benutzt oder die Aktion ausprobierst." },
    { question: "Was mache ich, wenn jemand mein Haus zerstört oder gegen die Regeln verstößt?", answer: "Öffne ein Support-Ticket auf unserem Discord. Bleib dabei immer sachlich und beschreib, was passiert ist. Wenn du die Spielernamen und die ungefähre Uhrzeit kennst, schreib sie dazu. Screenshots oder Aufnahmen helfen, sind aber kein Muss. Das Mod-Team schaut sich den Vorfall an und klärt ihn mit dir im Ticket." }
  ];
  setText("#info-start-date", startLongDateTime);
  const progressionDates = { start: startTime, diamond: diamondTime, end: endTime };
  document.querySelectorAll("[data-progression-date]").forEach((node) => {
    const date = progressionDates[node.dataset.progressionDate];
    if (date) {
      const day = germanDate(date, { day: "numeric" });
      const month = germanDate(date, { month: "short" }).replace(".", "").toUpperCase();
      node.textContent = `${day}. ${month} · ${germanDate(date, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })} UHR`;
    }
  });

  const progressionTimers = document.querySelectorAll("[data-progression-countdown]");
  const updateProgressionCountdowns = () => {
    progressionTimers.forEach((timer) => {
      const target = progressionDates[timer.dataset.progressionCountdown];
      const live = timer.querySelector(".progression-live");
      const units = Array.from(timer.querySelectorAll("[data-part]")).map((part) => part.parentElement);
      const remaining = target.getTime() - Date.now();
      if (remaining <= 0) {
        units.forEach((unit) => { unit.hidden = true; });
        live.hidden = false;
        timer.setAttribute("aria-label", "Freigeschaltet: LIVE");
        return;
      }
      const totalSeconds = Math.floor(remaining / 1000);
      const values = { days: Math.floor(totalSeconds / 86400), hours: Math.floor(totalSeconds / 3600) % 24, minutes: Math.floor(totalSeconds / 60) % 60, seconds: totalSeconds % 60 };
      Object.entries(values).forEach(([unit, amount]) => {
        timer.querySelector(`[data-part="${unit}"]`).textContent = String(amount).padStart(2, "0");
      });
    });
  };
  updateProgressionCountdowns();
  window.setInterval(updateProgressionCountdowns, 1000);

  const countdown = document.querySelector(".countdown");
  const countdownFields = Object.fromEntries(["days", "hours", "minutes", "seconds"].map((unit) => [unit, document.querySelector(`[data-countdown="${unit}"]`)]));
  const countdownLive = document.querySelector(".countdown-live");
  let countdownExpired = false;
  const updateCountdown = () => {
    const remaining = startTime.getTime() - Date.now();
    if (remaining <= 0) {
      countdown.querySelectorAll(".countdown-unit").forEach((unit) => { unit.hidden = true; });
      countdownLive.hidden = false;
      countdown.setAttribute("aria-label", "Server ist LIVE");
      countdownExpired = true;
      return;
    }
    const seconds = Math.floor(remaining / 1000);
    const values = { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60 };
    Object.entries(values).forEach(([unit, amount]) => { countdownFields[unit].textContent = String(amount).padStart(2, "0"); });
  };
  updateCountdown();
  if (!countdownExpired) window.setInterval(updateCountdown, 1000);

  // Q&A-Inhalte sind oben unter „faqItems“ zentral gebündelt und leicht änderbar.
  const qaList = document.querySelector("#qa-list");
  faqItems.forEach(({ question, answer }, index) => {
    const details = document.createElement("details");
    details.className = "glass qa-item reveal";
    const summary = document.createElement("summary");
    const title = document.createElement("strong");
    title.textContent = question;
    const arrow = document.createElement("span");
    arrow.className = "chevron";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "⌄";
    const response = document.createElement("div");
    response.className = "qa-answer";
    if (Array.isArray(answer)) {
      answer.forEach((part) => {
        if (part.break) response.append(document.createElement("br"));
        else if (part.link) {
          const link = document.createElement("a");
          link.href = part.href;
          link.textContent = part.link;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          response.append(link);
        } else response.append(document.createTextNode(part.text));
      });
    } else response.textContent = answer;
    summary.append(title, arrow);
    details.append(summary, response);
    details.setAttribute("aria-label", `Frage ${index + 1}`);
    qaList.append(details);
  });

  if (serverIp) {
    setText(".server-ip-value", serverIp);
    setText(".hero-ip-value", serverIp);
    document.querySelectorAll(".copy-button").forEach((button) => {
      button.hidden = false;
      button.addEventListener("click", async () => {
        const feedback = document.querySelector(".copy-feedback");
        try { await navigator.clipboard.writeText(serverIp); feedback.textContent = "Server-IP wurde kopiert."; }
        catch { feedback.textContent = `Server-IP: ${serverIp}`; }
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
        try { await navigator.clipboard.writeText(bedrockIp); document.querySelector(".copy-feedback").textContent = "Server-IP wurde kopiert."; }
        catch { document.querySelector(".copy-feedback").textContent = `Server-IP: ${bedrockIp}`; }
      });
    });
  }
  if (bedrockPort) setText(".bedrock-port-value", bedrockPort);

  if (discordInvite) {
    document.querySelectorAll(".discord-link").forEach((link) => {
      link.href = discordInvite; link.target = "_blank"; link.rel = "noopener noreferrer"; link.hidden = false;
    });
    const footerDiscord = document.querySelector(".footer-discord");
    const footerIcon = document.querySelector(".discord-icon");
    if (footerDiscord && footerIcon) {
      const footerLink = document.createElement("a");
      footerLink.className = "discord-link footer-discord-link"; footerLink.href = discordInvite; footerLink.target = "_blank"; footerLink.rel = "noopener noreferrer";
      footerLink.setAttribute("aria-label", "Winter SMP auf Discord"); footerIcon.replaceWith(footerLink); footerLink.append(footerIcon);
    }
  }

  if (whitelistChannel) {
    const steps = document.querySelectorAll(".steps li p");
    if (steps[1]) steps[1].textContent = `Schreib deinen Minecraft-Namen in den Whitelist-Kanal „${whitelistChannel}“.`;
    const note = document.querySelector(".small-note");
    if (note && discordInvite) note.textContent = "Dein Name wird automatisch zur Whitelist hinzugefügt.";
    else if (note) note.textContent = "Discord-Einladung folgt noch.";
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Scroll reveal is grouped by section so one trigger reveals the whole category.
  if (!reducedMotion) {
    const revealSections = Array.from(document.querySelectorAll("main .section:not(.hero)"));
    const footer = document.querySelector("footer.site-footer");
    const revealGroups = revealSections.map((section) => ({
      trigger: section,
      targets: Array.from(section.querySelectorAll(".section-heading, .info-card, .join-info, .friends-note, .server-box, .rule-card, .mods-card, .timeline-card, .team-details, .qa-item"))
    })).filter((group) => group.targets.length);
    if (footer) revealGroups.push({ trigger: footer, targets: [footer] });

    // Reveal targets already carry their initial CSS state in the HTML. Keep the
    // timeline primed before its first animation; never hide targets from JS.
    revealGroups.forEach((group) => {
      if (group.trigger.id === "progression") group.trigger.classList.add("timeline-ready");
    });
    const revealGroup = ({ trigger, targets }) => {
      if (trigger.id === "progression") trigger.classList.add("timeline-started");
      targets.forEach((target, index) => {
        target.style.setProperty("--reveal-delay", `${index * 110}ms`);
        target.classList.add("is-visible");
      });
    };
    let revealCheckPending = false;
    const checkRevealPositions = () => {
      revealCheckPending = false;
      const triggerY = window.innerHeight * 0.53;
      const nearPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      revealGroups.forEach(({ trigger, targets }) => {
        const pendingTargets = targets.filter((target) => !target.classList.contains("is-visible"));
        if (!pendingTargets.length) return;
        const sectionReached = trigger.getBoundingClientRect().top <= triggerY;
        const isTeamOrFooter = trigger.id === "team" || trigger.matches("footer.site-footer");
        if (!sectionReached && !(nearPageEnd && isTeamOrFooter)) return;
        revealGroup({ trigger, targets: pendingTargets });
      });
    };
    const scheduleRevealCheck = () => {
      if (revealCheckPending) return;
      revealCheckPending = true; window.requestAnimationFrame(checkRevealPositions);
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
    // Re-check after anchor jumps, browser scroll restoration, and late layout changes.
    window.addEventListener("hashchange", scheduleRevealCheck);
    window.addEventListener("pageshow", scheduleRevealCheck);
    window.addEventListener("load", scheduleRevealCheck, { once: true });
    scheduleRevealCheck();
  } else {
    document.querySelectorAll(".reveal").forEach((target) => target.classList.add("is-visible"));
    document.querySelectorAll(".timeline-card").forEach((card) => card.classList.add("is-visible"));
  }
})();