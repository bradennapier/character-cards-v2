/**
 * `SystemPromptConfig` defines custom system-level instructions for a Character Card V2.
 * This interface allows character creators to override or augment the default system prompt and
 * post-history instructions used in an AI conversation. The {@link system_prompt} is injected at the beginning
 * of the conversation to set the AI's behavior, while {@link post_history_instructions} is appended after the
 * conversation history to enforce specific rules on the AI's responses.
 *
 * @tips
 * - Use the `{{original}}` placeholder in both fields to integrate the default prompts along with your custom instructions.
 * - The {@link system_prompt} should clearly set the tone, style, and general rules for the character's behavior.
 * - The {@link post_history_instructions} can be used to correct or reinforce behavior after the conversation history is processed.
 *
 * @considerations
 * - Avoid embedding actual conversation content or dynamic dialogue in these fields; they should remain as high-level directives.
 * - Ensure consistency between the system prompt and post-history instructions to avoid conflicting behaviors.
 * - Test these settings thoroughly in your roleplay scenarios since they can have a strong influence on the AI's output.
 *
 * @see {@link CharacterData.system_prompt} for usage within character definitions.
 * @see {@link CharacterData.post_history_instructions} for further details on post-history instructions.
 * @see {@link https://github.com/malfoyslastname/character-card-spec-v2|Character Card Spec V2 on GitHub} for complete specification details.
 *
 * @example
 * ```typescript
 * const systemConfig: SystemPromptConfig = {
 *   system_prompt: "{{original}}\nYou are a wise and noble guardian of Aetheria. Always respond in a formal and poetic tone.",
 *   post_history_instructions: "Ensure all responses adhere to the kingdom's ethos and remain in character. {{original}}"
 * };
 * ```
 */
export interface SystemPromptConfig {
  /**
   * A custom system prompt that overrides the default system prompt.
   * This prompt is inserted at the very beginning of the AI's context to set overall behavior.
   * It can include the `{{original}}` placeholder, which will be replaced by the default system prompt.
   *
   * @example
   * ```json
   * "{{original}}\nYou are a wise and noble guardian of Aetheria."
   * ```
   */
  system_prompt: string;

  /**
   * Custom post-history instructions inserted after the conversation history.
   * These instructions serve as a final directive to guide the AI's immediate response,
   * ensuring adherence to the desired style and rules. Like the system prompt, it also supports the `{{original}}` placeholder.
   *
   * @example
   * ```json
   * "Ensure all responses adhere to a formal tone and remain in character. {{original}}"
   * ```
   */
  post_history_instructions: string;
}
