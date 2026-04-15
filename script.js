// === Utilities ===
function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// === Journal ===
function getEntries() {
  try { return JSON.parse(localStorage.getItem('gardenJournal') || '[]'); }
  catch(e) { return []; }
}
function saveEntries(entries) {
  localStorage.setItem('gardenJournal', JSON.stringify(entries));
}

function renderEntryHtml(entry, index, showDelete) {
  var html = '<div class="je-date">' + entry.date + '</div>';
  html += '<div class="je-text">' + escapeHtml(entry.text) + '</div>';
  if (entry.photo) {
    html += '<img class="je-photo" src="' + entry.photo + '" alt="Journal photo">';
  }
  if (showDelete) {
    html += '<button class="je-delete" onclick="deleteEntry(' + index + ')" title="Delete">&times;</button>';
  }
  return html;
}

function renderEntries() {
  var container = document.getElementById('journal-entries');
  if (!container) return;
  var entries = getEntries();
  container.innerHTML = '';
  entries.forEach(function(entry, i) {
    var div = document.createElement('div');
    div.className = 'journal-entry';
    div.innerHTML = renderEntryHtml(entry, i, true);
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
  var div = document.createElement('div');
  div.className = 'journal-entry';
  div.innerHTML = renderEntryHtml(entries[0], 0, false);
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

  var fileInput = document.getElementById('journal-photo');
  var file = fileInput && fileInput.files[0];

  var now = new Date();
  var dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  var timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  function save(photoData) {
    var entries = getEntries();
    var entry = { date: dateStr + ' at ' + timeStr, text: text };
    if (photoData) entry.photo = photoData;
    entries.unshift(entry);
    saveEntries(entries);
    input.value = '';
    if (fileInput) fileInput.value = '';
    renderEntries();
  }

  if (file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      // Resize to keep localStorage manageable
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var maxW = 800;
        var w = img.width, h = img.height;
        if (w > maxW) { h = h * maxW / w; w = maxW; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        save(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    save(null);
  }
}

function deleteEntry(index) {
  var entries = getEntries();
  entries.splice(index, 1);
  saveEntries(entries);
  renderEntries();
}

// === Growing Now ===
function getGrowing() {
  try { return JSON.parse(localStorage.getItem('gardenGrowing') || '[]'); }
  catch(e) { return []; }
}
function saveGrowing(items) {
  localStorage.setItem('gardenGrowing', JSON.stringify(items));
}
function addGrowing() {
  var name = document.getElementById('growing-name');
  var date = document.getElementById('growing-date');
  var notes = document.getElementById('growing-notes');
  if (!name.value.trim()) return;
  var items = getGrowing();
  items.unshift({
    name: name.value.trim(),
    date: date.value || new Date().toISOString().split('T')[0],
    notes: notes.value.trim()
  });
  saveGrowing(items);
  name.value = ''; date.value = ''; notes.value = '';
  renderGrowing();
}
function deleteGrowing(index) {
  var items = getGrowing();
  items.splice(index, 1);
  saveGrowing(items);
  renderGrowing();
}
function renderGrowing() {
  var container = document.getElementById('growing-list');
  if (!container) return;
  var items = getGrowing();
  container.innerHTML = '';
  if (items.length === 0) {
    container.innerHTML = '<p class="empty-state">Nothing tracked yet. Add what you\'re growing above.</p>';
    return;
  }
  items.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'tracker-item';
    var meta = new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    div.innerHTML = '<h4>' + escapeHtml(item.name) + '</h4>'
      + '<div class="ti-meta">Planted ' + meta + '</div>'
      + (item.notes ? '<p>' + escapeHtml(item.notes) + '</p>' : '')
      + '<button class="ti-delete" onclick="deleteGrowing(' + i + ')" title="Remove">&times;</button>';
    container.appendChild(div);
  });
}

// === Harvested ===
function getHarvests() {
  try { return JSON.parse(localStorage.getItem('gardenHarvests') || '[]'); }
  catch(e) { return []; }
}
function saveHarvests(items) {
  localStorage.setItem('gardenHarvests', JSON.stringify(items));
}
function addHarvest() {
  var name = document.getElementById('harvest-name');
  var date = document.getElementById('harvest-date');
  var yieldVal = document.getElementById('harvest-yield');
  var weight = document.getElementById('harvest-weight');
  if (!name.value.trim()) return;
  var items = getHarvests();
  items.unshift({
    name: name.value.trim(),
    date: date.value || new Date().toISOString().split('T')[0],
    yield: yieldVal.value.trim(),
    weight: weight.value.trim()
  });
  saveHarvests(items);
  name.value = ''; date.value = ''; yieldVal.value = ''; weight.value = '';
  renderHarvests();
}
function deleteHarvest(index) {
  var items = getHarvests();
  items.splice(index, 1);
  saveHarvests(items);
  renderHarvests();
}
function renderHarvests() {
  var container = document.getElementById('harvest-list');
  if (!container) return;
  var items = getHarvests();
  container.innerHTML = '';
  if (items.length === 0) {
    container.innerHTML = '<p class="empty-state">No harvests logged yet.</p>';
    return;
  }
  items.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'tracker-item';
    var meta = new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    var details = [];
    if (item.yield) details.push(escapeHtml(item.yield));
    if (item.weight) details.push(escapeHtml(item.weight));
    div.innerHTML = '<h4>' + escapeHtml(item.name) + '</h4>'
      + '<div class="ti-meta">Harvested ' + meta + '</div>'
      + (details.length ? '<p>' + details.join(' &middot; ') + '</p>' : '')
      + '<button class="ti-delete" onclick="deleteHarvest(' + i + ')" title="Remove">&times;</button>';
    container.appendChild(div);
  });
}

// === Journal form toggle ===
function toggleJournalForm() {
  var form = document.getElementById('journal-form');
  if (form) form.classList.toggle('collapsed');
}

// === Timeline auto-highlight ===
function highlightTimeline() {
  var timeline = document.getElementById('season-timeline');
  if (!timeline) return;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var items = timeline.querySelectorAll('.timeline-item');
  var found = false;
  items.forEach(function(item) {
    item.classList.remove('now');
    var start = item.getAttribute('data-start');
    var end = item.getAttribute('data-end');
    if (start && end) {
      var s = new Date(start + 'T00:00:00');
      var e = new Date(end + 'T23:59:59');
      if (today >= s && today <= e) {
        item.classList.add('now');
        found = true;
      }
    }
  });
  // If no exact match, highlight the next upcoming period
  if (!found) {
    for (var i = 0; i < items.length; i++) {
      var start = items[i].getAttribute('data-start');
      if (start && new Date(start + 'T00:00:00') > today) {
        items[i].classList.add('now');
        break;
      }
    }
  }
}

// === Page initialization ===
renderEntries();
renderLatestEntry();
renderGrowing();
renderHarvests();
highlightTimeline();

var journalInput = document.getElementById('journal-input');
if (journalInput) {
  journalInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addEntry(); }
  });
}

// Set today's date as default on date inputs
document.querySelectorAll('.tracker-form input[type="date"]').forEach(function(input) {
  if (!input.value) input.value = new Date().toISOString().split('T')[0];
});