function getEntries() {
  try { return JSON.parse(localStorage.getItem('gardenJournal') || '[]'); }
  catch(e) { return []; }
}
function saveEntries(entries) {
  localStorage.setItem('gardenJournal', JSON.stringify(entries));
}
function renderEntries() {
  var entries = getEntries();
  var container = document.getElementById('journal-entries');
  container.innerHTML = '';
  entries.forEach(function(entry, i) {
    var div = document.createElement('div');
    div.className = 'journal-entry';
    div.innerHTML = '<div class="je-date">' + entry.date + '</div><div class="je-text">' + escapeHtml(entry.text) + '</div><button class="je-delete" onclick="deleteEntry(' + i + ')" title="Delete">&times;</button>';
    container.appendChild(div);
  });
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
function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
document.getElementById('journal-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addEntry(); }
});
renderEntries();