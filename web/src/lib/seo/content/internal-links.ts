import { getContentByCanonical } from "./registry";
import type { RelatedLink, SeoContent } from "./schemas";

export type ResolvedInternalLink = RelatedLink & {
  content?: SeoContent;
};

export function resolveInternalLink(link: RelatedLink): ResolvedInternalLink {
  return {
    ...link,
    content: getContentByCanonical(link.path),
  };
}

export function resolveRelatedLinks(item: SeoContent): ResolvedInternalLink[] {
  return item.relatedLinks.map(resolveInternalLink);
}
