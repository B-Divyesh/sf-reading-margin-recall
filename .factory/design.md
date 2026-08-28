# Visual thesis: a working botanical field guide

Reading Margin Recall treats each selected passage like a specimen found during field work. The interface is a quiet, annotated field-guide spread: ruled paper, small catalog labels, pressed-leaf silhouettes, ink circles, and a dark forest cover. It should feel useful at a desk and familiar beside a book. It must never resemble a generic dashboard.

## Palette

- `paper` `#F4F0E4`: warm herbarium paper and the light-mode background.
- `paper-deep` `#E7DFC9`: page rules, quiet panels, and section changes.
- `ink` `#18362B`: primary copy; 11.5:1 contrast on paper.
- `ink-soft` `#50635A`: secondary copy; 5.6:1 contrast on paper.
- `fern` `#2E6049`: primary actions and active specimen marks.
- `fern-dark` `#173F31`: hover and focus support.
- `pollen` `#D79A2B`: deletion marks and highlights, paired with text or shape.
- `berry` `#9D3E48`: destructive/error states.
- `night` `#10251D`, `night-sheet` `#19352A`, `night-text` `#F3EEDC`: dark treatment.

Dark mode is a night-field-notebook treatment, selected from the app. The default follows the device.

## Type

The display face is Georgia, a bookish serif already on the device. The body face is the native UI sans stack for compact controls and reliable language coverage. No font download is needed. Headings use slightly negative tracking; specimen metadata uses spaced uppercase labels. Long passages stay between 45 and 70 characters per line.

## Spacing and shape

An 8 px base rhythm controls gaps: 8, 16, 24, 32, 48, 64, and 96 px. The page uses asymmetric columns, marginal notes, thin ink rules, clipped-corner specimen sheets, and capsule-shaped tags only for state. Buttons are at least 44 px high. Cards appear only for independent saved notes.

## Interaction grammar

- Selecting a passage in the extension grows a small leaf-shaped “Save passage” control from the selection.
- Saving presses a circular specimen stamp into place and announces the result.
- Review reveals the missing words in the same physical position, like lifting tracing paper.
- Keyboard: tab reaches every control; `Space` reveals a review answer; `1–4` grades recall; `n` starts a new capture when focus is not in a field.

## Motion

One signature motion is the specimen press: saved content settles 6 px and the thin outline closes around it over 220 ms. Route changes use a 160 ms fade. Nothing loops. With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and state changes are instant.

## Original asset plan

The hero uses one generated landscape illustration: an open field notebook, pressed fern, amber annotation marks, and a small browser-selection slip. It explains the connection between reading margins and spaced recall without showing fake application controls. The social image is composed from the same art and real HTML typography. A hand-authored SVG leaf mark supplies the favicon and extension icons.

### Prompt sheet

Subject: an open naturalist field notebook holding a selected sentence as a paper specimen, a pressed fern, pencilled gloss notes, and one amber deletion bracket. World: a language learner's calm reading desk interpreted as a nineteenth-century botanical field guide. Materials: fibrous cream paper, graphite, green ink, linen thread, pressed leaves. Light: soft north-window daylight with restrained shadows. Lens: slightly top-down editorial still life, wide composition, clear negative space. Palette words: herbarium cream, deep forest ink, dried fern, amber pollen. Negative list: people, hands, readable text, UI screenshots, logos, brands, watermarks, gradients, glossy 3D, neon, clutter.

Exact generation prompt:

> Use case: stylized-concept. Asset type: website hero and social artwork. Primary request: an editorial botanical field-guide illustration that connects a selected reading passage to a later memory review. Scene: an open naturalist notebook on a quiet reading desk with a pressed fern, a narrow blank paper sentence strip, pencilled marginal gloss marks, and a single amber deletion bracket. Style: refined hand-painted gouache and graphite on fibrous paper, realistic material texture, not photorealistic. Composition: 3:2 wide landscape, notebook anchored right of center, generous calm negative space around the edges, no important details at the crop boundary. Lighting: soft north-window daylight, restrained shadows. Palette: herbarium cream, deep forest green, dried fern, muted amber. Constraints: no readable text, no people, no hands, no UI screenshot, no logos, no watermark, no gradient, no neon.

### Provenance

Generated on 2026-08-28 with the factory `factory-image` deployment through `/opt/fleet/lib/gen-image.sh`. The exact prompt is above. The reviewed source is `assets/src/field-guide-hero.png`; it contains no logos, legible text, people, or misleading interface controls. Shipped crops are `site/public/assets/field-guide-hero.webp`, `field-guide-hero-mobile.webp`, and `og-field-guide.webp`. Generated imagery is original to this product, decorative, and disclosed in the footer.
