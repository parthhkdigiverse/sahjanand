export type Policy = {
  slug: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

export const policies: Policy[] = [
  {
    slug: "exchange-policy",
    title: "Exchange Policy",
    intro:
      "We want you to love every piece you bring home. If you wish to exchange, we make it simple and transparent.",
    sections: [
      {
        heading: "Eligibility",
        body: [
          "Exchange is available within 15 days of delivery.",
          "The piece must be unworn, undamaged, and in its original packaging with the certificate and invoice.",
          "Customised, engraved, and made-to-order pieces are not eligible for exchange.",
        ],
      },
      {
        heading: "How It Works",
        body: [
          "Visit any Sahajanand Jewellers boutique or contact our concierge to initiate an exchange.",
          "Your piece will be inspected by our atelier within 3 working days.",
          "On approval, you may exchange for any item of equal or higher value, paying only the difference.",
        ],
      },
      {
        heading: "Value Guarantee",
        body: [
          "Gold and diamond jewellery is exchanged at the prevailing market rate of the day.",
          "Making charges are deducted at 10% on first exchange and waived for repeat clients.",
        ],
      },
    ],
  },
  {
    slug: "return-refund-policy",
    title: "Return & Refund Policy",
    intro:
      "Your trust matters. If a piece is not right for you, we offer a clear return and refund process.",
    sections: [
      {
        heading: "Return Window",
        body: [
          "Returns are accepted within 7 days of delivery for ready-to-wear pieces.",
          "All returns must include the original invoice, certificate, and packaging.",
        ],
      },
      {
        heading: "Refund Process",
        body: [
          "Once we receive and verify your return, refunds are processed within 7 working days.",
          "Refunds are issued to the original payment method.",
          "A 5% processing fee may apply on COD orders.",
        ],
      },
      {
        heading: "Non-Returnable Items",
        body: [
          "Customised, engraved, resized, or altered pieces.",
          "Pieces purchased on final sale or as part of a bundle offer.",
        ],
      },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    intro:
      "We respect your privacy. This policy explains what we collect, why, and how we protect it.",
    sections: [
      {
        heading: "Information We Collect",
        body: [
          "Personal details such as name, contact, and shipping address provided during purchase.",
          "Order history, preferences, and feedback shared with our atelier.",
          "Browsing data through cookies to improve your experience on our site.",
        ],
      },
      {
        heading: "How We Use It",
        body: [
          "To process orders, deliver pieces, and provide after-sales care.",
          "To share updates on new collections, exclusive previews, and offers, only with your consent.",
          "To improve our boutique and digital experience.",
        ],
      },
      {
        heading: "Your Rights",
        body: [
          "You may request access, correction, or deletion of your data at any time.",
          "Write to privacy@maisonaurum.com and we will respond within 7 working days.",
          "We never sell your information to third parties.",
        ],
      },
    ],
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    intro:
      "Please read these terms carefully. By using our site or buying from us, you agree to them.",
    sections: [
      {
        heading: "General",
        body: [
          "All purchases are subject to availability and acceptance of order by Sahajanand Jewellers.",
          "Prices, photographs, and descriptions are for guidance and may vary slightly from the final piece.",
          "All pieces are handcrafted, so minor variations are part of their character.",
        ],
      },
      {
        heading: "Payment",
        body: [
          "We accept all major cards, UPI, net banking, and approved EMI options.",
          "Full payment is required before dispatch unless an instalment plan is agreed in writing.",
        ],
      },
      {
        heading: "Intellectual Property",
        body: [
          "All designs, photographs, and content on this site belong to Sahajanand Jewellers.",
          "Reproduction without written permission is not permitted.",
        ],
      },
      {
        heading: "Governing Law",
        body: [
          "These terms are governed by the laws of India and subject to the jurisdiction of Mumbai courts.",
        ],
      },
    ],
  },
  {
    slug: "cancellation-policy",
    title: "Cancellation Policy",
    intro:
      "We understand plans change. Here is how cancellations work at Sahajanand Jewellers.",
    sections: [
      {
        heading: "Standard Orders",
        body: [
          "Cancellations are accepted within 24 hours of order confirmation, free of charge.",
          "After 24 hours, a 5% restocking fee may apply if the order has not yet been dispatched.",
        ],
      },
      {
        heading: "Custom & Made-to-Order",
        body: [
          "Custom and made-to-order pieces enter production immediately.",
          "Cancellations after design approval are not possible. The advance paid is non-refundable.",
        ],
      },
      {
        heading: "Dispatched Orders",
        body: [
          "If your order has shipped, you may refuse delivery and the order will be treated as a return.",
          "Standard return policy charges and timelines will apply.",
        ],
      },
    ],
  },
  {
    slug: "authenticity-policy",
    title: "Product Authenticity & Certification",
    intro:
      "Every Sahajanand Jewellers piece is certified, hallmarked, and made to last. Here is our promise.",
    sections: [
      {
        heading: "Hallmarking",
        body: [
          "All gold jewellery is BIS Hallmarked, certifying purity by an independent authority.",
          "Each piece carries the BIS mark, purity grade, and our maker's mark.",
        ],
      },
      {
        heading: "Diamond Certification",
        body: [
          "Solitaire diamonds above 0.30 carat are certified by IGI, GIA, or HRD.",
          "Smaller diamonds are quality-graded in-house and listed clearly on your invoice.",
        ],
      },
      {
        heading: "Coloured Stones",
        body: [
          "Emeralds, rubies, and sapphires above 1 carat are certified by recognised gem laboratories.",
          "Origin and treatment details are documented for full transparency.",
        ],
      },
      {
        heading: "Lifetime Authenticity",
        body: [
          "If any piece is found to be inauthentic, we offer a full refund along with a 100% goodwill credit.",
        ],
      },
    ],
  },
  {
    slug: "buyback-policy",
    title: "Buyback & Resale Policy",
    intro:
      "Your jewellery holds value. We are happy to buy back or exchange your Sahajanand Jewellers pieces, anytime.",
    sections: [
      {
        heading: "Eligibility",
        body: [
          "All Sahajanand Jewellers pieces with original invoice and certificate are eligible for buyback.",
          "Pieces from other brands may also be considered, valued at current market rates.",
        ],
      },
      {
        heading: "Valuation",
        body: [
          "Gold is valued at the day's market rate, less a small refining charge.",
          "Diamonds and gemstones are valued by our certified gemologists.",
          "You receive a written valuation before any decision is taken.",
        ],
      },
      {
        heading: "Payment",
        body: [
          "Buyback payment is made within 3 working days, by bank transfer or store credit.",
          "Choosing store credit unlocks an additional 5% bonus on the valuation amount.",
        ],
      },
    ],
  },
];

export function getPolicy(slug: string) {
  return policies.find((p) => p.slug === slug);
}
