// Generates a greyscale favicon from the profile picture.
import sharp from 'sharp';

await sharp('public/hero/hero.png')
  .grayscale()
  .resize(256, 256, { fit: 'cover' })
  .png()
  .toFile('app/icon.png');

console.log('Wrote app/icon.png (greyscale favicon)');
