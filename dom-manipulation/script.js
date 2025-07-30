let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Success is no accident.", category: "Motivation" },
  { text: "Be yourself; everyone else is taken.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

function showRandomQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  const quote = quotes[random];
  quoteDisplay.innerHTML = `"${quote.text}" [${quote.category}]`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  
}

function createAddQuoteForm() {
  // Already handled in HTML - this function can be used to dynamically generate form if desired
}
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();

    // Create DOM elements dynamically
    const quoteElement = document.createElement("p");
    const categoryElement = document.createElement("small");

    quoteElement.textContent = `"${newQuote.text}"`;
    categoryElement.textContent = `[${newQuote.category}]`;

    quoteDisplay.innerHTML = ""; // Clear previous quote
    quoteDisplay.appendChild(quoteElement);
    quoteDisplay.appendChild(categoryElement);

    // Clear inputs
    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added and displayed successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        throw new Error();
      }
    } catch {
      alert("Invalid JSON format.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
