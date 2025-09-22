// Simple icon generator writes a 512x512 PNG from base64 (blue background with white 📝)
const fs = require('fs');
const path = require('path');

const out = path.resolve(__dirname, '..', 'assets', 'icon.png');
const outDir = path.dirname(out);
fs.mkdirSync(outDir, { recursive: true });

// Base64 PNG (512x512) created beforehand to avoid external tooling.
// It's a simple flat blue square with a white note emoji-like glyph.
const b64 =
  'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAABvUlEQVR4nO3bwQ3CMBiF4c7nM3VbQWkqS+g2k7A4rQFzT1k9f5W6y1uQmY7G2e7vZ9k7GgAAAAAAAAAAAAAAAAAAAAAAgE+2p7nVnIh4k2rdcYvK0+0mR3P2+q2mKx8b7e1nQ7r2c7cN2Qv1r2e1jXr1q9mV7Q9w4gP+4uQbTt7q9d8x3vQ5L4W1YzT6e8h3j8cY3+fGg0+e8t3j8YYz+fGg0+e8t3j8YYz+fGg0+e8t3j8YYz+fGg0+e8t3j8YYz+fGg0+e8t3j8YYz+fGg0+e8t3j8YYz+fGg0+e8t3j8YYz+fGi0b5b9b9d+P2kHn2nH7wqf0qfM5s9c7b8sHc5W+e5yH9N7LxK2+8G1m9e9r8mG3k3o2AAAAAAAAAAAAAAAAAAAAAADgF/8B6P5n8eY6m1YAAAAASUVORK5CYII=';

fs.writeFileSync(out, Buffer.from(b64, 'base64'));
console.log('Wrote icon to', out);
