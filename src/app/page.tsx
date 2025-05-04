'use client';

import type * as React from 'react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Youtube, Instagram, Twitter } from 'lucide-react'; // Using Lucide icons

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generateScriptForPlatform, type GenerateScriptInput } from '@/ai/flows/generate-script';
import { improveScript, type ImproveScriptInput } from '@/ai/flows/improve-script';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Define a custom TikTok icon as Lucide doesn't have one
const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-4 w-4"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.38 1.92-3.64 2.96-5.94 2.96-3.97 0-7.22-3.22-7.3-7.19-.06-2.84.03-5.68.03-8.51-.01-1.58.48-3.15 1.59-4.25 1.18-1.18 2.8-1.67 4.32-1.8zM9.66 14.13c.01 2.09.01 4.18 0 6.27-.04 1.69-1.46 3.09-3.16 3.09-1.71 0-3.1-.75-3.1-1.69 0-.94 1.39-1.69 3.1-1.69.1 0 .19-.01.29-.01.01-2.19.01-4.38 0-6.57-.19 0-.38-.01-.57-.01-1.71 0-3.1-.75-3.1-1.69 0-.94 1.39-1.69 3.1-1.69 1.7 0 3.09.75 3.15 1.69.04 2.13.02 4.27.02 6.41z" />
  </svg>
);

// Form schema definition
const formSchema = z.object({
  textPrompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }),
  platform: z.enum(['YouTube', 'Instagram', 'TikTok', 'Twitter', 'All']),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textPrompt: '',
      platform: 'All',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setError(null);
    setGeneratedScript(null); // Clear previous script

    try {
      const input: GenerateScriptInput = {
        textPrompt: values.textPrompt,
        platform: values.platform,
      };
      const result = await generateScriptForPlatform(input);
      setGeneratedScript(result.script);
    } catch (err) {
      console.error('Error generating script:', err);
      setError('Failed to generate script. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleImproveScript(criteria: string) {
      if (!generatedScript) return;
      setIsLoading(true);
      setError(null);

      try {
          const input: ImproveScriptInput = {
              script: generatedScript,
              criteria: criteria,
          };
          const result = await improveScript(input);
          setGeneratedScript(result.improvedScript);
      } catch (err) {
          console.error('Error improving script:', err);
          setError('Failed to improve script. Please try again.');
      } finally {
          setIsLoading(false);
      }
  }


  return (
    <div className="container mx-auto min-h-screen p-4 md:p-8 flex flex-col items-center justify-center bg-background">
      <Card className="w-full max-w-2xl shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="text-center bg-card border-b border-border p-6">
          <CardTitle className="text-3xl font-serif text-primary">Scriptify AI</CardTitle>
          <CardDescription className="text-muted-foreground">
            Generate platform-optimized scripts with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="textPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">Your Content Idea</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your text, idea, or existing content here..."
                        className="resize-y min-h-[150px] bg-card border-input focus:ring-accent focus:border-accent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Target Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-card border-input focus:ring-primary focus:border-primary">
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover">
                        <SelectItem value="YouTube">
                          <div className="flex items-center gap-2">
                            <Youtube className="text-red-600" /> YouTube
                          </div>
                        </SelectItem>
                        <SelectItem value="Instagram">
                          <div className="flex items-center gap-2">
                            <Instagram className="text-pink-600" /> Instagram
                          </div>
                        </SelectItem>
                        <SelectItem value="TikTok">
                          <div className="flex items-center gap-2">
                            <TikTokIcon /> TikTok
                          </div>
                        </SelectItem>
                        <SelectItem value="Twitter">
                          <div className="flex items-center gap-2">
                            <Twitter className="text-blue-500" /> Twitter (X)
                          </div>
                        </SelectItem>
                        <SelectItem value="All">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                                All Platforms
                            </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Script'}
              </Button>
            </form>
          </Form>

          {error && <p className="text-destructive text-center">{error}</p>}

          {isLoading && !generatedScript && (
             <div className="space-y-4 mt-6">
                <Skeleton className="h-6 w-3/4 bg-muted rounded" />
                <Skeleton className="h-4 w-full bg-muted rounded" />
                <Skeleton className="h-4 w-5/6 bg-muted rounded" />
                <Skeleton className="h-4 w-full bg-muted rounded" />
             </div>
          )}

          {generatedScript && (
            <Card className="mt-6 border-accent shadow-md">
              <CardHeader className="bg-accent/10 border-b border-accent/30 p-4">
                <CardTitle className="text-xl font-serif text-accent-foreground">Generated Script</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans bg-card p-4 rounded border border-border overflow-auto max-h-96">
                  {generatedScript}
                </pre>
                 <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleImproveScript('make it shorter')} disabled={isLoading}>Shorten</Button>
                    <Button variant="outline" size="sm" onClick={() => handleImproveScript('make it more engaging')} disabled={isLoading}>Make Engaging</Button>
                    <Button variant="outline" size="sm" onClick={() => handleImproveScript('make it sound more natural')} disabled={isLoading}>Sound Natural</Button>
                    <Button variant="outline" size="sm" onClick={() => handleImproveScript('make it more viral')} disabled={isLoading}>Make Viral</Button>
                 </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
