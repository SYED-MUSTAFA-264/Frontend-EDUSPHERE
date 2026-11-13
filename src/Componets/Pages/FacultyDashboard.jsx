import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./StudentDashboard.css";
import AiAgentWidget from "./AiAgentWidget";

const API_BASE = "http://localhost:3000/api/ai-agent";

const CORE_SUBJECTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
];
function FacultyDashboard() {
  const navigate = useNavigate();
  const { user, logout, token, login } = useAuth();

  // Faculty Navigation Tabs: 'overview' | 'classroom' | 'scholars' | 'gradebook' | 'announcements' | 'scholar-chat' | 'profile'
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [nowTime, setNowTime] = useState(Date.now());

  // Top Header Modals: Leaderboard & Notifications
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [leaderSearch, setLeaderSearch] = useState("");

  // Faculty Data States
  const [metrics, setMetrics] = useState({
    totalScholars: 0,
    totalExamsConducted: 0,
    pendingAssignedExams: 0,
    totalAssignments: 0,
    classAvgAccuracy: 0,
    passRatePercent: 0,
    activeCommunities: 0,
  });
  const [scholarsList, setScholarsList] = useState([]);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [scholarSearch, setScholarSearch] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradebookFilter, setGradebookFilter] = useState("all");

  // ==========================================================================
  // GOOGLE CLASSROOM ASSIGNMENT CREATOR & GRADING STATES
  // ==========================================================================
  const [asgnTitle, setAsgnTitle] = useState("");
  const [asgnDesc, setAsgnDesc] = useState("");
  const [asgnSubject, setAsgnSubject] = useState("Computer Science");
  const [customSubject, setCustomSubject] = useState("");
  const [asgnMarks, setAsgnMarks] = useState(100); // 20 | 50 | 100
  const [asgnDueDate, setAsgnDueDate] = useState("");
  const [asgnTargetType, setAsgnTargetType] = useState("ALL"); // 'ALL' | 'SPECIFIC'
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [asgnFile, setAsgnFile] = useState(null);
  const [asgnFilePreviewUrl, setAsgnFilePreviewUrl] = useState("");
  const [asgnCreating, setAsgnCreating] = useState(false);

  // Live Video / Image / PDF Preview before publishing
  useEffect(() => {
    if (!asgnFile) {
      setAsgnFilePreviewUrl("");
      return;
    }
    const objUrl = URL.createObjectURL(asgnFile);
    setAsgnFilePreviewUrl(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [asgnFile]);

  // Active Assignment Selected for Checking Submissions / Q&A Chat
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);
  const [aiCheckingId, setAiCheckingId] = useState(null);
  const [gradingInputs, setGradingInputs] = useState({}); // { [submissionId]: { marks, stars, feedback, saving } }
  const [commentInputs, setCommentInputs] = useState({}); // { [assignmentId]: text }

  // Campus Broadcast / Notice States
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("announcement");
  const [noticeTarget, setNoticeTarget] = useState("ALL");
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [sentNoticesHistory, setSentNoticesHistory] = useState([]);
  // Direct Student Alert Modal
  const [directAlertModal, setDirectAlertModal] = useState({
    isOpen: false,
    scholar: null,
    title: "",
    message: "",
  });

  const [updateLoading, setUpdateLoading] = useState(false);
  const cardRef = useRef(null);

  // Live 1-Second Clock for Assignment Countdown Timers
  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPersistedUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.StudentName || parsed?.name || parsed?.StudentEmail) return parsed;
      }
      if (user?.StudentName || user?.name) return user;
      const savedToken = token || localStorage.getItem("token");
      if (savedToken) {
        const base64Url = savedToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
      }
    } catch (err) {}
    return user || {};
  };

  const currentUser = getPersistedUser();

  const facultyName =
    currentUser?.StudentName ||
    currentUser?.name ||
    currentUser?.StudentEmail?.split("@")[0] ||
    "Faculty";
  const facultyEmail =
    currentUser?.StudentEmail || currentUser?.email || "faculty@edusphere.edu";
  const facultyPhone = currentUser?.Phone || currentUser?.phone || "";
  const facultyAvatar = currentUser?.ProfileImage || currentUser?.avatar || "";
  const facultyId =
    currentUser?._id || currentUser?.id || facultyEmail || "faculty_user";

  const [profileForm, setProfileForm] = useState({
    StudentName: facultyName,
    StudentEmail: facultyEmail,
    Phone: facultyPhone,
    ProfileImage: facultyAvatar,
    Password: "",
    ConfirmPassword: "",
  });

  useEffect(() => {
    setProfileForm({
      StudentName: facultyName,
      StudentEmail: facultyEmail,
      Phone: facultyPhone,
      ProfileImage: facultyAvatar,
      Password: "",
      ConfirmPassword: "",
    });
  }, [facultyName, facultyEmail, facultyPhone, facultyAvatar]);

  const fetchFacultyOverview = async () => {
    try {
      const activeToken = token || localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        studentId: facultyId,
        studentName: facultyName,
      });
      const res = await fetch(
        `${API_BASE}/faculty/overview?${queryParams.toString()}`,
        {
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        }
      );
      const data = await res.json();
      if (data && data.success) {
        if (data.metrics) setMetrics(data.metrics);
        if (Array.isArray(data.scholars)) setScholarsList(data.scholars);
        if (Array.isArray(data.submissions)) setSubmissionsList(data.submissions);
        if (Array.isArray(data.assignments)) setAssignmentsList(data.assignments);
        if (Array.isArray(data.leaderboard)) setLeaderboardData(data.leaderboard);
        if (Array.isArray(data.notifications)) setNotificationsData(data.notifications);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchFacultyOverview();
    const timer = setTimeout(() => setLoading(false), 600);
    const poll = setInterval(fetchFacultyOverview, 8000);
    return () => {
      clearTimeout(timer);
      clearInterval(poll);
    };
  }, [facultyId, facultyName]);

  const formatCountdownTimer = (dueDateStr) => {
    if (!dueDateStr) return { expired: true, label: "No Deadline" };
    const diff = new Date(dueDateStr).getTime() - nowTime;
    if (diff <= 0) {
      return { expired: true, label: "🔒 Deadline Expired (Submissions Locked)" };
    }
    const totalSecs = Math.floor(diff / 1000);
    const d = Math.floor(totalSecs / 86400);
    const h = Math.floor((totalSecs % 86400) / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const timeStr =
      d > 0
        ? `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(
            s
          ).padStart(2, "0")}s`
        : `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(
            s
          ).padStart(2, "0")}s`;
    return { expired: false, label: `⏳ Time Remaining: ${timeStr}` };
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
        body: JSON.stringify({ studentId: facultyId }),
      });
    } catch (e) {}
  };

  const handleClearNotifications = async () => {
    setNotificationsData([]);
    try {
      const activeToken = token || localStorage.getItem("token");
      await fetch(
        `${API_BASE}/notifications/clear?studentId=${encodeURIComponent(facultyId)}`,
        {
          method: "DELETE",
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        }
      );
    } catch (e) {}
  };

  // Toggle individual student checkbox for Specific Assignment Target
  const toggleStudentSelection = (stId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(stId) ? prev.filter((id) => id !== stId) : [...prev, stId]
    );
  };

  // Publish New Google Classroom Assignment
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    const finalSubject =
      asgnSubject === "CUSTOM" ? customSubject.trim() : asgnSubject;

    if (!finalSubject) {
      setStatusMsg({ type: "error", text: "Please enter a Subject name." });
      return;
    }
    if (!asgnTitle.trim()) {
      setStatusMsg({ type: "error", text: "Please enter an Assignment Title." });
      return;
    }
    if (!asgnDueDate) {
      setStatusMsg({
        type: "error",
        text: "Please select a Due Date & Time for the countdown timer.",
      });
      return;
    }
    if (asgnTargetType === "SPECIFIC" && selectedStudentIds.length === 0) {
      setStatusMsg({
        type: "error",
        text: "Please tick at least one registered student or switch to 'All Students'.",
      });
      return;
    }

    setAsgnCreating(true);
    try {
      const formData = new FormData();
      formData.append("facultyId", facultyId);
      formData.append("facultyName", facultyName);
      formData.append("title", asgnTitle.trim());
      formData.append("description", asgnDesc.trim());
      formData.append("subject", finalSubject);
      formData.append("totalMarks", asgnMarks);
      formData.append("dueDate", new Date(asgnDueDate).toISOString());
      formData.append("targetType", asgnTargetType);
      formData.append("assignedStudentIds", JSON.stringify(selectedStudentIds));
      if (asgnFile) {
        formData.append("file", asgnFile);
      }

      const activeToken = token || localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/classroom/assignments`, {
        method: "POST",
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.assignment) {
        setStatusMsg({ type: "success", text: data.message });
        setAssignmentsList((prev) => [data.assignment, ...prev]);
        setActiveAssignmentId(data.assignment._id);
        setAsgnTitle("");
        setAsgnDesc("");
        setCustomSubject("");
        setAsgnFile(null);
        setAsgnFilePreviewUrl("");
        setAsgnDueDate("");
        setSelectedStudentIds([]);
        await fetchFacultyOverview();
      } else {
        setStatusMsg({
          type: "error",
          text: data.message || "Unable to publish assignment.",
        });
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "Error publishing assignment." });
    } finally {
      setAsgnCreating(false);
    }
  };
  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const activeToken = token || localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/classroom/assignments/${assignmentId}`, {
        method: "DELETE",
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setAssignmentsList((prev) =>
          prev.filter((a) => String(a._id) !== String(assignmentId))
        );
        if (String(activeAssignmentId) === String(assignmentId)) {
          setActiveAssignmentId(null);
        }
        setStatusMsg({ type: "success", text: "🗑️ Assignment deleted." });
      }
    } catch (e) {}
  };

  // 🤖 1-Click AI Auto-Check Handler
  const handleRunAiAutoCheck = async (assignmentId, sub) => {
    setAiCheckingId(sub._id);
    try {
      const activeToken = token || localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/classroom/assignments/${assignmentId}/submissions/${sub._id}/ai-check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
          },
        }
      );
      const data = await res.json();
      if (data.success && data.aiEvaluation) {
        setGradingInputs((prev) => ({
          ...prev,
          [sub._id]: {
            marks: data.aiEvaluation.suggestedMarks,
            stars: data.aiEvaluation.suggestedStars,
            feedback: data.aiEvaluation.feedback,
          },
        }));
        if (data.assignment) {
          setAssignmentsList((prev) =>
            prev.map((a) =>
              String(a._id) === String(assignmentId) ? data.assignment : a
            )
          );
        }
        setStatusMsg({ type: "success", text: data.message });
      }
    } catch (e) {
      setStatusMsg({ type: "error", text: "AI Auto-Check failed." });
    } finally {
      setAiCheckingId(null);
    }
  };

  // Publish Final Marks & Star Rating to Student
  const handlePublishGrade = async (assignmentId, sub, maxMarks) => {
    const currentInput = gradingInputs[sub._id] || {
      marks: sub.obtainedMarks ?? sub.aiSuggestedMarks ?? Math.round(maxMarks * 0.8),
      stars: sub.stars || sub.aiSuggestedStars || 4,
      feedback: sub.feedback || sub.aiSuggestedFeedback || "",
    };

    try {
      const activeToken = token || localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/classroom/assignments/${assignmentId}/submissions/${sub._id}/grade`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
          },
          body: JSON.stringify({
            obtainedMarks: Number(currentInput.marks),
            stars: Number(currentInput.stars) || 4,
            feedback: currentInput.feedback || "",
            facultyName,
          }),
        }
      );
      const data = await res.json();
      if (data.success && data.assignment) {
        setAssignmentsList((prev) =>
          prev.map((a) =>
            String(a._id) === String(assignmentId) ? data.assignment : a
          )
        );
        setStatusMsg({ type: "success", text: data.message });
      }
    } catch (e) {
      setStatusMsg({ type: "error", text: "Unable to publish marks." });
    }
  };

  // Send Teacher Reply in Assignment Discussion Thread
  const handleSendAssignmentComment = async (e, assignmentId) => {
    e.preventDefault();
    const text = (commentInputs[assignmentId] || "").trim();
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
            senderId: facultyId,
            senderName: facultyName,
            senderRole: "faculty",
            studentThreadId: "PUBLIC",
            text,
          }),
        }
      );
      const data = await res.json();
      if (data.success && data.assignment) {
        setAssignmentsList((prev) =>
          prev.map((a) =>
            String(a._id) === String(assignmentId) ? data.assignment : a
          )
        );
        setCommentInputs((prev) => ({ ...prev, [assignmentId]: "" }));
      }
    } catch (e) {}
  };

  const handleBroadcastNoticeSubmit = async (e) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) return;

    setNoticeLoading(true);
    try {
      const activeToken = token || localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/faculty/broadcast-notice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId: facultyId,
          facultyName,
          targetStudentId: noticeTarget,
          noticeType,
          title: noticeTitle.trim(),
          message: noticeMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: "success", text: data.message });
        setSentNoticesHistory((prev) => [
          {
            id: Date.now(),
            title: noticeTitle.trim(),
            message: noticeMessage.trim(),
            target: noticeTarget,
            createdAt: new Date().toLocaleString(),
          },
          ...prev,
        ]);
        setNoticeTitle("");
        setNoticeMessage("");
        await fetchFacultyOverview();
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "Failed to broadcast announcement." });
    } finally {
      setNoticeLoading(false);
    }
  };

  const handleSendDirectScholarAlert = async (e) => {
    e.preventDefault();
    if (!directAlertModal.scholar || !directAlertModal.title.trim()) return;

    try {
      const activeToken = token || localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/faculty/broadcast-notice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId: facultyId,
          facultyName,
          targetStudentId: directAlertModal.scholar.studentId,
          noticeType: "faculty-direct",
          title: directAlertModal.title.trim(),
          message: directAlertModal.message.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({
          type: "success",
          text: `📩 Academic alert sent to ${directAlertModal.scholar.studentName}!`,
        });
        setDirectAlertModal({ isOpen: false, scholar: null, title: "", message: "" });
      }
    } catch (e) {}
  };

  const handleDownloadClassGradebookPdf = async () => {
    try {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      let y = 50;

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 82, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("EDUSPHERE AI — OFFICIAL FACULTY GRADEBOOK REPORT", margin, 36);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(165, 180, 252);
      doc.text(
        `Faculty: ${facultyName}  |  Date: ${new Date().toLocaleDateString()}  |  Class Avg: ${metrics.classAvgAccuracy}%`,
        margin,
        58
      );

      y = 110;
      const completedOnly = submissionsList.filter((s) => s.status === "Completed");
      completedOnly.forEach((sub, idx) => {
        if (y > 760) {
          doc.addPage();
          y = 50;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(30, 41, 59);
        doc.text(
          `${idx + 1}. ${sub.studentName} — ${sub.title.slice(0, 52)}`,
          margin,
          y
        );
        y += 15;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(71, 85, 105);
        doc.text(
          `Score: ${sub.score}/${sub.totalQuestions || 20} (${sub.percentage}%)  |  Grade: ${
            sub.grade
          }  |  Status: ${sub.passed ? "PASSED" : "FAILED"}  |  Date: ${new Date(
            sub.completedAt || sub.updatedAt
          ).toLocaleDateString()}`,
          margin + 12,
          y
        );
        y += 22;
      });

      doc.save(`EduSphere_Class_Gradebook_${facultyName.replace(/\s+/g, "_")}.pdf`);
    } catch (e) {}
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: "", text: "" });

    if (profileForm.Password && profileForm.Password !== profileForm.ConfirmPassword) {
      setStatusMsg({
        type: "error",
        text: "New passwords do not match. Please verify.",
      });
      return;
    }

    setUpdateLoading(true);
    try {
      const activeToken = token || localStorage.getItem("token");

      await fetch("http://localhost:3000/api/students/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          StudentName: profileForm.StudentName,
          StudentEmail: profileForm.StudentEmail,
          Phone: profileForm.Phone,
          ProfileImage: profileForm.ProfileImage,
          Password: profileForm.Password || undefined,
        }),
      }).catch(() => {});

      const res = await fetch(`${API_BASE}/faculty/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          studentId: facultyId,
          StudentName: profileForm.StudentName,
          StudentEmail: profileForm.StudentEmail,
          Phone: profileForm.Phone,
          ProfileImage: profileForm.ProfileImage,
        }),
      });

      const data = await res.json();
      const updatedUser = {
        ...currentUser,
        StudentName: profileForm.StudentName,
        StudentEmail: profileForm.StudentEmail,
        Phone: profileForm.Phone,
        ProfileImage: profileForm.ProfileImage,
        role: currentUser?.role || "faculty",
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (login && activeToken) login(activeToken, updatedUser);

      setStatusMsg({
        type: "success",
        text: data?.message || "Account profile updated successfully!",
      });
      setProfileForm((prev) => ({ ...prev, Password: "", ConfirmPassword: "" }));
    } catch (error) {
      setStatusMsg({
        type: "error",
        text: "Unable to update profile. Please try again.",
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
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  const unreadNotifCount = notificationsData.filter((n) => !n.isRead).length;
  const isAnyPopupOpen =
    showLeaderboardModal || showNotifModal || directAlertModal.isOpen;

  const filteredLeaderboard = leaderboardData.filter((entry) =>
    String(entry.studentName || "")
      .toLowerCase()
      .includes(leaderSearch.trim().toLowerCase())
  );

  const filteredScholars = scholarsList.filter((s) => {
    const q = scholarSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      String(s.studentName || "").toLowerCase().includes(q) ||
      String(s.phone || "").toLowerCase().includes(q) ||
      String(s.studentEmail || "").toLowerCase().includes(q) ||
      String(s.tier || "").toLowerCase().includes(q)
    );
  });

  const filteredSubmissions = submissionsList.filter((sub) => {
    if (gradebookFilter === "passed")
      return sub.status === "Completed" && (sub.passed || sub.percentage >= 60);
    if (gradebookFilter === "failed")
      return sub.status === "Completed" && !sub.passed && sub.percentage < 60;
    if (gradebookFilter === "pending") return sub.status === "Pending";
    return true;
  });

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="pro-loader-3d">
          <div className="pro-cube-ring"></div>
          <div className="pro-cube-ring ring-two"></div>
          <div className="pro-cube-core"></div>
        </div>
        <div className="loader-status-title">Initializing Faculty Portal</div>
        <div className="loader-status-sub">
          Loading Sindh Board Classroom Studio, AI Grader & Student Roster...
        </div>
      </div>
    );
  }

  return (
    <div className="vip-dashboard-wrapper">
      {/* ====================================================================
          1. REGISTERED STUDENT LEADERBOARD MODAL (EXACT STUDENT DASHBOARD STYLE)
         ==================================================================== */}
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
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                    Registered Students Leaderboard ({leaderboardData.length})
                  </h2>
                  <p style={{ margin: "3px 0 0 0", fontSize: "13px", color: "#94a3b8" }}>
                    Live rankings of registered students based on Total XP, Assignments, and Exam Accuracy
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLeaderboardModal(false)}
                className="modal-close-icon-btn"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div className="pro-search-wrapper">
                <svg
                  className="pro-search-icon"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="pro-search-input"
                  placeholder="Search registered student by name..."
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
                    <div key={scholar.studentId || idx} className={`podium-card rank-${rankNum}`}>
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
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          String(scholar.studentName || "S").charAt(0).toUpperCase()
                        )}
                      </div>

                      <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", color: "#fff" }}>
                        {scholar.studentName}
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
              {filteredLeaderboard.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
                  No registered student found.
                </div>
              ) : (
                filteredLeaderboard.map((item) => (
                  <div key={item.studentId} className="leaderboard-row">
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
                          {item.phone ? `📞 ${item.phone} • ` : ""}Level {item.level || 1} •{" "}
                          {item.quizzesPassed || 0} Exams Passed • {item.avgAccuracy || 0}% Accuracy
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
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          2. FACULTY NOTIFICATION CENTER MODAL (EXACT STUDENT DASHBOARD SVG)
         ==================================================================== */}
      {showNotifModal && (
        <div className="pro-popup-overlay" onClick={() => setShowNotifModal(false)}>
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
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(99, 102, 241, 0.14)",
                    border: "1px solid rgba(99, 102, 241, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#818cf8",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 700 }}>
                    Notification Center
                  </h2>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#94a3b8" }}>
                    Real-time alerts for Classroom Submissions, #1 Ranks, and Student Questions
                  </p>
                </div>
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
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
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

      {/* ====================================================================
          3. DIRECT STUDENT ACADEMIC ALERT MODAL
         ==================================================================== */}
      {directAlertModal.isOpen && (
        <div
          className="pro-popup-overlay"
          onClick={() =>
            setDirectAlertModal({ isOpen: false, scholar: null, title: "", message: "" })
          }
        >
          <div
            className="pro-popup-modal"
            style={{ maxWidth: "480px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", color: "#fff" }}>
              📩 Send Direct Academic Alert to {directAlertModal.scholar?.studentName}
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "12.5px", color: "#94a3b8" }}>
              This message will appear directly in {directAlertModal.scholar?.studentName}'s Notification Bell.
            </p>
            <form
              onSubmit={handleSendDirectScholarAlert}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input
                type="text"
                className="pro-input"
                placeholder="Alert Title"
                value={directAlertModal.title}
                onChange={(e) =>
                  setDirectAlertModal((p) => ({ ...p, title: e.target.value }))
                }
                required
              />
              <textarea
                className="pro-input"
                style={{ minHeight: "95px", padding: "12px" }}
                placeholder="Write your feedback or message for the student..."
                value={directAlertModal.message}
                onChange={(e) =>
                  setDirectAlertModal((p) => ({ ...p, message: e.target.value }))
                }
                required
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() =>
                    setDirectAlertModal({
                      isOpen: false,
                      scholar: null,
                      title: "",
                      message: "",
                    })
                  }
                  className="pro-btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button type="submit" className="pro-btn-primary" style={{ flex: 1 }}>
                  Send Alert →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN FACULTY DASHBOARD LAYOUT */}
      <div className={`vip-dashboard-layout ${isAnyPopupOpen ? "modal-blur-active" : ""}`}>
        {/* LEFT SIDEBAR */}
        <aside className="vip-sidebar">
          <div>
            <div className="sidebar-brand">
              <div className="brand-icon-glow">E</div>
              <h2>
                EDU<span>SPHERE</span>
              </h2>
            </div>

            <div className="sidebar-section-label">Faculty Workspace</div>
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
                    background: "linear-gradient(135deg, #6366f1, #ec4899)",
                    color: "#fff",
                  }}
                >
                  {assignmentsList.length}
                </span>
              </button>

              <button
                className={`menu-item ${activeTab === "scholars" ? "active" : ""}`}
                onClick={() => setActiveTab("scholars")}
              >
                <span className="menu-item-left">
                  <span>👨‍🎓</span>
                  <span>Enrolled Students</span>
                </span>
                <span className="sidebar-badge">{metrics.totalScholars || 0}</span>
              </button>

              <button
                className={`menu-item ${activeTab === "gradebook" ? "active" : ""}`}
                onClick={() => setActiveTab("gradebook")}
              >
                <span className="menu-item-left">
                  <span>🏆</span>
                  <span>Class Gradebook</span>
                </span>
                <span
                  className="sidebar-badge"
                  style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399" }}
                >
                  {metrics.totalExamsConducted || 0}
                </span>
              </button>

              <button
                className={`menu-item ${activeTab === "announcements" ? "active" : ""}`}
                onClick={() => setActiveTab("announcements")}
              >
                <span className="menu-item-left">
                  <span>📢</span>
                  <span>Campus Broadcasts</span>
                </span>
              </button>

              <button
                className={`menu-item ${activeTab === "scholar-chat" ? "active" : ""}`}
                onClick={() => setActiveTab("scholar-chat")}
              >
                <span className="menu-item-left">
                  <span>💬</span>
                  <span>Scholar Connect & Chat</span>
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

        {/* MAIN WORKSPACE CONTENT */}
        <main className="vip-main-content">
          {/* TOPBAR WITH EXACT STUDENT DASHBOARD SVG BELL ICON */}
          <header className="vip-topbar">
            <div className="topbar-welcome">
              <div className="live-status-badge">
                <span className="pulse-beacon"></span>
                WORKSPACE ACTIVE
              </div>
              <h1>
                Welcome back, <span className="highlight-text">{facultyName}</span>
              </h1>
            </div>

            <div className="topbar-actions">
              <button
                type="button"
                className="exec-header-btn"
                onClick={() => setShowLeaderboardModal(true)}
                title="Open Registered Students Leaderboard"
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
                    color: "#34d399",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {metrics.totalScholars} Students
                </span>
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
                  {facultyAvatar ? (
                    <img src={facultyAvatar} alt={facultyName} />
                  ) : (
                    facultyName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="mini-info">
                  <span className="mini-name">{facultyName}</span>
                  <span className="mini-role" style={{ color: "#34d399" }}>
                    Faculty
                  </span>
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

          {/* ================================================================
              TAB 1: EXECUTIVE OVERVIEW (CLEAN HERO CARD + REAL STUDENT ANALYTICS)
             ================================================================ */}
          {activeTab === "overview" && (
            <>
              <div
                className="vip-hero-3d-card"
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="hero-card-body">
                  <div className="avatar-main">
                    {facultyAvatar ? (
                      <img src={facultyAvatar} alt={facultyName} />
                    ) : (
                      facultyName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: "240px" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        marginBottom: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        className="vip-pill-badge"
                        style={{
                          background: "rgba(16, 185, 129, 0.16)",
                          color: "#34d399",
                          borderColor: "rgba(16, 185, 129, 0.35)",
                        }}
                      >
                        🎓 Faculty Account
                      </span>
                      <span className="vip-pill-badge">
                        {metrics.totalScholars} Enrolled Students
                      </span>
                    </div>

                    <h2 style={{ margin: "0 0 4px 0", fontSize: "24px", color: "#ffffff" }}>
                      {facultyName}
                    </h2>

                    <p style={{ margin: 0, color: "#94a3b8", fontSize: "13.5px" }}>
                      {facultyEmail} {facultyPhone ? ` • 📞 ${facultyPhone}` : ""}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      className="pro-btn-primary"
                      onClick={() => setActiveTab("classroom")}
                    >
                      📚 + Create Classroom Assignment
                    </button>
                    <button
                      className="pro-btn-secondary"
                      onClick={() => setActiveTab("scholar-chat")}
                    >
                      💬 Scholar Connect & Chat
                    </button>
                    <button
                      className="pro-btn-secondary"
                      onClick={() => setActiveTab("announcements")}
                    >
                      📢 Broadcast Notice
                    </button>
                  </div>
                </div>
              </div>

              {/* METRICS ROW */}
              <div className="vip-metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">👨‍🎓</div>
                  <div className="metric-details">
                    <span className="metric-label">Registered Students</span>
                    <span className="metric-value">
                      {metrics.totalScholars} Enrolled
                    </span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon amber">📚</div>
                  <div className="metric-details">
                    <span className="metric-label">Classroom Assignments</span>
                    <span className="metric-value">
                      {assignmentsList.length} Active Tasks
                    </span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon emerald">🏆</div>
                  <div className="metric-details">
                    <span className="metric-label">Class Average Accuracy</span>
                    <span className="metric-value">
                      {metrics.classAvgAccuracy}% ({metrics.passRatePercent}% Pass Rate)
                    </span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">🌐</div>
                  <div className="metric-details">
                    <span className="metric-label">Study Communities</span>
                    <span className="metric-value">
                      {metrics.activeCommunities} Active Groups
                    </span>
                  </div>
                </div>
              </div>

              {/* REGISTERED STUDENTS & RECENT CLASSROOM ASSIGNMENTS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                  gap: "20px",
                }}
              >
                <div className="edit-profile-container">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "14px",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: "17px" }}>
                      👨‍🎓 Registered Students ({scholarsList.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("scholars")}
                      className="pro-btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                    >
                      View All →
                    </button>
                  </div>

                  {scholarsList.length === 0 ? (
                    <div
                      style={{
                        padding: "24px",
                        textAlign: "center",
                        color: "#94a3b8",
                        fontSize: "13px",
                      }}
                    >
                      No registered students found in the database yet.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {scholarsList.slice(0, 6).map((sc) => (
                        <div
                          key={sc.studentId}
                          className="cyber-item-card"
                          style={{ padding: "12px 16px" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div
                              className="scholar-avatar-wrap"
                              style={{ width: "38px", height: "38px", fontSize: "14px" }}
                            >
                              {sc.avatar ? (
                                <img src={sc.avatar} alt={sc.studentName} />
                              ) : (
                                String(sc.studentName || "S").charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "14px", color: "#fff" }}>
                                {sc.studentName}
                              </div>
                              <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                                {sc.phone ? `📞 ${sc.phone}` : sc.studentEmail || "Student"} •{" "}
                                {sc.avgAccuracy || 0}% Accuracy
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {renderTierBadge(sc.tier)}
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "13px",
                                fontWeight: 800,
                                color: "#34d399",
                              }}
                            >
                              {sc.totalXp} XP
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="edit-profile-container">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "14px",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: "17px" }}>
                      📚 Recent Classroom Assignments ({assignmentsList.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("classroom")}
                      className="pro-btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                    >
                      Open Studio →
                    </button>
                  </div>

                  {assignmentsList.length === 0 ? (
                    <div
                      style={{
                        padding: "24px",
                        textAlign: "center",
                        color: "#94a3b8",
                        fontSize: "13px",
                      }}
                    >
                      No assignments published yet. Click "Open Studio" to create a Sindh Board Assignment!
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {assignmentsList.slice(0, 5).map((asgn) => {
                        const timerObj = formatCountdownTimer(asgn.dueDate);
                        const firstSub = (asgn.submissions || []).find(
                          (s) => s.submissionRank === 1
                        );
                        return (
                          <div
                            key={asgn._id}
                            className="cyber-item-card"
                            style={{ padding: "12px 16px", cursor: "pointer" }}
                            onClick={() => {
                              setActiveAssignmentId(asgn._id);
                              setActiveTab("classroom");
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "6px",
                                  alignItems: "center",
                                  marginBottom: "4px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <span className="vip-pill-badge">{asgn.subject}</span>
                                <span
                                  className="vip-pill-badge"
                                  style={{
                                    background: "rgba(16, 185, 129, 0.16)",
                                    color: "#34d399",
                                  }}
                                >
                                  {asgn.totalMarks} Marks
                                </span>
                                {firstSub && (
                                  <span
                                    className="vip-pill-badge"
                                    style={{
                                      background: "rgba(245, 158, 11, 0.2)",
                                      color: "#fbbf24",
                                    }}
                                  >
                                    🥇 #1: {firstSub.studentName}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontWeight: 700, fontSize: "14px", color: "#fff" }}>
                                {asgn.title}
                              </div>
                              <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                                {timerObj.label}
                              </div>
                            </div>

                            <span className="vip-pill-badge">
                              {(asgn.submissions || []).length} Submitted
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ================================================================
              TAB 2: GOOGLE CLASSROOM ASSIGNMENT STUDIO & AI AUTO-GRADING
             ================================================================ */}
         {activeTab === "classroom" && (
            <div className="gc-workspace-grid">
              {/* LEFT COLUMN: 3D ASSIGNMENT COMPOSER */}
              <form onSubmit={handleCreateAssignment} className="gc-3d-panel">
                <div style={{ marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "17px", fontWeight: 700, color: "#fff" }}>
                    New Classwork Assignment
                  </h3>
                  <p style={{ margin: 0, fontSize: "12.5px", color: "#94a3b8" }}>
                    Configure subject, grading scale, deadline, and reference media.
                  </p>
                </div>

                {/* SUBJECT: 5 DROPDOWN OPTIONS + CUSTOM TYPING */}
                <div className="pro-form-group">
                  <label>Subject</label>
                  <select
                    className="pro-select"
                    value={asgnSubject}
                    onChange={(e) => setAsgnSubject(e.target.value)}
                  >
                    {CORE_SUBJECTS.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                    <option value="CUSTOM">+ Write Custom Subject...</option>
                  </select>
                </div>

                {asgnSubject === "CUSTOM" && (
                  <div className="pro-form-group">
                    <label>Enter Custom Subject Name</label>
                    <input
                      type="text"
                      className="pro-input"
                      placeholder="Type subject name..."
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* SEGMENTED MARKS SELECTOR: 20 | 50 | 100 */}
                <div className="pro-form-group">
                  <label>Grading Scale (Total Points)</label>
                  <div className="gc-segmented-box">
                    {[20, 50, 100].map((pts) => (
                      <button
                        key={pts}
                        type="button"
                        onClick={() => setAsgnMarks(pts)}
                        className={`gc-segment-btn ${asgnMarks === pts ? "active" : ""}`}
                      >
                        {pts} Points
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pro-form-group">
                  <label>Assignment Title</label>
                  <input
                    type="text"
                    className="pro-input"
                    placeholder="e.g. Lab 04: Data Structures & Algorithms"
                    value={asgnTitle}
                    onChange={(e) => setAsgnTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="pro-form-group">
                  <label>Instructions (Optional)</label>
                  <textarea
                    className="pro-input"
                    style={{ minHeight: "82px", resize: "vertical" }}
                    placeholder="Provide clear instructions for students..."
                    value={asgnDesc}
                    onChange={(e) => setAsgnDesc(e.target.value)}
                  />
                </div>

                <div className="pro-form-group">
                  <label>Submission Deadline</label>
                  <input
                    type="datetime-local"
                    className="pro-input"
                    value={asgnDueDate}
                    onChange={(e) => setAsgnDueDate(e.target.value)}
                    required
                  />
                </div>

                {/* REFERENCE MEDIA UPLOAD + INSTANT PREVIEW BEFORE ASSIGNING */}
                <div className="pro-form-group">
                  <label>Reference Attachment (Video, Image, or PDF)</label>
                  {!asgnFile ? (
                    <label className="gc-upload-trigger">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>Attach Video, Image, or PDF</span>
                      <input
                        type="file"
                        accept="video/*,image/*,.pdf"
                        style={{ display: "none" }}
                        onChange={(e) => setAsgnFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  ) : (
                    <div className="gc-media-preview-card">
                      <div className="gc-media-preview-header">
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "240px" }}>
                          {asgnFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAsgnFile(null)}
                          className="gc-media-remove-btn"
                          title="Remove attachment"
                        >
                          ✕
                        </button>
                      </div>
                      {asgnFile.type.startsWith("video/") && asgnFilePreviewUrl && (
                        <video src={asgnFilePreviewUrl} controls className="gc-preview-video" />
                      )}
                      {asgnFile.type.startsWith("image/") && asgnFilePreviewUrl && (
                        <img src={asgnFilePreviewUrl} alt="Preview" className="gc-preview-img" />
                      )}
                      {asgnFile.type === "application/pdf" && asgnFilePreviewUrl && (
                        <iframe src={asgnFilePreviewUrl} title="PDF Preview" className="gc-preview-pdf" />
                      )}
                    </div>
                  )}
                </div>

                {/* TARGET RECIPIENTS */}
                <div className="pro-form-group">
                  <label>Assign To</label>
                  <div className="gc-segmented-box" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setAsgnTargetType("ALL")}
                      className={`gc-segment-btn ${asgnTargetType === "ALL" ? "active" : ""}`}
                    >
                      All Students ({scholarsList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAsgnTargetType("SPECIFIC")}
                      className={`gc-segment-btn ${asgnTargetType === "SPECIFIC" ? "active" : ""}`}
                    >
                      Specific ({selectedStudentIds.length})
                    </button>
                  </div>

                  {asgnTargetType === "SPECIFIC" && (
                    <div className="student-tick-grid">
                      {scholarsList.map((sc) => {
                        const isChecked = selectedStudentIds.includes(sc.studentId);
                        return (
                          <div
                            key={sc.studentId}
                            onClick={() => toggleStudentSelection(sc.studentId)}
                            className={`student-tick-card ${isChecked ? "checked" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              style={{ accentColor: "#6366f1" }}
                            />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {sc.studentName}
                              </div>
                              <div style={{ fontSize: "11px", color: "#64748b" }}>
                                {sc.phone || sc.studentEmail}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={asgnCreating}
                  className="pro-btn-primary"
                  style={{ width: "100%", marginTop: "6px" }}
                >
                  {asgnCreating ? "Assigning..." : "Assign Classwork"}
                </button>
              </form>

              {/* RIGHT COLUMN: ACTIVE ASSIGNMENTS & SUBMISSIONS STREAM */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="gc-3d-panel" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "17px", color: "#fff" }}>
                      Assigned Classwork Stream
                    </h3>
                    <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#94a3b8" }}>
                      Monitor live deadlines, inspect student attachments, and publish grades.
                    </p>
                  </div>
                  <span className="vip-pill-badge">{assignmentsList.length} Total</span>
                </div>

                {assignmentsList.length === 0 ? (
                  <div className="gc-3d-panel" style={{ textAlign: "center", padding: "48px 24px", color: "#94a3b8" }}>
                    No assignments posted yet. Use the panel on the left to assign classwork.
                  </div>
                ) : (
                  assignmentsList.map((asgn) => {
                    const timerObj = formatCountdownTimer(asgn.dueDate);
                    const isExpanded = String(activeAssignmentId) === String(asgn._id);
                    const sortedSubs = [...(asgn.submissions || [])].sort(
                      (a, b) => (a.submissionRank || 999) - (b.submissionRank || 999)
                    );

                    return (
                      <div key={asgn._id} className="gc-3d-panel">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", flexWrap: "wrap" }}>
                          <div style={{ flex: 1, minWidth: "240px" }}>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "8px" }}>
                              <span className="vip-pill-badge">{asgn.subject}</span>
                              <span className="gc-rank-pill">{asgn.totalMarks} Points</span>
                              <span className={`gc-timer-pill ${timerObj.expired ? "expired" : ""}`}>
                                {timerObj.expired ? "Closed" : timerObj.label.replace("⏳ Time Remaining: ", "")}
                              </span>
                            </div>

                            <h4 style={{ margin: "0 0 6px 0", fontSize: "17.5px", color: "#fff" }}>
                              {asgn.title}
                            </h4>

                            {asgn.description && (
                              <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#94a3b8", lineHeight: 1.55 }}>
                                {asgn.description}
                              </p>
                            )}

                            {/* TEACHER REFERENCE MEDIA PREVIEW */}
                            {asgn.referenceFileUrl && (
                              <div className="gc-media-preview-card" style={{ maxWidth: "380px", marginTop: "10px" }}>
                                <div className="gc-media-preview-header">
                                  <span>Reference: {asgn.referenceFileName}</span>
                                  <a
                                    href={asgn.referenceFileUrl}
                                    download={asgn.referenceFileName || "Reference"}
                                    style={{ color: "#818cf8", textDecoration: "none", fontSize: "11px" }}
                                  >
                                    Download
                                  </a>
                                </div>
                                {asgn.referenceFileType === "video" && (
                                  <video src={asgn.referenceFileUrl} controls className="gc-preview-video" />
                                )}
                                {asgn.referenceFileType === "image" && (
                                  <img src={asgn.referenceFileUrl} alt={asgn.referenceFileName} className="gc-preview-img" />
                                )}
                                {asgn.referenceFileType === "pdf" && (
                                  <iframe src={asgn.referenceFileUrl} title="Reference PDF" className="gc-preview-pdf" />
                                )}
                              </div>
                            )}
                          </div>

                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <button
                              type="button"
                              onClick={() => setActiveAssignmentId(isExpanded ? null : asgn._id)}
                              className="pro-btn-secondary"
                            >
                              {isExpanded
                                ? "Hide Submissions"
                                : `Submissions (${sortedSubs.length})`}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAssignment(asgn._id)}
                              className="pro-btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{ marginTop: "20px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: "14px" }}>
                            {sortedSubs.length === 0 ? (
                              <div style={{ padding: "18px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
                                No student submissions received yet.
                              </div>
                            ) : (
                              sortedSubs.map((sub) => {
                                const isFirst = sub.submissionRank === 1;
                                const gState = gradingInputs[sub._id] || {
                                  marks: sub.obtainedMarks ?? sub.aiSuggestedMarks ?? "",
                                  stars: sub.stars || sub.aiSuggestedStars || 5,
                                  feedback: sub.feedback || sub.aiSuggestedFeedback || "",
                                };

                                return (
                                  <div
                                    key={sub._id}
                                    style={{
                                      padding: "16px",
                                      borderRadius: "12px",
                                      background: "#0d111a",
                                      border: isFirst
                                        ? "1px solid rgba(245, 158, 11, 0.45)"
                                        : "1px solid rgba(255,255,255,0.07)",
                                    }}
                                  >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span className={`gc-rank-pill ${isFirst ? "rank-1" : ""}`}>
                                          {isFirst ? "#1 First Submitted" : `Order #${sub.submissionRank}`}
                                        </span>
                                        <strong style={{ color: "#fff", fontSize: "14.5px" }}>
                                          {sub.studentName}
                                        </strong>
                                        <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                                          {new Date(sub.submittedAt).toLocaleString()}
                                        </span>
                                      </div>

                                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                        {sub.status === "Graded" && (
                                          <span className="gc-timer-pill">
                                            Graded: {sub.obtainedMarks}/{asgn.totalMarks} ({sub.percentage}%)
                                          </span>
                                        )}
                                        <button
                                          type="button"
                                          disabled={aiCheckingId === sub._id}
                                          onClick={() => handleRunAiAutoCheck(asgn._id, sub)}
                                          className="pro-btn-secondary"
                                          style={{ padding: "6px 12px", fontSize: "12px" }}
                                        >
                                          {aiCheckingId === sub._id ? "Analyzing..." : "Auto-Evaluate"}
                                        </button>
                                      </div>
                                    </div>

                                    {sub.answerText && (
                                      <div style={{ padding: "10px 12px", background: "#080b11", borderRadius: "8px", fontSize: "13px", color: "#cbd5e1", marginBottom: "10px", whiteSpace: "pre-wrap" }}>
                                        {sub.answerText}
                                      </div>
                                    )}

                                    {/* STUDENT SUBMITTED VIDEO / IMAGE / PDF PREVIEW */}
                                    {sub.fileUrl && (
                                      <div className="gc-media-preview-card" style={{ maxWidth: "420px", marginBottom: "12px" }}>
                                        <div className="gc-media-preview-header">
                                          <span>{sub.fileName || "Submitted File"}</span>
                                          <a
                                            href={sub.fileUrl}
                                            download={sub.fileName || "Submission"}
                                            style={{ color: "#818cf8", textDecoration: "none", fontSize: "11px" }}
                                          >
                                            Download
                                          </a>
                                        </div>
                                        {sub.fileType === "video" && (
                                          <video src={sub.fileUrl} controls className="gc-preview-video" />
                                        )}
                                        {sub.fileType === "image" && (
                                          <img src={sub.fileUrl} alt={sub.fileName} className="gc-preview-img" />
                                        )}
                                        {sub.fileType === "pdf" && (
                                          <iframe src={sub.fileUrl} title="Student PDF" className="gc-preview-pdf" />
                                        )}
                                      </div>
                                    )}

                                    <div style={{ display: "grid", gridTemplateColumns: "110px 135px 1fr auto", gap: "10px", alignItems: "end" }}>
                                      <div>
                                        <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                                          Score (/{asgn.totalMarks})
                                        </label>
                                        <input
                                          type="number"
                                          min="0"
                                          max={asgn.totalMarks}
                                          className="pro-input"
                                          style={{ padding: "8px 10px" }}
                                          value={gState.marks}
                                          onChange={(e) =>
                                            setGradingInputs((prev) => ({
                                              ...prev,
                                              [sub._id]: { ...gState, marks: e.target.value },
                                            }))
                                          }
                                        />
                                      </div>

                                      <div>
                                        <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                                          Rating
                                        </label>
                                        <div style={{ display: "flex", gap: "4px", padding: "6px 8px", background: "#080b11", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)" }}>
                                          {[1, 2, 3, 4, 5].map((stNum) => (
                                            <button
                                              key={stNum}
                                              type="button"
                                              onClick={() =>
                                                setGradingInputs((prev) => ({
                                                  ...prev,
                                                  [sub._id]: { ...gState, stars: stNum },
                                                }))
                                              }
                                              style={{
                                                background: "transparent",
                                                border: "none",
                                                fontSize: "15px",
                                                cursor: "pointer",
                                                padding: 0,
                                                color: stNum <= (gState.stars || 5) ? "#fbbf24" : "#334155",
                                              }}
                                            >
                                              ★
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <div>
                                        <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                                          Feedback
                                        </label>
                                        <input
                                          type="text"
                                          className="pro-input"
                                          style={{ padding: "8px 12px" }}
                                          placeholder="Add evaluation remarks..."
                                          value={gState.feedback}
                                          onChange={(e) =>
                                            setGradingInputs((prev) => ({
                                              ...prev,
                                              [sub._id]: { ...gState, feedback: e.target.value },
                                            }))
                                          }
                                        />
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => handlePublishGrade(asgn._id, sub, asgn.totalMarks)}
                                        className="pro-btn-primary"
                                        style={{ padding: "9px 16px" }}
                                      >
                                        Return Grade
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}

                            {/* CLASS COMMENTS */}
                            <form
                              onSubmit={(e) => handleSendAssignmentComment(e, asgn._id)}
                              style={{ display: "flex", gap: "8px", marginTop: "6px" }}
                            >
                              <input
                                type="text"
                                className="pro-input"
                                style={{ padding: "8px 12px", fontSize: "12.5px" }}
                                placeholder="Post a class comment or reply..."
                                value={commentInputs[asgn._id] || ""}
                                onChange={(e) =>
                                  setCommentInputs((prev) => ({
                                    ...prev,
                                    [asgn._id]: e.target.value,
                                  }))
                                }
                              />
                              <button type="submit" className="pro-btn-secondary" style={{ padding: "8px 14px" }}>
                                Post
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 3: ENROLLED STUDENTS ROSTER (REAL REGISTERED STUDENTS ONLY)
             ================================================================ */}
          {activeTab === "scholars" && (
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
                  <h2>👨‍🎓 Enrolled Registered Students ({filteredScholars.length})</h2>
                  <p>
                    Only real registered student accounts from your database are listed here. Search by Name, Phone Number, Email, or Tier.
                  </p>
                </div>

                <input
                  type="text"
                  className="pro-input"
                  style={{ maxWidth: "300px" }}
                  placeholder="Search by Name, Phone, or Email..."
                  value={scholarSearch}
                  onChange={(e) => setScholarSearch(e.target.value)}
                />
              </div>

              {filteredScholars.length === 0 ? (
                <div
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    background: "#161b26",
                    borderRadius: "12px",
                    color: "#94a3b8",
                  }}
                >
                  No registered student found matching your search.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {filteredScholars.map((sc) => (
                    <div
                      key={sc.studentId}
                      className="cyber-item-card"
                      style={{ flexWrap: "wrap" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          flex: 1,
                          minWidth: "240px",
                        }}
                      >
                        <div className="scholar-avatar-wrap">
                          {sc.avatar ? (
                            <img src={sc.avatar} alt={sc.studentName} />
                          ) : (
                            String(sc.studentName || "S").charAt(0).toUpperCase()
                          )}
                          <span className="scholar-online-dot" />
                        </div>

                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "4px",
                              flexWrap: "wrap",
                            }}
                          >
                            <h4 style={{ margin: 0, fontSize: "16px", color: "#fff" }}>
                              {sc.studentName}
                            </h4>
                            {renderTierBadge(sc.tier)}
                            <span className="vip-pill-badge">Level {sc.level || 1}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: "12.5px", color: "#94a3b8" }}>
                            {sc.phone ? `📞 ${sc.phone}` : "No Phone"} •{" "}
                            {sc.studentEmail || "Registered Student"} •{" "}
                            <strong style={{ color: "#34d399" }}>{sc.totalXp} XP</strong> •{" "}
                            Avg Accuracy: <strong>{sc.avgAccuracy || 0}%</strong>
                          </p>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setAsgnTargetType("SPECIFIC");
                            setSelectedStudentIds([sc.studentId]);
                            setActiveTab("classroom");
                          }}
                          className="pro-btn-secondary"
                        >
                          📚 Send Assignment
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDirectAlertModal({
                              isOpen: true,
                              scholar: sc,
                              title: `Message from ${facultyName}`,
                              message: "",
                            })
                          }
                          className="pro-btn-secondary"
                        >
                          📩 Send Alert
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab("scholar-chat")}
                          className="pro-btn-primary"
                        >
                          💬 Open Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              TAB 4: MASTER CLASS GRADEBOOK & SUBMISSIONS INSPECTOR
             ================================================================ */}
          {activeTab === "gradebook" && (
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
                  <h2>🏆 Master Class Gradebook & Exam Submissions</h2>
                  <p>
                    Inspect every registered student's completed or pending Quizzes and AI Oral Tests. Export official PDF gradebook reports.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["all", "passed", "failed", "pending"].map((fMode) => (
                    <button
                      key={fMode}
                      type="button"
                      onClick={() => setGradebookFilter(fMode)}
                      className={
                        gradebookFilter === fMode
                          ? "pro-btn-primary"
                          : "pro-btn-secondary"
                      }
                      style={{
                        padding: "7px 14px",
                        fontSize: "12px",
                        textTransform: "capitalize",
                      }}
                    >
                      {fMode}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handleDownloadClassGradebookPdf}
                    className="pro-btn-primary"
                    style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                  >
                    📥 Export Gradebook PDF
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredSubmissions.length === 0 ? (
                  <div
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      background: "#161b26",
                      borderRadius: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    No student submissions match this filter.
                  </div>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const isCompleted = sub.status === "Completed";
                    const isPassed = sub.passed || (sub.percentage || 0) >= 60;
                    const isOral =
                      sub.examType === "oral" ||
                      Boolean(sub.title?.toLowerCase().includes("oral"));

                    return (
                      <div
                        key={sub._id}
                        className="cyber-item-card"
                        style={{ flexWrap: "wrap" }}
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
                                background: "rgba(99, 102, 241, 0.2)",
                                color: "#a5b4fc",
                              }}
                            >
                              👤 {sub.studentName}
                            </span>
                            <span className="vip-pill-badge">
                              {isOral ? "🎙️ Oral Viva (10 Qs)" : "📝 MCQ Exam (20 Qs)"}
                            </span>
                            {isCompleted ? (
                              <span
                                className="vip-pill-badge"
                                style={{
                                  background: isPassed
                                    ? "rgba(16, 185, 129, 0.2)"
                                    : "rgba(239, 68, 68, 0.2)",
                                  color: isPassed ? "#34d399" : "#f87171",
                                }}
                              >
                                {isPassed
                                  ? `🏆 PASSED (${sub.percentage}% • Grade ${sub.grade})`
                                  : `⚠️ FAILED (${sub.percentage}% • Grade ${sub.grade})`}
                              </span>
                            ) : (
                              <span
                                className="vip-pill-badge"
                                style={{
                                  background: "rgba(245, 158, 11, 0.18)",
                                  color: "#fbbf24",
                                }}
                              >
                                ⏳ PENDING ATTEMPT
                              </span>
                            )}
                          </div>

                          <h4 style={{ margin: "0 0 4px 0", fontSize: "15.5px" }}>
                            {sub.title}
                          </h4>
                          <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                            Score: {sub.score || 0} / {sub.totalQuestions || (isOral ? 10 : 20)}{" "}
                            • Date:{" "}
                            {new Date(
                              sub.completedAt || sub.createdAt || Date.now()
                            ).toLocaleString()}
                          </p>
                        </div>

                        {isCompleted && (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedSubmission(
                                selectedSubmission?._id === sub._id ? null : sub
                              )
                            }
                            className="pro-btn-secondary"
                          >
                            {selectedSubmission?._id === sub._id
                              ? "Hide Answer Sheet"
                              : "🔍 Inspect Answer Sheet"}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {selectedSubmission && (
                <div
                  style={{
                    marginTop: "24px",
                    padding: "22px",
                    borderRadius: "14px",
                    background: "#121622",
                    border: "1px solid rgba(99, 102, 241, 0.4)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: "18px" }}>
                      📋 Answer Sheet: {selectedSubmission.studentName} —{" "}
                      {selectedSubmission.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedSubmission(null)}
                      className="pro-btn-danger"
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                    >
                      Close
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(selectedSubmission.questions || []).map((q, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "10px",
                          background: "#161b26",
                          border: `1px solid ${
                            q.isCorrect
                              ? "rgba(16, 185, 129, 0.35)"
                              : "rgba(239, 68, 68, 0.35)"
                          }`,
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "6px" }}>
                          Q{idx + 1}. {q.questionText}
                        </div>
                        <div style={{ fontSize: "12.5px", color: "#cbd5e1" }}>
                          Student Answer:{" "}
                          <strong style={{ color: q.isCorrect ? "#34d399" : "#f87171" }}>
                            {q.spokenAnswerText
                              ? `🗣️ Spoken: "${q.spokenAnswerText}"`
                              : q.selectedOptionIndex !== null &&
                                q.selectedOptionIndex !== undefined &&
                                q.selectedOptionIndex >= 0
                              ? q.options?.[q.selectedOptionIndex]
                              : "Not Answered"}
                          </strong>{" "}
                          | Correct Answer:{" "}
                          <strong style={{ color: "#34d399" }}>
                            {q.options?.[q.correctOptionIndex]}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              TAB 5: OFFICIAL CAMPUS BROADCAST & NOTICEBOARD
             ================================================================ */}
          {activeTab === "announcements" && (
            <div className="edit-profile-container">
              <div className="edit-profile-header">
                <h2>📢 Official Campus Broadcast & Noticeboard</h2>
                <p>
                  Post official announcements, lecture updates, or exam reminders to all registered students or a specific student.
                </p>
              </div>

              <form
                onSubmit={handleBroadcastNoticeSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  padding: "20px",
                  background: "#161b26",
                  borderRadius: "14px",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "12px",
                  }}
                >
                  <div>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                      Recipient Audience
                    </label>
                    <select
                      className="pro-select"
                      value={noticeTarget}
                      onChange={(e) => setNoticeTarget(e.target.value)}
                    >
                      <option value="ALL">
                        📢 All Registered Students ({scholarsList.length})
                      </option>
                      {scholarsList.map((sc) => (
                        <option key={sc.studentId} value={sc.studentId}>
                          👤 {sc.studentName} ({sc.phone || sc.tier})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                      Category Badge
                    </label>
                    <select
                      className="pro-select"
                      value={noticeType}
                      onChange={(e) => setNoticeType(e.target.value)}
                    >
                      <option value="announcement">📢 Official Announcement</option>
                      <option value="exam-alert">⏰ Exam / Viva Reminder</option>
                      <option value="assignment">📚 Lecture / Assignment Notice</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                    Announcement Headline
                  </label>
                  <input
                    type="text"
                    className="pro-input"
                    placeholder="e.g. Important Class Schedule & Exam Guidelines"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                    Detailed Notice / Instructions
                  </label>
                  <textarea
                    className="pro-input"
                    style={{ minHeight: "100px", padding: "12px" }}
                    placeholder="Write complete announcement instructions for students..."
                    value={noticeMessage}
                    onChange={(e) => setNoticeMessage(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={noticeLoading}
                  className="pro-btn-primary"
                  style={{ alignSelf: "flex-start", padding: "10px 24px" }}
                >
                  {noticeLoading ? "Broadcasting..." : "📢 Publish Official Broadcast"}
                </button>
              </form>

              {sentNoticesHistory.length > 0 && (
                <div>
                  <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>
                    Recently Published Broadcasts
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {sentNoticesHistory.map((item) => (
                      <div key={item.id} className="cyber-item-card">
                        <div>
                          <h4 style={{ margin: "0 0 4px 0", fontSize: "15px" }}>
                            📢 {item.title}
                          </h4>
                          <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1" }}>
                            {item.message}
                          </p>
                        </div>
                        <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                          {item.createdAt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              TAB 6: SCHOLAR CONNECT & REAL-TIME CHAT
             ================================================================ */}
          {activeTab === "scholar-chat" && (
            <AiAgentWidget
              studentId={facultyId}
              studentName={facultyName}
              studentPhone={facultyPhone}
              studentEmail={facultyEmail}
              studentAvatar={facultyAvatar}
              externalTab="scholar-chat"
              onSelectTab={(tabName) => setActiveTab(tabName)}
            />
          )}

          {/* ================================================================
              TAB 7: ACCOUNT SETTINGS
             ================================================================ */}
          {activeTab === "profile" && (
            <div className="edit-profile-container">
              <div className="edit-profile-header">
                <h2>⚙️ Account Settings</h2>
                <p>
                  Update your faculty name, email address, phone number, avatar URL, and security password.
                </p>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "18px",
                    marginBottom: "20px",
                  }}
                >
                  <div className="pro-form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      className="pro-input"
                      value={profileForm.StudentName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, StudentName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="pro-form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="pro-input"
                      value={profileForm.StudentEmail}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, StudentEmail: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="pro-form-group">
                    <label>Phone Number (Scholar Connect ID)</label>
                    <input
                      type="text"
                      className="pro-input"
                      placeholder="03001234567"
                      value={profileForm.Phone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, Phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="pro-form-group">
                    <label>Profile Avatar URL</label>
                    <input
                      type="text"
                      className="pro-input"
                      placeholder="https://example.com/avatar.jpg"
                      value={profileForm.ProfileImage}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, ProfileImage: e.target.value })
                      }
                    />
                  </div>

                  <div className="pro-form-group">
                    <label>New Password (Optional)</label>
                    <input
                      type="password"
                      className="pro-input"
                      placeholder="Leave blank to keep current"
                      value={profileForm.Password}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, Password: e.target.value })
                      }
                    />
                  </div>

                  <div className="pro-form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      className="pro-input"
                      placeholder="Confirm new password"
                      value={profileForm.ConfirmPassword}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          ConfirmPassword: e.target.value,
                        })
                      }
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

export default FacultyDashboard;