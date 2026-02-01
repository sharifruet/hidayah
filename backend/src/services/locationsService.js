import pool from '../config/database.js';

/**
 * Calculate relevance score for a location match
 * @param {string} query - Search query
 * @param {string} name - Location name
 * @param {string} nameBengali - Location name in Bengali
 * @param {boolean} isPopular - Whether location is popular
 * @param {boolean} fuzzy - Whether fuzzy matching is enabled
 */
function calculateRelevanceScore(query, name, nameBengali, isPopular, fuzzy) {
  const queryLower = query.toLowerCase();
  const nameLower = name ? name.toLowerCase() : '';
  const nameBengaliLower = nameBengali ? nameBengali.toLowerCase() : '';
  
  let score = 0;
  
  // Exact match gets highest score
  if (nameLower === queryLower || nameBengaliLower === queryLower) {
    score = 1.0;
  }
  // Starts with query
  else if (nameLower.startsWith(queryLower) || nameBengaliLower.startsWith(queryLower)) {
    score = 0.9;
  }
  // Contains query
  else if (nameLower.includes(queryLower) || nameBengaliLower.includes(queryLower)) {
    score = 0.7;
  }
  // Fuzzy matching (if enabled)
  else if (fuzzy) {
    // Simple fuzzy matching - check if query characters appear in order
    let queryIndex = 0;
    for (let i = 0; i < nameLower.length && queryIndex < queryLower.length; i++) {
      if (nameLower[i] === queryLower[queryIndex]) {
        queryIndex++;
      }
    }
    if (queryIndex === queryLower.length) {
      score = 0.5;
    }
    
    // Also check Bengali name
    if (score < 0.5 && nameBengaliLower) {
      queryIndex = 0;
      for (let i = 0; i < nameBengaliLower.length && queryIndex < queryLower.length; i++) {
        if (nameBengaliLower[i] === queryLower[queryIndex]) {
          queryIndex++;
        }
      }
      if (queryIndex === queryLower.length) {
        score = 0.5;
      }
    }
  }
  
  // Boost score for popular locations
  if (isPopular && score > 0) {
    score = Math.min(1.0, score + 0.1);
  }
  
  return score;
}

/**
 * Search for locations by name
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results
 * @param {string} district - Filter by district (optional)
 * @param {string} division - Filter by division (optional)
 * @param {boolean} fuzzy - Enable fuzzy matching (default: true)
 */
export async function searchLocationsService(query, limit = 10, district = null, division = null, fuzzy = true) {
  // Build SQL query
  let sql = `
    SELECT 
      id, name, name_bengali, latitude, longitude, altitude,
      district, division, country, type, population, is_popular
    FROM locations
    WHERE (name LIKE ? OR name_bengali LIKE ?)
  `;
  
  const searchPattern = fuzzy ? `%${query}%` : query;
  const params = [searchPattern, searchPattern];
  
  if (district) {
    sql += ` AND district = ?`;
    params.push(district);
  }
  
  if (division) {
    sql += ` AND division = ?`;
    params.push(division);
  }
  
  // Get more results than needed to calculate relevance scores
  sql += ` ORDER BY is_popular DESC, name ASC LIMIT ?`;
  params.push(Math.min(limit * 3, 150)); // Get up to 3x limit for better scoring
  
  const [results] = await pool.query(sql, params);
  
  // Calculate relevance scores and filter
  const scoredResults = results
    .map(location => {
      const score = calculateRelevanceScore(
        query,
        location.name,
        location.name_bengali,
        location.is_popular === 1,
        fuzzy
      );
      
      return {
        ...location,
        relevance_score: score
      };
    })
    .filter(location => location.relevance_score > 0) // Only include matches
    .sort((a, b) => {
      // Sort by relevance score (descending), then by popularity, then by name
      if (b.relevance_score !== a.relevance_score) {
        return b.relevance_score - a.relevance_score;
      }
      if (b.is_popular !== a.is_popular) {
        return b.is_popular - a.is_popular;
      }
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit) // Limit results
    .map(location => ({
      name: location.name,
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
      district: location.district,
      division: location.division,
      type: location.type,
      ...(location.population && { population: location.population }),
      ...(location.altitude && { altitude: location.altitude }),
      relevance_score: parseFloat(location.relevance_score.toFixed(2))
    }));
  
  return scoredResults;
}
