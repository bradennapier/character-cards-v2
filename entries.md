# Entries

## TypeScript Interface

```typescript
/**
 * @interface Entry
 * @description Represents an individual lore entry that can be triggered by keywords in the conversation.
 */
export interface Entry {
  /** List of primary trigger keywords that activate this lore entry. */
  keys: string[];
  /** The lore text to be injected when the entry is triggered. */
  content: string;
  /** Custom extension data specific to this entry. */
  extensions: { [key: string]: any };
  /** Flag indicating whether this entry is active. */
  enabled: boolean;
  /** Numeric value controlling the ordering of entries when multiple are triggered. */
  insertion_order: number;
  /** Optional flag for case-sensitive keyword matching (default is false). */
  case_sensitive?: boolean;
  /** Optional internal name for identification. */
  name?: string;
  /** Optional priority value for dropping the entry if the token budget is exceeded (lower means more disposable). */
  priority?: number;
  /** Optional internal identifier for the entry. */
  id?: number;
  /** Optional comment or note about the entry, for human reference. */
  comment?: string;
  /** If true, both a primary and secondary key are required to trigger the entry. */
  selective?: boolean;
  /** Optional secondary trigger keywords; used when 'selective' is true. */
  secondary_keys?: string[];
  /** If true, this entry is always injected into the prompt regardless of triggers. */
  constant?: boolean;
  /** Specifies the insertion position relative to the character’s main definition ("before_char" or "after_char"). */
  position?: 'before_char' | 'after_char';
}
```

## Summary

Each **entry** in the character book is a discrete piece of lore or information that can be injected into the conversation when relevant. Entries consist of trigger keywords and the content to insert, along with some settings controlling their behavior. This section describes each property of an entry and offers guidance on how to use them.

**How Lore Entries Work (Overview):** When a conversation is ongoing, the system will look at the recent messages (up to the `scan_depth` limit) and see if any of the defined `keys` appear. If a match is found and the entry is enabled, the entry’s `content` becomes a candidate to be inserted. If multiple entries trigger, they can all be inserted, but the total inserted lore is limited by `token_budget`. If that budget would be exceeded, entries with lower priority values are dropped first. The remaining entries are then inserted into the prompt, either before or after the character's main definition block depending on their `position` settings. This injection happens typically right before the AI generates its next reply, providing the model with additional context just in time.

Now, onto the individual fields of an entry object:

### `keys` (Array of Strings)

**Description:** A list of trigger keywords for this entry. If any one of these keywords is found in the relevant context (recent conversation up to `scan_depth`), it will trigger this entry (unless the entry is selective, see `selective`). The match is usually case-insensitive by default (unless `case_sensitive` is set to true). These can be single words or short phrases that uniquely identify when the entry’s information should be brought in.  
**Example:**

```json
"keys": ["Wonderland", "Alice's Adventures"]
```

_(This entry would trigger if either "Wonderland" or "Alice's Adventures" appears in the conversation.)_

**Dos:** Choose keywords that are likely to appear when the information in the entry is needed. Use proper nouns, specific terms, or distinctive phrases that directly relate to the entry’s content. For example, if the entry is about the Queen of Hearts, use keys like `"Queen of Hearts"` or `"Queen Hearts"` (and perhaps a shorter variant like `"Queen"` if context makes that safe). If multiple terms could cue the same info, include them all in the list.  
**Don'ts:** Avoid overly common words as keys (e.g., "friend", "city", "magic") as they might cause false triggers. Don’t include extremely long phrases or entire sentences; keys should be concise triggers, not descriptions. Also, be mindful of substrings – for instance, a key "art" would unintentionally trigger on the word "he**art**", so specificity is important.

### `content` (String)

**Description:** The lore text to insert when this entry triggers. This is the information that the AI will receive as additional context. It should be written in a narrative or informative style, as if part of the background context of the story or character profile. The content is not spoken by any character; it's injected into the prompt (usually in a system or hidden section) to inform the AI.  
**Example:**

```json
"content": "The Cheshire Cat is a grinning feline that can disappear at will. He often gives cryptic advice and speaks in riddles to those he encounters."
```

**Dos:** Write the content in third person or an objective tone, since it's meant to be background information. It can be one or several sentences stating facts or descriptions. Ensure the content is relevant to the keys and provides useful context to the AI. Keep it succinct enough to not waste tokens, but detailed enough to be helpful (a few sentences is a common length).  
**Don'ts:** Don’t write the content as dialogue or as a direct address to the user or character – it's not a conversational turn, but rather knowledge. Avoid including placeholders like `{{char}}` or `{{user}}` here; those are typically not processed in lore content. Also, do not assume this content is always present. It will only show up if triggered, so critical character details should usually be in the main description/personality rather than only in an entry that might not trigger.

### `extensions` (Object)

**Description:** A flexible object for any extra, non-standard data you'd like to store in this entry. As with other `extensions` fields, this is not used in prompt generation. It's a place for custom flags or metadata about the entry that might be used by specific tools or future features. Unknown keys here are to be preserved by editors.  
**Example:**

```json
"extensions": {
  "source": "Original Novel Volume 2"
}
```

_(This might indicate this lore entry’s info came from Volume 2 of a novel, for instance.)_

**Dos:** Use this to keep any additional info about the entry that isn't covered by standard fields. For example, if you have a custom tool that categorizes entries, you could store a category label or an external reference ID here. Use clear key names, preferably namespaced (e.g., `"MyTool_category": "folklore"` or a nested object), to avoid conflicts.  
**Don'ts:** Don't put anything here that you expect the AI to see or use. Also, if you're writing a tool, do **not** remove or alter keys in this object that you don't recognize.

### `enabled` (Boolean)

**Description:** A simple on/off switch for the entry. If `true`, the entry is active and can trigger normally. If `false`, the entry will be ignored entirely (as if it isn't there), regardless of its keys. This allows creators to disable certain lore entries without deleting them.  
**Example:**

```json
"enabled": false
```

_(This entry is turned off and will not be considered even if its keywords appear.)_

**Dos:** Use this field to toggle entries when testing or if you have situational lore. For instance, you might create multiple entries for different phases of a story and disable those that aren't currently relevant. Keep it `true` for all entries that should be in play.  
**Don'ts:** Don’t forget to set it to true for the entries you want active. It's easy to overlook when editing JSON directly. There’s rarely a need to set this false unless you are intentionally turning an entry off.

### `insertion_order` (Number)

**Description:** A number that determines the relative ordering of this entry’s content when multiple entries are inserted at once. Entries with lower `insertion_order` values are placed earlier (higher up) in the combined lore section of the prompt. This can be used to ensure certain foundational information comes before more specific details. Essentially, the system will sort triggered entries by this value when adding them to the prompt.  
**Example:**

```json
"insertion_order": 1
```

_(An entry with order 1 will appear before an entry with order 2 in the prompt, assuming both are triggered.)_

**Dos:** Use a coherent scheme for these numbers. For example, you might number entries in tens (10, 20, 30, ...) or simply in sequence (1, 2, 3) in the order of how you want information to appear. If one entry provides context needed to understand another, give it a lower number so it comes first.  
**Don'ts:** Don’t assign the same `insertion_order` to multiple entries if their relative order matters to you. If two entries have the same value, the insertion order between them might default to the order they appear in the JSON or some arbitrary method. Also, note that `position` (see below) overrides this in terms of grouping (all "before_char" entries will appear before any "after_char" entries regardless of numeric order differences).

### `case_sensitive` (Boolean, optional)

**Description:** This flag determines if the keyword matching should consider letter case or not. By default, or if this field is not set (`false`), matching is case-insensitive (e.g., "wonderland" would trigger on "Wonderland" and vice versa). If `case_sensitive` is set to true, the entry’s `keys` must match exactly in case to trigger.  
**Example:**

```json
"case_sensitive": true
```

_(With this true, a key "Rabbit" would **not** trigger on "rabbit" in lowercase.)_

**Dos:** Use `true` only when necessary – for instance, if a key is a common word that only has meaning in a specific case. Perhaps your key is an acronym like "VIP" which you don't want to trigger on the lowercase word "vip". In such cases, case sensitivity can prevent unwanted matches.  
**Don'ts:** Don’t set this without reason; generally you want keys to catch mentions regardless of capitalization (users might not match the exact case). If you do use it, ensure you include all relevant capitalizations of your key in either `keys` or handle it via logic.

### `name` (String, optional)

**Description:** A shorthand name for the entry itself. Think of this as a title or label for the entry’s content. It’s not used in any prompt or by the AI; it exists for the creator’s convenience, especially when using editors or reading the JSON.  
**Example:**

```json
"name": "Cheshire Cat Info"
```

**Dos:** Give a brief title that helps you identify the entry at a glance. This could be the subject of the entry (like `"Cheshire Cat Info"`, `"White Rabbit Details"`, or `"Wonderland Geography"`). It's particularly useful if you have many entries, so you can tell them apart easily in an editor or JSON file.  
**Don'ts:** Don’t expect this name to appear in the conversation or to have any effect on the AI. It’s purely organizational. If you leave it blank or omit it, that's fine too; it's optional and mainly for human reference.

### `priority` (Number, optional)

**Description:** A value that indicates how important this entry is relative to others when deciding which entries to keep under the `token_budget`. If the combined content of triggered entries is too large, the system will start dropping entries. According to the spec, entries with **lower** `priority` values are discarded first when space runs out. In other words, a higher number means a higher priority to keep, and a lower number means more disposable. If this field isn’t set, the system may treat it as a default priority (commonly the highest priority, meaning it will try to keep it).  
**Example:**

```json
"priority": 10
```

_(An entry with priority 10 will be kept over another entry with priority 1 if both cannot fit in the prompt.)_

**Dos:** Use the priority field to mark particularly important lore. For example, if an entry is critical to the character’s identity or core backstory, give it a higher number (like 5 or 10) and give more minor flavor entries a lower number (like 1). This way, when space is tight, minor details drop out before crucial ones.  
**Don'ts:** Don’t use extremely large numbers or negative values; stick to a reasonable range (e.g., 1–10 or 1–100) that you can remember and manage. Remember that priority is only considered when multiple entries compete for space – if only one entry is triggered or all fit within the budget, their priority values won't matter in that moment.

### `id` (Number, optional)

**Description:** A unique identifier for the entry. This is not used in prompting or by the AI. It's mainly for internal tracking, especially in editors or systems that refer to entries by an ID. Some character editing tools might auto-assign an ID when new entries are created.  
**Example:**

```json
"id": 3
```

**Dos:** It's generally fine to leave this to whatever tool you’re using. If editing manually, you can assign IDs if it helps you keep track of entries or if another system expects them. Ensure each entry in a character book has a unique id if you do use them.  
**Don'ts:** Don’t rely on the ID for any sorting or logic in the prompt; it's purely metadata. Also, if you're manually editing and not using a tool that requires it, you can omit it altogether. It's optional and mainly for programmatic reference.

### `comment` (String, optional)

**Description:** A field for the creator to leave a comment or note about the entry. This is not used in the chat at all (similar to a code comment, it's just for humans to read). It might be visible in JSON or in advanced editors that show entry details.  
**Example:**

```json
"comment": "This entry is crucial if Alice meets the Cheshire Cat."
```

**Dos:** Use it as you like for notes: maybe to remind yourself of the source of the info, or to flag something like "This entry should be toggled off once Alice leaves Wonderland." It can be any text that helps you or others maintaining the character.  
**Don'ts:** Don’t put actual story content here expecting it to be used; it's purely a note. Keep in mind that if you share the card, others might see your comments if they dig into the JSON, so keep them appropriate.

### `selective` (Boolean, optional)

**Description:** When set to `true`, this entry will only trigger if **both** a keyword from the primary `keys` list **and** a keyword from the `secondary_keys` list are present in the recent conversation. If `false` or not set, only the `keys` list is considered (the `secondary_keys` are ignored). This allows you to create an entry that requires two conditions to be met simultaneously.  
**Example:**

```json
"selective": true
```

**Dos:** Use this for entries that are context-specific in a compound way. For example, suppose you have an entry that should trigger only when the conversation involves **Alice** and **the Jabberwock** at the same time. You could put `"Alice"` in `keys` and `"Jabberwock"` in `secondary_keys`, with `selective: true`. This entry will then inject only if both terms have been mentioned in the context (perhaps indicating Alice is currently dealing with the Jabberwock).  
**Don'ts:** Don’t use `selective` without providing a meaningful `secondary_keys` list; otherwise, the entry effectively won't trigger at all (since the second condition can never be met). Also avoid making both `keys` and `secondary_keys` lists too long or broad, as requiring a hit in each could make the entry very hard to trigger. Keep each list focused on the two aspects that truly need to coincide.

### `secondary_keys` (Array of Strings, optional)

**Description:** The secondary trigger keywords list, used only when `selective` is true. At least one of these keywords must be present in addition to one of the primary `keys` to activate the entry. If `selective` is false, this field is ignored entirely.  
**Example:**

```json
"secondary_keys": ["Jabberwock", "Vorpal Sword"]
```

_(Paired with `keys: ["Alice"]` and `selective: true`, this entry would trigger only if **both** "Alice" and either "Jabberwock" or "Vorpal Sword" appear in the conversation.)_

**Dos:** Use this in conjunction with `selective`. Think of `keys` and `secondary_keys` as two sets of conditions that must intersect. For instance, the primary keys might be all the characters in Wonderland, and secondary keys might be various crises or events. An entry could then trigger only if a particular character and a particular event are mentioned together. Keep the lists as short and specific as possible for the scenario.  
**Don'ts:** Don’t use `secondary_keys` without `selective: true` (it won’t do anything). Also, similar to primary keys, avoid trivial or overly broad terms here. Both primary and secondary should be focused; if your condition is too complex (needing three or more different factors), consider splitting into multiple entries or rethinking the approach.

### `constant` (Boolean, optional)

**Description:** If true, this entry is considered "always on": it will be inserted into the prompt every time (provided it’s enabled and there's room under the token budget), regardless of whether its keywords appear in the conversation. Essentially, it's always triggered. If false or not set (default), the entry only triggers via the normal keyword mechanism.  
**Example:**

```json
"constant": true
```

**Dos:** Use `constant: true` for essential context that the AI should always have. For example, if you have a short summary of the character’s background or an important rule that should never be omitted from the prompt, making that entry constant ensures it's always included (unless it has to be dropped due to the token budget). This can be handy for crucial setting info or character secrets that must be known from the start.  
**Don'ts:** Don’t flag too many entries as constant, or you defeat the purpose of triggered lore. Only truly indispensable info should be constant. If everything is constant, you might as well put it in the main description or scenario. Also, be mindful of the token budget – if the combined content of constant entries exceeds the budget, some constant entries might still get dropped (being constant doesn't exempt an entry from the budget limit).

### `position` (String, optional)

**Description:** Determines where this entry’s content should be placed relative to the character’s main definitions in the assembled prompt. It can be `"before_char"` or `"after_char"`. `"before_char"` means the entry content will be placed before the main character description/persona in the prompt, and `"after_char"` means it will be placed after. This can be important for ordering context (for example, some world info might need to come before the character’s own details to set the stage). If not specified, entries are typically placed after the character’s definitions by default.  
**Example:**

```json
"position": "before_char"
```

**Dos:** Set this to `"before_char"` for entries that provide broad setting or context that should frame the character information (e.g., an entry describing the world’s state or recent events might come before the character’s personal description). Use `"after_char"` (or leave it unspecified) for entries that add details closely related to the character or situation that are fine to appear after the character definition.  
**Don'ts:** Don’t confuse this with `insertion_order`. `position` decides the section of the prompt (before or after the character info), whereas `insertion_order` decides ordering among entries within those sections. Also, if you don't have a particular ordering need relative to the character description, it's okay to leave this unspecified (the default `"after_char"` is suitable for most character-specific lore entries).

---

By carefully utilizing these fields, you can create a robust lorebook for your character that dynamically enriches the AI's responses. Always test your entries in conversation to ensure the keys are triggering as expected and that the injected content is helping the AI in the intended way. Fine-tuning the combination of `scan_depth`, `token_budget`, and entry settings (like `priority` and `constant`) will lead to the best balance between providing enough context and not overcrowding the prompt.
