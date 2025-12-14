# Stargazer

## 🏜️About The Project

See sky directions for the planets in our solar system in real time! 🔭✨

More planets and stars coming in future updates!

## 🏝️Technical Overview

### Built With

- **Vite**, **React 18**, **TypeScript**
- **Tailwind CSS 4.0** – Just to make styling easier sometimes.
- **Astronomy Engine** – Calculates planet positions.
- **Three.js** – Draws the star map (displayed as 2D in a 3D scene).
- **Pixi React v7** & **PixiJS v7** – Predraws the compass for the star map.
- **React Compiler** – Optimizes performance and reduces code structuring overhead.
- **GitHub Pages** – Hosted on GitHub Pages.

### Component Structure

```html
<App>
  <Sector0_Navbar/>
  <Main>
    <Sector1_Observer/>
    <Sector2_StarMap/>
    <Sector3_StarLocations/>
  </Main>
  <Sector4_Footer/>
</App>
```
