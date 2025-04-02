import type { Entry } from './entry';
import type { Extensions } from './extensions';
/**
 * `CharacterBook` represents a character-specific lorebook attached to a character card.
 * The lorebook bundles supplementary background details and lore entries that enrich
 * the character's narrative. Each lore entry is defined by the {@link Entry} interface.
 *
 * @tips
 * - Use the {@link Entry} interface to structure individual lore entries.
 * - Adjust {@link CharacterBook.scan_depth} to reflect how many recent messages should be scanned for {@link Entry.keys} triggers.
 * - Set {@link CharacterBook.token_budget} carefully to balance the richness of lore details with the prompt's available token space.
 *
 * @considerations
 * - Enable {@link CharacterBook.recursive_scanning} only if you want already inserted lore to trigger additional entries. Use with caution.
 * - Ensure that the {@link CharacterBook.extensions} field is properly namespaced to avoid conflicts with other metadata.
 *
 * @see {@link https://github.com/malfoyslastname/character-card-spec-v2|Character Card Spec V2 on GitHub} for further details on the specification.
 *
 * @example
 * ```typescript
 * const lorebookExample: CharacterBook = {
 *   name: "Royal Annals",
 *   description: "Contains historical details of the royal lineage and key events that have shaped Aetheria.",
 *   scan_depth: 50,
 *   token_budget: 300,
 *   recursive_scanning: false,
 *   extensions: {},
 *   entries: [
 *     {
 *       keys: ["royal", "lineage"],
 *       content: "Queen Seraphina descends from a long line of revered rulers known for their wisdom and valor.",
 *       extensions: {},
 *       enabled: true,
 *       insertion_order: 1,
 *       case_sensitive: false
 *     }
 *   ]
 * };
 * ```
 */
export interface CharacterBook {
  /**
   * Optional title of the lorebook.
   *
   * @example
   * ```json
   * "Alice's Wonderland Lore"
   * ```
   */
  name?: string;

  /**
   * Optional description summarizing the lorebook’s content and purpose.
   *
   * @example
   * ```json
   * "Contains lore details about Wonderland and its mysterious inhabitants."
   * ```
   */
  description?: string;

  /**
   * The number of recent chat messages to scan for triggering lore entries.
   * This value determines how far back the system will look for matches against {@link Entry.keys}.
   *
   * @example
   * ```json
   * 50
   * ```
   */
  scan_depth?: number;

  /**
   * The maximum token budget allocated for lore entries that are inserted into the prompt.
   * This helps prevent lore content from overwhelming the available context.
   *
   * @example
   * ```json
   * 300
   * ```
   */
  token_budget?: number;

  /**
   * Flag indicating whether recursive scanning is enabled.
   * If true, lore entries already injected may themselves trigger additional entries.
   * Use with caution to avoid cascading or excessive lore injections.
   *
   * @example
   * ```json
   * false
   * ```
   */
  recursive_scanning?: boolean;

  /**
   * Custom extension data for the lorebook.
   * This is a flexible container for additional metadata and should follow the guidelines
   * specified in the {@link Extensions} interface.
   *
   * @see {@link Extensions}
   *
   * @example
   * ```json
   * {}
   * ```
   */
  extensions: Extensions;

  /**
   * Array of lore entries that comprise the lorebook.
   * Each entry must adhere to the {@link Entry} interface.
   *
   * @see {@link Entry}
   *
   * @example
   * ```json
   * [
   *   {
   *     "keys": ["royal", "lineage"],
   *     "content": "Queen Seraphina descends from a line of wise rulers who guided Aetheria through centuries of change.",
   *     "extensions": {},
   *     "enabled": true,
   *     "insertion_order": 1,
   *     "case_sensitive": false
   *   }
   * ]
   * ```
   */
  entries: Entry[];
}
