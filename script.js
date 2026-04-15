function getEntries() {
  try { return JSON.parse(localStorage.getItem('gardenJournal') || '[]'); }
  catch(e) { return []; }
}
function saveEntries(entries) {
  localStorage.setItem('gardenJournal', JSON.stringify(entries));
}
function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
function renderEntries() {
  var container = document.getElementById('journal-entries');
  if (!container) return;
  var entries = getEntries();
  container.innerHTML = '';
  entries.forEach(function(entry, i) {
    var div = document.createElement('div');
    div.className = 'journal-entry';
    div.innerHTML = '<div class="je-date">' + entry.date + '</div><div class="je-text">' + escapeHtml(entry.text) + '</div><button class="je-delete" onclick="deleteEntry(' + i + ')" title="Delete">&times;</button>';
    container.appendChild(div);
  });
}
function renderLatestEntry() {
  var container = document.getElementById('latest-entry');
  if (!container) return;
  var entries = getEntries();
  if (entries.length === 0) {
    container.innerHTML = '<p class="empty-state">No journal entries yet. <a href="journal.html">Add your first entry.</a></p>';
    return;
  }
  var entry = entries[0];
  var div = document.createElement('div');
  div.className = 'journal-entry';
  div.innerHTML = '<div class="je-date">' + entry.date + '</div><div class="je-text">' + escapeHtml(entry.text) + '</div>';
  container.innerHTML = '';
  container.appendChild(div);
  var link = document.createElement('p');
  link.style.marginTop = '1rem';
  link.innerHTML = '<a href="journal.html">View all entries &rarr;</a>';
  container.appendChild(link);
}
function addEntry() {
  var input = document.getElementById('journal-input');
  var text = input.value.trim();
  if (!text) return;
  var entries = getEntries();
  var now = new Date();
  var dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  var timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  entries.unshift({ date: dateStr + ' at ' + timeStr, text: text });
  saveEntries(entries);
  input.value = '';
  renderEntries();
}
function deleteEntry(index) {
  var entries = getEntries();
  entries.splice(index, 1);
  saveEntries(entries);
  renderEntries();
}

// Page-specific initialization
renderEntries();
renderLatestEntry();

var journalInput = document.getElementById('journal-input');
if (journalInput) {
  journalInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addEntry(); }
  });
}