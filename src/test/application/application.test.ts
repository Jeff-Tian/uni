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

    const res3 = await client.grpc.helloworld.Greeter.sayHello2({ name: '2' })
    assert.deepEqual(res3, { message: 'hello 2' })

    const client2 = new GrpcClient('0.0.0.0:50051', __dirname + '/../../proto/helloworld2.proto')

    const res4 = await client2.grpc.helloworld2.Greeter.sayHello({ name: 'hello 2' })
    assert.deepEqual(res4, { message: 'hello hello 2' })
  })
})
