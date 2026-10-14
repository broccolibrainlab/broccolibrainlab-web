// Tools and resources the lab has made for others to use. The Resources page lists them in this order.
// To add one, append an entry; the page shows an empty state while this list is empty.

export type Resource = {
  title: string;
  /** One or two plain sentences: what it does and who it's for. */
  description: string;
  /** A page on this site (e.g. "/resources/eeg-viewer/") or a full external URL (opens in a new tab). */
  href: string;
  /** Short labels such as "EEG", "Python" or "Web app". */
  tags?: readonly string[];
};

export const RESOURCES: readonly Resource[] = [
  {
    title: "Saliency map",
    description:
      "Add an image and see which parts are most likely to catch the eye first, or compare several side by side, using three classic models of bottom-up visual attention. Runs in your browser; images are never uploaded.",
    href: "/resources/saliency/",
    tags: ["Visual attention", "Images", "Web app"],
  },
];

export const isExternal = (href: string) => /^https?:\/\//.test(href);
