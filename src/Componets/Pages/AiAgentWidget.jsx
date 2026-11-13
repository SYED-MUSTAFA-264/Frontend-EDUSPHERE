// ============================================================================
// PART 1 OF 4 — AiAgentWidget.jsx (Imports, 3D Register & Chat CSS, Helpers & Pro Drawing Page Engine)
// ============================================================================
import React, { useState, useEffect, useRef } from "react";

const API_BASE = "http://localhost:3000/api/ai-agent";

// ============================================================================
// AUTO-INJECTED 3D REGISTER BOOK STUDIO + 3D MESSENGER CSS
// ============================================================================
const CHAT_3D_UPGRADE_CSS = `
/* --- 1. 3D MESSENGER & FACULTY BADGES --- */
.tier-badge.faculty-official {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(245, 158, 11, 0.22));
  border: 1px solid rgba(16, 185, 129, 0.55);
  color: #34d399;
  box-shadow: 0 0 14px rgba(16, 185, 129, 0.22);
}
.comm-hub-3d-wrapper {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.comm-hub-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  padding: 16px 22px;
  background: linear-gradient(165deg, #141927 0%, #0b0e17 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.48);
}
.comm-hub-nav-pills {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #080b12;
  padding: 5px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  flex-wrap: wrap;
}
.comm-nav-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 15px;
  border-radius: 9px;
  border: 1px solid transparent;
  background: transparent;
  color: #94a3b8;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.22s ease-in-out;
}
.comm-nav-pill:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.04);
}
.comm-nav-pill.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.24), rgba(79, 70, 229, 0.15));
  border-color: rgba(99, 102, 241, 0.48);
  color: #ffffff;
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.22);
}
.comm-pill-count {
  padding: 1px 7px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}
.comm-nav-pill.active .comm-pill-count {
  background: #6366f1;
  color: #ffffff;
}
.comm-hub-stage-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  height: 700px;
}
@media (max-width: 1024px) {
  .comm-hub-stage-grid {
    grid-template-columns: 1fr;
    height: auto;
  }
}
.comm-dock-panel {
  background: linear-gradient(165deg, #121724 0%, #0a0d15 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.55);
}
.scholar-avatar-wrap.faculty-avatar {
  background: linear-gradient(135deg, #10b981, #059669);
  border: 1px solid rgba(52, 211, 153, 0.5);
}
.comm-conversation-stage {
  display: flex;
  flex-direction: column;
  height: 100%;
  background:
    radial-gradient(circle at top right, rgba(99, 102, 241, 0.08), transparent 50%),
    linear-gradient(165deg, #121724 0%, #090c14 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 24px 55px rgba(0, 0, 0, 0.58);
  position: relative;
}
.chat-pinned-banner {
  padding: 9px 20px;
  background: rgba(245, 158, 11, 0.1);
  border-bottom: 1px solid rgba(245, 158, 11, 0.28);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: #fde68a;
}
.dm-reactions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 6px;
}
.dm-reaction-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(22, 28, 44, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.16s ease-in-out;
}
.dm-reaction-chip:hover,
.dm-reaction-chip.reacted {
  background: rgba(99, 102, 241, 0.24);
  border-color: #818cf8;
  color: #ffffff;
  transform: translateY(-1px);
}
.dm-quick-react-bar {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(15, 19, 30, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
.dm-quick-emoji-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 5px;
  transition: transform 0.15s ease-in-out;
}
.dm-quick-emoji-btn:hover {
  transform: scale(1.28);
  background: rgba(255, 255, 255, 0.08);
}
.chat-poll-3d-card {
  margin-top: 4px;
  padding: 16px;
  border-radius: 13px;
  background: rgba(9, 12, 20, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.14);
  min-width: 280px;
}
.chat-poll-option-btn {
  position: relative;
  width: 100%;
  padding: 10px 12px;
  margin-top: 8px;
  border-radius: 9px;
  background: rgba(22, 28, 44, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease-in-out;
}
.chat-poll-option-btn:hover {
  border-color: #818cf8;
}
.chat-poll-option-btn.voted {
  border-color: #10b981;
}
.chat-poll-fill-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.32), rgba(16, 185, 129, 0.28));
  z-index: 0;
  transition: width 0.35s ease-in-out;
}
.chat-plus-trigger-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(145deg, #1e2538, #131826);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #f8fafc;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.22s ease-in-out;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}
.chat-plus-trigger-btn:hover,
.chat-plus-trigger-btn.open {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-color: #a5b4fc;
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(99, 102, 241, 0.38);
}
.chat-plus-trigger-btn svg {
  transition: transform 0.22s ease-in-out;
}
.chat-plus-trigger-btn.open svg {
  transform: rotate(45deg);
}
.chat-plus-popover-menu {
  position: absolute;
  bottom: 72px;
  left: 18px;
  width: 260px;
  background: linear-gradient(165deg, #171d2e 0%, #0d111b 100%);
  border: 1px solid rgba(99, 102, 241, 0.4);
  border-radius: 16px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85);
  z-index: 50;
}
.chat-plus-menu-item {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #e2e8f0;
  font-size: 12.8px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: all 0.16s ease-in-out;
}
.chat-plus-menu-item:hover {
  background: rgba(99, 102, 241, 0.16);
  color: #ffffff;
  transform: translateX(2px);
}
.chat-plus-icon-badge {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.16);
  border: 1px solid rgba(99, 102, 241, 0.32);
  color: #a5b4fc;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* =========================================================
   2. REAL-LIFE 3D REGISTER SHELF & MASSIVE 3D BOOK STUDIO
   ========================================================= */
.register-shelf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  perspective: 1800px;
}

.register-3d-card {
  position: relative;
  background: linear-gradient(155deg, #182032 0%, #0d121d 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px 16px 16px 8px;
  padding: 22px 20px 18px 34px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  transform-style: preserve-3d;
  transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.38s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.38s ease-in-out;
  box-shadow:
    4px 4px 0 #d6d0c4,
    7px 7px 0 #b8b1a3,
    0 20px 42px rgba(0, 0, 0, 0.65);
}

/* Left Hardcover Register Spine with Metallic Binding Detail */
.register-3d-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(90deg, #312e81 0%, #4f46e5 55%, #1e1b4b 100%);
  border-radius: 7px 0 0 7px;
  border-right: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset -3px 0 8px rgba(0, 0, 0, 0.55);
}

.register-3d-card:hover {
  transform: perspective(1400px) rotateY(-6deg) rotateX(2.5deg) translateY(-6px);
  border-color: rgba(129, 140, 248, 0.55);
  box-shadow:
    6px 6px 0 #e5dfd3,
    10px 10px 0 #c4bdb0,
    0 28px 55px rgba(79, 70, 229, 0.28);
}

/* Authentic Register Front Label Sticker */
.register-label-plate {
  background: linear-gradient(180deg, rgba(15, 20, 32, 0.95) 0%, rgba(10, 14, 23, 0.98) 100%);
  border: 1px solid rgba(99, 102, 241, 0.28);
  border-radius: 11px;
  padding: 14px 16px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  position: relative;
}

.register-actions-row {
  display: flex;
  align-items: center;
  gap: 7px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  flex-wrap: wrap;
}

/* Unified Sleek Secondary Button for Share, Download & Edit (Identical CSS) */
.reg-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 11px;
  background: #161c2b;
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.22s ease-in-out;
}

.reg-action-btn:hover {
  background: #232b40;
  border-color: rgba(129, 140, 248, 0.5);
  color: #ffffff;
  transform: translateY(-1.5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
}

.reg-action-btn svg {
  flex-shrink: 0;
  color: #a5b4fc;
}

/* Massive 94vw x 84vh Full-Screen 3D Book Workspace */
.book-modal-backdrop {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, rgba(15, 20, 35, 0.9) 0%, rgba(4, 6, 12, 0.96) 100%);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  z-index: 99995;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  transition: opacity 0.38s ease-in-out;
}

.book-top-toolbar {
  width: 94vw;
  max-width: 1620px;
  background: linear-gradient(180deg, rgba(20, 25, 39, 0.96) 0%, rgba(12, 15, 24, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 15px;
  padding: 10px 18px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.65);
}

.book-tool-group {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #090c14;
  padding: 4px;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
}

.book-tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.book-tool-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.book-tool-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.book-3d-stage {
  width: 94vw;
  height: 79vh;
  max-width: 1620px;
  perspective: 3200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-hardcover-shell {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #231f38 0%, #111320 50%, #1d1a30 100%);
  border: 3px solid #3b3659;
  border-radius: 20px;
  padding: 14px 20px;
  box-shadow:
    0 40px 95px rgba(0, 0, 0, 0.9),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 0 28px rgba(0, 0, 0, 0.85);
  position: relative;
  display: flex;
  transform-style: preserve-3d;
  animation: bookOpenReal3D 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.book-hardcover-shell.closing {
  animation: bookCloseReal3D 0.42s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes bookOpenReal3D {
  0% {
    opacity: 0;
    transform: perspective(3200px) scale(0.76) rotateX(26deg) rotateY(-22deg) translateY(45px);
  }
  60% {
    opacity: 1;
    transform: perspective(3200px) scale(1.01) rotateX(-2deg) rotateY(2deg) translateY(-4px);
  }
  100% {
    opacity: 1;
    transform: perspective(3200px) scale(1) rotateX(0deg) rotateY(0deg) translateY(0px);
  }
}

@keyframes bookCloseReal3D {
  0% {
    opacity: 1;
    transform: perspective(3200px) scale(1) rotateX(0deg) rotateY(0deg);
  }
  100% {
    opacity: 0;
    transform: perspective(3200px) scale(0.75) rotateX(24deg) rotateY(20deg) translateY(40px);
  }
}

.book-spread-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    -7px 0 0 #e6e0d4,
    -13px 0 0 #cfc8b8,
    -18px 0 0 #b5ae9e,
    7px 0 0 #e6e0d4,
    13px 0 0 #cfc8b8,
    18px 0 0 #b5ae9e,
    0 18px 40px rgba(0, 0, 0, 0.65);
  transform-style: preserve-3d;
}

.book-spread-container.flip-next {
  animation: pageCurlNext3D 0.52s cubic-bezier(0.4, 0, 0.2, 1);
}

.book-spread-container.flip-prev {
  animation: pageCurlPrev3D 0.52s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes pageCurlNext3D {
  0% { transform: perspective(3000px) rotateY(0deg) scale(1); }
  45% { transform: perspective(3000px) rotateY(-22deg) rotateX(2deg) scale(0.975); }
  100% { transform: perspective(3000px) rotateY(0deg) scale(1); }
}

@keyframes pageCurlPrev3D {
  0% { transform: perspective(3000px) rotateY(0deg) scale(1); }
  45% { transform: perspective(3000px) rotateY(22deg) rotateX(2deg) scale(0.975); }
  100% { transform: perspective(3000px) rotateY(0deg) scale(1); }
}

/* Center Spine with Realistic Metallic Spiral Rings */
.book-center-spine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 44px;
  transform: translateX(-50%);
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.03) 0%,
    rgba(0, 0, 0, 0.26) 36%,
    rgba(15, 13, 10, 0.58) 50%,
    rgba(0, 0, 0, 0.26) 64%,
    rgba(0, 0, 0, 0.03) 100%
  );
  z-index: 25;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 20px 0;
}

.book-spiral-ring {
  width: 30px;
  height: 9px;
  border-radius: 99px;
  background: linear-gradient(180deg, #f8fafc 0%, #94a3b8 45%, #334155 85%, #cbd5e1 100%);
  border: 1px solid rgba(15, 23, 42, 0.65);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.55);
}

.book-bottom-nav {
  width: 94vw;
  max-width: 1620px;
  margin-top: 10px;
  padding: 10px 22px;
  background: rgba(15, 18, 28, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

/* Custom Color Picker Input Styling */
.book-color-picker-input {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  overflow: hidden;
}
.book-color-picker-input::-webkit-color-swatch-wrapper {
  padding: 0;
}
.book-color-picker-input::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}
`;

// Track deleted IDs locally so deleted items never reappear
const getDeletedIdsSet = () => {
  try {
    const arr = JSON.parse(localStorage.getItem("edusphere_deleted_ids") || "[]");
    return new Set(arr.map(String));
  } catch (e) {
    return new Set();
  }
};

const markIdAsDeletedLocally = (id) => {
  if (!id) return;
  try {
    const set = getDeletedIdsSet();
    set.add(String(id));
    localStorage.setItem("edusphere_deleted_ids", JSON.stringify(Array.from(set)));
  } catch (e) {}
};

const getSavedSchedulesMap = () => {
  try {
    return JSON.parse(localStorage.getItem("edusphere_quiz_schedules") || "{}");
  } catch (e) {
    return {};
  }
};

const saveScheduleForQuizId = (quizId, isoDateString, isReattempt = false) => {
  if (!quizId || !isoDateString) return;
  try {
    const map = getSavedSchedulesMap();
    map[quizId] = { scheduledFor: isoDateString, isReattempt };
    localStorage.setItem("edusphere_quiz_schedules", JSON.stringify(map));
  } catch (e) {}
};

const getLocalCompletedQuizzes = (studentId) => {
  try {
    const deletedSet = getDeletedIdsSet();
    const all = JSON.parse(localStorage.getItem("edusphere_completed_quizzes") || "{}");
    const list = Array.isArray(all[studentId]) ? all[studentId] : [];
    return list.filter((q) => !deletedSet.has(String(q._id)));
  } catch (e) {
    return [];
  }
};

const saveLocalCompletedQuiz = (studentId, completedQuiz) => {
  if (!completedQuiz || !completedQuiz._id) return;
  try {
    const all = JSON.parse(localStorage.getItem("edusphere_completed_quizzes") || "{}");
    const existing = Array.isArray(all[studentId]) ? all[studentId] : [];
    const updated = [
      completedQuiz,
      ...existing.filter((q) => String(q._id) !== String(completedQuiz._id)),
    ];
    all[studentId] = updated;
    localStorage.setItem("edusphere_completed_quizzes", JSON.stringify(all));
  } catch (e) {}
};

const removeLocalCompletedQuiz = (studentId, quizId) => {
  try {
    markIdAsDeletedLocally(quizId);
    const all = JSON.parse(localStorage.getItem("edusphere_completed_quizzes") || "{}");
    if (Array.isArray(all[studentId])) {
      all[studentId] = all[studentId].filter((q) => String(q._id) !== String(quizId));
      localStorage.setItem("edusphere_completed_quizzes", JSON.stringify(all));
    }
  } catch (e) {}
};

const getLocalNotebooks = (studentId) => {
  try {
    const deletedSet = getDeletedIdsSet();
    const all = JSON.parse(localStorage.getItem("edusphere_3d_notebooks") || "{}");
    const list = Array.isArray(all[studentId]) ? all[studentId] : [];
    return list.filter((n) => !deletedSet.has(String(n._id)));
  } catch (e) {
    return [];
  }
};

const saveLocalNotebooks = (studentId, notesList) => {
  try {
    const deletedSet = getDeletedIdsSet();
    const all = JSON.parse(localStorage.getItem("edusphere_3d_notebooks") || "{}");
    all[studentId] = (notesList || []).filter((n) => !deletedSet.has(String(n._id)));
    localStorage.setItem("edusphere_3d_notebooks", JSON.stringify(all));
  } catch (e) {}
};

// ============================================================================
// FRONTEND PDF.JS TEXT EXTRACTOR
// ============================================================================
const extractRealTextFromPdfFile = async (file) => {
  if (!file || file.type !== "application/pdf") return "";
  try {
    if (!window.pdfjsLib) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    const maxPages = Math.min(pdf.numPages, 20);

    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      fullText += strings.join(" ") + "\n";
    }
    return fullText.replace(/\s+/g, " ").trim().slice(0, 18000);
  } catch (err) {
    return "";
  }
};

const matchSpokenTextToOptionIndex = (spokenRaw = "", options = []) => {
  const clean = String(spokenRaw || "").toLowerCase().trim();
  if (!clean) return null;

  if (/\b(option a|choice a|answer a|first option)\b|^a$/i.test(clean)) return 0;
  if (/\b(option b|choice b|answer b|second option)\b|^b$/i.test(clean)) return 1;
  if (/\b(option c|choice c|answer c|third option)\b|^c$/i.test(clean)) return 2;
  if (/\b(option d|choice d|answer d|fourth option|last option)\b|^d$/i.test(clean)) return 3;

  let bestIdx = null;
  let bestScore = 0;

  options.forEach((optText, oIdx) => {
    const normOpt = String(optText || "").toLowerCase().trim();
    if (!normOpt) return;
    if (clean.includes(normOpt) || normOpt.includes(clean)) {
      bestIdx = oIdx;
      bestScore = 100;
      return;
    }
    const words = normOpt.split(/[^a-z0-9]+/).filter((w) => w.length >= 3);
    if (words.length === 0) return;
    let hits = 0;
    words.forEach((w) => {
      if (clean.includes(w)) hits += 1;
    });
    const score = hits / words.length;
    if (score > bestScore && score >= 0.34) {
      bestScore = score;
      bestIdx = oIdx;
    }
  });

  return bestIdx;
};

const renderChatTierBadge = (tierName = "Bronze", isFacultyFlag = false) => {
  const t = String(tierName || "Bronze").toLowerCase();
  if (isFacultyFlag || t === "faculty") {
    return (
      <span
        className="tier-badge faculty-official"
        style={{ fontSize: "10px", padding: "2px 8px" }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm-7 9.18V16l7 3.82L19 16v-4.82l-7 3.18-7-3.18z" />
        </svg>
        FACULTY
      </span>
    );
  }
  if (t === "diamond") {
    return (
      <span className="tier-badge diamond" style={{ fontSize: "10px", padding: "2px 7px" }}>
        Diamond
      </span>
    );
  }
  if (t === "platinum") {
    return (
      <span className="tier-badge platinum" style={{ fontSize: "10px", padding: "2px 7px" }}>
        Platinum
      </span>
    );
  }
  if (t === "gold") {
    return (
      <span className="tier-badge gold" style={{ fontSize: "10px", padding: "2px 7px" }}>
        Gold
      </span>
    );
  }
  if (t === "silver") {
    return (
      <span className="tier-badge silver" style={{ fontSize: "10px", padding: "2px 7px" }}>
        Silver
      </span>
    );
  }
  return (
    <span className="tier-badge bronze" style={{ fontSize: "10px", padding: "2px 7px" }}>
      Bronze
    </span>
  );
};

// ============================================================================
// GUARANTEED HD EDUCATIONAL DIAGRAM GENERATOR
// ============================================================================
function SmartEducationalImageCard({ imageUrl, topicTitle, explanationText }) {
  const [imgStatus, setImgStatus] = useState("loading");
  const [fallbackDataUrl, setFallbackDataUrl] = useState("");

  const cleanSubject =
    String(topicTitle || "Educational Diagram")
      .replace(/_Diagram\.png$/i, "")
      .replace(/_/g, " ")
      .trim() || "Academic Architecture Diagram";

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 620;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 1024, 620);
    grad.addColorStop(0, "#0b0f19");
    grad.addColorStop(1, "#161d2f");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 620);

    ctx.strokeStyle = "rgba(99, 102, 241, 0.12)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 620);
      ctx.stroke();
    }
    for (let y = 0; y < 620; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(99, 102, 241, 0.2)";
    ctx.fillRect(40, 32, 944, 76);
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 32, 944, 76);

    ctx.fillStyle = "#a5b4fc";
    ctx.font = "bold 14px Inter, Arial, sans-serif";
    ctx.fillText("EDUSPHERE AI VISUAL ARCHITECTURE DIAGRAM", 64, 58);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Inter, Arial, sans-serif";
    ctx.fillText(cleanSubject.toUpperCase().slice(0, 52), 64, 90);

    const bullets = String(explanationText || "")
      .split("\n")
      .map((l) => l.replace(/^[*•\-0-9.#]+\s*/, "").replace(/\*\*/g, "").trim())
      .filter((l) => l.length > 12 && l.length < 95)
      .slice(0, 4);

    const nodes =
      bullets.length >= 4
        ? bullets
        : [
            `1. Core Input & Specification of ${cleanSubject}`,
            `2. Internal Architecture & Processing Engine`,
            `3. Applied Execution & Validation Layer`,
            `4. Final Output & Optimization Metrics`,
          ];

    const boxCoords = [
      { x: 60, y: 160, color: "#6366f1", title: "STAGE 01 • FOUNDATION" },
      { x: 544, y: 160, color: "#10b981", title: "STAGE 02 • MECHANISM" },
      { x: 60, y: 370, color: "#f59e0b", title: "STAGE 03 • IMPLEMENTATION" },
      { x: 544, y: 370, color: "#ec4899", title: "STAGE 04 • VERIFICATION" },
    ];

    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(480, 235);
    ctx.lineTo(544, 235);
    ctx.moveTo(754, 310);
    ctx.lineTo(754, 370);
    ctx.moveTo(544, 445);
    ctx.lineTo(480, 445);
    ctx.stroke();

    boxCoords.forEach((b, idx) => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
      ctx.fillRect(b.x, b.y, 420, 150);
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(b.x, b.y, 420, 150);

      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, 420, 34);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Inter, Arial, sans-serif";
      ctx.fillText(b.title, b.x + 16, b.y + 22);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "600 15px Inter, Arial, sans-serif";
      const text = nodes[idx] || cleanSubject;
      const words = text.split(" ");
      let line = "";
      let yPos = b.y + 68;
      for (const w of words) {
        if ((line + w).length > 42) {
          ctx.fillText(line, b.x + 18, yPos);
          line = w + " ";
          yPos += 24;
        } else {
          line += w + " ";
        }
      }
      if (line) ctx.fillText(line, b.x + 18, yPos);
    });

    ctx.fillStyle = "#64748b";
    ctx.font = "12px Inter, Arial, sans-serif";
    ctx.fillText(
      "Generated by EduSphere Neural Visual Studio • High-Resolution Educational Diagram",
      60,
      580
    );

    setFallbackDataUrl(canvas.toDataURL("image/png"));
  }, [cleanSubject, explanationText]);

  useEffect(() => {
    setImgStatus("loading");
    const timer = setTimeout(() => {
      setImgStatus((prev) => (prev === "loading" ? "fallback" : prev));
    }, 7000);
    return () => clearTimeout(timer);
  }, [imageUrl]);

  const handleDownloadVisual = () => {
    const link = document.createElement("a");
    link.download = `${cleanSubject.replace(/\s+/g, "_")}_Diagram.png`;
    link.href = fallbackDataUrl || imageUrl;
    link.target = "_blank";
    link.click();
  };

  return (
    <div
      style={{
        marginTop: "14px",
        padding: "14px",
        background: "#090b10",
        border: "1px solid rgba(99, 102, 241, 0.4)",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#a5b4fc",
          fontWeight: 700,
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span>🎨 AI Educational Visual: {cleanSubject}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() =>
              setImgStatus((s) => (s === "fallback" ? "loaded" : "fallback"))
            }
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#cbd5e1",
              borderRadius: "6px",
              padding: "4px 9px",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            {imgStatus === "fallback" ? "🖼️ Try AI Photo View" : "📐 Switch to Flowchart View"}
          </button>
          <button
            type="button"
            onClick={handleDownloadVisual}
            style={{
              background: "rgba(16, 185, 129, 0.16)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#34d399",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            📥 Download Image
          </button>
        </div>
      </div>

      {imgStatus === "loading" && (
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "12.5px",
          }}
        >
          ⚡ Rendering high-resolution educational visual...
        </div>
      )}

      {imgStatus !== "fallback" && imageUrl && (
        <img
          src={imageUrl}
          alt={cleanSubject}
          onLoad={() => setImgStatus("loaded")}
          onError={() => setImgStatus("fallback")}
          style={{
            width: "100%",
            maxHeight: "420px",
            objectFit: "contain",
            borderRadius: "8px",
            display: imgStatus === "loaded" ? "block" : "none",
            background: "#0f172a",
          }}
        />
      )}

      {(imgStatus === "fallback" || imgStatus === "loading") && fallbackDataUrl && (
        <img
          src={fallbackDataUrl}
          alt={cleanSubject}
          style={{
            width: "100%",
            maxHeight: "420px",
            objectFit: "contain",
            borderRadius: "8px",
            display: "block",
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// UPGRADED PRO RULED REGISTER PAGE (PLUS CURSOR, SHIFT STRAIGHT LINES & SHAPES)
// ============================================================================
function RuledBookPage({
  side = "left",
  pageData,
  bookTitle,
  bookSubject,
  createdDateStr,
  inputMode, // 'write' | 'pen' | 'line' | 'rect' | 'circle' | 'arrow' | 'erase'
  inkColor,
  penColor,
  penSize,
  fontFamily,
  onTextChange,
  onDrawingChange,
}) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef(null);
  const historyStackRef = useRef([]);

  // Sync saved drawing onto canvas & handle high-resolution sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const targetW = Math.max(540, Math.floor(rect.width));
    const targetH = Math.max(580, Math.floor(rect.height));

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pageData?.drawing) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = pageData.drawing;
    }
  }, [pageData?.pageNumber, pageData?.drawing]);

  const getPointerCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / (rect.width || 1)),
      y: (clientY - rect.top) * (canvas.height / (rect.height || 1)),
    };
  };

  const drawGeometricShape = (ctx, toolType, x1, y1, x2, y2) => {
    ctx.beginPath();
    if (toolType === "line") {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    } else if (toolType === "rect") {
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    } else if (toolType === "circle") {
      const rx = Math.abs(x2 - x1) / 2;
      const ry = Math.abs(y2 - y1) / 2;
      const cx = Math.min(x1, x2) + rx;
      const cy = Math.min(y1, y2) + ry;
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (toolType === "arrow") {
      const headLen = Math.max(12, (Number(penSize) || 3) * 4);
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(
        x2 - headLen * Math.cos(angle - Math.PI / 6),
        y2 - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - headLen * Math.cos(angle + Math.PI / 6),
        y2 - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }
  };

  const startStroke = (e) => {
    if (inputMode === "write") return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pos = getPointerCoords(e);

    // Save undo snapshot before stroke
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyStackRef.current = [...historyStackRef.current.slice(-14), snap];
      snapshotRef.current = snap;
    } catch (err) {}

    // If user Shift+Clicks in Pen mode and we already have a previous point, snap a straight line immediately!
    if (inputMode === "pen" && e.shiftKey && lastPosRef.current.hasPoint) {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = penColor || "#1e3a8a";
      ctx.lineWidth = Number(penSize) || 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastPosRef.current = { x: pos.x, y: pos.y, hasPoint: true };
      if (onDrawingChange) onDrawingChange(canvas.toDataURL("image/png"));
      return;
    }

    isDrawingRef.current = true;
    startPosRef.current = pos;
    lastPosRef.current = { x: pos.x, y: pos.y, hasPoint: true };
  };

  const moveStroke = (e) => {
    if (!isDrawingRef.current || inputMode === "write") return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pos = getPointerCoords(e);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (inputMode === "erase") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 26;
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastPosRef.current = { x: pos.x, y: pos.y, hasPoint: true };
      return;
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = penColor || "#1e3a8a";
    ctx.lineWidth = Number(penSize) || 3;

    // Shape tools OR holding Shift while dragging in Pen mode -> Live Straight Line / Shape Preview!
    const isShapeOrShiftLine =
      ["line", "rect", "circle", "arrow"].includes(inputMode) ||
      (inputMode === "pen" && e.shiftKey);

    if (isShapeOrShiftLine && snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
      const effectiveTool = inputMode === "pen" && e.shiftKey ? "line" : inputMode;
      drawGeometricShape(
        ctx,
        effectiveTool,
        startPosRef.current.x,
        startPosRef.current.y,
        pos.x,
        pos.y
      );
      lastPosRef.current = { x: pos.x, y: pos.y, hasPoint: true };
      return;
    }

    // Smooth freehand pen stroke
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPosRef.current = { x: pos.x, y: pos.y, hasPoint: true };
  };

  const endStroke = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas && onDrawingChange) {
      onDrawingChange(canvas.toDataURL("image/png"));
    }
  };

  const handleUndoStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyStackRef.current.length === 0) return;
    const ctx = canvas.getContext("2d");
    const previousState = historyStackRef.current.pop();
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
      if (onDrawingChange) onDrawingChange(canvas.toDataURL("image/png"));
    }
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    historyStackRef.current = [];
    if (onDrawingChange) onDrawingChange("");
  };

  return (
    <div className={`book-page-sheet ${side === "left" ? "left-page" : "right-page"}`}>
      <div className="book-margin-line" />

      <div className="book-page-header">
        <div>
          <div className="book-page-meta">
            {bookSubject} • {bookTitle}
          </div>
          <div style={{ fontSize: "10.5px", color: "#64748b", fontFamily: "Inter, sans-serif" }}>
            Date: {createdDateStr} {inputMode !== "write" ? " • Hold SHIFT for Straight Line" : ""}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {inputMode !== "write" && (
            <button
              type="button"
              onClick={handleUndoStroke}
              style={{
                background: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                color: "#4f46e5",
                borderRadius: "5px",
                padding: "2px 8px",
                fontSize: "10.5px",
                fontWeight: 700,
                cursor: "pointer",
              }}
              title="Undo Last Stroke"
            >
              ↶ Undo
            </button>
          )}
          {pageData?.drawing && (
            <button
              type="button"
              onClick={handleClearCanvas}
              style={{
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                color: "#dc2626",
                borderRadius: "5px",
                padding: "2px 8px",
                fontSize: "10.5px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Clear Ink
            </button>
          )}
          <span className="book-page-number-pill">Page {pageData?.pageNumber || 1}</span>
        </div>
      </div>

      <div className="book-page-body">
        <textarea
          className="book-handwriting-textarea"
          style={{
            fontFamily: fontFamily || "'Caveat', cursive",
            color: inkColor || "#1e3a8a",
          }}
          value={pageData?.text || ""}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={`Write your ${bookSubject} notes here on Page ${
            pageData?.pageNumber || 1
          } (or select + Pen / Shapes above to draw diagrams)...`}
        />

        <canvas
          ref={canvasRef}
          className="book-drawing-canvas"
          style={{
            pointerEvents: inputMode === "write" ? "none" : "auto",
            cursor: inputMode === "write" ? "text" : "crosshair",
          }}
          onMouseDown={startStroke}
          onMouseMove={moveStroke}
          onMouseUp={endStroke}
          onMouseLeave={endStroke}
          onTouchStart={startStroke}
          onTouchMove={moveStroke}
          onTouchEnd={endStroke}
        />
      </div>
    </div>
  );
}

function FormattedAiMessage({ text }) {
  if (!text) return null;
  const parts = String(text).split(/(```[\s\S]*?```)/g);

  const formatInline = (line) => {
    const tokens = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return tokens.map((tok, i) => {
      if (tok.startsWith("`") && tok.endsWith("`")) {
        return (
          <code
            key={i}
            style={{
              background: "rgba(99, 102, 241, 0.16)",
              color: "#a5b4fc",
              padding: "2px 6px",
              borderRadius: "5px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12.5px",
            }}
          >
            {tok.slice(1, -1)}
          </code>
        );
      }
      if (tok.startsWith("**") && tok.endsWith("**")) {
        return (
          <strong key={i} style={{ color: "#ffffff", fontWeight: 700 }}>
            {tok.slice(2, -2)}
          </strong>
        );
      }
      return tok;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          const firstLine = lines[0]?.trim() || "";
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const codeContent = hasLang ? lines.slice(1).join("\n") : lines.join("\n");

          return (
            <div
              key={index}
              style={{
                background: "#090b10",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: "10px",
                overflow: "hidden",
                margin: "6px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 12px",
                  background: "rgba(99, 102, 241, 0.12)",
                  fontSize: "11px",
                  color: "#a5b4fc",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                <span>{hasLang ? firstLine : "Code / Formula"}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(codeContent)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#cbd5e1",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  Copy
                </button>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: "12px 14px",
                  overflowX: "auto",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12.5px",
                  color: "#e2e8f0",
                  lineHeight: 1.55,
                }}
              >
                {codeContent}
              </pre>
            </div>
          );
        }

        const lines = part.split("\n");
        return (
          <div key={index} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {lines.map((rawLine, lIdx) => {
              const line = rawLine.trim();
              if (!line) return <div key={lIdx} style={{ height: "4px" }} />;

              if (line.startsWith("### ")) {
                return (
                  <h4
                    key={lIdx}
                    style={{
                      margin: "10px 0 2px 0",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#a5b4fc",
                    }}
                  >
                    {formatInline(line.replace(/^###\s+/, ""))}
                  </h4>
                );
              }

              if (line.startsWith("## ") || line.startsWith("# ")) {
                return (
                  <h3
                    key={lIdx}
                    style={{
                      margin: "10px 0 4px 0",
                      fontSize: "16.5px",
                      fontWeight: 700,
                      color: "#ffffff",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      paddingBottom: "6px",
                    }}
                  >
                    {formatInline(line.replace(/^#+\s+/, ""))}
                  </h3>
                );
              }

              if (
                /^(Formula|Given|Calculation|Final Answer|Answer|Result|Equation|Step \d+):/i.test(
                  line.replace(/\*\*/g, "")
                )
              ) {
                return (
                  <div
                    key={lIdx}
                    style={{
                      padding: "8px 12px",
                      background: "rgba(99, 102, 241, 0.1)",
                      borderLeft: "3px solid #6366f1",
                      borderRadius: "6px",
                      fontSize: "13.5px",
                    }}
                  >
                    {formatInline(line)}
                  </div>
                );
              }

              if (line.startsWith("- ") || line.startsWith("* ")) {
                return (
                  <div
                    key={lIdx}
                    style={{
                      display: "flex",
                      gap: "8px",
                      paddingLeft: "6px",
                      fontSize: "13.5px",
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{ color: "#818cf8", fontWeight: 700 }}>•</span>
                    <span style={{ flex: 1 }}>{formatInline(line.slice(2))}</span>
                  </div>
                );
              }

              return (
                <div key={lIdx} style={{ fontSize: "13.5px", lineHeight: 1.65 }}>
                  {formatInline(line)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
// ============================================================================
// PART 2 OF 4 — AiAgentWidget.jsx (States, 3D Register States, Voice/Oral Engine, PDF Engine & Classroom Handlers)
// ============================================================================
function AiAgentWidget({
  studentId,
  studentName = "Scholar",
  studentPhone = "",
  studentEmail = "",
  studentAvatar = "",
  externalTab,
  onSelectTab,
  onCountsChange,
  onSyncHeaderData,
}) {
  const [internalTab, setInternalTab] = useState("tutor");
  const activeTab = externalTab || internalTab;

  const setActiveTab = (tab) => {
    setInternalTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  // Auto-inject 3D Register Studio & 3D Messenger CSS
  useEffect(() => {
    const styleId = "edusphere-3d-chat-upgrade-css";
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = CHAT_3D_UPGRADE_CSS;
  }, []);

  const resolvedStudentId = studentId || "default_student";

  const [stats, setStats] = useState({ totalXp: 0, level: 1, avgQuizPercentage: 0 });
  const [quizzes, setQuizzes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState(() => getLocalNotebooks(resolvedStudentId));
  const [messages, setMessages] = useState([]);
  const [bannerMsg, setBannerMsg] = useState({ type: "", text: "" });

  // ==========================================================================
  // STUDENT GOOGLE CLASSROOM ASSIGNMENTS STATES (WITH LIVE FILE PREVIEW)
  // ==========================================================================
  const [classroomAssignments, setClassroomAssignments] = useState([]);
  const [asgnAnswerInputs, setAsgnAnswerInputs] = useState({});
  const [asgnSelectedFiles, setAsgnSelectedFiles] = useState({});
  const [asgnPreviewUrls, setAsgnPreviewUrls] = useState({});
  const [asgnSubmittingId, setAsgnSubmittingId] = useState(null);
  const [asgnCommentInputs, setAsgnCommentInputs] = useState({});
  const [expandedAsgnId, setExpandedAsgnId] = useState(null);

  const handleSelectStudentAssignmentFile = (assignmentId, file) => {
    setAsgnSelectedFiles((prev) => ({ ...prev, [assignmentId]: file || null }));
    setAsgnPreviewUrls((prev) => {
      if (prev[assignmentId]) URL.revokeObjectURL(prev[assignmentId]);
      return {
        ...prev,
        [assignmentId]: file ? URL.createObjectURL(file) : "",
      };
    });
  };

  // Custom Luxury Delete Modal Popup State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: "",
    id: null,
    title: "",
    subtitle: "",
    loading: false,
  });

  const [nowTime, setNowTime] = useState(Date.now());

  // ==========================================================================
  // SMART 3D REGISTER / BOOK ("KITAAB") STUDIO STATES
  // ==========================================================================
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteSubject, setNewNoteSubject] = useState("");
  const [noteCreating, setNoteCreating] = useState(false);
  const [editingNoteMeta, setEditingNoteMeta] = useState(null);

  const [activeBook, setActiveBook] = useState(null);
  const [bookClosingAnim, setBookClosingAnim] = useState(false);
  const [bookSpreadIndex, setBookSpreadIndex] = useState(0);
  const [pageTurnAnim, setPageTurnAnim] = useState("");
  // Modes: 'write' | 'pen' | 'line' | 'rect' | 'circle' | 'arrow' | 'erase'
  const [bookInputMode, setBookInputMode] = useState("write");
  const [bookInkColor, setBookInkColor] = useState("#1e3a8a");
  const [bookPenColor, setBookPenColor] = useState("#dc2626");
  const [bookPenSize, setBookPenSize] = useState(3);
  const [bookFontFamily, setBookFontFamily] = useState("'Caveat', cursive");
  const [bookSaving, setBookSaving] = useState(false);

  // AI Tutor States
  const [chatInput, setChatInput] = useState("");
  const [chatFile, setChatFile] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Voice Speech Recognition & Synthesis States (Bilingual: Urdu/Roman Urdu & English)
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoVoiceReply, setAutoVoiceReply] = useState(true);
  const [voiceLang, setVoiceLang] = useState("en-US");
  const recognitionRef = useRef(null);

  // Quiz States (20 Questions)
  const [quizTopic, setQuizTopic] = useState("");
  const [quizFile, setQuizFile] = useState(null);
  const [quizDifficulty, setQuizDifficulty] = useState("Medium");
  const [quizScheduleTime, setQuizScheduleTime] = useState("");
  const [quizDurationMins, setQuizDurationMins] = useState(20);
  const [quizGenLoading, setQuizGenLoading] = useState(false);

  // AI Oral Test States (10 Spoken Questions • Automated Voice Examiner)
  const [oralTopic, setOralTopic] = useState("");
  const [oralFile, setOralFile] = useState(null);
  const [oralDifficulty, setOralDifficulty] = useState("Medium");
  const [oralScheduleTime, setOralScheduleTime] = useState("");
  const [oralDurationMins, setOralDurationMins] = useState(15);
  const [oralVoiceGender, setOralVoiceGender] = useState("female");
  const [oralGenLoading, setOralGenLoading] = useState(false);
  const [spokenAnswers, setSpokenAnswers] = useState({});
  const spokenAnswersRef = useRef({});

  // Automated Hands-Free Oral Flow States
  const [oralStage, setOralStage] = useState("reading");
  const [oralRevealStep, setOralRevealStep] = useState(0);
  const [liveOralTranscript, setLiveOralTranscript] = useState("");
  const oralFlowTimersRef = useRef([]);
  const oralAutoHandledRef = useRef(false);

  // Proctored Active Exam Runner States
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [examSeconds, setExamSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(20 * 60);
  const [cheatStrikes, setCheatStrikes] = useState(0);
  const [proctorWarning, setProctorWarning] = useState("");
  const [unansweredWarning, setUnansweredWarning] = useState(false);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // ==========================================================================
  // UPGRADED 3D MESSENGER, POLLS, FACULTY DIRECT & COMMUNITY INVITE STATES
  // ==========================================================================
  const [socialSubTab, setSocialSubTab] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [socialOverview, setSocialOverview] = useState({
    myProfile: null,
    isCallerFaculty: false,
    facultyContacts: [],
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
    directory: [],
    communities: [],
  });
  const [activeFriend, setActiveFriend] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [dmInputText, setDmInputText] = useState("");
  const [dmFile, setDmFile] = useState(null);
  const [dmFilePreviewUrl, setDmFilePreviewUrl] = useState("");
  const [dmLoading, setDmLoading] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editingMsgText, setEditingMsgText] = useState("");

  // "+" Action Menu, Live Poll Modal & Community Invite Modal States
  const [showChatPlusMenu, setShowChatPlusMenu] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", "", ""]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Live Pre-Send Video / Image / PDF Preview inside Chat Composer
  useEffect(() => {
    if (!dmFile) {
      setDmFilePreviewUrl("");
      return;
    }
    const objUrl = URL.createObjectURL(dmFile);
    setDmFilePreviewUrl(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [dmFile]);

  // Create Community Modal & Form States
  const [showCreateCommModal, setShowCreateCommModal] = useState(false);
  const [newCommName, setNewCommName] = useState("");
  const [newCommSubject, setNewCommSubject] = useState("");
  const [newCommDesc, setNewCommDesc] = useState("");
  const [commCreating, setCommCreating] = useState(false);

  // Share 3D Notebook & Share Exam Result Modals
  const [shareNoteModal, setShareNoteModal] = useState({ isOpen: false, note: null });
  const [shareResultModal, setShareResultModal] = useState({ isOpen: false, quiz: null });
  const directChatEndRef = useRef(null);

  const answersRef = useRef({});
  const examSecondsRef = useRef(0);
  const strikesRef = useRef(0);
  const submittingRef = useRef(false);
  const unlockedNotifiedIdsRef = useRef(new Set());

  // Results & Analytics States
  const [selectedResultQuiz, setSelectedResultQuiz] = useState(null);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(true);
  const [resultFilterMode, setResultFilterMode] = useState("all");
  const breakdownSectionRef = useRef(null);

  // Study Planner States
  const [plannerTopic, setPlannerTopic] = useState("");
  const [plannerFile, setPlannerFile] = useState(null);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Pomodoro Timer States
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState("Focus Session");

  useEffect(() => {
    answersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    spokenAnswersRef.current = spokenAnswers;
  }, [spokenAnswers]);

  useEffect(() => {
    examSecondsRef.current = examSeconds;
  }, [examSeconds]);

  useEffect(() => {
    strikesRef.current = cheatStrikes;
  }, [cheatStrikes]);

  useEffect(() => {
    const clock = setInterval(() => {
      setNowTime(Date.now());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  const clearOralFlowTimers = () => {
    oralFlowTimersRef.current.forEach((t) => clearTimeout(t));
    oralFlowTimersRef.current = [];
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // ==========================================================================
  // SMART VOICE SYNTHESIS
  // ==========================================================================
  const speakText = (
    textToSpeak,
    isRomanUrduFlag = false,
    genderOverride = null,
    onEndCallback = null
  ) => {
    if (!("speechSynthesis" in window)) {
      if (onEndCallback) setTimeout(onEndCallback, 1200);
      return;
    }
    window.speechSynthesis.cancel();

    const cleanSpeech = String(textToSpeak || "")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[*_#`>•|-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanSpeech) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 0.98;

    const voices = window.speechSynthesis.getVoices();
    const targetGender = genderOverride || activeQuiz?.voiceGender || null;

    if (isRomanUrduFlag || (!activeQuiz && voiceLang === "ur-PK")) {
      const hiOrUrVoice = voices.find(
        (v) =>
          v.lang.includes("hi") ||
          v.lang.includes("ur") ||
          v.lang.includes("en-IN")
      );
      if (hiOrUrVoice) utterance.voice = hiOrUrVoice;
      utterance.lang = hiOrUrVoice?.lang || "en-IN";
      utterance.pitch = 1.0;
    } else {
      const enVoices = voices.filter((v) => v.lang.startsWith("en"));
      if (targetGender === "male") {
        const maleVoice =
          enVoices.find((v) =>
            /david|mark|george|james|daniel|guy|male|christopher|eric|ryan/i.test(v.name)
          ) || enVoices[0];
        if (maleVoice) utterance.voice = maleVoice;
        utterance.pitch = 0.88;
      } else if (targetGender === "female") {
        const femaleVoice =
          enVoices.find((v) =>
            /zira|hazel|susan|samantha|victoria|aria|jenny|sara|female|google us english/i.test(
              v.name
            )
          ) || enVoices[0];
        if (femaleVoice) utterance.voice = femaleVoice;
        utterance.pitch = 1.12;
      } else {
        const defaultEn = enVoices[0];
        if (defaultEn) utterance.voice = defaultEn;
        utterance.pitch = 1.0;
      }
      utterance.lang = "en-US";
    }

    let callbackFired = false;
    const fireOnce = () => {
      if (callbackFired) return;
      callbackFired = true;
      setIsSpeaking(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = fireOnce;
    utterance.onerror = fireOnce;

    window.speechSynthesis.speak(utterance);
  };

  // ==========================================================================
  // AUTOMATED HANDS-FREE ORAL TEST ENGINE
  // ==========================================================================
  const handleOralVoiceAnswerCaptured = (finalSpokenText) => {
    if (!activeQuiz || oralAutoHandledRef.current) return;
    const cleanText = String(finalSpokenText || "").trim();
    if (!cleanText) return;

    oralAutoHandledRef.current = true;
    clearOralFlowTimers();

    try {
      if (recognitionRef.current) recognitionRef.current.stop();
    } catch (e) {}
    setIsListening(false);

    const qIdx = currentQIndex;
    const currentQ = activeQuiz.questions?.[qIdx];
    const matchedOpt = matchSpokenTextToOptionIndex(cleanText, currentQ?.options || []);

    const updatedSpoken = { ...spokenAnswersRef.current, [qIdx]: cleanText };
    spokenAnswersRef.current = updatedSpoken;
    setSpokenAnswers(updatedSpoken);
    setLiveOralTranscript(cleanText);

    const updatedSelected = {
      ...answersRef.current,
      [qIdx]: matchedOpt !== null ? matchedOpt : -1,
    };
    answersRef.current = updatedSelected;
    setSelectedAnswers(updatedSelected);

    setOralStage("confirming");
    const totalQ = activeQuiz.questions?.length || 10;
    const gender = activeQuiz.voiceGender || "female";

    if (qIdx < totalQ - 1) {
      speakText(
        "Okay, answer recorded. Next question.",
        false,
        gender,
        () => {
          const t = setTimeout(() => {
            setCurrentQIndex((prev) => Math.min(totalQ - 1, prev + 1));
          }, 350);
          oralFlowTimersRef.current.push(t);
        }
      );
    } else {
      speakText(
        "Okay, answer recorded. Your oral examination is complete. Submitting your results now.",
        false,
        gender,
        () => {
          const t = setTimeout(() => {
            executeQuizSubmission("Oral Examination Completed");
          }, 400);
          oralFlowTimersRef.current.push(t);
        }
      );
    }
  };

  const startOralAutoMicListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setOralStage("idle");
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      let latestTranscript = "";
      let silenceTimer = null;

      recognition.onstart = () => {
        setIsListening(true);
        setOralStage("listening");
      };

      recognition.onresult = (event) => {
        let interimOrFinal = "";
        let hasFinal = false;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          interimOrFinal += event.results[i][0].transcript;
          if (event.results[i].isFinal) hasFinal = true;
        }
        latestTranscript = interimOrFinal.trim();
        setLiveOralTranscript(latestTranscript);

        if (silenceTimer) clearTimeout(silenceTimer);
        if (hasFinal && latestTranscript.length >= 1) {
          silenceTimer = setTimeout(() => {
            handleOralVoiceAnswerCaptured(latestTranscript);
          }, 650);
        } else if (latestTranscript.length >= 2) {
          silenceTimer = setTimeout(() => {
            handleOralVoiceAnswerCaptured(latestTranscript);
          }, 1600);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        if (!oralAutoHandledRef.current) setOralStage("idle");
      };

      recognition.onend = () => {
        setIsListening(false);
        if (latestTranscript && !oralAutoHandledRef.current) {
          handleOralVoiceAnswerCaptured(latestTranscript);
        } else if (!oralAutoHandledRef.current) {
          setOralStage("idle");
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
      setOralStage("idle");
    }
  };

  const runAutomatedOralQuestionFlow = (qIndex = currentQIndex) => {
    if (!activeQuiz) return;
    const isOral =
      activeQuiz.examType === "oral" ||
      Boolean(activeQuiz.title?.toLowerCase().includes("oral"));
    if (!isOral) return;

    const q = activeQuiz.questions?.[qIndex];
    if (!q) return;

    clearOralFlowTimers();
    try {
      if (recognitionRef.current) recognitionRef.current.stop();
    } catch (e) {}
    setIsListening(false);

    oralAutoHandledRef.current = false;
    setLiveOralTranscript(spokenAnswersRef.current[qIndex] || "");
    setOralStage("reading");
    setOralRevealStep(0);

    const t1 = setTimeout(() => setOralRevealStep(1), 2200);
    const t2 = setTimeout(() => setOralRevealStep(2), 3800);
    const t3 = setTimeout(() => setOralRevealStep(3), 5400);
    const t4 = setTimeout(() => setOralRevealStep(4), 7000);
    oralFlowTimersRef.current.push(t1, t2, t3, t4);

    const scriptToRead = `Question ${qIndex + 1}. ${q.questionText}. Option A: ${
      q.options?.[0] || ""
    }. Option B: ${q.options?.[1] || ""
    }. Option C: ${q.options?.[2] || ""
    }. Option D: ${q.options?.[3] || ""}. Please speak your answer now.`;

    speakText(scriptToRead, false, activeQuiz.voiceGender || "female", () => {
      setOralRevealStep(4);
      const tMic = setTimeout(() => {
        if (!oralAutoHandledRef.current) {
          startOralAutoMicListening();
        }
      }, 300);
      oralFlowTimersRef.current.push(tMic);
    });
  };

  useEffect(() => {
    if (!activeQuiz) {
      clearOralFlowTimers();
      return;
    }
    const isOral =
      activeQuiz.examType === "oral" ||
      Boolean(activeQuiz.title?.toLowerCase().includes("oral"));
    if (isOral) {
      const startTimer = setTimeout(() => {
        runAutomatedOralQuestionFlow(currentQIndex);
      }, 400);
      return () => {
        clearTimeout(startTimer);
        clearOralFlowTimers();
      };
    }
  }, [activeQuiz?._id, currentQIndex]);

  useEffect(() => {
    if (activeQuiz) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = voiceLang;

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setChatInput(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [voiceLang, activeQuiz]);

  const toggleMicrophoneListening = () => {
    if (activeQuiz) {
      if (isListening) {
        try {
          recognitionRef.current?.stop();
        } catch (e) {}
        setIsListening(false);
      } else {
        stopSpeaking();
        setOralRevealStep(4);
        startOralAutoMicListening();
      }
      return;
    }

    if (!recognitionRef.current) {
      setBannerMsg({
        type: "error",
        text: "Voice recognition requires Google Chrome or Microsoft Edge.",
      });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        stopSpeaking();
        recognitionRef.current.lang = voiceLang;
        recognitionRef.current.start();
        setIsListening(true);
        setBannerMsg({
          type: "info",
          text:
            voiceLang === "ur-PK"
              ? "🎙️ Mic Active (Urdu / Roman Urdu): Ab bolein, AI aapko Roman Urdu me jawab dega..."
              : "🎙️ Mic Active (English): Speak your question now...",
        });
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // ==========================================================================
  // BULLETPROOF VECTOR PDF ENGINE (jsPDF)
  // ==========================================================================
  const loadJsPdfLibrary = async () => {
    if (window.jspdf && window.jspdf.jsPDF) {
      return window.jspdf.jsPDF;
    }
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
    return window.jspdf.jsPDF;
  };

  const generateVectorPdfDocument = async ({
    docTitle = "EduSphere Academic Document",
    subtitle = "",
    sections = [],
    fileName = "Document.pdf",
  }) => {
    try {
      const jsPDF = await loadJsPdfLibrary();
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 42;
      const contentWidth = pageWidth - margin * 2;
      let cursorY = 48;

      const drawHeaderBanner = () => {
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageWidth, 82, "F");
        doc.setFillColor(99, 102, 241);
        doc.rect(0, 78, pageWidth, 4, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor(255, 255, 255);
        doc.text(String(docTitle).slice(0, 65), margin, 36);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(165, 180, 252);
        doc.text(
          subtitle ||
            `Prepared for: ${studentName}  |  Date: ${new Date().toLocaleDateString()}  |  EduSphere AI Academic Suite`,
          margin,
          56
        );
        cursorY = 108;
      };

      const checkPageBreak = (neededHeight = 24) => {
        if (cursorY + neededHeight > pageHeight - 45) {
          doc.addPage();
          cursorY = 50;
        }
      };

      drawHeaderBanner();

      sections.forEach((sec) => {
        if (sec.heading) {
          checkPageBreak(36);
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(margin, cursorY - 13, contentWidth, 24, 4, 4, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11.5);
          doc.setTextColor(30, 41, 59);
          doc.text(String(sec.heading).slice(0, 85), margin + 8, cursorY + 3);
          cursorY += 22;
        }

        if (sec.body) {
          const rawLines = String(sec.body)
            .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "")
            .split("\n");

          rawLines.forEach((rawLine) => {
            const line = rawLine.trim();
            if (!line) {
              cursorY += 6;
              return;
            }

            const isHeading = line.startsWith("## ") || line.startsWith("### ");
            const cleanLine = line
              .replace(/^#+\s*/, "")
              .replace(/\*\*(.*?)\*\*/g, "$1")
              .replace(/`([^`]+)`/g, "$1");

            doc.setFont("helvetica", isHeading ? "bold" : "normal");
            doc.setFontSize(isHeading ? 11.5 : 10);
            doc.setTextColor(isHeading ? 79 : 30, isHeading ? 70 : 41, isHeading ? 229 : 59);

            const wrapped = doc.splitTextToSize(cleanLine, contentWidth - 8);
            wrapped.forEach((wLine) => {
              checkPageBreak(16);
              doc.text(wLine, margin + 4, cursorY);
              cursorY += 15;
            });
            cursorY += 3;
          });
        }

        if (sec.imageDataUrl) {
          checkPageBreak(220);
          try {
            doc.addImage(
              sec.imageDataUrl,
              "PNG",
              margin,
              cursorY,
              contentWidth,
              200
            );
            cursorY += 214;
          } catch (e) {}
        }

        cursorY += 8;
      });

      const totalPages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `EduSphere Official Academic Document  •  Page ${p} of ${totalPages}`,
          margin,
          pageHeight - 20
        );
      }

      const safeName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
      doc.save(safeName);
    } catch (err) {
      console.error("PDF Export Error:", err);
      setBannerMsg({ type: "error", text: "Unable to export PDF file." });
    }
  };

  const handleDownloadChatNotePdf = (text, customTitle = "AI_Tutor_Study_Notes.pdf") => {
    const cleanText = String(text || "Academic Study Notes").trim();
    generateVectorPdfDocument({
      docTitle: customTitle.replace(/\.pdf$/i, "").replace(/_/g, " "),
      subtitle: `Prepared for: ${studentName}  |  AI Personal Tutor Study Notes`,
      sections: [{ heading: "Complete Academic Explanation & Notes", body: cleanText }],
      fileName: customTitle,
    });
  };

  const handleDownloadQuizPaperPdf = (quiz) => {
    const totalQ = quiz.totalQuestions || quiz.questions?.length || 20;
    const sections = (quiz.questions || []).map((q, i) => ({
      heading: `Question ${i + 1} (${q.topicTag || "Core Concept"})`,
      body:
        `${q.questionText}\n\n` +
        (q.options || [])
          .map((o, idx) => `(${String.fromCharCode(65 + idx)}) ${o}`)
          .join("\n"),
    }));
    generateVectorPdfDocument({
      docTitle: quiz.title || "Academic Examination Paper",
      subtitle: `Total Questions: ${totalQ} MCQs  |  Passing Criteria: 60%  |  Difficulty: ${quiz.difficulty}`,
      sections,
      fileName: `${(quiz.title || "Exam").replace(/\s+/g, "_")}_Paper.pdf`,
    });
  };

  const handleDownloadResultPdf = (quiz) => {
    const isPassed = quiz.passed || (quiz.percentage || 0) >= 60;
    const totalQ = quiz.totalQuestions || quiz.questions?.length || 20;
    const sections = (quiz.questions || []).map((q, i) => {
      const selIdx = q.selectedOptionIndex;
      const hasSel =
        selIdx !== null && selIdx !== undefined && selIdx !== "" && Number(selIdx) >= 0;
      const yourAns = hasSel
        ? `(${String.fromCharCode(65 + Number(selIdx))}) ${q.options?.[Number(selIdx)]}`
        : q.spokenAnswerText
        ? `Spoken: "${q.spokenAnswerText}"`
        : "Not Answered";
      const rightAns = `(${String.fromCharCode(65 + Number(q.correctOptionIndex))}) ${
        q.options?.[Number(q.correctOptionIndex)]
      }`;
      const spokenLine = q.spokenAnswerText
        ? `\nSpoken Voice Answer: "${q.spokenAnswerText}"`
        : "";
      return {
        heading: `Q${i + 1}. ${q.isCorrect ? "[CORRECT]" : "[INCORRECT]"}`,
        body: `${q.questionText}\nYour Answer: ${yourAns}${spokenLine}\nCorrect Answer: ${rightAns}\nExplanation: ${
          q.explanation || ""
        }`,
      };
    });

    generateVectorPdfDocument({
      docTitle: `Official Result Report: ${quiz.title}`,
      subtitle: `Score: ${quiz.score}/${totalQ} (${quiz.percentage}%)  |  Grade: ${
        quiz.grade
      }  |  Status: ${isPassed ? "PASSED" : "FAILED"}`,
      sections,
      fileName: `${(quiz.title || "Result").replace(/\s+/g, "_")}_Report.pdf`,
    });
  };

  const handleDownloadAssignmentScorecardPdf = (asgn, mySub) => {
    generateVectorPdfDocument({
      docTitle: `Classwork Assignment Report: ${asgn.title}`,
      subtitle: `Student: ${studentName}  |  Subject: ${asgn.subject}  |  Submission Rank: #${
        mySub.submissionRank || 1
      }`,
      sections: [
        {
          heading: `Official Faculty Evaluation & Score`,
          body: `Total Marks: ${asgn.totalMarks}\nObtained Marks: ${
            mySub.obtainedMarks ?? "Pending"
          } / ${asgn.totalMarks} (${mySub.percentage ?? 0}%)\nGrade: ${
            mySub.grade || "Pending"
          }\nStar Rating: ${mySub.stars || 0} / 5 Stars\nSubmission Speed Rank: #${
            mySub.submissionRank || 1
          }\nFaculty Feedback: ${mySub.feedback || "Awaiting faculty remarks."}`,
        },
        {
          heading: `Assignment Instructions (${asgn.subject})`,
          body: asgn.description || "Complete all assigned problems.",
        },
        {
          heading: `Your Submitted Solution`,
          body:
            mySub.answerText ||
            `Attached File: ${mySub.fileName || "Uploaded Document"}`,
        },
      ],
      fileName: `${asgn.subject}_${asgn.title.replace(/\s+/g, "_")}_Result.pdf`,
    });
  };

  const handleDownloadStudyPlanPdf = () => {
    const sections = tasks.map((t, idx) => ({
      heading: `${idx + 1}. [${t.moduleName || "Study Phase"}] ${t.title} (${t.status})`,
      body: `${t.description}\nEstimated Time: ${t.estimatedMinutes || 45} mins  |  Reward: +${
        t.xpReward || 45
      } XP`,
    }));
    generateVectorPdfDocument({
      docTitle: "Personalized 6-Phase Study Roadmap",
      subtitle: `Scholar: ${studentName}  |  Total Modules: ${tasks.length}`,
      sections,
      fileName: `${studentName}_Study_Roadmap.pdf`,
    });
  };

  const handleDownloadBookPdf = (notebook) => {
    const targetBook = notebook || activeBook;
    if (!targetBook) return;

    const nonEmptyPages = (targetBook.pages || []).filter(
      (p) => (p.text && p.text.trim() !== "") || p.drawing
    );
    const pagesToExport =
      nonEmptyPages.length > 0 ? nonEmptyPages : (targetBook.pages || []).slice(0, 2);

    const sections = pagesToExport.map((p) => ({
      heading: `Notebook Page ${p.pageNumber} — ${targetBook.subject}`,
      body: p.text || "(Handwritten Diagram / Sketch Page)",
      imageDataUrl: p.drawing || null,
    }));

    generateVectorPdfDocument({
      docTitle: `${targetBook.title} (${targetBook.subject})`,
      subtitle: `Author: ${studentName}  |  Created: ${new Date(
        targetBook.createdAt || Date.now()
      ).toLocaleDateString()}`,
      sections,
      fileName: `${targetBook.title.replace(/\s+/g, "_")}_Notebook.pdf`,
    });
  };

  const attachScheduleMetadata = (quizList = []) => {
    const savedMap = getSavedSchedulesMap();
    const deletedSet = getDeletedIdsSet();
    return quizList
      .filter((q) => !deletedSet.has(String(q._id)))
      .map((q) => {
        const backup = savedMap[q._id];
        return {
          ...q,
          scheduledFor: q.scheduledFor || backup?.scheduledFor || null,
          isReattempt:
            Boolean(backup?.isReattempt) ||
            Boolean(q.title?.toLowerCase().includes("re-attempt")) ||
            Boolean(q.sourceFileName?.toLowerCase().includes("re-attempt")),
        };
      });
  };

  const pushLocalAndServerNotification = async (type, title, message) => {
    try {
      const activeToken = localStorage.getItem("token");
      await fetch(`${API_BASE}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId: resolvedStudentId,
          type,
          title,
          message,
        }),
      });
      await fetchAiDashboardData();
    } catch (e) {}
  };

  useEffect(() => {
    quizzes.forEach((q) => {
      if (q.status === "Pending" && q.scheduledFor) {
        const unlockMs = new Date(q.scheduledFor).getTime();
        if (
          nowTime >= unlockMs &&
          nowTime - unlockMs < 15000 &&
          !unlockedNotifiedIdsRef.current.has(q._id)
        ) {
          unlockedNotifiedIdsRef.current.add(q._id);
          setBannerMsg({
            type: "success",
            text: `🔓 Scheduled Exam Unlocked: "${q.title}" is now open for attempt!`,
          });
          pushLocalAndServerNotification(
            "quiz-unlocked",
            "🔓 Scheduled Assessment Unlocked!",
            `"${q.title}" timer has completed and the exam is now unlocked for you.`
          );
        }
      }
    });
  }, [nowTime, quizzes]);

  const fetchAiDashboardData = async () => {
    try {
      const deletedSet = getDeletedIdsSet();
      const activeToken = localStorage.getItem("token");
      const headers = activeToken ? { Authorization: `Bearer ${activeToken}` } : {};

      const queryParams = new URLSearchParams({
        studentId: resolvedStudentId,
        studentName,
        phone: studentPhone || "",
        email: studentEmail || "",
        avatar: studentAvatar || "",
      });

      let res = await fetch(`${API_BASE}/dashboard-data?${queryParams.toString()}`, {
        headers,
      });
      if (res.status === 404) {
        res = await fetch(`${API_BASE}/dashboard?${queryParams.toString()}`, {
          headers,
        });
      }

      const data = await res.json();
      if (data && data.success) {
        setStats(data.stats || { totalXp: 0, level: 1, avgQuizPercentage: 0 });

        if (Array.isArray(data.quizzes)) {
          const serverQuizzes = attachScheduleMetadata(data.quizzes);
          const localCompleted = getLocalCompletedQuizzes(resolvedStudentId);
          const mergedMap = new Map();
          serverQuizzes.forEach((q) => {
            if (!deletedSet.has(String(q._id))) mergedMap.set(String(q._id), q);
          });
          localCompleted.forEach((lq) => {
            if (!deletedSet.has(String(lq._id)) && !mergedMap.has(String(lq._id))) {
              mergedMap.set(String(lq._id), lq);
            }
          });
          setQuizzes(Array.from(mergedMap.values()));
        }

        if (Array.isArray(data.tasks)) {
          setTasks(data.tasks.filter((t) => !deletedSet.has(String(t._id))));
        }

        if (Array.isArray(data.notes) && data.notes.length > 0) {
          const cleanNotes = data.notes.filter((n) => !deletedSet.has(String(n._id)));
          setNotes(cleanNotes);
          saveLocalNotebooks(resolvedStudentId, cleanNotes);
        } else {
          setNotes(getLocalNotebooks(resolvedStudentId));
        }

        if (Array.isArray(data.messages)) setMessages(data.messages);

        if (onSyncHeaderData) {
          onSyncHeaderData({
            leaderboard: data.leaderboard || [],
            notifications: data.notifications || [],
            stats: data.stats || {},
          });
        }
      }
    } catch (err) {
      setNotes(getLocalNotebooks(resolvedStudentId));
      const localCompleted = getLocalCompletedQuizzes(resolvedStudentId);
      if (localCompleted.length > 0) setQuizzes(localCompleted);
    }
  };

  useEffect(() => {
    fetchAiDashboardData();
  }, [resolvedStudentId]);

  const fetchStudentClassroomAssignments = async () => {
    try {
      const activeToken = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        studentId: resolvedStudentId,
        email: studentEmail || "",
        role: "student",
      });
      const res = await fetch(
        `${API_BASE}/classroom/assignments?${queryParams.toString()}`,
        {
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        }
      );
      const data = await res.json();
      if (data && data.success && Array.isArray(data.assignments)) {
        setClassroomAssignments(data.assignments);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchStudentClassroomAssignments();
    const asgnTimer = setInterval(fetchStudentClassroomAssignments, 6500);
    return () => clearInterval(asgnTimer);
  }, [resolvedStudentId, studentEmail]);

  const formatAssignmentCountdown = (dueDateStr) => {
    if (!dueDateStr) return { expired: true, label: "No Deadline" };
    const diff = new Date(dueDateStr).getTime() - nowTime;
    if (diff <= 0) {
      return {
        expired: true,
        label: "🔒 Deadline Expired (Submission Locked)",
      };
    }
    const totalSecs = Math.floor(diff / 1000);
    const d = Math.floor(totalSecs / 86400);
    const h = Math.floor((totalSecs % 86400) / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const str =
      d > 0
        ? `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(
            s
          ).padStart(2, "0")}s`
        : `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(
            s
          ).padStart(2, "0")}s`;
    return { expired: false, label: `⏳ Due Timer: ${str}` };
  };

  const handleSubmitClassroomAssignment = async (e, asgn) => {
    e.preventDefault();
    if (!asgn || !asgn._id) return;

    const timerCheck = formatAssignmentCountdown(asgn.dueDate);
    if (timerCheck.expired) {
      setBannerMsg({
        type: "error",
        text: "🔒 Deadline Expired! You cannot submit this assignment after the due date.",
      });
      return;
    }

    const ansText = (asgnAnswerInputs[asgn._id] || "").trim();
    const attachedFile = asgnSelectedFiles[asgn._id] || null;

    if (!ansText && !attachedFile) {
      setBannerMsg({
        type: "error",
        text: "Please write your solution or attach a Video / Image / PDF file before submitting.",
      });
      return;
    }

    setAsgnSubmittingId(asgn._id);
    setBannerMsg({
      type: "info",
      text: attachedFile
        ? `📤 Uploading "${attachedFile.name}" and submitting your ${asgn.subject} assignment...`
        : `📤 Submitting your ${asgn.subject} assignment...`,
    });

    try {
      let extractedPdfText = "";
      if (attachedFile && attachedFile.type === "application/pdf") {
        extractedPdfText = await extractRealTextFromPdfFile(attachedFile);
      }

      const formData = new FormData();
      formData.append("studentId", resolvedStudentId);
      formData.append("studentName", studentName);
      formData.append("studentEmail", studentEmail || "");
      formData.append("studentPhone", studentPhone || "");
      formData.append("studentAvatar", studentAvatar || "");
      formData.append("answerText", ansText);
      if (extractedPdfText) {
        formData.append("extractedPdfText", extractedPdfText);
      }
      if (attachedFile) {
        formData.append("file", attachedFile);
      }

      const activeToken = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/classroom/assignments/${asgn._id}/submit`,
        {
          method: "POST",
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
          body: formData,
        }
      );
      const data = await res.json();

      if (res.ok && data.success) {
        setBannerMsg({
          type: "success",
          text: data.message,
        });
        handleSelectStudentAssignmentFile(asgn._id, null);
        if (data.assignment) {
          setClassroomAssignments((prev) =>
            prev.map((a) =>
              String(a._id) === String(asgn._id) ? data.assignment : a
            )
          );
        } else {
          await fetchStudentClassroomAssignments();
        }
        await fetchAiDashboardData();
      } else {
        setBannerMsg({
          type: "error",
          text: data.message || "Unable to submit assignment.",
        });
      }
    } catch (err) {
      setBannerMsg({
        type: "error",
        text: "Network error while submitting assignment.",
      });
    } finally {
      setAsgnSubmittingId(null);
    }
  };

  const handlePostStudentAssignmentComment = async (e, assignmentId) => {
    e.preventDefault();
    const text = (asgnCommentInputs[assignmentId] || "").trim();
    if (!text) return;

    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/classroom/assignments/${assignmentId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
          },
          body: JSON.stringify({
            senderId: resolvedStudentId,
            senderName: studentName,
            senderRole: "student",
            studentThreadId: resolvedStudentId,
            text,
          }),
        }
      );
      const data = await res.json();
      if (data.success && data.assignment) {
        setClassroomAssignments((prev) =>
          prev.map((a) =>
            String(a._id) === String(assignmentId) ? data.assignment : a
          )
        );
        setAsgnCommentInputs((prev) => ({ ...prev, [assignmentId]: "" }));
      }
    } catch (e) {}
  };
  // ============================================================================
// PART 3 OF 4 — AiAgentWidget.jsx (3D Messenger, 3D Register Handlers, Exam Engine & Proctored Overlays)
// ============================================================================
  const fetchSocialOverview = async () => {
    try {
      const activeToken = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        studentId: resolvedStudentId,
        studentName,
        phone: studentPhone || "",
        email: studentEmail || "",
        avatar: studentAvatar || "",
      });

      const res = await fetch(`${API_BASE}/social/overview?${queryParams.toString()}`, {
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
      });
      const data = await res.json();
      if (data && data.success) {
        setSocialOverview({
          myProfile: data.myProfile,
          isCallerFaculty: Boolean(data.isCallerFaculty),
          facultyContacts: Array.isArray(data.facultyContacts)
            ? data.facultyContacts
            : [],
          friends: Array.isArray(data.friends) ? data.friends : [],
          incomingRequests: Array.isArray(data.incomingRequests)
            ? data.incomingRequests
            : [],
          outgoingRequests: Array.isArray(data.outgoingRequests)
            ? data.outgoingRequests
            : [],
          directory: Array.isArray(data.directory) ? data.directory : [],
          communities: Array.isArray(data.communities) ? data.communities : [],
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchSocialOverview();
    const socialTimer = setInterval(fetchSocialOverview, 5500);
    return () => clearInterval(socialTimer);
  }, [resolvedStudentId, studentName, studentPhone, studentAvatar]);

  const handleSearchScholars = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/social/search?studentId=${encodeURIComponent(
          resolvedStudentId
        )}&q=${encodeURIComponent(q)}`,
        { headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {} }
      );
      const data = await res.json();
      if (data && data.success) {
        setSearchResults(Array.isArray(data.results) ? data.results : []);
      }
    } catch (err) {
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      handleSearchScholars();
    }, 260);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!activeFriend || !activeFriend.studentId) {
      setChatMessages([]);
      return;
    }

    const loadConversation = async () => {
      try {
        const activeToken = localStorage.getItem("token");
        const res = await fetch(
          `${API_BASE}/social/messages/${encodeURIComponent(
            activeFriend.studentId
          )}?studentId=${encodeURIComponent(resolvedStudentId)}`,
          { headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {} }
        );
        const data = await res.json();
        if (data && data.success && Array.isArray(data.messages)) {
          setChatMessages(data.messages);
        }
      } catch (e) {}
    };

    loadConversation();
    const msgTimer = setInterval(loadConversation, 3200);
    return () => clearInterval(msgTimer);
  }, [activeFriend?.studentId, resolvedStudentId]);

  useEffect(() => {
    directChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length, activeFriend?.studentId]);

  const handleSendFriendRequest = async (targetStudentId) => {
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/social/friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId: resolvedStudentId,
          fromStudentId: resolvedStudentId,
          toStudentId: targetStudentId,
          fromName: studentName,
          fromPhone: studentPhone,
          fromAvatar: studentAvatar,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBannerMsg({ type: "success", text: data.message });
        await fetchSocialOverview();
        if (searchQuery.trim()) handleSearchScholars();
      } else {
        setBannerMsg({ type: "error", text: data.message });
      }
    } catch (e) {
      setBannerMsg({ type: "error", text: "Unable to send connection request." });
    }
  };

  const handleRespondRequest = async (requestId, action) => {
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/social/friend-request/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({ studentId: resolvedStudentId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setBannerMsg({ type: "success", text: data.message });
        await fetchSocialOverview();
      }
    } catch (e) {}
  };

  const handleRemoveFriendOrCommunity = async (targetId) => {
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/social/friend/${encodeURIComponent(
          targetId
        )}?studentId=${encodeURIComponent(resolvedStudentId)}`,
        {
          method: "DELETE",
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        }
      );
      const data = await res.json();
      if (data.success) {
        if (activeFriend && String(activeFriend.studentId) === String(targetId)) {
          setActiveFriend(null);
        }
        setBannerMsg({ type: "success", text: data.message });
        await fetchSocialOverview();
      }
    } catch (e) {}
  };

  const handleCreateCommunitySubmit = async (e) => {
    e.preventDefault();
    if (!newCommName.trim()) {
      setBannerMsg({ type: "error", text: "Please enter a Community Name." });
      return;
    }

    setCommCreating(true);
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/social/friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId: resolvedStudentId,
          fromStudentId: resolvedStudentId,
          fromName: studentName,
          fromAvatar: studentAvatar,
          communityAction: "create",
          communityName: newCommName.trim(),
          communitySubject: newCommSubject.trim() || "General Study",
          communityDescription: newCommDesc.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.community) {
        setBannerMsg({ type: "success", text: data.message });
        setNewCommName("");
        setNewCommSubject("");
        setNewCommDesc("");
        setShowCreateCommModal(false);
        await fetchSocialOverview();
        setActiveFriend(data.community);
        setSocialSubTab("communities");
      } else {
        setBannerMsg({
          type: "error",
          text: data.message || "Could not create community.",
        });
      }
    } catch (err) {
      setBannerMsg({ type: "error", text: "Error creating community." });
    } finally {
      setCommCreating(false);
    }
  };

  const handleJoinCommunity = async (commObj) => {
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/social/friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId: resolvedStudentId,
          fromStudentId: resolvedStudentId,
          fromName: studentName,
          fromAvatar: studentAvatar,
          communityAction: "join",
          communityId: commObj.communityId || commObj.studentId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBannerMsg({ type: "success", text: data.message });
        await fetchSocialOverview();
        setActiveFriend(data.community || { ...commObj, isMember: true });
      }
    } catch (e) {}
  };

  const handleSendCommunityJoinInvite = async (targetUser) => {
    if (!activeFriend || !activeFriend.isCommunity || !targetUser) return;
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/social/communities/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          senderId: resolvedStudentId,
          senderName: studentName,
          senderAvatar: studentAvatar,
          targetStudentId: targetUser.studentId,
          targetStudentName: targetUser.studentName,
          communityId: activeFriend.communityId || activeFriend.studentId,
          communityName: activeFriend.studentName || activeFriend.name,
          communitySubject: activeFriend.subject || "General Study",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBannerMsg({ type: "success", text: data.message });
      }
    } catch (e) {}
  };

  const handleCreatePollSubmit = async (e) => {
    e.preventDefault();
    if (!activeFriend || !pollQuestion.trim()) return;
    const validOpts = pollOptions
      .map((o) => o.trim())
      .filter(Boolean)
      .map((label) => ({ label, voters: [] }));

    if (validOpts.length < 2) {
      setBannerMsg({
        type: "error",
        text: "Please enter at least 2 options for the poll.",
      });
      return;
    }

    const pollPayload = {
      cardType: "poll",
      question: pollQuestion.trim(),
      options: validOpts,
    };

    setShowPollModal(false);
    setPollQuestion("");
    setPollOptions(["", "", ""]);
    await handleSendDirectMessage(null, "text", pollPayload, activeFriend);
  };

  const handleVoteOnPoll = async (messageId, optionIndex) => {
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/social/messages/${messageId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          optionIndex,
          voterId: resolvedStudentId,
          voterName: studentName,
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setChatMessages((prev) =>
          prev.map((m) => (String(m._id) === String(messageId) ? data.message : m))
        );
      }
    } catch (e) {}
  };

  const handleToggleEmojiReaction = async (messageId, emoji) => {
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/social/messages/${messageId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          emoji,
          userId: resolvedStudentId,
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setChatMessages((prev) =>
          prev.map((m) => (String(m._id) === String(messageId) ? data.message : m))
        );
      }
    } catch (e) {}
  };

  const handleTogglePinMessage = async (messageId) => {
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/social/messages/${messageId}/pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success && data.message) {
        setChatMessages((prev) =>
          prev.map((m) => (String(m._id) === String(messageId) ? data.message : m))
        );
      }
    } catch (e) {}
  };

  const handleSendDirectMessage = async (
    e,
    customType = "text",
    customPayload = null,
    targetFriendOverride = null
  ) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetReceiver = targetFriendOverride || activeFriend;
    if (!targetReceiver || !targetReceiver.studentId) return;

    if (!dmInputText.trim() && !dmFile && !customPayload) return;

    setDmLoading(true);
    setShowChatPlusMenu(false);
    try {
      const formData = new FormData();
      formData.append("studentId", resolvedStudentId);
      formData.append("senderName", studentName);
      formData.append("senderAvatar", studentAvatar);
      formData.append("receiverId", targetReceiver.studentId);
      formData.append("receiverName", targetReceiver.studentName || "Scholar");

      const defaultShareText =
        customPayload?.cardType === "poll"
          ? `Poll: ${customPayload.question}`
          : customType === "shared-note"
          ? `📖 Shared 3D Notebook: "${customPayload?.title || "Notes"}" (${
              customPayload?.subject || "General"
            })`
          : customType === "shared-result"
          ? `🏆 Shared Exam Result: "${customPayload?.title || "Assessment"}" — Score: ${
              customPayload?.score || 0
            }/${customPayload?.totalQuestions || 20} (${customPayload?.percentage || 0}%)`
          : dmInputText.trim();

      formData.append("text", defaultShareText);
      formData.append("messageType", customType);
      if (customPayload) {
        formData.append("sharedPayload", JSON.stringify(customPayload));
      }
      if (dmFile && !customPayload) {
        formData.append("file", dmFile);
      }

      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/social/messages`, {
        method: "POST",
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.message) {
        if (
          activeFriend &&
          String(activeFriend.studentId) === String(targetReceiver.studentId)
        ) {
          setChatMessages((prev) => [...prev, data.message]);
        }
        if (!customPayload) {
          setDmInputText("");
          setDmFile(null);
          setDmFilePreviewUrl("");
        }
        await fetchSocialOverview();
      } else {
        setBannerMsg({
          type: "error",
          text: data.message || "Unable to send message.",
        });
      }
    } catch (err) {
      setBannerMsg({ type: "error", text: "Network error while sending message." });
    } finally {
      setDmLoading(false);
    }
  };

  const handleEditMessageSubmit = async (messageId) => {
    if (!editingMsgText.trim()) return;
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/social/messages/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId: resolvedStudentId,
          text: editingMsgText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages((prev) =>
          prev.map((m) => (String(m._id) === String(messageId) ? data.message : m))
        );
        setEditingMsgId(null);
        setEditingMsgText("");
        setBannerMsg({ type: "success", text: "✏️ Message updated!" });
      }
    } catch (e) {}
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/social/messages/${messageId}?studentId=${encodeURIComponent(
          resolvedStudentId
        )}`,
        {
          method: "DELETE",
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        }
      );
      const data = await res.json();
      if (data.success) {
        setChatMessages((prev) =>
          prev.filter((m) => String(m._id) !== String(messageId))
        );
        setBannerMsg({ type: "success", text: "🗑️ Message deleted." });
      }
    } catch (e) {}
  };

  const handleImportSharedNote = async (sharedNote) => {
    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/social/import-note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({ studentId: resolvedStudentId, sharedNote }),
      });
      const data = await res.json();
      if (data.success && data.note) {
        const updatedList = [data.note, ...notes];
        setNotes(updatedList);
        saveLocalNotebooks(resolvedStudentId, updatedList);
        setBannerMsg({
          type: "success",
          text: `📖 "${data.note.title}" imported to your 3D Register Shelf!`,
        });
        await fetchAiDashboardData();
        setActiveTab("notes");
      }
    } catch (e) {
      setBannerMsg({ type: "error", text: "Unable to import shared notebook." });
    }
  };

  useEffect(() => {
    const isOral = (q) =>
      q?.examType === "oral" || Boolean(q?.title?.toLowerCase().includes("oral"));
    const pendingQuizCount = quizzes.filter(
      (q) => q.status === "Pending" && !isOral(q)
    ).length;
    const pendingOralCount = quizzes.filter(
      (q) => q.status === "Pending" && isOral(q)
    ).length;
    const completedCount = quizzes.filter(
      (q) => q.status === "Completed" || Boolean(q.completedAt)
    ).length;
    const unreadMsgs = (socialOverview.friends || []).reduce(
      (s, f) => s + (f.unreadCount || 0),
      0
    );
    const pendingReqs = (socialOverview.incomingRequests || []).length;

    if (onCountsChange) {
      onCountsChange({
        pendingQuizzes: pendingQuizCount,
        pendingOralTests: pendingOralCount,
        completedQuizzes: completedCount,
        studyTasks: tasks.length,
        noteBooks: notes.length,
        unreadChatCount: unreadMsgs + pendingReqs,
        classroomAssignments: classroomAssignments.length,
      });
    }
  }, [
    quizzes,
    tasks,
    notes,
    socialOverview.friends,
    socialOverview.incomingRequests,
    classroomAssignments,
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ==========================================================================
  // SMART 3D REGISTER ("CREATE NOTES") HANDLERS WITH SMOOTH CLOSE & RETURN
  // ==========================================================================
  const handleCreateNotebook = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) {
      setBannerMsg({ type: "error", text: "Please enter a Register Title." });
      return;
    }

    setNoteCreating(true);
    const cleanTitle = newNoteTitle.trim();
    const cleanSubject = newNoteSubject.trim() || "General Studies";

    const fallbackBook = {
      _id: `notebook_${Date.now()}`,
      studentId: resolvedStudentId,
      title: cleanTitle,
      subject: cleanSubject,
      inkColor: "#1e3a8a",
      fontFamily: "'Caveat', cursive",
      createdAt: new Date().toISOString(),
      pages: [
        { pageNumber: 1, text: "", drawing: "" },
        { pageNumber: 2, text: "", drawing: "" },
        { pageNumber: 3, text: "", drawing: "" },
        { pageNumber: 4, text: "", drawing: "" },
      ],
    };

    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId: resolvedStudentId,
          title: cleanTitle,
          subject: cleanSubject,
        }),
      });

      let createdBook = fallbackBook;
      if (res.ok) {
        const data = await res.json();
        if (data && data.note) createdBook = data.note;
      }

      const updatedList = [createdBook, ...notes];
      setNotes(updatedList);
      saveLocalNotebooks(resolvedStudentId, updatedList);
      setNewNoteTitle("");
      setNewNoteSubject("");
      setBannerMsg({
        type: "success",
        text: `📖 3D Register "${createdBook.title}" created! Click "Open Register" to write or draw.`,
      });
      await fetchAiDashboardData();
    } catch (err) {
      const updatedList = [fallbackBook, ...notes];
      setNotes(updatedList);
      saveLocalNotebooks(resolvedStudentId, updatedList);
      setNewNoteTitle("");
      setNewNoteSubject("");
    } finally {
      setNoteCreating(false);
    }
  };

  const handleOpen3DBook = (notebook) => {
    const pagesCopy =
      Array.isArray(notebook.pages) && notebook.pages.length >= 2
        ? notebook.pages.map((p, idx) => ({
            pageNumber: p.pageNumber || idx + 1,
            text: p.text || "",
            drawing: p.drawing || "",
          }))
        : [
            { pageNumber: 1, text: "", drawing: "" },
            { pageNumber: 2, text: "", drawing: "" },
            { pageNumber: 3, text: "", drawing: "" },
            { pageNumber: 4, text: "", drawing: "" },
          ];

    setBookClosingAnim(false);
    setActiveBook({
      ...notebook,
      pages: pagesCopy,
    });
    setBookInkColor(notebook.inkColor || "#1e3a8a");
    setBookFontFamily(notebook.fontFamily || "'Caveat', cursive");
    setBookSpreadIndex(0);
    setBookInputMode("write");
    setPageTurnAnim("");
  };

  const updateActiveBookPage = (pageIndex, field, value) => {
    if (!activeBook) return;
    setActiveBook((prev) => {
      if (!prev) return prev;
      const updatedPages = [...prev.pages];
      while (updatedPages.length <= pageIndex) {
        updatedPages.push({
          pageNumber: updatedPages.length + 1,
          text: "",
          drawing: "",
        });
      }
      updatedPages[pageIndex] = {
        ...updatedPages[pageIndex],
        [field]: value,
      };
      return {
        ...prev,
        pages: updatedPages,
      };
    });
  };

  const handleTurnBookSpread = (direction) => {
    if (!activeBook) return;
    if (direction === "next") {
      setPageTurnAnim("flip-next");
      setTimeout(() => setPageTurnAnim(""), 520);

      const nextSpread = bookSpreadIndex + 1;
      const neededPages = (nextSpread + 1) * 2;

      setActiveBook((prev) => {
        const copyPages = [...(prev.pages || [])];
        while (copyPages.length < neededPages) {
          copyPages.push({
            pageNumber: copyPages.length + 1,
            text: "",
            drawing: "",
          });
        }
        return { ...prev, pages: copyPages };
      });
      setBookSpreadIndex(nextSpread);
    } else if (direction === "prev" && bookSpreadIndex > 0) {
      setPageTurnAnim("flip-prev");
      setTimeout(() => setPageTurnAnim(""), 520);
      setBookSpreadIndex((s) => Math.max(0, s - 1));
    }
  };

  const handleSaveActiveBook = async (closeAfterSave = false) => {
    if (!activeBook) return;
    setBookSaving(true);

    const updatedBookObj = {
      ...activeBook,
      inkColor: bookInkColor,
      fontFamily: bookFontFamily,
      updatedAt: new Date().toISOString(),
    };

    const updatedNotesList = notes.map((n) =>
      String(n._id) === String(updatedBookObj._id) ? updatedBookObj : n
    );
    setNotes(updatedNotesList);
    saveLocalNotebooks(resolvedStudentId, updatedNotesList);

    try {
      const activeToken = localStorage.getItem("token");
      await fetch(`${API_BASE}/notes/${updatedBookObj._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId: resolvedStudentId,
          title: updatedBookObj.title,
          subject: updatedBookObj.subject,
          pages: updatedBookObj.pages,
          inkColor: updatedBookObj.inkColor,
          fontFamily: updatedBookObj.fontFamily,
        }),
      });
    } catch (e) {}

    setBookSaving(false);
    setBannerMsg({
      type: "success",
      text: `💾 Register "${updatedBookObj.title}" saved successfully!`,
    });

    if (closeAfterSave) {
      setBookClosingAnim(true);
      setTimeout(() => {
        setActiveBook(null);
        setBookClosingAnim(false);
      }, 380);
    }
  };

  const handleUpdateNoteMetaSubmit = async (e) => {
    e.preventDefault();
    if (!editingNoteMeta || !editingNoteMeta.title?.trim()) return;

    const updatedList = notes.map((n) =>
      String(n._id) === String(editingNoteMeta._id)
        ? {
            ...n,
            title: editingNoteMeta.title.trim(),
            subject: editingNoteMeta.subject.trim(),
          }
        : n
    );
    setNotes(updatedList);
    saveLocalNotebooks(resolvedStudentId, updatedList);

    try {
      const activeToken = localStorage.getItem("token");
      await fetch(`${API_BASE}/notes/${editingNoteMeta._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId: resolvedStudentId,
          title: editingNoteMeta.title.trim(),
          subject: editingNoteMeta.subject.trim(),
        }),
      });
    } catch (err) {}

    setEditingNoteMeta(null);
    setBannerMsg({ type: "success", text: "Register title & subject updated!" });
  };

  // Strict Anti-Cheat Lock Helper
  const keepFullscreenLocked = async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      if (navigator.keyboard && navigator.keyboard.lock) {
        await navigator.keyboard.lock(["Escape"]);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (!activeQuiz) return;
    keepFullscreenLocked();

    const timerInterval = setInterval(() => {
      setExamSeconds((p) => p + 1);
      setRemainingSeconds((rem) => {
        if (rem <= 1) {
          clearInterval(timerInterval);
          executeQuizSubmission("Time Expired (Time Limit Reached)");
          return 0;
        }
        return rem - 1;
      });
    }, 1000);

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) keepFullscreenLocked();
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !submittingRef.current) {
        const nextStrikes = strikesRef.current + 1;
        strikesRef.current = nextStrikes;
        setCheatStrikes(nextStrikes);
        setProctorWarning(
          `🔒 Anti-Cheat Alert: Switching tabs or minimizing the exam window is blocked (Warning #${nextStrikes}).`
        );
      }
    };

    const handleKeyDown = (e) => {
      const key = e.key?.toLowerCase();
      if (e.key === "Escape" || key === "escape") {
        e.preventDefault();
        e.stopPropagation();
        keepFullscreenLocked();
        return false;
      }
      if (
        e.key === "F12" ||
        e.key === "F11" ||
        e.key === "F5" ||
        (e.ctrlKey &&
          ["c", "v", "x", "u", "p", "s", "f", "g", "r", "w", "t", "n"].includes(key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      clearInterval(timerInterval);
      if (navigator.keyboard && navigator.keyboard.unlock) {
        navigator.keyboard.unlock();
      }
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [activeQuiz]);

  // Pomodoro Timer
  useEffect(() => {
    if (!pomoActive) return;
    const timer = setInterval(() => {
      setPomoSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPomoActive(false);
          return pomoMode === "Focus Session" ? 5 * 60 : 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [pomoActive, pomoMode]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const formatScheduleCountdown = (scheduledFor) => {
    if (!scheduledFor) return null;
    const target = new Date(scheduledFor).getTime();
    const diff = target - nowTime;
    if (diff <= 0) return null;

    const totalSecs = Math.floor(diff / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (days > 0) {
      return `${days}d ${String(hours).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
    }
    return `${String(hours).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
  };

  const renderStars = (count = 0) => {
    const validStars = Math.max(0, Math.min(5, Number(count) || 0));
    return (
      <span style={{ letterSpacing: "2px", fontSize: "16px", color: "#fbbf24" }}>
        {"★".repeat(validStars)}
        {"☆".repeat(5 - validStars)}
      </span>
    );
  };

  // ==========================================================================
  // BULLETPROOF INSTANT DELETE ENGINE
  // ==========================================================================
  const openDeletePopup = ({ type, id, title, subtitle }) => {
    setDeleteModal({
      isOpen: true,
      type,
      id,
      title,
      subtitle,
      loading: false,
    });
  };

  const closeDeletePopup = () => {
    setDeleteModal({
      isOpen: false,
      type: "",
      id: null,
      title: "",
      subtitle: "",
      loading: false,
    });
  };

  const confirmDeleteAction = () => {
    const targetType = deleteModal.type;
    const targetId = deleteModal.id;

    setDeleteModal({
      isOpen: false,
      type: "",
      id: null,
      title: "",
      subtitle: "",
      loading: false,
    });

    const activeToken = localStorage.getItem("token");
    const headers = activeToken ? { Authorization: `Bearer ${activeToken}` } : {};

    if (targetType === "quiz" && targetId) {
      markIdAsDeletedLocally(targetId);
      removeLocalCompletedQuiz(resolvedStudentId, targetId);
      setQuizzes((prev) => prev.filter((q) => String(q._id) !== String(targetId)));
      if (selectedResultQuiz && String(selectedResultQuiz._id) === String(targetId)) {
        setSelectedResultQuiz(null);
      }
      setBannerMsg({ type: "success", text: "Assessment permanently deleted." });

      fetch(
        `${API_BASE}/quiz/${targetId}?studentId=${encodeURIComponent(resolvedStudentId)}`,
        { method: "DELETE", headers }
      ).catch(() => {});
    } else if (targetType === "task" && targetId) {
      markIdAsDeletedLocally(targetId);
      setTasks((prev) => prev.filter((t) => String(t._id) !== String(targetId)));
      setBannerMsg({ type: "success", text: "Study roadmap module deleted." });

      fetch(
        `${API_BASE}/tasks/${targetId}?studentId=${encodeURIComponent(resolvedStudentId)}`,
        { method: "DELETE", headers }
      ).catch(() => {});
    } else if (targetType === "note" && targetId) {
      markIdAsDeletedLocally(targetId);
      setNotes((prev) => {
        const filtered = prev.filter((n) => String(n._id) !== String(targetId));
        saveLocalNotebooks(resolvedStudentId, filtered);
        return filtered;
      });
      if (activeBook && String(activeBook._id) === String(targetId)) {
        setActiveBook(null);
      }
      setBannerMsg({ type: "success", text: "3D Register permanently deleted." });

      fetch(
        `${API_BASE}/notes/${targetId}?studentId=${encodeURIComponent(resolvedStudentId)}`,
        { method: "DELETE", headers }
      ).catch(() => {});
    } else if (targetType === "chat") {
      stopSpeaking();
      setMessages([]);
      setBannerMsg({ type: "success", text: "Conversation history cleared." });

      fetch(`${API_BASE}/chat/clear`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ studentId: resolvedStudentId }),
      }).catch(() => {});
    }
  };

  // ==========================================================================
  // 1. AI TUTOR CHAT
  // ==========================================================================
  const submitTutorRequest = async (modeType = "auto") => {
    if (!chatInput.trim() && !chatFile) {
      setBannerMsg({
        type: "error",
        text: "Please enter a question/topic or attach a PDF/Image first.",
      });
      return;
    }

    const userText = chatInput.trim();
    const attachedFile = chatFile;

    setChatLoading(true);
    setBannerMsg({
      type: "info",
      text:
        modeType === "image"
          ? "🎨 Generating high-resolution educational diagram & explanation..."
          : modeType === "pdf"
          ? "📄 Compiling structured academic notes & building vector PDF..."
          : attachedFile
          ? `📄 Reading "${attachedFile.name}" and preparing detailed answer...`
          : "🤖 AI Tutor is analyzing your query...",
    });

    try {
      let extractedPdfText = "";
      if (attachedFile && attachedFile.type === "application/pdf") {
        extractedPdfText = await extractRealTextFromPdfFile(attachedFile);
      }

      const formData = new FormData();
      formData.append("studentId", resolvedStudentId);
      formData.append("message", userText);
      formData.append("mode", modeType);
      formData.append("voiceLang", voiceLang);
      if (extractedPdfText) {
        formData.append("extractedPdfText", extractedPdfText);
      }
      if (attachedFile) {
        formData.append("file", attachedFile);
      }

      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMessages(data.messages || []);
        setBannerMsg({ type: "", text: "" });

        if (
          (modeType === "pdf" || data.attachmentType === "generated-pdf") &&
          data.reply
        ) {
          const pdfTitle =
            data.attachmentName ||
            `${(userText || attachedFile?.name || "Study_Notes")
              .slice(0, 28)
              .replace(/[^a-zA-Z0-9]+/g, "_")}.pdf`;
          handleDownloadChatNotePdf(data.reply, pdfTitle);
        }

        if (autoVoiceReply && data.reply) {
          speakText(data.reply, Boolean(data.isRomanUrdu));
        }

        setChatInput("");
        setChatFile(null);
      } else {
        setBannerMsg({
          type: "error",
          text: data.message || "Unable to process request.",
        });
      }
    } catch (err) {
      setBannerMsg({
        type: "error",
        text: "Network error while contacting AI Tutor.",
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    submitTutorRequest("auto");
  };

  // 2. GENERATE 20-QUESTION QUIZ
  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!quizTopic.trim() && !quizFile) {
      setBannerMsg({
        type: "error",
        text: "Please enter an academic topic or attach a PDF document to generate an assessment.",
      });
      return;
    }

    setQuizGenLoading(true);
    setBannerMsg({
      type: "info",
      text: quizFile
        ? `📄 Reading "${quizFile.name}" and extracting 20 unique multiple-choice questions...`
        : `Analyzing "${quizTopic}" and compiling 20 unique subject-specific questions...`,
    });

    try {
      let extractedPdfText = "";
      if (quizFile && quizFile.type === "application/pdf") {
        extractedPdfText = await extractRealTextFromPdfFile(quizFile);
      }

      const scheduledIso = quizScheduleTime ? new Date(quizScheduleTime).toISOString() : "";
      const formData = new FormData();
      formData.append("studentId", resolvedStudentId);
      formData.append("topic", quizTopic);
      formData.append("difficulty", quizDifficulty);
      formData.append("durationMinutes", quizDurationMins);
      formData.append("examType", "quiz");
      if (extractedPdfText) formData.append("extractedPdfText", extractedPdfText);
      if (scheduledIso) formData.append("scheduledFor", scheduledIso);
      if (quizFile) formData.append("file", quizFile);

      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/quiz/generate`, {
        method: "POST",
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Assessment generation failed.");
      }

      if (data.quiz) {
        if (scheduledIso) saveScheduleForQuizId(data.quiz._id, scheduledIso, false);
        const enrichedQuiz = {
          ...data.quiz,
          examType: "quiz",
          status: "Pending",
          scheduledFor: data.quiz.scheduledFor || scheduledIso || null,
        };
        setQuizzes((prev) => [
          enrichedQuiz,
          ...prev.filter((q) => String(q._id) !== String(enrichedQuiz._id)),
        ]);
      }

      setQuizTopic("");
      setQuizFile(null);
      setQuizScheduleTime("");
      setActiveTab("quiz-lab");
      setBannerMsg({
        type: "success",
        text: "20-Question Assessment generated and added to Pending Examinations!",
      });

      await fetchAiDashboardData();
    } catch (err) {
      setBannerMsg({ type: "error", text: err.message });
    } finally {
      setQuizGenLoading(false);
    }
  };

  // 2B. GENERATE 10-QUESTION AI ORAL TEST
  const handleGenerateOralTest = async (e) => {
    e.preventDefault();
    if (!oralTopic.trim() && !oralFile) {
      setBannerMsg({
        type: "error",
        text: "Please enter an Oral Test subject/topic or attach a PDF document.",
      });
      return;
    }

    setOralGenLoading(true);
    setBannerMsg({
      type: "info",
      text: oralFile
        ? `📄 Reading "${oralFile.name}" and compiling 10 Oral Test questions...`
        : `Compiling 10 "${oralTopic}" Oral Test questions with AI Voice Examiner...`,
    });

    try {
      let extractedPdfText = "";
      if (oralFile && oralFile.type === "application/pdf") {
        extractedPdfText = await extractRealTextFromPdfFile(oralFile);
      }

      const scheduledIso = oralScheduleTime ? new Date(oralScheduleTime).toISOString() : "";
      const formData = new FormData();
      formData.append("studentId", resolvedStudentId);
      formData.append("topic", oralTopic);
      formData.append("difficulty", oralDifficulty);
      formData.append("durationMinutes", oralDurationMins);
      formData.append("examType", "oral");
      formData.append("voiceGender", oralVoiceGender);
      if (extractedPdfText) formData.append("extractedPdfText", extractedPdfText);
      if (scheduledIso) formData.append("scheduledFor", scheduledIso);
      if (oralFile) formData.append("file", oralFile);

      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/oral/generate`, {
        method: "POST",
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Oral Test generation failed.");
      }

      if (data.quiz) {
        if (scheduledIso) saveScheduleForQuizId(data.quiz._id, scheduledIso, false);
        const enrichedOral = {
          ...data.quiz,
          examType: "oral",
          voiceGender: oralVoiceGender,
          status: "Pending",
          scheduledFor: data.quiz.scheduledFor || scheduledIso || null,
        };
        setQuizzes((prev) => [
          enrichedOral,
          ...prev.filter((q) => String(q._id) !== String(enrichedOral._id)),
        ]);
      }

      setOralTopic("");
      setOralFile(null);
      setOralScheduleTime("");
      setActiveTab("oral-lab");
      setBannerMsg({
        type: "success",
        text: "🎙️ 10-Question AI Oral Test generated and added to Pending Oral Tests!",
      });

      await fetchAiDashboardData();
    } catch (err) {
      setBannerMsg({ type: "error", text: err.message });
    } finally {
      setOralGenLoading(false);
    }
  };

  const handleStartQuiz = async (quiz) => {
    if (quiz.scheduledFor) {
      const unlockTime = new Date(quiz.scheduledFor).getTime();
      if (Date.now() < unlockTime) {
        setBannerMsg({
          type: "error",
          text: `🔒 This assessment is scheduled and locked until ${new Date(
            quiz.scheduledFor
          ).toLocaleString()}.`,
        });
        return;
      }
    }

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      if (navigator.keyboard && navigator.keyboard.lock) {
        await navigator.keyboard.lock(["Escape"]);
      }
    } catch (err) {}

    const isOral =
      quiz.examType === "oral" || Boolean(quiz.title?.toLowerCase().includes("oral"));
    const durationSecs = (Number(quiz.durationMinutes) || (isOral ? 15 : 20)) * 60;

    setActiveQuiz(quiz);
    setSelectedAnswers({});
    answersRef.current = {};
    setSpokenAnswers({});
    spokenAnswersRef.current = {};
    setLiveOralTranscript("");
    setCurrentQIndex(0);
    setExamSeconds(0);
    examSecondsRef.current = 0;
    setRemainingSeconds(durationSecs);
    setCheatStrikes(0);
    strikesRef.current = 0;
    submittingRef.current = false;
    setProctorWarning("");
    setUnansweredWarning(false);
    setBannerMsg({ type: "", text: "" });
  };

  const executeQuizSubmission = async (autoReason = "") => {
    if (!activeQuiz || submittingRef.current) return;

    const isOral =
      activeQuiz.examType === "oral" ||
      Boolean(activeQuiz.title?.toLowerCase().includes("oral"));
    const totalQ = activeQuiz.questions?.length || (isOral ? 10 : 20);
    const answeredCount = isOral
      ? Object.keys(spokenAnswersRef.current).length
      : Object.keys(answersRef.current).length;

    if (!isOral && !autoReason && answeredCount < totalQ) {
      setUnansweredWarning(true);
      setProctorWarning(
        `⚠️ Incomplete Exam: You have answered ${answeredCount} of ${totalQ} questions. You must answer all ${totalQ} questions before submitting.`
      );
      return;
    }

    clearOralFlowTimers();
    stopSpeaking();
    try {
      if (recognitionRef.current) recognitionRef.current.stop();
    } catch (e) {}
    setIsListening(false);

    submittingRef.current = true;
    setQuizSubmitting(true);

    try {
      if (navigator.keyboard && navigator.keyboard.unlock) {
        navigator.keyboard.unlock();
      }
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (e) {}

    try {
      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/quiz/${activeQuiz._id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId: resolvedStudentId,
          answers: answersRef.current,
          spokenAnswers: spokenAnswersRef.current,
          timeTakenSeconds: examSecondsRef.current,
          cheatStrikes: strikesRef.current,
          autoSubmittedReason: autoReason,
        }),
      });
      const data = await res.json();

      if (data.success && data.quiz) {
        const gradedQuiz = {
          ...data.quiz,
          examType: isOral ? "oral" : data.quiz.examType || "quiz",
          status: "Completed",
          passed: Boolean(data.quiz.passed || (data.quiz.percentage || 0) >= 60),
        };

        saveLocalCompletedQuiz(resolvedStudentId, gradedQuiz);

        const isPassed = gradedQuiz.passed;
        const oneWeekLaterIso = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString();
        let pendingReattemptQuiz = data.reattemptQuiz || null;

        if (pendingReattemptQuiz && pendingReattemptQuiz._id) {
          const unlockIso = pendingReattemptQuiz.scheduledFor || oneWeekLaterIso;
          saveScheduleForQuizId(pendingReattemptQuiz._id, unlockIso, true);
          pendingReattemptQuiz = {
            ...pendingReattemptQuiz,
            examType: isOral ? "oral" : pendingReattemptQuiz.examType || "quiz",
            status: "Pending",
            scheduledFor: unlockIso,
            isReattempt: true,
          };
        }

        setQuizzes((prev) => {
          const updated = prev.map((q) =>
            String(q._id) === String(gradedQuiz._id) ? gradedQuiz : q
          );
          if (pendingReattemptQuiz) {
            return [
              pendingReattemptQuiz,
              ...updated.filter(
                (q) => String(q._id) !== String(pendingReattemptQuiz._id)
              ),
            ];
          }
          return updated;
        });

        setActiveQuiz(null);
        setSelectedResultQuiz(gradedQuiz);
        setShowDetailedBreakdown(true);
        setResultFilterMode("all");
        setActiveTab("results");

        if (isPassed) {
          setBannerMsg({
            type: "success",
            text: `🏆 Congratulations! You PASSED the ${
              isOral ? "AI Oral Test" : "examination"
            } with ${gradedQuiz.percentage}% (Grade ${gradedQuiz.grade}). Full question-by-question answer key is shown below.`,
          });
        } else {
          setBannerMsg({
            type: "error",
            text: `⚠️ ${
              isOral ? "AI Oral Test" : "Examination"
            } Failed (${gradedQuiz.percentage}% — Below 60%). Your failed result & full answer key are displayed below, and a 7-Day Re-Attempt has been added to Pending ${
              isOral ? "Oral Tests" : "Quizzes"
            }!`,
          });
        }

        await fetchAiDashboardData();
      }
    } catch (err) {
      setBannerMsg({ type: "error", text: "Error submitting assessment." });
    } finally {
      submittingRef.current = false;
      setQuizSubmitting(false);
    }
  };

  // 3. GENERATE STUDY ROADMAP
  const handleGenerateStudyPlan = async (e) => {
    e.preventDefault();
    if (!plannerTopic.trim() && !plannerFile) {
      setBannerMsg({
        type: "error",
        text: "Please enter a study objective or upload a syllabus PDF.",
      });
      return;
    }

    setPlannerLoading(true);
    setBannerMsg({
      type: "info",
      text: "Structuring 6-phase curriculum roadmap and milestones...",
    });

    try {
      const formData = new FormData();
      formData.append("studentId", resolvedStudentId);
      formData.append("goalOrTopic", plannerTopic);
      if (plannerFile) formData.append("file", plannerFile);

      const activeToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/tasks/generate`, {
        method: "POST",
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to generate study roadmap.");
      }

      if (Array.isArray(data.tasks)) {
        setTasks((prev) => [...data.tasks, ...prev]);
      }

      setPlannerTopic("");
      setPlannerFile(null);
      setActiveTab("planner");
      setBannerMsg({
        type: "success",
        text: "6-Phase Study Roadmap generated and added to your planner.",
      });

      await fetchAiDashboardData();
    } catch (err) {
      setBannerMsg({ type: "error", text: err.message });
    } finally {
      setPlannerLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        String(t._id) === String(taskId)
          ? { ...t, status: t.status === "Pending" ? "Completed" : "Pending" }
          : t
      )
    );
    const activeToken = localStorage.getItem("token");
    await fetch(`${API_BASE}/tasks/${taskId}/toggle`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
      },
      body: JSON.stringify({ studentId: resolvedStudentId }),
    });
    await fetchAiDashboardData();
  };

  const handleUpdateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        String(t._id) === String(editingTask._id) ? editingTask : t
      )
    );
    const activeToken = localStorage.getItem("token");
    await fetch(`${API_BASE}/tasks/${editingTask._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
      },
      body: JSON.stringify({ studentId: resolvedStudentId, ...editingTask }),
    });
    setEditingTask(null);
    setBannerMsg({ type: "success", text: "Study module updated successfully." });
    await fetchAiDashboardData();
  };

  const isOralExamItem = (q) =>
    q?.examType === "oral" || Boolean(q?.title?.toLowerCase().includes("oral"));
  const pendingQuizzes = quizzes.filter(
    (q) => q.status === "Pending" && !isOralExamItem(q)
  );
  const pendingOralTests = quizzes.filter(
    (q) => q.status === "Pending" && isOralExamItem(q)
  );
  const completedQuizzes = quizzes.filter(
    (q) => q.status === "Completed" || Boolean(q.completedAt)
  );
  const passedExamsCount = completedQuizzes.filter(
    (q) => q.passed || (q.percentage || 0) >= 60
  ).length;
  const failedExamsCount = completedQuizzes.length - passedExamsCount;

  const getMySubmissionForAssignment = (asgn) => {
    if (!asgn || !Array.isArray(asgn.submissions)) return null;
    return asgn.submissions.find(
      (s) =>
        String(s.studentId) === String(resolvedStudentId) ||
        (studentEmail &&
          String(s.studentEmail || "").toLowerCase() ===
            String(studentEmail).toLowerCase())
    );
  };

  const mySubmittedAssignments = classroomAssignments
    .map((asgn) => ({
      assignment: asgn,
      mySub: getMySubmissionForAssignment(asgn),
    }))
    .filter((item) => Boolean(item.mySub));

  const currentResult =
    (selectedResultQuiz &&
      completedQuizzes.find(
        (q) => String(q._id) === String(selectedResultQuiz._id)
      )) ||
    selectedResultQuiz ||
    completedQuizzes[0] ||
    null;

  const taskCompletionPercent =
    tasks.length > 0
      ? Math.round(
          (tasks.filter((t) => t.status === "Completed").length / tasks.length) * 100
        )
      : 0;

  // ==========================================================================
  // FULL-SCREEN PROCTORED EXAM OVERLAY (HANDLES BOTH ORAL VIVA & 20-Q QUIZ)
  // ==========================================================================
  if (activeQuiz) {
    const isOralActive = isOralExamItem(activeQuiz);
    const totalQuestionsCount =
      activeQuiz.questions?.length || (isOralActive ? 10 : 20);
    const answeredCount = isOralActive
      ? Object.keys(spokenAnswers).length
      : Object.keys(selectedAnswers).length;
    const currentQ = activeQuiz.questions?.[currentQIndex];

    // MODE A: HANDS-FREE AUTOMATED VOICE AI ORAL TEST
    if (isOralActive) {
      const examinerGender = activeQuiz.voiceGender || "female";

      return (
        <div
          onClick={keepFullscreenLocked}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            background: "#06080f",
            color: "#f8fafc",
            zIndex: 999999,
            overflowY: "auto",
            padding: "28px 42px",
            userSelect: "none",
            WebkitUserSelect: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              padding: "16px 24px",
              background: "#0f131d",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              borderRadius: "14px",
              marginBottom: "18px",
            }}
          >
            <div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "4px" }}>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "rgba(16, 185, 129, 0.16)",
                    border: "1px solid rgba(16, 185, 129, 0.45)",
                    color: "#34d399",
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  🎙️ HANDS-FREE VOICE AI ORAL EXAMINATION • AUTO-FLOW ACTIVE
                </span>
                <span className="vip-pill-badge">{activeQuiz.difficulty} Level</span>
              </div>
              <h2 style={{ margin: 0, fontSize: "20px" }}>{activeQuiz.title}</h2>
            </div>

            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              <div
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  background: "rgba(16, 185, 129, 0.14)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  color: "#34d399",
                  fontSize: "12.5px",
                  fontWeight: 700,
                }}
              >
                Question {currentQIndex + 1} of {totalQuestionsCount}
              </div>

              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background: "#161b26",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "#34d399",
                }}
              >
                ⏳ Time Left: {formatTime(remainingSeconds)}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "18px",
              padding: "12px 16px",
              background: "#0f131d",
              borderRadius: "12px",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {activeQuiz.questions.map((_, i) => {
                const isCurrent = currentQIndex === i;
                const isDone = Boolean(spokenAnswers[i]);
                return (
                  <div
                    key={i}
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "8px",
                      fontWeight: 800,
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: isCurrent
                        ? "2px solid #10b981"
                        : "1px solid rgba(255,255,255,0.08)",
                      background: isCurrent
                        ? "#10b981"
                        : isDone
                        ? "rgba(16, 185, 129, 0.25)"
                        : "#161b26",
                      color: "#ffffff",
                    }}
                  >
                    {isDone && !isCurrent ? "✓" : i + 1}
                  </div>
                );
              })}
            </div>

            <span style={{ fontSize: "12.5px", color: "#94a3b8", fontWeight: 600 }}>
              Passing Criteria: 60% (6 / 10 Correct) • Voice-Only Mode
            </span>
          </div>

          <div className="oral-examiner-stage">
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <div
                className={`oral-avatar-orb ${
                  isSpeaking ? "speaking" : isListening ? "listening" : ""
                }`}
              >
                {examinerGender === "male" ? "👨‍🏫" : "👩‍🏫"}
              </div>
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  <span
                    className="vip-pill-badge"
                    style={{ background: "#10b981", color: "#fff" }}
                  >
                    {examinerGender === "male"
                      ? "👨‍🏫 AI Male Examiner"
                      : "👩‍🏫 AI Female Examiner"}
                  </span>
                  <span
                    className="vip-pill-badge"
                    style={{
                      background:
                        oralStage === "listening"
                          ? "rgba(239, 68, 68, 0.2)"
                          : oralStage === "confirming"
                          ? "rgba(99, 102, 241, 0.2)"
                          : "rgba(16, 185, 129, 0.2)",
                      color:
                        oralStage === "listening"
                          ? "#f87171"
                          : oralStage === "confirming"
                          ? "#a5b4fc"
                          : "#34d399",
                    }}
                  >
                    {oralStage === "reading"
                      ? "🔊 Examiner Speaking Question & Options..."
                      : oralStage === "listening"
                      ? "🔴 Mic Open — Speak Your Answer Now!"
                      : oralStage === "confirming"
                      ? "✅ 'Okay, moving to next question...'"
                      : "🎙️ Ready for Your Voice"}
                  </span>
                </div>

                <div style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: 500 }}>
                  {oralStage === "reading"
                    ? "Listen carefully as the AI Examiner reads the question and options aloud..."
                    : oralStage === "listening"
                    ? "Say 'Option A', 'Option B', 'Option C', 'Option D' or speak the answer text clearly!"
                    : oralStage === "confirming"
                    ? "Answer captured! Advancing to the next question automatically..."
                    : "Click 'Speak Answer Now' if your microphone paused."}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div
                className={`oral-soundwave-bars ${
                  isSpeaking || isListening ? "active" : ""
                }`}
              >
                <div className="oral-wave-bar" />
                <div className="oral-wave-bar" />
                <div className="oral-wave-bar" />
                <div className="oral-wave-bar" />
                <div className="oral-wave-bar" />
                <div className="oral-wave-bar" />
              </div>

              <button
                type="button"
                onClick={() => runAutomatedOralQuestionFlow(currentQIndex)}
                className="pro-btn-secondary"
              >
                🔊 Repeat Question
              </button>

              <button
                type="button"
                onClick={toggleMicrophoneListening}
                className="pro-btn-primary"
                style={{
                  background: isListening
                    ? "#ef4444"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                }}
              >
                {isListening ? "🔴 Listening..." : "🎙️ Speak Answer Now"}
              </button>
            </div>
          </div>

          {currentQ && (
            <div
              style={{
                flex: 1,
                background: "#0f131d",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "28px 32px",
                borderRadius: "16px",
                marginBottom: "18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#34d399",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Spoken Question {currentQIndex + 1} of {totalQuestionsCount} •{" "}
                  {currentQ.topicTag || "Oral Viva"}
                </div>

                <h3
                  style={{
                    margin: "0 0 22px 0",
                    fontSize: "22px",
                    lineHeight: 1.5,
                    color: "#ffffff",
                  }}
                >
                  Q{currentQIndex + 1}. {currentQ.questionText}
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "12px",
                    marginBottom: "22px",
                  }}
                >
                  {(currentQ.options || []).map((opt, oIdx) => {
                    const isRevealed = oralRevealStep >= oIdx + 1;
                    return (
                      <div
                        key={oIdx}
                        style={{
                          padding: "16px 18px",
                          borderRadius: "12px",
                          background: isRevealed
                            ? "rgba(22, 27, 38, 0.95)"
                            : "rgba(15, 18, 25, 0.35)",
                          border: isRevealed
                            ? "1px solid rgba(99, 102, 241, 0.35)"
                            : "1px dashed rgba(255,255,255,0.06)",
                          opacity: isRevealed ? 1 : 0.25,
                          transform: isRevealed ? "translateY(0)" : "translateY(6px)",
                          transition: "all 0.35s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          pointerEvents: "none",
                        }}
                      >
                        <span
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: "rgba(99, 102, 241, 0.2)",
                            border: "1px solid rgba(99, 102, 241, 0.45)",
                            color: "#a5b4fc",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "14px",
                            flexShrink: 0,
                          }}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span style={{ fontSize: "15px", color: "#f1f5f9", lineHeight: 1.45 }}>
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  padding: "18px 22px",
                  borderRadius: "14px",
                  background: isListening
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(11, 15, 25, 0.9)",
                  border: isListening
                    ? "2px solid #10b981"
                    : "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      color: isListening ? "#34d399" : "#94a3b8",
                      marginBottom: "4px",
                    }}
                  >
                    {isListening
                      ? "🎙️ Listening to Your Voice (Speak Option A / B / C / D or Answer)..."
                      : "🗣️ Your Recorded Voice Transcript:"}
                  </div>
                  <div
                    style={{
                      fontSize: "17px",
                      fontWeight: 700,
                      color: liveOralTranscript ? "#ffffff" : "#64748b",
                    }}
                  >
                    {liveOralTranscript
                      ? `"${liveOralTranscript}"`
                      : isSpeaking
                      ? "Waiting for AI Examiner to finish reading..."
                      : "Speak into your microphone now..."}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => handleOralVoiceAnswerCaptured(liveOralTranscript || "Skipped")}
                    className="pro-btn-secondary"
                    style={{ fontSize: "12.5px", padding: "8px 14px" }}
                  >
                    ⏭️ Skip / Next Question
                  </button>

                  {currentQIndex === totalQuestionsCount - 1 && (
                    <button
                      type="button"
                      onClick={() => executeQuizSubmission("Oral Examination Completed")}
                      disabled={quizSubmitting}
                      className="pro-btn-primary"
                      style={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      }}
                    >
                      {quizSubmitting ? "Submitting..." : "✅ Finish Oral Exam"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // MODE B: STANDARD 20-QUESTION PROCTORED MCQ QUIZ OVERLAY
    return (
      <div
        onClick={keepFullscreenLocked}
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          background: "#07090e",
          color: "#f8fafc",
          zIndex: 999999,
          overflowY: "auto",
          padding: "28px 40px",
          userSelect: "none",
          WebkitUserSelect: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            padding: "16px 24px",
            background: "#0f1219",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            borderRadius: "14px",
            marginBottom: "18px",
          }}
        >
          <div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "4px" }}>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "rgba(239, 68, 68, 0.16)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#f87171",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                🔒 ESCAPE & EXIT DISABLED • MANDATORY COMPLETION MODE
              </span>
              <span className="vip-pill-badge">{activeQuiz.difficulty} Level</span>
            </div>
            <h2 style={{ margin: 0, fontSize: "20px" }}>{activeQuiz.title}</h2>
          </div>

          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <div
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.14)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                color: "#34d399",
                fontSize: "12.5px",
                fontWeight: 700,
              }}
            >
              Progress: {answeredCount} / {totalQuestionsCount} Answered
            </div>

            <div
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                background: "#161b26",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "16px",
                fontWeight: 800,
                color: "#a5b4fc",
              }}
            >
              ⏳ Time Left: {formatTime(remainingSeconds)}
            </div>
          </div>
        </div>

        {proctorWarning && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              background: "rgba(245, 158, 11, 0.14)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#fcd34d",
              fontWeight: 600,
              fontSize: "13.5px",
              marginBottom: "16px",
            }}
          >
            {proctorWarning}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "20px",
            padding: "14px",
            background: "#0f1219",
            borderRadius: "12px",
          }}
        >
          {activeQuiz.questions.map((_, i) => {
            const isCurrent = currentQIndex === i;
            const isAnswered = selectedAnswers[i] !== undefined;
            return (
              <button
                key={i}
                onClick={() => setCurrentQIndex(i)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "13.5px",
                  cursor: "pointer",
                  border: isCurrent
                    ? "2px solid #6366f1"
                    : unansweredWarning && !isAnswered
                    ? "1px solid #ef4444"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: isCurrent
                    ? "#6366f1"
                    : isAnswered
                    ? "rgba(16, 185, 129, 0.25)"
                    : "#161b26",
                  color: "#ffffff",
                }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {currentQ && (
          <div
            style={{
              flex: 1,
              background: "#0f1219",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "28px",
              borderRadius: "16px",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ margin: "0 0 22px 0", fontSize: "19px", lineHeight: 1.55 }}>
              {currentQIndex + 1}. {currentQ.questionText}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQIndex] === oIdx;
                return (
                  <div
                    key={oIdx}
                    className={`cyber-option-label ${isSelected ? "selected" : ""}`}
                    style={{ padding: "15px 18px", fontSize: "15px" }}
                    onClick={() => {
                      keepFullscreenLocked();
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [currentQIndex]: oIdx,
                      }));
                    }}
                  >
                    <strong
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isSelected ? "#6366f1" : "rgba(255,255,255,0.08)",
                        fontSize: "13.5px",
                      }}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </strong>
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            background: "#0f1219",
            borderRadius: "14px",
          }}
        >
          <button
            disabled={currentQIndex === 0}
            onClick={() => setCurrentQIndex((i) => Math.max(0, i - 1))}
            className="pro-btn-secondary"
          >
            ← Previous Question
          </button>

          <div style={{ display: "flex", gap: "12px" }}>
            {currentQIndex < totalQuestionsCount - 1 && (
              <button
                onClick={() =>
                  setCurrentQIndex((i) => Math.min(totalQuestionsCount - 1, i + 1))
                }
                className="pro-btn-primary"
              >
                Next Question →
              </button>
            )}

            <button
              onClick={() => executeQuizSubmission("")}
              disabled={quizSubmitting}
              className="pro-btn-primary"
              style={{
                background:
                  answeredCount === totalQuestionsCount
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : "#334155",
              }}
            >
              {quizSubmitting
                ? "Grading Examination..."
                : `✅ Submit Examination (${answeredCount}/${totalQuestionsCount})`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const leftPageIndex = bookSpreadIndex * 2;
  const rightPageIndex = bookSpreadIndex * 2 + 1;
  const leftPageData = activeBook?.pages?.[leftPageIndex] || {
    pageNumber: leftPageIndex + 1,
    text: "",
    drawing: "",
  };
  const rightPageData = activeBook?.pages?.[rightPageIndex] || {
    pageNumber: rightPageIndex + 1,
    text: "",
    drawing: "",
  };
  // ============================================================================
// PART 4 OF 4 — AiAgentWidget.jsx (3D Register Studio, 3D Messenger, Classroom, Tutor, Quizzes, Oral, Full Results & Planner)
// ============================================================================
  const QUICK_EMOJIS = ["👍", "❤️", "🔥", "👏", "🎯", "💡"];
  const pinnedMessage = chatMessages.find((m) => m.sharedPayload?.isPinned);
  const activeColorValue =
    bookInputMode === "write" ? bookInkColor : bookPenColor;

  const setActiveColorValue = (newCol) => {
    if (bookInputMode === "write") setBookInkColor(newCol);
    else setBookPenColor(newCol);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* ====================================================================
          94VW × 84VH 3D REALISTIC OPEN REGISTER ("KITAAB") STUDIO MODAL
         ==================================================================== */}
      {activeBook && (
        <div className="book-modal-backdrop">
          <div className="book-top-toolbar">
            {/* LEFT: REGISTER TITLE & SUBJECT */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="vip-pill-badge">📖 {activeBook.subject}</span>
              <h3 style={{ margin: 0, fontSize: "16px", color: "#fff", fontWeight: 700 }}>
                {activeBook.title}
              </h3>
            </div>

            {/* CENTER: DRAWING, SHAPES, CUSTOM COLOR & FONT TOOLS */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <div className="book-tool-group">
                <button
                  type="button"
                  onClick={() => setBookInputMode("write")}
                  className={`book-tool-btn ${bookInputMode === "write" ? "active" : ""}`}
                  title="Keyboard Handwriting on Ruled Lines"
                >
                  ✍️ Text
                </button>

                <button
                  type="button"
                  onClick={() => setBookInputMode("pen")}
                  className={`book-tool-btn ${bookInputMode === "pen" ? "active" : ""}`}
                  title="Freehand + Crosshair Pen (Hold SHIFT for Straight Line)"
                >
                  ✚ Pen
                </button>

                <button
                  type="button"
                  onClick={() => setBookInputMode("line")}
                  className={`book-tool-btn ${bookInputMode === "line" ? "active" : ""}`}
                  title="Draw Straight Line"
                >
                  ╱ Line
                </button>

                <button
                  type="button"
                  onClick={() => setBookInputMode("rect")}
                  className={`book-tool-btn ${bookInputMode === "rect" ? "active" : ""}`}
                  title="Draw Rectangle / Box"
                >
                  ▭ Box
                </button>

                <button
                  type="button"
                  onClick={() => setBookInputMode("circle")}
                  className={`book-tool-btn ${bookInputMode === "circle" ? "active" : ""}`}
                  title="Draw Circle / Ellipse"
                >
                  ◯ Circle
                </button>

                <button
                  type="button"
                  onClick={() => setBookInputMode("arrow")}
                  className={`book-tool-btn ${bookInputMode === "arrow" ? "active" : ""}`}
                  title="Draw Pointer Arrow"
                >
                  ↗ Arrow
                </button>

                <button
                  type="button"
                  onClick={() => setBookInputMode("erase")}
                  className={`book-tool-btn ${bookInputMode === "erase" ? "active" : ""}`}
                  title="Ink & Shape Eraser"
                >
                  🧹 Erase
                </button>
              </div>

              {bookInputMode === "write" ? (
                <select
                  className="pro-select"
                  style={{ width: "138px", padding: "6px 10px", fontSize: "12px" }}
                  value={bookFontFamily}
                  onChange={(e) => setBookFontFamily(e.target.value)}
                >
                  <option value="'Caveat', cursive">Cursive Script</option>
                  <option value="'Kalam', cursive">Neat Marker</option>
                  <option value="'Patrick Hand', cursive">Pen Print</option>
                </select>
              ) : (
                <select
                  className="pro-select"
                  style={{ width: "110px", padding: "6px 10px", fontSize: "12px" }}
                  value={bookPenSize}
                  onChange={(e) => setBookPenSize(Number(e.target.value))}
                  title="Stroke Thickness"
                >
                  <option value={2}>Fine (2px)</option>
                  <option value={3.5}>Medium (3.5px)</option>
                  <option value={6}>Bold (6px)</option>
                  <option value={10}>Marker (10px)</option>
                </select>
              )}

              {/* PRESET COLORS + CUSTOM COLOR PICKER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  background: "#090c14",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {[
                  { label: "Royal Blue", color: "#1e3a8a" },
                  { label: "Obsidian Black", color: "#0f172a" },
                  { label: "Crimson Red", color: "#dc2626" },
                  { label: "Emerald Green", color: "#047857" },
                  { label: "Purple", color: "#7c3aed" },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    title={c.label}
                    onClick={() => setActiveColorValue(c.color)}
                    style={{
                      width: "21px",
                      height: "21px",
                      borderRadius: "50%",
                      background: c.color,
                      border:
                        activeColorValue === c.color
                          ? "2px solid #ffffff"
                          : "1px solid rgba(255,255,255,0.25)",
                      cursor: "pointer",
                      transform: activeColorValue === c.color ? "scale(1.12)" : "scale(1)",
                      transition: "all 0.18s ease-in-out",
                    }}
                  />
                ))}

                <input
                  type="color"
                  className="book-color-picker-input"
                  title="Pick Any Custom Ink / Pen Color"
                  value={activeColorValue}
                  onChange={(e) => setActiveColorValue(e.target.value)}
                />
              </div>
            </div>

            {/* RIGHT: UNIFIED SHARE, DOWNLOAD PDF & SAVE-AND-RETURN BUTTONS */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShareNoteModal({ isOpen: true, note: activeBook })}
                className="reg-action-btn"
                title="Share Register with Friend or Community"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadBookPdf(activeBook)}
                className="reg-action-btn"
                title="Download Register as PDF"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>PDF</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveActiveBook(true)}
                disabled={bookSaving}
                className="pro-btn-primary"
                style={{
                  padding: "8px 16px",
                  fontSize: "12.5px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                }}
              >
                {bookSaving ? "Saving..." : "✓ Save & Return"}
              </button>
            </div>
          </div>

          {/* 3D HARDCOVER REGISTER STAGE WITH METALLIC SPIRAL SPINE */}
          <div className="book-3d-stage">
            <div className={`book-hardcover-shell ${bookClosingAnim ? "closing" : ""}`}>
              <div className={`book-spread-container ${pageTurnAnim}`}>
                <div className="book-center-spine">
                  {Array.from({ length: 12 }).map((_, rIdx) => (
                    <span key={rIdx} className="book-spiral-ring" />
                  ))}
                </div>

                <RuledBookPage
                  side="left"
                  pageData={leftPageData}
                  bookTitle={activeBook.title}
                  bookSubject={activeBook.subject}
                  createdDateStr={new Date(
                    activeBook.createdAt || Date.now()
                  ).toLocaleDateString()}
                  inputMode={bookInputMode}
                  inkColor={bookInkColor}
                  penColor={bookPenColor}
                  penSize={bookPenSize}
                  fontFamily={bookFontFamily}
                  onTextChange={(val) => updateActiveBookPage(leftPageIndex, "text", val)}
                  onDrawingChange={(dataUrl) =>
                    updateActiveBookPage(leftPageIndex, "drawing", dataUrl)
                  }
                />

                <RuledBookPage
                  side="right"
                  pageData={rightPageData}
                  bookTitle={activeBook.title}
                  bookSubject={activeBook.subject}
                  createdDateStr={new Date(
                    activeBook.createdAt || Date.now()
                  ).toLocaleDateString()}
                  inputMode={bookInputMode}
                  inkColor={bookInkColor}
                  penColor={bookPenColor}
                  penSize={bookPenSize}
                  fontFamily={bookFontFamily}
                  onTextChange={(val) =>
                    updateActiveBookPage(rightPageIndex, "text", val)
                  }
                  onDrawingChange={(dataUrl) =>
                    updateActiveBookPage(rightPageIndex, "drawing", dataUrl)
                  }
                />
              </div>
            </div>
          </div>

          <div className="book-bottom-nav">
            <button
              type="button"
              disabled={bookSpreadIndex === 0}
              onClick={() => handleTurnBookSpread("prev")}
              className="pro-btn-secondary"
            >
              ⬅ Previous Spread
            </button>

            <div style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: 600 }}>
              Pages{" "}
              <strong style={{ color: "#818cf8" }}>
                {leftPageIndex + 1} & {rightPageIndex + 1}
              </strong>{" "}
              • Tool:{" "}
              <strong style={{ color: "#34d399", textTransform: "uppercase" }}>
                {bookInputMode === "write"
                  ? "Keyboard Handwriting"
                  : `${bookInputMode} (+ Crosshair • Shift = Straight Line)`}
              </strong>
            </div>

            <button
              type="button"
              onClick={() => handleTurnBookSpread("next")}
              className="pro-btn-primary"
            >
              Next Spread (Pages {leftPageIndex + 3}–{rightPageIndex + 3}) ➔
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          CREATE LIVE POLL MODAL POPUP
         ==================================================================== */}
      {showPollModal && (
        <div
          className="pro-popup-overlay"
          onClick={() => setShowPollModal(false)}
        >
          <div
            className="pro-popup-modal"
            style={{ maxWidth: "460px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>
                Create Live Poll
              </h3>
              <button
                type="button"
                onClick={() => setShowPollModal(false)}
                className="modal-close-icon-btn"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreatePollSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div>
                <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                  Poll Question
                </label>
                <input
                  type="text"
                  className="pro-input"
                  placeholder="e.g. Which topic should we revise in tomorrow's session?"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  required
                />
              </div>

              {pollOptions.map((opt, idx) => (
                <div key={idx}>
                  <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                    Option {idx + 1} {idx >= 2 ? "(Optional)" : ""}
                  </label>
                  <input
                    type="text"
                    className="pro-input"
                    placeholder={`Choice ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const next = [...pollOptions];
                      next[idx] = e.target.value;
                      setPollOptions(next);
                    }}
                    required={idx < 2}
                  />
                </div>
              ))}

              {pollOptions.length < 5 && (
                <button
                  type="button"
                  onClick={() => setPollOptions([...pollOptions, ""])}
                  className="pro-btn-secondary"
                  style={{ alignSelf: "flex-start", padding: "6px 12px", fontSize: "12px" }}
                >
                  + Add Option
                </button>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setShowPollModal(false)}
                  className="pro-btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button type="submit" className="pro-btn-primary" style={{ flex: 1 }}>
                  Publish Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          INVITE REGISTERED MEMBERS TO COMMUNITY MODAL
         ==================================================================== */}
      {showInviteModal && activeFriend?.isCommunity && (
        <div
          className="pro-popup-overlay"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="pro-popup-modal"
            style={{ maxWidth: "480px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>
                Invite Members to "{activeFriend.studentName}"
              </h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="modal-close-icon-btn"
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
              Send a direct community join request to any registered student or faculty member:
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxHeight: "340px",
                overflowY: "auto",
              }}
            >
              {socialOverview.directory.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                  No other registered users found.
                </div>
              ) : (
                socialOverview.directory.map((target) => {
                  const alreadyMember = (activeFriend.members || []).some(
                    (m) => String(m.studentId) === String(target.studentId)
                  );
                  return (
                    <div
                      key={target.studentId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        background: "#161b26",
                        borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          className={`scholar-avatar-wrap ${
                            target.isFaculty ? "faculty-avatar" : ""
                          }`}
                          style={{ width: "36px", height: "36px", fontSize: "14px" }}
                        >
                          {target.avatar ? (
                            <img src={target.avatar} alt={target.studentName} />
                          ) : (
                            String(target.studentName || "S").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#fff" }}>
                              {target.studentName}
                            </span>
                            {renderChatTierBadge(target.tier, target.isFaculty)}
                          </div>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                            {target.phone || target.studentEmail}
                          </div>
                        </div>
                      </div>

                      {alreadyMember ? (
                        <span style={{ fontSize: "11.5px", color: "#34d399", fontWeight: 700 }}>
                          Member
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendCommunityJoinInvite(target)}
                          className="pro-btn-primary"
                          style={{ padding: "6px 12px", fontSize: "11.5px" }}
                        >
                          Send Join Invite
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          CREATE STUDY COMMUNITY MODAL POPUP
         ==================================================================== */}
      {showCreateCommModal && (
        <div
          className="pro-popup-overlay"
          onClick={() => setShowCreateCommModal(false)}
        >
          <div
            className="pro-popup-modal"
            style={{ maxWidth: "480px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>
                Create New Study Community
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateCommModal(false)}
                className="modal-close-icon-btn"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateCommunitySubmit}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                  Community Name
                </label>
                <input
                  type="text"
                  className="pro-input"
                  placeholder="e.g. Computer Science & Math Solvers"
                  value={newCommName}
                  onChange={(e) => setNewCommName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                  Academic Subject / Domain
                </label>
                <input
                  type="text"
                  className="pro-input"
                  placeholder="e.g. Physics, Mathematics, Computer Science"
                  value={newCommSubject}
                  onChange={(e) => setNewCommSubject(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                  Community Description
                </label>
                <input
                  type="text"
                  className="pro-input"
                  placeholder="Share 3D notes, live polls, PDFs, photos, and exam results..."
                  value={newCommDesc}
                  onChange={(e) => setNewCommDesc(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateCommModal(false)}
                  className="pro-btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={commCreating}
                  className="pro-btn-primary"
                  style={{ flex: 1, background: "linear-gradient(135deg, #10b981, #059669)" }}
                >
                  {commCreating ? "Creating..." : "Create Community"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          SHARE 3D NOTEBOOK TO FRIEND OR COMMUNITY MODAL
         ==================================================================== */}
      {shareNoteModal.isOpen && (
        <div
          className="pro-popup-overlay"
          onClick={() => setShareNoteModal({ isOpen: false, note: null })}
        >
          <div
            className="pro-popup-modal"
            style={{ maxWidth: "480px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>
                Share 3D Register: "{shareNoteModal.note?.title}"
              </h3>
              <button
                type="button"
                onClick={() => setShareNoteModal({ isOpen: false, note: null })}
                className="modal-close-icon-btn"
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "14px" }}>
              Choose any connected Contact or Study Community to send this 3D Register:
            </p>

            {socialOverview.friends.length === 0 &&
            socialOverview.communities.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                No contacts or communities yet. Open <strong>Scholar Connect & Chat</strong> first!
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  maxHeight: "340px",
                  overflowY: "auto",
                }}
              >
                {[...socialOverview.friends, ...socialOverview.communities].map(
                  (target) => (
                    <div
                      key={target.studentId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        background: "#161b26",
                        borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          className="scholar-avatar-wrap"
                          style={{ width: "36px", height: "36px", fontSize: "14px" }}
                        >
                          {target.isCommunity
                            ? "GRP"
                            : target.avatar ? (
                                <img src={target.avatar} alt={target.studentName} />
                              ) : (
                                String(target.studentName || "S")
                                  .charAt(0)
                                  .toUpperCase()
                              )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "#fff" }}>
                            {target.studentName}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                            {target.isCommunity
                              ? `Community • ${target.subject || "Study Group"}`
                              : target.phone || target.studentEmail || "Contact"}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          const noteToShare = shareNoteModal.note;
                          setShareNoteModal({ isOpen: false, note: null });
                          setActiveFriend(target);
                          setActiveTab("scholar-chat");

                          const notePayload = {
                            title: noteToShare.title,
                            subject: noteToShare.subject,
                            inkColor: noteToShare.inkColor,
                            fontFamily: noteToShare.fontFamily,
                            pages: noteToShare.pages,
                            authorName: studentName,
                          };

                          await handleSendDirectMessage(
                            null,
                            "shared-note",
                            notePayload,
                            target
                          );
                          setBannerMsg({
                            type: "success",
                            text: `3D Register "${noteToShare.title}" shared with ${target.studentName}!`,
                          });
                        }}
                        className="pro-btn-primary"
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          background: "#10b981",
                        }}
                      >
                        Send Note →
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          SHARE EXAM RESULT SCORECARD TO FRIEND OR COMMUNITY MODAL
         ==================================================================== */}
      {shareResultModal.isOpen && (
        <div
          className="pro-popup-overlay"
          onClick={() => setShareResultModal({ isOpen: false, quiz: null })}
        >
          <div
            className="pro-popup-modal"
            style={{ maxWidth: "480px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>
                Share Exam Result Scorecard ({shareResultModal.quiz?.percentage || 0}%)
              </h3>
              <button
                type="button"
                onClick={() => setShareResultModal({ isOpen: false, quiz: null })}
                className="modal-close-icon-btn"
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "14px" }}>
              Select a Contact or Study Community to share your scorecard for{" "}
              <strong>"{shareResultModal.quiz?.title}"</strong>:
            </p>

            {socialOverview.friends.length === 0 &&
            socialOverview.communities.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                No contacts or communities yet. Open <strong>Scholar Connect & Chat</strong> first!
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  maxHeight: "340px",
                  overflowY: "auto",
                }}
              >
                {[...socialOverview.friends, ...socialOverview.communities].map(
                  (target) => (
                    <div
                      key={target.studentId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        background: "#161b26",
                        borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          className="scholar-avatar-wrap"
                          style={{ width: "36px", height: "36px", fontSize: "14px" }}
                        >
                          {target.isCommunity
                            ? "GRP"
                            : target.avatar ? (
                                <img src={target.avatar} alt={target.studentName} />
                              ) : (
                                String(target.studentName || "S")
                                  .charAt(0)
                                  .toUpperCase()
                              )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "#fff" }}>
                            {target.studentName}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                            {target.isCommunity
                              ? "Community"
                              : target.phone || "Contact"}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          const qToShare = shareResultModal.quiz;
                          setShareResultModal({ isOpen: false, quiz: null });
                          setActiveFriend(target);
                          setActiveTab("scholar-chat");

                          const isOral = isOralExamItem(qToShare);
                          const totalQ =
                            qToShare.totalQuestions ||
                            qToShare.questions?.length ||
                            (isOral ? 10 : 20);

                          const resultPayload = {
                            title: qToShare.title,
                            examType: isOral ? "oral" : "quiz",
                            score: qToShare.score || 0,
                            totalQuestions: totalQ,
                            percentage: qToShare.percentage || 0,
                            grade: qToShare.grade || "B",
                            stars: qToShare.stars || 3,
                            passed: Boolean(
                              qToShare.passed || (qToShare.percentage || 0) >= 60
                            ),
                            authorName: studentName,
                          };

                          await handleSendDirectMessage(
                            null,
                            "shared-result",
                            resultPayload,
                            target
                          );
                          setBannerMsg({
                            type: "success",
                            text: `Exam Result shared with ${target.studentName}!`,
                          });
                        }}
                        className="pro-btn-primary"
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          background: "#10b981",
                        }}
                      >
                        Send Result →
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LUXURY 3D ANIMATED DELETE MODAL POPUP */}
      {deleteModal.isOpen && (
        <div
          onClick={closeDeletePopup}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(5, 7, 12, 0.82)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "430px",
              background: "linear-gradient(145deg, #151926 0%, #0d1018 100%)",
              border: "1px solid rgba(239, 68, 68, 0.38)",
              borderRadius: "20px",
              padding: "30px 28px",
              boxShadow:
                "0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(239, 68, 68, 0.15)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                background: "rgba(239, 68, 68, 0.14)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px auto",
                color: "#f87171",
              }}
            >
              🗑️
            </div>

            <h3 style={{ margin: "0 0 8px 0", fontSize: "19px", color: "#ffffff" }}>
              {deleteModal.title || "Confirm Deletion"}
            </h3>

            <p style={{ margin: "0 0 24px 0", fontSize: "13.5px", color: "#94a3b8" }}>
              {deleteModal.subtitle ||
                "This item will be permanently removed from your workspace."}
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={closeDeletePopup}
                className="pro-btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="pro-btn-danger"
                style={{
                  flex: 1,
                  background: "#ef4444",
                  color: "#fff",
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXECUTIVE METRICS ROW */}
      <div className="vip-metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-details">
            <span className="metric-label">Academic Standing</span>
            <span className="metric-value">
              Level {stats.level || 1} ({stats.totalXp || 0} XP)
            </span>
          </div>
        </div>

        <div
          className="metric-card"
          style={{ cursor: "pointer" }}
          onClick={() => setActiveTab("classroom")}
        >
          <div className="metric-icon amber">📚</div>
          <div className="metric-details">
            <span className="metric-label">Classroom Assignments</span>
            <span className="metric-value">
              {classroomAssignments.length} Assigned ({mySubmittedAssignments.length} Done)
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon emerald">🏆</div>
          <div className="metric-details">
            <span className="metric-label">Average Accuracy (Pass: 60%)</span>
            <span className="metric-value">{stats.avgQuizPercentage || 0}%</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🗺️</div>
          <div className="metric-details">
            <span className="metric-label">Roadmap Progress</span>
            <span className="metric-value">{taskCompletionPercent}% Completed</span>
          </div>
        </div>
      </div>

      {/* STATUS NOTIFICATION BANNER */}
      {bannerMsg.text && (
        <div className={`status-alert ${bannerMsg.type}`}>
          <span>{bannerMsg.text}</span>
          <button
            onClick={() => setBannerMsg({ type: "", text: "" })}
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ====================================================================
          STUDENT GOOGLE CLASSROOM ASSIGNMENTS PORTAL
         ==================================================================== */}
      {activeTab === "classroom" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            className="gc-3d-panel"
            style={{
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 4px 0", fontSize: "19px", color: "#fff" }}>
                Classwork & Assignments
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
                Review assigned coursework, preview your attached Video, Image, or PDF in the "Your Work" panel, and turn in before the deadline.
              </p>
            </div>
            <span className="vip-pill-badge">{classroomAssignments.length} Assigned</span>
          </div>

          {classroomAssignments.length === 0 ? (
            <div
              className="gc-3d-panel"
              style={{ textAlign: "center", padding: "48px 24px", color: "#94a3b8" }}
            >
              No classwork assigned right now.
            </div>
          ) : (
            classroomAssignments.map((asgn) => {
              const timerObj = formatAssignmentCountdown(asgn.dueDate);
              const mySub = getMySubmissionForAssignment(asgn);
              const isFirstMe = mySub && mySub.submissionRank === 1;
              const currentAnswerVal =
                asgnAnswerInputs[asgn._id] !== undefined
                  ? asgnAnswerInputs[asgn._id]
                  : mySub?.answerText || "";
              const selectedFileObj = asgnSelectedFiles[asgn._id] || null;
              const localPreviewUrl = asgnPreviewUrls[asgn._id] || "";

              return (
                <div key={asgn._id} className="gc-student-assignment-row">
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                      <span className="vip-pill-badge">{asgn.subject}</span>
                      <span className="gc-rank-pill">{asgn.totalMarks} Points</span>
                      <span className={`gc-timer-pill ${timerObj.expired ? "expired" : ""}`}>
                        {timerObj.expired
                          ? "Deadline Passed"
                          : timerObj.label.replace("⏳ Due Timer: ", "Due in ")}
                      </span>
                      {mySub && (
                        <span className={`gc-rank-pill ${isFirstMe ? "rank-1" : ""}`}>
                          {isFirstMe ? "#1 First Submitter" : `Submission #${mySub.submissionRank}`}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "20px", color: "#ffffff" }}>
                        {asgn.title}
                      </h3>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        Posted by {asgn.facultyName || "Faculty"} • Due{" "}
                        {new Date(asgn.dueDate).toLocaleString()}
                      </div>
                    </div>

                    {asgn.description && (
                      <div
                        style={{
                          padding: "14px 16px",
                          background: "#090c14",
                          borderRadius: "10px",
                          border: "1px solid rgba(255,255,255,0.06)",
                          fontSize: "13.5px",
                          color: "#cbd5e1",
                          lineHeight: 1.6,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {asgn.description}
                      </div>
                    )}

                    {asgn.referenceFileUrl && (
                      <div className="gc-media-preview-card" style={{ maxWidth: "460px" }}>
                        <div className="gc-media-preview-header">
                          <span>Reference Material: {asgn.referenceFileName}</span>
                          <a
                            href={asgn.referenceFileUrl}
                            download={asgn.referenceFileName || "Reference"}
                            style={{ color: "#818cf8", textDecoration: "none", fontSize: "11.5px" }}
                          >
                            Download
                          </a>
                        </div>
                        {asgn.referenceFileType === "video" && (
                          <video src={asgn.referenceFileUrl} controls className="gc-preview-video" />
                        )}
                        {asgn.referenceFileType === "image" && (
                          <img src={asgn.referenceFileUrl} alt="Reference" className="gc-preview-img" />
                        )}
                        {asgn.referenceFileType === "pdf" && (
                          <iframe
                            src={asgn.referenceFileUrl}
                            title="Reference PDF"
                            className="gc-preview-pdf"
                          />
                        )}
                      </div>
                    )}

                    {mySub && mySub.status === "Graded" && (
                      <div
                        style={{
                          padding: "14px 16px",
                          borderRadius: "12px",
                          background: "rgba(16, 185, 129, 0.08)",
                          border: "1px solid rgba(16, 185, 129, 0.35)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "11.5px",
                              fontWeight: 700,
                              color: "#34d399",
                              textTransform: "uppercase",
                            }}
                          >
                            Returned Grade & Evaluation
                          </div>
                          <div style={{ fontSize: "13px", color: "#e2e8f0", marginTop: "4px" }}>
                            {mySub.feedback || "Evaluated by faculty."}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "22px", fontWeight: 800, color: "#34d399" }}>
                            {mySub.obtainedMarks} / {asgn.totalMarks}
                          </div>
                          <div>{renderStars(mySub.stars || 5)}</div>
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: "6px",
                        paddingTop: "12px",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", marginBottom: "8px" }}>
                        Class Comments ({(asgn.comments || []).length})
                      </div>
                      {(asgn.comments || []).length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            maxHeight: "140px",
                            overflowY: "auto",
                            marginBottom: "10px",
                          }}
                        >
                          {(asgn.comments || []).map((c, idx) => (
                            <div
                              key={idx}
                              style={{
                                fontSize: "12.5px",
                                padding: "7px 10px",
                                background: "#090c14",
                                borderRadius: "8px",
                              }}
                            >
                              <strong
                                style={{
                                  color: c.senderRole === "faculty" ? "#34d399" : "#818cf8",
                                }}
                              >
                                {c.senderName}:
                              </strong>{" "}
                              <span style={{ color: "#cbd5e1" }}>{c.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <form
                        onSubmit={(e) => handlePostStudentAssignmentComment(e, asgn._id)}
                        style={{ display: "flex", gap: "8px" }}
                      >
                        <input
                          type="text"
                          className="pro-input"
                          style={{ padding: "8px 12px", fontSize: "12.5px" }}
                          placeholder="Ask a question to your teacher..."
                          value={asgnCommentInputs[asgn._id] || ""}
                          onChange={(e) =>
                            setAsgnCommentInputs((prev) => ({
                              ...prev,
                              [asgn._id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          type="submit"
                          className="pro-btn-secondary"
                          style={{ padding: "8px 14px", fontSize: "12px" }}
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="gc-your-work-box">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>
                        Your Work
                      </span>
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 700,
                          color:
                            mySub?.status === "Graded"
                              ? "#34d399"
                              : mySub
                              ? "#818cf8"
                              : timerObj.expired
                              ? "#f87171"
                              : "#fbbf24",
                        }}
                      >
                        {mySub?.status === "Graded"
                          ? `${mySub.obtainedMarks}/${asgn.totalMarks}`
                          : mySub
                          ? "Turned in"
                          : timerObj.expired
                          ? "Missing"
                          : "Assigned"}
                      </span>
                    </div>

                    {selectedFileObj && localPreviewUrl && (
                      <div className="gc-media-preview-card">
                        <div className="gc-media-preview-header">
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "210px",
                            }}
                          >
                            Ready: {selectedFileObj.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSelectStudentAssignmentFile(asgn._id, null)}
                            className="gc-media-remove-btn"
                            title="Remove file"
                          >
                            ✕
                          </button>
                        </div>

                        {selectedFileObj.type.startsWith("video/") && (
                          <video src={localPreviewUrl} controls className="gc-preview-video" />
                        )}
                        {selectedFileObj.type.startsWith("image/") && (
                          <img src={localPreviewUrl} alt="Preview" className="gc-preview-img" />
                        )}
                        {selectedFileObj.type === "application/pdf" && (
                          <iframe
                            src={localPreviewUrl}
                            title="PDF Preview"
                            className="gc-preview-pdf"
                          />
                        )}
                      </div>
                    )}

                    {!selectedFileObj && mySub?.fileUrl && (
                      <div className="gc-media-preview-card">
                        <div className="gc-media-preview-header">
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "230px",
                            }}
                          >
                            Submitted: {mySub.fileName}
                          </span>
                        </div>
                        {mySub.fileType === "video" && (
                          <video src={mySub.fileUrl} controls className="gc-preview-video" />
                        )}
                        {mySub.fileType === "image" && (
                          <img src={mySub.fileUrl} alt={mySub.fileName} className="gc-preview-img" />
                        )}
                        {mySub.fileType === "pdf" && (
                          <iframe
                            src={mySub.fileUrl}
                            title="Submitted PDF"
                            className="gc-preview-pdf"
                          />
                        )}
                      </div>
                    )}

                    {!timerObj.expired ? (
                      <form
                        onSubmit={(e) => handleSubmitClassroomAssignment(e, asgn)}
                        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                      >
                        <textarea
                          className="pro-input"
                          style={{ minHeight: "74px", fontSize: "12.5px", resize: "vertical" }}
                          placeholder="Write your response or notes (optional)..."
                          value={currentAnswerVal}
                          onChange={(e) =>
                            setAsgnAnswerInputs((prev) => ({
                              ...prev,
                              [asgn._id]: e.target.value,
                            }))
                          }
                        />

                        <label className="gc-upload-trigger">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          <span>
                            {selectedFileObj ? "Change File" : "Add Video, Photo, or PDF"}
                          </span>
                          <input
                            type="file"
                            accept="video/*,image/*,.pdf"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleSelectStudentAssignmentFile(
                                asgn._id,
                                e.target.files?.[0] || null
                              )
                            }
                          />
                        </label>

                        <button
                          type="submit"
                          disabled={asgnSubmittingId === asgn._id}
                          className="pro-btn-primary"
                          style={{ width: "100%" }}
                        >
                          {asgnSubmittingId === asgn._id
                            ? "Turning in..."
                            : mySub
                            ? "Resubmit"
                            : "Turn in"}
                        </button>
                      </form>
                    ) : (
                      <div
                        style={{
                          padding: "12px",
                          borderRadius: "9px",
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          color: "#fca5a5",
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                      >
                        Submissions closed after deadline.
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ====================================================================
          SECTION: CREATE NOTES (REAL-LIFE 3D HARDCOVER REGISTER SHELF & STUDIO)
         ==================================================================== */}
      {activeTab === "notes" && (
        <div className="edit-profile-container">
          <div className="edit-profile-header">
            <h2>3D Interactive Academic Registers (Create Notes)</h2>
            <p>
              Create hardcover subject registers, open them in full 3D spiral-bound view, write in realistic handwriting, draw shapes or straight lines (Hold Shift), pick custom colors, export to PDF, or share with classmates!
            </p>
          </div>

          <form
            onSubmit={handleCreateNotebook}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
              marginBottom: "26px",
              padding: "18px",
              background: "#161b26",
              borderRadius: "14px",
              border: "1px solid rgba(99, 102, 241, 0.28)",
              alignItems: "end",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "11.5px",
                  color: "#94a3b8",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Register Title
              </label>
              <input
                type="text"
                className="pro-input"
                placeholder="e.g. Data Structures Complete Register"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "11.5px",
                  color: "#94a3b8",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Academic Subject
              </label>
              <input
                type="text"
                className="pro-input"
                placeholder="e.g. Computer Science, Calculus, Physics"
                value={newNoteSubject}
                onChange={(e) => setNewNoteSubject(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="pro-btn-primary"
              style={{ height: "44px" }}
              disabled={noteCreating}
            >
              {noteCreating ? "Creating Register..." : "📖 + Create 3D Register"}
            </button>
          </form>

          {editingNoteMeta && (
            <form
              onSubmit={handleUpdateNoteMetaSubmit}
              style={{
                background: "#161b26",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "22px",
                border: "1px solid #6366f1",
              }}
            >
              <h4 style={{ margin: "0 0 14px 0" }}>Edit Register Title & Subject</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                  marginBottom: "14px",
                }}
              >
                <div>
                  <label style={{ fontSize: "12px", color: "#cbd5e1", display: "block", marginBottom: "5px" }}>
                    Register Title
                  </label>
                  <input
                    type="text"
                    className="pro-input"
                    value={editingNoteMeta.title}
                    onChange={(e) =>
                      setEditingNoteMeta({ ...editingNoteMeta, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", color: "#cbd5e1", display: "block", marginBottom: "5px" }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    className="pro-input"
                    value={editingNoteMeta.subject}
                    onChange={(e) =>
                      setEditingNoteMeta({ ...editingNoteMeta, subject: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="pro-btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingNoteMeta(null)}
                  className="pro-btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <h3 style={{ fontSize: "16px", marginBottom: "16px" }}>
            Your 3D Hardcover Register Shelf ({notes.length})
          </h3>

          {notes.length === 0 ? (
            <div
              style={{
                padding: "36px",
                textAlign: "center",
                background: "#161b26",
                borderRadius: "12px",
                color: "#94a3b8",
                fontSize: "13.5px",
              }}
            >
              No registers created yet. Enter a Title and Subject above to create your first 3D Hardcover Register!
            </div>
          ) : (
            <div className="register-shelf-grid">
              {notes.map((nb) => {
                const createdDate = new Date(nb.createdAt || Date.now()).toLocaleDateString(
                  undefined,
                  { year: "numeric", month: "short", day: "numeric" }
                );
                const pageCount = Array.isArray(nb.pages) ? nb.pages.length : 4;

                return (
                  <div key={nb._id} className="register-3d-card">
                    <div className="register-label-plate">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <span className="vip-pill-badge">{nb.subject}</span>
                        <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>
                          {createdDate}
                        </span>
                      </div>

                      <h4
                        style={{
                          margin: "0 0 6px 0",
                          fontSize: "17.5px",
                          color: "#ffffff",
                          fontWeight: 800,
                          letterSpacing: "-0.2px",
                        }}
                      >
                        {nb.title}
                      </h4>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span>{pageCount} Ruled Pages</span>
                        <span>•</span>
                        <span style={{ color: "#a5b4fc" }}>3D Spiral Register</span>
                      </div>
                    </div>

                    <div className="register-actions-row">
                      <button
                        type="button"
                        onClick={() => handleOpen3DBook(nb)}
                        className="pro-btn-primary"
                        style={{
                          flex: 1,
                          padding: "9px 14px",
                          fontSize: "12.5px",
                        }}
                      >
                        📖 Open Register
                      </button>

                      {/* IDENTICAL CSS (.reg-action-btn) & CRISP SVG ICONS FOR SHARE, DOWNLOAD & EDIT */}
                      <button
                        type="button"
                        onClick={() => setShareNoteModal({ isOpen: true, note: nb })}
                        className="reg-action-btn"
                        title="Share Register with Friend or Community"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        <span>Share</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadBookPdf(nb)}
                        className="reg-action-btn"
                        title="Download Register PDF"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingNoteMeta(nb)}
                        className="reg-action-btn"
                        title="Edit Register Title & Subject"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openDeletePopup({
                            type: "note",
                            id: nb._id,
                            title: "Delete 3D Register?",
                            subtitle: `Are you sure you want to permanently delete "${nb.title}"?`,
                          })
                        }
                        className="pro-btn-danger"
                        style={{ padding: "8px 10px", fontSize: "12px" }}
                        title="Delete Register"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          SECTION 1: ADVANCED AI PERSONAL TUTOR (BILINGUAL VOICE + PDF + IMAGE)
         ==================================================================== */}
      {activeTab === "tutor" && (
        <div className="edit-profile-container">
          <div
            className="edit-profile-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2>AI Personal Tutor & Multimodal Studio</h2>
              <p>
                Speak or type in Urdu/Roman Urdu or English. Analyze uploaded PDFs & images, generate non-empty PDF notes, or create HD educational diagrams.
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <select
                className="pro-select"
                style={{ width: "185px", padding: "8px 12px", fontSize: "12.5px" }}
                value={voiceLang}
                onChange={(e) => setVoiceLang(e.target.value)}
              >
                <option value="en-US">🎙️ Mic Mode: English</option>
                <option value="ur-PK">🎙️ Mic Mode: Urdu / Roman Urdu</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  if (autoVoiceReply) stopSpeaking();
                  setAutoVoiceReply(!autoVoiceReply);
                }}
                className={autoVoiceReply ? "pro-btn-primary" : "pro-btn-secondary"}
                style={{ padding: "8px 14px", fontSize: "12.5px" }}
              >
                {autoVoiceReply ? "🔊 Voice Reply: ON" : "🔇 Voice Reply: OFF"}
              </button>

              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="pro-btn-danger"
                  style={{ padding: "8px 12px", fontSize: "12.5px" }}
                >
                  ⏹️ Stop Audio
                </button>
              )}

              {messages.length > 0 && (
                <button
                  onClick={() =>
                    openDeletePopup({
                      type: "chat",
                      id: "all",
                      title: "Clear Conversation History?",
                      subtitle: "All messages in your AI Tutor chat will be permanently cleared.",
                    })
                  }
                  className="pro-btn-danger"
                  style={{ padding: "8px 14px", fontSize: "12.5px" }}
                >
                  Clear Chat
                </button>
              )}
            </div>
          </div>

          <div className="cyber-chat-window">
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", color: "#64748b", marginTop: "75px" }}>
                <h3 style={{ color: "#f8fafc", marginBottom: "8px" }}>
                  Welcome to AI Multimodal Tutor, {studentName}
                </h3>
                <p style={{ fontSize: "13.5px", maxWidth: "580px", margin: "0 auto 18px auto" }}>
                  Urdu / Roman Urdu me poochein to Roman Urdu me jawab milega, aur English me poochein to English me! Aap PDF upload karke sawal pooch sakte hain ya 1-click me PDF aur Educational Image bana sakte hain.
                </p>

                <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="pro-btn-secondary"
                    onClick={() =>
                      setChatInput("Bootstrap aur jQuery kya hai? Roman Urdu me code ke sath samjhao")
                    }
                  >
                    🇵🇰 Ask in Roman Urdu
                  </button>
                  <button
                    type="button"
                    className="pro-btn-secondary"
                    onClick={() =>
                      setChatInput("Explain Object-Oriented Programming pillars with code examples")
                    }
                  >
                    🇬🇧 Ask in English
                  </button>
                  <button
                    type="button"
                    className="pro-btn-secondary"
                    onClick={() =>
                      setChatInput("Create image diagram of Full-Stack Web Architecture")
                    }
                  >
                    🎨 Generate Educational Diagram
                  </button>
                </div>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} className={`cyber-msg ${m.role}`}>
                  {m.role === "user" && m.attachmentName && (
                    <div
                      style={{
                        fontSize: "11.5px",
                        color: "#e0e7ff",
                        marginBottom: "6px",
                        fontWeight: 600,
                      }}
                    >
                      📎 Uploaded File: {m.attachmentName}
                    </div>
                  )}

                  {m.role === "user" && m.attachmentPreview && (
                    <img
                      src={m.attachmentPreview}
                      alt="Uploaded"
                      style={{
                        maxWidth: "240px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    />
                  )}

                  {m.role === "assistant" ? (
                    <FormattedAiMessage text={m.text} />
                  ) : (
                    <div>{m.text}</div>
                  )}

                  {m.role === "assistant" &&
                    m.attachmentType === "generated-image" && (
                      <SmartEducationalImageCard
                        imageUrl={m.attachmentPreview}
                        topicTitle={m.attachmentName}
                        explanationText={m.text}
                      />
                    )}

                  {m.role === "assistant" && (
                    <div
                      style={{
                        marginTop: "12px",
                        paddingTop: "10px",
                        borderTop: "1px solid rgba(255,255,255,0.07)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => speakText(m.text)}
                        style={{
                          padding: "5px 11px",
                          borderRadius: "7px",
                          background: "rgba(16, 185, 129, 0.15)",
                          border: "1px solid rgba(16, 185, 129, 0.4)",
                          color: "#34d399",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        🔊 Listen Audio
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadChatNotePdf(
                            m.text,
                            m.attachmentName && m.attachmentName.endsWith(".pdf")
                              ? m.attachmentName
                              : `Study_Notes_${idx + 1}.pdf`
                          )
                        }
                        style={{
                          padding: "5px 12px",
                          borderRadius: "7px",
                          background: "rgba(99, 102, 241, 0.16)",
                          border: "1px solid rgba(99, 102, 241, 0.4)",
                          color: "#a5b4fc",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        📥 Download PDF Notes
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {chatFile && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(99, 102, 241, 0.16)",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                color: "#a5b4fc",
                fontSize: "12.5px",
                marginBottom: "10px",
              }}
            >
              <span>📎 Attached: {chatFile.name}</span>
              <button
                type="button"
                onClick={() => setChatFile(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fca5a5",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>
          )}

          <form
            onSubmit={handleSendChat}
            style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}
          >
            <button
              type="button"
              onClick={toggleMicrophoneListening}
              className="pro-btn-secondary"
              style={{
                borderColor: isListening ? "#ef4444" : "rgba(255,255,255,0.2)",
                color: isListening ? "#f87171" : "#fff",
                background: isListening ? "rgba(239, 68, 68, 0.18)" : undefined,
              }}
            >
              {isListening ? "🔴 Listening..." : "🎙️ Speak"}
            </button>

            <label className="cyber-file-label">
              📎 {chatFile ? chatFile.name.slice(0, 14) : "Upload PDF / Image"}
              <input
                type="file"
                accept=".pdf,image/*"
                style={{ display: "none" }}
                onChange={(e) => setChatFile(e.target.files?.[0] || null)}
              />
            </label>

            <input
              type="text"
              className="pro-input"
              style={{ flex: 1, minWidth: "220px" }}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask in Roman Urdu or English, ask about uploaded PDF, or type a topic..."
            />

            <button type="submit" className="pro-btn-primary" disabled={chatLoading}>
              {chatLoading ? "Thinking..." : "Send →"}
            </button>

            <button
              type="button"
              className="pro-btn-secondary"
              disabled={chatLoading}
              onClick={() => submitTutorRequest("pdf")}
              title="Generate Notes & Immediately Download Non-Empty PDF"
            >
              📄 Create PDF
            </button>

            <button
              type="button"
              className="pro-btn-secondary"
              disabled={chatLoading}
              onClick={() => submitTutorRequest("image")}
              title="Generate Educational Image / Diagram"
            >
              🎨 Generate Image
            </button>
          </form>
        </div>
      )}

      {/* ====================================================================
          SECTION 2: ACADEMIC ASSESSMENT CENTER (20-QUESTION PROCTORED QUIZZES)
         ==================================================================== */}
      {activeTab === "quiz-lab" && (
        <div className="edit-profile-container">
          <div className="edit-profile-header">
            <h2>Proctored Academic Assessment Center</h2>
            <p>
              Generate 20-question subject-specific or PDF-based examinations now or schedule them for a future date & time. Failed exams automatically generate a 7-Day Re-Attempt Exam here.
            </p>
          </div>

          <form
            onSubmit={handleGenerateQuiz}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
              marginBottom: "28px",
              padding: "18px",
              background: "#161b26",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.07)",
              alignItems: "end",
            }}
          >
            <div>
              <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                Subject / Topic Name
              </label>
              <input
                type="text"
                className="pro-input"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                placeholder="e.g. Physics, Mathematics, Computer Science"
              />
            </div>

            <div>
              <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                Source Document (Optional)
              </label>
              <label className="cyber-file-label" style={{ width: "100%", justifyContent: "center" }}>
                📄 {quizFile ? quizFile.name.slice(0, 16) : "Upload Notes / MCQ PDF"}
                <input
                  type="file"
                  accept=".pdf,image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setQuizFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div>
              <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                Schedule Start Time (Optional)
              </label>
              <input
                type="datetime-local"
                className="pro-input"
                value={quizScheduleTime}
                onChange={(e) => setQuizScheduleTime(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                Difficulty & Duration
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  className="pro-select"
                  value={quizDifficulty}
                  onChange={(e) => setQuizDifficulty(e.target.value)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <select
                  className="pro-select"
                  value={quizDurationMins}
                  onChange={(e) => setQuizDurationMins(Number(e.target.value))}
                >
                  <option value={15}>15 Mins</option>
                  <option value={20}>20 Mins</option>
                  <option value={30}>30 Mins</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="pro-btn-primary"
              style={{ height: "44px" }}
              disabled={quizGenLoading}
            >
              {quizGenLoading ? "Compiling..." : "Generate Assessment"}
            </button>
          </form>

          <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#f8fafc" }}>
            Pending & Rescheduled Examinations ({pendingQuizzes.length})
          </h3>

          {pendingQuizzes.length === 0 ? (
            <div
              style={{
                padding: "28px",
                textAlign: "center",
                background: "#161b26",
                borderRadius: "12px",
                color: "#94a3b8",
                fontSize: "13.5px",
              }}
            >
              No pending or rescheduled assessments right now.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {pendingQuizzes.map((q) => {
                const countdownStr = formatScheduleCountdown(q.scheduledFor);
                const isLocked = Boolean(countdownStr);
                const isReattempt =
                  q.isReattempt ||
                  q.title?.toLowerCase().includes("re-attempt") ||
                  q.sourceFileName?.toLowerCase().includes("re-attempt");

                return (
                  <div key={q._id} className="cyber-item-card" style={{ flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "240px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span className="vip-pill-badge">{q.difficulty}</span>
                        {isReattempt && (
                          <span
                            className="vip-pill-badge"
                            style={{
                              background: "rgba(245, 158, 11, 0.16)",
                              color: "#fbbf24",
                              borderColor: "rgba(245, 158, 11, 0.4)",
                            }}
                          >
                            🔄 PENDING • Rescheduled Re-Attempt
                          </span>
                        )}
                        {isLocked ? (
                          <span
                            className="vip-pill-badge"
                            style={{
                              background: "rgba(239, 68, 68, 0.16)",
                              color: "#fca5a5",
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            🔒 Locked • Unlocks in {countdownStr}
                          </span>
                        ) : (
                          <span
                            className="vip-pill-badge"
                            style={{
                              background: "rgba(16, 185, 129, 0.15)",
                              color: "#34d399",
                            }}
                          >
                            🔓 Unlocked & Ready
                          </span>
                        )}
                      </div>

                      <h4 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>{q.title}</h4>
                      <p style={{ margin: 0, fontSize: "12.5px", color: "#94a3b8" }}>
                        Status: <strong style={{ color: "#fbbf24" }}>Pending</strong> • Passing: 60% (12/20) • {q.sourceFileName}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleDownloadQuizPaperPdf(q)}
                        disabled={isLocked}
                        className="pro-btn-secondary"
                      >
                        {isLocked ? "🔒 Paper Locked" : "Download PDF"}
                      </button>

                      <button
                        onClick={() => handleStartQuiz(q)}
                        disabled={isLocked}
                        className="pro-btn-primary"
                      >
                        {isLocked ? `⏳ Unlocks in ${countdownStr}` : "Begin Proctored Exam"}
                      </button>

                      <button
                        onClick={() =>
                          openDeletePopup({
                            type: "quiz",
                            id: q._id,
                            title: "Delete Pending Assessment?",
                            subtitle: `Are you sure you want to permanently delete "${q.title}"?`,
                          })
                        }
                        className="pro-btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          SECTION 2B: AI ORAL TEST CENTER (10 SPOKEN QUESTIONS • VOICE EXAMINER)
         ==================================================================== */}
      {activeTab === "oral-lab" && (
        <div className="edit-profile-container">
          <div className="edit-profile-header">
            <h2>🎙️ AI Oral Test Center (10 Spoken Questions • Automated Voice Examiner)</h2>
            <p>
              Generate a 10-question Hands-Free Voice Oral Test from any subject (Physics, Math, Computer Science, React) or uploaded PDF. The AI Examiner speaks each question & options aloud, listens to your spoken answer, says "Okay, next question", and automatically grades your test in Results & Analytics!
            </p>
          </div>

          <form
            onSubmit={handleGenerateOralTest}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
              gap: "12px",
              marginBottom: "28px",
              padding: "18px",
              background: "#161b26",
              borderRadius: "12px",
              border: "1px solid rgba(16, 185, 129, 0.28)",
              alignItems: "end",
            }}
          >
            <div>
              <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                Oral Test Subject / Topic
              </label>
              <input
                type="text"
                className="pro-input"
                value={oralTopic}
                onChange={(e) => setOralTopic(e.target.value)}
                placeholder="e.g. Physics, Math, Computer, React"
              />
            </div>

            <div>
              <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                Source PDF (Optional)
              </label>
              <label className="cyber-file-label" style={{ width: "100%", justifyContent: "center" }}>
                📄 {oralFile ? oralFile.name.slice(0, 15) : "Upload Notes / MCQ PDF"}
                <input
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={(e) => setOralFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div>
              <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                AI Examiner Voice
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setOralVoiceGender("female")}
                  className={`voice-selector-pill ${oralVoiceGender === "female" ? "active" : ""}`}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  👩‍🏫 Female
                </button>
                <button
                  type="button"
                  onClick={() => setOralVoiceGender("male")}
                  className={`voice-selector-pill ${oralVoiceGender === "male" ? "active" : ""}`}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  👨‍🏫 Male
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                Schedule Start Time (Optional)
              </label>
              <input
                type="datetime-local"
                className="pro-input"
                value={oralScheduleTime}
                onChange={(e) => setOralScheduleTime(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                Difficulty & Timer
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  className="pro-select"
                  value={oralDifficulty}
                  onChange={(e) => setOralDifficulty(e.target.value)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <select
                  className="pro-select"
                  value={oralDurationMins}
                  onChange={(e) => setOralDurationMins(Number(e.target.value))}
                >
                  <option value={10}>10 Mins</option>
                  <option value={15}>15 Mins</option>
                  <option value={20}>20 Mins</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="pro-btn-primary"
              style={{
                height: "44px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              }}
              disabled={oralGenLoading}
            >
              {oralGenLoading ? "Compiling Oral..." : "🎙️ Generate Oral Test (10 Qs)"}
            </button>
          </form>

          <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#f8fafc" }}>
            Pending & Rescheduled AI Oral Tests ({pendingOralTests.length})
          </h3>

          {pendingOralTests.length === 0 ? (
            <div
              style={{
                padding: "28px",
                textAlign: "center",
                background: "#161b26",
                borderRadius: "12px",
                color: "#94a3b8",
                fontSize: "13.5px",
              }}
            >
              No pending AI Oral Tests right now. Enter a subject or upload a PDF above to generate a 10-question voice assessment.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {pendingOralTests.map((q) => {
                const countdownStr = formatScheduleCountdown(q.scheduledFor);
                const isLocked = Boolean(countdownStr);
                const isReattempt =
                  q.isReattempt ||
                  q.title?.toLowerCase().includes("re-attempt") ||
                  q.sourceFileName?.toLowerCase().includes("re-attempt");

                return (
                  <div
                    key={q._id}
                    className="cyber-item-card"
                    style={{
                      flexWrap: "wrap",
                      borderColor: "rgba(16, 185, 129, 0.35)",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "240px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span
                          className="vip-pill-badge"
                          style={{ background: "rgba(16, 185, 129, 0.18)", color: "#34d399" }}
                        >
                          🎙️ ORAL TEST • 10 Qs
                        </span>
                        <span className="vip-pill-badge">
                          {q.voiceGender === "male" ? "👨‍🏫 Male Examiner" : "👩‍🏫 Female Examiner"}
                        </span>
                        <span className="vip-pill-badge">
                          ⏱️ {q.durationMinutes || 15} Mins • {q.difficulty}
                        </span>
                        {isReattempt && (
                          <span
                            className="vip-pill-badge"
                            style={{
                              background: "rgba(245, 158, 11, 0.16)",
                              color: "#fbbf24",
                              borderColor: "rgba(245, 158, 11, 0.4)",
                            }}
                          >
                            🔄 PENDING • 7-Day Oral Re-Attempt
                          </span>
                        )}
                        {isLocked ? (
                          <span
                            className="vip-pill-badge"
                            style={{
                              background: "rgba(239, 68, 68, 0.16)",
                              color: "#fca5a5",
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            🔒 Locked • Unlocks in {countdownStr}
                          </span>
                        ) : (
                          <span
                            className="vip-pill-badge"
                            style={{
                              background: "rgba(16, 185, 129, 0.15)",
                              color: "#34d399",
                            }}
                          >
                            🔓 Unlocked & Ready
                          </span>
                        )}
                      </div>

                      <h4 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>{q.title}</h4>
                      <p style={{ margin: 0, fontSize: "12.5px", color: "#94a3b8" }}>
                        Status: <strong style={{ color: "#fbbf24" }}>Pending</strong> • Passing: 60% (6/10 Correct) • {q.sourceFileName}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleDownloadQuizPaperPdf(q)}
                        disabled={isLocked}
                        className="pro-btn-secondary"
                      >
                        {isLocked ? "🔒 Paper Locked" : "Download PDF"}
                      </button>

                      <button
                        onClick={() => handleStartQuiz(q)}
                        disabled={isLocked}
                        className="pro-btn-primary"
                        style={{
                          background: isLocked
                            ? "#334155"
                            : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        }}
                      >
                        {isLocked ? `⏳ Unlocks in ${countdownStr}` : "🎙️ Start Oral Test"}
                      </button>

                      <button
                        onClick={() =>
                          openDeletePopup({
                            type: "quiz",
                            id: q._id,
                            title: "Delete Pending Oral Test?",
                            subtitle: `Are you sure you want to permanently delete "${q.title}"?`,
                          })
                        }
                        className="pro-btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          SECTION 2C: UPGRADED 3D EXECUTIVE MESSENGER, POLLS, FACULTY CONSULT & COMMUNITIES
         ==================================================================== */}
      {activeTab === "scholar-chat" && (
        <div className="comm-hub-3d-wrapper">
          {/* TOP SEGMENTED CHANNEL BAR */}
          <div className="comm-hub-top-bar">
            <div className="comm-hub-nav-pills">
              <button
                type="button"
                onClick={() => setSocialSubTab("chats")}
                className={`comm-nav-pill ${
                  socialSubTab === "chats" ? "active" : ""
                }`}
              >
                <span>Direct Messages</span>
                <span className="comm-pill-count">
                  {socialOverview.friends.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSocialSubTab("communities")}
                className={`comm-nav-pill ${
                  socialSubTab === "communities" ? "active" : ""
                }`}
              >
                <span>Study Communities</span>
                <span className="comm-pill-count">
                  {socialOverview.communities.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSocialSubTab("directory")}
                className={`comm-nav-pill ${
                  socialSubTab === "directory" ? "active" : ""
                }`}
              >
                <span>Directory & Faculty</span>
                <span className="comm-pill-count">
                  {socialOverview.directory.length}
                </span>
              </button>

              {!socialOverview.isCallerFaculty && (
                <button
                  type="button"
                  onClick={() => setSocialSubTab("requests")}
                  className={`comm-nav-pill ${
                    socialSubTab === "requests" ? "active" : ""
                  }`}
                >
                  <span>Requests</span>
                  {socialOverview.incomingRequests.length > 0 && (
                    <span
                      className="comm-pill-count"
                      style={{ background: "#ec4899", color: "#fff" }}
                    >
                      {socialOverview.incomingRequests.length}
                    </span>
                  )}
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setShowCreateCommModal(true)}
                className="pro-btn-primary"
                style={{ padding: "9px 16px", fontSize: "12.5px" }}
              >
                + New Community
              </button>
            </div>
          </div>

          {/* DETACHED 2-COLUMN 3D STAGE */}
          <div className="comm-hub-stage-grid">
            {/* LEFT 3D CONTACT & DIRECTORY DOCK */}
            <div className="comm-dock-panel">
              <div
                style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSocialSubTab("directory");
                    handleSearchScholars();
                  }}
                  style={{ display: "flex", gap: "6px" }}
                >
                  <input
                    type="text"
                    className="pro-input"
                    style={{ fontSize: "12.5px", padding: "9px 12px" }}
                    placeholder="Search name, phone, or faculty..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (socialSubTab !== "directory") {
                        setSocialSubTab("directory");
                      }
                    }}
                  />
                  <button
                    type="submit"
                    className="pro-btn-secondary"
                    style={{ padding: "8px 12px", fontSize: "12px" }}
                  >
                    {searchLoading ? "..." : "Find"}
                  </button>
                </form>
              </div>

              <div className="scholar-contact-list">
                {socialSubTab === "chats" && (
                  <>
                    {socialOverview.friends.length === 0 ? (
                      <div
                        style={{
                          padding: "32px 16px",
                          textAlign: "center",
                          color: "#94a3b8",
                          fontSize: "13px",
                        }}
                      >
                        No active chats yet. Open <strong>Directory & Faculty</strong> to message a professor or connect with classmates.
                      </div>
                    ) : (
                      socialOverview.friends.map((fr) => {
                        const isSelected =
                          activeFriend &&
                          String(activeFriend.studentId) === String(fr.studentId);
                        const isFac = Boolean(fr.isFaculty || fr.tier === "Faculty");

                        return (
                          <div
                            key={fr.studentId}
                            onClick={() => setActiveFriend(fr)}
                            className={`scholar-contact-card ${
                              isSelected ? "active" : ""
                            }`}
                          >
                            <div
                              className={`scholar-avatar-wrap ${
                                isFac ? "faculty-avatar" : ""
                              }`}
                            >
                              {fr.avatar ? (
                                <img src={fr.avatar} alt={fr.studentName} />
                              ) : (
                                String(fr.studentName || "S")
                                  .charAt(0)
                                  .toUpperCase()
                              )}
                              <span className="scholar-online-dot" />
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: "6px",
                                  marginBottom: "3px",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 700,
                                    fontSize: "13.5px",
                                    color: "#fff",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {fr.studentName}
                                </span>
                                {renderChatTierBadge(fr.tier, isFac)}
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "11.5px",
                                    color: "#94a3b8",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "185px",
                                  }}
                                >
                                  {fr.lastMessage?.text ||
                                    (isFac
                                      ? "Direct Faculty Consultation"
                                      : fr.phone || fr.studentEmail)}
                                </span>
                                {fr.unreadCount > 0 && (
                                  <span
                                    style={{
                                      background: "#6366f1",
                                      color: "#fff",
                                      borderRadius: "99px",
                                      padding: "1px 6px",
                                      fontSize: "10.5px",
                                      fontWeight: 700,
                                    }}
                                  >
                                    {fr.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                )}

                {socialSubTab === "communities" && (
                  <>
                    {socialOverview.communities.length === 0 ? (
                      <div
                        style={{
                          padding: "32px 16px",
                          textAlign: "center",
                          color: "#94a3b8",
                          fontSize: "13px",
                        }}
                      >
                        No study communities created yet. Click <strong>+ New Community</strong> above to start one.
                      </div>
                    ) : (
                      socialOverview.communities.map((comm) => {
                        const isSelected =
                          activeFriend &&
                          String(activeFriend.studentId) === String(comm.studentId);
                        return (
                          <div
                            key={comm.communityId || comm.studentId}
                            onClick={() => {
                              if (!comm.isMember) {
                                handleJoinCommunity(comm);
                              } else {
                                setActiveFriend(comm);
                              }
                            }}
                            className={`scholar-contact-card ${
                              isSelected ? "active" : ""
                            }`}
                          >
                            <div
                              className="scholar-avatar-wrap faculty-avatar"
                              style={{ fontSize: "13px" }}
                            >
                              GRP
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "2px",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 700,
                                    fontSize: "13.5px",
                                    color: "#fff",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {comm.name}
                                </span>
                                <span
                                  style={{
                                    fontSize: "10.5px",
                                    color: "#34d399",
                                    fontWeight: 700,
                                  }}
                                >
                                  {comm.membersCount || 1} Members
                                </span>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "11.5px",
                                    color: "#94a3b8",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "165px",
                                  }}
                                >
                                  {comm.lastMessage?.text || comm.subject}
                                </span>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    color: comm.isMember ? "#818cf8" : "#fbbf24",
                                    fontWeight: 700,
                                  }}
                                >
                                  {comm.isMember ? "Open" : "+ Join"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                )}

                {socialSubTab === "directory" && (
                  <>
                    {(searchQuery.trim()
                      ? searchResults
                      : socialOverview.directory
                    ).length === 0 ? (
                      <div
                        style={{
                          padding: "28px 14px",
                          textAlign: "center",
                          color: "#94a3b8",
                          fontSize: "12.5px",
                        }}
                      >
                        No registered user found matching "{searchQuery}".
                      </div>
                    ) : (
                      (searchQuery.trim()
                        ? searchResults
                        : socialOverview.directory
                      ).map((sc) => {
                        const isFac = Boolean(
                          sc.isFaculty || sc.tier === "Faculty"
                        );
                        return (
                          <div
                            key={sc.studentId}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "11px 12px",
                              background: "rgba(255,255,255,0.025)",
                              borderRadius: "12px",
                              border: isFac
                                ? "1px solid rgba(16, 185, 129, 0.35)"
                                : "1px solid rgba(255,255,255,0.06)",
                              gap: "10px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                minWidth: 0,
                                flex: 1,
                              }}
                            >
                              <div
                                className={`scholar-avatar-wrap ${
                                  isFac ? "faculty-avatar" : ""
                                }`}
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  fontSize: "14px",
                                }}
                              >
                                {sc.avatar ? (
                                  <img src={sc.avatar} alt={sc.studentName} />
                                ) : (
                                  String(sc.studentName || "S")
                                    .charAt(0)
                                    .toUpperCase()
                                )}
                              </div>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      fontSize: "13.5px",
                                      color: "#fff",
                                    }}
                                  >
                                    {sc.studentName}
                                  </span>
                                  {renderChatTierBadge(sc.tier, isFac)}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#94a3b8",
                                    marginTop: "2px",
                                  }}
                                >
                                  {sc.phone || sc.studentEmail}
                                </div>
                              </div>
                            </div>

                            {isFac || sc.relation === "faculty-direct" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveFriend(sc);
                                  setSocialSubTab("chats");
                                }}
                                className="pro-btn-primary"
                                style={{
                                  padding: "6px 11px",
                                  fontSize: "11px",
                                  background:
                                    "linear-gradient(135deg, #10b981, #059669)",
                                }}
                              >
                                Consult Faculty
                              </button>
                            ) : sc.relation === "friends" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveFriend(sc);
                                  setSocialSubTab("chats");
                                }}
                                className="pro-btn-secondary"
                                style={{
                                  padding: "6px 11px",
                                  fontSize: "11.5px",
                                }}
                              >
                                Message
                              </button>
                            ) : sc.relation === "request-sent" ? (
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "#fbbf24",
                                  fontWeight: 700,
                                  padding: "4px 8px",
                                  background: "rgba(245, 158, 11, 0.14)",
                                  borderRadius: "6px",
                                }}
                              >
                                Requested
                              </span>
                            ) : sc.relation === "request-received" ? (
                              <button
                                type="button"
                                onClick={() => setSocialSubTab("requests")}
                                className="pro-btn-primary"
                                style={{ padding: "6px 10px", fontSize: "11px" }}
                              >
                                Respond
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  handleSendFriendRequest(sc.studentId)
                                }
                                className="pro-btn-primary"
                                style={{
                                  padding: "6px 11px",
                                  fontSize: "11.5px",
                                }}
                              >
                                + Connect
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </>
                )}

                {socialSubTab === "requests" && (
                  <>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#94a3b8",
                        padding: "4px 6px",
                        textTransform: "uppercase",
                      }}
                    >
                      Incoming Requests ({socialOverview.incomingRequests.length})
                    </div>
                    {socialOverview.incomingRequests.length === 0 ? (
                      <div
                        style={{
                          padding: "18px",
                          textAlign: "center",
                          color: "#64748b",
                          fontSize: "12.5px",
                        }}
                      >
                        No pending requests.
                      </div>
                    ) : (
                      socialOverview.incomingRequests.map((req) => (
                        <div
                          key={req._id}
                          style={{
                            padding: "12px",
                            background: "rgba(99, 102, 241, 0.1)",
                            borderRadius: "12px",
                            border: "1px solid rgba(99, 102, 241, 0.3)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <div
                              className="scholar-avatar-wrap"
                              style={{
                                width: "36px",
                                height: "36px",
                                fontSize: "14px",
                              }}
                            >
                              {String(req.fromName || "S")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: "13.5px",
                                  color: "#fff",
                                }}
                              >
                                {req.fromName}
                              </div>
                              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                                {req.fromPhone || "Registered Student"}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              type="button"
                              onClick={() =>
                                handleRespondRequest(req._id, "accept")
                              }
                              className="pro-btn-primary"
                              style={{
                                flex: 1,
                                padding: "6px",
                                fontSize: "11.5px",
                              }}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleRespondRequest(req._id, "reject")
                              }
                              className="pro-btn-danger"
                              style={{
                                flex: 1,
                                padding: "6px",
                                fontSize: "11.5px",
                              }}
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            </div>

            {/* RIGHT 3D CONVERSATION STAGE */}
            <div className="comm-conversation-stage">
              {!activeFriend ? (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "18px",
                      background: "rgba(99, 102, 241, 0.14)",
                      border: "1px solid rgba(99, 102, 241, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#818cf8",
                      marginBottom: "16px",
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      color: "#fff",
                      fontSize: "19px",
                    }}
                  >
                    Academic Communication & Collaboration Hub
                  </h3>
                  <p
                    style={{
                      margin: "0 0 18px 0",
                      maxWidth: "460px",
                      fontSize: "13.5px",
                      lineHeight: 1.55,
                    }}
                  >
                    Consult directly with Faculty without friend requests, collaborate in Study Communities, launch Live Polls, and preview Videos, Images, or PDFs before sending.
                  </p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setSocialSubTab("directory")}
                      className="pro-btn-primary"
                    >
                      Browse Directory & Faculty
                    </button>
                    <button
                      type="button"
                      onClick={() => setSocialSubTab("communities")}
                      className="pro-btn-secondary"
                    >
                      Study Communities
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="scholar-chat-header">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        className={`scholar-avatar-wrap ${
                          activeFriend.isFaculty ||
                          activeFriend.tier === "Faculty" ||
                          activeFriend.isCommunity
                            ? "faculty-avatar"
                            : ""
                        }`}
                        style={{ width: "44px", height: "44px" }}
                      >
                        {activeFriend.isCommunity
                          ? "GRP"
                          : activeFriend.avatar ? (
                              <img
                                src={activeFriend.avatar}
                                alt={activeFriend.studentName}
                              />
                            ) : (
                              String(activeFriend.studentName || "S")
                                .charAt(0)
                                .toUpperCase()
                            )}
                        <span className="scholar-online-dot" />
                      </div>

                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "15.5px",
                              color: "#fff",
                            }}
                          >
                            {activeFriend.studentName || activeFriend.name}
                          </span>
                          {activeFriend.isCommunity ? (
                            <span className="vip-pill-badge">
                              {activeFriend.subject || "Study Group"} •{" "}
                              {activeFriend.membersCount || 1} Members
                            </span>
                          ) : (
                            renderChatTierBadge(
                              activeFriend.tier,
                              activeFriend.isFaculty ||
                                activeFriend.tier === "Faculty"
                            )
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "#94a3b8",
                            marginTop: "2px",
                          }}
                        >
                          {activeFriend.isCommunity
                            ? activeFriend.description ||
                              "Group Study Workspace"
                            : activeFriend.isFaculty ||
                              activeFriend.tier === "Faculty"
                            ? `Official Faculty Member • ${
                                activeFriend.studentEmail || ""
                              }`
                            : `${
                                activeFriend.phone ||
                                activeFriend.studentEmail ||
                                "Scholar"
                              } • ${activeFriend.totalXp || 100} XP`}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {activeFriend.isCommunity && (
                        <button
                          type="button"
                          onClick={() => setShowInviteModal(true)}
                          className="pro-btn-primary"
                          style={{ padding: "6px 12px", fontSize: "11.5px" }}
                        >
                          + Invite Members
                        </button>
                      )}
                      {!activeFriend.isFaculty &&
                        activeFriend.tier !== "Faculty" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveFriendOrCommunity(
                                activeFriend.studentId
                              )
                            }
                            className="pro-btn-danger"
                            style={{ padding: "6px 11px", fontSize: "11.5px" }}
                          >
                            {activeFriend.isCommunity ? "Leave" : "Disconnect"}
                          </button>
                        )}
                    </div>
                  </div>

                  {pinnedMessage && (
                    <div className="chat-pinned-banner">
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <strong>Pinned:</strong> {pinnedMessage.senderName} —{" "}
                        {pinnedMessage.text}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleTogglePinMessage(pinnedMessage._id)
                        }
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#fbbf24",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Unpin
                      </button>
                    </div>
                  )}

                  <div className="scholar-messages-stream">
                    {chatMessages.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "55px 20px",
                          color: "#64748b",
                          fontSize: "13.5px",
                        }}
                      >
                        No messages yet with {activeFriend.studentName}. Click the{" "}
                        <strong>+</strong> button below to share a Video, Photo, PDF, Live Poll, or 3D Register.
                      </div>
                    ) : (
                      chatMessages.map((msg) => {
                        const isMine =
                          String(msg.senderId) === String(resolvedStudentId);
                        const isEditing = editingMsgId === msg._id;
                        const cType = msg.sharedPayload?.cardType;
                        const reactionsObj =
                          msg.sharedPayload?.reactions || {};
                        const activeReactionEntries = Object.entries(
                          reactionsObj
                        ).filter(
                          ([, users]) =>
                            Array.isArray(users) && users.length > 0
                        );

                        return (
                          <div
                            key={msg._id}
                            className={`dm-bubble-row ${
                              isMine ? "mine" : "theirs"
                            }`}
                          >
                            {!isMine && (
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#a5b4fc",
                                  fontWeight: 700,
                                  marginBottom: "3px",
                                  paddingLeft: "4px",
                                }}
                              >
                                {msg.senderName}
                              </div>
                            )}

                            <div className="dm-bubble-card">
                              {cType === "poll" && msg.sharedPayload && (
                                <div className="chat-poll-3d-card">
                                  <div
                                    style={{
                                      fontSize: "10.5px",
                                      fontWeight: 800,
                                      color: "#818cf8",
                                      textTransform: "uppercase",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    Live Interactive Poll
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "14.5px",
                                      fontWeight: 700,
                                      color: "#fff",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    {msg.sharedPayload.question}
                                  </div>
                                  {(() => {
                                    const opts =
                                      msg.sharedPayload.options || [];
                                    const totalVotes = opts.reduce(
                                      (acc, o) =>
                                        acc + (o.voters?.length || 0),
                                      0
                                    );
                                    return opts.map((opt, oIdx) => {
                                      const vCount = opt.voters?.length || 0;
                                      const pct =
                                        totalVotes > 0
                                          ? Math.round(
                                              (vCount / totalVotes) * 100
                                            )
                                          : 0;
                                      const didIVote = (
                                        opt.voters || []
                                      ).some(
                                        (v) =>
                                          String(v.userId) ===
                                          String(resolvedStudentId)
                                      );

                                      return (
                                        <button
                                          key={oIdx}
                                          type="button"
                                          onClick={() =>
                                            handleVoteOnPoll(msg._id, oIdx)
                                          }
                                          className={`chat-poll-option-btn ${
                                            didIVote ? "voted" : ""
                                          }`}
                                        >
                                          <div
                                            className="chat-poll-fill-bar"
                                            style={{ width: `${pct}%` }}
                                          />
                                          <span
                                            style={{
                                              position: "relative",
                                              zIndex: 1,
                                            }}
                                          >
                                            {didIVote ? "✓ " : ""}
                                            {opt.label}
                                          </span>
                                          <span
                                            style={{
                                              position: "relative",
                                              zIndex: 1,
                                              fontFamily:
                                                "'JetBrains Mono', monospace",
                                              fontSize: "11px",
                                            }}
                                          >
                                            {pct}% ({vCount})
                                          </span>
                                        </button>
                                      );
                                    });
                                  })()}
                                </div>
                              )}

                              {cType === "community-invite" &&
                                msg.sharedPayload && (
                                  <div className="shared-widget-card">
                                    <div
                                      style={{
                                        fontSize: "10.5px",
                                        fontWeight: 800,
                                        color: "#34d399",
                                        textTransform: "uppercase",
                                        marginBottom: "4px",
                                      }}
                                    >
                                      Community Join Invitation
                                    </div>
                                    <h4
                                      style={{
                                        margin: "0 0 4px 0",
                                        fontSize: "15px",
                                        color: "#fff",
                                      }}
                                    >
                                      {msg.sharedPayload.communityName}
                                    </h4>
                                    <p
                                      style={{
                                        margin: "0 0 10px 0",
                                        fontSize: "12px",
                                        color: "#cbd5e1",
                                      }}
                                    >
                                      Subject:{" "}
                                      {msg.sharedPayload.communitySubject} •
                                      Invited by{" "}
                                      {msg.sharedPayload.inviterName}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleJoinCommunity({
                                          communityId:
                                            msg.sharedPayload.communityId,
                                          studentId:
                                            msg.sharedPayload.communityId,
                                          name: msg.sharedPayload.communityName,
                                          studentName:
                                            msg.sharedPayload.communityName,
                                        })
                                      }
                                      className="pro-btn-primary"
                                      style={{
                                        width: "100%",
                                        padding: "7px 12px",
                                        fontSize: "12px",
                                        background: "#10b981",
                                      }}
                                    >
                                      Accept & Join Community
                                    </button>
                                  </div>
                                )}

                              {msg.messageType === "image" && msg.mediaUrl && (
                                <div style={{ marginBottom: "8px" }}>
                                  <img
                                    src={msg.mediaUrl}
                                    alt={msg.fileName || "Photo"}
                                    style={{
                                      maxWidth: "290px",
                                      maxHeight: "240px",
                                      borderRadius: "10px",
                                      display: "block",
                                      objectFit: "cover",
                                      marginBottom: "6px",
                                    }}
                                  />
                                  <a
                                    href={msg.mediaUrl}
                                    download={msg.fileName || "Photo.png"}
                                    style={{
                                      fontSize: "11px",
                                      color: "#e0e7ff",
                                      textDecoration: "underline",
                                    }}
                                  >
                                    Download Image
                                  </a>
                                </div>
                              )}

                              {msg.messageType === "video" && msg.mediaUrl && (
                                <div style={{ marginBottom: "8px" }}>
                                  <video
                                    src={msg.mediaUrl}
                                    controls
                                    style={{
                                      maxWidth: "300px",
                                      maxHeight: "220px",
                                      borderRadius: "10px",
                                      display: "block",
                                    }}
                                  />
                                </div>
                              )}

                              {(msg.messageType === "pdf" ||
                                msg.messageType === "file") &&
                                msg.mediaUrl && (
                                  <a
                                    href={msg.mediaUrl}
                                    download={msg.fileName || "Document.pdf"}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      padding: "10px 12px",
                                      background: "rgba(0,0,0,0.28)",
                                      borderRadius: "10px",
                                      color: "#fff",
                                      textDecoration: "none",
                                      marginBottom: "8px",
                                      border:
                                        "1px solid rgba(255,255,255,0.14)",
                                    }}
                                  >
                                    <div>
                                      <div
                                        style={{
                                          fontWeight: 700,
                                          fontSize: "13px",
                                        }}
                                      >
                                        {msg.fileName || "PDF Document"}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "11px",
                                          color: "#cbd5e1",
                                        }}
                                      >
                                        {msg.fileSize || "PDF"} • Click to Download
                                      </div>
                                    </div>
                                  </a>
                                )}

                              {msg.messageType === "shared-note" &&
                                msg.sharedPayload && (
                                  <div className="shared-widget-card">
                                    <div
                                      style={{
                                        fontSize: "10.5px",
                                        color: "#a5b4fc",
                                        fontWeight: 800,
                                        marginBottom: "4px",
                                      }}
                                    >
                                      SHARED 3D REGISTER
                                    </div>
                                    <h4
                                      style={{
                                        margin: "0 0 4px 0",
                                        fontSize: "15px",
                                        color: "#fff",
                                      }}
                                    >
                                      {msg.sharedPayload.title}
                                    </h4>
                                    <p
                                      style={{
                                        margin: "0 0 10px 0",
                                        fontSize: "12px",
                                        color: "#cbd5e1",
                                      }}
                                    >
                                      Subject: {msg.sharedPayload.subject}
                                    </p>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleImportSharedNote(
                                            msg.sharedPayload
                                          )
                                        }
                                        className="pro-btn-primary"
                                        style={{
                                          flex: 1,
                                          padding: "7px 10px",
                                          fontSize: "11.5px",
                                          background: "#10b981",
                                        }}
                                      >
                                        Save to Shelf
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDownloadBookPdf(
                                            msg.sharedPayload
                                          )
                                        }
                                        className="pro-btn-secondary"
                                        style={{
                                          padding: "7px 10px",
                                          fontSize: "11.5px",
                                        }}
                                      >
                                        PDF
                                      </button>
                                    </div>
                                  </div>
                                )}

                              {msg.messageType === "shared-result" &&
                                msg.sharedPayload && (
                                  <div className="shared-widget-card">
                                    <div
                                      style={{
                                        fontSize: "10.5px",
                                        color: "#34d399",
                                        fontWeight: 800,
                                        marginBottom: "4px",
                                      }}
                                    >
                                      EXAM SCORECARD
                                    </div>
                                    <h4
                                      style={{
                                        margin: "0 0 4px 0",
                                        fontSize: "15px",
                                        color: "#fff",
                                      }}
                                    >
                                      {msg.sharedPayload.title}
                                    </h4>
                                    <div
                                      style={{
                                        fontSize: "20px",
                                        fontWeight: 800,
                                        color: msg.sharedPayload.passed
                                          ? "#34d399"
                                          : "#f87171",
                                      }}
                                    >
                                      {msg.sharedPayload.percentage}% (Grade{" "}
                                      {msg.sharedPayload.grade})
                                    </div>
                                  </div>
                                )}

                              {isEditing ? (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px",
                                    marginTop: "4px",
                                    minWidth: "220px",
                                  }}
                                >
                                  <input
                                    type="text"
                                    className="pro-input"
                                    style={{
                                      fontSize: "13px",
                                      padding: "6px 10px",
                                      background: "#090c14",
                                      color: "#fff",
                                    }}
                                    value={editingMsgText}
                                    onChange={(e) =>
                                      setEditingMsgText(e.target.value)
                                    }
                                  />
                                  <div style={{ display: "flex", gap: "6px" }}>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEditMessageSubmit(msg._id)
                                      }
                                      className="pro-btn-primary"
                                      style={{
                                        padding: "4px 10px",
                                        fontSize: "11px",
                                      }}
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingMsgId(null);
                                        setEditingMsgText("");
                                      }}
                                      className="pro-btn-secondary"
                                      style={{
                                        padding: "4px 10px",
                                        fontSize: "11px",
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                msg.text &&
                                cType !== "poll" &&
                                cType !== "community-invite" && (
                                  <div>{msg.text}</div>
                                )
                              )}
                            </div>

                            {activeReactionEntries.length > 0 && (
                              <div className="dm-reactions-row">
                                {activeReactionEntries.map(
                                  ([emojiChar, usersArr]) => {
                                    const iReacted = usersArr.includes(
                                      String(resolvedStudentId)
                                    );
                                    return (
                                      <button
                                        key={emojiChar}
                                        type="button"
                                        onClick={() =>
                                          handleToggleEmojiReaction(
                                            msg._id,
                                            emojiChar
                                          )
                                        }
                                        className={`dm-reaction-chip ${
                                          iReacted ? "reacted" : ""
                                        }`}
                                      >
                                        <span>{emojiChar}</span>
                                        <span>{usersArr.length}</span>
                                      </button>
                                    );
                                  }
                                )}
                              </div>
                            )}

                            <div className="dm-actions-bar">
                              <span>
                                {new Date(
                                  msg.createdAt || Date.now()
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>

                              <div className="dm-quick-react-bar">
                                {QUICK_EMOJIS.map((em) => (
                                  <button
                                    key={em}
                                    type="button"
                                    onClick={() =>
                                      handleToggleEmojiReaction(msg._id, em)
                                    }
                                    className="dm-quick-emoji-btn"
                                    title={`React with ${em}`}
                                  >
                                    {em}
                                  </button>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleTogglePinMessage(msg._id)}
                                className="dm-action-link"
                              >
                                {msg.sharedPayload?.isPinned ? "Unpin" : "Pin"}
                              </button>

                              {isMine && !isEditing && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingMsgId(msg._id);
                                      setEditingMsgText(msg.text || "");
                                    }}
                                    className="dm-action-link"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMessage(msg._id)}
                                    className="dm-action-link danger"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={directChatEndRef} />
                  </div>

                  {dmFile && dmFilePreviewUrl && (
                    <div
                      style={{
                        padding: "10px 18px",
                        background: "#0c101b",
                        borderTop: "1px solid rgba(99, 102, 241, 0.35)",
                      }}
                    >
                      <div
                        className="gc-media-preview-card"
                        style={{ maxWidth: "340px" }}
                      >
                        <div className="gc-media-preview-header">
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "250px",
                            }}
                          >
                            Ready to Send: {dmFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setDmFile(null);
                              setDmFilePreviewUrl("");
                            }}
                            className="gc-media-remove-btn"
                            title="Remove file"
                          >
                            ✕
                          </button>
                        </div>
                        {dmFile.type.startsWith("video/") && (
                          <video
                            src={dmFilePreviewUrl}
                            controls
                            className="gc-preview-video"
                          />
                        )}
                        {dmFile.type.startsWith("image/") && (
                          <img
                            src={dmFilePreviewUrl}
                            alt="Preview"
                            className="gc-preview-img"
                          />
                        )}
                        {dmFile.type === "application/pdf" && (
                          <iframe
                            src={dmFilePreviewUrl}
                            title="PDF Preview"
                            className="gc-preview-pdf"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={(e) => handleSendDirectMessage(e, "text", null)}
                    className="scholar-chat-composer"
                  >
                    {showChatPlusMenu && (
                      <div className="chat-plus-popover-menu">
                        <label className="chat-plus-menu-item">
                          <span className="chat-plus-icon-badge">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                              />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </span>
                          <span>Upload Video, Photo, or PDF</span>
                          <input
                            type="file"
                            accept="image/*,video/*,.pdf"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              setDmFile(e.target.files?.[0] || null);
                              setShowChatPlusMenu(false);
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setShowChatPlusMenu(false);
                            setShowPollModal(true);
                          }}
                          className="chat-plus-menu-item"
                        >
                          <span className="chat-plus-icon-badge">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <line x1="18" y1="20" x2="18" y2="10" />
                              <line x1="12" y1="20" x2="12" y2="4" />
                              <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                          </span>
                          <span>Create Live Poll</span>
                        </button>

                        {notes.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowChatPlusMenu(false);
                              setShareNoteModal({
                                isOpen: true,
                                note: notes[0],
                              });
                            }}
                            className="chat-plus-menu-item"
                          >
                            <span className="chat-plus-icon-badge">
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                              </svg>
                            </span>
                            <span>Share 3D Register</span>
                          </button>
                        )}

                        {completedQuizzes.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowChatPlusMenu(false);
                              setShareResultModal({
                                isOpen: true,
                                quiz: completedQuizzes[0],
                              });
                            }}
                            className="chat-plus-menu-item"
                          >
                            <span className="chat-plus-icon-badge">
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="12" cy="8" r="7" />
                                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                              </svg>
                            </span>
                            <span>Share Exam Scorecard</span>
                          </button>
                        )}

                        {activeFriend.isCommunity && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowChatPlusMenu(false);
                              setShowInviteModal(true);
                            }}
                            className="chat-plus-menu-item"
                          >
                            <span className="chat-plus-icon-badge">
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <line x1="20" y1="8" x2="20" y2="14" />
                                <line x1="23" y1="11" x2="17" y2="11" />
                              </svg>
                            </span>
                            <span>Invite Members to Group</span>
                          </button>
                        )}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setShowChatPlusMenu((prev) => !prev)}
                        className={`chat-plus-trigger-btn ${
                          showChatPlusMenu ? "open" : ""
                        }`}
                        title="Attach Media, Create Poll, or Share Resources"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>

                      <input
                        type="text"
                        className="pro-input"
                        style={{ flex: 1, fontSize: "13.5px" }}
                        value={dmInputText}
                        onChange={(e) => setDmInputText(e.target.value)}
                        placeholder={`Message ${
                          activeFriend.studentName || activeFriend.name
                        }...`}
                      />

                      <button
                        type="submit"
                        className="pro-btn-primary"
                        disabled={dmLoading}
                        style={{ padding: "10px 20px" }}
                      >
                        {dmLoading ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SECTION 3: PERFORMANCE & RESULTS ANALYTICS (FULL BREAKDOWN)
         ==================================================================== */}
      {activeTab === "results" && (
        <div className="edit-profile-container">
          <div className="edit-profile-header">
            <h2>Performance & Assessment Analytics (Classroom Assignments, Quizzes & Oral Tests)</h2>
            <p>
              View your graded Classroom Assignments (Marks, Star Ratings, #1 Speed Ranks & Teacher Feedback) alongside your Proctored Quizzes and AI Oral Tests!
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "12px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                background: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
              }}
            >
              <div style={{ fontSize: "12px", color: "#a5b4fc" }}>
                Submitted Classroom Assignments
              </div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginTop: "4px" }}>
                📚 {mySubmittedAssignments.length}
              </div>
            </div>

            <div
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                background: "#161b26",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>Total Completed Exams</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginTop: "4px" }}>
                {completedQuizzes.length}
              </div>
            </div>

            <div
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <div style={{ fontSize: "12px", color: "#6ee7b7" }}>Passed Exams (60%+)</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#34d399", marginTop: "4px" }}>
                🏆 {passedExamsCount} Passed
              </div>
            </div>

            <div
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <div style={{ fontSize: "12px", color: "#fca5a5" }}>Failed Exams (&lt;60%)</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#f87171", marginTop: "4px" }}>
                ⚠️ {failedExamsCount} Failed
              </div>
            </div>
          </div>

          {mySubmittedAssignments.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#f8fafc" }}>
                📚 Classroom Assignment Grades & Faculty Ratings ({mySubmittedAssignments.length})
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {mySubmittedAssignments.map(({ assignment: asgn, mySub }) => {
                  const isGraded = mySub.status === "Graded";
                  const isFirst = mySub.submissionRank === 1;
                  return (
                    <div
                      key={asgn._id}
                      className="cyber-item-card"
                      style={{
                        flexWrap: "wrap",
                        borderColor: isGraded
                          ? "rgba(16, 185, 129, 0.45)"
                          : "rgba(99, 102, 241, 0.35)",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "250px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            flexWrap: "wrap",
                            marginBottom: "6px",
                          }}
                        >
                          <span className="vip-pill-badge">
                            📘 {asgn.subject} ({asgn.totalMarks} Marks)
                          </span>
                          <span className={`gc-rank-pill ${isFirst ? "rank-1" : ""}`}>
                            {isFirst
                              ? "🥇 #1 FIRST SUBMITTER"
                              : `⚡ Rank #${mySub.submissionRank}`}
                          </span>
                          {isGraded ? (
                            <>
                              <span
                                className="vip-pill-badge"
                                style={{
                                  background: "rgba(16, 185, 129, 0.2)",
                                  color: "#34d399",
                                  fontWeight: 800,
                                }}
                              >
                                🏆 Score: {mySub.obtainedMarks}/{asgn.totalMarks} (
                                {mySub.percentage}% • Grade {mySub.grade})
                              </span>
                              {renderStars(mySub.stars || 5)}
                            </>
                          ) : (
                            <span
                              className="vip-pill-badge"
                              style={{
                                background: "rgba(245, 158, 11, 0.18)",
                                color: "#fbbf24",
                              }}
                            >
                              ⏳ Submitted • Awaiting Teacher Marks
                            </span>
                          )}
                        </div>

                        <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#fff" }}>
                          {asgn.title}
                        </h4>

                        <p style={{ margin: 0, fontSize: "12.5px", color: "#cbd5e1" }}>
                          {isGraded
                            ? `💬 Faculty Feedback (${asgn.facultyName}): "${
                                mySub.feedback || "Well done!"
                              }"`
                            : `Submitted on ${new Date(
                                mySub.submittedAt
                              ).toLocaleString()} • Assigned by ${asgn.facultyName}`}
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() =>
                            handleDownloadAssignmentScorecardPdf(asgn, mySub)
                          }
                          className="pro-btn-secondary"
                        >
                          📥 Download Report PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("classroom")}
                          className="pro-btn-primary"
                        >
                          Open in Classroom →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {completedQuizzes.length === 0 ? (
            <div
              style={{
                padding: "36px",
                textAlign: "center",
                background: "#161b26",
                borderRadius: "14px",
                color: "#94a3b8",
              }}
            >
              No completed quizzes or AI oral tests yet. Complete any examination in Academic Quizzes or AI Oral Test to see your Passed/Failed scorecard and full answer key here!
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: "15.5px", marginBottom: "12px", color: "#f8fafc" }}>
                All Completed Quizzes & AI Oral Tests — Click Any Exam to View Full Answer Key ({completedQuizzes.length})
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "28px",
                }}
              >
                {completedQuizzes.map((q) => {
                  const isPassed = Boolean(q.passed || (q.percentage || 0) >= 60);
                  const isOral = isOralExamItem(q);
                  const isSelectedCard =
                    currentResult && String(currentResult._id) === String(q._id);
                  const totalQ = q.totalQuestions || q.questions?.length || (isOral ? 10 : 20);
                  const rightCount =
                    q.score ?? (q.questions || []).filter((x) => x.isCorrect).length;
                  const wrongCount = totalQ - rightCount;

                  return (
                    <div
                      key={q._id}
                      className="cyber-item-card"
                      style={{
                        flexWrap: "wrap",
                        background: isSelectedCard ? "rgba(99, 102, 241, 0.14)" : "#161b26",
                        borderColor: isSelectedCard
                          ? "#6366f1"
                          : isPassed
                          ? "rgba(16, 185, 129, 0.3)"
                          : "rgba(239, 68, 68, 0.35)",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "240px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            marginBottom: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            className="vip-pill-badge"
                            style={{
                              background: isOral
                                ? "rgba(16, 185, 129, 0.22)"
                                : "rgba(99, 102, 241, 0.22)",
                              color: isOral ? "#34d399" : "#a5b4fc",
                              borderColor: isOral ? "#10b981" : "#6366f1",
                            }}
                          >
                            {isOral ? "🎙️ AI ORAL TEST (10 Qs)" : "📝 QUIZ EXAM (20 Qs)"}
                          </span>

                          <span
                            className="vip-pill-badge"
                            style={{
                              background: isPassed
                                ? "rgba(16, 185, 129, 0.2)"
                                : "rgba(239, 68, 68, 0.2)",
                              color: isPassed ? "#34d399" : "#f87171",
                              borderColor: isPassed ? "#10b981" : "#ef4444",
                            }}
                          >
                            {isPassed ? "🏆 PASSED (60%+)" : "⚠️ FAILED (BELOW 60%)"}
                          </span>

                          {renderStars(q.stars || (isPassed ? 3 : 1))}

                          <span className="vip-pill-badge">
                            Grade: {q.grade || (isPassed ? "B" : "F")}
                          </span>

                          <span
                            style={{
                              fontSize: "12px",
                              color: "#34d399",
                              fontWeight: 700,
                            }}
                          >
                            ✔ {rightCount} Correct
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#f87171",
                              fontWeight: 700,
                            }}
                          >
                            ✖ {wrongCount} Wrong
                          </span>
                        </div>

                        <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#fff" }}>
                          {q.title}
                        </h4>
                        <p style={{ margin: 0, fontSize: "12.5px", color: "#94a3b8" }}>
                          Final Score:{" "}
                          <strong style={{ color: "#fff" }}>
                            {rightCount} / {totalQ} ({q.percentage || 0}%)
                          </strong>{" "}
                          • Completed:{" "}
                          {new Date(
                            q.completedAt || q.updatedAt || Date.now()
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedResultQuiz(q);
                            setShowDetailedBreakdown(true);
                            setResultFilterMode("all");
                            setTimeout(() => {
                              breakdownSectionRef.current?.scrollIntoView({
                                behavior: "smooth",
                              });
                            }, 100);
                          }}
                          className="pro-btn-primary"
                        >
                          🔍 View Answer Key
                        </button>

                        <button
                          type="button"
                          onClick={() => setShareResultModal({ isOpen: true, quiz: q })}
                          className="pro-btn-primary"
                          style={{
                            background: "linear-gradient(135deg, #ec4899, #6366f1)",
                          }}
                        >
                          📤 Share Result
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadResultPdf(q)}
                          className="pro-btn-secondary"
                        >
                          📥 Report PDF
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openDeletePopup({
                              type: "quiz",
                              id: q._id,
                              title: "Delete Assessment Result?",
                              subtitle: `Delete "${q.title}" permanently from your records?`,
                            })
                          }
                          className="pro-btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentResult && (
                <div ref={breakdownSectionRef}>
                  {(() => {
                    const isPassed = Boolean(
                      currentResult.passed || (currentResult.percentage || 0) >= 60
                    );
                    const isCurrentOral = isOralExamItem(currentResult);
                    const questionsList = Array.isArray(currentResult.questions)
                      ? currentResult.questions
                      : [];
                    const totalQ =
                      currentResult.totalQuestions ||
                      questionsList.length ||
                      (isCurrentOral ? 10 : 20);
                    const correctCount = questionsList.filter((q) => {
                      const sel = q.selectedOptionIndex;
                      return (
                        q.isCorrect ||
                        (sel !== null &&
                          sel !== undefined &&
                          Number(sel) >= 0 &&
                          Number(sel) === Number(q.correctOptionIndex))
                      );
                    }).length;
                    const wrongCount = totalQ - correctCount;

                    const filteredQuestions = questionsList
                      .map((q, idx) => {
                        const hasSelected =
                          q.selectedOptionIndex !== null &&
                          q.selectedOptionIndex !== undefined &&
                          q.selectedOptionIndex !== "" &&
                          Number(q.selectedOptionIndex) >= 0;
                        const selectedIdx = hasSelected
                          ? Number(q.selectedOptionIndex)
                          : null;
                        const correctIdx = Number(q.correctOptionIndex) || 0;
                        const isRight = Boolean(
                          q.isCorrect || (hasSelected && selectedIdx === correctIdx)
                        );
                        return {
                          ...q,
                          originalIndex: idx,
                          hasSelected,
                          selectedIdx,
                          correctIdx,
                          isRight,
                        };
                      })
                      .filter((item) => {
                        if (resultFilterMode === "correct") return item.isRight;
                        if (resultFilterMode === "wrong") return !item.isRight;
                        return true;
                      });

                    return (
                      <div
                        style={{
                          background: "#121622",
                          border: `2px solid ${
                            isPassed ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"
                          }`,
                          borderRadius: "16px",
                          padding: "24px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "16px",
                            paddingBottom: "18px",
                            marginBottom: "20px",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                marginBottom: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                className="vip-pill-badge"
                                style={{
                                  background: isCurrentOral
                                    ? "rgba(16, 185, 129, 0.22)"
                                    : "rgba(99, 102, 241, 0.22)",
                                  color: isCurrentOral ? "#34d399" : "#a5b4fc",
                                  borderColor: isCurrentOral ? "#10b981" : "#6366f1",
                                  fontWeight: 800,
                                }}
                              >
                                {isCurrentOral
                                  ? "🎙️ AI ORAL TEST (10 Qs)"
                                  : "📝 QUIZ EXAM (20 Qs)"}
                              </span>

                              <span
                                className="vip-pill-badge"
                                style={{
                                  background: isPassed ? "#10b981" : "#ef4444",
                                  color: "#fff",
                                  fontWeight: 800,
                                }}
                              >
                                {isPassed
                                  ? "🏆 PASSED EXAM SCORECARD"
                                  : "⚠️ FAILED EXAM SCORECARD (BELOW 60%)"}
                              </span>
                              {renderStars(currentResult.stars || (isPassed ? 3 : 1))}
                              <span style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: 700 }}>
                                Grade: {currentResult.grade || (isPassed ? "B" : "F")}
                              </span>
                            </div>

                            <h3 style={{ margin: "0 0 6px 0", fontSize: "21px", color: "#fff" }}>
                              {currentResult.title}
                            </h3>
                            <p style={{ margin: 0, fontSize: "13.5px", color: "#cbd5e1", maxWidth: "680px" }}>
                              {currentResult.aiFeedback ||
                                (isPassed
                                  ? `Congratulations! You passed with ${correctCount}/${totalQ} (${currentResult.percentage}%).`
                                  : `You scored ${correctCount}/${totalQ} (${currentResult.percentage}%). Minimum 60% is required to pass.`)}
                            </p>

                            {!isPassed && (
                              <div style={{ marginTop: "12px" }}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveTab(isCurrentOral ? "oral-lab" : "quiz-lab")
                                  }
                                  className="pro-btn-secondary"
                                  style={{
                                    borderColor: "rgba(245, 158, 11, 0.5)",
                                    color: "#fbbf24",
                                  }}
                                >
                                  🔄 View Scheduled 7-Day Re-Attempt in Pending{" "}
                                  {isCurrentOral ? "Oral Tests" : "Quizzes"} →
                                </button>
                              </div>
                            )}
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{
                                fontSize: "38px",
                                fontWeight: 900,
                                color: isPassed ? "#34d399" : "#f87171",
                              }}
                            >
                              {currentResult.percentage || 0}%
                            </div>
                            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "10px" }}>
                              ✔ {correctCount} Correct • ✖ {wrongCount} Wrong (Total {totalQ})
                            </div>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                              <button
                                type="button"
                                onClick={() =>
                                  setShareResultModal({ isOpen: true, quiz: currentResult })
                                }
                                className="pro-btn-primary"
                                style={{
                                  background: "linear-gradient(135deg, #ec4899, #6366f1)",
                                }}
                              >
                                📤 Share Scorecard in Chat
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowDetailedBreakdown(!showDetailedBreakdown)
                                }
                                className="pro-btn-secondary"
                              >
                                {showDetailedBreakdown
                                  ? "▲ Hide Breakdown"
                                  : `▼ Show All ${totalQ} Answers`}
                              </button>
                            </div>
                          </div>
                        </div>

                        {showDetailedBreakdown && (
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "10px",
                                marginBottom: "18px",
                              }}
                            >
                              <h4 style={{ margin: 0, fontSize: "16px", color: "#fff" }}>
                                📋 Complete Question-by-Question Answer Key & Review
                              </h4>

                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                <button
                                  type="button"
                                  onClick={() => setResultFilterMode("all")}
                                  className={
                                    resultFilterMode === "all"
                                      ? "pro-btn-primary"
                                      : "pro-btn-secondary"
                                  }
                                  style={{ padding: "7px 14px", fontSize: "12.5px" }}
                                >
                                  All Questions ({questionsList.length})
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setResultFilterMode("correct")}
                                  className={
                                    resultFilterMode === "correct"
                                      ? "pro-btn-primary"
                                      : "pro-btn-secondary"
                                  }
                                  style={{
                                    padding: "7px 14px",
                                    fontSize: "12.5px",
                                    borderColor: "rgba(16, 185, 129, 0.4)",
                                    color:
                                      resultFilterMode === "correct" ? "#fff" : "#34d399",
                                  }}
                                >
                                  ✔ Correct Only ({correctCount})
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setResultFilterMode("wrong")}
                                  className={
                                    resultFilterMode === "wrong"
                                      ? "pro-btn-primary"
                                      : "pro-btn-secondary"
                                  }
                                  style={{
                                    padding: "7px 14px",
                                    fontSize: "12.5px",
                                    borderColor: "rgba(239, 68, 68, 0.4)",
                                    color:
                                      resultFilterMode === "wrong" ? "#fff" : "#f87171",
                                  }}
                                >
                                  ✖ Wrong Only ({wrongCount})
                                </button>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "14px",
                              }}
                            >
                              {filteredQuestions.map((q) => (
                                <div
                                  key={q.originalIndex}
                                  style={{
                                    padding: "18px 20px",
                                    borderRadius: "12px",
                                    background: "#161b26",
                                    border: `1px solid ${
                                      q.isRight
                                        ? "rgba(16, 185, 129, 0.35)"
                                        : "rgba(239, 68, 68, 0.4)"
                                    }`,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "flex-start",
                                      gap: "12px",
                                      marginBottom: "12px",
                                    }}
                                  >
                                    <div style={{ fontWeight: 700, fontSize: "15px", color: "#fff", lineHeight: 1.5 }}>
                                      Q{q.originalIndex + 1}. {q.questionText}
                                    </div>

                                    <span
                                      style={{
                                        padding: "4px 10px",
                                        borderRadius: "99px",
                                        fontSize: "11.5px",
                                        fontWeight: 800,
                                        whiteSpace: "nowrap",
                                        background: q.isRight
                                          ? "rgba(16, 185, 129, 0.18)"
                                          : "rgba(239, 68, 68, 0.18)",
                                        color: q.isRight ? "#34d399" : "#f87171",
                                        border: `1px solid ${
                                          q.isRight ? "#10b981" : "#ef4444"
                                        }`,
                                      }}
                                    >
                                      {q.isRight ? "✔ CORRECT (+10 XP)" : "✖ INCORRECT (0 XP)"}
                                    </span>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "8px",
                                      marginBottom: "12px",
                                    }}
                                  >
                                    {(q.options || []).map((optText, oIdx) => {
                                      const isCorrectOption = oIdx === q.correctIdx;
                                      const isStudentSelected =
                                        q.hasSelected && oIdx === q.selectedIdx;

                                      let boxBg = "rgba(15, 18, 25, 0.7)";
                                      let boxBorder = "1px solid rgba(255,255,255,0.07)";
                                      let textColor = "#cbd5e1";

                                      if (isCorrectOption) {
                                        boxBg = "rgba(16, 185, 129, 0.14)";
                                        boxBorder = "1px solid #10b981";
                                        textColor = "#ecfdf5";
                                      } else if (isStudentSelected && !isCorrectOption) {
                                        boxBg = "rgba(239, 68, 68, 0.16)";
                                        boxBorder = "1px solid #ef4444";
                                        textColor = "#fef2f2";
                                      }

                                      return (
                                        <div
                                          key={oIdx}
                                          style={{
                                            padding: "10px 14px",
                                            borderRadius: "9px",
                                            background: boxBg,
                                            border: boxBorder,
                                            color: textColor,
                                            fontSize: "13.5px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: "8px",
                                          }}
                                        >
                                          <div>
                                            <strong style={{ marginRight: "8px" }}>
                                              ({String.fromCharCode(65 + oIdx)})
                                            </strong>
                                            <span>{optText}</span>
                                          </div>

                                          <div style={{ display: "flex", gap: "6px" }}>
                                            {isStudentSelected && isCorrectOption && (
                                              <span
                                                style={{
                                                  padding: "2px 8px",
                                                  borderRadius: "6px",
                                                  background: "#10b981",
                                                  color: "#fff",
                                                  fontSize: "11px",
                                                  fontWeight: 700,
                                                }}
                                              >
                                                ✔ Your Answer (Correct)
                                              </span>
                                            )}

                                            {isStudentSelected && !isCorrectOption && (
                                              <span
                                                style={{
                                                  padding: "2px 8px",
                                                  borderRadius: "6px",
                                                  background: "#ef4444",
                                                  color: "#fff",
                                                  fontSize: "11px",
                                                  fontWeight: 700,
                                                }}
                                              >
                                                ✖ Your Answer (Wrong)
                                              </span>
                                            )}

                                            {isCorrectOption && !isStudentSelected && (
                                              <span
                                                style={{
                                                  padding: "2px 8px",
                                                  borderRadius: "6px",
                                                  background: "rgba(16, 185, 129, 0.25)",
                                                  border: "1px solid #10b981",
                                                  color: "#34d399",
                                                  fontSize: "11px",
                                                  fontWeight: 700,
                                                }}
                                              >
                                                ✔ Correct Answer
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div
                                    style={{
                                      padding: "10px 14px",
                                      borderRadius: "8px",
                                      background: "rgba(99, 102, 241, 0.08)",
                                      borderLeft: "3px solid #6366f1",
                                      fontSize: "12.5px",
                                      color: "#cbd5e1",
                                    }}
                                  >
                                    {q.spokenAnswerText && (
                                      <div style={{ marginBottom: "4px", color: "#38bdf8" }}>
                                        🗣️ <strong>Your Spoken Voice Answer:</strong> "{q.spokenAnswerText}"
                                      </div>
                                    )}
                                    <div style={{ marginBottom: "4px" }}>
                                      <strong>Matched Option:</strong>{" "}
                                      <span
                                        style={{
                                          color: q.isRight ? "#34d399" : "#f87171",
                                          fontWeight: 700,
                                        }}
                                      >
                                        {q.hasSelected
                                          ? `Option (${String.fromCharCode(
                                              65 + q.selectedIdx
                                            )}) — ${q.options?.[q.selectedIdx]}`
                                          : q.spokenAnswerText
                                          ? `"${q.spokenAnswerText}" (Did not match correct option)`
                                          : "Not Answered"}
                                      </span>{" "}
                                      &nbsp;|&nbsp; <strong>Correct Answer:</strong>{" "}
                                      <span style={{ color: "#34d399", fontWeight: 700 }}>
                                        Option ({String.fromCharCode(65 + q.correctIdx)}) —{" "}
                                        {q.options?.[q.correctIdx]}
                                      </span>
                                    </div>
                                    <div style={{ color: "#94a3b8" }}>
                                      💡 <strong>Explanation:</strong>{" "}
                                      {q.explanation ||
                                        "Verified against core academic subject principles."}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          SECTION 4: AI STUDY PLANNER & CURRICULUM ROADMAP
         ==================================================================== */}
      {activeTab === "planner" && (
        <div className="edit-profile-container">
          <div
            className="edit-profile-header"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <h2>AI Curriculum Study Planner</h2>
              <p>Generate a structured 6-phase learning roadmap from your syllabus PDF or goal.</p>
            </div>
            {tasks.length > 0 && (
              <button onClick={handleDownloadStudyPlanPdf} className="pro-btn-secondary">
                Export Roadmap (PDF)
              </button>
            )}
          </div>

          <form
            onSubmit={handleGenerateStudyPlan}
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "24px",
              padding: "18px",
              background: "#161b26",
              borderRadius: "12px",
            }}
          >
            <input
              type="text"
              className="pro-input"
              style={{ flex: 1, minWidth: "220px" }}
              value={plannerTopic}
              onChange={(e) => setPlannerTopic(e.target.value)}
              placeholder="Enter course goal or examination subject..."
            />

            <label className="cyber-file-label">
              📄 {plannerFile ? plannerFile.name.slice(0, 18) : "Attach Syllabus PDF"}
              <input
                type="file"
                accept=".pdf,image/*"
                style={{ display: "none" }}
                onChange={(e) => setPlannerFile(e.target.files?.[0] || null)}
              />
            </label>

            <button type="submit" className="pro-btn-primary" disabled={plannerLoading}>
              {plannerLoading ? "Structuring Plan..." : "Generate Study Roadmap"}
            </button>
          </form>

          {editingTask && (
            <form
              onSubmit={handleUpdateTaskSubmit}
              style={{
                background: "#161b26",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
                border: "1px solid #6366f1",
              }}
            >
              <h4 style={{ margin: "0 0 12px 0" }}>Update Study Module</h4>
              <div className="pro-form-group">
                <label>Module Title</label>
                <input
                  type="text"
                  className="pro-input"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="pro-form-group">
                <label>Study Instructions & Objectives</label>
                <input
                  type="text"
                  className="pro-input"
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, description: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="pro-btn-primary">
                  Save Module Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="pro-btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tasks.map((t) => (
              <div key={t._id} className="cyber-item-card" style={{ flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <span className="vip-pill-badge">{t.moduleName || "Study Phase"}</span>
                  <h4 style={{ margin: "6px 0 4px 0" }}>{t.title}</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>{t.description}</p>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleToggleTask(t._id)}
                    className={
                      t.status === "Completed" ? "pro-btn-secondary" : "pro-btn-primary"
                    }
                  >
                    {t.status === "Completed" ? "Completed" : "Mark Complete"}
                  </button>
                  <button onClick={() => setEditingTask(t)} className="pro-btn-secondary">
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      openDeletePopup({
                        type: "task",
                        id: t._id,
                        title: "Delete Study Module?",
                        subtitle: `Remove "${t.title}" from your roadmap?`,
                      })
                    }
                    className="pro-btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          SECTION 5: POMODORO FOCUS LAB
         ==================================================================== */}
      {activeTab === "pomodoro" && (
        <div
          className="edit-profile-container"
          style={{ textAlign: "center", padding: "48px 24px" }}
        >
          <span className="vip-pill-badge">{pomoMode}</span>
          <h2 style={{ margin: "12px 0 6px 0", fontSize: "24px" }}>
            Deep Focus Productivity Timer
          </h2>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              color: "#f8fafc",
              margin: "24px 0",
            }}
          >
            {formatTime(pomoSeconds)}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
            <button onClick={() => setPomoActive(!pomoActive)} className="pro-btn-primary">
              {pomoActive ? "Pause Session" : "Start Focus Session"}
            </button>
            <button
              onClick={() => {
                setPomoActive(false);
                setPomoSeconds(25 * 60);
              }}
              className="pro-btn-secondary"
            >
              Reset Timer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiAgentWidget;