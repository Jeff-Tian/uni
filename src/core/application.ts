import events = require('events')
import Context from './context'
import Request from './request'
import Response from './response'
import path from 'path'
import grpc, { GrpcObject } from 'grpc'
import * as protoLoader from '@grpc/proto-loader'
import fs from 'fs'

export default class Application extends events.EventEmitter {
  middleware: Array<any>
  env: string
  context: Context
  request: Request
  response: Response

  constructor() {
    super()

    this.middleware = []
    this.env = process.env.NODE_ENV || 'dev'
    this.context = new Context()
    this.request = new Request()
    this.response = new Response()
  }

  listen(...args) {
    const server = new grpc.Server()
    this.buildServices(server)

    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())

    server.start()
  }

  private buildServices(server: grpc.Server) {
    const protoFolder = path.resolve(__dirname, '../proto/')

    const protoFiles = fs.readdirSync(protoFolder)

    protoFiles.map(file => {
      const currentProto = path.resolve(protoFolder, file)
      console.log('current = ', currentProto)
      this.buildService(server, currentProto)
    })
  }

  private buildService(server: grpc.Server, currentProto: string) {
    const packageDef = protoLoader.loadSync(currentProto, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    })

    const packages = grpc.loadPackageDefinition(packageDef)
    for (const packageName in packages) {
      const protoPackage: any = packages[packageName]

      const service: { [key: string]: any } = {}

      for (const rpcService in protoPackage) {
        if (typeof protoPackage[rpcService] !== 'function') {
          continue
        }

        for (const method in protoPackage[rpcService].service) {
          const rpcPath = protoPackage[rpcService].service[method].path

          const controllerFolder = path.resolve(__dirname, '..', 'controller', packageName)
          const serviceImplementation = require(path.resolve(controllerFolder, rpcService)).default

          if (!serviceImplementation[method]) {
            throw new Error(`${currentProto} 中定义的 ${rpcPath} 没有对应的实现！`)
          }
          service[method] = (call, callback) => {
            callback(null, serviceImplementation[method](call.request))
          }
        }

        server.addService(protoPackage[rpcService].service, service)
      }
    }

    console.log('server = ', server)
  }
}
