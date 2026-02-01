import { searchLocationsService } from '../services/locationsService.js';

/**
 * Search for locations
 */
export async function searchLocations(req, res, next) {
  try {
    const query = req.query.query;
    const limit = parseInt(req.query.limit) || 10;
    const district = req.query.district;
    const division = req.query.division;
    const fuzzy = req.query.fuzzy !== 'false'; // Default to true
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: {
          code: 'EMPTY_QUERY',
          message: 'Query parameter is required and cannot be empty',
          details: {
            parameter: 'query'
          },
          request_id: req.id
        }
      });
    }
    
    if (limit < 1 || limit > 50) {
      return res.status(400).json({
        error: {
          code: 'INVALID_LIMIT',
          message: 'Limit must be between 1 and 50',
          details: {
            parameter: 'limit',
            value: limit,
            valid_range: [1, 50]
          },
          request_id: req.id
        }
      });
    }
    
    const results = await searchLocationsService(query.trim(), limit, district, division, fuzzy);
    
    res.json({
      query: query.trim(),
      total_results: results.length,
      results: results,
      request_id: req.id
    });
    
  } catch (error) {
    next(error);
  }
}
