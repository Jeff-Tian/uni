import Uni from '../../core/application'
import GrpcClient from 'grpc-man/lib/Client'
import assert = require('assert')

describe('app', () => {
  it('should start', async () => {
    const app = new Uni()
    app.listen()

    const client = new GrpcClient('0.0.0.0:50051', __dirname + '/../../proto/helloworld.proto')

    const res = await client.grpc.helloworld.Greeter.sayHello({ name: 'name' })
    assert.deepEqual(res, { message: 'hello name' })

    const res2 = await client.grpc.helloworld.Greeter.sayHelloAgain({ name: 'test' })
    assert.deepEqual(res2, { message: 'hello test' })
  })
})
