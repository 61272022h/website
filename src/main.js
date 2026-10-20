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

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
  });
});
