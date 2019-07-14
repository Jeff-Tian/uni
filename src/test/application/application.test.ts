import Uni from '../../core/application'
import GrpcClient from 'grpc-man/lib/Client'
import assert = require('assert')

describe('app', () => {
  it('should start', async () => {
    const app = new Uni()
    app.listen()

    const client = new GrpcClient('0.0.0.0:50051', __dirname + '/../../proto/helloworld.proto')

    console.log('sayHello = ', client.grpc.helloworld.Greeter.sayHello)
    const res = await client.grpc.helloworld.Greeter.sayHello({ name: 'name' })
    assert.deepEqual(res, { message: 'hello name' })
  })
})
