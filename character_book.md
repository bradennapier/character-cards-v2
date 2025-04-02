# Character Book (`character_book`)

## TypeScript Interface

```typescript
/**
 * @interface CharacterBook
 * @description Represents a lorebook attached to a character, containing background details and lore entries.
 */
export interface CharacterBook {
  /** Optional title of the lorebook. */
  name?: string;
  /** Optional description explaining the purpose or content of the lorebook. */
  description?: string;
  /** Number of recent messages to scan for triggering lore entries. */
  scan_depth?: number;
  /** Maximum tokens allowed for lore entries inserted into the prompt. */
  token_budget?: number;
  /** Flag to enable recursive scanning of inserted lore. */
  recursive_scanning?: boolean;
  /** Custom extension data for the lorebook. */
  extensions: { [key: string]: any };
  /** Array of lore entries in the lorebook. */
  entries: Entry[];
}
```

## Summary

The **Character Book** is a built-in lorebook attached to the character card. It allows creators to package supplemental world or character information (often called "lore entries") directly with the character, instead of requiring separate files. This is useful for providing extended backstory, world details, or any information that the AI should know or recall when certain topics come up in the conversation. The character book concept in V2 essentially creates a distinction between a user's global "world book" and a character-specific book – with the character’s book taking priority if both are present.

The character book is represented as an object in the `character_book` field, containing its own properties and a list of entries. If a character does not require any lore entries or additional context beyond the main fields, this field can be omitted or left empty. When present, frontends that support V2 will automatically utilize the character book’s entries during chat (by scanning the conversation for triggers and injecting relevant lore).

## Fields

Below are the fields of the `character_book` object:

### `name` (String, optional)

**Description:** A human-friendly name for the lorebook. This can be thought of as the title of the character’s lore collection. It might be displayed in an editor or UI to label the lorebook. It is **not** used in the prompt or visible to the AI.  
**Example:**

```json
"name": "Alice's Wonderland Lore"
```

**Dos:** Give a brief title that reflects the content or theme of the lorebook (e.g., `"Gandalf's Middle-earth Lore"` for a Gandalf character). This is mainly for organizational purposes.  
**Don'ts:** Don’t put critical data here expecting the AI to use it – the AI doesn’t see this. Avoid very long names; a short title is best.

### `description` (String, optional)

**Description:** A short description or summary of what the lorebook contains. Like `name`, this is primarily for the benefit of users or creators when editing or viewing the card’s metadata. It is not inserted into the prompt.  
**Example:**

```json
"description": "Contains background lore about Wonderland and its inhabitants relevant to Alice."
```

**Dos:** Summarize the scope of the lorebook (e.g., “Key historical events of the character’s world” or “Family background and relationships”). This can help someone quickly understand what kind of information is included in the entries without reading them all.  
**Don'ts:** Don’t rely on this text to convey information to the AI. Keep it concise – a sentence or two is usually enough, since it’s just a summary for humans.

### `scan_depth` (Number, optional)

**Description:** The number of recent chat messages that the system will scan to look for lore **trigger keys**. In other words, when deciding which entries from this character book to insert into the prompt, the application will examine the last `scan_depth` messages from the conversation history for any matching keywords (defined in each entry’s `keys`). If an entry’s key is found within that window of messages, the entry becomes a candidate to be inserted. This is analogous to the "Memory: Chat History Depth" setting in some frontends.  
**Example:**

```json
"scan_depth": 50
```

_(If set to 50, the last 50 messages in the conversation are checked for any trigger keywords.)_

**Dos:** Adjust `scan_depth` based on how persistent or contextual your lore needs to be. A larger number means the system will look further back in the conversation for opportunities to insert lore, which is useful if the conversation might circle back to earlier topics. A smaller number (or leaving it default) focuses on more recent dialogue, which can prevent old, irrelevant lore triggers from reappearing. Consider the typical length of interactions for your character: if they tend to have long, sprawling conversations, a larger depth might be justified.  
**Don'ts:** Don’t set `scan_depth` excessively high without reason – scanning a very large history could lead to unrelated lore being triggered by something mentioned far in the past. Also, a very high depth might impact performance slightly. If unsure, you can leave this field unspecified to use the frontend’s default behavior.

### `token_budget` (Number, optional)

**Description:** The maximum number of tokens (approximately, chunks of text) from lore entries that can be inserted into the prompt at any one time. This acts as a cap to ensure that lorebook entries do not consume too much of the prompt’s context window. If multiple entries are triggered and their combined content exceeds this budget, some entries will be dropped (typically the less important ones, as determined by their `priority` field). This is analogous to the "Memory: Context Limit" in some UIs.  
**Example:**

```json
"token_budget": 1024
```

_(Limits lore insertion to roughly 1024 tokens worth of text; anything beyond that won't be included.)_

**Dos:** Set a `token_budget` that makes sense for your AI model’s context length and the amount of lore you have. For example, if using a model with ~4096 tokens context length, you might budget a few hundred tokens for lore so that it doesn't crowd out the conversation. If your character has lots of lore but much of it is non-essential flavor, lean toward a lower budget to ensure only the most relevant lore appears.  
**Don'ts:** Don’t set the budget so high that it could allow lore to take over the prompt. If you set it near the model’s full context, you risk pushing out important parts of the conversation when many lore entries trigger. Conversely, avoid setting it unrealistically low (like 10 tokens) as that would practically disable lore even when it triggers. Find a balance appropriate to your needs.

### `recursive_scanning` (Boolean, optional)

**Description:** A flag indicating whether the content of lore entries, once inserted, should itself be scanned for triggering other lore entries. If `true`, the system will allow an entry's inserted text to potentially contain keywords that trigger additional entries (this can create a chain where one entry leads to another). If `false`, only the actual conversation messages (and not already injected lore content) are considered when looking for triggers. Most current implementations do not have an equivalent to this (it’s a new concept in V2). By default (if omitted), this can be assumed to be `false` (no recursive triggering).  
**Example:**

```json
"recursive_scanning": false
```

**Dos:** Use `true` only if you have designed your lore entries to reference each other and you want that cascade effect. For instance, one entry's content might intentionally include a key phrase that should trigger another entry (perhaps for layered lore that builds on itself). This can be a powerful feature if used carefully to reveal information progressively.  
**Don'ts:** Be cautious using recursion; it can lead to unexpected results or excessive lore injection if not carefully managed. If one entry unintentionally contains a keyword for another, you could end up with a lot of injected text. In most cases, leaving this false is safer to keep lore triggering straightforward and directly tied to what the user and character have said.

### `extensions` (Object)

**Description:** An object for any extra metadata or custom settings related to the character book itself. This is similar to the `extensions` field at the character level, but specifically for the lorebook. Anything here is not interpreted by the standard spec – it’s purely for custom extension by specific applications or for future-proofing. Unknown keys here will be preserved by compliant editors.  
**Example:**

```json
"extensions": {
  "lorebook_id": 12345
}
```

_(In this example, perhaps an application uses an ID to track lorebooks; this key is not part of the spec but is stored here for the app’s use.)_

**Dos:** Use this if you have additional data to store about the lorebook that isn't covered by `name`, `description`, or the other fields. For instance, you might keep a creation timestamp, an external reference ID, or a flag that a custom AI frontend might read (e.g., `"share_with_worldbook": true` to hint something to an app). Follow the same practices as other extension fields: use clear, namespaced keys so as not to conflict with others.  
**Don'ts:** Don’t put critical lore content in here expecting it to be used in chat – if it’s important for the AI, it should be in an entry’s content or a standard field. Also, do not strip out or modify someone else’s extension data here if your tool reads/writes this card; unknown data should be left intact.

**Related:** See **[Extensions](extensions.md)** for general information about extension fields.

### `entries` (Array of Entry objects)

**Description:** The list of lore **entries** in this character book. Each entry is a unit of lore consisting of some trigger keys and associated content (plus settings like priority). When any of an entry’s `keys` appear in the recent conversation (within the `scan_depth`), and if the entry is enabled, its `content` becomes a candidate to be inserted into the prompt. The entries are the core of the lorebook functionality: they allow the AI to recall detailed information only when it's relevant. (See the **Entries** section for a full breakdown of entry structure.)  
**Example:** _(See the **[Entries](entries.md)** documentation for a full breakdown of each entry field. Here's a simple illustration of one entry in JSON form.)_

```json
{
  "keys": ["Wonderland", "Queen of Hearts"],
  "content": "Wonderland is a whimsical realm, home to peculiar characters like the Cheshire Cat and ruled in part by the Queen of Hearts, who is known for her temper and fondness for tarts.",
  "extensions": {},
  "enabled": true,
  "insertion_order": 1,
  "case_sensitive": false
}
```

**Dos:** Organize information into multiple entries if appropriate. Each entry should ideally cover one topic or aspect of lore (for example, a place, a character, an event) with a clear set of trigger keywords. Make use of `enabled` to toggle entries without deleting them, and adjust `priority` and `insertion_order` to control which entries are more important and where they appear relative to each other when multiple are injected. For all guidelines on crafting effective entries (choosing good keys, writing content, etc.), see the **[Entries](entries.md)** documentation.  
**Don'ts:** Don’t overload a single entry with too much disparate information or with too many trigger keys; it’s better to split into separate entries for different topics. Avoid extremely generic keys that could trigger too often in normal dialogue. Also, be mindful not to exceed the `token_budget` with a single entry that's too large — if an entry is very long, it might crowd out others or even itself if it exceeds the budget.

**Related:** Refer to the **[Entries](entries.md)** section for details on each field within an entry and tips on writing them. The lorebook entries work in tandem with `scan_depth`, `token_budget`, and entry settings (like `priority` and `position`) to determine how and when they appear in the prompt.
