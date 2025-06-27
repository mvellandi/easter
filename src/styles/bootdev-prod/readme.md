These files are meant only for production.
Since Vite clears all contents of the 'docs' directory on build, we need to copy the necessary files manually.
Reason: asset paths in development resolve differently than in production
Example:

Development
```css
/* src/styles/bootdev/backgrounds.css */
background-image: url(./assets/img/maptexture2.webp)
```
Production
```css
/* docs/styles/bootdev-prod/backgrounds.css */
background-image: url(../assets/maptexture2.webp),
```

If any changes are made to the development files, make the appropriate changes to these files as well.