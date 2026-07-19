# Notes

## How the user wants to learn (inferred — confirm in session)
- **Bilingual delivery:** concept explained in Chinese (fast), practice in English. Matches the byoungd guide they trust.
- **Navigation chrome is English-only:** footer pager links (prev/next, "Course home", "Connected speech reference") and other UI nav must be all-English and consistent across every page — even though lesson *body* content stays bilingual. (User flagged session 1 after 0002/daily shipped with Chinese pagers.)
- **Body font = Mac system font (SF Pro), not serif.** The original Charter serif felt uncomfortable to the user; body now uses `var(--sans)` → `-apple-system` (SF Pro on macOS, degrades to Segoe UI / system-ui elsewhere). Chinese falls through to PingFang SC. If a future design wants a serif again, the `--serif` variable is still defined but unused.
- **Commute-friendly:** anything audio / shadowable fits the 20-min subway window. Text lessons must be very short.
- **Don't compete with Duolingo** — complement it. Duolingo stays the daily anchor; these lessons layer real skills on top.

## Daily ritual: tweet dissection (agreed session 1)
Every day the user drops one tweet they saw on X. I produce a **daily dissection** lesson (`lessons/daily/NNNN-<slug>.html`) containing:
1. **Translation** — natural Chinese, after they read it raw first.
2. **Read-aloud** — full-quote `.shadow` widget (British voice). Clean cashtags/`/` in the spoken `data-phrase` so TTS sounds natural (e.g. `$AAPL`→Apple, `Mag7`→Mag Seven); keep the original in the blockquote.
3. **连读地图** — mark the linking features present, one `.link-row` per chunk, each with a `.speakable` button. Aim to cover all 5 features when the sentence allows.
4. **短语 & 搭配** — stealable collocations, each tagged with a **register flag**: `speak` (口语·慎写入雅思), `formal` (通用/写作), `avoid` (粗俗·写作避免). Register awareness is itself an IELTS skill.
5. **偷一句** — one mini reuse task.

**Critical teaching point:** tweet register ≠ IELTS Writing register. Tweets are gold for Speaking/Listening/idiom, but must NOT be copied into Task 2. Always flag this.

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
- `assets/shadow.js` → `ACCENT = "en-GB"`; voice picker prefers neural voices (Serena / Arthur), falls back to the installed en-GB voice.
- Primary pronunciation source = **BBC Tim's Pronunciation Workshop** + BBC Pronunciation hub. Rachel's English (AmE) kept only as a fallback.
- IPA in lessons uses BrE conventions: non-rhotic (no /r/ after vowels unless linking-r), /ɒ/ for "not", /ɔː/ for "all", /ɑː/ for "half", /əʊ/ for "old".
- Reminder to keep teaching **linking-r** as a feature (BrE inserts /r/ between vowels, e.g. *far away*), since it's a strength of the BrE system.

## Audio source & the TTS limitation (important)
Lesson audio is the **browser Web Speech API → the user's macOS system TTS**, NOT recorded speech. On this Mac the only en-GB voices installed are **Daniel** (an old diphone voice) plus novelty voices (Eddy/Flo/Grandma/Rocko…); **no neural voice** (Serena/Arthur) is installed. So TTS reads word-by-word with micro-gaps and **does NOT produce linking / elision / weak forms** — the user correctly noticed the "linked" examples don't actually link in the audio.

In place:
- `shadow.js` picker now prefers neural en-GB voices, falling back to Daniel. Recommend the user install **Serena** or **Arthur** (System Settings → Accessibility → Spoken Content → Voices) for much better offline synthesis.
- Every short phrase (≤6 words) also shows a **"↗ real speech"** link to `youglish.com/pronounce/<phrase>/english/uk` — real UK speakers, needs internet. Long quotes skip the link.
- A `.tts-note` disclaimer is auto-injected once per page.

**Rule:** NEVER claim TTS demonstrates linking. For genuine linked audio, point to BBC clips / YouGlish. TTS is a word-level reference only.
