# Equinox Roleplay — Key Locations Map

This version uses your actual Equinox location data and your full postal dataset.

## What changed

- Added **1,738 Equinox postals**
- Locations automatically calculate their nearest postal
- Searching a postal now gives you a direct **Postal** result
- Added your supplied businesses and services
- Added Mission Row PD and State Police Chumash
- Added both General Crafting locations
- Added the Courthouse
- Added Bolingbroke Penitentiary
- Added Vespucci Medical
- Added dealership locations
- Renamed the old PDM location to **911 Autos**
- Renamed the aircraft dealer to **Pegasus Enterprises**

## Updating the repo

Replace your existing files with the contents of this folder.

New file:

`js/postals.js`

Make sure `index.html` loads scripts in this order:

```html
<script src="./js/postals.js"></script>
<script src="./js/locations.js"></script>
<script src="./js/app.js"></script>
```

## Adding a new key location

Edit:

`js/locations.js`

Example:

```js
{
  id: "my-new-business",
  name: "My New Business",
  category: "business",
  categoryLabel: "Business",
  subtitle: "Player Business",
  x: 123.45,
  y: -678.90,
  description: "Description goes here.",
  link: "#"
}
```

You **do not need to enter a postal**.

The map finds the closest postal from your actual `postals.js` dataset.

## Important note

`Light it Up` and `Bayside` were supplied at the exact same coordinates:

`-1558.68, -438.74`

They are both included as provided. Their map markers will overlap, although both remain accessible from the sidebar/search.

## Dealership positions used

The map uses the dealership `openShowroom` positions from the supplied dealership config.

- 911 Autos — old default PDM showroom
- Luxury Autos
- Boat Dealer
- Pegasus Enterprises — aircraft dealer
- Truck Dealer

## Still temporary

The GTA map tiles are still loaded remotely for this design/testing stage.

Once the map content and appearance are approved, the next step is self-hosting those map tiles before connecting the Equinox domain and Mintlify.
