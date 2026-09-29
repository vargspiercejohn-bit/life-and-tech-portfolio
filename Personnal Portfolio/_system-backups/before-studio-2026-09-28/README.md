# Before the September studio redesign

This snapshot preserves the HTML, CSS, and JavaScript active on September 28, 2026 before the studio redesign. Artwork and other assets were not modified.

To switch back, run `./restore-previous-ui.ps1` from the project root in PowerShell, or ask Codex to restore the September 28 backup. The script restores the six HTML entry pages, which reconnect to the original styles and scripts still present in the root folder. Use `-WhatIf` to inspect the restoration first.

The new edition uses `studio.css`, `studio-landing.css`, `studio-init.js`, and `studio.js`. The old CSS and JavaScript files are untouched. The change preserves all existing text, images, collection links, and contact details. The new Play/Pause motion control is an interface addition.

Local preview: `http://127.0.0.1:8766/` while the development server is running. Nothing has been deployed to Netlify.
