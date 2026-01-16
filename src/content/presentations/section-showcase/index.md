---
title: "Section Showcase"
description: "A demonstration of all available presentation section types and layouts"
publishDate: "2025-01-15"
author: "natasha-charlton"
category: "Design"
cardImage: ./card.png
tags: ["showcase", "design", "sections"]

# Where this presentation appears
showIn: ["insights"]

# Hero section override
hero:
  image: ./card.png

# End section configuration
endSection:
  showAuthor: false
  showRecommended: false

# Reader sections - demonstrating all layout types
sections:
  # Text-only layouts with different alignments
  - id: "intro"
    title: "Welcome to the Showcase"
    body: "<p>This presentation demonstrates all available section types and layouts. Scroll through to see each one in action.</p><p>Each section type serves a different purpose and can be customized with various props.</p>"
    layout: "text-only"
    textAlign: "center"

  - id: "text-left"
    title: "Text Left Aligned"
    body: "<p>This is a text-only section with left alignment. The content block stays centered but text flows from the left.</p><p>Perfect for longer form content or when you want a more traditional reading experience.</p>"
    layout: "text-only"
    textAlign: "left"

  # Quote section variants
  - id: "quote-default"
    title: "Quote Section"
    layout: "quote"
    quote: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle."
    author: "Steve Jobs"
    role: "Co-founder, Apple"
    variant: "default"

  - id: "quote-accent"
    title: "Quote Accent"
    layout: "quote"
    quote: "Healing happens when we feel safe enough to be ourselves, fully and completely."
    author: "Natasha Charlton"
    role: "Founder, Good Mood"
    variant: "accent"

  - id: "quote-minimal"
    title: "Quote Minimal"
    layout: "quote"
    quote: "Sometimes the bravest thing you can do is simply show up."
    variant: "minimal"

  # Stats section
  - id: "stats-row"
    title: "Stats Section"
    layout: "stats"
    stats:
      - value: "10k"
        suffix: "+"
        label: "Resources downloaded"
      - value: "87"
        suffix: "%"
        label: "Report improved wellbeing"
      - value: "4.9"
        prefix: ""
        label: "Average rating"
    statsLayout: "row"

  - id: "stats-grid"
    title: "Stats Grid"
    layout: "stats"
    stats:
      - value: "24"
        label: "Worksheets"
      - value: "12"
        label: "Workbooks"
      - value: "8"
        label: "Guides"
      - value: "50"
        suffix: "+"
        label: "Resources total"
    statsLayout: "4"

  # Callout sections
  - id: "callout-tip"
    title: "Helpful Tip"
    layout: "callout"
    calloutType: "tip"
    content: "<p>Use callout sections to highlight important information that you want readers to notice and remember.</p><p>They work great for tips, warnings, and key takeaways.</p>"

  - id: "callout-info"
    title: "Did You Know?"
    layout: "callout"
    calloutType: "info"
    content: "<p>Info callouts are perfect for additional context or interesting facts that complement your main content.</p>"

  - id: "callout-warning"
    title: "Important Notice"
    layout: "callout"
    calloutType: "warning"
    content: "<p>Warning callouts draw attention to critical information that readers shouldn't miss.</p>"

  # Compare section
  - id: "compare"
    title: "Before & After"
    layout: "compare"
    left:
      label: "Before"
      title: "Feeling Overwhelmed"
      content: "<p>Scattered thoughts, constant worry, and difficulty focusing on what matters most.</p><p>Energy spent on things outside your control.</p>"
    right:
      label: "After"
      title: "Finding Clarity"
      content: "<p>Clear priorities, present-moment awareness, and confidence in your decisions.</p><p>Energy directed toward meaningful action.</p>"
    divider: true

  # Gallery section
  - id: "gallery"
    title: "Gallery Section"
    layout: "gallery"
    columns: 2
    images:
      - src: "/_Unused Images/Asset-Main-1.png"
        alt: "Example image 1"
        caption: "Caption for first image"
      - src: "/_Unused Images/Asset-Main-2.png"
        alt: "Example image 2"
        caption: "Caption for second image"

  # Traditional layouts
  - id: "image-text-right"
    title: "Image + Text Layout"
    body: "<p>This layout places an image alongside text content. The image can be positioned on either side.</p><p>Great for breaking up text-heavy sections with visual interest.</p>"
    layout: "image-text"
    image: ./card.png
    imagePosition: "right"

  - id: "closing"
    title: "That's Everything!"
    body: "<p>You've now seen all available section types. Mix and match these layouts to create engaging, scroll-driven presentations.</p><p>Each section type uses existing design tokens for consistent styling across your site.</p>"
    layout: "text-only"
    textAlign: "center"
---

This showcase demonstrates all presentation section layouts available in the Reader component.
