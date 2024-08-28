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
        closeReading: '' // Placeholder for close reading
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
      entries.reverse(); // Show newest entries first
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
              <button class="attach-close-reading-btn" onclick="openCloseReadingWindow('${entry.id}')">Attach Close Reading</button>
            </div>
          `;
          entriesDiv.appendChild(entryDiv);
        }
      });
    }
  
    // Function to handle editing an entry
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
  
    // Function to handle deleting an entry
    window.deleteEntry = function (id) {
      // Confirm before deletion
      if (confirm('Are you sure you want to delete this entry?')) {
        deleteEntry(id);
      }
    };
  
    // Function to open the close reading window
    window.openCloseReadingWindow = function (id) {
      const width = 600;
      const height = 400;
      const left = (window.innerWidth / 2) - (width / 2);
      const top = (window.innerHeight / 2) - (height / 2);
  
      const newWindow = window.open('', '_blank', `width=${width},height=${height},top=${top},left=${left}`);
      newWindow.document.write(`
        <html>
          <head>
            <title>Attach Close Reading</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: var(--bg-100);
                color: var(--text-100);
                padding: 20px;
              }
              textarea {
                width: 100%;
                height: 200px;
                background-color: var(--bg-200);
                color: var(--text-200);
                padding: 10px;
                border-radius: 5px;
                border: 1px solid var(--bg-300);
              }
              button {
                margin-top: 10px;
                background-color: var(--primary-100);
                color: var(--text-100);
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
              }
              .toolbar {
                margin-top: 10px;
              }
              .toolbar button {
                margin-right: 5px;
              }
            </style>
          </head>
          <body>
            <h2>Attach Close Reading</h2>
            <textarea id="closeReadingText" placeholder="Paste text here..."></textarea>
            <div class="toolbar">
              <button onclick="addTag()">Add Tag</button>
              <button onclick="addComment()">Add Comment</button>
              <button onclick="addTooltip()">Add Tooltip</button>
            </div>
            <button onclick="saveCloseReading('${id}')">Save Close Reading</button>
  
            <script>
              function addTag() {
                // Add tagging functionality here
                alert('Tagging functionality not implemented yet.');
              }
  
              function addComment() {
                // Add commenting functionality here
                alert('Commenting functionality not implemented yet.');
              }
  
              function addTooltip() {
                // Add tooltip functionality here
                alert('Tooltip functionality not implemented yet.');
                     function saveCloseReading(entryId) {
          const closeReadingText = document.getElementById('closeReadingText').value;

          if (closeReadingText.trim() === '') {
            alert('Close reading text cannot be empty!');
            return;
          }

          const openerEntries = JSON.parse(opener.localStorage.getItem('entries')) || [];
          const entryIndex = openerEntries.findIndex(entry => entry.id === entryId);

          if (entryIndex !== -1) {
            openerEntries[entryIndex].closeReading = closeReadingText;
            opener.localStorage.setItem('entries', JSON.stringify(openerEntries));
            opener.loadEntries(); // Reload the entries in the main window
            window.close(); // Close the close reading window
          } else {
            alert('Error: Entry not found!');
          }
        }
      </script>
    </body>
  </html>
`);
}; });