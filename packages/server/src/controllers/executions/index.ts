import { Request, Response, NextFunction } from 'express'
import executionsService from '../../services/executions'
import { ExecutionState } from '../../Interface'

const getAllExecutions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract all possible filters from query params
        const filters: any = {}

        // ID filter
        if (req.query.id) filters.id = req.query.id as string

        // Flow and session filters
        if (req.query.agentflowId) filters.agentflowId = req.query.agentflowId as string
        if (req.query.sessionId) filters.sessionId = req.query.sessionId as string

        // State filter
        if (req.query.state) {
            const stateValue = req.query.state as string
            if (['INPROGRESS', 'FINISHED', 'ERROR', 'TERMINATED', 'TIMEOUT', 'STOPPED'].includes(stateValue)) {
                filters.state = stateValue as ExecutionState
            }
        }

        // Date filters
        if (req.query.startDate) {
            filters.startDate = new Date(req.query.startDate as string)
        }

        if (req.query.endDate) {
            filters.endDate = new Date(req.query.endDate as string)
        }

        // Pagination
        if (req.query.page) {
            filters.page = parseInt(req.query.page as string, 10)
        }

        if (req.query.limit) {
            filters.limit = parseInt(req.query.limit as string, 10)
        }

        const apiResponse = await executionsService.getAllExecutions(filters)

        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    getAllExecutions
}
