/**
 * @file characterCardV2.ts
 * @description Contains all TypeScript interfaces defining the Character Card V2 specification.
 * These interfaces outline the structure for AI roleplaying character cards including core data,
 * system-level instructions, character-specific lorebooks, and extension fields.
 */

/**
 * @interface Extensions
 * @description A generic mapping of key-value pairs for custom metadata beyond the defined spec.
 * Extensions allow for future-proofing and custom features without breaking compatibility.
 */
export interface Extensions {
  [key: string]: any;
}

/**
 * @interface Entry
 * @description Represents an individual lore entry within a {@link CharacterBook}. Each entry provides dynamic 
 * background or contextual information that can be injected into the AI's prompt when specific trigger keywords 
 * (defined in {@link Entry.keys}) are detected in the conversation.
 *
 * @example
 * const entryExample: Entry = {
 *   keys: ["royal", "lineage"],
 *   content: "Queen Seraphina descends from a long line of revered rulers known for their wisdom and valor.",
 *   extensions: {},
 *   enabled: true,
 *   insertion_order: 1,
 *   case_sensitive: false
 * };
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
 */
export interface Entry {
  /**
   * List of primary trigger keywords that activate this lore entry.
   *
   * @example ["royal", "lineage"]
   */
  keys: string[];

  /**
   * The lore text to be injected into the prompt when this entry is triggered.
   *
   * @example "Queen Seraphina descends from a long line of revered rulers."
   */
  content: string;

  /**
   * Custom extension data specific to this lore entry. This object allows you to include additional metadata
   * and should follow the guidelines specified in the {@link Extensions} interface.
   *
   * @see {@link Extensions}
   *
   * @example {}
   */
  extensions: Extensions;

  /**
   * Flag indicating whether this entry is active. If set to false, the entry is ignored regardless of trigger keywords.
   *
   * @example true
   */
  enabled: boolean;

  /**
   * Numeric value controlling the order in which triggered entries are injected into the prompt.
   * Lower values indicate higher priority in the ordering.
   *
   * @example 1
   */
  insertion_order: number;

  /**
   * Optional flag for enabling case-sensitive matching of {@link Entry.keys}. If true, the trigger keywords must match
   * the case exactly to activate this entry.
   *
   * @example false
   */
  case_sensitive?: boolean;

  /**
   * Optional internal name for the lore entry. This is used for identification in editing tools and does not affect prompt generation.
   *
   * @example "Royal Lineage Info"
   */
  name?: string;

  /**
   * Optional priority value used for dropping the entry if the combined lore exceeds the token budget.
   * Lower numbers indicate that the entry is less critical and can be removed first.
   *
   * @example 10
   */
  priority?: number;

  /**
   * Optional internal identifier for this entry. This field is used by editors or tracking systems and is not injected into the prompt.
   *
   * @example 3
   */
  id?: number;

  /**
   * Optional comment or note about the entry for human reference. This information is not used in the prompt.
   *
   * @example "This entry is crucial if the character mentions her heritage."
   */
  comment?: string;

  /**
   * If true, this entry will trigger only if both a primary keyword from {@link Entry.keys} and a secondary keyword from
   * {@link Entry.secondary_keys} are present in the conversation.
   *
   * @example true
   */
  selective?: boolean;

  /**
   * Optional secondary trigger keywords used in conjunction with {@link Entry.keys} when {@link Entry.selective} is true.
   *
   * @example ["ancestors", "bloodline"]
   */
  secondary_keys?: string[];

  /**
   * If true, this entry is always injected into the prompt regardless of whether its trigger keywords are detected,
   * subject to the token budget.
   *
   * @example false
   */
  constant?: boolean;

  /**
   * Specifies the insertion position of this entry's content relative to the character's main definition.
   * Allowed values are "before_char" or "after_char". This helps manage the order of contextual injections.
   *
   * @example "before_char"
   */
  position?: 'before_char' | 'after_char';
}


/**
 * @interface CharacterBook
 * @description Represents a character-specific lorebook attached to a character card.
 * The lorebook bundles supplementary background details and lore entries that enrich
 * the character's narrative. Each lore entry is defined by the {@link Entry} interface.
 *
 * @example
 * // Example implementation of a CharacterBook:
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
 */
export interface CharacterBook {
  /**
   * Optional title of the lorebook.
   *
   * @example "Alice's Wonderland Lore"
   */
  name?: string;

  /**
   * Optional description summarizing the lorebook’s content and purpose.
   *
   * @example "Contains lore details about Wonderland and its mysterious inhabitants."
   */
  description?: string;

  /**
   * The number of recent chat messages to scan for triggering lore entries.
   * This value determines how far back the system will look for matches against {@link Entry.keys}.
   *
   * @example 50
   */
  scan_depth?: number;

  /**
   * The maximum token budget allocated for lore entries that are inserted into the prompt.
   * This helps prevent lore content from overwhelming the available context.
   *
   * @example 300
   */
  token_budget?: number;

  /**
   * Flag indicating whether recursive scanning is enabled.
   * If true, lore entries already injected may themselves trigger additional entries.
   * Use with caution to avoid cascading or excessive lore injections.
   *
   * @example false
   */
  recursive_scanning?: boolean;

  /**
   * Custom extension data for the lorebook.
   * This is a flexible container for additional metadata and should follow the guidelines
   * specified in the {@link Extensions} interface.
   *
   * @see {@link Extensions}
   *
   * @example {}
   */
  extensions: Extensions;

  /**
   * Array of lore entries that comprise the lorebook.
   * Each entry must adhere to the {@link Entry} interface.
   *
   * @see {@link Entry}
   *
   * @example
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
   */
  entries: Entry[];
}

/**
 * @interface SystemPromptConfig
 * @description Defines custom instructions that override default system and post-history prompts.
 * These fields help enforce character behavior by providing high-level context that the AI must follow.
 */
export interface SystemPromptConfig {
  /** A character-specific system prompt that may include the '{{original}}' placeholder
   * to incorporate the default system instructions.
   */
  system_prompt: string;
  /** Post-history instructions to be inserted after the conversation history.
   * Also supports the '{{original}}' placeholder for merging with user-defined instructions.
   */
  post_history_instructions: string;
}

/**
 * @interface CharacterData
 * @description Contains core character properties along with new V2 fields.
 * This includes basic character information (name, description, personality, etc.),
 * as well as advanced fields such as creator notes, system prompts, alternate greetings,
 * tags, and an optional character book for lore.
 */
export interface CharacterData {
  /** The character's display name. */
  name: string;
  /** Detailed description of the character to be included in every prompt. */
  description: string;
  /** A summary of the character's personality traits. */
  personality: string;
  /** The scenario or current context in which the character exists. */
  scenario: string;
  /** The character's first message (greeting) used at the start of a conversation. */
  first_mes: string;
  /** Example dialogues demonstrating the character's behavior; may include multiple examples. */
  mes_example: string;
  /** Out-of-character notes for the creator's reference (not injected into the prompt). */
  creator_notes: string;
  /** Custom system prompt that overrides the default system prompt. */
  system_prompt: string;
  /** Post-history instructions inserted after the conversation history (e.g., a jailbreak prompt). */
  post_history_instructions: string;
  /** Array of alternative greeting messages for additional variety. */
  alternate_greetings: string[];
  /** Array of tags for categorization and filtering purposes. */
  tags: string[];
  /** Identifier for the creator of the character card. */
  creator: string;
  /** Version of the character card (e.g., "1.0"). */
  character_version: string;
  /** Custom extension data for additional metadata at the character level. */
  extensions: Extensions;
  /** Optional character-specific lorebook containing background lore and dynamic entries. */
  character_book?: CharacterBook;
}

/**
 * @interface CharacterCardV2
 * @description Represents the top-level structure for a Character Card V2.
 * This interface encapsulates the entire definition of a character, including core data,
 * system-level instructions, lore, and any additional custom extensions.
 */
export interface CharacterCardV2 {
  /** Identifier for the spec; must be "chara_card_v2". */
  spec: string;
  /** Specification version; for Character Card V2, this is "2.0". */
  spec_version: string;
  /** Container for all character-specific fields and configurations. */
  data: CharacterData;
}
