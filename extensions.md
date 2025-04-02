# Extensions

## TypeScript Interface

```typescript
/**
 * @interface Extensions
 * @description A generic mapping of key-value pairs for custom metadata beyond the defined spec.
 */
export interface Extensions {
  [key: string]: any;
}
```

## Summary

The **extensions** fields in Character Card V2 (found at the character level, within the `character_book`, and within each entry) are designed as catch-all containers for any extra information that isn't covered by the official spec fields. They provide flexibility for developers and advanced users to include custom data without breaking compatibility, because applications that don't understand a particular extension will simply ignore it but will still carry it along when saving or transferring the card.

Key aspects of `extensions` usage as defined by the spec:

- It **may contain any arbitrary key-value pairs** (in JSON format), and it **must** default to an empty object (`{ }`) if not used.
- Programs (like character editors or frontends) **must not** discard or alter keys in `extensions` that they don't recognize. This ensures that your custom data isn't lost when someone edits the character in a different tool.
- Creators are encouraged to **namespace their keys** to avoid conflicts. For example, if two different tools both use an extension field called `"mode"`, they might conflict or overwrite each other. Using a unique prefix or grouping (e.g., `"MyApp_mode"` or putting your keys under a sub-object named after your app) helps prevent this.

**Use Cases:** You can use extensions for a variety of purposes. For instance:

- Storing additional metadata like an image reference, an audio clip filename for the character's voice, theme music, creation date, etc.
- Indicating custom behaviors or settings for specific AI frontends or bots (e.g., a special instruction that only a modified chat UI would read and apply).
- Keeping versioning info or original source references beyond the simple `character_version`. For example, a detailed changelog or an ID that links to an external database.
- Temporary or tool-specific data during editing (some editors might use extensions to save UI state or flags that mean nothing to other apps, but will be preserved).

**Examples:**

- _Character-level extension:_ Suppose you want to include a link to an avatar image and a theme color for your character's profile in a UI:
  ```json
  "extensions": {
    "avatar_url": "https://example.com/images/alice.png",
    "theme_color": "#8ED6FF"
  }
  ```
  A compatible frontend that knows about these keys could display Alice's image and use the color, while other apps would simply ignore these keys (but still keep them around).
- _Entry-level extension:_ You might have an entry with:
  ```json
  "extensions": {
    "source": "Lewis Carroll - Chapter 5"
  }
  ```
  indicating that the content of that entry came from chapter 5 of Lewis Carroll's work. This info is just for humans or specialized tools; the AI doesn't use it.
- _Namespacing:_ If a tool named "LoreMaster" wants to store a custom setting in the character's extensions, instead of just `"mode": "detailed"`, it might use:
  ```json
  "extensions": {
    "LoreMaster_mode": "detailed"
  }
  ```
  or nest it under a key:
  ```json
  "extensions": {
    "LoreMaster": { "mode": "detailed" }
  }
  ```
  This reduces the chance of clashing with another tool’s use of `"mode"`.

**Dos:**

- **Use Unique Keys:** As recommended, prefix your keys with an identifier (or group them under one) related to your project or usage. This way, even if someone else also uses extensions, you won’t step on each other’s toes. For example, use `"myTool_setting"` instead of a generic `"setting"`.
- **Document Your Extensions:** If you share a character card that uses extension fields for important behavior, let users know (perhaps in `creator_notes` or an external readme) what those fields do. Remember, other users or apps might not inherently know how to interpret your custom keys.
- **Keep Data Portable:** Stick to JSON-friendly data types (strings, numbers, booleans, objects, arrays). If you need to include something like an image, consider a URL or a filename rather than raw binary data. Keep the size reasonable – extremely large data might bloat the card file.

**Don'ts:**

- **Don’t Rely on Extensions for In-Chat Behavior:** The AI model will not see these extension values (unless a specialized frontend explicitly injects them into the prompt, which is outside standard behavior). So, do not put things like hidden personality traits or instruction overrides here expecting them to influence the AI. Use the proper spec fields for anything the AI needs to know.
- **Don’t Remove Others’ Data:** If you're writing a tool that manipulates character cards, follow the spec rule to preserve unknown extension data. This means if your tool adds or changes something in the card, it should pass through any extension keys it doesn’t understand untouched.
- **Don’t Overcomplicate Structure:** While you can nest objects or arrays inside extensions, be mindful of complexity. The primary goal is flexibility, but extremely complicated or deeply nested structures might be hard for others (or even you later) to work with. Use it for straightforward additions unless you have a good reason to do otherwise.

In summary, `extensions` is your sandbox for extending the character card format in a forward-compatible way. It's a powerful feature for developers and advanced creators, ensuring that custom needs can be met without breaking the standard structure or losing data when the card is handled by different tools. Always use this field responsibly and in a way that others can safely ignore if they don't support it, as intended by the spec.
