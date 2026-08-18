# Specification: ad-network-seo-optimization

## Overview

Fix and optimize the advertising and organic-growth system of the AI World Hub website. This specification covers making Adsterra and Monetag ad networks actually work, resolving their configuration/script conflicts, verifying page-level ad loading, checking ad rendering on different screen sizes, and fixing only SEO issues that can realistically bring more legitimate organic visitors to the website.

## Acceptance Tests

**AT-1: Ad Network Activation**
- Given: Ad configuration enables the Adsterra network with a valid zone
- When: The ad component renders on any website page
- Then: The ad slot displays a native Adsterra banner
- And: The ad renders at 300x250 pixel dimensions
- And: No empty ad slot remains when the zone is configured

**AT-2: Monetag Banner Activation**
- Given: Ad configuration enables the Monetag network with a valid zone
- When: The ad component renders on any website page
- Then: The ad slot displays a Monetag banner
- And: The banner loads without cross-site tracking enabled
- And: No empty ad slot remains when the zone is configured

**AT-3: Fallback Ad Rendering**
- Given: No Adsterra or Monetag banner zones are configured, but a default link zone exists
- When: The ad component renders
- Then: A professional-looking sponsored box appears with an "Advertisement" label
- And: A "View Offer" call-to-action links to the default zone destination
- And: The link opens in a new tab with sponsored attribution

**AT-4: Ad Re-loading After Page Navigation**
- Given: The user navigates to a different page and then returns
- When: The ad component re-appears on the returned page
- Then: Ads are re-displayed in the ad slot
- And: Previous ad content clears before the new ad loads
- And: No duplicate script injection occurs on the same page view

**AT-5: Mobile Ad Rendering**
- Given: The browser viewport is 640px wide or less (mobile device)
- When: The ad component renders with any network type
- Then: The ad container fills the available width proportionally
- And: The ad creative maintains readability on small screens
- And: No horizontal overflow or layout breakage occurs on the page

**AT-6: Desktop Ad Rendering**
- Given: The browser viewport is wider than 640px (desktop device)
- When: The ad component renders with any network type
- Then: The ad renders at full available width
- And: Proper spacing is maintained around the ad slot
- And: No layout shift occurs that moves other page content

**AT-7: No Ad Conflict With Existing Scripts**
- Given: The page includes existing advertisement scripts in the HTML
- When: The ad component mounts and any ad network scripts inject
- Then: No JavaScript errors occur from zone ID conflicts
- And: Both the existing scripts and the ad component ads load independently
- And: No script injection doubles or interferes with either ad system

**AT-8: SEO Title and Description Uniqueness**
- Given: Each website page has search engine optimization data configured
- When: The page loads in a browser or search engine
- Then: The title tag is unique to that page's content
- And: The title length is appropriate for search engine display
- And: The description meta tag is unique to that page's content
- And: The description length is appropriate for search engine display
- And: No two different pages share the same title or description

**AT-9: SEO Keyword Relevance**
- Given: Each website page has keywords configured in the SEO data
- When: Search engines index the page
- Then: The keywords are relevant to the page's actual content and purpose
- And: No keyword stuffing is present (keyword density stays below 5%)
- And: High-traffic pages include terms that users actually search for

**AT-10: Sitemap Consistency**
- Given: The site has been built and a sitemap generated
- When: The sitemap is validated against the XML standard
- Then: Every page with SEO data has a corresponding URL entry
- And: No URL appears in the sitemap without corresponding page support
- And: All URL values use the correct website host

**AT-11: Blog Post SEO Optimization**
- Given: A high-traffic blog post page loads
- When: The page renders
- Then: The title includes the target keyword phrase for that post
- And: The description includes a compelling call-to-action
- And: The keywords include a mix of head terms and long-tail variations

**AT-12: Programmatic Page SEO**
- Given: A programmatic page (e.g., a prompt page by role and task) loads
- When: The page renders
- Then: SEO data is generated from the page definitions
- And: The title and description are unique to that specific page
- And: Keywords include role-specific and task-specific terms

## Functional Requirements

**FR-1: Enable Adsterra Banner Ads**
- Ad configuration is set to enable the Adsterra network
- A valid Adsterra banner zone ID is configured
- The Adsterra native banner script injects automatically on pages with the ad component
- The ad renders at 300x250 pixel dimensions

**FR-2: Enable Monetag Banner Ads**
- Ad configuration is set to enable the Monetag network
- A valid Monetag banner zone ID is configured
- The Monetag banner script injects automatically on pages with the ad component
- The script tag includes cross-tracking disabled

**FR-3: Resolve Ad Network Script Conflicts**
- The existing advertisement scripts in the HTML coexist with the ad component
- Ad network scripts inject without JavaScript errors
- No double-injection of scripts occurs on the same page
- Cross-tracking is properly disabled on all external ad scripts

**FR-4: Verify Ad Loading After Page Navigation**
- When a user navigates to a different page and returns, ads re-appear in the ad slot
- Ad content clears before the new ad injects on navigation
- No console errors appear from ad script injection during navigation
- Ads persist correctly across page transitions

**FR-5: Ensure Ads Render Correctly on Mobile Devices**
- The ad container adapts to the mobile viewport and fills available width
- Ad creative maintains readability with appropriate font sizes
- No horizontal scroll bar appears on mobile pages where the ad renders
- The advertisement label remains visible and readable on small screens

**FR-6: Ensure Ads Render Correctly on Desktop Devices**
- The ad renders at full width on typical desktop viewport sizes
- Proper spacing surrounds the ad slot, keeping distance from other page content
- No unexpected layout shift occurs when the ad injects or resizes
- The ad creative displays correctly at larger widths without distortion

**FR-7: Fix SEO for Legitimate Organic Growth**
- Each page has a unique, descriptive title that accurately reflects its content
- Each page has a unique description that complements the title
- Keywords on each page are relevant to the actual content, not stuffed
- High-traffic pages target commercial-intent keywords that users search for
- Programmatic pages have unique SEO per page combination
- Sitemap includes all pages with SEO data and uses the correct host
- No deceptive SEO practices are used (no cloaking, keyword stuffing, or fake content)

**FR-8: Maintain Policy-Compliant Advertising**
- Ads never use deceptive clicks or forced redirects
- All ad links that open in a new tab use appropriate attribution
- Sponsored or advertisement content is clearly labeled as such
- No popunder ads that trick users into interacting appear
- Ad configurations comply with the program policies of the ad networks

## Success Criteria

**SC-1: Ad Networks Functionally Enabled**
- Adsterra banner ads render on the website without empty slots
- Monetag banner ads render on the website without empty slots
- Both ad networks operate simultaneously without errors

**SC-2: Ad Re-loading Works After Navigation**
- Navigating to a different page and returning causes ads to re-appear
- No duplicate script injection errors appear after multiple navigations
- Ads persist correctly across page transitions

**SC-3: Mobile Ad Rendering is Viable**
- Ads render without breaking the mobile layout (viewport ≤ 640px)
- The ad container respects width constraints on small screens
- No horizontal scroll appears on mobile pages where ads render

**SC-4: Desktop Ad Rendering is Viable**
- Ads render correctly at typical desktop viewport widths (≥ 1024px)
- No layout shift occurs caused by ad injection or resizing
- Ad creative scales appropriately at larger viewport widths

**SC-5: SEO Metrics Improve (compared to baseline)**
- The number of indexed pages with optimized titles and descriptions increases by at least 20% compared to the previous baseline
- No duplicate title or description tags exist across the entire site
- Keyword relevance improves for the target high-traffic pages

**SC-6: No Policy Violations**
- The ad network zones are confirmed policy-compliant
- No deceptive click patterns or forced redirects are detected
- All ad content is clearly labeled and transparent to the user

## Assumptions

**A-1: Ad Zone IDs**
- Valid Adsterra banner zone ID will be obtained from the ad network dashboard
- Valid Monetag banner zone ID will be obtained from the ad network dashboard
- These IDs are placeholder values to be filled in after configuration

**A-2: SPA Page Navigation**
- The website uses page navigation where content changes appropriately
- The ad component re-appears when navigating back to a previous page
- Ad slot content clears appropriately between page transitions

**A-3: SEO Baseline**
- The current SEO data has good route coverage but some titles and descriptions are generic
- High-traffic pages need keyword optimization for better search visibility
- The sitemap is generally consistent but may have minor discrepancies after changes

**A-4: No Breaking Changes**
- Existing useful functionality (default link ad zone, raw HTML mode) is preserved
- The existing advertisement scripts in the HTML remain in place
- New Adsterra and Monetag zones are added alongside existing configuration, not replacing it

**A-5: Build Process**
- The build process successfully completes with all changes applied
- Sitemap validation passes after changes
- Per-page HTML generation generates correct ad and SEO data

## Key Entities

**Ad Configuration**
- Single source of truth defining which ad networks are enabled and their zone identifiers
- Contains status and zone ID for each network type (Adsterra, Monetag, fallback options)
- Controls which ad behavior renders on the website pages

**SEO Data Per Route**
- Records providing title, description, and keywords for each page on the website
- Used by the page SEO function to provide page-specific search engine optimization
- Covers the homepage, all tool pages, blog posts, categories, and programmatic pages

**Ad Component**
- Universal banner ad component that supports multiple ad network types
- Renders differently based on which network is configured and enabled
- Injects the appropriate script or HTML into the ad slot on each page

**Existing Advertisement Scripts**
- Scripts already present in the base HTML file
- Must coexist with any new ad component scripts without conflicts
- Use specific zone IDs that must remain functional

## Notes

- Ad network zone IDs are the primary configuration needed to make the ad networks function
- Script conflict resolution between the existing scripts and the ad component is critical
- Ad re-loading must work correctly when users navigate between pages on the website
- Only SEO fixes that realistically improve organic traffic are included
- No keyword stuffing, fake content, or deceptive practices are used
- All changes must pass the build validation gate, including sitemap validation