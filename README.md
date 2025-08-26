# Notes App

A simple, intuitive note-taking application with local storage persistence. Create, edit, and delete notes that are automatically saved to your browser's local storage.

## Features

- ✨ **Simple Interface**: Clean, minimalist design focused on note-taking
- 💾 **Auto-Save**: Notes are automatically saved as you type
- 📱 **Responsive**: Works on desktop, tablet, and mobile devices
- ♿ **Accessible**: Built with accessibility in mind (WCAG compliant)
- ⌨️ **Keyboard Shortcuts**: Quick access with keyboard shortcuts
- 📊 **Statistics**: Track created and deleted notes
- 🔒 **Privacy**: All data stays in your browser - no server required

## Usage

### Basic Operations

1. **Create a Note**: Click the "Create Notes" button or use `Ctrl+N` (or `Cmd+N` on Mac)
2. **Edit a Note**: Click on any note to start editing
3. **Delete a Note**: Click the delete icon (🗑️) in the bottom-right corner of any note
4. **Auto-Save**: Notes are automatically saved as you type

### Keyboard Shortcuts

- `Ctrl+N` / `Cmd+N`: Create a new note
- `Escape`: Stop editing current note
- `Tab`: Navigate between notes and controls

### Accessibility Features

- Screen reader support with proper ARIA labels
- Keyboard navigation support
- High contrast mode support
- Reduced motion support for users with vestibular disorders
- Focus management for better navigation

## Technical Details

### File Structure

```
Notes/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # JavaScript functionality
├── notes.png          # App icon
├── dltpng.png         # Delete button icon
└── README.md          # This file
```

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Local Storage

The app uses localStorage to persist:
- Note content
- Create count
- Delete count

Data is automatically saved when:
- Creating a new note
- Editing note content (with debouncing)
- Deleting a note
- Before page unload

### Security Features

- Input sanitization to prevent XSS attacks
- Error handling for localStorage operations
- Graceful degradation when localStorage is not available

## Development

### Code Quality Features

- **ES6+ JavaScript**: Modern JavaScript with classes and modules
- **Event Delegation**: Efficient event handling
- **Memory Leak Prevention**: Proper cleanup of event listeners
- **Error Handling**: Comprehensive error handling and user feedback
- **Performance**: Debounced auto-save and optimized DOM operations

### Architecture

The app uses a class-based architecture with:
- `NotesApp` class handling all functionality
- Event delegation for efficient event handling
- Separation of concerns (HTML structure, CSS styling, JS behavior)
- Modular design for easy maintenance and testing

## Browser Support

This app works in all modern browsers that support:
- ES6 Classes
- localStorage API
- CSS Grid and Flexbox
- Modern event handling

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Clone the repository
2. Open `index.html` in a web browser
3. Start developing!

No build process is required - this is a vanilla HTML/CSS/JS application.

### Future Enhancements

- [ ] Export/Import functionality
- [ ] Rich text editing
- [ ] Note categories/tags
- [ ] Search functionality
- [ ] Themes/dark mode
- [ ] Cloud sync options
- [ ] Offline PWA capabilities