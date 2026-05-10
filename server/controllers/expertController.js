const Expert = require('../models/Expert');

exports.getExperts = async (req, res, next) => {
  try {
    const { page = 1, limit = 6, category, search } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const total = await Expert.countDocuments(filter);
    
    const experts = await Expert.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      experts,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
};

exports.getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      const error = new Error('Expert not found');
      error.status = 404;
      throw error;
    }
    
    res.json({
      success: true,
      expert
    });
  } catch (error) {
    next(error);
  }
};
