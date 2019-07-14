import events = require('events')
import Context from './context'
import Request from './request'
import Response from './response'
import path from 'path'
import grpc, { GrpcObject } from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

console.log('proto = ', protoLoader)
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
    const packageDef = protoLoader.loadSync(path.resolve(__dirname, '../proto/helloworld.proto'), {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    })
    const helloProto: any = grpc.loadPackageDefinition(packageDef).helloworld
    server.addService(helloProto.Greeter.service, {
      sayHello: (call, callback) => {
        console.log('calling from xxx', call.request.name)
        callback(null, { message: 'hello ' + call.request.name })
      },
    })
    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())

    server.start()
  }
}