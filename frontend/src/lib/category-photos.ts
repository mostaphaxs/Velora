// Category photos in public/categories/<slug>-v8.jpg: unedited stock photos (Pexels) chosen for
// natural cream and warm-white backgrounds, only cropped to the 3:4 tile shape.
// When replacing the photos, bump the version so browsers and the image cache pick them up.
const PHOTO_VERSION = "v8";
const categoryPhotos = new Set(["rings", "chains", "bags", "earrings", "bracelets"]);

export function getCategoryPhoto(slug: string) {
  return categoryPhotos.has(slug) ? `/categories/${slug}-${PHOTO_VERSION}.jpg` : null;
}
