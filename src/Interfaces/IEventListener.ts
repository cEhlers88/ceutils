export default interface IEventListener {
  eventName: string;
  callbacks: CallableFunction[];
}
