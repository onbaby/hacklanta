/**
 * Duo Q — Matching Algorithm
 *
 * Scores a candidate against the current user on a 0–100 scale.
 *
 * Score breakdown (100 pts total):
 *   Games         — 50 pts
 *     Shared games                  up to 20 pts
 *     Favorite game overlap bonus   up to 15 pts
 *     Shared servers per game       up to  5 pts
 *     Shared game modes per game    up to  5 pts
 *     Shared platforms per game     up to  5 pts
 *   Age           — 10 pts
 *     Candidate fits user's range    5 pts
 *     User fits candidate's range    5 pts
 *   Schedule      — 10 pts
 *     Shared days                   up to  5 pts
 *     Shared time slots             up to  3 pts
 *     Session length match               2 pts
 *   Preferences   — 30 pts
 *     Gender match                  15 pts
 *     Ethnicity/type match          15 pts
 *
 * Hard filters (score returns null — candidate is excluded entirely):
 *   - No shared games at all
 *   - Candidate's age outside user's preferred range
 *   - User's age outside candidate's preferred range
 *   - Gender preference mismatch (either direction)
 *   - Ethnicity preference mismatch (either direction, only if preferences are set)
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAge(birthday) {
  const today = new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function overlap(arrA, arrB) {
  if (!arrA?.length || !arrB?.length) return [];
  const setB = new Set(arrB.map(x => x.toLowerCase()));
  return arrA.filter(x => setB.has(x.toLowerCase()));
}

// ─── Hard Filters ─────────────────────────────────────────────────────────────

function passesHardFilters(user, candidate) {
  const userAge = getAge(user.birthday);
  const candidateAge = getAge(candidate.birthday);

  // Age filter — both ways
  if (
    candidateAge < user.preferredAgeRange.min ||
    candidateAge > user.preferredAgeRange.max
  ) return false;

  if (
    userAge < candidate.preferredAgeRange.min ||
    userAge > candidate.preferredAgeRange.max
  ) return false;

  // Gender filter — both ways
  // user must be a gender candidate wants
  if (
    candidate.preferredGenders?.length &&
    !candidate.preferredGenders.includes(user.gender)
  ) return false;

  // candidate must be a gender user wants
  if (
    user.preferredGenders?.length &&
    !user.preferredGenders.includes(candidate.gender)
  ) return false;

  // Ethnicity filter — both ways (only applies if preferences are set)
  if (
    candidate.preferredEthnicities?.length &&
    !candidate.preferredEthnicities.map(e => e.toLowerCase()).includes(user.ethnicity?.toLowerCase())
  ) return false;

  if (
    user.preferredEthnicities?.length &&
    !user.preferredEthnicities.map(e => e.toLowerCase()).includes(candidate.ethnicity?.toLowerCase())
  ) return false;

  // Must share at least one game
  const userGameIds = user.games.map(g => g.gameId);
  const candidateGameIds = candidate.games.map(g => g.gameId);
  if (overlap(userGameIds, candidateGameIds).length === 0) return false;

  return true;
}

// ─── Game Score (0–50) ────────────────────────────────────────────────────────

function gameScore(user, candidate) {
  const userGames = user.games;
  const candidateGames = candidate.games;

  if (!userGames?.length || !candidateGames?.length) return 0;

  const candidateMap = new Map(
    candidateGames.map(g => [g.gameId.toLowerCase(), g])
  );

  let sharedCount = 0;
  let favoriteBonus = 0;
  let serverPoints = 0;
  let modePoints = 0;
  let platformPoints = 0;

  for (const userGame of userGames) {
    const match = candidateMap.get(userGame.gameId.toLowerCase());
    if (!match) continue;

    sharedCount++;

    // Favorite game bonus
    if (userGame.isFavorite && match.isFavorite) favoriteBonus += 3; // both favor it
    else if (userGame.isFavorite || match.isFavorite) favoriteBonus += 1; // one favors it

    // Shared servers for this game
    const sharedServers = overlap(userGame.servers, match.servers);
    serverPoints += Math.min(sharedServers.length, 3); // cap per game

    // Shared game modes for this game
    const sharedModes = overlap(userGame.gameModes, match.gameModes);
    modePoints += Math.min(sharedModes.length, 3); // cap per game

    // Shared platforms for this game
    const sharedPlatforms = overlap(userGame.platforms, match.platforms);
    platformPoints += Math.min(sharedPlatforms.length, 2); // cap per game
  }

  if (sharedCount === 0) return 0;

  const totalGames = Math.max(userGames.length, candidateGames.length);

  // Shared game ratio — up to 20 pts
  const sharedRatio = sharedCount / totalGames;
  const sharedPts = sharedRatio * 20;

  // Favorite bonus — up to 15 pts (cap raw score)
  const favPts = Math.min(favoriteBonus * 3, 15);

  // Server overlap — up to 5 pts
  const serverPts = Math.min(serverPoints, 5);

  // Mode overlap — up to 5 pts
  const modePts = Math.min(modePoints, 5);

  // Platform overlap — up to 5 pts
  const platPts = Math.min(platformPoints, 5);

  return Math.round(sharedPts + favPts + serverPts + modePts + platPts);
}

// ─── Age Score (0–10) ─────────────────────────────────────────────────────────

function ageScore(user, candidate) {
  const userAge = getAge(user.birthday);
  const candidateAge = getAge(candidate.birthday);
  let score = 0;

  // Candidate within user's range
  if (
    candidateAge >= user.preferredAgeRange.min &&
    candidateAge <= user.preferredAgeRange.max
  ) {
    const rangeMid = (user.preferredAgeRange.min + user.preferredAgeRange.max) / 2;
    const rangeHalf = (user.preferredAgeRange.max - user.preferredAgeRange.min) / 2 || 1;
    const proximity = 1 - Math.abs(candidateAge - rangeMid) / rangeHalf;
    score += 2 + Math.round(proximity * 3); // 2–5 pts
  }

  // User within candidate's range
  if (
    userAge >= candidate.preferredAgeRange.min &&
    userAge <= candidate.preferredAgeRange.max
  ) {
    const rangeMid = (candidate.preferredAgeRange.min + candidate.preferredAgeRange.max) / 2;
    const rangeHalf = (candidate.preferredAgeRange.max - candidate.preferredAgeRange.min) / 2 || 1;
    const proximity = 1 - Math.abs(userAge - rangeMid) / rangeHalf;
    score += 2 + Math.round(proximity * 3); // 2–5 pts
  }

  return Math.min(score, 10);
}

// ─── Schedule Score (0–10) ────────────────────────────────────────────────────

function scheduleScore(user, candidate) {
  const uSched = user.playSchedule;
  const cSched = candidate.playSchedule;
  if (!uSched || !cSched) return 0;

  let score = 0;

  // Shared days — up to 5 pts
  const sharedDays = overlap(uSched.days, cSched.days);
  const totalDays = Math.max(uSched.days?.length || 0, cSched.days?.length || 0);
  if (totalDays > 0) {
    score += Math.round((sharedDays.length / totalDays) * 5);
  }

  // Shared time slots — up to 3 pts
  const sharedSlots = overlap(uSched.timeSlots, cSched.timeSlots);
  const totalSlots = Math.max(uSched.timeSlots?.length || 0, cSched.timeSlots?.length || 0);
  if (totalSlots > 0) {
    score += Math.round((sharedSlots.length / totalSlots) * 3);
  }

  // Session length match — 2 pts
  if (
    uSched.sessionLength &&
    cSched.sessionLength &&
    uSched.sessionLength === cSched.sessionLength
  ) {
    score += 2;
  }

  return Math.min(score, 10);
}

// ─── Preference Score (0–30) ──────────────────────────────────────────────────

function preferenceScore(user, candidate) {
  let score = 0;

  // Gender — already verified as a hard filter, so always award full points
  score += 15;

  // Ethnicity/type preference — 15 pts
  // Already verified as a hard filter, so always award full points
  score += 15;

  return Math.min(score, 30);
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Score a single candidate against the current user.
 * Returns null if the candidate fails hard filters (should be excluded).
 * Otherwise returns a score 0–100 with a breakdown.
 */
function scoreCandidate(user, candidate) {
  if (!passesHardFilters(user, candidate)) return null;

  const games = gameScore(user, candidate);
  const age = ageScore(user, candidate);
  const schedule = scheduleScore(user, candidate);
  const preferences = preferenceScore(user, candidate);
  const total = games + age + schedule + preferences;

  return {
    candidateId: candidate._id,
    total,
    breakdown: { games, age, schedule, preferences },
  };
}

/**
 * Rank a list of candidate users against the current user.
 * Filters out anyone who fails hard filters, sorts by score descending.
 */
function rankCandidates(user, candidates) {
  const scored = candidates
    .map(candidate => {
      const result = scoreCandidate(user, candidate);
      if (!result) return null;
      return { candidate, ...result };
    })
    .filter(Boolean);

  scored.sort((a, b) => b.total - a.total);
  return scored;
}

module.exports = { scoreCandidate, rankCandidates };
