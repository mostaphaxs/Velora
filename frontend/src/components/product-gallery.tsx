"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useProductColor } from "@/components/product-color";
import { ProductImage } from "@/components/product-image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

const sizes = "(min-width: 768px) 50vw, 100vw";

// Photo gallery for the product page. Shows the selected color's photos when it has any,
// otherwise the product's general photos.
export function ProductGallery({
  product,
}: {
  product: Pick<Product, "name" | "image" | "images" | "category">;
}) {
  const { selected } = useProductColor();
  const colorImages = selected?.images ?? [];
  const images = colorImages.length > 0 ? colorImages : product.images;

  // A new key per photo set restarts the carousel on the first photo
  return (
    <GalleryView
      key={colorImages.length > 0 ? selected?.name : "default"}
      name={product.name}
      category={product.category}
      images={images.length > 0 ? images : product.image ? [product.image] : []}
    />
  );
}

// Swipeable photo gallery with thumbnails. Falls back to a single image when there is only one.
function GalleryView({
  name,
  category,
  images,
}: {
  name: string;
  category: string;
  images: string[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (images.length <= 1) {
    return (
      <ProductImage product={{ name, category, image: images[0] ?? null }} sizes={sizes} priority />
    );
  }

  return (
    <div>
      <Carousel setApi={setApi} className="group/gallery">
        <CarouselContent className="ml-0">
          {images.map((src, index) => (
            <CarouselItem key={src} className="pl-0">
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                <Image
                  src={src}
                  alt={`${name}, photo ${index + 1}`}
                  fill
                  sizes={sizes}
                  preload={index === 0}
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 bg-ivory/90 opacity-0 transition-opacity group-hover/gallery:opacity-100 disabled:opacity-0" />
        <CarouselNext className="right-3 bg-ivory/90 opacity-0 transition-opacity group-hover/gallery:opacity-100 disabled:opacity-0" />
      </Carousel>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            aria-label={`Show photo ${index + 1}`}
            aria-current={index === current}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "relative aspect-[4/5] overflow-hidden bg-sand outline-offset-2 transition-opacity",
              index === current ? "outline outline-gold" : "opacity-60 hover:opacity-100",
            )}
          >
            <Image src={src} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
