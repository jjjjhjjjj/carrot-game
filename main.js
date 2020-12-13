const btnBox = document.querySelector(".game-btn-box");
const timer = document.querySelector(".timer");
const container = document.querySelector(".container");
const counter = document.querySelector(".counter");
const modal = document.querySelector(".modal");
const dim = document.querySelector(".dim");
const replayBtn = document.querySelector(".replay");
const modalCon = document.querySelector(".modal-con");
const bug = document.querySelector(".bug");
const carrot = document.querySelector(".carrot");

let time;
let sec;
let count;
let carrotAll;
let randomX;
let randomY;

initValue();

// 초, 당근 수 초기화
function initValue() {
  sec = 8;
  count = 10;
  timer.textContent = "0:0";
  counter.textContent = "0";
}

// 모달 창 열기
function openModal(text) {
  changeModalText(text);

  btnBox.classList.add("visible-hidden");
  modal.classList.remove("display-none");
  dim.classList.remove("display-none");
}

// 모달 창 닫기
function closeModal() {
  btnBox.classList.remove("visible-hidden");
  modal.classList.add("display-none");
  dim.classList.add("display-none");
}

// 모달 내용+데이터 변경
function changeModalText(status) {
  let text;

  if (status === "stop") text = "Replay❓";
  else if (status === "lose") text = "😥You Lost😥";
  else if (status === "success") text = "🎉You Won🎉";
  else text = "🚫ERROR🚫";

  modal.dataset.status = status;
  modalCon.textContent = text;
}

// 시작·정지버튼 toggle
function toggleButton() {
  const btn = btnBox.querySelector("button");
  const btnIcon = btnBox.querySelector("button i");

  btn.classList.toggle("play");
  btn.classList.toggle("stop");
  btnIcon.classList.toggle("fa-play");
  btnIcon.classList.toggle("fa-stop");
}

//당근 수 변경
function chanageCounterText(num) {
  count = num;
  counter.textContent = num;
}

// 타이머 10초 함수
function countDown() {
  if (sec === 8) timer.textContent = "0:9";

  time = setInterval(() => {
    timer.textContent = `0:${sec}`;
    sec--;

    if (sec < 0) {
      resultGame("lose");
    }
  }, 1000);
}

// 당근, 벌레 랜덤 배치
function randomDisplay() {
  for (let i = 0; i < 10; i++) {
    let btn = document.createElement("button");
    btn.setAttribute("class", "carrot");

    randomX = Math.floor(Math.random() * 690) + 65;
    randomY = Math.floor(Math.random() * 140) + 65;

    btn.style.top = `${randomY}px`;
    btn.style.left = `${randomX}px`;

    container.appendChild(btn);
  }

  for (let i = 0; i < 10; i++) {
    let btn = document.createElement("button");
    btn.setAttribute("class", "bug");

    randomX = Math.floor(Math.random() * 690) + 65;
    randomY = Math.floor(Math.random() * 140) + 65;

    btn.style.top = `${randomY}px`;
    btn.style.left = `${randomX}px`;

    container.appendChild(btn);
  }
}

// 당근, 벌레 삭제
function removeContainerChild() {
  container.innerHTML = "";
}

// 게임 결과 : 타이머 정지, 초기화, 당근·벌레 삭제, 모달창 열기
function resultGame(status) {
  clearInterval(time);
  initValue();
  removeContainerChild();
  openModal(status);
}

// 게임 시작 : 타이머 시작, 랜덤 재배치, 카운트 설정
function onStartGame() {
  countDown();
  randomDisplay();
  chanageCounterText(count);
}

// 게임 일시정지 : 타이머 정지, 모달창 열기
function onStopGame() {
  clearInterval(time);
  openModal("stop");
}

// 시작, 일시정지 이벤트 위임
btnBox.addEventListener("click", (e) => {
  let target = e.target;

  if (target.nodeName === "DIV") return;

  if (target.nodeName === "I") target = target.parentNode;

  if (target.classList.contains("play")) onStartGame();
  else if (target.classList.contains("stop")) onStopGame();
  else console.error("에러가 발생했습니다.");

  toggleButton();
});

// 당근 클릭 이벤트 : 클릭한 당근 삭제, 당근 수 카운트
function onCarrotClick(e) {
  container.removeChild(e.target);
  chanageCounterText(--count);

  if (count < 1) resultGame("success");
}

//  당근·벌레 이벤트 위임
container.addEventListener("click", (e) => {
  const target = e.target;
  if (target.nodeName !== "BUTTON") return;

  if (target.matches(".carrot")) onCarrotClick(e);
  else if (target.matches(".bug")) resultGame("lose");
  else console.error("에러");
});

// 게임 재시작 : 모달창 닫기, 버튼 타입 변경
function onReplayGame(status) {
  closeModal();
  toggleButton();

  if (status === "stop") countDown();
}

// 게임 재시작 이벤트 리스터 등록
replayBtn.addEventListener("click", () => {
  const status = modal.dataset.status;

  if (status == null) return;

  onReplayGame(status);
});
