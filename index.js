const inputValue = document.getElementById("inputValue");
const conversionType = document.getElementById("conversionType");
const unitFrom = document.getElementById("unitFrom");
const unitTo = document.getElementById("unitTo");
const result = document.getElementById("result");
const themeToggle = document.getElementById("themeToggle");

const categories = {
  Length: {
    units: {
      meters: 1,
      kilometers: 1000,
      miles: 1609.34,
      feet: 0.3048
    }
  },
  Weight: {
    units: {
      kilograms: 1,
      grams: 0.001,
      pounds: 0.453592,
      ounces: 0.0283495
    }
  },
  Volume: {
    units: {
      liters: 1,
      milliliters: 0.001,
      gallons: 3.78541,
      cups: 0.24
    }
  }
};

function populateConversionTypes() {
  conversionType.innerHTML = "";
  Object.keys(categories).forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    conversionType.appendChild(option);
  });
}

function populateUnits() {
  const selectedCategory = conversionType.value;
  const units = categories[selectedCategory].units;

  unitFrom.innerHTML = "";
  unitTo.innerHTML = "";

  for (let unit in units) {
    const optionFrom = new Option(unit, unit);
    const optionTo = new Option(unit, unit);
    unitFrom.appendChild(optionFrom);
    unitTo.appendChild(optionTo);
  }

  if (unitTo.options.length > 1) {
    unitTo.selectedIndex = 1;
  }
}

function convert() {
  const value = parseFloat(inputValue.value);
  if (isNaN(value)) {
    result.textContent = "Please enter a valid number";
    return;
  }

  const from = unitFrom.value;
  const to = unitTo.value;
  const category = conversionType.value;
  const units = categories[category].units;

  if (!units[from] || !units[to]) {
    result.textContent = "Invalid units selected";
    return;
  }

  const baseValue = value * units[from];
  const convertedValue = baseValue / units[to];

  result.textContent = `${value} ${from} = ${convertedValue.toFixed(4)} ${to}`;

  saveToLocalStorage(value, category, from, to);
}

function saveToLocalStorage(value, category, from, to) {
  const state = { value, category, from, to };
  localStorage.setItem("unitConverterState", JSON.stringify(state));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem("unitConverterState");
  if (!saved) return;

  const { value, category, from, to } = JSON.parse(saved);
  conversionType.value = category;
  populateUnits();

  unitFrom.value = from;
  unitTo.value = to;
  inputValue.value = value;
  convert();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
}

inputValue.addEventListener("input", convert);
unitFrom.addEventListener("change", convert);
unitTo.addEventListener("change", convert);
conversionType.addEventListener("change", () => {
  populateUnits();
  convert();
});
themeToggle.addEventListener("click", toggleTheme);

window.onload = () => {
  populateConversionTypes();
  populateUnits();
  loadFromLocalStorage();
};
