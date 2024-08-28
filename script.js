document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('journal-form');
    const entriesDiv = document.getElementById('entries');
  
    // Load entries from localStorage on page load
    loadEntries();
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;
  
      const entry = {
        title,
        content,
        date: new Date().toLocaleString(),
      };
  
      // Save entry to localStorage
      saveEntry(entry);
  
      // Clear form
      form.reset();
  
      // Refresh entries display
      loadEntries();
    });
  
    function saveEntry(entry) {
      let entries = JSON.parse(localStorage.getItem('entries')) || [];
      entries.push(entry);
      localStorage.setItem('entries', JSON.stringify(entries));
    }
  
    function loadEntries() {
      entriesDiv.innerHTML = '';
      let entries = JSON.parse(localStorage.getItem('entries')) || [];
      entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry';
        entryDiv.innerHTML = `
          <div class="entry-title">${entry.title}</div>
          <div class="entry-date">${entry.date}</div>
          <div class="entry-content">${entry.content}</div>
        `;
        entriesDiv.appendChild(entryDiv);
      });
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('journal-form');
    const entriesDiv = document.getElementById('entries');
    let editIndex = null; // Track the index of the entry being edited
  
    // Load entries from localStorage on page load
    loadEntries();
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;
  
      const entry = {
        title,
        content,
        date: new Date().toLocaleString(),
      };
  
      if (editIndex !== null) {
        // Update the entry if we're in edit mode
        updateEntry(editIndex, entry);
        editIndex = null; // Reset edit index
        form.reset(); // Clear form after editing
      } else {
        // Save new entry
        saveEntry(entry);
      }
  
      // Refresh entries display
      loadEntries();
    });
  
    function saveEntry(entry) {
      let entries = JSON.parse(localStorage.getItem('entries')) || [];
      entries.push(entry);
      localStorage.setItem('entries', JSON.stringify(entries));
    }
  
    function updateEntry(index, updatedEntry) {
      let entries = JSON.parse(localStorage.getItem('entries')) || [];
      entries[index] = updatedEntry;
      localStorage.setItem('entries', JSON.stringify(entries));
    }
  
    function deleteEntry(index) {
      let entries = JSON.parse(localStorage.getItem('entries')) || [];
      entries.splice(index, 1); // Remove the entry at the given index
      localStorage.setItem('entries', JSON.stringify(entries));
      loadEntries(); // Refresh the displayed entries
    }
  
    function loadEntries() {
      entriesDiv.innerHTML = ''; // Clear existing entries
      let entries = JSON.parse(localStorage.getItem('entries')) || [];
      entries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry';
        entryDiv.innerHTML = `
          <div class="entry-title">${entry.title}</div>
          <div class="entry-date">${entry.date}</div>
          <div class="entry-content">${entry.content}</div>
          <div class="button-container">
            <button class="edit-btn" onclick="editEntry(${index})">Edit</button>
            <button class="delete-btn" onclick="deleteEntry(${index})">Delete</button>
          </div>
        `;
        entriesDiv.appendChild(entryDiv);
      });
    }
  
    // Make the editEntry and deleteEntry functions accessible globally
    window.editEntry = function (index) {
      let entries = JSON.parse(localStorage.getItem('entries')) || [];
      const entry = entries[index];
  
      // Fill the form with the entry data to be edited
      document.getElementById('title').value = entry.title;
      document.getElementById('content').value = entry.content;
  
      editIndex = index; // Set the current entry index to be edited
    };
  
    window.deleteEntry = function (index) {
      // Confirm before deletion
      if (confirm('Are you sure you want to delete this entry?')) {
        deleteEntry(index);
      }
    };
  });
  
  