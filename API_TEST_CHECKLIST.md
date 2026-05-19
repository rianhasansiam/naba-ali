# SkyZonee — API Security Test Checklist
# Run these manually (curl / Postman) or adapt into integration tests.
# Every endpoint should return the expected HTTP status when called unauthenticated.

## 1. Authentication & Authorization

### /api/carts
- [ ] GET without login → 401 Unauthorized
- [ ] POST without login → 401 Unauthorized
- [ ] GET with login returns ONLY current user's cart (not other users)
- [ ] POST with invalid body → 422 Validation error

### /api/contacts
- [ ] GET without admin → 401/403
- [ ] GET as admin → 200 with paginated contacts
- [ ] POST without body → 422 Validation error
- [ ] POST with name < 2 chars → 422
- [ ] POST with valid body (no auth) → 200

### /api/users
- [ ] GET without login → 401
- [ ] GET as regular user → 403 Forbidden
- [ ] GET as admin → 200 with paginated user list (no passwords in response)
- [ ] POST (signup) with weak password (< 8 chars) → 422
- [ ] POST (signup) with duplicate email → 409
- [ ] POST (signup) with valid body → 201
- [ ] DELETE as non-admin → 403

### /api/users/[id]
- [ ] GET own profile → 200
- [ ] GET other user's profile → 403
- [ ] GET as admin → 200 for any user
- [ ] PATCH own profile → 200
- [ ] PATCH other user → 403
- [ ] DELETE as non-admin → 403
- [ ] DELETE as admin → 200

### /api/orders
- [ ] POST without login → 401
- [ ] POST with tampered totalPrice → totalPrice is recalculated server-side (verify in DB)
- [ ] POST with fake productId → 404 Product not found
- [ ] GET without admin → 403
- [ ] DELETE without admin → 403
- [ ] PUT without admin → 403

### /api/orders/[id]
- [ ] GET without login → 401
- [ ] GET another user's order → 403 (if implemented) or 404
- [ ] PUT (status update) without admin → 403
- [ ] DELETE without admin → 403

### /api/reviews
- [ ] POST without login → 401
- [ ] POST with userId/userName in body → these fields should be IGNORED; session values used instead (verify in DB)
- [ ] POST duplicate review for same product → 409
- [ ] POST with rating > 5 → 422
- [ ] DELETE without admin → 403

### /api/debug/session
- [ ] GET in production (NODE_ENV=production) → 404
- [ ] GET without admin → 403
- [ ] GET as admin in dev → 200

## 2. Image Upload

### /api/upload/image
- [ ] POST without login → 401
- [ ] POST with file > 5MB → 400
- [ ] POST with non-image file (e.g. .exe) → 400
- [ ] POST with valid image → 200 with URL
- [ ] Verify IMAGEBB_API_KEY is NOT in client-side JS bundle (check browser dev tools)

## 3. Chat

### /api/chat/messages
- [ ] POST without auth and non-guest conversationId → 400/403
- [ ] POST with message > 2000 chars → 422
- [ ] GET another user's conversation → 403

### /api/chat/conversations
- [ ] GET without admin → 401

## 4. Socket.io Security

- [ ] Connect to Socket.io and emit join with role='admin' → should NOT be elevated to admin
- [ ] Only sockets with verified admin session receive user presence events
- [ ] Admin typing events only emitted from verified admin sockets

## 5. General Security

- [ ] All responses strip 'password' field from user objects
- [ ] No NEXT_PUBLIC_IMAGEBB_API_KEY in page source or JS bundle
- [ ] X-Content-Type-Options header present on all responses
- [ ] X-Frame-Options: DENY on all responses
- [ ] HSTS header present in production
