const rosterKey = "pokemon-roster";
const nameKey = "pokemon-username";

export function getRoster() {
  return JSON.parse(localStorage.getItem(rosterKey)) || [];
}

export function saveRoster(roster) {
  localStorage.setItem(rosterKey, JSON.stringify(roster));
}

export function saveUsername(name) {
  localStorage.setItem(nameKey, name);
}

export function loadUsername() {
  return localStorage.getItem(nameKey) || "Player";
}
