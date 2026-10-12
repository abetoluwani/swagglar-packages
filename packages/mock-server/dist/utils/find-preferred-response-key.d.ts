/**
 * Find the preferred response key to mock.
 *
 * Preference order:
 * 1. The lowest 2xx success response
 * 2. The lowest non-informational code (3xx/4xx/5xx)
 * 3. `default` — the catch-all for undeclared responses (typically an error)
 * 4. An informational 1xx response, only when nothing else is defined
 *
 * Within each tier an explicit code wins over the range pattern that covers it (e.g. `200` over
 * `2XX`), and range patterns are treated as their lowest member (e.g. `2XX` → `200`). `default`
 * is the catch-all for codes not covered individually, so a defined success or error is preferred
 * over it.
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.2.md#responses-object
 */
export declare function findPreferredResponseKey(responses?: string[]): string | undefined;
//# sourceMappingURL=find-preferred-response-key.d.ts.map