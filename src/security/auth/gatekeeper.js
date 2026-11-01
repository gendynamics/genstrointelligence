// src/security/auth/gatekeeper.js
// Entry gatekeeper — validates visitor access before door opens.

const ALLOWED_ENTRY = true;

export function checkAccess() {
  return ALLOWED_ENTRY;
}

export function handleDoorClick(callback) {
  if (checkAccess()) {
    callback();
  }
}

export default { checkAccess, handleDoorClick };
