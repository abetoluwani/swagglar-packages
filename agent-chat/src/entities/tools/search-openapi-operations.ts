import type { OpenAPIV3_1 } from '@swagglar/openapi-types'
import { object, string, type Static } from '@swagglar/validation'

export const SEARCH_OPENAPI_OPERATIONS_TOOL_NAME = 'search-openapi-operations' as const

export const searchOpenAPIOperationsInputSchema = object({
  question: string(),
})

export type SearchOpenAPIOperationsToolInput = Static<typeof searchOpenAPIOperationsInputSchema>

export type SearchOpenAPIOperationsToolOutput = Partial<OpenAPIV3_1.Document>[]
