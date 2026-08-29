# Cold live check

Candidate: `d556c48356687e29d2973dee4310efe351823f5c`

- Home facts: Private, Offline, and Price were fully visible; each ended at 688.64 px in a 900 px viewport.
- History: Home was sampled at 815 px; Back restored it to 853 px, focused the h1, and announced “Save passages for later recall page loaded.”
- Privacy: both exact `extension-selection` and `local-only` statements were visible.
- 404: `/missing-polish-3-retry1` returned HTTP 404 with “Page not found — Reading Margin Recall” and “We could not find this page.”
- Demo: `/?demo=1` showed the isolation banner, Reset, Exit, sample passage, gloss, source, and Reveal action.
- Mobile demo: the Reveal action ended at 804.17 px in the 844 px viewport.
- Browser console/page errors: none beyond the expected document 404 message on the 404 route.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1,052 ms, CLS 0.
