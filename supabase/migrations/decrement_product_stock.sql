-- ============================================================================
-- decrement_product_stock.sql
-- ============================================================================
-- Run this in the Supabase SQL Editor. Safe to re-run (idempotent — CREATE OR
-- REPLACE FUNCTION).
--
-- WHY THIS EXISTS:
--   Placing an order never reduced product.stock — the storefront correctly
--   hides "Add to cart" and shows "Ni na zalogi" once stock hits 0, but stock
--   itself was static and only ever changed via the admin product form. This
--   function lets /api/orders decrement it atomically at order time.
--
--   The check-then-subtract happens in a single statement (`WHERE stock >=
--   p_qty`) so two simultaneous orders for the last item can't both succeed
--   and drive stock negative — the second call simply returns NULL (0 rows
--   updated) instead of racing past a separate SELECT check.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.decrement_product_stock(p_product_id uuid, p_qty integer)
RETURNS integer
LANGUAGE sql
AS $$
  UPDATE public.products
  SET stock = stock - p_qty
  WHERE id = p_product_id AND stock >= p_qty
  RETURNING stock;
$$;

-- service_role calls this via supabase.rpc(); anon/authenticated have no
-- legitimate reason to call it directly, so don't grant EXECUTE to them.
REVOKE ALL ON FUNCTION public.decrement_product_stock(uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.decrement_product_stock(uuid, integer) TO service_role;
