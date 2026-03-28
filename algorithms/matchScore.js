/**
 * Duo Q — Matching Algorithm
 *
 * Scores a candidate against the current user on a 0–100 scale.
 *
 * Score breakdown (100 pts total):
 *   Games         — 50 pts
 *     Shared games                  up to 25 pts
 *     Favorite game overlap bonus   up to 15 pts
 *     Shared servers per game       up to  5 pts
 *     Shared game modes per game    up to  5 pts
 *   Age           — 20 pts
 *     Candidate fits user's range   10 pts
 *     User fits candidate's range   10 pts
 *   Preferences   — 30 pts
 *     Gender match                  15 pts
 *     Ethnicity/type match          15 pts
 *
 * Hard filters (score returns null — candidate is excluded entirely):
 *   - No shared games at all
 *   - Candidate's age outside user's preferred range
 *   - User's age outside candidate's preferred range
 *   - Gender preference mismatch (either direction)
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
  }

  if (sharedCount === 0) return 0;

  const totalGames = Math.max(userGames.length, candidateGames.length);

  // Shared game ratio — up to 25 pts
  const sharedRatio = sharedCount / totalGames;
  const sharedPts = sharedRatio * 25;

  // Favorite bonus — up to 15 pts (cap raw score)
  const favPts = Math.min(favoriteBonus * 3, 15);

  // Server overlap — up to 5 pts
  const serverPts = Math.min(serverPoints, 5);

  // Mode overlap — up to 5 pts
  const modePts = Math.min(modePoints, 5);

  return Math.round(sharedPts + favPts + serverPts + modePts);
}

// ─── Age Score (0–20) ─────────────────────────────────────────────────────────

function ageScore(user, candidate) {
  const userAge = getAge(user.birthday);
  const candidateAge = getAge(candidate.birthday);
  let score = 0;

  // Candidate within user's range
  if (
    candidateAge >= user.preferredAgeRange.min &&
    candidateAge <= user.preferredAgeRange.max
  ) {
    // Bonus for being near the center of the range
    const rangeMid = (user.preferredAgeRange.min + user.preferredAgeRange.max) / 2;
    const rangeHalf = (user.preferredAgeRange.max - user.preferredAgeRange.min) / 2 || 1;
    const proximity = 1 - Math.abs(candidateAge - rangeMid) / rangeHalf;
    score += 5 + Math.round(proximity * 5); // 5–10 pts
  }

  // User within candidate's range
  if (
    userAge >= candidate.preferredAgeRange.min &&
    userAge <= candidate.preferredAgeRange.max
  ) {
    const rangeMid = (candidate.preferredAgeRange.min + candidate.preferredAgeRange.max) / 2;
    const rangeHalf = (candidate.preferredAgeRange.max - candidate.preferredAgeRange.min) / 2 || 1;
    const proximity = 1 - Math.abs(userAge - rangeMid) / rangeHalf;
    score += 5 + Math.round(proximity * 5); // 5–10 pts
  }

  return Math.min(score, 20);
}

// ─── Preference Score (0–30) ──────────────────────────────────────────────────

function preferenceScore(user, candidate) {
  let score = 0;

  // Gender — already verified as a hard filter, so always award full points
  score += 15;

  // Ethnicity/type preference — 15 pts
  const userWantsAnyone = !user.preferredEthnicities?.length;
  const candidateWantsAnyone = !candidate.preferredEthnicities?.length;

  if (userWantsAnyone && candidateWantsAnyone) {
    score += 15; // both open to anyone
  } else if (userWantsAnyone || candidateWantsAnyone) {
    // One is open to anyone — check the other direction
    const specificUser = userWantsAnyone ? candidate : user;
    const otherUser = userWantsAnyone ? user : candidate;
    if (specificUser.preferredEthnicities.includes(otherUser.ethnicity)) {
      score += 15;
    } else {
      score += 5; // partial — one side open but other isn't matched
    }
  } else {
    // Both have preferences — check both ways
    const userLikesCandidate = user.preferredEthnicities.includes(candidate.ethnicity);
    const candidateLikesUser = candidate.preferredEthnicities.includes(user.ethnicity);
    if (userLikesCandidate && candidateLikesUser) score += 15;
    else if (userLikesCandidate || candidateLikesUser) score += 7;
    // else 0
  }

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
  const preferences = preferenceScore(user, candidate);
  const total = games + age + preferences;

  return {
    candidateId: candidate._id,
    total,
    breakdown: { games, age, preferences },
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
