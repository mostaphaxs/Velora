"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useEffect, useState, type ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

// Edge-to-edge row of product cards with a progress bar between the arrows.
// The row starts at the page margin and runs off the right edge of the screen.
export function ProductRail({ children }: { children: ReactNode }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const snapCount = api?.scrollSnapList().length ?? 1;

  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  const thumbWidth = 100 / Math.max(snapCount, 1);

  return (
    <Carousel setApi={setApi} opts={{ align: "start", containScroll: "trimSnaps" }}>
      <CarouselContent className="-ml-5 py-3 pr-4 pl-4 sm:pl-6 lg:pl-10">
        {Children.map(children, (child) => (
          <CarouselItem className="basis-[78%] pl-5 sm:basis-[45%] md:basis-[34%] lg:basis-[26%] xl:basis-[19%]">
            {child}
          </CarouselItem>
        ))}
      </CarouselContent>

      {snapCount > 1 && (
        <div className="mt-10 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={selected === 0}
            aria-label="Previous products"
            className="p-1 text-ink transition-opacity disabled:opacity-30"
          >
            <ChevronLeft className="size-5" strokeWidth={1.25} />
          </button>
          <div className="relative h-px w-56 bg-ink/25 sm:w-72" aria-hidden="true">
            <span
              className="absolute -top-px h-[3px] bg-ink transition-[left] duration-300"
              style={{ width: `${thumbWidth}%`, left: `${selected * thumbWidth}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={selected >= snapCount - 1}
            aria-label="Next products"
            className="p-1 text-ink transition-opacity disabled:opacity-30"
          >
            <ChevronRight className="size-5" strokeWidth={1.25} />
          </button>
        </div>
      )}
    </Carousel>
  );
}
