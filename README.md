# Character Card Spec V2 Documentation

This documentation covers the **Character Card Specification V2**, an updated format for AI character cards building upon the earlier Tavern Card V1 format. Character Card V2 introduces new fields (such as a dedicated system prompt, post-history instructions, alternate greetings, and an embedded character-specific lorebook) to give bot creators more control and flexibility. These additions allow creators to set default system instructions, provide multiple greeting messages, attach character lore in the card, and include out-of-character notes for users.

The V2 format remains largely compatible with V1: all original fields from V1 are still present (now nested under a `data` object) and behave as before, ensuring that existing characters can be supported. New fields are optional enhancements that creators can choose to utilize to enrich their character cards.

**Top-Level Structure:** A V2 character card is a JSON object with the following structure:

```json
{
  "spec": "chara_card_v2",
  "spec_version": "2.0",
  "data": {
     ... fields as described in this documentation ...
  }
}
```

- **spec** – identifies the format as Character Card V2 (must be `"chara_card_v2"`).
- **spec_version** – the version number of the spec (for V2, this must be `"2.0"` ([character-card-spec-v2/spec_v2.md at main · malfoyslastname/character-card-spec-v2 · GitHub](https://github.com/malfoyslastname/character-card-spec-v2/blob/main/spec_v2.md#:~:text=))).
- **data** – an object containing all character fields (name, description, personality, etc., including the new V2 fields).

Below is a table of contents for the major sections of this documentation. Each section provides details on a subset of the schema, with field definitions, usage examples, and guidelines.

## Table of Contents

- **[Data Fields](data.md)** – All core character fields (name, description, personality, etc.) and new additional fields introduced in V2 (creator notes, system prompt, alternate greetings, tags, etc.), with usage guidance.
- **[System Prompt & Post-History Instructions](system_prompt.md)** – Details on the `system_prompt` and `post_history_instructions` fields, which allow a card to override or supplement system-level instructions.
- **[Character Book](character_book.md)** – Details on the `character_book` field, a structured in-card lorebook for character-specific world info or memory.
- **[Entries](entries.md)** – Details on lorebook entries within a Character Book (trigger keys, content, priority, etc.).
- **[Extensions](extensions.md)** – Details on the `extensions` fields, which provide a flexible way to include extra custom data at various levels of the card.
- **[Examples](examples.md)** - Example Character Cards
