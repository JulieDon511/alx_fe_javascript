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

// second question
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  const categorySelect = document.getElementById("categoryFilter");

  categorySelect.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categorySelect.value = savedFilter;
    filterQuotes();
  }
}
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  quoteDisplay.innerHTML = ""; // Clear display

  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  filtered.forEach(q => {
    const quoteElement = document.createElement("p");
    const categoryElement = document.createElement("small");

    quoteElement.textContent = `"${q.text}"`;
    categoryElement.textContent = `[${q.category}]`;

    quoteDisplay.appendChild(quoteElement);
    quoteDisplay.appendChild(categoryElement);
  });
}
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories(); // Refresh category dropdown
    filterQuotes(); // Redisplay quotes based on current filter

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}
window.addEventListener("load", () => {
  populateCategories();
});
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const data = await response.json();

    const serverQuotes = data.map(d => ({
      text: d.title,
      category: "server"
    }));

    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error("Error fetching from server:", error);
  }
}

setInterval(fetchQuotesFromServer, 30000); // Every 30 seconds
function resolveConflicts(serverQuotes) {
  const existingTexts = quotes.map(q => q.text);
  const newFromServer = serverQuotes.filter(q => !existingTexts.includes(q.text));

  if (newFromServer.length > 0) {
    quotes.push(...newFromServer);
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUpdate(newFromServer.length);
  }
}
function notifyUpdate(count) {
  alert(`${count} new quote(s) synced from server.`);
}
