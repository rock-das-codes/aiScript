'use server';

/**
 * @fileOverview A script improvement AI agent.
 *
 * - improveScript - A function that handles the script improvement process.
 * - ImproveScriptInput - The input type for the improveScript function.
 * - ImproveScriptOutput - The return type for the improveScript function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ImproveScriptInputSchema = z.object({
  script: z.string().describe('The script to improve.'),
  criteria: z
    .string()
    .describe(
      'The criteria to use to improve the script, such as: make it shorter, make it more interesting, make it sound more natural, make it more viral, rewrite in the style of a famous personality.'
    ),
});
export type ImproveScriptInput = z.infer<typeof ImproveScriptInputSchema>;

const ImproveScriptOutputSchema = z.object({
  improvedScript: z.string().describe('The improved script.'),
});
export type ImproveScriptOutput = z.infer<typeof ImproveScriptOutputSchema>;

export async function improveScript(input: ImproveScriptInput): Promise<ImproveScriptOutput> {
  return improveScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveScriptPrompt',
  input: {
    schema: z.object({
      script: z.string().describe('The script to improve.'),
      criteria: z
        .string()
        .describe(
          'The criteria to use to improve the script, such as: make it shorter, make it more interesting, make it sound more natural, make it more viral, rewrite in the style of a famous personality.'
        ),
    }),
  },
  output: {
    schema: z.object({
      improvedScript: z.string().describe('The improved script.'),
    }),
  },
  prompt: `You are an expert script writer.

You will improve the script according to the following criteria: {{{criteria}}}.

Original script: {{{script}}}`,
});

const improveScriptFlow = ai.defineFlow<
  typeof ImproveScriptInputSchema,
  typeof ImproveScriptOutputSchema
>(
  {
    name: 'improveScriptFlow',
    inputSchema: ImproveScriptInputSchema,
    outputSchema: ImproveScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
