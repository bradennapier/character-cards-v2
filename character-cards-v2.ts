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
 * @description Represents an individual lore entry in the Character Book.
 * Lore entries provide dynamic background or contextual information that can be injected
 * into the AI's prompt when certain keywords are triggered.
 */
export interface Entry {
  /** List of primary trigger keywords that activate this lore entry. */
  keys: string[];
  /** The lore text to be injected into the prompt when triggered. */
  content: string;
  /** Custom extension data specific to this entry. */
  extensions: Extensions;
  /** Flag indicating whether this entry is active; if false, it will be ignored. */
  enabled: boolean;
  /** Numeric value controlling the ordering of entries when multiple are triggered.
   * Lower values indicate earlier insertion.
   */
  insertion_order: number;
  /** Optional flag for case-sensitive keyword matching (default is false). */
  case_sensitive?: boolean;
  /** Optional internal name for identification (not used in prompt generation). */
  name?: string;
  /** Optional priority value for dropping the entry if the token budget is exceeded.
   * Lower numbers denote less critical entries.
   */
  priority?: number;
  /** Optional internal identifier for the entry. */
  id?: number;
  /** Optional comment or note about the entry for human reference. */
  comment?: string;
  /** If true, both a primary and secondary key must be present to trigger this entry. */
  selective?: boolean;
  /** Optional secondary trigger keywords; used only when 'selective' is true. */
  secondary_keys?: string[];
  /** If true, this entry is always injected into the prompt regardless of triggers. */
  constant?: boolean;
  /** Specifies the insertion position relative to the character's main definition.
   * Allowed values: "before_char" or "after_char".
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
