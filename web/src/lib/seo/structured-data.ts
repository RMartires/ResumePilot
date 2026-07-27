import { faqs } from "@/components/landing/landing-data";
import { SITE_NAME, SITE_URL, siteDescription } from "@/lib/seo/site";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type ListItem = {
  name: string;
  path: string;
  description?: string;
};

const absoluteUrl = (path: string) =>
  path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: siteDescription,
  };
}

type WebPageInput = {
  name: string;
  description: string;
  path: string;
};

export function webPageJsonLd({ name, description, path }: WebPageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(path),
    about: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: siteDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function pricingOfferJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${SITE_NAME} Pro`,
    description:
      "Unlimited AI resume writing, PDF import, and job-description tailoring.",
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: [
      {
        "@type": "Offer",
        name: "Pro Monthly",
        price: "457",
        priceCurrency: "INR",
        url: `${SITE_URL}/pricing`,
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Pro Annual",
        price: "4992",
        priceCurrency: "INR",
        url: `${SITE_URL}/pricing`,
        availability: "https://schema.org/InStock",
      },
    ],
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function itemListJsonLd(name: string, items: ListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(item.path),
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

type WebApplicationInput = {
  name: string;
  description: string;
  path: string;
  featureList: string[];
  free?: boolean;
};

export function webApplicationJsonLd({
  name,
  description,
  path,
  featureList,
  free = true,
}: WebApplicationInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript and a modern web browser",
    featureList,
    ...(free
      ? {
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }
      : {}),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

type ArticleInput = {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
};

export function articleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified = datePublished,
}: ArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: absoluteUrl(path),
    datePublished,
    dateModified,
    author: organizationJsonLd(),
    publisher: organizationJsonLd(),
  };
}

type HowToInput = {
  name: string;
  description: string;
  path: string;
  steps: { name: string; text: string }[];
};

export function howToJsonLd({ name, description, path, steps }: HowToInput) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    url: absoluteUrl(path),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

type Faq = { question: string; answer: string };

export function faqPageJsonLd(items: Faq[] = faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
