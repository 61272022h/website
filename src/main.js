import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const quintileDetails = {
  q1: { label: "最低所得組", amount: "NT$1,741", description: "此組家戶位於可支配所得五等分位的最低一組。統計涵蓋全體家戶，不限有學齡子女家庭；「教育服務」也不等同補習費。" },
  q2: { label: "次低所得組", amount: "NT$7,685", description: "此組家戶位於可支配所得五等分位的第二組。統計涵蓋全體家戶，不限有學齡子女家庭；「教育服務」也不等同補習費。" },
  q3: { label: "中間所得組", amount: "NT$18,316", description: "此組家戶位於可支配所得五等分位的中間組。統計涵蓋全體家戶，不限有學齡子女家庭；「教育服務」也不等同補習費。" },
  q4: { label: "次高所得組", amount: "NT$33,336", description: "此組家戶位於可支配所得五等分位的第四組。統計涵蓋全體家戶，不限有學齡子女家庭；「教育服務」也不等同補習費。" },
  q5: { label: "最高所得組", amount: "NT$56,832", description: "此組家戶位於可支配所得五等分位的最高一組。統計涵蓋全體家戶，不限有學齡子女家庭；「教育服務」也不等同補習費。" },
};

const quintileButtons = [...document.querySelectorAll(".quintile-row")];
const detailKicker = document.querySelector("#detail-kicker");
const detailLabel = document.querySelector("#detail-label");
const detailAmount = document.querySelector("#detail-amount");
const detailDescription = document.querySelector("#detail-description");

quintileButtons.forEach((button) => {
  button.addEventListener("click", () => {
    quintileButtons.forEach((option) => option.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");

    const key = button.dataset.quintile;
    const detail = quintileDetails[key];
    detailKicker.textContent = `SELECTED / ${key.toUpperCase()}`;
    detailLabel.textContent = detail.label;
    detailAmount.textContent = detail.amount;
    detailDescription.textContent = detail.description;
  });
});

if (!reducedMotion) {
  gsap.from(".hero-copy > *", {
    y: 24,
    autoAlpha: 0,
    duration: 0.85,
    stagger: 0.09,
    ease: "power2.out",
    delay: 0.12,
  });

  gsap.from(".hero-visual", {
    scale: 0.92,
    autoAlpha: 0,
    duration: 1.15,
    ease: "power3.out",
    delay: 0.3,
  });

  gsap.to(".orbit-one", {
    rotation: 360,
    duration: 42,
    repeat: -1,
    ease: "none",
    transformOrigin: "50% 50%",
  });

  gsap.to(".orbit-three", {
    rotation: -360,
    duration: 56,
    repeat: -1,
    ease: "none",
    transformOrigin: "50% 50%",
  });

  gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.from(element, {
      y: 28,
      autoAlpha: 0,
      duration: 0.75,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 86%",
        once: true,
      },
    });
  });
}

const answerFeedback = document.querySelector(".answer-feedback p");
const answerButtons = [...document.querySelectorAll(".answer-option")];

const answerCopy = {
  "wrong-a": "不能。這份資料顯示兩組學生的補習比例不同，但沒有證明打工是造成差異的原因。",
  right: "可以。電子報描述 2001 年特定高中職／五專樣本中，打工與未打工學生的補習參與比例不同；這是關聯，不是因果，也不是今日狀況。",
  "wrong-c": "不能。這組數字來自 2001 年，且只比較打工狀態與補習參與；它無法回答今日差距是否擴大。",
};

answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    answerButtons.forEach((option) => option.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    answerFeedback.textContent = answerCopy[button.dataset.answer];
    answerFeedback.parentElement.classList.toggle("is-correct", button.dataset.answer === "right");
  });
});

const feedbackForm = document.querySelector("#feedback-form");

if (feedbackForm) {
  const feedbackStatus = document.querySelector("#feedback-status");
  const feedbackText = document.querySelector("#feedback-text");
  const feedbackCount = document.querySelector("#feedback-count");
  const submissionIdInput = document.querySelector("#feedback-submission-id");
  const submitButton = feedbackForm.querySelector(".feedback-submit");
  const submitLabel = submitButton.querySelector("span");
  let activeSubmissionId = createSubmissionId();
  let requestTimer = 0;
  let isSubmitting = false;

  function isTrustedResponseOrigin(origin) {
    let responseUrl;
    try {
      responseUrl = new URL(origin);
    } catch {
      return false;
    }

    const hostname = responseUrl.hostname.toLowerCase();
    return responseUrl.protocol === "https:" && (
      hostname === "script.googleusercontent.com" ||
      hostname.endsWith("-script.googleusercontent.com")
    );
  }

  submissionIdInput.value = activeSubmissionId;

  function createSubmissionId() {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    const values = new Uint8Array(16);
    crypto.getRandomValues(values);
    return [...values].map((value) => value.toString(16).padStart(2, "0")).join("");
  }

  function updateFeedbackCount() {
    feedbackCount.value = `${feedbackText.value.length} / 2000`;
    feedbackCount.textContent = feedbackCount.value;
  }

  function setFeedbackStatus(message, state = "") {
    feedbackStatus.textContent = message;
    feedbackStatus.dataset.state = state;
  }

  function finishRequest() {
    window.clearTimeout(requestTimer);
    requestTimer = 0;
    isSubmitting = false;
    feedbackForm.removeAttribute("aria-busy");
    submitButton.disabled = false;
    submitLabel.textContent = "重試送出";
  }

  feedbackText.addEventListener("input", updateFeedbackCount);

  feedbackForm.addEventListener("submit", () => {
    if (isSubmitting) return;

    isSubmitting = true;
    submissionIdInput.value = activeSubmissionId;
    feedbackForm.setAttribute("aria-busy", "true");
    submitButton.disabled = true;
    submitLabel.textContent = "送出中…";
    setFeedbackStatus("正在送出回饋，請稍候。", "pending");

    requestTimer = window.setTimeout(() => {
      if (!isSubmitting) return;
      finishRequest();
      setFeedbackStatus("目前沒有收到回覆；你的內容仍保留，請稍後重試。", "error");
    }, 30000);
  });

  window.addEventListener("message", (event) => {
    // HtmlService runs inside a Google sandbox iframe nested within the
    // response iframe, so event.source is not feedbackFrame.contentWindow.
    // Trust the Googleusercontent sandbox origin and correlate by the
    // unpredictable submission ID instead.
    if (!isTrustedResponseOrigin(event.origin)) return;

    const result = event.data;
    if (!result || result.type !== "exhibition-feedback") return;
    if (result.submissionId !== activeSubmissionId) return;

    finishRequest();

    if (result.ok) {
      feedbackForm.reset();
      activeSubmissionId = createSubmissionId();
      submissionIdInput.value = activeSubmissionId;
      updateFeedbackCount();
      submitLabel.textContent = "送出回饋";
      setFeedbackStatus("回饋已送出，謝謝你幫助我們修正展覽。", "success");
      return;
    }

    const errors = {
      CONSENT_REQUIRED: "請先勾選資料使用同意，再送出回饋。",
      INVALID_FEEDBACK: "回饋內容格式不正確，請檢查後重試。",
      FEEDBACK_TOO_LONG: "回饋超過 2,000 字，請縮短後重試。",
      INVALID_SUBMISSION_ID: "送出識別碼失效，請再按一次送出。",
      TRY_AGAIN: "系統目前忙碌，內容已保留，請稍後重試。",
      SUBMISSION_FAILED: "回饋暫時沒有送出，內容已保留，請稍後重試。",
    };
    setFeedbackStatus(errors[result.error] || "回饋暫時沒有送出，內容已保留，請稍後重試。", "error");
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
  });
});
