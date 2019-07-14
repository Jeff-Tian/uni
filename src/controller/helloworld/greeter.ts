export default class Greeter {
  static SayHello({ name }: { name: string }): { message: string } {
    return { message: 'hello ' + name }
  }
}
