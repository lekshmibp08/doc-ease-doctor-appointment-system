export interface ICreateOrderUseCase {
  execute(amount: number): Promise<any>;
}
