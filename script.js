const suggestions = {
  stateA: [
    "желание уйти",
    "желание остаться",
    "смелость",
    "покой",
    "нетерпение",
    "тихий голос",
  ],
  stateB: [
    "любовь",
    "злость",
    "вдохновение",
    "усталость",
    "радость",
    "сомнение",
  ],
};

const stateAInput = document.getElementById("stateA");
const stateBInput = document.getElementById("stateB");
const labelA = document.getElementById("labelA");
const labelB = document.getElementById("labelB");
const messageSection = document.getElementById("message");
const messageText = messageSection.querySelector("p");
const observeButton = document.getElementById("observe");
const chooseButton = document.getElementById("choose");
const choiceDialog = document.getElementById("choice-dialog");

const optionTemplate = document.getElementById("option-template");
const suggestionAreas = document.querySelectorAll(".suggestions");

const stateData = {
  A: stateAInput.value || "желание уйти",
  B: stateBInput.value || "любовь",
};

function renderSuggestions() {
  suggestionAreas.forEach((area) => {
    const target = area.dataset.target;
    const list = suggestions[target];
    area.innerHTML = "";

    if (!Array.isArray(list)) return;

    list.forEach((text) => {
      const option = optionTemplate.content.firstElementChild.cloneNode(true);
      option.textContent = text;
      option.addEventListener("click", () => {
        document.getElementById(target).value = text;
        updateState(target === "stateA" ? "A" : "B", text);
        messageSection.hidden = true;
      });
      area.appendChild(option);
    });
  });
}

function updateState(key, value) {
  const trimmed = value.trim();
  if (!trimmed) return;
  stateData[key] = trimmed;
  if (key === "A") {
    labelA.textContent = trimmed;
  } else {
    labelB.textContent = trimmed;
  }
}

function syncInputs() {
  updateState("A", stateAInput.value || stateData.A);
  updateState("B", stateBInput.value || stateData.B);
}

stateAInput.addEventListener("input", () => {
  updateState("A", stateAInput.value);
  messageSection.hidden = true;
});

stateBInput.addEventListener("input", () => {
  updateState("B", stateBInput.value);
  messageSection.hidden = true;
});

observeButton.addEventListener("click", () => {
  syncInputs();
  messageText.textContent = "Ты просто наблюдаешь. Ничего не нужно менять.";
  messageSection.hidden = false;
});

chooseButton.addEventListener("click", () => {
  syncInputs();
  if (typeof choiceDialog.showModal !== "function") {
    const choice = window.prompt("Что сейчас ближе: A или B?", "A");
    handleChoice(choice === "B" ? "B" : "A");
    return;
  }
  choiceDialog.querySelector('[data-choice="A"]').textContent = stateData.A;
  choiceDialog.querySelector('[data-choice="B"]').textContent = stateData.B;
  choiceDialog.showModal();
});

choiceDialog.addEventListener("close", () => {
  const { returnValue } = choiceDialog;
  if (!returnValue || returnValue === "cancel") return;
  handleChoice(returnValue);
});

function handleChoice(choiceKey) {
  const otherKey = choiceKey === "A" ? "B" : "A";
  const chosenLabel = choiceKey === "A" ? labelA : labelB;
  const fadedLabel = choiceKey === "A" ? labelB : labelA;

  chosenLabel.parentElement.classList.add("chosen");
  fadedLabel.parentElement.classList.add("faded");

  messageText.innerHTML = `Ты выбрала <strong>${stateData[choiceKey]}</strong>. Но <strong>${stateData[otherKey]}</strong> тоже было с тобой. Это нормально.`;
  messageSection.hidden = false;

  setTimeout(() => {
    chosenLabel.parentElement.classList.remove("chosen");
    fadedLabel.parentElement.classList.remove("faded");
  }, 1800);
}

renderSuggestions();
syncInputs();
