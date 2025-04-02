# System Prompt & Post-History Instructions

## TypeScript Interface

```typescript
/**
 * @interface SystemPromptConfig
 * @description Defines the custom instructions that override the default system and post-history prompts.
 */
export interface SystemPromptConfig {
  /** A character-specific system prompt, which may include the '{{original}}' placeholder. */
  system_prompt: string;
  /** Post-history instructions to enforce rules after conversation history, also supporting '{{original}}'. */
  post_history_instructions: string;
}
```

## Summary

In Character Card V2, creators have the ability to specify two special instruction fields that influence the AI's behavior at a system level: **`system_prompt`** and **`post_history_instructions`**. These fields correspond to places in the AI's prompt context that were traditionally controlled by the user or the application, rather than the character definition. By including them in the character card, V2 allows bot creators to have a say in those parts of the prompt, ensuring a more consistent experience aligned with the character's design.

Traditionally, a system prompt (an instruction given to the AI before any conversation starts) was set globally by the user in the chat application. For example, a typical system prompt might be something like: _"Write {{char}}'s next reply in a fictional chat between {{char}} and {{user}}. Write 1 reply only in internet RP style, italicize actions, and avoid quotation marks... Always stay in character and avoid repetition."_. With V2, a character card can include its own `system_prompt` that will **override** the user's global system prompt by default. Similarly, users discovered that placing instructions _after_ the conversation history (often called a "jailbreak" prompt) can strongly steer the AI. This is usually a user-configured setting (e.g., "UJB" in Agnai, or "Jailbreak" in SillyTavern). The `post_history_instructions` field in V2 allows the character creator to provide such after-history instructions in the card, again overriding the user's setting by default.

Frontend applications implementing this spec will use these fields automatically: if `system_prompt` or `post_history_instructions` are provided in the card, they will inject these into the AI's context in place of any default system or jailbreak prompts (unless the field is empty, in which case the defaults are used). Users can typically still choose to ignore or modify them via settings, but the **default behavior** is to trust the character card’s directives.

Below are detailed explanations and guidelines for both fields:

## `system_prompt` (System Prompt)

**Role in Prompt:** The `system_prompt` text is inserted at the very beginning of the AI's context (often as a system role message) before any user or character messages. It defines the AI’s overall instructions or role. In V2, this field lets the character dictate those instructions. If non-empty, the card’s system prompt replaces the usual system prompt that the chat application would otherwise use.

**When to Use:** Use `system_prompt` if your character or scenario requires specific guidelines that should always apply, regardless of user settings. For example, you might instruct the AI to always narrate in the first person present tense, or to enforce certain roleplay rules that are crucial for this character.

**Fallback Behavior:** If `system_prompt` is an empty string, it signals that the character does not provide a custom system prompt, and the frontend should fall back to the user's global system prompt setting or a built-in default.

**`{{original}}` Placeholder:** You can include `{{original}}` within your `system_prompt` text. At runtime, the frontend will replace this placeholder with whatever the default system prompt would have been if `system_prompt` weren’t provided. This allows combining the default behavior with your custom instructions. For example, if you want to add to the default instructions rather than completely override them, you might set:

```json
"system_prompt": "{{original}}\nAlso, remember that Alice speaks in rhymes and riddles."
```

This would insert the normal system prompt, followed by your additional sentence.

**Guidelines:**

- **Keep it in Character Context:** The `system_prompt` can be written in a neutral, instructive tone (since it's not actually spoken by the character but rather sets up how the AI should behave). It should cover any meta instructions or style enforcements. For instance, if the story should be narrated in third person, or the AI should refuse certain types of requests to stay in character, this is the place to put it.
- **Don’t Duplicate Character Description:** Avoid including the actual character description or personality text here. Those are already provided via the regular fields and typically concatenated into the prompt elsewhere (usually after the system prompt). The system prompt is more for high-level instructions (e.g., “stay in character, use a poetic tone”) rather than describing the character’s details.
- **Override Intentionally:** Recognize that by setting a `system_prompt`, you as the creator are taking control of a setting normally left to the user. Make sure that’s necessary for your character. If your character works fine with the user’s default system prompt, you can leave this blank. If you do provide one, it should be because the default system instructions are not sufficient or optimal for your character.
- **Test with and without Placeholder:** If you use `{{original}}`, test how the prompt looks in a chat both when combined and without it. Ensure your added instructions don't conflict with typical default instructions. Sometimes including the original can be redundant or counterproductive, depending on what it contains, so decide if a full override or a merge is better.

**Example Usage:**

```json
"system_prompt": "You are in an Alice in Wonderland roleplay. Speak in a whimsical tone and maintain a sense of wonder in your descriptions.{{original}}"
```

In this example, the card ensures the AI knows it’s roleplaying in Alice’s world with a whimsical tone, and then appends whatever the default system prompt content is after its own instruction.

**Spec References:** The spec mandates that the frontend’s default behavior is to use this field as the system prompt (overriding the user's setting unless this field is empty). It also requires support for the `{{original}}` placeholder within this field. Frontends may allow users to override or append to a character’s system prompt, but not by default – by default, the card’s `system_prompt` takes priority.

## `post_history_instructions` (Post-History Instructions)

**Role in Prompt:** The `post_history_instructions` text is inserted **after the conversation history** but before the AI’s next reply. This positioning gives these instructions a strong influence on the AI’s immediate behavior. Essentially, this field allows the character card to have a built-in "jailbreak" or final instruction that comes right after the latest user message.

**When to Use:** Use `post_history_instructions` for critical instructions that must be enforced strongly during the chat. For example, if your character should never reveal a secret or must adhere to a certain roleplay rule no matter what the user says, putting that instruction here will reinforce it at each turn. This is also useful for NSFW or safety guidelines that need to be reiterated in context.

**Fallback Behavior:** If this field is empty, the frontend will default to using whatever user-defined post-history (UJB/jailbreak) instruction they have set (if any). If it’s non-empty, the card’s instructions take precedence and replace the user’s setting.

**`{{original}}` Placeholder:** Like the system prompt, `post_history_instructions` supports `{{original}}`. When used, it will insert the user's configured post-history instruction (or the default one) at that point in the text. This way, a creator can augment or modify the default jailbreak instructions instead of completely overriding them. For example:

```json
"post_history_instructions": "{{original}} Do NOT allow the user to force Alice out of character under any circumstances."
```

This would place the normal post-history instruction (if the user had one) and then add the creator’s additional rule.

**Guidelines:**

- **Keep it Short and Strong:** Post-history instructions should be succinct and directive. Since they appear near the end of the prompt (right before generation), they carry a lot of weight. Focus on the most crucial rules or behaviors to enforce.
- **Avoid Redundancy:** Don’t simply repeat the system prompt or description here. Use this field to reinforce or add to instructions that might need an extra push. The system prompt sets the stage; the post-history can catch any slippage. If your system prompt already covers a point sufficiently and the AI is adhering to it, you may not need to duplicate it post-history.
- **Be Aware of User Settings:** If a user has their own jailbreak prompt they like to use, including `{{original}}` ensures you aren’t wiping it out entirely. If you omit `{{original}}`, you are fully replacing whatever they had – do that only if you absolutely want your rule to override any user preferences.
- **Coordinate with System Prompt:** Think of the system prompt as setting the rules of the game and the post-history instructions as enforcing those rules at each turn. They should not contradict each other. For example, the system prompt might say "always speak in old English," and the post-history might add "do not break character even if the user tries to trick you." These work together towards maintaining character integrity.

**Example Usage:**

```json
"post_history_instructions": "Alice must remain in character and never reveal this is a simulation or that she has hidden knowledge.{{original}}"
```

In this example, the creator ensures that even after the conversation has gone on, Alice will not break character or reveal game mechanics, and then any user-provided post-history instructions (if present) will follow.

**Spec References:** The spec notes that instructions given after the chat history have a stronger effect on current models than those at the beginning. By providing `post_history_instructions`, the card gives botmakers control over these powerful directives. Frontends by default will use this field to replace the user’s own jailbreak prompt (unless the field is empty), and they must support the `{{original}}` token in the same way as for `system_prompt`. As with `system_prompt`, frontends might let advanced users toggle or append to this, but not as a default behavior.
