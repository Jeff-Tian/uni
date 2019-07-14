export default class Context {
  public throw(...args) {
    throw createError(...args)
  }

  public onerror
}

interface GRPCError extends Error {
  status: number
  statusCode: number
  [key: string]: any
}

type CreateError = (...args: Array<Error | string | number | { [key: string]: any }>) => GRPCError

declare const createError: CreateError
