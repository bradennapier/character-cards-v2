import type { Entry } from './entry';
import type { CharacterBook } from './character-book';

/**
 * `Extensions` are a generic mapping of key-value pairs for custom metadata that is not covered by the official spec.
 * This flexible container allows developers to store extra data or custom settings without breaking compatibility.
 * Data stored in Extensions is preserved by compliant editors and tools even if they don't natively recognize the keys.
 *
 * @tips
 * - Always namespace your keys (e.g., use "MyApp_customKey" or nest them under a key specific to your application)
 *   to avoid collisions with other metadata.
 * - Keep the data JSON-serializable; avoid complex objects or non-primitive types that may not be portable.
 *
 * @considerations
 * - Extensions are not used in AI prompt generation unless explicitly injected by a custom frontend.
 * - When processing Character Card V2 objects, ensure that unknown keys within Extensions are preserved intact.
 *
 * @see {@link CharacterBook} for how Extensions are applied at the lorebook level.
 * @see {@link Entry} for similar usage within individual lore entries.
 * @see {@link https://github.com/malfoyslastname/character-card-spec-v2|Character Card Spec V2 on GitHub} for further details.
 *
 * @example
 * ```typescript
 * // Example of using Extensions at the character level:
 * const characterExtensions: Extensions = {
 *   "avatar_url": "https://example.com/avatars/queen_seraphina.png",
 *   "theme_color": "#D4AF37",
 *   "custom_info": {
 *     "lore_source": "Royal Archives"
 *   }
 * };
 *
 * ```
 * ```typescript
 *
 * // Example of using Extensions within an Entry:
 * const entryExtensions: Extensions = {
 *   "source": "Lewis Carroll - Chapter 5",
 *   "verified": true
 * };
 * ```
 */
export interface Extensions {
  [key: string]: any;
}
