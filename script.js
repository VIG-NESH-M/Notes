/**
 * Notes App JavaScript
 * A simple note-taking application with local storage persistence
 */

class NotesApp {
    constructor() {
        // DOM elements
        this.createCountEl = document.querySelector('.created-count');
        this.deleteCountEl = document.querySelector('.deleted-count');
        this.notesBox = document.getElementById('notes-box');
        this.createBtn = document.querySelector('.create-btn');
        
        // State
        this.createCount = 0;
        this.deleteCount = 0;
        
        // Storage keys
        this.STORAGE_KEYS = {
            NOTES: 'notes-app-notes',
            CREATE_COUNT: 'notes-app-create-count',
            DELETE_COUNT: 'notes-app-delete-count'
        };
        
        this.init();
    }
    
    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.updateCounters();
        this.renderNotes();
    }
    
    /**
     * Load data from localStorage with error handling
     */
    loadFromStorage() {
        try {
            // Load counts
            const savedCreateCount = localStorage.getItem(this.STORAGE_KEYS.CREATE_COUNT);
            const savedDeleteCount = localStorage.getItem(this.STORAGE_KEYS.DELETE_COUNT);
            
            this.createCount = savedCreateCount ? parseInt(savedCreateCount, 10) : 0;
            this.deleteCount = savedDeleteCount ? parseInt(savedDeleteCount, 10) : 0;
            
            // Validate counts
            if (isNaN(this.createCount) || this.createCount < 0) {
                this.createCount = 0;
            }
            if (isNaN(this.deleteCount) || this.deleteCount < 0) {
                this.deleteCount = 0;
            }
            
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            this.createCount = 0;
            this.deleteCount = 0;
        }
    }
    
    /**
     * Save data to localStorage with error handling
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.CREATE_COUNT, this.createCount.toString());
            localStorage.setItem(this.STORAGE_KEYS.DELETE_COUNT, this.deleteCount.toString());
            localStorage.setItem(this.STORAGE_KEYS.NOTES, this.notesBox.innerHTML);
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            this.showError('Failed to save notes. Please check your browser storage settings.');
        }
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Create note button
        if (this.createBtn) {
            this.createBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.createNote();
            });
        }
        
        // Note interactions (using event delegation)
        this.notesBox.addEventListener('click', this.handleNoteClick.bind(this));
        this.notesBox.addEventListener('keyup', this.handleNoteKeyup.bind(this));
        this.notesBox.addEventListener('input', this.handleNoteInput.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Auto-save on page unload
        window.addEventListener('beforeunload', this.saveToStorage.bind(this));
    }
    
    /**
     * Handle note clicks (for deletion)
     */
    handleNoteClick(event) {
        if (event.target.classList.contains('delete-btn')) {
            event.preventDefault();
            this.deleteNote(event.target.closest('.note'));
        }
    }
    
    /**
     * Handle note input for auto-save
     */
    handleNoteInput(event) {
        if (event.target.classList.contains('note-content')) {
            // Debounce the save operation
            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                this.saveToStorage();
            }, 500);
        }
    }
    
    /**
     * Handle keyboard events
     */
    handleNoteKeyup(event) {
        if (event.target.classList.contains('note-content')) {
            this.handleNoteInput(event);
        }
    }
    
    /**
     * Handle global keyboard shortcuts
     */
    handleKeyboard(event) {
        // Ctrl+N or Cmd+N to create new note
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            this.createNote();
        }
        
        // Escape to blur focused note
        if (event.key === 'Escape') {
            if (document.activeElement && document.activeElement.classList.contains('note-content')) {
                document.activeElement.blur();
            }
        }
    }
    
    /**
     * Create a new note
     */
    createNote() {
        this.createCount++;
        
        // Create note wrapper (not contenteditable)
        const noteWrapper = document.createElement('div');
        noteWrapper.className = 'note';
        noteWrapper.setAttribute('role', 'textbox');
        noteWrapper.setAttribute('aria-label', `Note ${this.createCount}`);
        noteWrapper.setAttribute('tabindex', '0');
        
        // Create content area (contenteditable)
        const noteContent = document.createElement('div');
        noteContent.className = 'note-content';
        noteContent.setAttribute('contenteditable', 'true');
        noteContent.setAttribute('data-placeholder', 'Start typing your note...');
        
        // Create delete button
        const deleteBtn = document.createElement('img');
        deleteBtn.src = 'dltpng.png';
        deleteBtn.className = 'delete-btn';
        deleteBtn.alt = 'Delete note';
        deleteBtn.setAttribute('role', 'button');
        deleteBtn.setAttribute('tabindex', '0');
        deleteBtn.setAttribute('aria-label', 'Delete this note');
        
        // Handle delete button keyboard interaction
        deleteBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.deleteNote(noteWrapper);
            }
        });
        
        // Handle delete button errors (fallback to text button)
        deleteBtn.addEventListener('error', () => {
            const textBtn = document.createElement('button');
            textBtn.textContent = '×';
            textBtn.className = 'delete-btn delete-btn-text';
            textBtn.setAttribute('aria-label', 'Delete this note');
            textBtn.addEventListener('click', () => this.deleteNote(noteWrapper));
            deleteBtn.parentNode.replaceChild(textBtn, deleteBtn);
        });
        
        noteWrapper.appendChild(noteContent);
        noteWrapper.appendChild(deleteBtn);
        this.notesBox.appendChild(noteWrapper);
        
        // Focus the content area for immediate editing
        noteContent.focus();
        
        this.updateCounters();
        this.saveToStorage();
    }
    
    /**
     * Delete a note
     */
    deleteNote(noteElement) {
        if (!noteElement || !noteElement.parentNode) {
            return;
        }
        
        // Confirm deletion for non-empty notes
        const noteContent = noteElement.textContent.trim();
        if (noteContent && !confirm('Are you sure you want to delete this note?')) {
            return;
        }
        
        this.deleteCount++;
        this.createCount = Math.max(0, this.createCount - 1);
        
        // Remove with animation
        noteElement.style.transition = 'all 0.3s ease';
        noteElement.style.transform = 'translateX(100%)';
        noteElement.style.opacity = '0';
        
        setTimeout(() => {
            if (noteElement.parentNode) {
                noteElement.parentNode.removeChild(noteElement);
            }
            this.updateCounters();
            this.saveToStorage();
        }, 300);
    }
    
    /**
     * Update counter displays
     */
    updateCounters() {
        if (this.createCountEl) {
            this.createCountEl.textContent = this.createCount;
            this.createCountEl.setAttribute('aria-label', `${this.createCount} notes created`);
        }
        
        if (this.deleteCountEl) {
            this.deleteCountEl.textContent = this.deleteCount;
            this.deleteCountEl.setAttribute('aria-label', `${this.deleteCount} notes deleted`);
        }
    }
    
    /**
     * Render notes from storage
     */
    renderNotes() {
        try {
            const savedNotes = localStorage.getItem(this.STORAGE_KEYS.NOTES);
            if (savedNotes) {
                this.notesBox.innerHTML = savedNotes;
                
                // Re-bind events for restored notes
                const deleteButtons = this.notesBox.querySelectorAll('.delete-btn');
                deleteButtons.forEach(btn => {
                    // Remove existing listeners by cloning
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);
                    
                    // Add new listeners
                    newBtn.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            this.deleteNote(newBtn.closest('.note'));
                        }
                    });
                    
                    // Handle image load errors for restored notes
                    if (newBtn.tagName === 'IMG') {
                        newBtn.addEventListener('error', () => {
                            const textBtn = document.createElement('button');
                            textBtn.textContent = '×';
                            textBtn.className = 'delete-btn delete-btn-text';
                            textBtn.setAttribute('aria-label', 'Delete this note');
                            textBtn.addEventListener('click', () => this.deleteNote(textBtn.closest('.note')));
                            newBtn.parentNode.replaceChild(textBtn, newBtn);
                        });
                    }
                });
                
                // Ensure proper attributes for restored notes
                const notes = this.notesBox.querySelectorAll('.note');
                notes.forEach((note, index) => {
                    if (!note.hasAttribute('role')) {
                        note.setAttribute('role', 'textbox');
                        note.setAttribute('aria-label', `Note ${index + 1}`);
                        note.setAttribute('tabindex', '0');
                    }
                    
                    // Ensure note-content has proper attributes
                    const noteContent = note.querySelector('.note-content');
                    if (noteContent && !noteContent.hasAttribute('contenteditable')) {
                        noteContent.setAttribute('contenteditable', 'true');
                        noteContent.setAttribute('data-placeholder', 'Start typing your note...');
                    }
                });
            }
        } catch (error) {
            console.warn('Failed to render saved notes:', error);
        }
    }
    
    /**
     * Show error message to user
     */
    showError(message) {
        // Create a simple error display
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #cc3300;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 1000;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    /**
     * Export notes as JSON
     */
    exportNotes() {
        const notes = Array.from(this.notesBox.querySelectorAll('.note')).map(note => {
            const noteContent = note.querySelector('.note-content');
            return noteContent ? noteContent.textContent.trim() : '';
        }).filter(content => content.length > 0);
        
        const data = {
            notes,
            createCount: this.createCount,
            deleteCount: this.deleteCount,
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(data, null, 2);
    }
    
    /**
     * Clear all notes
     */
    clearAllNotes() {
        if (confirm('Are you sure you want to delete all notes? This action cannot be undone.')) {
            this.notesBox.innerHTML = '';
            this.createCount = 0;
            this.deleteCount = 0;
            this.updateCounters();
            this.saveToStorage();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.notesApp = new NotesApp();
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotesApp;
}