import prisma from '../config/prisma.js'

export const applyForJob = async (req, res) => {
  try {
    const { id: jobId } = req.params
    const userId = req.user.id
    const { coverLetter, resumeUrl } = req.body

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) return res.status(404).json({ message: 'Job not found' })
    if (job.status !== 'active') return res.status(400).json({ message: 'Job is not accepting applications' })

    const existing = await prisma.application.findUnique({
      where: { jobId_userId: { jobId, userId } },
    })
    if (existing) return res.status(400).json({ message: 'Already applied for this job' })

    const application = await prisma.application.create({
      data: { jobId, userId, coverLetter, resumeUrl },
    })
    res.status(201).json(application)
  } catch (err) {
    res.status(500).json({ message: 'Failed to apply', error: err.message })
  }
}

export const getMyApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: { job: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(applications)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications', error: err.message })
  }
}

export const getAllApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        job: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(applications)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications', error: err.message })
  }
}