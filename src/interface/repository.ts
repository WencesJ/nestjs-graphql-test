export interface IRepository<T> {
  //you can add more generic methods like findAll, findOne
  create(t: T): Promise<T>;
  findOne(t: T): Promise<T | null>;
}
