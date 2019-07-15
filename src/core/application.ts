import events = require('events')
import Context from './context'
import Request from './request'
import Response from './response'
import path from 'path'
import grpc, { GrpcObject } from 'grpc'
import * as protoLoader from '@grpc/proto-loader'
import Greeter from '../controller/helloworld/greeter'

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
    const currentProto = path.resolve(__dirname, '../proto/helloworld.proto')
    const packageDef = protoLoader.loadSync(currentProto, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    })
    const helloProto: any = grpc.loadPackageDefinition(packageDef).helloworld

    const service: { [key: string]: any } = {}
    for (const method in helloProto.Greeter.service) {
      console.log('adding ', method)

      if (!Greeter[method]) {
        throw new Error(`${currentProto} 中定义的 ${method} 没有对应的实现！`)
      }

      service[method] = (call, callback) => {
        callback(null, Greeter[method](call.request))
      }
    }

    server.addService(helloProto.Greeter.service, service)
    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())

    server.start()
  }
}
