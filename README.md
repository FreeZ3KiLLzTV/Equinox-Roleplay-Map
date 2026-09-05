# Equinox Roleplay — Key Locations Map

Starter version of the Equinox Roleplay interactive San Andreas map.

This first version is intentionally simple:

- Plain HTML / CSS / JavaScript
- No npm
- No build process
- Leaflet interactive map
- GTA/FiveM coordinates
- Search
- Category filters
- Layer selector
- Location sidebar
- Custom map markers
- Responsive/mobile layout

## Previewing it

### Option 1 — GitHub Pages

1. Put all of these files in the root of your empty repository.
2. Commit and push them.
3. Open the repository on GitHub.
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select:
   - Branch: `main`
   - Folder: `/ (root)`
7. Save.

GitHub will give you a URL similar to:

`https://YOUR-USERNAME.github.io/YOUR-REPO/`

### Option 2 — VS Code

If you use the Live Server extension:

1. Open this repository in VS Code.
2. Right-click `index.html`.
3. Click **Open with Live Server**.

## Editing locations

Open:

`js/locations.js`

A location looks like:

```js
{
  id: "mission-row-pd",
  name: "Mission Row Police Department",
  category: "law-enforcement",
  categoryLabel: "Law Enforcement",
  subtitle: "Los Santos Police Department",
  postal: "125",
  x: 425.13,
  y: -979.55,
  description: "Primary police headquarters.",
  link: "#"
}
```

Use normal FiveM coordinates.

The map code automatically converts:

`X, Y`

into Leaflet:

`[Y, X]`

## Categories included

- `law-enforcement`
- `government`
- `medical`
- `mechanic`
- `business`
- `dealership`
- `public-service`
- `other`

## Important — current map tiles are temporary

For the first visual preview, the map loads GTA map tiles remotely from:

`Trusted-Studios/mapStyles`

That keeps this starter repository very small.

Do not treat that external dependency as the finished production setup.

Once the UI is approved, the next step is to place/self-host the GTA map tiles in this repository or another Equinox-controlled location and change the URLs in:

`js/app.js`

## Next phase after design approval

1. Replace demo locations with Equinox locations.
2. Add your actual postals.
3. Add department/business branding.
4. Self-host GTA map tiles.
5. Host the map.
6. Connect the Equinox map subdomain.
7. Embed it into the Mintlify documentation.
