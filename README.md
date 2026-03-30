# iD Tagging Schema Explorer

A developer-focused tool to explore and understand OpenStreetMap’s iD tagging schema — without digging through hundreds of JSON files.

This tool is a working prototype for the GSoC 2026 idea:
**"Create a Web Application for Tagging Presets"**

**[Live Demo →](https://id-tagging-schema-explorer.vercel.app/)**

## The Problem

The iD editor uses a preset system to help mappers tag features consistently. But understanding this schema is harder than it should be:

- Presets are scattered across multiple JSON files
- Inheritance chains aren't obvious (which preset extends what?)
- Field sources are unclear (is this field inherited or defined here?)
- No easy way to explore relationships between presets

If you've ever tried to contribute to the iD tagging schema or just wanted to understand how a preset works, you know the pain.
The problem isn’t lack of information — it’s lack of visibility.

## What This Does

This tool lets you explore the iD preset schema like you'd explore API documentation:

- **Search presets** – Type "restaurant" and see all restaurant-related presets
- **View details** – See all fields, tags, and metadata for any preset
- **Trace inheritance** – Visual tree showing parent → current → children
- **Understand fields** – Which fields are inherited vs. defined locally
- **Explore relationships** – See which presets share the same parent

It turns raw schema data into something you can actually understand.
Think of it as a schema browser that actually makes sense.

## Why I Built This

While contributing to the id-tagging-schema repository, I found it surprisingly difficult to locate and understand presets across multiple JSON files. Even with experience in OSM tagging, navigating the structure required manual searching and guesswork.

This tool is an attempt to reduce that friction — by making the schema explorable instead of hidden.

## Features

- Fast search with keyboard navigation (arrow keys, enter to select)
- Preset detail panel with tabs (Fields, Inheritance, Relationships)
- Inheritance tree visualization
- Field source tracking (shows where each field comes from)
- Category filtering
- Clean, dev-tool-style interface

## How It Works

The app loads the processed iD tagging schema (presets + fields) and builds an in-memory index with:

1. **Preset parsing** – Resolves inheritance chains, normalizes field references
2. **Field mapping** – Links field definitions to their usage in presets
3. **Relationship graph** – Builds parent-child relationships between presets

Everything runs client-side. No server needed.

## Tech Stack

- **React** – UI components
- **Vite** – Build tool and dev server
- **Tailwind CSS** – Styling
- **Pure JS/TS** – Schema parsing logic

No heavyweight frameworks. Just the essentials.

## Local Setup

```bash
# Clone the repo
# iD Tagging Schema Explorer

A developer-focused tool to explore and understand OpenStreetMap’s iD tagging schema — without digging through hundreds of JSON files.

This tool is a working prototype for the GSoC 2026 idea:
**"Create a Web Application for Tagging Presets"**

**[Live Demo →](https://id-tagging-schema-explorer.vercel.app/)**

## The Problem

The iD editor uses a preset system to help mappers tag features consistently. But understanding this schema is harder than it should be:

- Presets are scattered across multiple JSON files
- Inheritance chains aren't obvious (which preset extends what?)
- Field sources are unclear (is this field inherited or defined here?)
- No easy way to explore relationships between presets

If you've ever tried to contribute to the iD tagging schema or just wanted to understand how a preset works, you know the pain.
The problem isn’t lack of information — it’s lack of visibility.

## What This Does

This tool lets you explore the iD preset schema like you'd explore API documentation:

- **Search presets** – Type "restaurant" and see all restaurant-related presets
- **View details** – See all fields, tags, and metadata for any preset
- **Trace inheritance** – Visual tree showing parent → current → children
- **Understand fields** – Which fields are inherited vs. defined locally
- **Explore relationships** – See which presets share the same parent

It turns raw schema data into something you can actually understand.
Think of it as a schema browser that actually makes sense.

## Why I Built This

While contributing to the id-tagging-schema repository, I found it surprisingly difficult to locate and understand presets across multiple JSON files. Even with experience in OSM tagging, navigating the structure required manual searching and guesswork.

This tool is an attempt to reduce that friction — by making the schema explorable instead of hidden.

## Features

- Fast search with keyboard navigation (arrow keys, enter to select)
- Preset detail panel with tabs (Fields, Inheritance, Relationships)
- Inheritance tree visualization
- Field source tracking (shows where each field comes from)
- Category filtering
- Clean, dev-tool-style interface

## How It Works

The app loads the processed iD tagging schema (presets + fields) and builds an in-memory index with:

1. **Preset parsing** – Resolves inheritance chains, normalizes field references
2. **Field mapping** – Links field definitions to their usage in presets
3. **Relationship graph** – Builds parent-child relationships between presets

Everything runs client-side. No server needed.

## Tech Stack

- **React** – UI components
- **Vite** – Build tool and dev server
- **Tailwind CSS** – Styling
- **Pure JS/TS** – Schema parsing logic

No heavyweight frameworks. Just the essentials.

## Local Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/id-tagging-schema-explorer.git
cd id-tagging-schema-explorer

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` and you're good to go.

## Why This Matters

For OSM contributors working on the iD editor:

- **Faster onboarding** – New contributors can understand the schema structure without diving into raw JSON
- **Better preset design** – See how your changes fit into the existing hierarchy
- **Documentation** – Acts as live documentation for the tagging schema

The iD preset schema is one of the most important parts of the OSM editing experience. Making it easier to understand means better tools for millions of mappers.

## Screenshots

<img width="1917" height="916" alt="image" src="https://github.com/user-attachments/assets/7ee553d3-7cba-4ebe-9c14-eb7ffc20e73f" />


## Current Status

This is a working prototype demonstrating:

- Preset search and exploration
- Inheritance visualization (parent → current → children)
- Field and relationship analysis

Currently uses a structured subset of schema data for faster iteration.

Next step: full integration with the official id-tagging-schema repository.

## License

MIT

---

Built as part of exploring OSM tooling and schema visualization. Feedback welcome.
git clone https://github.com/Ambuj123554/id-tagging-schema-explorer.git
cd id-tagging-schema-explorer

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` and you're good to go.

## Why This Matters

For OSM contributors working on the iD editor:

- **Faster onboarding** – New contributors can understand the schema structure without diving into raw JSON
- **Better preset design** – See how your changes fit into the existing hierarchy
- **Documentation** – Acts as live documentation for the tagging schema

The iD preset schema is one of the most important parts of the OSM editing experience. Making it easier to understand means better tools for millions of mappers.

## Screenshots

<img width="1917" height="916" alt="image" src="https://github.com/user-attachments/assets/7ee553d3-7cba-4ebe-9c14-eb7ffc20e73f" />


## Current Status

This is a working prototype demonstrating:

- Preset search and exploration
- Inheritance visualization (parent → current → children)
- Field and relationship analysis

Currently uses a structured subset of schema data for faster iteration.

Next step: full integration with the official id-tagging-schema repository.

## License

MIT

---

Built as part of exploring OSM tooling and schema visualization. Feedback welcome.
