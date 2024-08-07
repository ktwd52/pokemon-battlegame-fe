const rosterKey = "pokemon-roster";

export function getRoster() {
  return JSON.parse(localStorage.getItem(rosterKey)) || [];
}

export function saveRoster(roster) {
  localStorage.setItem(rosterKey, JSON.stringify(roster));
}
