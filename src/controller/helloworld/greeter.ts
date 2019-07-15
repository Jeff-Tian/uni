export default class Greeter {
  static SayHello({ name }: { name: string }): { message: string } {
    return { message: 'hello ' + name }
  }

  static SayHelloAgain({ name }: { name: string }): { message: string } {
    console.log('calling by ', name)
    return { message: 'hello ' + name }
  }
}
