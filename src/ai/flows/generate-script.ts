'use server';

/**
 * @fileOverview Script generation AI agent for various platforms.
 *
 * - generateScriptForPlatform - A function that generates a script tailored for a specific platform.
 * - GenerateScriptInput - The input type for the generateScriptForPlatform function.
 * - GenerateScriptOutput - The return type for the generateScriptForPlatform function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateScriptInputSchema = z.object({
  textPrompt: z.string().describe('The input text prompt for generating the script.'),
  platform: z
    .enum(['YouTube', 'Instagram', 'TikTok', 'Twitter', 'All'])
    .describe('The platform for which the script should be tailored.'),
});
export type GenerateScriptInput = z.infer<typeof GenerateScriptInputSchema>;

const GenerateScriptOutputSchema = z.object({
  script: z.string().describe('The generated script tailored for the specified platform.'),
});
export type GenerateScriptOutput = z.infer<typeof GenerateScriptOutputSchema>;

export async function generateScriptForPlatform(
  input: GenerateScriptInput
): Promise<GenerateScriptOutput> {
  return generateScriptForPlatformFlow(input);
}

const generateScriptPrompt = ai.definePrompt({
  name: 'generateScriptPrompt',
  input: {
    schema: z.object({
      textPrompt: z.string().describe('The input text prompt.'),
      platform: z.string().describe('The platform for which the script should be tailored.'),
    }),
  },
  output: {
    schema: z.object({
      script: z.string().describe('The generated script.'),
    }),
  },
  prompt: `You are an expert script writer, adept at tailoring content for various social media platforms.

  Based on the provided text prompt, generate a script optimized for the specified platform.

  Text Prompt: {{{textPrompt}}}
  Platform: {{{platform}}}

  Script:`, // Removed freemarker syntax
});

const generateScriptForPlatformFlow = ai.defineFlow<
  typeof GenerateScriptInputSchema,
  typeof GenerateScriptOutputSchema
>(
  {
    name: 'generateScriptForPlatformFlow',
    inputSchema: GenerateScriptInputSchema,
    outputSchema: GenerateScriptOutputSchema,
  },
  async input => {
    const {output} = await generateScriptPrompt(input);
    return output!;
  }
);
