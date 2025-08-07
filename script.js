// === Константы с коэффициентами ===
const UNIT_FACTORS = {
  length: {
    m: 1,
    cm: 100,
    mm: 1000,
    km: 0.001,
    in: 39.3701,
    ft: 3.28084,
    yd: 1.09361,
    mi: 0.000621371,
  },
  weight: {
    kg: 1,
    g: 1000,
    mg: 1e6,
    lb: 2.20462,
    oz: 35.274,
  }
};

const UNIT_OPTIONS = {
  length: ['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd', 'mi'],
  weight: ['kg', 'g', 'mg', 'lb', 'oz'],
  temperature: ['C', 'F', 'K']
};

// === Инициализация выпадающих списков ===
window.onload = () => {
  Object.entries(UNIT_OPTIONS).forEach(([type, units]) => {
    const fromSelect = document.getElementById(`${type}From`);
    const toSelect = document.getElementById(`${type}To`);
    units.forEach(unit => {
      fromSelect.appendChild(createOption(unit));
      toSelect.appendChild(createOption(unit));
    });
  });
};

function createOption(unit) {
  const option = document.createElement('option');
  option.value = unit.toLowerCase();
  option.text = unit;
  return option;
}

// === Конвертация ===
function convert(type) {
  const value = parseFloat(document.getElementById(`${type}Value`).value);
  const fromUnit = document.getElementById(`${type}From`).value;
  const toUnit = document.getElementById(`${type}To`).value;

  if (isNaN(value)) {
    alert("Please enter a valid number");
    return;
  }

  const result = type === 'temperature'
    ? convertTemperature(value, fromUnit, toUnit)
    : convertUsingFactors(type, value, fromUnit, toUnit);

  if (result === null) {
    alert("Unsupported unit or conversion.");
    return;
  }

  displayResult(value, fromUnit, result, toUnit);
}

function convertUsingFactors(type, value, from, to) {
  const factors = UNIT_FACTORS[type];
  if (!factors[from] || !factors[to]) return null;
  const base = value / factors[from];
  return base * factors[to];
}

function convertTemperature(value, from, to) {
  const f = from.toLowerCase();
  const t = to.toLowerCase();

  if (f === t) return value;

  let celsius;

  switch (f) {
    case 'c': celsius = value; break;
    case 'f': celsius = (value - 32) * 5 / 9; break;
    case 'k': celsius = value - 273.15; break;
    default: return null;
  }

  switch (t) {
    case 'c': return celsius;
    case 'f': return celsius * 9 / 5 + 32;
    case 'k': return celsius + 273.15;
    default: return null;
  }
}

// === Отображение результата ===
function displayResult(inputValue, from, resultValue, to) {
  const formattedResult = parseFloat(resultValue.toFixed(5));
  const resultEl = document.getElementById("resultText");
  resultEl.innerHTML = `${inputValue} ${from} = <strong>${formattedResult} ${to}</strong>`;
  document.getElementById("resultContainer").style.display = "block";
}

// === Сброс формы ===
function resetForm() {
  document.querySelectorAll("input").forEach(el => el.value = "");
  document.getElementById("resultContainer").style.display = "none";
}

// === Переключение вкладок ===
function switchTab(tabId) {
  document.querySelectorAll(".form-panel").forEach(panel => {
    panel.style.display = panel.id === tabId ? "block" : "none";
  });

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.textContent.toLowerCase() === tabId);
  });

  resetForm();
}
