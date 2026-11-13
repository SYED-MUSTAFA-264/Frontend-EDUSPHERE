import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./StudentDashboard.css";
import AiAgentWidget from "./AiAgentWidget";

const API_BASE = "http://localhost:3000/api/ai-agent";

// Extract text from Student uploaded PDF so Faculty AI Auto-Grader can read it
const extractStudentPdfText = async (file) => {
  if (!file || file.type !== "application/pdf") return "";
  try {
    if (!window.pdfjsLib) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
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
      fullText += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return fullText.replace(/\s+/g, " ").trim().slice(0, 18000);
  } catch (e) {
    return "";
  }
};

function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout, token, login } = useAuth();

  // Tabs: 'overview' | 'classroom' | 'tutor' | 'notes' | 'quiz-lab' | 'oral-lab' | 'results' | 'planner' | 'scholar-chat' | 'pomodoro' | 'profile'
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [nowTime, setNowTime] = useState(Date.now());

  const [sidebarCounts, setSidebarCounts] = useState({
    pendingQuizzes: 0,
    pendingOralTests: 0,
    completedQuizzes: 0,
    studyTasks: 0,
    noteBooks: 0,
    unreadChatCount: 0,
    classroomAssignments: 0,
  });

  // Topbar Modals
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [leaderSearch, setLeaderSearch] = useState("");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [myRankInfo, setMyRankInfo] = useState({
    rank: 1,
    tier: "Bronze",
    totalXp: 100,
  });

  // ==========================================================================
  // GOOGLE CLASSROOM STUDENT ASSIGNMENTS STATES (100% SELF-CONTAINED)
  // ==========================================================================
  const [classroomAssignments, setClassroomAssignments] = useState([]);
  const [asgnAnswerInputs, setAsgnAnswerInputs] = useState({});
  const [asgnSelectedFiles, setAsgnSelectedFiles] = useState({});
  const [asgnPreviewUrls, setAsgnPreviewUrls] = useState({});
  const [asgnSubmittingId, setAsgnSubmittingId] = useState(null);
  const [asgnCommentInputs, setAsgnCommentInputs] = useState({});

  const cardRef = useRef(null);

  // 1-Second Live Clock for Assignment Countdown Timers
  useEffect(() => {
    const clock = setInterval(() => setNowTime(Date.now()), 1000);
    return () => clearInterval(clock);
  }, []);

  const getPersistedUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.StudentName || parsed?.name || parsed?.StudentEmail)
          return parsed;
      }
      if (user?.StudentName || user?.name) return user;

      const savedToken = token || localStorage.getItem("token");
      if (savedToken) {
        const base64Url = savedToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
      }
    } catch (err) {
      console.error("Error reading user session:", err);
    }
    return user || {};
  };

  const currentUser = getPersistedUser();

  const studentName =
    currentUser?.StudentName ||
    currentUser?.name ||
    currentUser?.StudentEmail?.split("@")[0] ||
    "Scholar";

  const studentEmail =
    currentUser?.StudentEmail || currentUser?.email || "student@edusphere.edu";
  const studentPhone = currentUser?.Phone || currentUser?.phone || "";
  const studentAvatar = currentUser?.ProfileImage || currentUser?.avatar || "";
  const studentRole = currentUser?.role || currentUser?.Role || "Student";
  const studentId =
    currentUser?._id || currentUser?.id || studentEmail || "default_student";

  // Auto-redirect if user role in localStorage or MongoDB is "faculty"
  useEffect(() => {
    if (String(studentRole).toLowerCase() === "faculty") {
      navigate("/faculty-dashboard", { replace: true });
      return;
    }

    const verifyDbRole = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/faculty/check-role?email=${encodeURIComponent(
            studentEmail
          )}&studentId=${encodeURIComponent(studentId)}`
        );
        const data = await res.json();
        if (
          data &&
          data.success &&
          String(data.role).toLowerCase() === "faculty"
        ) {
          const updatedUser = {
            ...currentUser,
            ...(data.user || {}),
            role: "faculty",
            Role: "faculty",
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          navigate("/faculty-dashboard", { replace: true });
        }
      } catch (e) {}
    };

    verifyDbRole();
  }, [studentRole, studentEmail, studentId, navigate]);

  const [profileForm, setProfileForm] = useState({
    StudentName: studentName,
    StudentEmail: studentEmail,
    Phone: studentPhone,
    ProfileImage: studentAvatar,
    Password: "",
    ConfirmPassword: "",
  });

  useEffect(() => {
    setProfileForm({
      StudentName: studentName,
      StudentEmail: studentEmail,
      Phone: studentPhone,
      ProfileImage: studentAvatar,
      Password: "",
      ConfirmPassword: "",
    });
  }, [studentName, studentEmail, studentPhone, studentAvatar]);

  // Fetch Student Classroom Assignments from Backend
  const fetchStudentClassroomAssignments = async () => {
    try {
      const activeToken = token || localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        studentId,
        email: studentEmail || "",
        studentName: studentName || "",
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
    const loadNotifsAndAssignments = async () => {
      try {
        const activeToken = token || localStorage.getItem("token");
        const queryParams = new URLSearchParams({
          studentId,
          studentName,
          phone: studentPhone || "",
          email: studentEmail || "",
          avatar: studentAvatar || "",
        });
        const res = await fetch(
          `${API_BASE}/dashboard-data?${queryParams.toString()}`,
          {
            headers: activeToken
              ? { Authorization: `Bearer ${activeToken}` }
              : {},
          }
        );
        const data = await res.json();
        if (data && data.success) {
          if (Array.isArray(data.notifications)) {
            setNotificationsData(data.notifications);
          }
          if (Array.isArray(data.leaderboard)) {
            setLeaderboardData(data.leaderboard);
          }
          if (data.stats) {
            setMyRankInfo({
              rank: data.stats.rank || 1,
              tier: data.stats.tier || "Bronze",
              totalXp: data.stats.totalXp || 100,
            });
          }
        }
      } catch (e) {}
      await fetchStudentClassroomAssignments();
    };

    loadNotifsAndAssignments();
    const timer = setTimeout(() => setLoading(false), 650);
    const interval = setInterval(loadNotifsAndAssignments, 6500);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [studentId, studentName, studentPhone, studentEmail, studentAvatar, token]);

  // Format Live Countdown Timer for Assignments
  const formatAssignmentCountdown = (dueDateStr) => {
    if (!dueDateStr) return { expired: true, label: "No Deadline" };
    const diff = new Date(dueDateStr).getTime() - nowTime;
    if (diff <= 0) {
      return { expired: true, label: "Deadline Passed" };
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
    return { expired: false, label: `Due in ${str}` };
  };

  // Find current student's submission inside an assignment
  const getMySubmission = (asgn) => {
    if (!asgn || !Array.isArray(asgn.submissions)) return null;
    return asgn.submissions.find(
      (s) =>
        String(s.studentId) === String(studentId) ||
        (studentEmail &&
          String(s.studentEmail || "").toLowerCase() ===
            String(studentEmail).toLowerCase()) ||
        String(s.studentName || "").toLowerCase() ===
          String(studentName).toLowerCase()
    );
  };

  // Select Video / Image / PDF and create instant preview URL before submitting
  const handleSelectAssignmentFile = (assignmentId, file) => {
    setAsgnSelectedFiles((prev) => ({ ...prev, [assignmentId]: file || null }));
    setAsgnPreviewUrls((prev) => {
      if (prev[assignmentId]) URL.revokeObjectURL(prev[assignmentId]);
      return {
        ...prev,
        [assignmentId]: file ? URL.createObjectURL(file) : "",
      };
    });
  };

  // Turn In Assignment to Faculty
  const handleTurnInAssignment = async (e, asgn) => {
    e.preventDefault();
    if (!asgn || !asgn._id) return;

    const timerCheck = formatAssignmentCountdown(asgn.dueDate);
    if (timerCheck.expired) {
      setStatusMsg({
        type: "error",
        text: "Deadline has passed. Submissions are closed for this assignment.",
      });
      return;
    }

    const mySub = getMySubmission(asgn);
    const ansText =
      asgnAnswerInputs[asgn._id] !== undefined
        ? asgnAnswerInputs[asgn._id].trim()
        : (mySub?.answerText || "").trim();
    const attachedFile = asgnSelectedFiles[asgn._id] || null;

    if (!ansText && !attachedFile) {
      setStatusMsg({
        type: "error",
        text: "Please attach your Video, Photo, or PDF file (or write a response) before turning in.",
      });
      return;
    }

    setAsgnSubmittingId(asgn._id);
    setStatusMsg({
      type: "info",
      text: "Uploading your work and turning in assignment...",
    });

    try {
      let extractedPdfText = "";
      if (attachedFile && attachedFile.type === "application/pdf") {
        extractedPdfText = await extractStudentPdfText(attachedFile);
      }

      const formData = new FormData();
      formData.append("studentId", studentId);
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

      const activeToken = token || localStorage.getItem("token");
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
        setStatusMsg({ type: "success", text: data.message });
        handleSelectAssignmentFile(asgn._id, null);
        if (data.assignment) {
          setClassroomAssignments((prev) =>
            prev.map((a) =>
              String(a._id) === String(asgn._id) ? data.assignment : a
            )
          );
        } else {
          await fetchStudentClassroomAssignments();
        }
      } else {
        setStatusMsg({
          type: "error",
          text: data.message || "Could not turn in assignment.",
        });
      }
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: "Network error while turning in assignment.",
      });
    } finally {
      setAsgnSubmittingId(null);
    }
  };

  // Post Student Question / Comment on Assignment
  const handlePostAssignmentComment = async (e, assignmentId) => {
    e.preventDefault();
    const text = (asgnCommentInputs[assignmentId] || "").trim();
    if (!text) return;

    try {
      const activeToken = token || localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/classroom/assignments/${assignmentId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
          },
          body: JSON.stringify({
            senderId: studentId,
            senderName: studentName,
            senderRole: "student",
            studentThreadId: studentId,
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

  const renderStars = (count = 0) => {
    const valid = Math.max(0, Math.min(5, Number(count) || 0));
    return (
      <span style={{ letterSpacing: "2px", fontSize: "15px", color: "#fbbf24" }}>
        {"★".repeat(valid)}
        {"☆".repeat(5 - valid)}
      </span>
    );
  };

  const renderTierBadge = (tierName = "Bronze") => {
    const t = String(tierName).toLowerCase();
    if (t === "diamond") {
      return (
        <span className="tier-badge diamond">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2L2 8l10 14L22 8l-4-6H6zm1.5 2h9l2.2 3.3H5.3L7.5 4z" />
          </svg>
          Diamond
        </span>
      );
    }
    if (t === "platinum") {
      return (
        <span className="tier-badge platinum">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Platinum
        </span>
      );
    }
    if (t === "gold") {
      return (
        <span className="tier-badge gold">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 14h14v2H5v-2z" />
          </svg>
          Gold
        </span>
      );
    }
    if (t === "silver") {
      return (
        <span className="tier-badge silver">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
          </svg>
          Silver
        </span>
      );
    }
    return (
      <span className="tier-badge bronze">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="9" />
        </svg>
        Bronze
      </span>
    );
  };

  const handleMarkNotificationsRead = async () => {
    setNotificationsData((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      const activeToken = token || localStorage.getItem("token");
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({ studentId }),
      });
    } catch (e) {}
  };

  const handleClearNotifications = async () => {
    setNotificationsData([]);
    try {
      const activeToken = token || localStorage.getItem("token");
      await fetch(
        `${API_BASE}/notifications/clear?studentId=${encodeURIComponent(studentId)}`,
        {
          method: "DELETE",
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        }
      );
    } catch (e) {}
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: "", text: "" });

    if (
      profileForm.Password &&
      profileForm.Password !== profileForm.ConfirmPassword
    ) {
      setStatusMsg({
        type: "error",
        text: "New passwords do not match. Please verify.",
      });
      return;
    }

    setUpdateLoading(true);
    try {
      const activeToken = token || localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/students/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({
            StudentName: profileForm.StudentName,
            StudentEmail: profileForm.StudentEmail,
            Phone: profileForm.Phone,
            ProfileImage: profileForm.ProfileImage,
            Password: profileForm.Password || undefined,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update account profile.");
      }

      const updatedUser = {
        ...currentUser,
        StudentName: data.user?.StudentName || profileForm.StudentName,
        StudentEmail: data.user?.StudentEmail || profileForm.StudentEmail,
        Phone: data.user?.Phone ?? profileForm.Phone,
        ProfileImage: data.user?.ProfileImage ?? profileForm.ProfileImage,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (login && activeToken) login(activeToken, updatedUser);

      await fetch(`${API_BASE}/social/sync-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId,
          studentName: updatedUser.StudentName,
          studentEmail: updatedUser.StudentEmail,
          phone: updatedUser.Phone,
          avatar: updatedUser.ProfileImage,
        }),
      }).catch(() => {});

      setStatusMsg({
        type: "success",
        text: "Account profile updated successfully.",
      });
      setProfileForm((prev) => ({ ...prev, Password: "", ConfirmPassword: "" }));
    } catch (error) {
      setStatusMsg({
        type: "error",
        text: error.message || "Unable to reach the server. Please try again.",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${-y / 28}deg) rotateY(${x / 28}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  const unreadNotifCount = notificationsData.filter((n) => !n.isRead).length;
  const isAnyPopupOpen = showLeaderboardModal || showNotifModal;

  const filteredLeaderboard = leaderboardData.filter((entry) =>
    String(entry.studentName || "")
      .toLowerCase()
      .includes(leaderSearch.trim().toLowerCase())
  );

  const mySubmittedAssignments = classroomAssignments
    .map((asgn) => ({
      assignment: asgn,
      mySub: getMySubmission(asgn),
    }))
    .filter((item) => Boolean(item.mySub));

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="pro-loader-3d">
          <div className="pro-cube-ring"></div>
          <div className="pro-cube-ring ring-two"></div>
          <div className="pro-cube-core"></div>
        </div>
        <div className="loader-status-title">Initializing Workspace</div>
        <div className="loader-status-sub">
          Loading Classroom Assignments & Academic Suite...
        </div>
      </div>
    );
  }

  return (
    <div className="vip-dashboard-wrapper">
      {showLeaderboardModal && (
        <div
          className="pro-popup-overlay"
          onClick={() => setShowLeaderboardModal(false)}
        >
          <div className="pro-popup-modal" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(245, 158, 11, 0.14)",
                    border: "1px solid rgba(245, 158, 11, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fbbf24",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                      Global Scholar Leaderboard
                    </h2>
                    {renderTierBadge(myRankInfo.tier)}
                  </div>
                  <p style={{ margin: "3px 0 0 0", fontSize: "13px", color: "#94a3b8" }}>
                    Live rankings of registered students based on Total XP, Assignments & Exam Accuracy
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowLeaderboardModal(false)}
                className="modal-close-icon-btn"
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div className="pro-search-wrapper">
                <input
                  type="text"
                  className="pro-search-input"
                  style={{ paddingLeft: "14px" }}
                  placeholder="Search registered scholar by name..."
                  value={leaderSearch}
                  onChange={(e) => setLeaderSearch(e.target.value)}
                />
              </div>
            </div>

            {!leaderSearch.trim() && leaderboardData.length >= 2 && (
              <div className="leaderboard-podium-grid">
                {leaderboardData.slice(0, 3).map((scholar, idx) => {
                  const rankNum = idx + 1;
                  return (
                    <div
                      key={scholar.studentId || idx}
                      className={`podium-card rank-${rankNum}`}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "3px 10px",
                          borderRadius: "99px",
                          background: "rgba(255,255,255,0.06)",
                          fontSize: "11px",
                          fontWeight: 800,
                          color:
                            rankNum === 1
                              ? "#fbbf24"
                              : rankNum === 2
                              ? "#e2e8f0"
                              : "#fdba74",
                          marginBottom: "10px",
                        }}
                      >
                        RANK #{rankNum}
                      </div>

                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "14px",
                          margin: "0 auto 10px auto",
                          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "19px",
                          fontWeight: 800,
                          color: "#fff",
                          overflow: "hidden",
                        }}
                      >
                        {scholar.avatar ? (
                          <img
                            src={scholar.avatar}
                            alt={scholar.studentName}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          String(scholar.studentName || "S")
                            .charAt(0)
                            .toUpperCase()
                        )}
                      </div>

                      <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", color: "#fff" }}>
                        {scholar.studentName}
                        {scholar.isCurrentUser ? " (You)" : ""}
                      </h4>

                      <div style={{ marginBottom: "8px" }}>
                        {renderTierBadge(scholar.tier)}
                      </div>

                      <div style={{ fontSize: "12.5px", color: "#94a3b8" }}>
                        <strong style={{ color: "#34d399" }}>{scholar.totalXp} XP</strong> •{" "}
                        {scholar.avgAccuracy || 0}% Accuracy
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="leaderboard-list-scroll">
              {filteredLeaderboard.map((item) => (
                <div
                  key={item.studentId}
                  className={`leaderboard-row ${
                    item.isCurrentUser ? "current-user-row" : ""
                  }`}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "9px",
                        background: "rgba(99, 102, 241, 0.16)",
                        color: "#a5b4fc",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "13px",
                      }}
                    >
                      #{item.rank}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14.5px", color: "#fff" }}>
                        {item.studentName}
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                        Level {item.level || 1} • {item.quizzesPassed || 0} Exams Passed •{" "}
                        {item.avgAccuracy || 0}% Accuracy
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {renderTierBadge(item.tier)}
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 800,
                        fontSize: "14px",
                        color: "#34d399",
                      }}
                    >
                      {item.totalXp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showNotifModal && (
        <div
          className="pro-popup-overlay"
          onClick={() => setShowNotifModal(false)}
        >
          <div
            className="pro-popup-modal"
            style={{ maxWidth: "620px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: "16px",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 700 }}>
                  Notification Center
                </h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#94a3b8" }}>
                  Real-time alerts for Classroom Assignments, Grades, Quizzes & Chat
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {notificationsData.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={handleMarkNotificationsRead}
                      className="pro-btn-secondary"
                      style={{ padding: "7px 12px", fontSize: "12px" }}
                    >
                      Mark Read
                    </button>
                    <button
                      type="button"
                      onClick={handleClearNotifications}
                      className="pro-btn-danger"
                      style={{ padding: "7px 12px", fontSize: "12px" }}
                    >
                      Clear All
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setShowNotifModal(false)}
                  className="modal-close-icon-btn"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="leaderboard-list-scroll" style={{ maxHeight: "420px" }}>
              {notificationsData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
                  No active notifications.
                </div>
              ) : (
                notificationsData.map((notif, idx) => (
                  <div
                    key={notif._id || idx}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      background: notif.isRead
                        ? "rgba(18, 22, 34, 0.75)"
                        : "rgba(99, 102, 241, 0.14)",
                      border: notif.isRead
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "1px solid rgba(99, 102, 241, 0.4)",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#fff", marginBottom: "4px" }}>
                      {notif.title}
                    </div>
                    <div style={{ fontSize: "13px", color: "#cbd5e1" }}>{notif.message}</div>
                    <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
                      {new Date(notif.createdAt || Date.now()).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`vip-dashboard-layout ${isAnyPopupOpen ? "modal-blur-active" : ""}`}>
        <aside className="vip-sidebar">
          <div>
            <div className="sidebar-brand">
              <div className="brand-icon-glow">E</div>
              <h2>
                EDU<span>SPHERE</span>
              </h2>
            </div>

            <div className="sidebar-section-label">Workspace</div>
            <nav className="sidebar-menu">
              <button
                className={`menu-item ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <span className="menu-item-left">
                  <span>📊</span>
                  <span>Executive Overview</span>
                </span>
              </button>

              <button
                className={`menu-item ${activeTab === "classroom" ? "active" : ""}`}
                onClick={() => setActiveTab("classroom")}
              >
                <span className="menu-item-left">
                  <span>📚</span>
                  <span>Classroom Assignments</span>
                </span>
                <span
                  className="sidebar-badge"
                  style={{
                    background: "rgba(99, 102, 241, 0.22)",
                    color: "#a5b4fc",
                  }}
                >
                  {classroomAssignments.length}
                </span>
              </button>

              <div className="sidebar-section-label">AI Academic Suite</div>

              <button
                className={`menu-item ${activeTab === "tutor" ? "active" : ""}`}
                onClick={() => setActiveTab("tutor")}
              >
                <span className="menu-item-left">
                  <span>🤖</span>
                  <span>AI Personal Tutor</span>
                </span>
              </button>

              <button
                className={`menu-item ${activeTab === "notes" ? "active" : ""}`}
                onClick={() => setActiveTab("notes")}
              >
                <span className="menu-item-left">
                  <span>📖</span>
                  <span>Create Notes (3D Book)</span>
                </span>
                <span className="sidebar-badge">{sidebarCounts.noteBooks || 0}</span>
              </button>

              <button
                className={`menu-item ${activeTab === "quiz-lab" ? "active" : ""}`}
                onClick={() => setActiveTab("quiz-lab")}
              >
                <span className="menu-item-left">
                  <span>📝</span>
                  <span>Academic Quizzes</span>
                </span>
                <span className="sidebar-badge">{sidebarCounts.pendingQuizzes || 0}</span>
              </button>

              <button
                className={`menu-item ${activeTab === "oral-lab" ? "active" : ""}`}
                onClick={() => setActiveTab("oral-lab")}
              >
                <span className="menu-item-left">
                  <span>🎙️</span>
                  <span>AI Oral Test</span>
                </span>
                <span
                  className="sidebar-badge"
                  style={{
                    background: "rgba(16, 185, 129, 0.2)",
                    color: "#34d399",
                  }}
                >
                  {sidebarCounts.pendingOralTests || 0}
                </span>
              </button>

              <button
                className={`menu-item ${activeTab === "results" ? "active" : ""}`}
                onClick={() => setActiveTab("results")}
              >
                <span className="menu-item-left">
                  <span>🏆</span>
                  <span>Results & Analytics</span>
                </span>
                <span className="sidebar-badge">
                  {(sidebarCounts.completedQuizzes || 0) + mySubmittedAssignments.length}
                </span>
              </button>

              <button
                className={`menu-item ${activeTab === "planner" ? "active" : ""}`}
                onClick={() => setActiveTab("planner")}
              >
                <span className="menu-item-left">
                  <span>🗺️</span>
                  <span>AI Study Planner</span>
                </span>
                <span className="sidebar-badge">{sidebarCounts.studyTasks || 0}</span>
              </button>

              <button
                className={`menu-item ${activeTab === "scholar-chat" ? "active" : ""}`}
                onClick={() => setActiveTab("scholar-chat")}
              >
                <span className="menu-item-left">
                  <span>💬</span>
                  <span>Scholar Connect & Chat</span>
                </span>
                <span className="sidebar-badge">{sidebarCounts.unreadChatCount || 0}</span>
              </button>

              <button
                className={`menu-item ${activeTab === "pomodoro" ? "active" : ""}`}
                onClick={() => setActiveTab("pomodoro")}
              >
                <span className="menu-item-left">
                  <span>⏱️</span>
                  <span>Focus Timer</span>
                </span>
              </button>

              <div className="sidebar-section-label">Preferences</div>

              <button
                className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <span className="menu-item-left">
                  <span>⚙️</span>
                  <span>Account Settings</span>
                </span>
              </button>
            </nav>
          </div>

          <div className="sidebar-footer">
            <button
              onClick={handleLogout}
              className="pro-btn-danger"
              style={{ width: "100%" }}
            >
              Sign Out
            </button>
          </div>
        </aside>

        <main className="vip-main-content">
          <header className="vip-topbar">
            <div className="topbar-welcome">
              <div className="live-status-badge">
                <span className="pulse-beacon"></span>
                WORKSPACE ACTIVE
              </div>
              <h1>
                Welcome back, <span className="highlight-text">{studentName}</span>
              </h1>
            </div>

            <div className="topbar-actions">
              <button
                type="button"
                className="exec-header-btn"
                onClick={() => setShowLeaderboardModal(true)}
                title="Open Global Scholar Leaderboard"
              >
                <span className="exec-icon-box gold-tint">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                </span>
                <span>Leaderboard</span>
                <span className="exec-rank-divider" />
                <span
                  style={{
                    color: "#a5b4fc",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                  }}
                >
                  #{myRankInfo.rank}
                </span>
                {renderTierBadge(myRankInfo.tier)}
              </button>

              <button
                type="button"
                className="exec-header-btn exec-bell-btn"
                onClick={() => {
                  setShowNotifModal(true);
                  handleMarkNotificationsRead();
                }}
                title="Open Activity Notifications"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadNotifCount > 0 && (
                  <span className="notif-count-badge">{unreadNotifCount}</span>
                )}
              </button>

              <div
                className="topbar-user-pill"
                onClick={() => setActiveTab("profile")}
                style={{ cursor: "pointer" }}
              >
                <div className="mini-avatar">
                  {studentAvatar ? (
                    <img src={studentAvatar} alt={studentName} />
                  ) : (
                    studentName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="mini-info">
                  <span className="mini-name">{studentName}</span>
                  <span className="mini-role">{studentRole}</span>
                </div>
              </div>
            </div>
          </header>

          {statusMsg.text && (
            <div className={`status-alert ${statusMsg.type}`}>
              <span>{statusMsg.text}</span>
              <button
                onClick={() => setStatusMsg({ type: "", text: "" })}
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

          {activeTab === "overview" && (
            <div
              className="vip-hero-3d-card"
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="hero-card-body">
                <div className="avatar-main">
                  {studentAvatar ? (
                    <img src={studentAvatar} alt={studentName} />
                  ) : (
                    studentName.charAt(0).toUpperCase()
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      marginBottom: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span className="vip-pill-badge">{studentRole} Account</span>
                    {renderTierBadge(myRankInfo.tier)}
                    <span
                      className="vip-pill-badge"
                      style={{
                        background: "rgba(16, 185, 129, 0.14)",
                        color: "#34d399",
                        borderColor: "rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      Global Rank #{myRankInfo.rank}
                    </span>
                  </div>
                  <h2 style={{ margin: "0 0 4px 0", fontSize: "24px" }}>{studentName}</h2>
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "13.5px" }}>
                    {studentEmail} {studentPhone ? ` • 📞 ${studentPhone}` : ""}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    className="pro-btn-primary"
                    onClick={() => setActiveTab("classroom")}
                  >
                    Classwork ({classroomAssignments.length})
                  </button>
                  <button
                    className="pro-btn-secondary"
                    onClick={() => setActiveTab("scholar-chat")}
                  >
                    Scholar Connect & Chat
                  </button>
                  <button
                    className="pro-btn-secondary"
                    onClick={() => setActiveTab("oral-lab")}
                  >
                    AI Oral Test
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              GOOGLE CLASSROOM STUDENT PORTAL (2-COLUMN SPLIT + LIVE PREVIEW)
             ================================================================ */}
          {activeTab === "classroom" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div
                className="gc-3d-panel"
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
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
                <span className="vip-pill-badge">
                  {classroomAssignments.length} Assigned
                </span>
              </div>

              {classroomAssignments.length === 0 ? (
                <div
                  className="gc-3d-panel"
                  style={{
                    textAlign: "center",
                    padding: "52px 24px",
                    color: "#94a3b8",
                  }}
                >
                  <h3 style={{ color: "#fff", margin: "0 0 6px 0", fontSize: "17px" }}>
                    No Classwork Assigned Yet
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px" }}>
                    When your faculty posts an assignment, it will appear here with a live countdown timer.
                  </p>
                </div>
              ) : (
                classroomAssignments.map((asgn) => {
                  const timerObj = formatAssignmentCountdown(asgn.dueDate);
                  const mySub = getMySubmission(asgn);
                  const isFirstMe = mySub && mySub.submissionRank === 1;
                  const currentAnswerVal =
                    asgnAnswerInputs[asgn._id] !== undefined
                      ? asgnAnswerInputs[asgn._id]
                      : mySub?.answerText || "";
                  const selectedFileObj = asgnSelectedFiles[asgn._id] || null;
                  const localPreviewUrl = asgnPreviewUrls[asgn._id] || "";

                  return (
                    <div key={asgn._id} className="gc-student-assignment-row">
                      {/* LEFT COLUMN: ASSIGNMENT DETAILS, TEACHER MEDIA & CLASS COMMENTS */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "14px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <span className="vip-pill-badge">{asgn.subject}</span>
                          <span className="gc-rank-pill">
                            {asgn.totalMarks} Points
                          </span>
                          <span
                            className={`gc-timer-pill ${
                              timerObj.expired ? "expired" : ""
                            }`}
                          >
                            {timerObj.label}
                          </span>
                          {mySub && (
                            <span
                              className={`gc-rank-pill ${
                                isFirstMe ? "rank-1" : ""
                              }`}
                            >
                              {isFirstMe
                                ? "#1 First Submitter"
                                : `Submission #${mySub.submissionRank}`}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "20px",
                              color: "#ffffff",
                            }}
                          >
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

                        {/* TEACHER REFERENCE VIDEO / IMAGE / PDF PREVIEW */}
                        {asgn.referenceFileUrl && (
                          <div
                            className="gc-media-preview-card"
                            style={{ maxWidth: "460px" }}
                          >
                            <div className="gc-media-preview-header">
                              <span>
                                Reference Material: {asgn.referenceFileName}
                              </span>
                              <a
                                href={asgn.referenceFileUrl}
                                download={asgn.referenceFileName || "Reference"}
                                style={{
                                  color: "#818cf8",
                                  textDecoration: "none",
                                  fontSize: "11.5px",
                                }}
                              >
                                Download
                              </a>
                            </div>
                            {asgn.referenceFileType === "video" && (
                              <video
                                src={asgn.referenceFileUrl}
                                controls
                                className="gc-preview-video"
                              />
                            )}
                            {asgn.referenceFileType === "image" && (
                              <img
                                src={asgn.referenceFileUrl}
                                alt="Reference"
                                className="gc-preview-img"
                              />
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

                        {/* GRADED SCORECARD BOX */}
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
                                Returned Grade & Evaluation (Grade {mySub.grade})
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#e2e8f0",
                                  marginTop: "4px",
                                }}
                              >
                                {mySub.feedback || "Evaluated by faculty."}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div
                                style={{
                                  fontSize: "22px",
                                  fontWeight: 800,
                                  color: "#34d399",
                                }}
                              >
                                {mySub.obtainedMarks} / {asgn.totalMarks}
                              </div>
                              <div>{renderStars(mySub.stars || 5)}</div>
                            </div>
                          </div>
                        )}

                        {/* CLASS COMMENTS STREAM */}
                        <div
                          style={{
                            marginTop: "6px",
                            paddingTop: "12px",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#94a3b8",
                              marginBottom: "8px",
                            }}
                          >
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
                                      color:
                                        c.senderRole === "faculty"
                                          ? "#34d399"
                                          : "#818cf8",
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
                            onSubmit={(e) =>
                              handlePostAssignmentComment(e, asgn._id)
                            }
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

                      {/* RIGHT COLUMN: GOOGLE CLASSROOM "YOUR WORK" SUBMISSION CARD */}
                      <div className="gc-your-work-box">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "15px",
                              fontWeight: 700,
                              color: "#ffffff",
                            }}
                          >
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

                        {/* 1. LIVE PREVIEW OF NEWLY SELECTED FILE (BEFORE CLICKING TURN IN) */}
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
                                onClick={() =>
                                  handleSelectAssignmentFile(asgn._id, null)
                                }
                                className="gc-media-remove-btn"
                                title="Remove file"
                              >
                                ✕
                              </button>
                            </div>

                            {selectedFileObj.type.startsWith("video/") && (
                              <video
                                src={localPreviewUrl}
                                controls
                                className="gc-preview-video"
                              />
                            )}
                            {selectedFileObj.type.startsWith("image/") && (
                              <img
                                src={localPreviewUrl}
                                alt="Preview"
                                className="gc-preview-img"
                              />
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

                        {/* 2. ALREADY SUBMITTED FILE PREVIEW (IF NO NEW FILE SELECTED) */}
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
                              <video
                                src={mySub.fileUrl}
                                controls
                                className="gc-preview-video"
                              />
                            )}
                            {mySub.fileType === "image" && (
                              <img
                                src={mySub.fileUrl}
                                alt={mySub.fileName}
                                className="gc-preview-img"
                              />
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
                            onSubmit={(e) => handleTurnInAssignment(e, asgn)}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <textarea
                              className="pro-input"
                              style={{
                                minHeight: "74px",
                                fontSize: "12.5px",
                                resize: "vertical",
                              }}
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
                                {selectedFileObj
                                  ? "Change File"
                                  : "Add Video, Photo, or PDF"}
                              </span>
                              <input
                                type="file"
                                accept="video/*,image/*,.pdf"
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  handleSelectAssignmentFile(
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

          {/* SHOW GRADED CLASSROOM ASSIGNMENTS AT TOP OF RESULTS & ANALYTICS */}
          {activeTab === "results" && mySubmittedAssignments.length > 0 && (
            <div className="gc-3d-panel" style={{ marginBottom: "10px" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "17px", color: "#fff" }}>
                Classwork Assignment Grades & Faculty Evaluations ({mySubmittedAssignments.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {mySubmittedAssignments.map(({ assignment: asgn, mySub }) => {
                  const isGraded = mySub.status === "Graded";
                  const isFirst = mySub.submissionRank === 1;
                  return (
                    <div
                      key={asgn._id}
                      className="cyber-item-card"
                      style={{ flexWrap: "wrap" }}
                    >
                      <div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
                          <span className="vip-pill-badge">{asgn.subject}</span>
                          <span className={`gc-rank-pill ${isFirst ? "rank-1" : ""}`}>
                            {isFirst ? "#1 First Submitter" : `Submission #${mySub.submissionRank}`}
                          </span>
                          {isGraded ? (
                            <>
                              <span className="gc-timer-pill">
                                Score: {mySub.obtainedMarks}/{asgn.totalMarks} ({mySub.percentage}% • Grade {mySub.grade})
                              </span>
                              {renderStars(mySub.stars || 5)}
                            </>
                          ) : (
                            <span className="gc-rank-pill">Turned in • Awaiting Grade</span>
                          )}
                        </div>
                        <h4 style={{ margin: "0 0 3px 0", fontSize: "15.5px", color: "#fff" }}>
                          {asgn.title}
                        </h4>
                        <div style={{ fontSize: "12.5px", color: "#94a3b8" }}>
                          {isGraded
                            ? `Faculty Feedback: "${mySub.feedback || "Evaluated"}"`
                            : `Submitted on ${new Date(mySub.submittedAt).toLocaleString()}`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("classroom")}
                        className="pro-btn-secondary"
                      >
                        View Work
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RENDER AI AGENT WIDGET ONLY FOR NON-CLASSROOM & NON-PROFILE TABS */}
          {activeTab !== "profile" && activeTab !== "classroom" && (
            <AiAgentWidget
              studentId={studentId}
              studentName={studentName}
              studentPhone={studentPhone}
              studentEmail={studentEmail}
              studentAvatar={studentAvatar}
              externalTab={activeTab === "overview" ? "tutor" : activeTab}
              onSelectTab={(tabName) => setActiveTab(tabName)}
              onCountsChange={setSidebarCounts}
              onSyncHeaderData={({ leaderboard, notifications, stats }) => {
                if (Array.isArray(leaderboard)) setLeaderboardData(leaderboard);
                if (Array.isArray(notifications))
                  setNotificationsData(notifications);
                if (stats) {
                  setMyRankInfo({
                    rank: stats.rank || 1,
                    tier: stats.tier || "Bronze",
                    totalXp: stats.totalXp || 100,
                  });
                }
              }}
            />
          )}

          {activeTab === "profile" && (
            <div className="edit-profile-container">
              <div className="edit-profile-header">
                <h2>Account Settings</h2>
                <p>
                  Update your personal details, phone number, avatar URL, and security credentials.
                </p>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "18px",
                    marginBottom: "20px",
                  }}
                >
                  <div className="pro-form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="StudentName"
                      className="pro-input"
                      value={profileForm.StudentName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="pro-form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="StudentEmail"
                      className="pro-input"
                      value={profileForm.StudentEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="pro-form-group">
                    <label>Phone Number (Searchable on Scholar Connect)</label>
                    <input
                      type="text"
                      name="Phone"
                      className="pro-input"
                      placeholder="03001234567"
                      value={profileForm.Phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pro-form-group">
                    <label>Profile Avatar URL</label>
                    <input
                      type="text"
                      name="ProfileImage"
                      className="pro-input"
                      placeholder="https://example.com/avatar.jpg"
                      value={profileForm.ProfileImage}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pro-form-group">
                    <label>New Password (Optional)</label>
                    <input
                      type="password"
                      name="Password"
                      className="pro-input"
                      placeholder="Leave blank to keep current"
                      value={profileForm.Password}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pro-form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="ConfirmPassword"
                      className="pro-input"
                      placeholder="Confirm new password"
                      value={profileForm.ConfirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="pro-btn-primary"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Saving Changes..." : "Save Profile Changes"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;