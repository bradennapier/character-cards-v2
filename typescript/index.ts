import type { CharacterData } from './character-data';

/**
 * `CharacterCardV2` represents the top-level structure for a Character Card V2 object.
 * This interface is the entry point for defining a character using the Character Card V2 specification.
 * It encapsulates metadata about the specification (such as {@link CharacterCardV2.spec} and {@link CharacterCardV2.spec_version}) and the core character
 * data defined by the {@link CharacterData} interface.
 *
 * @tips
 * - Ensure the {@link CharacterCardV2.spec} field is always set to `"chara_card_v2"` and {@link CharacterCardV2.spec_version} to `"2.0"` to comply with the specification.
 * - The {@link CharacterCardV2.data} property must adhere to the {@link CharacterData} interface, so refer to it for details on each field.
 * - Validate your object against this interface to ensure compatibility with tools and frontends that process Character Card V2.
 *
 * @considerations
 * - When updating a character, update the {@link CharacterData.character_version} to reflect the changes.
 * - Use descriptive language in the {@link CharacterData.description} and {@link CharacterData.personality} fields to maximize the AI’s understanding during roleplay.
 *
 * @see {@link CharacterData} for detailed information on core character properties.
 * @see {@link https://github.com/malfoyslastname/character-card-spec-v2|Character Card Spec V2 on GitHub} for further details.
 *
 * @example
 * ```typescript
 * // Example usage of CharacterCardV2:
 * const characterCard: CharacterCardV2 = {
 *   spec: "chara_card_v2",
 *   spec_version: "2.0",
 *   data: {
 *     name: "Queen Seraphina",
 *     description: "Queen Seraphina rules Aetheria with wisdom and grace, inspiring loyalty and respect throughout the land.",
 *     personality: "Authoritative, wise, and compassionate.",
 *     scenario: "Inside the royal palace during a council meeting.",
 *     first_mes: "Greetings, loyal subject. I am Queen Seraphina.",
 *     mes_example: "<START>\n{{user}}: Your majesty, what do you decree?\n{{char}}: Unity and strength shall guide us.",
 *     creator_notes: "This character should evoke regal authority and subtle vulnerability.",
 *     system_prompt: "{{original}}\nYou are Queen Seraphina of Aetheria, speak formally.",
 *     post_history_instructions: "Maintain royal decorum and authority at all times. {{original}}",
 *     alternate_greetings: [
 *       "Welcome to the court, I am Queen Seraphina.",
 *       "Hail, loyal subject. I am your queen."
 *     ],
 *     tags: ["royalty", "Aetheria", "leader"],
 *     creator: "ElyndriaTales",
 *     character_version: "1.0",
 *     extensions: { "theme_color": "#D4AF37" },
 *     character_book: {
 *       name: "Royal Annals",
 *       description: "Contains lore of the royal lineage and key events that shaped Aetheria.",
 *       scan_depth: 50,
 *       token_budget: 300,
 *       recursive_scanning: false,
 *       extensions: {},
 *       entries: [] // Refer to {@link Entry} for the structure of lore entries
 *     }
 *   }
 * };
 * ```
 */
export interface CharacterCardV2 {
  /**
   * Identifier for the specification. Must always be `"chara_card_v2"`.
   *
   * @example
   * ```json
   * "chara_card_v2"
   * ```
   */
  spec: string;

  /**
   * The version of the specification. For Character Card V2, this is `"2.0"`.
   *
   * @example
   * ```json
   * "2.0"
   * ```
   */
  spec_version: string;

  /**
   * The core data for the character, as defined by the {@link CharacterData} interface.
   * This property contains all essential character information including basic details,
   * dialogue examples, system-level prompts, and an optional lorebook.
   */
  data: CharacterData;
}
