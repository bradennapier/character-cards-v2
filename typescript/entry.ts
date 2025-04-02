import type { Extensions } from './extensions';
import type { CharacterBook } from './character-book';

/**
 * `Entry` represents an individual lore entry within a {@link CharacterBook}. Each entry provides dynamic
 * background or contextual information that can be injected into the AI's prompt when specific trigger keywords
 * (defined in {@link Entry.keys}) are detected in the conversation.
 *
 * @tips
 * - Use clear and specific keywords in {@link Entry.keys} to ensure the entry triggers only in the intended context.
 * - Adjust {@link Entry.insertion_order} to control the order of lore injection; lower numbers insert earlier.
 * - Consider setting {@link Entry.priority} if you need to manage which entries are dropped when the token budget is exceeded.
 *
 * @considerations
 * - Avoid overly generic keywords in {@link Entry.keys} to prevent unintended triggers.
 * - Use {@link Entry.selective} with {@link Entry.secondary_keys} when an entry should trigger only under combined conditions.
 * - If an entry should always be present regardless of triggers, set {@link Entry.constant} to true, but ensure it does not
 *   overwhelm the overall token budget.
 *
 * @see {@link CharacterBook} for more details on how lore entries are incorporated within a character's lorebook.
 * @see {@link https://github.com/malfoyslastname/character-card-spec-v2|Character Card Spec V2 on GitHub} for further details on the overall specification.
 *
 * @example
 * ```typescript
 * const entryExample: Entry = {
 *   keys: ["royal", "lineage"],
 *   content: "Queen Seraphina descends from a long line of revered rulers known for their wisdom and valor.",
 *   extensions: {},
 *   enabled: true,
 *   insertion_order: 1,
 *   case_sensitive: false
 * };
 * ```
 */
export interface Entry {
  /**
   * List of primary trigger keywords that activate this lore entry.
   *
   * @example
   * ```json
   * ["royal", "lineage"]
   * ```
   */
  keys: string[];

  /**
   * The lore text to be injected into the prompt when this entry is triggered.
   *
   * @example
   * ```json
   * "Queen Seraphina descends from a long line of revered rulers."
   * ```
   */
  content: string;

  /**
   * Custom extension data specific to this lore entry. This object allows you to include additional metadata
   * and should follow the guidelines specified in the {@link Extensions} interface.
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
   * Flag indicating whether this entry is active. If set to `false`, the entry is ignored regardless of trigger keywords.
   *
   * @example
   * ```json
   * true
   * ```
   */
  enabled: boolean;

  /**
   * Numeric value controlling the order in which triggered entries are injected into the prompt.
   * Lower values indicate higher priority in the ordering.
   *
   * @example
   * ```json
   * 1
   * ```
   */
  insertion_order: number;

  /**
   * Optional flag for enabling case-sensitive matching of {@link Entry.keys}. If `true`, the trigger keywords must match
   * the case exactly to activate this entry.
   *
   * @example
   * ```json
   * false
   * ```
   */
  case_sensitive?: boolean;

  /**
   * Optional internal name for the lore entry. This is used for identification in editing tools and does not affect prompt generation.
   *
   * @example
   * ```json
   * "Royal Lineage Info"
   * ```
   */
  name?: string;

  /**
   * Optional priority value used for dropping the entry if the combined lore exceeds the token budget.
   * Lower numbers indicate that the entry is less critical and can be removed first.
   *
   * @example
   * ```json
   * 10
   * ```
   */
  priority?: number;

  /**
   * Optional internal identifier for this entry. This field is used by editors or tracking systems and is not injected into the prompt.
   *
   * @example
   * ```json
   * 3
   * ```
   */
  id?: number;

  /**
   * Optional comment or note about the entry for human reference. This information is not used in the prompt.
   *
   * @example
   * ```json
   * "This entry is crucial if the character mentions her heritage."
   * ```
   */
  comment?: string;

  /**
   * If `true`, this entry will trigger only if both a primary keyword from {@link Entry.keys} and a secondary keyword from
   * {@link Entry.secondary_keys} are present in the conversation.
   *
   * @example
   * ```json
   * true
   * ```
   */
  selective?: boolean;

  /**
   * Optional secondary trigger keywords used in conjunction with {@link Entry.keys} when {@link Entry.selective} is `true`.
   *
   * @example
   * ```json
   * ["ancestors", "bloodline"]
   * ```
   */
  secondary_keys?: string[];

  /**
   * If `true`, this entry is always injected into the prompt regardless of whether its trigger keywords are detected,
   * subject to the token budget.
   *
   * @example
   * ```json
   * false
   * ```
   */
  constant?: boolean;

  /**
   * Specifies the insertion position of this entry's content relative to the character's main definition.
   * Allowed values are `"before_char"` or `"after_char"`. This helps manage the order of contextual injections.
   *
   * @example
   * ```json
   * "before_char"
   * ```
   */
  position?: 'before_char' | 'after_char';
}
