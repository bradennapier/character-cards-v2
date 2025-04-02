import type { Extensions } from './extensions';
import type { CharacterBook } from './character-book';
import type { SystemPromptConfig } from './system-prompt';

/**
 * `CharacterData` contains core character properties along with new V2 fields. This interface
 * defines all the necessary data to represent a character in the Character Card V2 format.
 * It includes basic properties such as name, description, and personality, as well as advanced
 * fields such as creator notes, system prompts, alternate greetings, tags, and an optional character book.
 *
 *
 * @tips
 * - Ensure that all required fields (such as {@link name}, {@link description}, {@link personality}, etc.) are provided
 *   with in-universe data to maintain consistency.
 * - Use descriptive and evocative language in fields like {@link description} and {@link personality} so the AI
 *   has ample context to generate immersive responses.
 * - Utilize the {@link SystemPromptConfig} interface for guidance on setting up system and post-history prompts.
 * - If additional context is needed, link related lore by defining a {@link CharacterBook} with relevant {@link Entry} objects.
 *
 * @considerations
 * - Consistency is key: ensure that the tone and style across fields remain uniform to reinforce the character's identity.
 * - The {@link first_mes} field is critical for initiating conversations; it should be engaging and in character.
 * - Use the {@link Extensions} interface to safely add custom metadata without interfering with core functionality.
 * - Always test the character data in your AI application to verify that all fields interact as expected.
 *
 * @see {@link CharacterBook} for details on the optional lorebook.
 * @see {@link Entry} for the structure of individual lore entries.
 * @see {@link SystemPromptConfig} for guidance on system-level directives.
 * @see {@link Extensions} for storing additional metadata.
 * @see {@link https://github.com/malfoyslastname/character-card-spec-v2|Character Card Spec V2 on GitHub} for the complete specification.
 *
 * @example
 * ```typescript
 * const characterDataExample: CharacterData = {
 *   name: "Queen Seraphina",
 *   description: "Queen Seraphina rules Aetheria with wisdom and grace, inspiring loyalty and respect throughout the land.",
 *   personality: "Authoritative, wise, and compassionate.",
 *   scenario: "Inside the royal palace during a council meeting.",
 *   first_mes: "Greetings, loyal subject. I am Queen Seraphina.",
 *   mes_example: "<START>\n{{user}}: Your majesty, what do you decree?\n{{char}}: Unity and strength shall guide us.",
 *   creator_notes: "This character should evoke regal authority and subtle vulnerability.",
 *   system_prompt: "{{original}}\nYou are Queen Seraphina of Aetheria, speak formally.",
 *   post_history_instructions: "Maintain royal decorum and authority at all times. {{original}}",
 *   alternate_greetings: [
 *     "Welcome to the court, I am Queen Seraphina.",
 *     "Hail, loyal subject. I am your queen."
 *   ],
 *   tags: ["royalty", "Aetheria", "leader"],
 *   creator: "ElyndriaTales",
 *   character_version: "1.0",
 *   extensions: { "theme_color": "#D4AF37" },
 *   character_book: {
 *     name: "Royal Annals",
 *     description: "Contains lore of the royal lineage and key events that shaped Aetheria.",
 *     scan_depth: 50,
 *     token_budget: 300,
 *     recursive_scanning: false,
 *     extensions: {},
 *     entries: [] // See {@link Entry} for entry structure
 *   }
 * };
 * ```
 */
export interface CharacterData {
  /**
   * The character's display name.
   *
   * @example
   * ```json
   * "Queen Seraphina"
   * ```
   */
  name: string;

  /**
   * A detailed description of the character.
   * This should include background, appearance, and key traits to inform the AI of the character's essence.
   *
   * @example
   * ```json
   * "Queen Seraphina rules Aetheria with wisdom and grace, inspiring loyalty and respect throughout the land."
   * ```
   */
  description: string;

  /**
   * A concise summary of the character's personality traits.
   * This helps the AI capture the character's mannerisms and behavioral patterns.
   *
   * @example
   * ```json
   * "Authoritative, wise, and compassionate."
   * ```
   */
  personality: string;

  /**
   * The scenario or context in which the character exists.
   * This field sets the scene for the conversation and provides situational context.
   *
   * @example
   * ```json
   * "Inside the royal palace during a council meeting."
   * ```
   */
  scenario: string;

  /**
   * The character's first message (greeting) at the start of a conversation.
   * This message is used by the AI to initiate dialogue.
   *
   * @example
   * ```json
   * "Greetings, loyal subject. I am Queen Seraphina."
   * ```
   */
  first_mes: string;

  /**
   * Example dialogues demonstrating the character's typical interactions.
   * These examples guide the AI on the character's style of communication.
   *
   * @example
   * ```json
   * "<START>\n{{user}}: Your majesty, what do you decree?\n{{char}}: Unity and strength shall guide us."
   * ```
   */
  mes_example: string;

  /**
   * Out-of-character notes intended for the creator's reference.
   * This field is not injected into the prompt and is used solely for human guidance.
   *
   * @example
   * ```json
   * "This character should evoke regal authority and subtle vulnerability."
   * ```
   */
  creator_notes: string;

  /**
   * A custom system prompt that overrides the default system prompt.
   * See {@link SystemPromptConfig.system_prompt} for more details.
   *
   * @example
   * ```json
   * "{{original}}\nYou are Queen Seraphina of Aetheria, speak formally."
   * ```
   */
  system_prompt: string;

  /**
   * Custom post-history instructions inserted after the conversation history.
   * See {@link SystemPromptConfig.post_history_instructions} for more details.
   *
   * @example
   * ```json
   * "Maintain royal decorum and authority at all times. {{original}}"
   * ```
   */
  post_history_instructions: string;

  /**
   * An array of alternative greeting messages.
   * These provide additional options for the character's opening lines.
   *
   * @example
   * ```json
   * ["Welcome to the court, I am Queen Seraphina.", "Hail, loyal subject. I am your queen."]
   * ```
   */
  alternate_greetings: string[];

  /**
   * An array of tags for categorization and filtering purposes.
   *
   * @example
   * ```json
   * ["royalty", "Aetheria", "leader"]
   * ```
   */
  tags: string[];

  /**
   * Identifier for the creator of the character card.
   *
   * @example
   * ```json
   * "ElyndriaTales"
   * ```
   */
  creator: string;

  /**
   * The version of the character card, represented as a string.
   *
   * @example
   * ```json
   * "1.0"
   * ```
   */
  character_version: string;

  /**
   * Custom extension data for additional metadata at the character level.
   * See {@link Extensions} for guidelines on storing extra information.
   *
   * @example
   * ```json
   * { "theme_color": "#D4AF37" }
   * ```
   */
  extensions: Extensions;

  /**
   * Optional character-specific lorebook containing background details and dynamic lore entries.
   * Use {@link CharacterBook} to structure this field.
   *
   * @example
   * ```json
   * {
   *   "name": "Royal Annals",
   *   "description": "Contains lore of the royal lineage.",
   *   "scan_depth": 50,
   *   "token_budget": 300,
   *   "recursive_scanning": false,
   *   "extensions": {},
   *   "entries": []
   * }
   * ```
   */
  character_book?: CharacterBook;
}
