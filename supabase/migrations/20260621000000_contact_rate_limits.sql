-- ============================================================================
-- SECURITY FIX: persistent, tamper-resistant contact-form rate limiting
-- ============================================================================
-- PROBLEM
--   The API route kept hits in a module-level Map:
--       const rateLimitMap = new Map<string, number[]>();
--   Two flaws:
--     1. Serverless cold starts / redeploys wipe it, so the limit is
--        effectively unenforced in production.
--     2. The key came from the client-controllable `x-forwarded-for` header,
--        which an attacker can change on every request.
--
-- FIX
--   Store hits in a dedicated table that is ONLY reachable with the
--   service-role key. Row Level Security is enabled and NO policies are
--   created, so the anon key (which ships to the browser) cannot read,
--   insert or delete a single row. The service role bypasses RLS by design
--   and is used exclusively inside the server-side API route.
--
--   We store SHA-256 hashes, never raw IPs or raw emails, so the table holds
--   no directly identifying data.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_hash TEXT NOT NULL,
    email_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for the "count recent hits" queries.
CREATE INDEX IF NOT EXISTS idx_contact_rate_limits_ip_time
    ON public.contact_rate_limits (ip_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_rate_limits_email_time
    ON public.contact_rate_limits (email_hash, created_at DESC);

-- Lock the table down: RLS on + zero policies = deny everything for
-- anon/authenticated. Only the service role (server-side) can use it.
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

-- NOTE: contact_messages is intentionally NOT touched here.
-- There is no DELETE policy on it, so messages cannot be destroyed
-- through the client SDK either.
