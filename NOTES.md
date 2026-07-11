# Notes

## How the user wants to learn (inferred — confirm in session)
- **Bilingual delivery:** concept explained in Chinese (fast), practice in English. Matches the byoungd guide they trust.
- **Commute-friendly:** anything audio / shadowable fits the 20-min subway window. Text lessons must be very short.
- **Don't compete with Duolingo** — complement it. Duolingo stays the daily anchor; these lessons layer real skills on top.

## Curriculum roadmap (B1–B2 → IELTS 7.5)
Three phases. Each phase ends with a reference doc in `./reference/`.

**Phase 1 — Sound beautiful (Speaking / Pronunciation).** The hook + direct IELTS Speaking lift.
Connected speech, in order:
1. Consonant → vowel linking  ← *current lesson (0001)*
2. Consonant → consonant linking & elision (吞音)
3. Vowel → vowel linking (inserting /w/ /j/ /r/)
4. Weak forms & the schwa /ə/ → sentence rhythm
5. Sentence stress & thought groups (意群)
→ reference: `connected-speech.html`

**Phase 2 — Write correctly (Grammar system).** The IELTS Writing backbone.
1. Sentence skeleton: simple → compound → complex
2. The verb phrase: tense & aspect (the #1 writing fix)
3. Articles (`a/an/the`) — the biggest Chinese→English gap
4. **Prepositions** — the user's stated weak spot; taught as collocations, not rules
5. Subordinate clauses (relative, conditional, concessive) for band 7+
→ reference: `grammar-cheatsheet.html`

**Phase 3 — IELTS-specific strategy.**
Writing Task 1 & 2 method; Speaking Parts 1–3; one timed full mock using Cambridge authentic papers.

## Accent choice — RESOLVED: British English (en-GB)
User chose British English (session 1). Everything now targets BrE:
- `assets/shadow.js` → `ACCENT = "en-GB"` (voice picker prefers Daniel / Google UK).
- Primary pronunciation source = **BBC Tim's Pronunciation Workshop** + BBC Pronunciation hub. Rachel's English (AmE) kept only as a fallback.
- IPA in lessons uses BrE conventions: non-rhotic (no /r/ after vowels unless linking-r), /ɒ/ for "not", /ɔː/ for "all", /ɑː/ for "half", /əʊ/ for "old".
- Reminder to keep teaching **linking-r** as a feature (BrE inserts /r/ between vowels, e.g. *far away*), since it's a strength of the BrE system.
