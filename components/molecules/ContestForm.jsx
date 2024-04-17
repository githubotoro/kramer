"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import toast from "react-hot-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CreateContest } from "../db/CreateContest";
import { useRouter } from "next/navigation";
import { useStore } from "../store";

export function ContestForm() {
  const router = useRouter();
  const { pageLoading, setPageLoading } = useStore();

  const [loading, setLoading] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(0);

  const form = useForm({
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    if (values.title.trim() === "") {
      toast.error("Contest title is missing.");
    } else if (!values.endTimestamp) {
      toast.error("Contest end time is missing.");
    } else {
      const title = values.title.trim();
      const endTimestamp = values.endTimestamp;
      const date = new Date(endTimestamp);
      const utcTimestamp = date.getTime();

      const backgroundUrl = backgrounds[selectedBackground];
      const backgroundBlob = await fetch(backgroundUrl).then((response) =>
        response.blob()
      );
      const backgroundName = backgroundUrl.substring(
        backgroundUrl.lastIndexOf("/") + 1
      );
      const backgroundExtension = backgroundName.split(".").pop();
      const backgroundFile = new File([backgroundBlob], backgroundName, {
        type: `image/${backgroundExtension}`,
      });

      const res = await CreateContest({
        title,
        endTimestamp: utcTimestamp,
        background: backgroundFile,
      });

      if (res.status === true) {
        toast.success("Contest is live 🎉");
        setPageLoading(true);
        router.push(`/contest/${res.contest_id}`);
      } else {
        toast.error("Something went wrong.");
      }
    }
    setLoading(false);
  };

  const getImageData = (event) => {
    const dataTransfer = new DataTransfer();

    Array.from(event.target.files).forEach((image) =>
      dataTransfer.items.add(image)
    );

    const files = dataTransfer.files;
    const displayUrl = URL.createObjectURL(event.target.files[0]);
    const background = event.target.files[0];

    if (!backgrounds.includes(displayUrl)) {
      setBackgrounds([displayUrl, ...backgrounds]);
      setSelectedBackground(0);
    }

    return { background, files, displayUrl };
  };

  const SUPABASE_BASE_IMAGE_URL =
    "https://hmadfbpysysgbkwcdnmo.supabase.co/storage/v1/object/public/background/";

  const [backgrounds, setBackgrounds] = useState([
    `${SUPABASE_BASE_IMAGE_URL}/1.jpg`,
    `${SUPABASE_BASE_IMAGE_URL}/2.jpg`,
    `${SUPABASE_BASE_IMAGE_URL}/3.jpg`,
    `${SUPABASE_BASE_IMAGE_URL}/4.jpg`,
    `${SUPABASE_BASE_IMAGE_URL}/5.jpg`,
  ]);

  return (
    <React.Fragment>
      <div className="mt-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">
                    ✍️ Contest Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="Ex. Will Trump win elections?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTimestamp"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="font-semibold text-gray-700">
                    ⌛ Ends On
                  </FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP HH:mm:ss")
                          ) : (
                            <span>Pick the contest end time</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <DateTimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="background"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">
                    🖼️ Background
                  </FormLabel>
                  <div className="w-full px-12">
                    <Carousel className="w-full">
                      <CarouselContent className="-ml-1">
                        {backgrounds.map((backgroundUrl, index) => (
                          <CarouselItem
                            key={index}
                            className="pl-1 md:basis-1/2 lg:basis-1/3"
                          >
                            <div className="p-1">
                              <Card>
                                <CardContent
                                  onClick={() => {
                                    setSelectedBackground(index);
                                  }}
                                  className="relative cursor-pointer group flex p-0 aspect-video items-center justify-center overflow-hidden rounded-xl"
                                >
                                  <img
                                    src={backgroundUrl}
                                    alt="background image"
                                    className="object-cover group-hover:scale-125 transition-all duration-200 ease-in-out w-full h-full"
                                  />

                                  {selectedBackground === index && (
                                    <div className="absolute text-2xl w-full h-full bg-black bg-opacity-50 flex flex-col items-center place-content-center pointer-events-none">
                                      ✅
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>

                  <FormControl className="cursor-pointer">
                    <Input
                      id="background"
                      accept="image/*"
                      className="h-8 bg-white cursor-pointer"
                      type="file"
                      onChange={(event) => {
                        const { files, displayUrl } = getImageData(event);
                        onChange(files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              {loading === true ? "Creating Contest" : "Submit"}
              {loading === true && (
                <div
                  class="inline-block ml-2 h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                  role="status"
                >
                  <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </React.Fragment>
  );
}
