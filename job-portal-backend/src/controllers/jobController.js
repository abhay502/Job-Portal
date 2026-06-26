import prisma from '../config/prisma.js'

export const getJobs = async (req, res) => {
  try {
    const {
      page = 1, limit = 10, search, category,
      experienceLevel, jobType, status, sort,
      salaryMin, salaryMax,
    } = req.query

    const where = {}
    if (status) where.status = status
    if (category) where.category = category
    if (experienceLevel) where.experienceLevel = experienceLevel
    if (jobType) where.jobType = jobType
    if (salaryMin) where.salaryMin = { gte: Number(salaryMin) }
    if (salaryMax) where.salaryMax = { lte: Number(salaryMax) }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    const orderBy =
      sort === 'oldest' ? { createdAt: 'asc' }
      : sort === 'salary_desc' ? { salaryMax: 'desc' }
      : sort === 'salary_asc' ? { salaryMin: 'asc' }
      : { createdAt: 'desc' }

    const skip = (Number(page) - 1) * Number(limit)
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where, orderBy, skip, take: Number(limit),
        include: { _count: { select: { applications: true } } },
      }),
      prisma.job.count({ where }),
    ])

    res.json({ jobs, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message })
  }
}

export const getJobById = async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { applications: true } } },
    })
    if (!job) return res.status(404).json({ message: 'Job not found' })
    res.json(job)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch job', error: err.message })
  }
}

export const createJob = async (req, res) => {
  try {
    const job = await prisma.job.create({ data: req.body })
    res.status(201).json(job)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create job', error: err.message })
  }
}

export const updateJob = async (req, res) => {
  try {
    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(job)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update job', error: err.message })
  }
}

export const deleteJob = async (req, res) => {
  try {
    await prisma.job.delete({ where: { id: req.params.id } })
    res.json({ message: 'Job deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete job', error: err.message })
  }
}