document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('journal-form');
    const entriesDiv = document.getElementById('entries');
    let editId = null; // Track the ID of the entry being edited
  
    // Load entries from localStorage on page load
    loadEntries();
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const title = document.getElementById('title').value.trim();
      const content = document.getElementById('content').value.trim();
  
      // Validate input fields to prevent empty entries
      if (title === '' || content === '') {
        alert('Both title and content are required!');
        return;
      }
  
      const entry = {
        id: editId !== null ? editId : generateUniqueId(), // Use existing ID if editing
        title,
        content,
        date: new Date().toLocaleString(),
      };
  
      if (editId !== null) {
        // Update the entry if we're in edit mode
        updateEntry(entry);
        editId = null; // Reset edit ID
      } else {
        // Save new entry
        saveEntry(entry);
      }
  
      // Clear form after saving
      form.reset();
  
      // Refresh entries display
      loadEntries();
    });
  
    function generateUniqueId() {
      return '_' + Math.random().toString(36).substr(2, 9); // Generate a random ID
    }
  
    function saveEntry(entry) {
      let entries = JSON.parse(localStorage.getItem('entries')) || [];
      entries.push(entry);
      localStorage.setItem('entries', JSON.stringify(entries));
    }
  
    function updateEntry(updatedEntry) {
      let entries = JSON.parse(localStorage.getItem('entries')) || [];
      const index = entries.findIndex(entry => entry.id === updatedEntry.id);
      if (index !== -1) {
        entries[index] = updatedEntry;
        localStorage.setItem('entries', JSON.stringify(entries));
      }
    }
  
    function deleteEntry(id) {
      let entries = JSON.parse(localStorage.getItem('entries')) || [];
      entries = entries.filter(entry => entry.id !== id); // Remove the entry with the matching ID
      localStorage.setItem('entries', JSON.stringify(entries));
      loadEntries(); // Refresh the displayed entries
    }
  
    function loadEntries() {
        entriesDiv.innerHTML = ''; // Clear existing entries
        let entries = JSON.parse(localStorage.getItem('entries')) || [];
      
        // Reverse the order of entries to display the newest first
        entries.reverse();
      
        entries.forEach((entry) => {
          if (entry.title && entry.content) { // Only display non-empty entries
            const entryDiv = document.createElement('div');
            entryDiv.className = 'entry';
            entryDiv.innerHTML = `
              <div class="entry-title">${entry.title}</div>
              <div class="entry-date">${entry.date}</div>
              <div class="entry-content">${entry.content}</div>
              <div class="button-container">
                <button class="edit-btn" onclick="editEntry('${entry.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteEntry('${entry.id}')">Delete</button>
              </div>
            `;
            entriesDiv.appendChild(entryDiv);
          }
        });
      }
      
  
    // Make the editEntry and deleteEntry functions accessible globally
    window.editEntry = function (id) {
      let entries = JSON.parse(localStorage.getItem('entries')) || [];
      const entry = entries.find(entry => entry.id === id);
  
      if (entry) {
        // Fill the form with the entry data to be edited
        document.getElementById('title').value = entry.title;
        document.getElementById('content').value = entry.content;
  
        editId = entry.id; // Set the current entry ID to be edited
      }
    };
  
    window.deleteEntry = function (id) {
      // Confirm before deletion
      if (confirm('Are you sure you want to delete this entry?')) {
        deleteEntry(id);
      }
    };
  });
  