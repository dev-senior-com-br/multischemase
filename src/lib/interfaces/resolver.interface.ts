export interface IResolver<T, K> {
    resolve(params: K): T;
}