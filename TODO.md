# TODO List

### Navbar Overhaul

- ~~menu should be default to closed on mobile~~ | (should be fixed - Glare)
- Consider better approaches for icons (added astro-icon for footer). their colors are wrong
- ~~fix social icons not loading~~ | (should be fixed - Glare)
- nav dropdown transition?

### Misc

- Verify if `windicss/plugin/aspect-ratio` is necessary for anything.
- ~~Auto-generate a `sitemap.xml`.~~
- Determine which pages should be marked as `prerendered = false`
- Investigate if there's some way we can introduce the SWR 10 minute cache on the server-side since the `prerendered = false` pages will render on-demand.
- Allow indexing in robots.txt (Disallow: / => Allow: /)
- Verify if the sitemap urls are correct.

### Team Page & Sponsor Page

- Double-check that the contributor fetching logic is correct.
- Integrate logic for `onError`/`onLoad` for images.
- Fix CSS styling for images (currently looks off).

### Guidelines Page

- ~~Fix the alignment of the CC BY SA icons at the bottom. (kinda fixed, just icons in general are ugly)~~

### RemoteImageWrapper

- Make any necessary adjustments.

### Software Pages

- Integrate proper prop fetching for version groups and other relevant data.

### Software Header

- Utilize named slots since Waterfall takes in a component for the header and description.

### Software Download

- ~~project icons~~ (should be fixed - Glare)
- waterfall eol message (similar problem as the software header)
- actual logic, download button, etc
- fix the added spaces before and after parentheses in the build changes
- fix "16 hours ago" turning into "16 hours (newline) ago"
