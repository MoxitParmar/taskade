import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { toast } from "sonner";
import { Tag, TagInput } from "emblor";

const FormSchema = z.object({
  topics: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
});

export default function MultiInput({ organization, setOpen }: any) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [tags, setTags] = React.useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(
    null,
  );

  const { setValue } = form;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
 
      await organization.inviteMembers({
        emailAddresses: data.topics.map((t) => t.text),
        role: "org:member",
      });
      toast.success("Invitations sent successfully!");
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast.error("Failed to send invitations");
    }
  }
  

  return (
    <section className="z-10 w-full flex flex-col items-center text-center gap-5">
      <div id="try" className="w-full">
        <div className="w-full relative  flex flex-col space-y-2">
          <div className="preview flex mt-5 w-full justify-center  items-center  ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 flex flex-col items-start"
              >
                <FormField
                  control={form.control}
                  name="topics"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel className="text-left">Enter Emails</FormLabel>
                      <FormControl className="w-full ">
                        <TagInput
                          {...field}
                          placeholder="Enter an email"
                          tags={tags}
                          className="sm:min-w-[450px]"
                          // Make tags look like outlined pill buttons and enlarge input
                          variant="outline"
                          shape="pill"
                          borderStyle="default"
                          size="sm"
                          styleClasses={{
                            inlineTagsContainer: 'min-h-[56px] ',
                            tag: {
                              body: 'bg-accent border-primary text-accent-foreground  rounded-full ',
                              closeButton: ' text-sm cursor-pointer',
                            },
                            input: 'h-12 text-base px-3',
                          }}
                          setTags={(newTags) => {
                            setTags(newTags);
                            setValue("topics", newTags as [Tag, ...Tag[]]);
                          }}
                          activeTagIndex={activeTagIndex}
                          setActiveTagIndex={setActiveTagIndex}
                        />
                      </FormControl>
                      <FormDescription className="text-left">
                        Add the email addresses of the people you want to
                        invite, then click invite.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Invite</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
