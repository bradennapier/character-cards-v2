# Character Card V2 TypeScript Interfaces

This repository provides a collection of TypeScript interfaces designed for building and validating Character Card V2 objects. These interfaces encapsulate the entire schema needed for AI roleplaying character cards—from core character details and embedded lore to system-level instructions and custom metadata.

Using these interfaces offers the following benefits:

- **Consistency:** Define character cards with a well-structured, standardized schema.
- **Extensibility:** Easily extend core functionality with custom metadata using the Extensions interface.
- **Rich Documentation:** Inline TSDoc comments provide detailed guidance and examples for each property.
- **Type Safety:** Improve development experience with strict type checking, ensuring that character cards conform to the Character Card V2 specification.

## Table of Contents

- [Files Overview](#files-overview)
  - [character-book.ts](#character-bookts)
  - [character-data.ts](#character-datats)
  - [entry.ts](#entryts)
  - [extensions.ts](#extensionsts)
  - [system-prompt.ts](#system-promptts)
  - [index.ts](#indexts)
- [Contributing](#contributing)
- [License](#license)

## Usage

Import the interfaces into your project to create, validate, or manipulate Character Card V2 objects. For example, you might import the complete set of interfaces from the index file:

```typescript
import { CharacterCardV2 } from './index';

// Example: Create a new character card
const myCharacter: CharacterCardV2 = {
  spec: "chara_card_v2",
  spec_version: "2.0",
  data: {
    name: "Queen Seraphina",
    description: "A wise and regal leader of Aetheria.",
    personality: "Authoritative, compassionate, and strategic.",
    scenario: "In the royal palace during a pivotal council meeting.",
    first_mes: "Greetings, loyal subject. I am Queen Seraphina.",
    mes_example: "<START>\n{{user}}: What is your decree?\n{{char}}: Unity and strength shall guide us.",
    creator_notes: "Designed for inspiring leadership and deep roleplay.",
    system_prompt: "{{original}}\nYou are Queen Seraphina, speak formally.",
    post_history_instructions: "Maintain decorum and authority. {{original}}",
    alternate_greetings: [
      "Welcome to the court, I am Queen Seraphina.",
      "Hail, loyal subject. I am your queen."
    ],
    tags: ["royalty", "Aetheria", "leader"],
    creator: "ElyndriaTales",
    character_version: "1.0",
    extensions: { theme_color: "#D4AF37" },
    character_book: {
      name: "Royal Annals",
      description: "Historical lore of the royal lineage.",
      scan_depth: 50,
      token_budget: 300,
      recursive_scanning: false,
      extensions: {},
      entries: []
    }
  }
};
```

## Files Overview

### [character-book.ts](./character-book.ts)

Provides the **`CharacterBook`** interface. This interface is used for embedding a lorebook into a character card. It allows you to package background lore and dynamic lore entries (see [entry.ts](./entry.ts)) that enrich the character's narrative during roleplay.

**Key Benefits:**
- Organizes and encapsulates lore data.
- Enhances context for AI responses by providing dynamic lore based on conversation triggers.

### [character-data.ts](./character-data.ts)

Defines the **`CharacterData`** interface. This file contains all core character properties (e.g., name, description, personality) as well as advanced fields like system prompts, alternate greetings, and an optional lorebook.

**Key Benefits:**
- Centralizes all character-specific information.
- Ensures rich, descriptive context for robust AI roleplay experiences.

### [entry.ts](./entry.ts)

Contains the **`Entry`** interface, which defines individual lore entries for a character's lorebook. Each entry includes trigger keywords, lore content, and optional settings (such as priority and insertion order).

**Key Benefits:**
- Provides granular control over lore injection based on conversation context.
- Facilitates dynamic background detail integration when specific keywords are detected.

### [extensions.ts](./extensions.ts)

Exports the **`Extensions`** interface. This interface serves as a flexible container for custom metadata and additional properties not covered by the standard spec.

**Key Benefits:**
- Offers a safe space for storing extra information without breaking compatibility.
- Supports future-proofing and extensibility for your character cards.

### [system-prompt.ts](./system-prompt.ts)

Defines the **`SystemPromptConfig`** interface, which handles system-level instructions such as custom system prompts and post-history instructions. These settings guide the AI's behavior at critical points in the conversation.

**Key Benefits:**
- Enables fine-tuning of the AI's initial and ongoing behavior.
- Allows creators to override default system prompts with character-specific instructions.

### [index.ts](./index.ts)

The main entry point that consolidates and re-exports all the interfaces. Use this file to import the entire Character Card V2 schema into your project.

**Key Benefits:**
- Simplifies imports by aggregating all interfaces.
- Provides a single source of truth for the entire Character Card V2 specification.
