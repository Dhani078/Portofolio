-- ============================================================================
-- SECURITY FIX: contact_messages leak
-- ============================================================================
-- PROBLEM
--   The original policies granted read/update to ANY authenticated user:
--       USING (auth.role() = 'authenticated')
--   That means anyone who signs up for a Supabase account on this project
--   (or any leaked/staff session) could read EVERY visitor's name, email and
--   private message. This is a data-privacy breach, not just a bug.
--
-- FIX
--   Restrict SELECT/UPDATE to the site owner's verified account only.
--   INSERT stays open (the public contact form must work without login) and
--   still cannot be used to read anything back.
--
-- NOTE
--   Run this AFTER 20260619000000_initial_schema.sql. It is idempotent:
--   safe to re-run, it drops the weak policies before recreating them.
-- ============================================================================

-- Drop the insecure policies first.
DROP POLICY IF EXISTS "Allow authenticated admin read on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated admin update on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Owner read contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Owner update contact_messages" ON public.contact_messages;

-- Make sure RLS is actually on (harmless if already enabled).
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Only the owner may READ messages.
CREATE POLICY "Owner read contact_messages" ON public.contact_messages
    FOR SELECT
    USING (
        auth.jwt() ->> 'email' = 'dhanisepeda@gmail.com'
    );

-- Only the owner may UPDATE messages (e.g. marking as read).
CREATE POLICY "Owner update contact_messages" ON public.contact_messages
    FOR UPDATE
    USING (
        auth.jwt() ->> 'email' = 'dhanisepeda@gmail.com'
    )
    WITH CHECK (
        auth.jwt() ->> 'email' = 'dhanisepeda@gmail.com'
    );

-- The public insert policy is intentionally left untouched:
--   "Allow public insert on contact_messages" FOR INSERT WITH CHECK (true)
-- It is required for the contact form and cannot be used to read data.
-- There is deliberately NO DELETE policy, so messages cannot be destroyed
-- through the client SDK.
