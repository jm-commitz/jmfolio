export const GITHUB_USERNAME = 'jm-commitz';

/**
 * Live GitHub profile picture — changing it on GitHub updates the site.
 * Load it unoptimized: the Next image cache here lasts a year, which would
 * freeze an old picture.
 */
export const githubAvatar = (size = 256, user = GITHUB_USERNAME) =>
  `https://github.com/${user}.png?size=${size}`;
