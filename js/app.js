(() => {
  "use strict";

  const locations = window.EQUINOX_LOCATIONS || [];
  const postals = window.EQUINOX_POSTALS || [];

  function findNearestPostal(x, y) {
    if (!postals.length) return null;

    let nearest = null;
    let nearestDistanceSquared = Infinity;

    for (const postal of postals) {
      const dx = postal.x - x;
      const dy = postal.y - y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared < nearestDistanceSquared) {
        nearest = postal;
        nearestDistanceSquared = distanceSquared;
      }
    }

    return nearest;
  }

  locations.forEach((location) => {
    if (!location.postal) {
      const nearest = findNearestPostal(location.x, location.y);
      location.postal = nearest?.code || "—";
    }
  });

  const CATEGORY_META = {
    "law-enforcement": {
      label: "Police",
      icon: "shield"
    },
    government: {
      label: "Government",
      icon: "building"
    },
    medical: {
      label: "Medical",
      icon: "medical"
    },
    mechanic: {
      label: "Mechanics",
      icon: "wrench"
    },
    food: {
      label: "Food & Drink",
      icon: "store"
    },
    "smoke-shop": {
      label: "Smoke Shop",
      icon: "store"
    },
    dealership: {
      label: "Dealerships",
      icon: "car"
    },
    "public": {
      label: "Public",
      icon: "map"
    },
    "jobs": {
      label: "Public Jobs",
      icon: "hammer"
    },
    postal: {
      label: "Postal",
      icon: "pin"
    },
    other: {
      label: "Other",
      icon: "pin"
    }
  };

  const DISPLAY_MAX_ZOOM = 8;

  const TILE_LAYERS = {
    atlas: {
      label: "Atlas",
      url: "https://raw.githubusercontent.com/Trusted-Studios/mapStyles/main/styleAtlas/{z}/{x}/{y}.jpg",
      minZoom: 0,
      nativeMaxZoom: 5
    },
    satellite: {
      label: "Satellite",
      url: "https://raw.githubusercontent.com/Trusted-Studios/mapStyles/main/styleSatelite/{z}/{x}/{y}.jpg",
      minZoom: 0,
      nativeMaxZoom: 8
    },
    grid: {
      label: "Grid",
      url: "https://raw.githubusercontent.com/Trusted-Studios/mapStyles/main/styleGrid/{z}/{x}/{y}.png",
      minZoom: 0,
      nativeMaxZoom: 5
    }
  };

  const DEFAULT_VIEW = {
    center: [0, 0],
    zoom: 3
  };

  const GTA_CRS = Object.assign({}, L.CRS.Simple, {
    projection: L.Projection.LonLat,

    scale(zoom) {
      return Math.pow(2, zoom);
    },

    zoom(scale) {
      return Math.log(scale) / Math.LN2;
    },

    distance(a, b) {
      return Math.hypot(b.lng - a.lng, b.lat - a.lat);
    },

    transformation: new L.Transformation(
      0.02072,
      117.3,
      -0.0205,
      172.8
    ),

    infinite: true
  });

  const map = L.map("map", {
    crs: GTA_CRS,
    center: DEFAULT_VIEW.center,
    zoom: DEFAULT_VIEW.zoom,
    minZoom: 1,
    maxZoom: DISPLAY_MAX_ZOOM,
    maxBounds: L.latLngBounds(
      L.latLng(-4000, -5500),
      L.latLng(8000, 6000)
    ),
    maxBoundsViscosity: 1,
    zoomControl: false,
    attributionControl: false,
    preferCanvas: true
  });

  L.control.zoom({
    position: "bottomright"
  }).addTo(map);

  map.getContainer().style.background = "#0c2735";

  const loadedLayers = {};
  let activeLayerName = "atlas";

  function buildTileLayer(name) {
    if (loadedLayers[name]) return loadedLayers[name];

    const config = TILE_LAYERS[name];

    loadedLayers[name] = L.tileLayer(config.url, {
      minZoom: config.minZoom,
      maxZoom: DISPLAY_MAX_ZOOM,
      maxNativeZoom: config.nativeMaxZoom,
      noWrap: true,
      keepBuffer: 3,
      updateWhenIdle: true
    });

    return loadedLayers[name];
  }

  let activeTileLayer = buildTileLayer(activeLayerName).addTo(map);

  const SVG_ICONS = {
    shield: `
      <svg viewBox="0 0 24 24">
        <path d="M12 3 5 6v5c0 4.7 2.9 8.2 7 10 4.1-1.8 7-5.3 7-10V6l-7-3Z"></path>
        <path d="M9.5 12.2 11 13.7l3.6-3.6"></path>
      </svg>
    `,
    building: `
      <svg viewBox="0 0 24 24">
        <path d="M4 9h16"></path>
        <path d="M5 9v9M9 9v9M15 9v9M19 9v9"></path>
        <path d="M3 20h18"></path>
        <path d="m12 3 8 4H4l8-4Z"></path>
      </svg>
    `,
    medical: `
      <svg viewBox="0 0 24 24">
        <path d="M9 4h6v5h5v6h-5v5H9v-5H4V9h5V4Z"></path>
      </svg>
    `,
    wrench: `
      <svg viewBox="0 0 24 24">
        <path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4l-3 3-3-3 3-3Z"></path>
      </svg>
    `,
    store: `
      <svg viewBox="0 0 24 24">
        <path d="M4 9h16l-1-5H5L4 9Z"></path>
        <path d="M5 9v11h14V9"></path>
        <path d="M9 20v-6h6v6"></path>
        <path d="M4 9c0 2 3 2 4 0 1 2 3 2 4 0 1 2 3 2 4 0 1 2 4 2 4 0"></path>
      </svg>
    `,
    car: `
      <svg viewBox="0 0 24 24">
        <path d="m5 11 2-5h10l2 5"></path>
        <path d="M4 11h16v7H4z"></path>
        <circle cx="7" cy="18" r="1.5"></circle>
        <circle cx="17" cy="18" r="1.5"></circle>
        <path d="M7 14h.01M17 14h.01"></path>
      </svg>
    `,
    map: `
      <svg viewBox="0 0 24 24">
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"></path>
        <path d="M9 3v15M15 6v15"></path>
      </svg>
    `,
    hammer: `
      <svg viewBox="0 0 24 24">
        <path d="m14 5 5 5"></path>
        <path d="m12 7 5 5"></path>
        <path d="m15.5 10.5-8.8 8.8a2.1 2.1 0 0 1-3-3l8.8-8.8"></path>
        <path d="M13 4 9 8"></path>
      </svg>
    `,
    lock: `
      <svg viewBox="0 0 24 24">
        <rect x="5" y="10" width="14" height="10" rx="2"></rect>
        <path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
        <path d="M12 14v2"></path>
      </svg>
    `,

    coffee: `
      <svg viewBox="0 0 24 24">
        <path d="M5 8h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z"></path>
        <path d="M16 10h2a3 3 0 0 1 0 6h-2"></path>
        <path d="M8 4v2M12 3v3M15 4v2"></path>
      </svg>
    `,
    burger: `
      <svg viewBox="0 0 24 24">
        <path d="M5 10h14"></path>
        <path d="M4 14h16"></path>
        <path d="M6 18h12"></path>
        <path d="M5 10a7 5 0 0 1 14 0"></path>
        <path d="M5 14c1 1 2 1 3 0 1 1 2 1 3 0 1 1 2 1 3 0 1 1 2 1 3 0"></path>
      </svg>
    `,
    smoke: `
      <svg viewBox="0 0 24 24">
        <path d="M4 15h10v3H4z"></path>
        <path d="M14 15h3v3h-3"></path>
        <path d="M18 9c2 0 2-3 0-3"></path>
        <path d="M15 12c3 0 4-5 1-6"></path>
      </svg>
    `,
    gavel: `
      <svg viewBox="0 0 24 24">
        <path d="m14 5 5 5"></path>
        <path d="m12 7 5 5"></path>
        <path d="m4 20 8-8"></path>
        <path d="m3 21 3-3"></path>
        <path d="M13 4 9 8"></path>
      </svg>
    `,
    prison: `
      <svg viewBox="0 0 24 24">
        <rect x="4" y="3" width="16" height="18" rx="1"></rect>
        <path d="M8 3v18M12 3v18M16 3v18"></path>
        <path d="M4 9h16M4 15h16"></path>
      </svg>
    `,
    plane: `
      <svg viewBox="0 0 24 24">
        <path d="M22 16 13 12V5a2 2 0 0 0-4 0v7l-7 4v2l7-2v3l-2 2v1l4-1 4 1v-1l-2-2v-3l9 2v-2Z"></path>
      </svg>
    `,
    boat: `
      <svg viewBox="0 0 24 24">
        <path d="M4 13h16l-3 6H7l-3-6Z"></path>
        <path d="M8 13V6h7l3 7"></path>
        <path d="M2 21c2 1 4 1 6 0 2 1 4 1 6 0 2 1 4 1 6 0"></path>
      </svg>
    `,
    truck: `
      <svg viewBox="0 0 24 24">
        <path d="M3 6h11v10H3z"></path>
        <path d="M14 10h4l3 3v3h-7z"></path>
        <circle cx="7" cy="18" r="2"></circle>
        <circle cx="18" cy="18" r="2"></circle>
      </svg>
    `,
    casino: `
      <svg viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="3"></rect>
        <circle cx="8" cy="8" r="1"></circle>
        <circle cx="16" cy="8" r="1"></circle>
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="8" cy="16" r="1"></circle>
        <circle cx="16" cy="16" r="1"></circle>
      </svg>
    `,
    power: `
      <svg viewBox="0 0 24 24">
        <path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z"></path>
      </svg>
    `,
    grocery: `
      <svg viewBox="0 0 24 24">
        <path d="M4 5h2l2 10h9l2-7H7"></path>
        <circle cx="10" cy="19" r="1.5"></circle>
        <circle cx="17" cy="19" r="1.5"></circle>
      </svg>
    `,
    scissors: `
      <svg viewBox="0 0 24 24">
        <circle cx="6" cy="7" r="3"></circle>
        <circle cx="6" cy="17" r="3"></circle>
        <path d="m8.5 8.5 11 8.5"></path>
        <path d="m8.5 15.5 11-8.5"></path>
      </svg>
    `,
    tools: `
      <svg viewBox="0 0 24 24">
        <path d="M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-3-3 2.5-2.5Z"></path>
      </svg>
    `,
    pin: `
      <svg viewBox="0 0 24 24">
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path>
        <circle cx="12" cy="10" r="2.5"></circle>
      </svg>
    `,
    house: `
    <svg viewBox="0 0 24 24">
      <path d="M3 11 12 3l9 8"></path>
      <path d="M5 10v10h14V10"></path>
      <path d="M9 20v-6h6v6"></path>
    </svg>
   `
  };

  function getCategoryMeta(category) {
    return CATEGORY_META[category] || CATEGORY_META.other;
  }

  function getIconMarkup(iconName) {
    return SVG_ICONS[iconName] || SVG_ICONS.pin;
  }

  function getLocationIconName(location) {
    if (location?.icon && SVG_ICONS[location.icon]) {
      return location.icon;
    }

    return getCategoryMeta(location?.category).icon;
  }

  function getLocationIconMarkup(location) {
    return getIconMarkup(getLocationIconName(location));
  }

  function createMarkerIcon(location) {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="marker-pin category-${location.category}">
          ${getLocationIconMarkup(location)}
        </div>
      `,
      iconSize: [34, 42],
      iconAnchor: [17, 36],
      popupAnchor: [0, -34]
    });
  }

  const markerById = new Map();
  let postalIndicator = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function createPopup(location) {
    const safeName = escapeHtml(location.name);
    const safeSubtitle = escapeHtml(location.subtitle || location.categoryLabel);
    const safeCategory = escapeHtml(location.categoryLabel || getCategoryMeta(location.category).label);
    const safePostal = escapeHtml(location.postal || "—");
    const safeDescription = escapeHtml(location.description || "");

    const action =
      location.link && location.link !== "#"
        ? `
          <div class="popup-actions">
            <a href="${escapeHtml(location.link)}" target="_top" rel="noopener">
              View Information
            </a>
          </div>
        `
        : "";

    return `
      <div class="location-popup">
        <div class="popup-header">
          <div class="popup-icon category-${location.category}">
            ${getLocationIconMarkup(location)}
          </div>
          <div class="popup-title">
            <strong>${safeName}</strong>
            <span>${safeSubtitle}</span>
          </div>
        </div>

        <div class="popup-body">
          <div class="popup-meta">
            <span>${safeCategory}</span>
            <span>Postal ${safePostal}</span>
          </div>

          <p>${safeDescription}</p>
          ${action}
        </div>
      </div>
    `;
  }

  locations.forEach((location) => {
    const marker = L.marker([location.y, location.x], {
      icon: createMarkerIcon(location),
      title: location.name,
      riseOnHover: true
    })
      .bindPopup(createPopup(location), {
        maxWidth: 330,
        minWidth: 300,
        closeButton: true,
        offset: [0, -1]
      })
      .addTo(map);

    marker.on("click", () => {
      setSelectedCard(location.id);
    });

    markerById.set(location.id, marker);
  });

  const locationList = document.getElementById("locationList");
  const locationSearch = document.getElementById("locationSearch");
  const resultCount = document.getElementById("resultCount");
  const categoryFilters = document.getElementById("categoryFilters");
  const resetFilters = document.getElementById("resetFilters");

  let activeCategory = "all";
  let searchValue = "";
  let selectedId = null;

  const CATEGORY_ORDER = [
    "law-enforcement",
    "government",
    "medical",
    "mechanic",
    "dealership",
    "food",
    "smoke-shop",
    "public",
    "jobs"
  ];

  function availableCategories() {
    const used = new Set(locations.map((location) => location.category));

    return [
      ...CATEGORY_ORDER.filter((category) => used.has(category)),
      ...[...used].filter((category) => !CATEGORY_ORDER.includes(category))
    ];
  }

  function renderFilters() {
    const categories = availableCategories();

    const buttons = [
      `<button class="filter-chip active" data-category="all" type="button">All</button>`,
      ...categories.map((category) => {
        const meta = getCategoryMeta(category);
        return `
          <button
            class="filter-chip"
            data-category="${escapeHtml(category)}"
            type="button"
          >
            ${escapeHtml(meta.label)}
          </button>
        `;
      })
    ];

    categoryFilters.innerHTML = buttons.join("");

    categoryFilters.querySelectorAll(".filter-chip").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;

        categoryFilters.querySelectorAll(".filter-chip").forEach((chip) => {
          chip.classList.toggle("active", chip === button);
        });

        renderLocations();
      });
    });
  }

  function locationMatches(location) {
    const categoryMatches =
      activeCategory === "all" || location.category === activeCategory;

    if (!categoryMatches) return false;

    const query = searchValue.trim().toLowerCase();

    if (!query) return true;

    const haystack = [
      location.name,
      location.subtitle,
      location.categoryLabel,
      location.postal,
      location.description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  }

  function cardTemplate(location) {
    return `
      <button
        class="location-card ${selectedId === location.id ? "selected" : ""}"
        data-location-id="${escapeHtml(location.id)}"
        type="button"
      >
        <span class="location-icon category-${escapeHtml(location.category)}">
          ${getLocationIconMarkup(location)}
        </span>

        <span class="location-info">
          <strong>${escapeHtml(location.name)}</strong>
          <span>${escapeHtml(location.subtitle || location.categoryLabel)}</span>
        </span>

        <span class="postal-pill">${escapeHtml(location.postal || "—")}</span>
      </button>
    `;
  }

  function findPostalMatches(query) {
    const clean = query.trim().toLowerCase();

    if (!clean) return [];

    return postals
      .filter((postal) => String(postal.code).toLowerCase().includes(clean))
      .slice(0, 8);
  }

  function postalCardTemplate(postal) {
    return `
      <button
        class="location-card postal-card"
        data-postal-code="${escapeHtml(postal.code)}"
        type="button"
      >
        <span class="location-icon category-postal">
          ${getIconMarkup(getCategoryMeta("postal").icon)}
        </span>

        <span class="location-info">
          <strong>Postal ${escapeHtml(postal.code)}</strong>
          <span>Map Postal</span>
        </span>

        <span class="postal-pill">GO</span>
      </button>
    `;
  }

  function focusPostal(code) {
    const postal = postals.find((item) => String(item.code) === String(code));
    if (!postal) return;

    if (postalIndicator) {
      map.removeLayer(postalIndicator);
    }

    postalIndicator = L.circleMarker([postal.y, postal.x], {
      radius: 11,
      color: "#ffffff",
      weight: 2,
      fillColor: "#5f9cff",
      fillOpacity: 0.9
    })
      .addTo(map)
      .bindPopup(`
        <div class="location-popup">
          <div class="popup-header">
            <div class="popup-icon category-postal">
              ${getIconMarkup(getCategoryMeta("postal").icon)}
            </div>
            <div class="popup-title">
              <strong>Postal ${escapeHtml(postal.code)}</strong>
              <span>San Andreas Postal</span>
            </div>
          </div>
          <div class="popup-body">
            <div class="popup-meta">
              <span>X ${Number(postal.x).toFixed(2)}</span>
              <span>Y ${Number(postal.y).toFixed(2)}</span>
            </div>
            <p>Postal location from the Equinox Roleplay postal system.</p>
          </div>
        </div>
      `, {
        maxWidth: 330,
        minWidth: 300
      });

    map.flyTo([postal.y, postal.x], Math.max(map.getZoom(), 5), {
      duration: 0.7
    });

    window.setTimeout(() => postalIndicator?.openPopup(), 450);
    closeMobileSidebar();
  }

  function renderLocations() {
    const filtered = locations.filter(locationMatches);
    const postalMatches = searchValue.trim() ? findPostalMatches(searchValue) : [];

    const totalResults = filtered.length + postalMatches.length;

    resultCount.textContent = `${totalResults} ${
      totalResults === 1 ? "result" : "results"
    }`;

    if (!totalResults) {
      locationList.innerHTML = `
        <div class="empty-state">
          <strong>No locations found</strong>
          <span>Try another name, category or postal.</span>
        </div>
      `;
      return;
    }

    locationList.innerHTML = [
      ...postalMatches.map(postalCardTemplate),
      ...filtered.map(cardTemplate)
    ].join("");

    locationList.querySelectorAll("[data-location-id]").forEach((card) => {
      card.addEventListener("click", () => {
        focusLocation(card.dataset.locationId);
      });
    });

    locationList.querySelectorAll("[data-postal-code]").forEach((card) => {
      card.addEventListener("click", () => {
        focusPostal(card.dataset.postalCode);
      });
    });
  }

  function setSelectedCard(id) {
    selectedId = id;

    document.querySelectorAll(".location-card").forEach((card) => {
      card.classList.toggle(
        "selected",
        card.dataset.locationId === selectedId
      );
    });
  }

  function focusLocation(id) {
    const location = locations.find((item) => item.id === id);
    const marker = markerById.get(id);

    if (!location || !marker) return;

    selectedId = id;
    renderLocations();

    map.flyTo([location.y, location.x], Math.max(map.getZoom(), 5), {
      duration: 0.7
    });

    window.setTimeout(() => {
      marker.openPopup();
    }, 450);

    closeMobileSidebar();
  }

  locationSearch.addEventListener("input", (event) => {
    searchValue = event.target.value;
    renderLocations();
  });

  resetFilters.addEventListener("click", () => {
    activeCategory = "all";
    searchValue = "";
    locationSearch.value = "";

    categoryFilters.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.category === "all");
    });

    renderLocations();
  });

  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName?.toLowerCase();

    if (
      event.key === "/" &&
      tag !== "input" &&
      tag !== "textarea"
    ) {
      event.preventDefault();
      locationSearch.focus();
    }

    if (event.key === "Escape") {
      locationSearch.blur();
      closeLayerMenu();
      closeMobileSidebar();
    }
  });

  const layerToggle = document.getElementById("layerToggle");
  const layerMenu = document.getElementById("layerMenu");
  const layerLabel = document.getElementById("layerLabel");

  function closeLayerMenu() {
    layerMenu.classList.remove("open");
    layerToggle.setAttribute("aria-expanded", "false");
  }

  layerToggle.addEventListener("click", (event) => {
    event.stopPropagation();

    const open = !layerMenu.classList.contains("open");
    layerMenu.classList.toggle("open", open);
    layerToggle.setAttribute("aria-expanded", String(open));
  });

  layerMenu.querySelectorAll("[data-layer]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextName = button.dataset.layer;

      if (nextName === activeLayerName) {
        closeLayerMenu();
        return;
      }

      const nextLayer = buildTileLayer(nextName);

      map.removeLayer(activeTileLayer);
      nextLayer.addTo(map);

      activeTileLayer = nextLayer;
      activeLayerName = nextName;

      map.setMaxZoom(DISPLAY_MAX_ZOOM);

      layerLabel.textContent = TILE_LAYERS[nextName].label;

      layerMenu.querySelectorAll("[data-layer]").forEach((layerButton) => {
        layerButton.classList.toggle(
          "active",
          layerButton.dataset.layer === nextName
        );
      });

      closeLayerMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!document.getElementById("layerPicker").contains(event.target)) {
      closeLayerMenu();
    }
  });

  document.getElementById("resetView").addEventListener("click", () => {
    map.flyTo(DEFAULT_VIEW.center, DEFAULT_VIEW.zoom, {
      duration: 0.7
    });

    selectedId = null;

    if (postalIndicator) {
      map.removeLayer(postalIndicator);
      postalIndicator = null;
    }

    renderLocations();
    map.closePopup();
  });

  map.on("mousemove", (event) => {
    document.getElementById("coordX").textContent = event.latlng.lng.toFixed(2);
    document.getElementById("coordY").textContent = event.latlng.lat.toFixed(2);
  });

  document.getElementById("dismissHint").addEventListener("click", () => {
    document.getElementById("mapHint").classList.add("hidden");
  });

  // ---------- Mobile Sidebar ----------

  const sidebar = document.getElementById("sidebar");
  const mobileOverlay = document.getElementById("mobileOverlay");

  function openMobileSidebar() {
    sidebar.classList.add("open");
    mobileOverlay.classList.add("open");
  }

  function closeMobileSidebar() {
    sidebar.classList.remove("open");
    mobileOverlay.classList.remove("open");
  }

  document
    .getElementById("openSidebar")
    .addEventListener("click", openMobileSidebar);

  document
    .getElementById("closeSidebar")
    .addEventListener("click", closeMobileSidebar);

  mobileOverlay.addEventListener("click", closeMobileSidebar);

  function applyBranding() {
    const brandMark = document.getElementById("brandMark");
    const logoUrl = window.EQUINOX_MAP_CONFIG?.logoUrl?.trim();

    if (!brandMark || !logoUrl) return;

    const image = document.createElement("img");
    image.src = logoUrl;
    image.alt = "Equinox Roleplay";
    image.decoding = "async";

    image.addEventListener("load", () => {
      brandMark.classList.add("has-logo");
      brandMark.replaceChildren(image);
    });

    image.addEventListener("error", () => {
      brandMark.classList.remove("has-logo");
      brandMark.textContent = "E";
    });
  }

  applyBranding();
  renderFilters();
  renderLocations();

  window.setTimeout(() => {
    map.invalidateSize();
  }, 100);
})();
