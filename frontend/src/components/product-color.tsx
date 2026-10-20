"use client";

import { useSearchParams } from "next/navigation";
import { createContext, use, useState, type ReactNode } from "react";
import type { ProductColor } from "@/lib/api";
import { cn } from "@/lib/utils";

type ColorContext = {
  colors: ProductColor[];
  selected: ProductColor | null;
  select: (name: string) => void;
};

const ProductColorContext = createContext<ColorContext>({
  colors: [],
  selected: null,
  select: () => {},
});

// Shares the chosen color between the gallery, the color picker and the add-to-cart button.
export function ProductColorProvider({
  colors,
  children,
}: {
  colors: ProductColor[];
  children: ReactNode;
}) {
  // Start on the color picked on a product card (?color=Gold), else the first one in stock
  const requested = useSearchParams().get("color");
  const [selectedName, setSelectedName] = useState(
    () =>
      colors.find((color) => color.name === requested)?.name ??
      (colors.find((color) => color.inStock) ?? colors[0])?.name ??
      null,
  );
  const selected = colors.find((color) => color.name === selectedName) ?? null;

  return (
    <ProductColorContext value={{ colors, selected, select: setSelectedName }}>
      {children}
    </ProductColorContext>
  );
}

export function useProductColor() {
  return use(ProductColorContext);
}

// Round swatches. Sold-out colors stay visible but crossed out, with a message when picked.
export function ColorPicker() {
  const { colors, selected, select } = useProductColor();
  if (colors.length === 0) return null;

  return (
    <div className="mt-8">
      <p className="text-sm">
        Color: <span className="text-taupe">{selected?.name}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Color">
        {colors.map((color) => {
          const isSelected = color.name === selected?.name;
          return (
            <button
              key={color.name}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={color.inStock ? color.name : `${color.name}, sold out`}
              title={color.inStock ? color.name : `${color.name} (sold out)`}
              onClick={() => select(color.name)}
              className={cn(
                "relative size-9 rounded-full ring-offset-2 ring-offset-ivory transition",
                isSelected ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-ink/50",
              )}
            >
              <span
                className={cn("absolute inset-1 rounded-full", !color.inStock && "opacity-40")}
                style={{ backgroundColor: color.hex }}
              />
              {!color.inStock && (
                // Diagonal line across sold-out colors
                <span className="absolute top-1/2 left-1/2 h-px w-10 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-ink/70" />
              )}
            </button>
          );
        })}
      </div>
      {selected && !selected.inStock && (
        <p className="mt-3 text-sm text-destructive" role="status">
          Sold out in {selected.name}. Please choose another color.
        </p>
      )}
      {selected?.inStock && selected.onlyLeft !== null && (
        <p className="mt-3 text-sm text-gold-dark" role="status">
          Only {selected.onlyLeft} left in {selected.name}
        </p>
      )}
    </div>
  );
}
