import { getMethodsService } from '../services/methodsService.js';

/**
 * Get available calculation methods
 */
export async function getMethods(req, res, next) {
  try {
    const result = await getMethodsService();
    
    res.json({
      methods: result.methods,
      total_methods: result.methods.length,
      custom_options: result.custom_options,
      request_id: req.id
    });
    
  } catch (error) {
    next(error);
  }
}
